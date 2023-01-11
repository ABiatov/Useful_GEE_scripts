# US Physiography 90 meters
# https://developers.google.com/earth-engine/datasets/catalog/CSP_ERGo_1_0_US_physiography

import ee
from ee_plugin import Map

ds_US_Physiography = ee.Image('CSP/ERGo/1_0/US/physiography');
US_Pphysiography = ds_US_Physiography.select('constant');
physiographyVis = {
  "min": 1100.0,
  "max": 4220.0,
};
Map.addLayer(US_Pphysiography, physiographyVis, 'US_Physiography_90m', false);



