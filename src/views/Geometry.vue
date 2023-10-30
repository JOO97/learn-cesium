<!-- Geometry -->
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
			requestVertexNormals: true,
			requestWaterMask: true,
		}),
	});
	// viewer.scene.globe.enableLighting = true;

	viewer.entities.add({
		rectangle: {
			coordinates: Cesium.Rectangle.fromDegrees(-100.0, 20.0, -90.0, 30.0),
			material: new Cesium.StripeMaterialProperty({
				evenColor: Cesium.Color.WHITESMOKE,
				oddColor: Cesium.Color.GREENYELLOW,
				repeat: 5,
			}),
		},
	});
});
</script>
