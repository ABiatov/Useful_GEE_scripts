/*
Примеры кода для участников семинара 
ГИС и заповедные территории 2020
https://scgis.org.ua
*/

// Установим базовую карту Google Hybrid
Map.setOptions("HYBRID");

// Центрируем карту по координатам X Y и  зуму карты
Map.setCenter(36.33, 49.62, 10);

// Центрируем карту по объекту и  зуму карты
// Map.centerObject(geometry, 13);

// Добавим однокональное изображение - рельеф SRTM Digital Elevation Data 30m
// https://developers.google.com/earth-engine/datasets/catalog/USGS_SRTMGL1_003
// https://explorer.earthengine.google.com/#detail/USGS%2FSRTMGL1_003
var srtm = ee.Image('USGS/SRTMGL1_003');
print(srtm);
// Map.addLayer(srtm);
// Map.addLayer(srtm, {min:50, max:200}, 'SRTM gray', false);

// Настройка отображения одноканального растра
var elevationVis = {
  min: 70.0,
  max: 250.0,
  palette: [
    '006837', 'addd8e', 'ffffcc',
    'fee391', 'fe9929', '993404'
  ],
};
// Map.addLayer(srtm, elevationVis, 'Elevation');


// Создадим переменные для первой и последней даты
var startDate = '2019-05-01';
var endDate = '2019-09-01';

// Поцент покрытия снимка облаками
var cloud_treshold = 30;

// Добавим коллекцию изображений USGS Landsat 8 Surface Reflectance Tier 1
// https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LC08_C01_T1_SR
// https://explorer.earthengine.google.com/#detail/LANDSAT%2FLC08%2FC01%2FT1_SR
var Le8_collection = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR');
// Простейшая фильтрация по диапазону дат и зоне интереса
var Le8_filtered = Le8_collection.filterDate(startDate, endDate)
// отфильтруем по проценту покрытия облаками
//                                 .filterMetadata('CLOUD_COVER','less_than', cloud_treshold) // отфильтруем снимки по проценту облачности
                                 .filterBounds(geometry);
                                 
// напечатаем количество снимков в коллекции снимков
print('Number of Le8 Scenes', Le8_filtered.size());
// Свойста колекции
print('Le8_filtered:', Le8_filtered);

// выберем из колекции первое изображение
var Le8_firstimage = ee.Image(Le8_filtered.first());

// Свойста изображения
print('Le8_firstimage:', Le8_firstimage);

// Добавим первое изображение на карту
Map.addLayer(Le8_firstimage, {}, 'Le8_first', false);
// добавив на карту можем настроить отображение непосредственно на карте

// Настройка отображения многоканального растра
var Le_visParams = {
  bands: ['B4', 'B3', 'B2'], // порядок слоев
  min: 0,
  max: 3000,
  gamma: 1.4,
};

// Добавим на карту первое изображение с настроенным отображением 
Map.addLayer(Le8_firstimage, Le_visParams, 'Le8_first_color', false);

// Посчитаем медианное изображение из коллекции
var Le8_filtered_median = Le8_filtered.median();
Map.addLayer(Le8_filtered_median, Le_visParams, 'Le8_median', false);

// Создадим функцию для маскировки пикселей закрытых облаками
/**
 * Function to mask clouds based on the pixel_qa band of Landsat 8 SR data.
 * @param {ee.Image} image input Landsat 8 SR image
 * @return {ee.Image} cloudmasked Landsat 8 image
 */
function maskL8sr(image) {
  // Bits 3 and 5 are cloud shadow and cloud, respectively.
  var cloudShadowBitMask = (1 << 3);
  var cloudsBitMask = (1 << 5);
  // Get the pixel QA band.
  var qa = image.select('pixel_qa');
  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
                 .and(qa.bitwiseAnd(cloudsBitMask).eq(0));
  return image.updateMask(mask);
}



// Применим маску к коллекции снимков
var Le8_noCloud_collection = Le8_collection
                  .filterDate(startDate, endDate)
                  .map(maskL8sr);

// Посчитаем медианное изображение из коллекции без облаков
var Le8_noCloud_median = Le8_noCloud_collection.median();
Map.addLayer(Le8_noCloud_median, Le_visParams, 'Le8_noCloud_median', false);

// Добавим данные Sentinel-2, Level-2A
// https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_SR
// https://explorer.earthengine.google.com/#detail/COPERNICUS%2FS2_SR
var collectionS2 = ee.ImageCollection('COPERNICUS/S2_SR');

// Создадим функцию маскировки облаков для данных Sentinel-2 Level-2A
/**
 * Function to mask clouds using the Sentinel-2 QA band
 * @param {ee.Image} image Sentinel-2 image
 * @return {ee.Image} cloud masked Sentinel-2 image
 */
function maskS2clouds(image) {
  var qa = image.select('QA60');

  // Bits 10 and 11 are clouds and cirrus, respectively.
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;

  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));
  return image.updateMask(mask);
//  return image.updateMask(mask).divide(10000); // если делить на 10000 то результирующий растр будет в долях еденицы.
}

var dataset_S2 = collectionS2
                  .filterBounds(geometry)
                  .filterDate(startDate, endDate)
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', cloud_treshold)) // отфильтруем снимки по проценту облачности
                  .map(maskS2clouds) // применим маску облачных пикселей
                  .select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B11', 'B12']); // отфильтруем каналы нужные нам

// напечатаем количество снимков в коллекции снимков
print('Number of S2 Scenes', dataset_S2.size());

// напечатаем описание коллекции снимков
print('dataset_S2',dataset_S2);

// Посчитаем медиану для коллекции Sentinel 2 
var S2_median = dataset_S2.median().uint16();

// Создадим варианты настроек отображения Sentinel 2
var rgbVis_natural_color = {
  min: 0,
  max: 1500,
  bands: ['B4', 'B3', 'B2'],
};

var rgbVis_Color_Infrared = {
  min: 0,
  max: 5000,
  bands: ['B8', 'B4', 'B3'],
};

var rgbVis_False_color = {
  min: 0,
  max: 5000,
  bands: ['B11', 'B8', 'B4'],
};

var rgbVis_sunflower = {
  min: 0,
  max: 3000,
  bands: ['B12', 'B11', 'B5'],
};

// >>>   НА КАРТЕ ПОДКЛЮЧЕНО НЕСКОЛЬКО СЛОЕВ

Map.addLayer(S2_median, rgbVis_False_color, 'S2 False color no cliped',false);

// Обрежем по геометрии зоны интереса и добавим на карту
Map.addLayer(S2_median.clip(geometry), rgbVis_natural_color, 'S2 natural color',false);
Map.addLayer(S2_median.clip(geometry), rgbVis_False_color, 'S2 False color',false);
Map.addLayer(S2_median.clip(geometry), rgbVis_sunflower, 'S2 sunflower',false);
Map.addLayer(S2_median.clip(geometry), rgbVis_Color_Infrared, 'S2 Color Infrared',false);


// Посчитаем  NDVI и некоторые другие индексы

// NDVI = (NIR - RED) / (NIR + RED)

// Расчитаем NDVI Landsat 8.
var L8_NDVI = Le8_noCloud_median.normalizedDifference(['B5', 'B4']).rename('NDVI');

// Расчитаем NDVI Sentinel 2

var S2_NDVI = S2_median.expression('(b("B8") - b("B4")) / (b("B8") + b("B4"))').rename('NDVI');

// MSAVI - Модифицированный почвенный ВИ (Modified Soil Adjusted VI)
// Создадим функцию расчета
var calc_MSAVI = function(image) {
	return image.expression('(((2*B4+1-sqrt((2*B4+1)**2-8*(B4-B3)))/2)+1)', {
		'B3': image.select('B3'), 
		'B4': image.select('B4')
     }).rename('MSAVI');
};

var L8_MSAVI = calc_MSAVI(Le8_noCloud_median);

print('L8_NDVI: ',L8_NDVI);
print('S2_NDVI: ',S2_NDVI);
print('L8_MSAVI: ',L8_MSAVI);


// Display NDVI.
Map.addLayer(L8_NDVI, {min: 0, max: 1, palette: ['white', 'green']}, 'L8_NDVI',false);
Map.addLayer(S2_NDVI, {min: 0, max: 1, palette: ['white', 'green']}, 'S2_NDVI',false);
Map.addLayer(L8_MSAVI, {min: 0, max: 1, palette: ['white', 'green']}, 'L8_MSAVI',false);


// Экспорт данных на Google Drive:

// Экспорт Рельефа
Export.image.toDrive({
  image: srtm.clip(geometry), // обрезаем изображение по маске
  description: 'SRTM_DEM_30m',
  folder: 'GEE_data',
  scale: 30,
  region: geometry,
  crs: 'EPSG:4326',
  maxPixels: 1e10,
  fileFormat: 'GeoTIFF',
  formatOptions: {
    cloudOptimized: true
  }
  });

// Экспорт медианного Landsat 8

Export.image.toDrive({
  image: Le8_noCloud_median.clip(geometry), // обрезаем изображение по маске
  description: 'L8_'+startDate+'_'+endDate,
  folder: 'GEE_data',
  scale: 30,
  region: geometry,
  crs: 'EPSG:4326',
  maxPixels: 1e10,
  fileFormat: 'GeoTIFF',
  formatOptions: {
    cloudOptimized: true
  }
  });

// Экспорт медианного Sentinel 2

Export.image.toDrive({
  image: S2_median.clip(geometry), // обрезаем изображение по маске
  description: 'Se2_'+startDate+'_'+endDate,
  folder: 'GEE_data',
  scale: 10,
  region: geometry,
  crs: 'EPSG:4326',
  maxPixels: 1e10,
  fileFormat: 'GeoTIFF',
  formatOptions: {
    cloudOptimized: true
  }
  });

// Экспорт медианного NDVI Landsat 8

Export.image.toDrive({
  image: L8_NDVI.clip(geometry), // обрезаем изображение по маске
  description: 'L8_NDVI_'+startDate+'_'+endDate,
  folder: 'GEE_data',
  scale: 30,
  region: geometry,
  crs: 'EPSG:4326',
  maxPixels: 1e10,
  fileFormat: 'GeoTIFF',
  formatOptions: {
    cloudOptimized: true
  }
  });
  
// Экспорт медианного NDVI Sentinel 2

Export.image.toDrive({
  image: S2_NDVI.clip(geometry), // обрезаем изображение по маске
  description: 'S2_NDVI_'+startDate+'_'+endDate,
  folder: 'GEE_data',
  scale: 10,
  region: geometry,
  crs: 'EPSG:4326',
  maxPixels: 1e10,
  fileFormat: 'GeoTIFF',
  formatOptions: {
    cloudOptimized: true
  }
  });

