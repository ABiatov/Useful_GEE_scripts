from osgeo import gdal

# Set folder path for result
folder_path = "/home/spermwhale/Dropbox/MAPS/WD/Beholder/Madagaskar_Agro_202301/raster/"


for layer in iface.layerTreeView().selectedLayers():
    print(layer.name())
    # reproject  raster to CRS EPSG:4326
    file_name = layer.name()+".kmz"
    color_prediction_kmz = folder_path + file_name
    print(color_prediction_kmz)

    warpreproject_out = processing.run("gdal:warpreproject", {
        'INPUT':layer,
#        'SOURCE_CRS':QgsCoordinateReferenceSystem('EPSG:4326'),
        'TARGET_CRS':QgsCoordinateReferenceSystem('EPSG:4326'),
        'RESAMPLING':0,
#        'NODATA':None,
        'DATA_TYPE':0,
        'MULTITHREADING':False,
        'OUTPUT':'TEMPORARY_OUTPUT'})

    reprojected_ds = warpreproject_out["OUTPUT"]


    gdal.Translate(
        destName=color_prediction_kmz,
        srcDS=reprojected_ds,
        format="KMLSUPEROVERLAY",
        options="-co format=png",
        )




