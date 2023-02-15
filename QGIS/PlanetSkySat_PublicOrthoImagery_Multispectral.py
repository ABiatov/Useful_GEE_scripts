# Planet SkySat Public Ortho Imagery, Multispectral
# https://developers.google.com/earth-engine/datasets/catalog/SKYSAT_GEN-A_PUBLIC_ORTHO_MULTISPECTRAL

import ee
from ee_plugin import Map

planet_multispectral_ds = ee.ImageCollection('SKYSAT/GEN-A/PUBLIC/ORTHO/MULTISPECTRAL');
Planet_MS_falseColor = planet_multispectral_ds.select(['N', 'G', 'B']);
Planet_MS_falseColorVis = {
  "min": 200.0,
  "max": 6000.0,
};

Map.addLayer(Planet_MS_falseColor, Planet_MS_falseColorVis, 'Planet False Color');

