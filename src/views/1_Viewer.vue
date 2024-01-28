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

	const start = Cesium.JulianDate.fromIso8601('2024-01-01T00:00:00Z');
	const stop = Cesium.JulianDate.fromIso8601('2024-01-01T01:00:00Z');

	var imageryProviderViewModels = [
		new Cesium.ProviderViewModel({
			name: 'OpenStreetMap',
			iconUrl: Cesium.buildModuleUrl('../assets/images/Cesium_Logo_Color_Overlay.png'),
			tooltip: 'OpenStreetMap',
			creationFunction: function () {
				return new Cesium.OpenStreetMapImageryProvider({
					url: 'https://a.tile.openstreetmap.org/',
				});
			},
		}),
		new Cesium.ProviderViewModel({
			name: 'Bing Maps Aerial',
			iconUrl: Cesium.buildModuleUrl('../assets/images/Cesium_Logo_Color_Overlay.png'),
			tooltip: 'Bing Maps Aerial',
			creationFunction: function () {
				return new Cesium.BingMapsImageryProvider({
					url: 'https://dev.virtualearth.net',
					mapStyle: Cesium.BingMapsStyle.AERIAL,
					key: 'YourBingMapsAPIKey',
				});
			},
		}),
	];

	viewer = new Cesium.Viewer('cesiumContainer', {
		/* 控件配置项 */
		/* NOTE: infoBox开启会有报错信息 Blocked script execution in 'about:blank' because the document's frame is sandboxed and the 'allow-scripts' permission is not set. */
		// infoBox: false, //信息窗口
		// 是否显示查询按钮
		// geocoder: false,
		// 不显示home按钮
		// homeButton: false,
		// 控制查看器的显示模式
		// sceneModePicker: false,
		//是否显示选中样式
		// selectionIndicator: false,
		// 是否显示图层选择
		// baseLayerPicker: false,
		// 是否显示帮助按钮
		// navigationHelpButton: false,
		// 是否显示动画控件
		// animation: false,
		// 是否显示时间轴
		// timeline: false,
		// 是否显示全屏按钮
		// fullscreenButton: true,
		// vr按钮
		// vrButton: true,

		// 是否启用动画
		shouldAnimate: true,
		// 如果为true，则每个几何体实例将仅以3D渲染以节省GPU内存
		// scene3DOnly: true,

		/* 时间视图模型，用于管理场景中的时间信息，包括当前时间、动画状态等 */
		clockViewModel: new Cesium.ClockViewModel(
			new Cesium.Clock({
				startTime: start.clone(), // 设置开始时间
				currentTime: start.clone(), // 设置当前时间
				stopTime: stop.clone(), // 设置停止时间
				clockRange: Cesium.ClockRange.LOOP_STOP, // 设置时钟范围为循环停止
				// clockStep: Cesium.ClockStep.SYSTEM_CLOCK,
				multiplier: 10, // 设置时钟速率的倍增因子
				canAnimate: true, // 启用动画效果
				shouldAnimate: true, // 启用动画效果
			})
		),
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
		// skyAtmosphere: new Cesium.SkyAtmosphere({
		// 	brightnessShift: -0.2,
		// 	hueShift: 0.3,
		// 	saturationShift: 0.2,
		// 	alpha: 0.8,
		// }),

		/* 自定义底图选择项 */
		// imageryProviderViewModels: imageryProviderViewModels,
		/* 默认底图 */
		// selectedImageryProviderViewModel: imageryProviderViewModels[0],
		/* 自定义地形选择项 */
		// terrainProviderViewModels:[],
		/* 默认地形 */
		// selectedTerrainProviderViewModel,
		/* baseLayerPicker:false时有效  */
		// baseLayerPicker: false,
		// imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
		// 	url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
		// }),
		// imageryProvider: new Cesium.OpenStreetMapImageryProvider({
		// url: 'https://a.tile.openstreetmap.org/',
		// }),
		/* 底图 */
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
		/* 地形 */
		// terrain: Cesium.Terrain.fromWorldTerrain({
		// 	requestVertexNormals: true, //光照效果
		// 	requestWaterMask: true, //水文贴图
		// }),
		/* 加载本地地形 */
		// terrain: new Cesium.Terrain(Cesium.CesiumTerrainProvider.fromUrl('/terrains/gz')),
		/* NOTE: 异步 */
		// terrainProvider: await Cesium.CesiumTerrainProvider.fromUrl('/terrains/gz'),

		// mapProjection: new Cesium.WebMercatorProjection(),
		/* 请求渲染模式 可减少 Cesium 渲染新帧的总时间，并降低 Cesium 在应用程序中的总体 CPU 占用率 */
		// requestRenderMode: true,
		/* 启用 requestRenderMode 后，当模拟时间变化超过 0.0 秒时，将请求渲染新的帧。可以通过设置 maximumRenderTimeChange 来调整该值 */
		// maximumRenderTimeChange: Infinity,

		/* 使用默认渲染循环 关闭后需要手动控制渲染过程 TODO: 手动控制渲染实现 */
		// useDefaultRenderLoop: true,

		/* 使用默认循环时的目标帧速率 */
		targetFrameRate: 60,
		// showRenderLoopErrors: true, //显示渲染循环的错误信息
		// useBrowserRecommendedResolution:true //使用浏览器推荐的分辨率
		/* 	启用阴影 */
		shadows: false,
		/* 启用地形阴影 */
		// terrainShadows: Cesium.ShadowMode.ENABLED,
		terrainShadows: Cesium.ShadowMode.RECEIVE_ONLY,
		/* 用于控制深度平面相对于椭球体表面的偏移。深度平面是一种用于增强视觉效果的技术，通常用于调整近地面物体的渲染效果。 */
		// depthPlaneEllipsoidOffset: 0,
		/* 用于指定多重采样抗锯齿 (MSAA) 的样本数。多重采样是一种抗锯齿技术，用于提高图形渲染的质量，尤其是在处理斜线和边缘时。 */
		// msaaSamples: 1,

		// globe: new Cesium.Globe({}),
		// globe: false,
	});

	/* 显示渲染 requestRender */
	// viewer.scene.requestRender();

	/* 地表大气层 */
	// viewer.scene.globe.showGroundAtmosphere = false;
	// 天空大气层，默认是 true
	viewer.scene.skyAtmosphere.show = false;

	const entity = viewer.entities.add({
		position: Cesium.Cartesian3.fromDegrees(122, 22),
		box: {
			dimensions: new Cesium.Cartesian3(1000.0, 1000.0, 1000.0),
			material: Cesium.Color.CORNFLOWERBLUE,
		},
	});
	// viewer.zoomTo(viewer.entities);
	// console.log(cart3ToLngLat(entity.position));

	// 保存初始坐标
	const startPosition = Cesium.Cartesian3.fromDegrees(122, 22);
	viewer.trackedEntity = entity;
	let lastTick = viewer.clock.startTime;

	/**
	 * Clock on tick [TODO:]
	 */
	viewer.clock.onTick.addEventListener(function (clock) {
		return;
		console.log('clock', clock);
		// 获取当前时间
		var currentTime = clock.currentTime;

		// 计算时间差
		var timeDifference = Cesium.JulianDate.secondsDifference(currentTime, lastTick);
		lastTick = currentTime;
		console.log('timeDifference', timeDifference);
		// 根据时间差计算移动距离（这里简单以时间差作为经度的增量）
		var longitudeIncrement = timeDifference; // 调整增量的系数，使移动效果更明显
		const lngLat = cart3ToLngLat(startPosition);
		console.log('=startPosition', longitudeIncrement);
		// console.log('=', Cesium.Cartesian3.fromRadians(startPosition.longitude));
		// 计算新的位置
		var newPosition = Cesium.Cartesian3.fromDegrees(lngLat[0] + longitudeIncrement, lngLat[1]);

		console.log('s', newPosition, lngLat[0] + longitudeIncrement, lngLat[1]);

		// 更新 Entity 的位置
		entity.position = newPosition;
		// viewer.zoomTo(viewer.entities);
	});

	/* 底图 */
	// const imageryLayers = viewer.scene.imageryLayers;
	// const tms = imageryLayers.addImageryProvider(
	// 	new Cesium.UrlTemplateImageryProvider({
	// 		url: 'http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
	// 		layer: 'tdtVecBasicLayer',
	// 		style: 'default',
	// 		format: 'image/png',
	// 		tileMatrixSetID: 'GoogleMapsCompatible',
	// 	})
	// );
	// tms.alpha = 0.5;

	// imageryLayers.addImageryProvider(
	// 	new Cesium.UrlTemplateImageryProvider({
	// 		url: 'http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=3407f3176274ee0055bb815534b7b9a6',
	// 		layer: 'tdtVecBasicLayer',
	// 		style: 'default',
	// 		format: 'image/png',
	// 		tileMatrixSetID: 'GoogleMapsCompatible',
	// 	})
	// );

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

	// viewer.scene.globe.enableLighting = true;
});
</script>
