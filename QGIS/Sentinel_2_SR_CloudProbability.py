# Sentinel-2: Cloud Probability
# https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_CLOUD_PROBABILITY

import ee
from ee_plugin import Map

s2Sr = ee.ImageCollection('COPERNICUS/S2_SR')
s2Clouds = ee.ImageCollection('COPERNICUS/S2_CLOUD_PROBABILITY')

START_DATE = ee.Date('2021-05-01')
END_DATE = ee.Date('2021-07-01')
MAX_CLOUD_PROBABILITY = 65

def maskClouds(img):
    clouds = ee.Image(img.get('cloud_mask')).select('probability')
    isNotCloud = clouds.lt(MAX_CLOUD_PROBABILITY)
    return img.updateMask(isNotCloud)


# The masks for the 10m bands sometimes do not exclude bad data at
# scene edges, so we apply masks from the 20m and 60m bands as well.
# Example asset that needs this operation:
# COPERNICUS/S2_CLOUD_PROBABILITY/20190301T000239_20190301T000238_T55GDP
def maskEdges(s2_img):
    return s2_img.updateMask(s2_img.select('B8A').mask().updateMask(s2_img.select('B9').mask()))


# Filter input collections by desired data range and region.
criteria = ee.Filter.And(ee.Filter.date(START_DATE, END_DATE))
s2Sr = s2Sr.filter(criteria).map(maskEdges)
s2Clouds = s2Clouds.filter(criteria)

# Join S2 SR with cloud probability dataset to add cloud mask.
s2SrWithCloudMask = ee.Join.saveFirst('cloud_mask').apply({
  "primary": s2Sr,
  "secondary": s2Clouds,
  "condition": ee.Filter.equals({"leftField": 'system:index', "rightField": 'system:index'})
})

s2CloudMasked = ee.ImageCollection(s2SrWithCloudMask).map(maskClouds).median()
rgbVis = {"min": 0, "max": 3000, "bands": ['B4', 'B3', 'B2']}

Map.addLayer(s2CloudMasked, rgbVis, 'S2 SR masked at ' + str(MAX_CLOUD_PROBABILITY) + '%')




