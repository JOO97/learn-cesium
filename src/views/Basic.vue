<!-- Basic -->
<template>
	<!-- 容器 -->
	<div id="cesiumContainer" style="width: 100vw; height: 100vh" />
</template>

<script setup>
import { onMounted } from 'vue';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

window.Cesium = Cesium;

let viewer = null;

onMounted(async () => {
	/* Token */
	Cesium.Ion.defaultAccessToken =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZDk3ZjUxYS0zMzkyLTQ3NWEtYmM1Ny0zMTUxM2ZlMDFjMjMiLCJpZCI6MTczNDg2LCJpYXQiOjE2OTgxMjgzODV9.xSyHyR2dPE4dvRqOh5pl1dFSsTg0zcDyQ0g-82OzqV4';

	/* 默认视角 */
	Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
		117.861711,
		24.363349,
		118.236017,
		24.663633
	);

	viewer = new Cesium.Viewer('cesiumContainer', {
		/* NOTE: infoBox开启会有报错信息 Blocked script execution in 'about:blank' because the document's frame is sandboxed and the 'allow-scripts' permission is not set. */
		infoBox: false, //信息窗口
		// 是否显示查询按钮
		geocoder: false,
		// 不显示home按钮
		homeButton: false,
		// 控制查看器的显示模式
		sceneModePicker: false,
		// 是否显示图层选择
		baseLayerPicker: false,
		// 是否显示帮助按钮
		navigationHelpButton: false,
		// 是否播放动画
		animation: false,
		// 是否显示时间轴
		timeline: false,
		// 是否显示全屏按钮
		fullscreenButton: true,
		/* Sky Box */
		// skyBox: new Cesium.SkyBox({
		// 	sources: {
		// 		positiveX: 'texture/sky/px.jpg',
		// 		negativeX: 'texture/sky/nx.jpg',
		// 		positiveY: 'texture/sky/ny.jpg',
		// 		negativeY: 'texture/sky/py.jpg',
		// 		positiveZ: 'texture/sky/pz.jpg',
		// 		negativeZ: 'texture/sky/nz.jpg',
		// 	},
		// }),
		/* Base Layer */
		// baseLayer: Cesium.ImageryLayer.fromProviderAsync(
		// 	Cesium.ArcGisMapServerImageryProvider.fromBasemapType(Cesium.ArcGisBaseMapType.SATELLITE)
		// ),
		/* 高德卫星 */
		// baseLayer: new Cesium.ImageryLayer(
		// 	new Cesium.UrlTemplateImageryProvider({
		// 		url: 'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
		// 		maximumLevel: 18,
		// 		minimumLevel: 1,
		// 	})
		// ),
		/* 默认地形 */
		// terrain: Cesium.Terrain.fromWorldTerrain({
		// 	requestVertexNormals: true, //光照效果
		// 	requestWaterMask: true, //水文贴图
		// }),
		/* 加载本地地形 */
		// terrain: new Cesium.Terrain(Cesium.CesiumTerrainProvider.fromUrl('/terrains/gz')),
		/* NOTE: 异步 */
		terrainProvider: await Cesium.CesiumTerrainProvider.fromUrl('/terrains/gz'),
		// mapProjection: new Cesium.WebMercatorProjection(),
	});

	/* 底图
	const imageryLayers = viewer.scene.imageryLayers;
	const tms = imageryLayers.addImageryProvider(
		new Cesium.UrlTemplateImageryProvider({
	url: 'http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
	layer: 'tdtVecBasicLayer',
	style: 'default',
	format: 'image/png',
	tileMatrixSetID: 'GoogleMapsCompatible',
		})
	);
	tms.alpha = 0.5;

	imageryLayers.addImageryProvider(
		new Cesium.UrlTemplateImageryProvider({
			url: 'http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=3407f3176274ee0055bb815534b7b9a6',
			layer: 'tdtVecBasicLayer',
			style: 'default',
			format: 'image/png',
			tileMatrixSetID: 'GoogleMapsCompatible',
		})
	);
	*/

	/**
	 * 坐标系
	 * 1. 屏幕坐标: 二维的笛卡尔坐标系，Cartesian2
	 * 2. 地理坐标: 经度，纬度，高度, WGS-84坐标系, 角度、弧度两种表达方式
	 * 3. 笛卡尔空间直角坐标系，Cartesian3
	 *
	 * 弧度
	 * 角度
	 * 角度=弧度×180/π
	 * 弧度=角度×π/180
	 */

	//弧度转角度
	const degrees = Cesium.Math.toDegrees(Math.PI / 2); //90度
	//角度转弧度
	const radians = Cesium.Math.toRadians(180); //Math.PI

	/**
	 * 2 地理经纬度转地理弧度
	 */
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

	/* NOTE: cartographic弧度制表示的wgs84 */

	/**
	 * 3 经纬度转世界坐标(笛卡尔)
	 */
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

	/**
	 * 4 世界坐标(笛卡尔)转经纬度
	 */
	function cart3ToLngLat(cartesian3) {
		var ellipsoid = viewer.scene.globe.ellipsoid;
		//先转换为弧度，再由弧度转化为经纬度
		const cartograhphic = ellipsoid.cartesianToCartographic(cartesian3);

		var lat = Cesium.Math.toDegrees(cartograhphic.latitude);
		var lng = Cesium.Math.toDegrees(cartograhphic.longitude);
		var height = cartographic.height;

		return [lng, lat, height];
	}

	/**
	 * 5 世界坐标(笛卡尔)转屏幕坐标
	 */
	const cartesian3 = Cesium.Cartesian3.fromDegrees(112, 24);
	const cartesian2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cartesian3);

	/**
	 * 6 屏幕坐标转世界坐标(笛卡尔)
	 */
	// const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
	// handler.setInputAction((event) => {
	// 	const screenPos = event.position; //屏幕坐标
	// 	console.log('screen pos', screenPos);
	// 	/* 获取包含了地形、倾斜摄影表面、模型的世界坐标 */
	// 	const pickedPos = viewer.scene.pickPosition(event.position);
	// 	if (Cesium.defined(pickedPos)) {
	// 		console.log('======pickedPos', pickedPos);
	// 	}

	// 	/* 获取地球表面的世界坐标，包含地形，不包含其他模型 */
	// 	//Create a ray from the camera position through the pixel at windowPosition in world coordinates.
	// 	const ray = viewer.camera.getPickRay(event.position);
	// 	//Find an intersection between a ray and the globe surface that was rendered. The ray must be given in world coordinates.
	// 	/* NOTE: 开启深度检测 */
	// 	viewer.scene.globe.depthTestAgainstTerrain = true;
	// 	const pickedPos2 = viewer.scene.globe.pick(ray, viewer.scene);
	// 	console.log('=====pickedPos2', pickedPos2, cart3ToLngLat(pickedPos2));

	// 	/* 获取参考椭球的世界坐标 */
	// 	const pickedPos3 = viewer.scene.camera.pickEllipsoid(
	// 		event.position,
	// 		viewer.scene.globe.ellipsoid
	// 	);
	// 	console.log('=====pickedPos3', pickedPos3, cart3ToLngLat(pickedPos3));
	// }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

	/**
	 * 拾取方法
	 */
	pickHandler(viewer);

	/* 隐藏logo */
	viewer.cesiumWidget.creditContainer.style.display = 'none';

	//鼠标中键修改为地图缩放效果
	viewer.scene.screenSpaceCameraController.zoomEventTypes = [
		Cesium.CameraEventType.WHEEL,
		Cesium.CameraEventType.PINCH,
	];
	//鼠标右键修改为地图视角旋转效果
	viewer.scene.screenSpaceCameraController.tiltEventTypes = [
		Cesium.CameraEventType.PINCH,
		Cesium.CameraEventType.RIGHT_DRAG,
	];

	/**
	 * Camera
	 */
	const pos = Cesium.Cartesian3.fromDegrees(120, 29, 1000);
	/* setView */
	viewer.camera.setView({
		destination: pos,
		orientation: {
			heading: Cesium.Math.toRadians(90),
			pitch: Cesium.Math.toRadians(-45),
			roll: 0,
		},
	});

	/* flyTo */
	// setTimeout(() => {
	// 	viewer.camera.flyTo({
	// 		destination: Cesium.Cartesian3.fromDegrees(129, 34, 150000),
	// 		orientation: {
	// 			heading: Cesium.Math.toRadians(90),
	// 			pitch: Cesium.Math.toRadians(-45),
	// 			roll: 0,
	// 		},
	// 	});
	// }, 200);

	/**
	 * 通过按键移动相机
	 */
	document.addEventListener('keydown', (e) => {
		// 获取相机离地面的高度
		var height = viewer.camera.positionCartographic.height;
		var moveRate = height / 100;
		if (e.key == 'w') {
			// 设置相机向前移动
			viewer.camera.moveForward(moveRate);
		} else if (e.key == 's') {
			// 设置相机向后移动
			viewer.camera.moveBackward(moveRate);
		} else if (e.key == 'a') {
			// 设置相机向左移动
			viewer.camera.moveLeft(moveRate);
		} else if (e.key == 'd') {
			// 设置相机向右移动
			viewer.camera.moveRight(moveRate);
		} else if (e.key == 'q') {
			// 设置相机向左旋转相机
			viewer.camera.lookLeft(Cesium.Math.toRadians(0.1));
		} else if (e.key == 'e') {
			// 设置相机向右旋转相机
			viewer.camera.lookRight(Cesium.Math.toRadians(0.1));
		} else if (e.key == 'r') {
			// 设置相机向上旋转相机
			viewer.camera.lookUp(Cesium.Math.toRadians(0.1));
		} else if (e.key == 'f') {
			// 设置相机向下旋转相机
			viewer.camera.lookDown(Cesium.Math.toRadians(0.1));
		} else if (e.key == 'g') {
			// 向左逆时针翻滚
			viewer.camera.twistLeft(Cesium.Math.toRadians(0.1));
		} else if (e.key == 'h') {
			// 向右顺时针翻滚
			viewer.camera.twistRight(Cesium.Math.toRadians(0.1));
		}
	});

	// viewer.scene.globe.enableLighting = true;

	/* flyTo  */
	// viewer.camera.flyTo({
	// 	destination: new Cesium.Cartesian3(-3961951.575572026, 3346492.0945766014, 3702340.5336036095),
	// 	orientation: {
	// 		direction: new Cesium.Cartesian3(
	// 			0.8982074415844437,
	// 			-0.4393530288745287,
	// 			0.013867512433959908
	// 		),
	// 		up: new Cesium.Cartesian3(0.12793638617798253, 0.29147314437764565, 0.9479850669701113),
	// 	},
	// 	complete: function () {
	// 		setTimeout(function () {
	// 			viewer.camera.flyTo({
	// 				destination: new Cesium.Cartesian3(
	// 					-2304817.2435183465,
	// 					-3639113.128132953,
	// 					4688495.013644141
	// 				),
	// 				orientation: {
	// 					direction: new Cesium.Cartesian3(
	// 						0.3760550186878076,
	// 						0.9007147395506565,
	// 						0.21747547189489164
	// 					),
	// 					up: new Cesium.Cartesian3(
	// 						-0.20364591529594356,
	// 						-0.14862471084230877,
	// 						0.9676978022659334
	// 					),
	// 				},
	// 				easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
	// 				duration: 5,
	// 			});
	// 		}, 1000);
	// 	},
	// });

	/* lookAt */
	// const center = Cesium.Cartesian3.fromRadians(
	// 	2.4213211833389243,
	// 	0.6171926869414084,
	// 	3626.0426275055174
	// );
	// // viewer.scene.camera.lookAt(center, new Cesium.HeadingPitchRange(0, -Math.PI / 4, 2900));
	// const transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
	// viewer.scene.camera.lookAtTransform(
	// 	transform,
	// 	new Cesium.HeadingPitchRange(0, -Math.PI / 4, 2900)
	// );
	// // Orbit this point
	// viewer.clock.onTick.addEventListener(function (clock) {
	// 	// viewer.scene.camera.rotateRight(0.005);
	// });

	// 不允许镜头到地下
	// viewer.camera.viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;
});

/**
 * 拾取方法
 * @param {} viewer
 */
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
</script>
