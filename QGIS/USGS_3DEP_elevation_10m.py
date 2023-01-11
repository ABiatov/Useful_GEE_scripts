#  USGS 3DEP 10m National Map Seamless (1/3 Arc-Second)
# https://developers.google.com/earth-engine/datasets/catalog/USGS_3DEP_10m#bands

import ee
from ee_plugin import Map

ds_USGS_3DEP_10m = ee.Image('USGS/3DEP/10m')
USGS_3DEP_10m_elevation = ds_USGS_3DEP_10m.select('elevation');

elevationVis = {
  "min": -50.0,
  "max": 3000.0,
#  "palette": ['011de2', 'afafaf', '3603ff', 'fff477', 'b42109'],
  "palette": [ '3ae237', 'b5e22e', 'd6e21f', 'fff705', 'ffd611', 'ffb613', 'ff8b13',  'ff6e08', 'ff500d', 'ff0000', 'de0101', 'c21301', '0602ff', '235cb1',  '307ef3', '269db1', '30c8e2', '32d3ef', '3be285', '3ff38f', '86e26f']
#  "gamma": 3.5,
};

Map.addLayer(USGS_3DEP_10m_elevation, elevationVis, 'USGS_3DEP_elevation 10m');

# Slope calculation
USGS_3DEP_10m_slope = ee.Terrain.slope(USGS_3DEP_10m_elevation);
Map.addLayer(USGS_3DEP_10m_slope, {"min": 0, "max": 10}, 'USGS_3DEP slope 10m');

