/* ═══════════════════════════════════════════════════════════
   AURA PIXELS — WebGL shader backdrop (booking section)
   Vanilla port of the React <WebGLShader/> component:
   raw GLSL light-wave shader, tinted to the brand gold.
   Renders only while the section is on screen; skipped
   entirely for reduced-motion users or if WebGL fails.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var canvas = document.getElementById('bookShader');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof THREE === 'undefined') return;

  var host = canvas.parentElement;
  var renderer = null, scene, camera, uniforms, mesh;
  var animationId = null, running = false;

  var vertexShader = [
    'attribute vec3 position;',
    'void main() {',
    '  gl_Position = vec4(position, 1.0);',
    '}'
  ].join('\n');

  var fragmentShader = [
    'precision highp float;',
    'uniform vec2 resolution;',
    'uniform float time;',
    'uniform float xScale;',
    'uniform float yScale;',
    'uniform float distortion;',
    'void main() {',
    '  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);',
    '  float d = length(p) * distortion;',
    '  float rx = p.x * (1.0 + d);',
    '  float gx = p.x;',
    '  float bx = p.x * (1.0 - d);',
    // band lifted above centre so it stays visible behind the section intro
    // (the form card below is opaque and would swallow a centred band)
    '  float py = p.y - 0.4;',
    '  float r = 0.05 / abs(py + sin((rx + time) * xScale) * yScale);',
    '  float g = 0.05 / abs(py + sin((gx + time) * xScale) * yScale);',
    '  float b = 0.05 / abs(py + sin((bx + time) * xScale) * yScale);',
    // brand tint: pull the chromatic streaks toward warm gold (#C9A227)
    '  vec3 c = vec3(r, g, b) * vec3(1.0, 0.84, 0.38);',
    '  gl_FragColor = vec4(c, 1.0);',
    '}'
  ].join('\n');

  function handleResize() {
    if (!renderer || !uniforms) return;
    var w = host.offsetWidth;
    var h = host.offsetHeight;
    renderer.setSize(w, h, false);
    uniforms.resolution.value = [
      renderer.domElement.width,
      renderer.domElement.height
    ];
  }

  function initScene() {
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas });
    } catch (e) {
      canvas.style.display = 'none';
      return false;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(new THREE.Color(0x0B0B0B));

    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);

    uniforms = {
      resolution: { value: [1, 1] },
      time: { value: 0.0 },
      xScale: { value: 1.0 },
      yScale: { value: 0.5 },
      distortion: { value: 0.05 }
    };

    var position = [
      -1.0, -1.0, 0.0,
       1.0, -1.0, 0.0,
      -1.0,  1.0, 0.0,
       1.0, -1.0, 0.0,
      -1.0,  1.0, 0.0,
       1.0,  1.0, 0.0
    ];
    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(position), 3));

    var material = new THREE.RawShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: uniforms,
      side: THREE.DoubleSide
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return true;
  }

  function animate() {
    uniforms.time.value += 0.01;
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  }

  // Render only while visible — a wedding site shouldn't burn GPU offscreen
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        if (!renderer && initScene() === false) { io.disconnect(); return; }
        if (!running && renderer) { running = true; animate(); }
      } else if (running) {
        running = false;
        cancelAnimationFrame(animationId);
      }
    });
  }, { rootMargin: '120px' });

  io.observe(host);
})();
