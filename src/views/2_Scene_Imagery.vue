<!-- 
	Imagery 影像图层
	@see https://zhuanlan.zhihu.com/p/340669216

 -->
<template>
	<div id="cesiumContainer" style="width: 100vw; height: 100vh" />
</template>

<script setup>
import { onMounted, version } from 'vue';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

import GCJ02TilingScheme from '../core/gcj02TilingScheme';

window.Cesium = Cesium;

let viewer = null,
	layer = null;

const ACCESS_TOKEN = {
	Cesium:
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZDk3ZjUxYS0zMzkyLTQ3NWEtYmM1Ny0zMTUxM2ZlMDFjMjMiLCJpZCI6MTczNDg2LCJpYXQiOjE2OTgxMjgzODV9.xSyHyR2dPE4dvRqOh5pl1dFSsTg0zcDyQ0g-82OzqV4',
	ArcGis:
		'AAPK04c877a49a364174be41ac33b2cf83d1R-a7rMk13YyhdbxpNx7ne6XmaIWVCclzlKmLU6iYLc-ZvyE1i-CDXgRqBYJodyNB',
};

onMounted(async () => {
	Cesium.Ion.defaultAccessToken = ACCESS_TOKEN.Cesium;

	/* Set ArcGis Access Token */
	Cesium.ArcGisMapService.defaultAccessToken = ACCESS_TOKEN.ArcGis;

	viewer = new Cesium.Viewer('cesiumContainer', {
		terrain: Cesium.Terrain.fromWorldTerrain({
			requestWaterMask: false,
		}),
		/* 基础图层 */
		// baseLayer: Cesium.ImageryLayer.fromWorldImagery({
		// 	style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS,
		// }),
		// baseLayer: Cesium.ImageryLayer.fromProviderAsync(
		// 	Cesium.ArcGisMapServerImageryProvider.fromBasemapType(Cesium.ArcGisBaseMapType.SATELLITE)
		// ),
		baseLayer: false, //不展示默认底图
		baseLayerPicker: false, //图层选择组件

		// shouldAnimate: true,
	});

	//shouldAnimate是Clock的属性
	// viewer.clock.shouldAnimate = true;

	/* 获取或设置拆分器在视口中的位置 */
	// viewer.scene.splitPosition = 0.5;

	layer = viewer.scene.imageryLayers;

	console.log('viewer', viewer);
	console.log('layer', layer);

	/* NOTE: [[ImageryLayerCollection]]  */
	ImageryLayerCollection();

	/* NOTE: [[Cesium.ImageryLayer]] Examples */
	ImageryLayer();

	/* NOTE: [[ImageryProvider]] Examples */
	ImageryProvider();
});

/**
 * ImageryLayer
 */
const ImageryLayer = async () => {
	return;
	/* 1 new Cesium.ImageryLayer(ImageryProvider) */
	const openStreetMaps = new Cesium.ImageryLayer(
		new Cesium.OpenStreetMapImageryProvider({
			url: 'https://tile.openstreetmap.org/',
		}),
		{
			// splitDirection: Cesium.SplitDirection.RIGHT,
			show: true, //不展示图层
		}
	);
	openStreetMaps.alpha = 0.8;
	layer.add(openStreetMaps);

	/**
	 * 2 fromWorldImagery
	 * Cesium默认底图
	 */
	const imageryLayer2 = Cesium.ImageryLayer.fromWorldImagery();
	// imageryLayer2.splitDirection = Cesium.SplitDirection.LEFT;
	layer.add(imageryLayer2);

	/**
	 * fromProviderAsync(imageryProviderPromise, options)
	 * 异步
	 */
	const imageryLayer3 = Cesium.ImageryLayer.fromProviderAsync(
		Cesium.IonImageryProvider.fromAssetId(4)
	);
	/* Event: imagery event Handler */
	imageryLayer3.readyEvent.addEventListener((provider) => {
		console.log('imageryLayer创建成功时触发', provider);
		provider.errorEvent.addEventListener((error) => {
			console.log('imagery 瓦片加载失败时触发', error);
		});
	});
	imageryLayer3.errorEvent.addEventListener((error) => {
		console.log('imageryLayer创建失败时触发', error);
	});
	layer.add(imageryLayer3);

	/* Methods: destroy  */
	/*
	setTimeout(() => {
		if (imageryLayer3) {
			layer.remove(imageryLayer3);
			imageryLayer3.destroy();
		}
	}, 5000);
	*/

	/**
	 * Methods: getImageryRectangle
	 * 获取影像图层的矩形范围
	 * NOTE: 通常是通过访问影像图层提供者（ImageryProvider）的 rectangle 属性来获取这个范围(不一定有)
	 */
	var imageryProvider = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
		'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer',
		{
			token:
				'AAPK04c877a49a364174be41ac33b2cf83d1R-a7rMk13YyhdbxpNx7ne6XmaIWVCclzlKmLU6iYLc-ZvyE1i-CDXgRqBYJodyNB',
		}
	);
	var imageryLayer4 = viewer.imageryLayers.addImageryProvider(imageryProvider);
	const imageryRectangle = imageryLayer4.getImageryRectangle();
	// viewer.scene.camera.flyTo({
	// 	destination: imageryRectangle,
	// });
};

/**
 * ImageryProvider
 */
const ImageryProvider = async () => {
	return;
	/**
	 * 1 ArcGisMapServerImageryProvider
	 * 一般用 ArcGisMapServerImageryProvider.fromBasemapType or
	 * ArcGisMapServerImageryProvider.fromUrl
	 * return Promise<ImageryProvider>
	 */
	/*
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
  */

	/**
	 * TileMapServiceImageryProvider
	 * 加载离线瓦片
	 */
	// var tileImageLayer = new Cesium.TileMapServiceImageryProvider({
	// 	url: '//cesiumjs.org/tilesets/imagery/blackmarble',
	// 	maximumLevel: 8,
	// });
	// const tms = await Cesium.TileMapServiceImageryProvider.fromUrl(
	// 	'../assets/tiles/tms',
	// 	{
	// 		fileExtension: 'png',
	// 		maximumLevel: 4,
	// 		rectangle: new Cesium.Rectangle(
	// 			Cesium.Math.toRadians(-120.0),
	// 			Cesium.Math.toRadians(20.0),
	// 			Cesium.Math.toRadians(-60.0),
	// 			Cesium.Math.toRadians(40.0)
	// 		),
	// 	}
	// );
	// layer.addImageryProvider(tms);

	/**
	 * SingleTileImageryProvider
	 * 单瓦片
	 */
	//1
	const logoImagery = Cesium.ImageryLayer.fromProviderAsync(
		Cesium.SingleTileImageryProvider.fromUrl('/src/assets/images/Cesium_Logo_Color_Overlay.png', {
			rectangle: Cesium.Rectangle.fromDegrees(-75.0, 28.0, -67.0, 29.75),
		})
	);
	// layer.add(logoImagery);
	//2
	const logoImagery2 = await Cesium.SingleTileImageryProvider.fromUrl(
		/* NOTE: 本地资源服务从根目录开始 */
		'/src/assets/images/Cesium_Logo_Color_Overlay.png',
		{
			rectangle: Cesium.Rectangle.fromDegrees(-75.0, 28.0, -67.0, 29.75),
		}
	);
	// layer.addImageryProvider(logoImagery2);

	/**
	 * 经纬度网格图层
	 */
	const gridImagery = new Cesium.GridImageryProvider({
		color: Cesium.Color.YELLOW,
		glowColor: Cesium.Color.BLUE,
		backgroundColor: Cesium.Color.BLACK,
	});
	// const gridImageryLayer = layer.addImageryProvider(gridImagery);
	// layer.raiseToTop(gridImageryLayer); //将图层置顶/

	/**
	 * 瓦片坐标图层
	 */
	var tileCoordinates = new Cesium.TileCoordinatesImageryProvider({
		color: Cesium.Color.RED,
	});
	// var tileCoordinatesLayer = layer.addImageryProvider(tileCoordinates);
	// layer.raiseToTop(tileCoordinatesLayer); //将图层置顶

	/**
	 * WebMapServiceImageryProvider
	 * 符合WMS规范的影像服务
	 */
	// const wmsImageryProvider = new Cesium.WebMapServiceImageryProvider({
	// 	url: 'https://sampleserver1.arcgisonline.com/ArcGIS/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer/WMSServer',
	// 	layers: '0',
	// 	proxy: new Cesium.DefaultProxy('/proxy/'),
	// });
	// layer.add(new Cesium.ImageryLayer(wmsImageryProvider));

	/**
	 * WebMapTileServiceImageryProvider
	 * 符合WMTS1.0.0规范的影像服务
	 */
	//1
	const shadedRelief2 = new Cesium.WebMapTileServiceImageryProvider({
		url: 'http://basemap.nationalmap.gov/arcgis/rest/services/USGSShadedReliefOnly/MapServer/WMTS/tile/1.0.0/USGSShadedReliefOnly/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg',
		layer: 'USGSShadedReliefOnly',
		style: 'default',
		format: 'image/jpeg',
		tileMatrixSetID: 'default028mm',
		maximumLevel: 19,
		credit: new Cesium.Credit('U. S. Geological Survey'),
	});
	// layer.addImageryProvider(shadedRelief2);

	/**
	 * 2 NASA time dynamic weather data
	 * @see https://sandcastle.cesium.com/index.html?src=Web%2520Map%2520Tile%2520Service%2520with%2520Time.html
	 */
	wmtsDynamic();

	/**
	 * UrlTemplateImageryProvider
	 * 从任何提供 URL 模板的地图服务获取地图数据
	 */
	const aMap = new Cesium.UrlTemplateImageryProvider({
		url: 'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
		maximumLevel: 18,
		minimumLevel: 1,
		credit: 'Amap',
		//NOTE: 需要转换坐标系  TODO: 待校验
		tilingScheme: new GCJ02TilingScheme(),
		proxy: '/proxy/',
	});
	// layer.addImageryProvider(aMap);
};

/**
 * NASA time dynamic weather data
 * @description ImageryProvider
 */
const wmtsDynamic = () => {
	function dataCallback(interval, index) {
		let time;
		if (index === 0) {
			// leading
			time = Cesium.JulianDate.toIso8601(interval.stop);
		} else {
			time = Cesium.JulianDate.toIso8601(interval.start);
		}
		return {
			Time: time,
		};
	}
	const times = Cesium.TimeIntervalCollection.fromIso8601({
		iso8601: '2015-07-30/2017-06-16/P1D',
		leadingInterval: true,
		trailingInterval: true,
		isStopIncluded: false, // We want stop time to be part of the trailing interval
		dataCallback: dataCallback,
	});

	const weather = new Cesium.WebMapTileServiceImageryProvider({
		url: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg',
		layer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
		style: 'default',
		tileMatrixSetID: '250m',
		maximumLevel: 5,
		format: 'image/jpeg',
		clock: viewer.clock,
		times: times,
		credit: 'NASA Global Imagery Browse Services for EOSDIS',
	});
	layer.addImageryProvider(weather);

	const start = Cesium.JulianDate.fromIso8601('2015-07-30');
	const stop = Cesium.JulianDate.fromIso8601('2017-06-17');

	viewer.timeline.zoomTo(start, stop);

	const clock = viewer.clock;
	clock.startTime = start;
	clock.stopTime = stop;
	clock.currentTime = start;
	clock.clockRange = Cesium.ClockRange.LOOP_STOP;
	clock.multiplier = 7200;
};

/**
 * ImageryLayerCollection
 */
const ImageryLayerCollection = async () => {
	/* Events */
	layer.layerAdded.addEventListener((imageryLayer) => {
		console.log('=====layerAdded', imageryLayer);
	});
	/* Methods */
	const imageryProvider = await Cesium.ArcGisMapServerImageryProvider.fromBasemapType(
		Cesium.ArcGisBaseMapType.OCEANS
	);
	// addImageryProvider
	const imageryLayer = layer.addImageryProvider(imageryProvider);

	setTimeout(() => {
		//remove
		// layer.remove(imageryLayer, true);
	}, 3000);

	// layer.raise(imageryLayer);
	// layer.lower(imageryLayer);

	// const getImageryLayer = layer.get(0);
};

/**
 * pickImageryLayerFeatures
 * 拾取射线相交的影像图层要素
 * TODO:
 * @description ImageryLayerCollection
 */
const pickImageryLayerFeatures = (windowPosition) => {
	const pickRay = viewer.camera.getPickRay(windowPosition);
	const pickPosition = viewer.scene.globe.pick(pickRay, viewer.scene);
	if (Cesium.defined(pickPosition)) {
		const featuresPromise = layer.pickImageryLayers(pickPosition, viewer.scene);
		if (!Cesium.defined(featuresPromise)) {
			console.log('no featured picked');
		} else {
			featuresPromise
				.then((features) => {
					console.log('features picked', features);
				})
				.catch((error) => {
					console.log('no featured picked', error);
				});
		}
	} else {
		console.log('==no featured picked');
	}
};

/**
 * 拾取图层信息
 */
window.addEventListener('mousemove', (e) => {
	pickImageryLayerFeatures(new Cesium.Cartesian2(e.clientX, e.clientY));
});
</script>

<style lang="scss" scoped></style>
