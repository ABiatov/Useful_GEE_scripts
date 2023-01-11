# US NED Landforms 10m
# https://developers.google.com/earth-engine/datasets/catalog/CSP_ERGo_1_0_US_landforms#bands

import ee
from ee_plugin import Map

landformsVis = {
  "min": 11.0,
  "max": 42.0,
  "palette": [
    '141414', '383838', '808080', 'EBEB8F', 'F7D311', 'AA0000', 'D89382',
    'DDC9C9', 'DCCDCE', '1C6330', '68AA63', 'B5C98E', 'E1F0E5', 'a975ba',
    '6f198c'
  ],
};

ds_NED_Landforms = ee.Image('CSP/ERGo/1_0/US/landforms');
NED_Landforms = ds_NED_Landforms.select('constant');
Map.addLayer(NED_Landforms, landformsVis, 'NED_Landforms_10m');


