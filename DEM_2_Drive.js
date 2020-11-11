// Map.setOptions("HYBRID");

// Ареа name for naming files for download

var myArea = 'Shulgovka-Elizavetovka';

// geomerty draw on map

// add DEM data
var dataset_SRTM = ee.Image("USGS/SRTMGL1_003");


Map.centerObject(geometry, 8);

print('dataset_SRTM:',dataset_SRTM);

var elevation_SRTM = dataset_SRTM.select(['elevation']);
var slope_SRTM = ee.Terrain.slope(elevation_SRTM);
var aspect_SRTM = ee.Terrain.aspect(elevation_SRTM);




///////////AOI/////////////////////////////////

var elevation = elevation_SRTM ;
var slope = slope_SRTM ;
var aspect = aspect_SRTM ;

var elevationVis = {
  min: -1.0,
  max: 1100.0,
  palette: [
    '3ae237', 'b5e22e', 'd6e21f', 'fff705', 'ffd611', 'ffb613', 'ff8b13',
    'ff6e08', 'ff500d', 'ff0000', 'de0101', 'c21301', '0602ff', '235cb1',
    '307ef3', '269db1', '30c8e2', '32d3ef', '3be285', '3ff38f', '86e26f'
  ],
};

var slopeVis = {
  min: 0,
  max: 30.0,
  palette: [
    'ffffcc', 'ffeda0', 'fed976', 'feb24c', 
    'fd8d3c', 'fc4e2a', 'e31a1c', 'bd0026', '800026'
  ],
  opacity: 0.75,
};

var aspectVis = {
  min: 0,
  max: 360.0,
  palette: [
    '8dd3c7', 'fed9a6', 'fb8072', 'ffffb3'
  ],
  opacity: 1,
};

// Функция фильтрации 
function FiltrationImg(img){
    var kernel = ee.Kernel.square(150,'meters');
//  var kernel = ee.Kernel.circle(3,  'pixels' );
    var image1 = img.focal_median({kernel: kernel, iterations: 1});
// Force projection of 30 meters/pixel
var SCALE = 30;
    var image2 = image1.focal_mean({kernel: kernel, iterations: 1});
// Force projection of 30 meters/pixel
// Reproject to WGS84 to force the image to be reprojected on load.
// This is just for display purposes, to visualize the input to
// the following operations.  The next reproject is sufficient
// to force the computation to occur at native scale.
var image3 = image2.reproject('EPSG:4326', null, SCALE);

return image3;
}

// Define a function to convert from degrees to radians.
function radians(img) {
  return img.toFloat().multiply(Math.PI).divide(180);
}

// Define a function to compute a hillshade from terrain data
// for the given sun azimuth and elevation.
function hillshade(az, ze, slope, aspect) {
  // Convert angles to radians.
  var azimuth = radians(ee.Image(az));
  var zenith = radians(ee.Image(ze));
  // Note that methods on images are needed to do the computation.
  // i.e. JavaScript operators (e.g. +, -, /, *) do not work on images.
  // The following implements:
  // Hillshade = cos(Azimuth - Aspect) * sin(Slope) * sin(Zenith) +
  //     cos(Zenith) * cos(Slope)
  return azimuth.subtract(aspect).cos()
    .multiply(slope.sin())
    .multiply(zenith.sin())
    .add(
      zenith.cos().multiply(slope.cos()));
}

var slope_rad = radians(slope_SRTM);
var aspect_rad = radians(aspect_SRTM);
var hillshade_SRTM = hillshade(315, 60, slope_rad, aspect_rad);


var elevation_filtred = FiltrationImg(elevation);
var slope_filtred = ee.Terrain.slope(elevation_filtred);
var aspect_filtred = ee.Terrain.aspect(elevation_filtred);

var slope_rad_filtred = radians(slope_filtred);
var aspect_rad_filtred = radians(aspect_filtred);
var hillshade_SRTM_filtred = hillshade(315, 60, slope_rad_filtred, aspect_rad_filtred);

Map.addLayer(elevation.clip(geometry), elevationVis, 'Elevation');
Map.addLayer(elevation_filtred.clip(geometry), elevationVis, 'filtred Elevetion', false);
Map.addLayer(aspect.clip(geometry), aspectVis, 'Aspect', false);
Map.addLayer(aspect_filtred.clip(geometry), aspectVis, 'filt_Aspect', false);
Map.addLayer(slope.clip(geometry), slopeVis, 'Slope', false);
Map.addLayer(slope_filtred.clip(geometry), slopeVis, 'filt_Slope', false);
Map.addLayer(hillshade_SRTM.clip(geometry), {}, 'hillshade_SRTM');
Map.addLayer(hillshade_SRTM_filtred.clip(geometry), {}, 'filrted hillshade_SRTM', false);


Export.image.toDrive({
  image: elevation.clip(geometry),
  description: 'elevation_SRTM_'+myArea,
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


// slope

Export.image.toDrive({
  image: slope.clip(geometry),
  description: 'slope_SRTM_'+myArea,
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
  
// aspect  
  
Export.image.toDrive({
  image: aspect.clip(geometry),
  description: 'aspect_SRTM_'+myArea,
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
  
// FILTRED

  
Export.image.toDrive({
  image: elevation_filtred.clip(geometry),
  description: 'filtred_elevation_SRTM_'+myArea,
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


// slope

Export.image.toDrive({
  image: slope_filtred.clip(geometry),
  description: 'filtred_slope_SRTM_'+myArea,
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
  
// aspect  
  
Export.image.toDrive({
  image: aspect_filtred.clip(geometry),
  description: 'filtred_aspect_SRTM_'+myArea,
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