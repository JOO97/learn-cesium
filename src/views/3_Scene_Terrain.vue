<script setup>
/**
 * Terrain
 * @see https://zhuanlan.zhihu.com/p/341768278
 */
import { onMounted } from 'vue';
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

Cesium.Ion.defaultAccessToken = ACCESS_TOKEN.Cesium;
Cesium.ArcGisMapService.defaultAccessToken = ACCESS_TOKEN.ArcGis;

onMounted(async () => {
	/* 默认视角 */
	Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
		117.861711,
		24.363349,
		118.236017,
		24.663633
	);

	viewer = new Cesium.Viewer('cesiumContainer', {
		/* 全球地形 */
		// terrain: Cesium.Terrain.fromWorldTerrain({
		// 	requestWaterMask: true, //启用水体蒙版
		// 	requestVertexNormals: true, //启用顶点法线
		// }),
		baseLayer: false,
		// terrain: new Cesium.Terrain(Cesium.CesiumTerrainProvider.fromUrl('https://myTestTerrain.com')),
		/* terrainProvider */
		// terrainProvider: await Cesium.CesiumTerrainProvider.fromIonAssetId(1, {
		// 	requestVertexNormals: true,
		// }),
		// terrainProvider: await Cesium.createWorldTerrainAsync(),
		/* 使用一个光滑、规则的椭球形状来代表地球表面 */
		// terrainProvider: new Cesium.EllipsoidTerrainProvider(),
		/* TODO: 没生效 VRTheWorldTerrainProvider */
		// terrainProvider: new Cesium.VRTheWorldTerrainProvider({
		// 	url: 'https://www.vr-theworld.com/vr-theworld/tiles1.0.0/73/', // VR-TheWorld 服务器的 URL
		// }),
	});

	/* setTerrain */
	// const terrain = new Cesium.Terrain(
	// 	Cesium.CesiumTerrainProvider.fromUrl('https://myTestTerrain.com')
	// );
	// viewer.scene.setTerrain(terrain);

	/* ArcGis Terrain Provider */
	const terrainProvider = await Cesium.ArcGISTiledElevationTerrainProvider.fromUrl(
		'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer',
		{
			token: ACCESS_TOKEN.ArcGis,
		}
	);
	viewer.terrainProvider = terrainProvider;

	/* Google Map Terrain Provider */
	// const geeMetadata = await GoogleEarthEnterpriseMetadata.fromUrl('http://www.example.com');
	// const gee = Cesium.GoogleEarthEnterpriseTerrainProvider.fromMetadata(geeMetadata);
	/**
	 * sampleTerrain 查询高程信息
	 */
	// 定义查询的位置（经纬度坐标）
	var positions = [
		Cesium.Cartographic.fromDegrees(114.0, 38.0),
		Cesium.Cartographic.fromDegrees(115.0, 39.0),
	];
	// // 查询地形高程
	Cesium.sampleTerrain(terrainProvider, 11, positions).then(function (updatedPositions) {
		// 使用查询结果
		for (var i = 0; i < updatedPositions.length; ++i) {
			console.log('sampleTerrain 位置 ' + i + ' 的高程：' + updatedPositions[i].height);
		}
	});

	/**
	 * sampleTerrainMostDetailed 查询地形提供者（TerrainProvider）提供的最详细等级
	 */
	// 查询最详细的地形高程
	Cesium.sampleTerrainMostDetailed(terrainProvider, positions).then(function (updatedPositions) {
		// 使用查询结果
		for (var i = 0; i < updatedPositions.length; ++i) {
			console.log('sampleTerrainMostDetailed 位置 ' + i + ' 的高程：' + updatedPositions[i].height);
		}
	});
	layer = viewer.scene.imageryLayers;

	const aMap = new Cesium.UrlTemplateImageryProvider({
		url: 'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
		maximumLevel: 18,
		minimumLevel: 1,
		credit: 'Amap',
		tilingScheme: new GCJ02TilingScheme(),
		proxy: '/proxy/',
	});
	layer.addImageryProvider(aMap);

	console.log('viewer', viewer);
	console.log('layer', layer);

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
});
</script>

<template>
	<div id="cesiumContainer" style="width: 100vw; height: 100vh" />
</template>
