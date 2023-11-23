<!-- Entity -->
<template>
	<!-- 容器 -->
	<div id="cesiumContainer" style="width: 100vw; height: 100vh" />
</template>

<script setup>
import { onMounted } from 'vue';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { point } from '@turf/turf';

window.Cesium = Cesium;

let viewer = null;

const longitude = 118.127582;
const latitude = 24.457932;
const objectsToExclude = [];
const cartographic = new Cesium.Cartographic();
const range = 0.000001;
const duration = 4.0;
let p = null;

onMounted(async () => {
	/* Token */
	Cesium.Ion.defaultAccessToken =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZDk3ZjUxYS0zMzkyLTQ3NWEtYmM1Ny0zMTUxM2ZlMDFjMjMiLCJpZCI6MTczNDg2LCJpYXQiOjE2OTgxMjgzODV9.xSyHyR2dPE4dvRqOh5pl1dFSsTg0zcDyQ0g-82OzqV4';

	/* 默认视角 */
	Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
		117.861711,
		24.363349,
		118.236017,
		24.663633
	);

	viewer = new Cesium.Viewer('cesiumContainer', {
		infoBox: false, //信息窗口
		// 是否显示查询按钮
		geocoder: false,
		// 不显示home按钮
		homeButton: false,
		// 控制查看器的显示模式
		sceneModePicker: false,
		// 是否显示图层选择
		baseLayerPicker: false,
		// 是否显示帮助按钮
		navigationHelpButton: false,
		// 是否播放动画
		animation: false,
		// 是否显示时间轴
		timeline: true,
		shouldAnimate: true,
		// 是否显示全屏按钮
		fullscreenButton: true,
		/* 默认地形 */
		terrain: Cesium.Terrain.fromWorldTerrain({
			requestVertexNormals: true, //光照效果
			requestWaterMask: false, //水文贴图
		}),
	});

	/* NOTE: 开启地形深度测试 */
	viewer.scene.globe.depthTestAgainstTerrain = true;

	/**
	 * Camera
	 */
	const pos = Cesium.Cartesian3.fromDegrees(longitude, latitude, 1000);
	/* setView */
	viewer.camera.setView({
		destination: pos,
		orientation: {
			heading: Cesium.Math.toRadians(0),
			pitch: Cesium.Math.toRadians(-45),
			roll: 0,
		},
	});

	/**
	 * 通过按键移动相机
	 */
	document.addEventListener('keydown', (e) => {
		// 获取相机离地面的高度
		var height = viewer.camera.positionCartographic.height;
		var moveRate = height / 100;
		if (e.key == 'w') {
			// 设置相机向前移动
			viewer.camera.moveForward(moveRate);
		} else if (e.key == 's') {
			// 设置相机向后移动
			viewer.camera.moveBackward(moveRate);
		} else if (e.key == 'a') {
			// 设置相机向左移动
			viewer.camera.moveLeft(moveRate);
		} else if (e.key == 'd') {
			// 设置相机向右移动
			viewer.camera.moveRight(moveRate);
		} else if (e.key == 'q') {
			// 设置相机向左旋转相机
			viewer.camera.lookLeft(Cesium.Math.toRadians(0.1));
		} else if (e.key == 'e') {
			// 设置相机向右旋转相机
			viewer.camera.lookRight(Cesium.Math.toRadians(0.1));
		} else if (e.key == 'r') {
			// 设置相机向上旋转相机
			viewer.camera.lookUp(Cesium.Math.toRadians(0.1));
		} else if (e.key == 'f') {
			// 设置相机向下旋转相机
			viewer.camera.lookDown(Cesium.Math.toRadians(0.1));
		} else if (e.key == 'g') {
			// 向左逆时针翻滚
			viewer.camera.twistLeft(Cesium.Math.toRadians(0.1));
		} else if (e.key == 'h') {
			// 向右顺时针翻滚
			viewer.camera.twistRight(Cesium.Math.toRadians(0.1));
		}
	});

	addEntities(viewer);
});

/**
 * 添加Entities
 * @param {*} viewer
 */
const addEntities = async (viewer) => {
	const image = new Image();
	image.src = 'texture/gzt.png';
	const entity = viewer.entities.add({
		position: Cesium.Cartesian3.fromDegrees(118.080109, 24.437955, 0),
		/* label */
		label: {
			text: 'xxxx',
			font: '24px sans-serif',
			fillColor: Cesium.Color.WHITE,
			outlineColor: Cesium.Color.BLACK,
			outlineWidth: 4,
			// FILL填充文字，OUTLINE勾勒标签，FILL_AND_OUTLINE填充文字和勾勒标签
			style: Cesium.LabelStyle.FILL_AND_OUTLINE,
			// 设置文字的偏移量
			pixelOffset: new Cesium.Cartesian2(0, -24),
			// 设置文字的显示位置,LEFT /RIGHT /CENTER
			horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
			// 设置文字的显示位置
			verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
			showBackground: true,
		},
		/* billboard */
		billboard: {
			// scaleByDistance: new Cesium.NearFarScalar(1.5e2, 5.0, 1.5e7, 0.5),
			image,
			width: 100,
			height: 100,
			verticalOrigin: Cesium.VerticalOrigin.TOP,
			horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
		},
		/* point */
		point: {
			pixelSize: 10,
			color: Cesium.Color.RED,
			outlineColor: Cesium.Color.WHITE,
			outlineWidth: 4,
		},
	});
	console.log('entity', entity);

	// 添加3D建筑
	const osmBuildings = viewer.scene.primitives.add(await Cesium.createOsmBuildingsAsync());

	/* Add Model */
	const airplane = viewer.entities.add({
		name: 'Airplane',
		position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 0),
		model: {
			uri: 'model/GroundVehicle.glb',
			// 最小像素
			minimumPixelSize: 128,
			// 飞机的轮廓
			silhouetteSize: 5,
			// 轮廓的颜色
			silhouetteColor: Cesium.Color.WHITE,
			// 相机距离模型多远的距离显示
			distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000),
			// 颜色
			color: Cesium.Color.RED,
			colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,
			colorBlendAmount: 0.5,
		},
	});
	viewer.trackedEntity = airplane;

	/**
	 * 绘制动态点
	 */
	addAnimatedPoint(viewer);
};

/**
 * 更新位置
 * @param {*} time
 * @param {*} result
 * @param {*} viewer
 * @param {*} model
 */
const updatePoint = (time, result) => {
	if (!p) return;
	const offset = (time.secondsOfDay % duration) / duration;

	// var carto = Cesium.Cartographic.fromDegrees(longitude, latitude, 0);
	// cartographic.longitude = carto.longitude - range + offset * range * 2.0;
	// cartographic.latitude = carto.latitude;

	const lng = Cesium.Math.toRadians(longitude);
	const lat = Cesium.Math.toRadians(latitude);
	cartographic.longitude = lng - range + offset * range * 2.0;
	cartographic.latitude = lat;

	let height;
	if (viewer.scene.sampleHeightSupported) {
		/**
		 * sampleHeight
		 * NOTE: 贴地计算
		 */
		height = viewer.scene.sampleHeight(cartographic, objectsToExclude);
	}

	if (Cesium.defined(height)) {
		cartographic.height = height;
		p.label.text = `${Math.abs(height).toFixed(2).toString()} m`;
		p.label.show = true;
	} else {
		cartographic.height = 0.0;
		p.label.show = false;
	}

	return Cesium.Cartographic.toCartesian(cartographic, Cesium.Ellipsoid.WGS84, result);
};

const addAnimatedPoint = (viewer, model) => {
	const _point = viewer.entities.add({
		name: 'AnimatedPoint',
		position: new Cesium.CallbackProperty(updatePoint, false),
		point: {
			pixelSize: 10,
			color: Cesium.Color.RED,
			disableDepthTestDistance: Number.POSITIVE_INFINITY,
		},
		label: {
			show: false,
			showBackground: true,
			font: '14px monospace',
			horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
			verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
			pixelOffset: new Cesium.Cartesian2(5, 5),
			disableDepthTestDistance: Number.POSITIVE_INFINITY,
		},
	});
	p = _point;
	objectsToExclude[0] = _point;
};
</script>
