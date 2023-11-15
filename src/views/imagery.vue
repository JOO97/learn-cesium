<!-- Cesium Imagery  -->
<template>
	<!-- 容器 -->
	<div id="cesiumContainer" style="width: 100vw; height: 100vh" />
</template>

<script setup>
import { onMounted } from 'vue';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

import GCJ02TilingScheme from '../core/gcj02TilingScheme';

window.Cesium = Cesium;

let viewer = null;

onMounted(async () => {
	Cesium.Ion.defaultAccessToken =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZDk3ZjUxYS0zMzkyLTQ3NWEtYmM1Ny0zMTUxM2ZlMDFjMjMiLCJpZCI6MTczNDg2LCJpYXQiOjE2OTgxMjgzODV9.xSyHyR2dPE4dvRqOh5pl1dFSsTg0zcDyQ0g-82OzqV4';

	viewer = new Cesium.Viewer('cesiumContainer', {
		terrain: Cesium.Terrain.fromWorldTerrain({
			requestWaterMask: true,
		}),

		// baseLayer: Cesium.ImageryLayer.fromWorldImagery({
		// 	style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS,
		// }),
		baseLayerPicker: false,
	});

	const layer = viewer.scene.imageryLayers;

	/* 图层叠加 */
	// const blackMarble = Cesium.ImageryLayer.fromProviderAsync(
	// 	Cesium.IonImageryProvider.fromAssetId(2327554)
	// );
	// blackMarble.alpha = 0.5;
	// blackMarble.brightness = 2.0;
	// layer.add(blackMarble);

	// const logoImagery = Cesium.ImageryLayer.fromProviderAsync(
	// 	Cesium.SingleTileImageryProvider.fromUrl(
	// 		'../../src/assets/images/Cesium_Logo_Color_Overlay.png',
	// 		{
	// 			rectangle: Cesium.Rectangle.fromDegrees(-75.0, 28.0, -67.0, 29.75),
	// 		}
	// 	)
	// );
	// layer.add(logoImagery);

	/**
	 * 加载高德瓦片服务
	 */
	const aMap = new Cesium.UrlTemplateImageryProvider({
		url: 'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
		maximumLevel: 18,
		minimumLevel: 1,
		credit: 'Amap',
		tilingScheme: new GCJ02TilingScheme(), //坐标系转换
	});
	layer.addImageryProvider(aMap);

	/* Add Billboard */
	addBillboard();
});

/* Add Billboard */
function addBillboard() {
	const billboard = viewer.entities.add({
		position: Cesium.Cartesian3.fromDegrees(118.096697, 24.440254),
		// billboard: {
		// 	image: '../../src/assets/images/Cesium_Logo_Color_Overlay.png',
		// 	width: 100,
		// 	height: 25,
		// },
		point: { pixelSize: 20, color: Cesium.Color.RED },
	});
	viewer.flyTo(billboard);
}
</script>

<style lang="scss" scoped></style>
