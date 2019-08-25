Map.setOptions("HYBRID");
//////////////////////////////////////////////
/////SET NUMBER of DAY and INTERVAL///////////

var StartYEAR = 2014
var EndYEAR = 2018

// var YEAR=2018;
var STARTDAY=229;///julian number of start day
var ENDDAY=258;
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

var AOI = ee.FeatureCollection([ee.Feature(geometry, {name: 'my area'})]);

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
//Bit selection fo SR
var nocloudbit = 1;// 0x400
var nocloudBitMask = Math.pow(2,nocloudbit);

function maskSRclouds(image) {
  var qa = image.select('pixel_qa');
  var mask = qa.bitwiseAnd(nocloudBitMask);// land;
  return image.updateMask(mask);
}

// A function to compute NDVI.
var NDVI = function(image) {
  return image.expression('float(b("B4") - b("B3")) / (b("B4") + b("B3"))');
};

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
  return (ee.Image(ee.ImageCollection(imgList).first()));
}

///////////////////////////////////////////////////////////
/////////////CALCULATE MEDIANS/////////////////////////////

// var med = createMedians(AOI, YEAR, STARTDAY, ENDDAY, INTERVAL);

/// Calculate Medians by years
function createMediansByYears(AOI, beginYear, endYear, STARTDAY, ENDDAY, INTERVAL){
 // var imgList = [];
  var begin = beginYear;
  
  while (begin <= endYear){
    var med = createMedians(AOI, begin, STARTDAY, ENDDAY, INTERVAL);
    print(med);
    Map.addLayer(med, {bands: ['B5', 'B4', 'B3'], min: 0.0, max: 10000.0, gamma: 1.4,}, 'med_'+begin+'_'+(STARTDAY)+'_'+(STARTDAY+INTERVAL), false);
    Export.image.toDrive({
  image: med,
  description: 'My_AOI_'+begin+'_'+(STARTDAY)+'_'+(ENDDAY),
  folder: 'GEE data',
  scale: 30,
  region: geometry,
  fileFormat: 'GeoTIFF',
  formatOptions: {
    cloudOptimized: true
  }
  });
/*
Export.image.toAsset({
  image: med,
  description: 'My_AOI_'+begin+'_'+(STARTDAY)+'_'+(ENDDAY),
  scale: 30,
  region: geometry
  });
  */
    begin += 1
    }

  
}

var medbyyears = createMediansByYears(AOI, StartYEAR, EndYEAR, STARTDAY, ENDDAY, INTERVAL);

print(medbyyears);


