# iSDAsoil Total Nitrogen
# https://developers.google.com/earth-engine/datasets/catalog/ISDASOIL_Africa_v1_nitrogen_total

# Clay content at soil depths of 0-20 cm and 20-50 cm,\npredicted mean and standard deviation. In areas of dense jungle (generally over central Africa), model accuracy is low and therefore artifacts such as banding (striping) might be seen.n.

# Pixel values must be back-transformed with exp(x/10)-1.

import ee
from ee_plugin import Map

iSDAsoil_Nitrogen_raw = ee.Image("ISDASOIL/Africa/v1/nitrogen_total");

iSDAsoil_Nitrogen_converted = iSDAsoil_Nitrogen_raw.divide(100).exp().subtract(1);

iSDAsoil_Nitrogen_vis = {
    "min": 0.5, 
    "max": 1.5,
    "palette": ['253294', '2a70b1', '38a0bf', '67c5be', 'b4e2b9', 'ffffcc'] # YlGnBu
#    "palette": ['440154', '404387', '29788e', '22a884', '7ad251', 'fde725'] # Viridis
#    "palette": ['000004', '3b0f6f', '8c2981', 'de4969', 'fe9f6d', 'fcfdbf'] #Magma
    }

Map.addLayer(iSDAsoil_Nitrogen_converted.select(0), iSDAsoil_Nitrogen_vis, "Total Nitrogen, mean, 0-20 cm");

# Map.addLayer(iSDAsoil_Nitrogen_converted.select(1), iSDAsoil_Nitrogen_vis, "Total Nitrogen, mean, 20-50 cm");

