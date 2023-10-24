/*
一、经纬度转换为世界坐标

1.Cesium.Cartesian3.fromDegrees(longitude, latitude, height, ellipsoid, result) 

2.var ellipsoid=viewer.scene.globe.ellipsoid;

 var cartographic=Cesium.Cartographic.fromDegrees(lng,lat,alt);

 var cartesian3=ellipsoid.cartographicToCartesian(cartographic);


二、 世界坐标转换为经纬度
1.var ellipsoid=viewer.scene.globe.ellipsoid;

var cartesian3=new Cesium.cartesian3(x,y,z);

var cartographic=ellipsoid.cartesianToCartographic(cartesian3);

var lat=Cesium.Math.toDegrees(cartograhphic.latitude);

var lng=Cesium.Math.toDegrees(cartograhpinc.longitude);

var alt=cartographic.height;

2.Cartographic.fromCartesian


三、屏幕坐标和世界坐标相互转换
1.var pick1= new Cesium.Cartesian2(0,0); 

var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(pick1),viewer.scene);

2.Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, Cartesian3);

*/
