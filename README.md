# Coastal Barn Quilts (Sandbox)

Sandbox recreation of the Arts Council of Calvert County site, not affiliated with the real organization.

## Structure

```
index.html              Homepage (must stay at project root for static hosting)
pages/                  Secondary pages
  barn-quilt-trail.html
css/
  styles.css            Shared stylesheet for all pages
js/
  barn-quilt-map.js     Google Maps logic for the trail page
data/
  quilts.json           Barn quilt trail stops (name, location, description)
config/
  config.js             Local Google Maps API key (gitignored, not committed)
  config.example.js      Template — copy to config.js and add your own key
assets/
  images/                Place future photos/graphics here
```

## Setup

Copy `config/config.example.js` to `config/config.js` and add your Google Maps API key before opening `pages/barn-quilt-trail.html`.

## Adding a new page

1. Add the `.html` file to `pages/`.
2. Link its stylesheet as `../css/styles.css` and any shared scripts as `../js/...` (paths are relative to `pages/`).
3. Add nav/footer links to it from `index.html` (as `pages/your-page.html`) and from other pages in `pages/` (as `your-page.html`).
