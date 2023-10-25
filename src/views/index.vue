<!-- Cesium Imagery  -->
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
	Cesium.Ion.defaultAccessToken =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZDk3ZjUxYS0zMzkyLTQ3NWEtYmM1Ny0zMTUxM2ZlMDFjMjMiLCJpZCI6MTczNDg2LCJpYXQiOjE2OTgxMjgzODV9.xSyHyR2dPE4dvRqOh5pl1dFSsTg0zcDyQ0g-82OzqV4';

	viewer = new Cesium.Viewer('cesiumContainer', {
		terrain: Cesium.Terrain.fromWorldTerrain({
			requestWaterMask: true,
		}),
	});

	/* 图层更换 */
	// viewer.imageryLayers.remove(viewer.imageryLayers.get(2));
	const blackMarble = Cesium.ImageryLayer.fromProviderAsync(
		Cesium.IonImageryProvider.fromAssetId(2327529)
	);
	viewer.imageryLayers.add(blackMarble);

	// 解决模型光照问题
	viewer.scene.light = new Cesium.DirectionalLight({
		direction: new Cesium.Cartesian3(0.354925, -0.890918, -0.283358),
	});
});
</script>

<style lang="scss" scoped></style>
