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

/**
 * @see https://cesium.com/blog/2018/01/24/cesium-scene-rendering-performance/
 */
onMounted(() => {
	/* Token */
	Cesium.Ion.defaultAccessToken =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZDk3ZjUxYS0zMzkyLTQ3NWEtYmM1Ny0zMTUxM2ZlMDFjMjMiLCJpZCI6MTczNDg2LCJpYXQiOjE2OTgxMjgzODV9.xSyHyR2dPE4dvRqOh5pl1dFSsTg0zcDyQ0g-82OzqV4';

	viewer = new Cesium.Viewer('cesiumContainer', {
		/* 请求渲染模式 可减少 Cesium 渲染新帧的总时间，并降低 Cesium 在应用程序中的总体 CPU 占用率 */
		requestRenderMode: true,
		maximumRenderTimeChange: Infinity,
	});

	/* 显示渲染 */
	// viewer.scene.requestRender();

	const entity = viewer.entities.add({
		position: Cesium.Cartesian3.fromDegrees(122, 22),
		box: {
			dimensions: new Cesium.Cartesian3(1000000.0, 1000000.0, 30000.0),
			material: Cesium.Color.CORNFLOWERBLUE,
		},
	});
	viewer.zoomTo(viewer.entities);

	let lastPicked;
	let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
	handler.setInputAction((movement) => {
		const pickedObject = viewer.scene.pick(movement.endPosition);
		if (Cesium.defined(pickedObject) && pickedObject.id === entity) {
			if (Cesium.defined(lastPicked)) return;
			entity.box.material = Cesium.Color.RED;
			viewer.scene.requestRender();
			lastPicked = pickedObject;
		} else if (Cesium.defined(lastPicked)) {
			entity.box.material = Cesium.Color.CORNFLOWERBLUE;
			viewer.scene.requestRender();
			lastPicked = undefined;
		}
	}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
});
</script>
