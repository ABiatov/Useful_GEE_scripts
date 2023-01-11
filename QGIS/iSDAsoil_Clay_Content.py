# iSDAsoil Clay Content
# https://developers.google.com/earth-engine/datasets/catalog/ISDASOIL_Africa_v1_clay_content

# Clay content at soil depths of 0-20 cm and 20-50 cm,\npredicted mean and standard deviation. In areas of dense jungle (generally over central Africa), model accuracy is low and therefore artifacts such as banding (striping) might be seen.n.

# Pixel values must be back-transformed with exp(x/10)-1.

import ee
from ee_plugin import Map

iSDAsoil_CC_raw = ee.Image("ISDASOIL/Africa/v1/clay_content");

iSDAsoil_CC_converted = iSDAsoil_CC_raw.divide(10).exp().subtract(1);

iSDAsoil_CC_vis = {
    "min": 0, 
    "max": 20, 
    "palette": ['081d58', '225ea8', '41b6c4', 'c7e9b4', 'edf8b1', 'ffffd9']
#    "palette": ['000004', '3b0f6f', '8c2981', 'de4969', 'fe9f6d', 'fcfdbf'] #Magma
    }

Map.addLayer(iSDAsoil_CC_converted.select(0), iSDAsoil_CC_vis, "Clay content, mean, 0-20 cm");

# Map.addLayer(iSDAsoil_OC_converted.select(1), iSDAsoil_OC_vis, "Clay content, mean, 20-50 cm");

