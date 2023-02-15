# Planet SkySat Public Ortho Imagery, RGB
# https://developers.google.com/earth-engine/datasets/catalog/SKYSAT_GEN-A_PUBLIC_ORTHO_RGB

import ee
from ee_plugin import Map

PlanetRGB_ds = ee.ImageCollection('SKYSAT/GEN-A/PUBLIC/ORTHO/RGB');
PlanetRGB_rgb = PlanetRGB_ds.select(['R', 'G', 'B']);
PlanetRGB_rgbVis = {
  "min": 11.0,
  "max": 190.0,
};

Map.addLayer(PlanetRGB_rgb, PlanetRGB_rgbVis, 'Planet_RGB');





