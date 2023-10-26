<!-- Camera -->
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
	const center = Cesium.Cartesian3.fromRadians(
		2.4213211833389243,
		0.6171926869414084,
		3626.0426275055174
	);
	// viewer.scene.camera.lookAt(center, new Cesium.HeadingPitchRange(0, -Math.PI / 4, 2900));
	const transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
	viewer.scene.camera.lookAtTransform(
		transform,
		new Cesium.HeadingPitchRange(0, -Math.PI / 4, 2900)
	);
	// Orbit this point
	viewer.clock.onTick.addEventListener(function (clock) {
		// viewer.scene.camera.rotateRight(0.005);
	});

	// 不允许镜头到地下
	viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;
});
</script>
