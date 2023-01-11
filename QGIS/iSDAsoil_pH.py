# iSDAsoil pH
# https://developers.google.com/earth-engine/datasets/catalog/ISDASOIL_Africa_v1_ph

# pH at soil depths of 0-20 cm and 20-50 cm, predicted mean and standard deviation.

# Pixel values must be back-transformed with x/10.

import ee
from ee_plugin import Map

iSDAsoil_pH_raw = ee.Image("ISDASOIL/Africa/v1/ph");

iSDAsoil_pH_converted = iSDAsoil_pH_raw.divide(10);

iSDAsoil_pH_vis = {
    "min": 5, 
    "max": 9,
#    "palette": ['30123b', '4686fb', '1ae5b6', 'a4fc3c', 'fbb938', 'e4440a', '7a0403'] # Turbo
    "palette": ['7a0403', 'e4440a', 'fbb938', 'a4fc3c', '1ae5b6', '4686fb', '30123b'] # Turbo inverted
#    "palette": ['253294', '2a70b1', '38a0bf', '67c5be', 'b4e2b9', 'ffffcc'] # YlGnBu
#    "palette": ['440154', '404387', '29788e', '22a884', '7ad251', 'fde725'] # Viridis
#    "palette": ['000004', '3b0f6f', '8c2981', 'de4969', 'fe9f6d', 'fcfdbf'] #Magma
    }

Map.addLayer(iSDAsoil_pH_converted.select(0), iSDAsoil_pH_vis, "pH, mean, 0-20 cm");

# Map.addLayer(iSDAsoil_pH_converted.select(1), iSDAsoil_pH_vis, "pH, mean, 20-50 cm");

