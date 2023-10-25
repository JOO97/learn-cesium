<template>
	<!-- 容器 -->
	<div id="cesiumContainer" style="width: 100vw; height: 100vh"></div>
</template>

<script setup>
import { onMounted } from 'vue';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

import flightDataJson from './flightData.json';
window.Cesium = Cesium;
console.log(Cesium);

onMounted(async () => {
	// Access Token
	Cesium.Ion.defaultAccessToken =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZDk3ZjUxYS0zMzkyLTQ3NWEtYmM1Ny0zMTUxM2ZlMDFjMjMiLCJpZCI6MTczNDg2LCJpYXQiOjE2OTgxMjgzODV9.xSyHyR2dPE4dvRqOh5pl1dFSsTg0zcDyQ0g-82OzqV4';

	// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
	const viewer = new Cesium.Viewer('cesiumContainer', {
		//加载地形
		terrain: Cesium.Terrain.fromWorldTerrain({
			requestWaterMask: true,
		}),
		// infoBox: true,
	});

	/* 图层更换 */
	viewer.imageryLayers.remove(viewer.imageryLayers.get(2));
	const imageryLayer = Cesium.ImageryLayer.fromProviderAsync(
		Cesium.IonImageryProvider.fromAssetId(3)
	);
	viewer.imageryLayers.add(imageryLayer);

	// Add Cesium OSM Buildings, a global 3D buildings layer.
	const buildingTileset = await Cesium.createOsmBuildingsAsync();
	viewer.scene.primitives.add(buildingTileset);

	/* NOTE: 坐标转换问题 https://blog.csdn.net/NOSaac/article/details/124759179
	 *  cartographic: 弧度制表示的地理坐标系。使用（经度，纬度，大地高）表示。
	 *  Cartesian3: 笛卡尔空间坐标系统 WGS84
	 *  Cartesian2: 屏幕坐标
	 */
	const dataPoint = { longitude: -122.38985, latitude: 37.61864, height: -27.32 };
	//经纬度(Degrees)
	const lngLat = new Cesium.Cartographic(122, 24, 10);
	console.log(lngLat);
	//从经纬度获取弧度坐标
	console.log('Cartographic.fromDegrees', new Cesium.Cartographic.fromDegrees(122, 24, 10));
	//经纬度转笛卡尔空间坐标系
	console.log('Cartesian3.fromDegrees', Cesium.Cartesian3.fromDegrees(122, 24, 10));

	// 创建一个点
	const pointEntity = viewer.entities.add({
		description: `First data point at (${dataPoint.longitude}, ${dataPoint.latitude})`,
		position: Cesium.Cartesian3.fromDegrees(
			dataPoint.longitude,
			dataPoint.latitude,
			dataPoint.height
		),
		point: { pixelSize: 10, color: Cesium.Color.RED },
	});
	viewer.flyTo(pointEntity);

	//飞行路线
	const flightData = flightDataJson;
	//时间
	const timeStepInSeconds = 30;
	const totalSeconds = timeStepInSeconds * (flightData.length - 1);
	const start = Cesium.JulianDate.fromIso8601('2020-03-09T23:10:00Z');
	const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());
	/* NOTE: cesium在容器初始化时都会自动把clock对象挂载到容器对象上 */
	viewer.clock.startTime = start.clone();
	viewer.clock.stopTime = stop.clone();
	viewer.clock.currentTime = start.clone();

	/**
	 * widgets: Timeline
	 * @see https://github.com/CesiumGS/cesium/blob/1.110/packages/widgets/Source/Timeline/Timeline.js
	 */
	viewer.timeline.zoomTo(start, stop);
	// var date = new Date();
	// var h = 0 - date.getTimezoneOffset();
	// viewer.timeline.makeLabel = function (e) {
	// 	return Cesium.JulianDate.toIso8601(e.addHours(h), 0);
	// };

	// Speed up the playback speed 50x.
	viewer.clock.multiplier = 50;
	// Start playing the scene.
	viewer.clock.shouldAnimate = true;

	const positionProperty = new Cesium.SampledPositionProperty();

	/* 飞行路线点 */
	for (let i = 0; i < flightData.length; i++) {
		const dataPoint = flightData[i];

		// Declare the time for this individual sample and store it in a new JulianDate instance.
		const time = Cesium.JulianDate.addSeconds(
			start,
			i * timeStepInSeconds,
			new Cesium.JulianDate()
		);
		const position = Cesium.Cartesian3.fromDegrees(
			dataPoint.longitude,
			dataPoint.latitude,
			dataPoint.height
		);
		// Store the position along with its timestamp.
		// Here we add the positions all upfront, but these can be added at run-time as samples are received from a server.
		positionProperty.addSample(time, position);

		viewer.entities.add({
			description: `Location: (${dataPoint.longitude}, ${dataPoint.latitude}, ${dataPoint.height})`,
			position: position,
			point: { pixelSize: 10, color: Cesium.Color.RED },
		});
	}

	// const airplaneEntity = viewer.entities.add({
	// 	availability: new Cesium.TimeIntervalCollection([
	// 		new Cesium.TimeInterval({ start: start, stop: stop }),
	// 	]),
	// 	position: positionProperty,
	// 	point: { pixelSize: 30, color: Cesium.Color.GREEN },
	// 	path: new Cesium.PathGraphics({ width: 3 }),
	// });
	// // Make the camera track this moving entity.
	// viewer.trackedEntity = airplaneEntity;

	/* Load airplane modle from asset id */
	const airplaneUri = await Cesium.IonResource.fromAssetId('2326173');
	const airplaneEntity = viewer.entities.add({
		availability: new Cesium.TimeIntervalCollection([
			new Cesium.TimeInterval({ start: start, stop: stop }),
		]),
		position: positionProperty,
		// Attach the 3D model instead of the green point.
		model: { uri: airplaneUri },
		// Automatically compute the orientation from the position.
		orientation: new Cesium.VelocityOrientationProperty(positionProperty),
		path: new Cesium.PathGraphics({ width: 3 }),
	});
	/* Set track entity */
	// viewer.trackedEntity = airplaneEntity; // Fly the camera to San Francisco at the given longitude, latitude, and height.

	// viewer.camera.flyTo({
	// 	// 118.140924, 24.479168
	// 	//-122.4175, 37.655
	// 	destination: Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 400),
	// 	orientation: {
	// 		heading: Cesium.Math.toRadians(0.0),
	// 		pitch: Cesium.Math.toRadians(-15.0),
	// 	},
	// });
});
</script>

<style lang="scss" scoped></style>
