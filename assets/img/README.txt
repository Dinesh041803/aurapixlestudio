AURA PIXELS STUDIO — photo slots
================================

Drop your optimized photos in this folder with these exact names
and the site picks them up automatically (after Claude rewires the
URLs, or you edit index.html yourself).

SLOT NAME            WHERE IT APPEARS                    BEST SHAPE
-----------------    --------------------------------    -----------
hero.jpg             Full-screen hero (first thing        landscape or
                     visitors see — your best frame)      tall portrait

portfolio-01.jpg     "The Bride" — bride portrait         portrait
portfolio-02.jpg     "Turmeric Blessings" — haldi         any
portfolio-03.jpg     "The Muhurtham" — garland exchange   any
portfolio-04.jpg     "Nalangu" — ritual detail            any
portfolio-05.jpg     "Backwaters" — drone/aerial shot     landscape
portfolio-06.jpg     "The Thaali" — thaali close-up       any
portfolio-07.jpg     "Henna Study" — mehendi detail       any
portfolio-08.jpg     "Midnight Machine" — car/bike        landscape
portfolio-09.jpg     "The Nischayam" — couple             any
portfolio-10.jpg     "Petals & Laughter" — candid         any
portfolio-11.jpg     "Marina Morning" — pre-wedding       any
portfolio-12.jpg     "Silk on the Oonjal" — fashion       portrait

film-01.jpg          Wedding film poster                  landscape 16:10
film-02.jpg          Haldi reel poster                    landscape 16:10
film-03.jpg          Aerial reel poster                   landscape 16:10

service-01.jpg       Hover preview: Weddings              landscape
service-02.jpg       Hover preview: Pre-Wedding           landscape
service-03.jpg       Hover preview: Maternity             landscape
service-04.jpg       Hover preview: Birthdays             landscape
service-05.jpg       Hover preview: Fashion               landscape
service-06.jpg       Hover preview: Automotive            landscape
service-07.jpg       Hover preview: Product               landscape
service-08.jpg       Hover preview: Drone                 landscape

Don't have a shot for a slot? Leave it — the current stock image
stays until you replace it. Captions/labels can be changed too;
they live in index.html.

To optimize camera originals first (they're too big for the web):
    python tools/optimize_photos.py "C:\path\to\your\photos"
