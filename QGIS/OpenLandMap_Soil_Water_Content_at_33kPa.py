# OpenLandMap Soil Water Content at 33kPa (Field Capacity)
# https://developers.google.com/earth-engine/datasets/catalog/OpenLandMap_SOL_SOL_WATERCONTENT-33KPA_USDA-4B1C_M_v01

# Soil water content (volumetric %) for 33kPa and 1500kPa suctions predicted at 6 standard depths (0, 10, 30, 60, 100 and 200 cm) at 250 m resolution. Units %.
"""
b0 - Soil water content at 33kPa (field capacity) at 0 cm depth
b10 - Soil water content at 33kPa (field capacity) at 10 cm depth
b30 - Soil water content at 33kPa (field capacity) at 30 cm depth
b60 - Soil water content at 33kPa (field capacity) at 60 cm depth
b100 - Soil water content at 33kPa (field capacity) at 100 cm depth
b200 - Soil water content at 33kPa (field capacity) at 200 cm depth
"""

import ee
from ee_plugin import Map

SOL_WATERCONTENT_33KPA_raw = ee.Image("OpenLandMap/SOL/SOL_WATERCONTENT-33KPA_USDA-4B1C_M/v01");


SOL_WATERCONTENT_33KPA_vis = {
    "min": 0,
    "max": 40,
#    "palette": ["d29642","eec764","b4ee87","32eeeb","0c78ee","2601b7", "083371" ]
#    "palette": ['30123b', '4686fb', '1ae5b6', 'a4fc3c', 'fbb938', 'e4440a', '7a0403'] # Turbo
#    "palette": ['7a0403', 'e4440a', 'fbb938', 'a4fc3c', '1ae5b6', '4686fb', '30123b'] # Turbo inverted
    "palette": ['d7191c', 'f17c4a', 'fec980', 'ffffbf', 'c7e9ad', '80bfac', '2b83ba'] # Spectral
#    "palette": ['2b83ba', '80bfac', 'c7e9ad', 'ffffbf', 'fec980', 'f17c4a', 'd7191c'] # Spectral inverted
#    "palette": ['253294', '2a70b1', '38a0bf', '67c5be', 'b4e2b9', 'ffffcc'] # YlGnBu
#    "palette": ['440154', '404387', '29788e', '22a884', '7ad251', 'fde725'] # Viridis
#    "palette": ['000004', '3b0f6f', '8c2981', 'de4969', 'fe9f6d', 'fcfdbf'] #Magma
    }

Map.addLayer(SOL_WATERCONTENT_33KPA_raw.select('b10'), SOL_WATERCONTENT_33KPA_vis, "Soil water content at 33kPa (field capacity) at 10 cm depth");


