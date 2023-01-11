# US NED mTPI (Multi-Scale Topographic Position Index)
# https://developers.google.com/earth-engine/datasets/catalog/CSP_ERGo_1_0_US_mTPI

import ee
from ee_plugin import Map

ds_usMtpi = ee.Image('CSP/ERGo/1_0/US/mTPI');
usMtpi = ds_usMtpi.select('elevation');
usMtpiVis = {
  "min": -100.0,
  "max": 100.0,
  "palette": ['0b1eff', '4be450', 'fffca4', 'ffa011', 'ff0000'],
};
Map.addLayer(usMtpi, usMtpiVis, 'US_mTPI_270m');

