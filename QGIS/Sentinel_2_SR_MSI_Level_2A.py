# Sentinel-2 MSI: MultiSpectral Instrument, Level-2A
# https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_SR

import ee
from ee_plugin import Map

# Define the time range
start_date = ee.Date('2022-05-01')
end_date = ee.Date('2022-07-01')

# Load Sentinel-2 imagery
sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR') \
    .filterDate(start_date, end_date) \
    .median()

Map.addLayer(sentinel2, {'bands': ['B4', 'B3', 'B2'], 'min': 2000, 'max': 4000}, 'Sentinel-2_432')

Map.addLayer(sentinel2, {'bands': ['B4', 'B8', 'B3'], 'min': 2000, 'max': 4000}, 'Sentinel-2_482')

Map.addLayer(sentinel2, {'bands': ['B8', 'B4', 'B3'], 'min': 2000, 'max': 4000}, 'Sentinel-2_843')


