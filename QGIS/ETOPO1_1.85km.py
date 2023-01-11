# ETOPO1: Global 1 Arc-Minute Elevation 1855 meters 
# https://developers.google.com/earth-engine/datasets/catalog/NOAA_NGDC_ETOPO1

import ee
from ee_plugin import Map

ds_ETOPO1 = ee.Image('NOAA/NGDC/ETOPO1');
ETOPO1_ele = ds_ETOPO1.select('bedrock');
elevationVis = {
  "min": -50.0,
  "max": 3000.0,
#  "palette": ['011de2', 'afafaf', '3603ff', 'fff477', 'b42109'],
  "palette": [ '3ae237', 'b5e22e', 'd6e21f', 'fff705', 'ffd611', 'ffb613', 'ff8b13',  'ff6e08', 'ff500d', 'ff0000', 'de0101', 'c21301', '0602ff', '235cb1',  '307ef3', '269db1', '30c8e2', '32d3ef', '3be285', '3ff38f', '86e26f']
#  "gamma": 3.5,
};
Map.addLayer(ETOPO1_ele, elevationVis, 'ETOPO1_elevation 1,85km');

# Slope caculation
ETOPO_slope = ee.Terrain.slope(ETOPO1_ele);
Map.addLayer(ETOPO_slope, {"min": 0, "max": 10}, 'ETOPO_slope_2km');



