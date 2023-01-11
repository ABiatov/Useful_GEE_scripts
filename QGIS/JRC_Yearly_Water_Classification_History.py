#  JRC Yearly Water Classification History, v1.4
# https://developers.google.com/earth-engine/datasets/catalog/JRC_GSW1_4_YearlyHistory

# This dataset contains maps of the location and temporal distribution of surface water from 1984 to 2021 and provides statistics on the extent and change of those water surfaces. For more information see the associated journal article: High-resolution mapping of global surface water and its long-term changes (Nature, 2016) and the online Data Users Guide.
"""
0 	cccccc 	No data
1 	ffffff 	Not water
2 	99d9ea 	Seasonal water
3 	0000ff 	Permanent water
"""

import ee
from ee_plugin import Map

YearlyWater_ds = ee.ImageCollection('JRC/GSW1_4/YearlyHistory');


YearlyWater_vis = {
    "bands": ['waterClass'],
    "min": 0,
    "max": 3,
    "palette": ['cccccc', 'ffffff', '99d9ea', '0000ff']
#    "palette": ["d29642","eec764","b4ee87","32eeeb","0c78ee","2601b7", "083371" ]
#    "palette": ['30123b', '4686fb', '1ae5b6', 'a4fc3c', 'fbb938', 'e4440a', '7a0403'] # Turbo
#    "palette": ['7a0403', 'e4440a', 'fbb938', 'a4fc3c', '1ae5b6', '4686fb', '30123b'] # Turbo inverted
#    "palette": ['d7191c', 'f17c4a', 'fec980', 'ffffbf', 'c7e9ad', '80bfac', '2b83ba'] # Spectral
#    "palette": ['2b83ba', '80bfac', 'c7e9ad', 'ffffbf', 'fec980', 'f17c4a', 'd7191c'] # Spectral inverted
#    "palette": ['253294', '2a70b1', '38a0bf', '67c5be', 'b4e2b9', 'ffffcc'] # YlGnBu
#    "palette": ['440154', '404387', '29788e', '22a884', '7ad251', 'fde725'] # Viridis
#    "palette": ['000004', '3b0f6f', '8c2981', 'de4969', 'fe9f6d', 'fcfdbf'] #Magma
    }

Map.addLayer(YearlyWater_ds, YearlyWater_vis, 'Water Class');


