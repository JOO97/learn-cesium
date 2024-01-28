# CesiumJS

> Learning Paths
>
> 1. cesium api
>
> ![image-20240120195610510](/Users/joo/Library/Application Support/typora-user-images/image-20240120195610510.png)
>
> 2. create a demo or webGL
> 3. cesium source code
> 4. cesium with threejs and babylon.js
> 5. ...
>
> Repo
>
> 1. learn-cesium
> 2. learn-cesium-source-code
> 3. cesium-xiamen-app: basic demo



🗓️TODO

1. 封装高德地图/天地图...imageryProvider





📄Doc

1. 中文doc

   http://cesium.xin/cesium/cn/Documentation1.62/index.html



🔗Blog

1. https://www.cnblogs.com/telwanggs/p/11124237.html
2. http://marsgis.cn/doc/study-cesium.pdf





📚 Course

1. https://www.bilibili.com/video/BV12g411U7Us/?spm_id_from=333.999.0.0&vd_source=35abcff391e951c0b56e70fd7f32e2dc
2. https://ke.qq.com/course/468292#term_id=100560563



💻Repo

1. https://github.com/YanzheZhang/Cesium.HPUZYZ.Demo





## 图形学

### 抗锯齿



#### MSAA

> 多重采样抗锯齿   Multisampling Antialising







## Concept

### Viewer

```js
var viewer = new Cesium.Viewer('cesiumContainer', {
	scene3DOnly: true,
	selectionIndicator: false,
	baseLayerPicker: false,
});
```

### 坐标系

#### 岁差章动计算(XYs):

1. https://github.com/CesiumGS/EarthKAMExplorer/tree/master/Cesium/Assets/IAU2006_XYS
2. https://blog.csdn.net/u011575168/article/details/108290011
3. http://cesium.xin/cesium/en/Documentationb28/Iau2006XysData.html





#### 坐标类型

> cesium中坐标系统分为地理坐标、世界坐标（X,Y,Z）、屏幕坐标三种。
>
> 采用右手系
>
> blog: https://zhuanlan.zhihu.com/p/334540571

1. 屏幕坐标: 二维的笛卡尔坐标系，Cartesian2

- ![image-20231123110408720](https://s2.loli.net/2023/11/23/IfsBRx4UnTMQaPH.png)

2. 地理坐标: 经度，纬度，高度, WGS-84坐标系 Cartographic(角度、弧度两种表达方式)

3. 笛卡尔空间直角坐标系:  世界坐标(x,y,z), 采用右手系, Cartesian3 

 

![image-20231123110321285](C:/Users/LEGION/AppData/Roaming/Typora/typora-user-images/image-20231123110321285.png)

4. **局部坐标

> blog: 
>
> 1. https://blog.csdn.net/weixin_45782925/article/details/123365834
> 2. https://www.zhoulujun.cn/html/theory/Mathematics/Geometry/8330.html

Cesium.Transforms.eastNorthUpToFixedFrame

> eastNorthUp 对应 x,y,z

````js
//绕点旋转示例
	const center = Cesium.Cartesian3.fromRadians(
		2.4213211833389243,
		0.6171926869414084,
		3626.0426275055174
	);
//创建矩阵
	const transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
	viewer.scene.camera.lookAtTransform(
		transform,
		new Cesium.HeadingPitchRange(0, -Math.PI / 4, 2900)
	);
	// Orbit this point
	viewer.clock.onTick.addEventListener(function (clock) {
		viewer.scene.camera.rotateRight(0.005);
	});
````





#### 坐标转换

> blog: https://zhuanlan.zhihu.com/p/522245835?utm_id=0

1. 角度与弧度互转

 角度=弧度×180/π

   弧度=角度×π/180

````js
	//弧度转角度
	const degrees = Cesium.Math.toDegrees(Math.PI / 2); //90度
	//角度转弧度
	const radians = Cesium.Math.toRadians(180); //Math.PI
````

![sp20231122_174523_685](https://s2.loli.net/2023/11/23/HMPVgZ1aKS58Gwx.png)



2. 地理经纬度转地理弧度

````js
//#1
	const lngLat = [118, 24];
	const longitude = Cesium.Math.toRadians(lngLat[0]);
	const latitude = Cesium.Math.toRadians(lngLat[1]);
	const height = 200;
	//NOTE: Cartographic-弧度制的经纬度，入参也为弧度制
	const cartographic = new Cesium.Cartographic(longitude, latitude, height);
	//#2
	var cartographic2 = Cesium.Cartographic.fromDegrees(lngLat[0], lngLat[1], height);
	// console.log('lngLat to cartographic', cartographic, longitude, latitude, cartographic2);
	//#3
	var cartographic3 = Cesium.Cartographic.fromRadians(longitude, latitude, height); //longitude和latitude为弧度
````

3. 经纬度转世界坐标(笛卡尔)

````js
	function lngLatToCartesian(lng, lat, h) {
		//直接转换
		var cartesian3 = Cesium.Cartesian3.fromDegrees(lngLat[0], lngLat[1], h);
		// const cartesian3 = Cesium.Cartesian3.fromDegrees(118, 24);
		// const cartesian3s = Cesium.Cartesian3.fromDegreesArray([118, 24, 119, 24]);
		// const cartesian3sWithHeight = Cesium.Cartesian3.fromDegreesArrayHeights([
		// 	118, 24, 100, 119, 24, 200,
		// ]);
		//弧度转笛卡尔
		//Cesium.Cartesian3.fromRadians, Cesium.Cartesian3.fromRadiansArray, Cesium.Cartesian3.fromRadiansArrayHeights

		//先转弧度后转笛卡尔
		//var cartographic = Cesium.Cartographic.fromDegrees(lng, lat, height); //单位：度，度，米
		//var ellipsoid=viewer.scene.globe.ellipsoid;
		//var cartesian3 = ellipsoid.cartographicToCartesian(cartographic);
		return cartesian3;
	}
````

4. 世界坐标(笛卡尔)转经纬度

````js
	function cart3ToLngLat(cartesian3) {
		var ellipsoid = viewer.scene.globe.ellipsoid;
		//先转换为弧度，再由弧度转化为经纬度
		const cartograhphic = ellipsoid.cartesianToCartographic(cartesian3);

		var lat = Cesium.Math.toDegrees(cartograhphic.latitude);
		var lng = Cesium.Math.toDegrees(cartograhphic.longitude);
		var height = cartographic.height;

		return [lng, lat, height];
	}
````

5. 世界坐标(笛卡尔)转屏幕坐标

````js
const cartesian3 = Cesium.Cartesian3.fromDegrees(112,24)
const cartesian2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cartesian3)
````

6. 屏幕坐标转世界坐标(笛卡尔)

````js
const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
handler.setInputAction(event => {
  const screenPos = event.position //屏幕坐标
  /* 1 获取地球表面的世界坐标，包含地形，不包含其他模型 */
	viewer.scene.globe.depthTestAgainstTerrain = true; /* NOTE: 开启深度检测 */
  const ray = viewer.camera.getPickRay(screenPos) 
 
  const pickedPos2 = viewer.scene.globe.pick(ray, viewer.scene);
  /* 2 获取参考椭球的世界坐标 */
  const pickedPos3 = viewer.scene.camera.pickEllipsoid(
			event.position,
			viewer.scene.globe.ellipsoid
		);
  /* 3 获取包含了地形、倾斜摄影表面、模型的世界坐标 */
	const pickedPos = viewer.scene.pickPosition(event.position);
	if (Cesium.defined(pickedPos)) {
			console.log('======pickedPos', pickedPos);
	}
}, Cesium.ScreenSpaceEventType.LEFT_CLICK)
````

#### 拾取方法

> blog: 
>
> 1. https://zhuanlan.zhihu.com/p/623421312?utm_id=0
> 2. https://blog.csdn.net/happy81997/article/details/129242772

````js
const pickHandler = (viewer) => {
	const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
	handler.setInputAction((event) => {
		const screenPos = event.position;

		/**
		 * 1 viewer.scene.pick()
		 * 通过坐标位置，拾取实体（Entity），图元（Primitive）,3DTiles对象，返回的是scene中指定位置最上层的对象。例如点击获取
		 * Entity的pick对象，通过pick.id可以拾取当前的entity对象。拾取后，可以用于改变对象的属性参数，如颜色，图片等。
		 * 只能获取一个对象，并且是最顶部的对象。如果拾取点没有对象，则会返回undefined
		 */
		const pick = viewer.scene.pick(screenPos);
		console.log('pick()', pick);
		if (Cesium.defined(pick)) {
			// pick.id.billboard.image = '......'; // 修改拾取到的entity的样式
		}

		/**
		 * 2 viewer.scene.pickPosition()
		 * 获取包含了地形、倾斜摄影表面、模型的世界坐标
		 * 拾取对应位置的Cartesian3，适用于模型表面位置的选取，拾取三维物体的坐标等。
		 */
		const pickPosition = viewer.scene.pickPosition(screenPos);
		if (Cesium.defined(pickPosition)) {
			console.log('======pickPosition', pickPosition);
		}

		/**
		 * 3 viewer.scene.globe.pick
		 * 返回一个射线（ray）和地球表面的一个交点的Cartesian3坐标。
		 * 一般用于获取加载地形后的经纬度和高程，不包括模型、倾斜摄影等表面高度。
		 */
		const ray = viewer.camera.getPickRay(screenPos);
		/* NOTE: 开启深度检测 */
		viewer.scene.globe.depthTestAgainstTerrain = true;
		const pickedPos2 = viewer.scene.globe.pick(ray, viewer.scene);
		console.log('=====pickedPos2', pickedPos2);

		/**
		 * 4 获取参考椭球的世界坐标
		 * 返回相机视角下鼠标点击的对应椭球面位置。接收屏幕坐标，返回Cartesian3坐标。适用裸球表面的选取，是基于数学模型的椭圆球体。
		 * 在有地形的情况下误差较大，在使用时需要关闭深度测试。
		 */
		const pickedPos3 = viewer.scene.camera.pickEllipsoid(screenPos, viewer.scene.globe.ellipsoid);
		console.log('=====pickedPos3', pickedPos3);

		/**
		 * 5 拾取图层
		 */
		let ImageryLayerFeatures = viewer.imageryLayers.pickImageryLayerFeatures(ray, viewer.scene);
		if (!Cesium.defined(ImageryLayerFeatures)) {
			console.log('没有影像图层要素信息选中');
		} else {
			Cesium.when(ImageryLayerFeatures, function (LayerFeatures) {
				//获取到图层数据
				if (LayerFeatures.length > 0) {
					console.log('获取到图层数据', LayerFeatures);
				}
			});
		}
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
````

### 矩阵[TODO]

> blog: https://www.seekstack.cn/post/780

- Cesium.Cartesian3（相当于Point3D）
- Cesium.Matrix3（3x3矩阵，用于描述**旋转**变换）
- Cesium.Matrix4（4x4矩阵，用于描述**旋转加平移**变换）
- Cesium.Quaternion（四元数，用于描述围绕某个向量**旋转一定角度**的变换）
- Cesium.Transforms(包含将位置转换为各种**参考系**的功能)







## Viewer

> steps:
>
> new Cesium.Viewer(container, options)
>
> => 
>
> - create container
>
> - new CesiumWidget(container, options)
>
>   => 
>
>   - new Scene(options)
>
>     => 
>
>     - setup mapProjection
>     - new Camera()
>
>   - Set the globe to scene: new Globe()
>
>   - Set the base imagery layer to scene
>
>   - Set the terrain provider to scene
>
>   - render by ellipsoid info
>
> - ...other widgets

![在这里插入图片描述](https://img-blog.csdnimg.cn/9ed08baa8f784fc7a6009596fabd59c1.png)







### Scene

> 1. 基础地理环境设置
>    如地球参数(globe)、光照(light)、雾(fog)、大气(skyAtmosphere)
> 2. 图层
> 3. 场景数据
> 4. 交互：相机、pick...

![在这里插入图片描述](https://img-blog.csdnimg.cn/7382c0cc0d814df38b06ba4c68562f67.png)





#### Imagery

> blog: https://zhuanlan.zhihu.com/p/340669216



##### ImageryLayer

> 1. create imagerLayer
> 2. viewer.scene.imageryLayers.add(imageryLayer)

- 从ImageryLayer创建 

  ````js
  const provider = new Cesium.XXXImageryProvider()
  const imagery = new Cesium.ImageryLayer(provider)
  viewer.scene.imageryLayers.add(imagery)
  ````

- cesium默认地底图 `Cesium.ImageryLayer.fromWorldImagery()`

- 异步创建 Cesium.ImageryLayer.fromProviderAsync

  - `Cesion Ion`

  ````js
  Cesium.ImageryLayer.fromProviderAsync(        Cesium.IonImageryProvider.fromAssetId(4))
  ````



##### ImageryProvider

> 抽象基类
>
> 核心方法和属性
>
> - **requestImage(x, y, level)**：请求指定级别和坐标的地图瓦片。
> - **rectangle**：表示该影像提供者覆盖的地理区域。
> - **tileWidth** 和 **tileHeight**：瓦片的宽度和高度。
> - **minimumLevel** 和 **maximumLevel**：支持的最小和最大缩放级别。
> - **getTileCredits(x, y, level)**：获取加载特定瓦片时所需的版权信息或其他信用信息。

1. **ArcGisMapServerImageryProvider**： 用于从 ArcGIS Server 加载地图服务。

````js
Cesium.ArcGisMapService.defaultAccessToken = ACCESS_TOKEN.ArcGis;

const arcGisBaseMap = Cesium.ArcGisMapServerImageryProvider.fromBasemapType(
		Cesium.ArcGisBaseMapType.OCEANS
	);
	layer.add(Cesium.ImageryLayer.fromProviderAsync(arcGisBaseMap));
	const arcGisFromUrl = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
		'https://ibasemaps-api.arcgis.com/arcgis/rest/services/World_Imagery/MapServer',
		{
			token: ACCESS_TOKEN.ArcGis,
		}
	);
layer.add(Cesium.ImageryLayer.fromProviderAsync(arcGisFromUrl));

````



2. **BingMapsImageryProvider**： 从 Bing Maps 获取影像图层。
3. **OpenStreetMapImageryProvider**
4. **GoogleEarthEnterpriseImageryProvider**： 用于加载 Google Earth 企业服务器的影像数据。
5. **SingleTileImageryProvider**： 用于加载单个图片作为影像图层
6. **TileMapServiceImageryProvider**: tms，加载离线瓦片
7. **GridImageryProvider** (经纬度网格图层)和 **TileCoordinatesImageryProvider**（瓦片坐标图层）



1. **WebMapServiceImageryProvider (WMS)**： 用于加载符合 WMS 标准的服务。
2. ‼️**WebMapTileServiceImageryProvider (WMTS)**： 用于加载符合 WMTS 标准的瓦片服务。
3. **UrlTemplateImageryProvider**： 通过 URL 模板从自定义服务加载影像。



##### tilingScheme

> 用于定义如何将球体或椭球体的表面分割为瓦片（tiles）

````js
const aMap = new Cesium.UrlTemplateImageryProvider({
		url: 'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
		maximumLevel: 18,
		minimumLevel: 1,
		credit: 'Amap',
		//NOTE: 需要转换坐标系
		tilingScheme: new GCJ02TilingScheme(),
		proxy: '/proxy/',
	});
````

- GeographicTilingScheme

  > 用于创建基于地理坐标系统（经度和纬度）的瓦片

- WebMercatorTilingScheme

  > 用于创建基于 Web Mercator 投影的瓦片，这是许多在线地图服务（如 Google Maps 和 Bing Maps）使用的标准

- 自定义TilingScheme 

`GCJ02TilingScheme extends WebMercatorTilingScheme`



##### ImageryLayerCollection

> Cesium.ImageryLayerCollection类是ImageryLayer类对象的容器，它可以装载、放置多个ImageryLayer或ImageryProvider类对象，而且它内部放置的ImageryLayer或ImageryProvider类对象是有序的

`viewer.scene.imageryLayers:ImageryLayerCollection`

![image-20240121204201356](/Users/joo/Library/Application Support/typora-user-images/image-20240121204201356.png)

````js
const viewer = new Cesium Viewer(...)
const imageryLayerCollection = viewer.scene.imageryLayers;                          
````





#### Terrain







### 图元

> 图元是Cesium用来绘制三维对象的一个独立的结构。图元类有：Globe、Model、Primitive、BillboardCollection、ViewportQuad等。
>
> Globe绘制的是全球地形，它需要两个东西，一个是地形高程信息，另外一个是影像图层，也就是地球的表皮。影像图层可以叠加多个，但是地形高程只能有一个。整个地形的绘制也是渐进式的，即视线看到的地方才会去调度相关的地形高程信息，找到对应位置的地形影像贴上。然而Globe只是一个图元。由此可见一个图元可以相当复杂。
>
> 需要注意的地方：
>
> 图元没有基类，但是所有的图元都会有update函数；
> Primitive类直译过来是图元的意思，但是它不是基类，只是图元的一种，起作用是用来绘制各种几何体。

![在这里插入图片描述](https://img-blog.csdnimg.cn/927d8cae834d4490a41c9f11a32b9295.png)







#### Camere





#### Ellipsoid

> 椭球体

new Cesium.Ellipsoid(x, y, z)

- Cesium.Ellipsoid.WGS84 : WGS84 标准的 Ellipsoid 实例
- Cesium.Ellipsoid.MOON: 月球
- Cesium.Ellipsoid.UNIT_SPHERE： 初始化为 (1.0, 1.0, 1.0) 的半径
- Cesium.Ellipsoid.packedLength：椭球体数据的二进制数据长度





### 

















### Performance

> @see https://cesium.com/blog/2018/01/24/cesium-scene-rendering-performance/

#### RequestRenderMode 请求渲染模式

viewer.scene.render()  显式渲染









### Camera















### 3d tiles











### 





### Model

倾斜摄影模型格式

> blog: https://zhuanlan.zhihu.com/p/632120916









## Engine

### JulianDate



### HeadingPitchRoll

> heading: 偏航（yaw），绕y轴
>
> pitch： 俯仰角，绕x轴
>
> roll： 滚动，绕z轴

![img](https://img-blog.csdn.net/20181017222938187?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3UwMTE1NzUxNjg=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

![roll(滚转)](https://img-blog.csdn.net/20181017221349352?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3UwMTE1NzUxNjg=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)



## Widgets

> Geocoder : 一种地理位置搜索工具，用于显示相机访问的地理位置。默认使用微软的 Bing 地图。
> HomeButton : 首页位置，点击之后将视图跳转到默认视角。
> SceneModePicker : 切换 2D、3D 和 Columbus View (CV) 模式。
> BaseLayerPicker : 选择三维数字地球的底图（imagery and terrain）。
> NavigationHelpButton : 帮助提示，如何操作数字地球。
> Animation :控制视窗动画的播放速度。
> CreditsDisplay : 展示商标版权和数据源。
> Timeline : 展示当前时间和允许用户在进度条上拖动到任何一个指定的时间。
> FullscreenButton : 视察全屏按钮。

### Timeline





## Camera





## Entity





## Primitive

> Steps：
>
> 1. 创建几何(geometry)
> 2. 创建几何实例(GeometryInstance)： geometry
> 3. 创建图元(Primitive)： geometryInstances 、appearance

### Geometry





#### polyline

1. PolylineGeometry（折线几何体）
2. SimplePolylineGeometry（以线带（line strip）形式建模的折线）:  
3. GroundPolylineGeometry（贴地折线几何体）：
4. ...





vertexFormat

> 用于指定折线几何体的顶点格式。顶点格式定义了每个顶点的属性，例如位置、法线、纹理坐标等。

- `Cesium.VertexFormat.POSITION_ONLY`：仅包含位置信息的顶点格式。
- `Cesium.VertexFormat.POSITION_AND_COLOR`：包含位置和颜色信息的顶点格式。
- `Cesium.VertexFormat.POSITION_NORMAL`：包含位置和法线信息的顶点格式。
- `Cesium.VertexFormat.ALL`：包含位置、颜色、法线、纹理坐标等所有属性的顶点格式。



arcType 

1. `Cesium.ArcType.NONE`：表示折线不进行插值，直接连接折线的顶点。这是默认值。
2. `Cesium.ArcType.GEODESIC`：表示折线使用大地线插值，按照地球曲率进行插值生成曲线。这种插值方法会在地球表面形成弧线。
3. `Cesium.ArcType.RHUMB`：表示折线使用恒向线插值，按照恒向线的方向进行插值生成曲线。这种插值方法会在地球表面形成一系列等角度的线段。

### GeometryInstance

1. 



### Cesium.Primitive

#### appearance

1. Appearance：Appearance定义了完整的GLSL顶点和片段着色器，以及用于绘制[`Primitive`](https://www.vvpstk.com/public/Cesium/Documentation/Primitive.html)的渲染状态。 所有的appearances实现都基于这个基础的`Appearance`接口。
2. MaterialAppearance：用于设置基于材质的外观，可以通过指定材质属性来定义Primitive对象的表面特性，如颜色、透明度、反射率等。支持材质着色的任意几何图形的外观（与[`EllipsoidSurfaceAppearance`](https://www.vvpstk.com/public/Cesium/Documentation/EllipsoidSurfaceAppearance.html)相反）。
3. EllipsoidSurfaceAppearance：用于设置椭球体或球体表面的外观，可以通过指定颜色属性来定义表面的颜色。如[`PolygonGeometry`](https://www.vvpstk.com/public/Cesium/Documentation/PolygonGeometry.html)和[`RectangleGeometry`](https://www.vvpstk.com/public/Cesium/Documentation/RectangleGeometry.html)， 它支持[`MaterialAppearance`](https://www.vvpstk.com/public/Cesium/Documentation/MaterialAppearance.html)和`MaterialAppearance.MaterialSupport.ALL`等所有材质
4. PerInstanceColorAppearance：带有颜色属性的[`GeometryInstance`](https://www.vvpstk.com/public/Cesium/Documentation/GeometryInstance.html)实例的外观。 用于根据每个实例的颜色属性来设置每个实例的外观。这个类常用于需要为每个实例指定不同颜色的场景，如点云数据可视化。
5. PolylineMaterialAppearance：用于设置折线或线段的外观，可以通过指定材质属性来定义Primitive对象的外观，如颜色、透明度、线宽等。



## Material

> Cesium也提供了Material类和MaterialProperty类，分别对通过Primitive和Entity两种方式生成的几何对象的material属性进行赋值。Primitive的appearance（或继承类）的material属性为Material类型，Entity的xxxGraphics的material属性为MaterialProperty或Color类型

![image-20231120100821776](https://s2.loli.net/2023/11/20/MjWis8foN2a5n9F.png)

### MaterialProperty



### Fabric







## Shader



### 内置函数



fract

> 用于计算一个浮点数的小数部分。它返回一个介于0和1之间的值，表示原始浮点数的小数部分。
>









## 0

![image-20231124094632861](https://s2.loli.net/2023/11/24/akEFyrcSfqG7mb4.png)
