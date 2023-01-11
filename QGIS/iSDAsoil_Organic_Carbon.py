# iSDAsoil Organic Carbon
# https://developers.google.com/earth-engine/datasets/catalog/ISDASOIL_Africa_v1_carbon_organic

# Organic carbon at soil depths of 0-20 cm and 20-50 cm, predicted mean and standard deviation.

# Pixel values must be back-transformed with exp(x/10)-1.

import ee
from ee_plugin import Map

iSDAsoil_OC_raw = ee.Image("ISDASOIL/Africa/v1/carbon_organic");

iSDAsoil_OC_converted = iSDAsoil_OC_raw.divide(10).exp().subtract(1);

iSDAsoil_OC_vis = {
    "min": 0, 
    "max": 10, 
   # "palette": ['3288bd', '99d594', 'e6f598', 'fee08b', 'fc8d59', 'd53e4f']
    "palette": ['000004', '3b0f6f', '8c2981', 'de4969', 'fe9f6d', 'fcfdbf'] #Magma
    }

Map.addLayer(iSDAsoil_OC_converted.select(0), iSDAsoil_OC_vis, "Carbon, organic, mean, 0-20 cm");

# Map.addLayer(iSDAsoil_OC_converted.select(1), iSDAsoil_OC_vis, "Carbon, organic, mean, 20-50 cm");

