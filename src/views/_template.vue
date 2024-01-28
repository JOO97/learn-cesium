<script setup>
import { onMounted } from 'vue';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

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

	viewer = new Cesium.Viewer('cesiumContainer', {});

	layer = viewer.scene.imageryLayers;

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
