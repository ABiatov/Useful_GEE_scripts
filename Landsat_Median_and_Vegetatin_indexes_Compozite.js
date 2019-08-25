/*

// Result raster
// Band 1* - Blue
// Band 2* - Green
// Band 3* - Red
// Band 4* - Near Infrared (NIR)
// Band 5* - Shortwave Infrared (SWIR) 1
// Band 6* - Shortwave Infrared (SWIR) 2

// Normalized Difference Vegetation Index (NDVI):
NDVI: (NIR - Red)/(NIR + Red)
b7 = NDVI*1000
// Enhanced Vegetation Index (EVI)
EVI: 2.5 * ((NIR – Red) / (NIR + 6 * Red – 7.5 * Blue + 1))
b8 = EVI*1000
EVI_2: (Red - Green) / (Red + [2.4 x Green] + 1)
b9 = (EVI_2+1)*1000
// Soil Adjusted Vegetation Index (SAVI)
SAVI: ((NIR – Red) / (NIR + Red + 0.5)) * (1.5)
b10 = SAVI*1000
// Modified Soil Adjusted Vegetation Index (MSAVI)
MSAVI: (2 * NIR + 1 – sqrt ((2 * NIR + 1)^2 – 8 * (NIR – Red))) / 2
b11 = MSAVI*1000
// Normalized Difference Moisture Index (NDMI)
NDMI: (NIR – SWIR1) / (NIR + SWIR1)
b12 = NDMI*1000
// Normalized Burn Ratio (NBR)
NBR: (NIR - SWIR2) / (NIR + SWIR2)
b13 = NBR*1000
// Normalized Burn Ratio 2 (NBR2)
NBR_2: (SWIR1 – SWIR2) / (SWIR1 + SWIR2)
b14 = NBR_2*1000
// Normalized Difference Water Index (NDWI)
NDWI: (Green – NIR) / (Green + NIR)
b15 =  (NDWI+1)*1000
// Normalized-Difference Snow Index
NDSI: (Green - SWIR1) / (Green + SWIR1)
b16 =  (NDSI+1)*1000
*/

Map.setOptions("HYBRID");
//////////////////////////////////////////////
/////SET NUMBER of DAY and INTERVAL///////////

var StartYEAR = 2014
var EndYEAR = 2018

// var YEAR=2018;
var STARTDAY=100;///julian number of start day
var ENDDAY=190;
var INTERVAL = ENDDAY - STARTDAY; //days
var cloud_treshold=80;
print(INTERVAL);
///////////////end////////////////////////////

var geometry = /* color: #d63000 */ee.Geometry.Polygon(
  [ [ [ 33.8109352, 50.226703 ],
  [ 33.8109352, 50.3316725 ],
  [ 33.6190876, 50.3316725 ],
  [ 33.6190876, 50.226703 ],
  [ 33.8109352, 50.226703 ] ] ] );

var AOI = ee.FeatureCollection([ee.Feature(geometry, {name: 'vin 3'})]);

/*
//export aoi to google drive
Export.table.toDrive({
  collection: AOI,
  description:'AOI',
  fileFormat: 'kml'
});
*/ 
// 

Map.centerObject(geometry, 12);

///////////////////////////////////////////////////////
//////////////////MEDIANS AND FILTERS//////////////////
///////////////////////////////////////////////////////
//Select only 6 bands to reduce size

function selectBandsL8(img){
  //select only 6 bands
  return img.expression('b("B2","B3","B4","B5","B6","B7")').rename('B1','B2','B3','B4','B5','B6').uint16();
}

function selectBandsL57(img){
  //select only 6 bands
  return img.expression('b("B1","B2","B3","B4","B5","B7")').rename('B1','B2','B3','B4','B5','B6').uint16();
}

// NDVI * 1000
var addNDVI = function(image) {
  return image.addBands(image.expression('float((b("B4") - b("B3")) / (b("B4") + b("B3"))*1000)').rename('NDVI'));
};
// EVI * 1000
var addEVI = function(image) {
	return image.addBands(image.expression('(2.5*((B4-B3)/(B4+6*B3-7.5*B1+1)))*1000', {
		'B1': image.select('B1'), 
		'B3': image.select('B3'), 
		'B4': image.select('B4')
}).rename('EVI')
)};

// ( EVI2 + 1 ) * 1000
var addEVI2 = function(image) {
	return image.addBands(image.expression('((((B3-B2)/(B3+(2.4*B2)+1))+1)*1000)', {
		'B2': image.select('B2'), 
		'B3': image.select('B3'), 
}).rename('EVI2')
)};

// SAVI * 1000
var addSAVI = function(image) {
	return image.addBands(image.expression('(((((B4-B3)/(B4+B3+0.5))*1.5)+1)*1000)', {
		'B3': image.select('B3'), 
		'B4': image.select('B4')
}).rename('SAVI')
)};

// MSAVI * 1000
var addMSAVI = function(image) {
	return image.addBands(image.expression('((((2*B4+1-sqrt((2*B4+1)**2-8*(B4-B3)))/2)+1)*1000)', {
		'B3': image.select('B3'), 
		'B4': image.select('B4')
}).rename('MSAVI')
)};

// ( NDMI + 1 )* 1000
var addNDMI = function(image) {
	// return image.addBands(image.normalizedDifference(['B4', 'B5']).rename('NDMI'));
  return image.addBands(image.expression('float((((b("B4") - b("B5")) / (b("B4") + b("B5")))+1)*1000)').rename('NDMI'));
  
};

// ( NBR + 1) * 1000
var addNBR = function(image) {
  //	return image.addBands(image.normalizedDifference(['B4', 'B6']).rename('NBR'));
return image.addBands(image.expression('float((((b("B4") - b("B6")) / (b("B4") + b("B6")))+1)*1000)').rename('NBR'));  
};

// NBR2 * 1000
var addNBR2 = function(image) {
	// return image.addBands(image.normalizedDifference(['B5', 'B6']).rename('NBR2'));
  return image.addBands(image.expression('float((b("B5") - b("B6")) / (b("B5") + b("B6"))*1000)').rename('NBR2'));
  
};

// ( NDWI + 1) * 1000
var addNDWI = function(image) {
//	return image.addBands(image.normalizedDifference(['B2', 'B4']).rename('NDWI'));
  return image.addBands(image.expression('float((((b("B2") - b("B4")) / (b("B2") + b("B4")))+1)*1000)').rename('NDWI'));
};

// ( NDSI + 1 ) * 1000
var addNDSI = function(image) {
//	return image.addBands(image.normalizedDifference(['B2', 'B5']).rename('NDSI'));
	return image.addBands(image.expression('float((((b("B2") - b("B5")) / (b("B2") + b("B5")))+1)*1000)').rename('NDSI'));
};

//Bit selection fo SR
var nocloudbit = 1;// 0x400
var nocloudBitMask = Math.pow(2,nocloudbit);

function maskSRclouds(image) {
  var qa = image.select('pixel_qa');
  var mask = qa.bitwiseAnd(nocloudBitMask);// land;
  return image.updateMask(mask);
}

/*
// A function to compute NDVI.
var NDVI = function(image) {
  return image.expression('float(b("B4") - b("B3")) / (b("B4") + b("B3"))');
};
*/

//Create medians
function createMedians(AOI, year, beginDay, endDay, period){
  var imgList = [];
  var collectionL8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR');
  var collectionL5 = ee.ImageCollection('LANDSAT/LT05/C01/T1_SR');
  var begin = beginDay;

  while (begin < endDay){
    var filterParamsL8 = collectionL8
      .filterBounds(AOI)
      .filter(ee.Filter.calendarRange(year, year, 'year'))
      .filter(ee.Filter.dayOfYear(begin, begin + period))
      .filterMetadata('CLOUD_COVER','less_than', cloud_treshold)
      .map(maskSRclouds)
      .map(selectBandsL8);
    var filterParamsL5 = collectionL5
      .filterBounds(AOI)
      .filter(ee.Filter.calendarRange(year, year, 'year'))
      .filter(ee.Filter.dayOfYear(begin, begin + period))
      .filterMetadata('CLOUD_COVER','less_than', cloud_treshold)
      .map(maskSRclouds)
      .map(selectBandsL57);
    print(year);
    print(filterParamsL5,filterParamsL8);
    var collection = ee.ImageCollection(filterParamsL5.merge(filterParamsL8));
    print('Number of Scenes', collection.size());
    var median = collection.median();
    var comp = median.set('id','L78'+ year+'_'+(begin + period));
    var clippedMedian = comp.clip(AOI);
    imgList.push(clippedMedian);
    //imgList.push(mask);
    begin += period;
  }
  // var result = ee.ImageCollection(imgList)
  return (ee.Image(ee.ImageCollection(imgList
  .map(addNDVI)
  .map(addEVI)
  .map(addEVI2)
  .map(addSAVI)
  .map(addMSAVI)
  .map(addNDMI)
  .map(addNBR)
  .map(addNBR2)
  .map(addNDWI)
  .map(addNDSI)
  )
  .first()
//  .float()
  .uint16()
  ));
}

///////////////////////////////////////////////////////////
/////////////CALCULATE MEDIANS/////////////////////////////

// var med = createMedians(AOI, YEAR, STARTDAY, ENDDAY, INTERVAL);

/// Calculate Medians by years
function createMediansByYears(AOI, beginYear, endYear, STARTDAY, ENDDAY, INTERVAL){
 // var imgList = [];
  var begin = beginYear;
  
  while (begin <= endYear){
    var pre_med = createMedians(AOI, begin, STARTDAY, ENDDAY, INTERVAL);
    var med = pre_med;
    // .map(addNDVI).map(addEVI).map(addEVI2).map(addSAVI).map(addMSAVI).map(addNDMI).map(addNBR).map(addNBR2).map(addNDWI).map(addNDSI)
    print(med);
    Map.addLayer(med, {bands: ['B5', 'B4', 'B3'], min: 0.0, max: 10000.0, gamma: 1.4,}, 'med_'+begin+'_'+(STARTDAY)+'_'+(STARTDAY+INTERVAL), false);
    Export.image.toDrive({
  image: med.clip(geometry),
  description: 'BerLuk_med_VI_'+begin+'_'+(STARTDAY)+'_'+(ENDDAY),
  folder: 'GEE data',
  scale: 30,
  region: geometry,
  crs: 'EPSG:4326',
  fileFormat: 'GeoTIFF',
  formatOptions: {
    cloudOptimized: true
  }
  });
/*
Export.image.toAsset({
  image: med,
  description: 'BerLuk_med_'+begin+'_'+(STARTDAY)+'_'+(ENDDAY),
  scale: 30,
  region: geometry
  });
  */
    begin += 1
    }

  
}

var medbyyears = createMediansByYears(AOI, StartYEAR, EndYEAR, STARTDAY, ENDDAY, INTERVAL);

print(medbyyears);


