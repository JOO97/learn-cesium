<script setup>
/**
 * Camera
 */
import { onMounted } from 'vue';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

window.Cesium = Cesium;

let viewer = null,
	layer = null,
	camera = null;

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
	// Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
	// 	117.861711,
	// 	24.363349,
	// 	118.236017,
	// 	24.663633
	// );

	viewer = new Cesium.Viewer('cesiumContainer', {});
	layer = viewer.scene.imageryLayers;
	camera = viewer.camera;

	Camera();

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

const Camera = () => {
	console.log('camera', camera);

	const heading = camera.heading; //绕y
	const pitch = camera.pitch; //绕x
	const roll = camera.roll; //绕z

	const position = camera.positionCartographic; //地理坐标
	const worldC = camera.positionWC; //世界坐标-xyz

	/* Methods: setView 设置相机的位置和方向 - 不带动画  */
	// camera.setView({
	// 	destination: new Cesium.Cartesian3.fromDegrees(117.8311, 24.4243, 500),
	// 	orientation: {
	// 		heading: Cesium.Math.toRadians(90), //默认90 朝向
	// 		pitch: Cesium.Math.toRadians(-45), //默认-90 俯仰角
	// 		roll: Cesium.Math.toRadians(0), //默认0
	// 	},
	// });

	/* Methods: flyTo */
	//1
	camera.flyTo({
		destination: new Cesium.Cartesian3.fromDegrees(117.8311, 24.4243, 500),
		orientation: {
			heading: Cesium.Math.toRadians(90),
			pitch: Cesium.Math.toRadians(-45),
			roll: Cesium.Math.toRadians(0),
		},
		pitchAdjustHeight: 1000,
		complete: function () {
			setTimeout(function () {
				camera.flyTo({
					destination: Cesium.Cartesian3.fromDegrees(
						-73.98585975679403,
						40.75759944127251,
						186.50838555841779
					),
					orientation: {
						heading: Cesium.Math.toRadians(200.0),
						pitch: Cesium.Math.toRadians(-50.0),
					},
					/* 如果相机飞行高于该值，调整飞行过程中的俯仰角，以向下观察，并保持地球在视野中。 */
					pitchAdjustHeight: 1000,
					easingFunction: Cesium.EasingFunction.LINEAR_NONE,
					duration: 20,
				});
				/* Fly to location */
				// const fly = (position) => {
				// 	camera.flyTo({
				// 		destination: Cesium.Cartesian3.fromDegrees(
				// 			position.coords.longitude,
				// 			position.coords.latitude,
				// 			1000.0
				// 		),
				// 	});
				// };
				// navigator.geolocation.getCurrentPosition(fly);
			}, 1000);
		},
	});

	//2 fly to rectangle
	// const west = 120.0;
	// const south = 22.0;
	// const east = 130.0;
	// const north = 29.0;
	// const rectangle = Cesium.Rectangle.fromDegrees(west, south, east, north);
	// camera.setView({
	// 	destination: rectangle,
	// });

	// viewer.entities.add({
	// 	rectangle: {
	// 		coordinates: rectangle,
	// 		fill: false,
	// 		outline: true,
	// 		outlineColor: Cesium.Color.WHITE,
	// 	},
	// });

	/* TODO:设置相机参考框架 */
	// setCameraReferenceFrame();

	/* view in Icrf */
	// viewInIcrf();

	/* Events */
	// cameraEvents();

	/* cancelFly / completeFly */
	// camera.completeFlight();
	// camera.cancelFlight();
};

/**
 * 设置相机参考框架
 */
const setCameraReferenceFrame = () => {
	/* 设置中心 */
	const center = Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883);
	/* 建立东北天（East-North-Up, ENU）参考框架 */
	const transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
	camera.constrainedAxis = Cesium.Cartesian3.UNIT_Z;
	camera.lookAtTransform(transform, new Cesium.Cartesian3(-120000.0, -120000.0, 120000.0));

	/* 添加参考框架 */
	referenceFramePrimitive = viewer.scene.primitives.add(
		new Cesium.DebugModelMatrixPrimitive({
			modelMatrix: transform,
			length: 100000.0,
		})
	);
};

/**
 * 切换视角到 ICRF 参考框架
 */
const viewInIcrf = () => {
	return;
	function icrf(scene, time) {
		if (scene.mode !== Cesium.SceneMode.SCENE3D) {
			return;
		}

		const icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(time);
		if (Cesium.defined(icrfToFixed)) {
			const camera = viewer.camera;
			const offset = Cesium.Cartesian3.clone(camera.position);
			const transform = Cesium.Matrix4.fromRotationTranslation(icrfToFixed);
			camera.lookAtTransform(transform, offset);
		}
	}
	camera.flyHome(0);
	viewer.clock.multiplier = 3 * 60 * 60;
	viewer.scene.postUpdate.addEventListener(icrf);
	viewer.scene.globe.enableLighting = true;
};

const cameraEvents = () => {
	camera.moveStart.addEventListener(function () {
		console.log('moveStart');
	});
	camera.moveEnd.addEventListener(function () {
		console.log('moveEnd');
	});

	camera.changed.addEventListener(function (percentage) {
		console.log('camera changed', percentage);
	}, Cesium.Math.toRadians(1.0)); // 当相机移动超过1度时触发);
};
</script>

<template>
	<div id="cesiumContainer" style="width: 100vw; height: 100vh" />
</template>
