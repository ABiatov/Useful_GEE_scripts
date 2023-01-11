# US Lithology 90m
# https://developers.google.com/earth-engine/datasets/catalog/CSP_ERGo_1_0_US_lithology

import ee
from ee_plugin import Map

lithologyVis = {
  "min": 0.0,
  "max": 20.0,
  "palette": [
    '356EFF', 'ACB6DA', 'D6B879', '313131', 'EDA800', '616161', 'D6D6D6',
    'D0DDAE', 'B8D279', 'D5D378', '141414', '6DB155', '9B6D55', 'FEEEC9',
    'D6B879', '00B7EC', 'FFDA90', 'F8B28C'
  ],
};

ds_US_Lithology = ee.Image('CSP/ERGo/1_0/US/lithology');
US_Lithology = ds_US_Lithology.select('b1');
Map.addLayer(US_Lithology, lithologyVis, 'US_Lithology_90m');


# filter Alluvium and coastal sediment fine and water reservoir 
ds_alluvium  = US_Lithology.eq(19).Or(lithology.eq(0));
alluviumVis = {
  "min": 0.0,
  "max": 1.0,
  "palette": ['a5a5a5', 'fe6f00'],
};
Map.addLayer(ds_alluvium, alluviumVis, 'Alluvium and coastal sediment fine 90m');


