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
		timeline: false,
		shouldAnimate: false,
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
	const pos = Cesium.Cartesian3.fromDegrees(longitude, latitude, 6000);
	/* setView */
	viewer.camera.setView({
		destination: pos,
		orientation: {
			heading: Cesium.Math.toRadians(0),
			pitch: Cesium.Math.toRadians(-45),
			roll: 0,
		},
	});

	/* lookAt */
	// const center = Cesium.Cartesian3.fromRadians(
	// 	2.4213211833389243,
	// 	0.6171926869414084,
	// 	3626.0426275055174
	// );
	// /* eastNorthUp 对应 x,y,x */
	// const transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
	// viewer.scene.camera.lookAtTransform(
	// 	transform,
	// 	new Cesium.HeadingPitchRange(0, -Math.PI / 4, 2900)
	// );
	// // Orbit this point
	// viewer.clock.onTick.addEventListener(function (clock) {
	// 	// viewer.scene.camera.rotateRight(0.005);
	// });

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

	/**
	 * Material
	 */
	const stripeMaterial = new Cesium.StripeMaterialProperty({
		evenColor: Cesium.Color.WHITE.withAlpha(0.5),
		oddColor: Cesium.Color.BLUE.withAlpha(0.5),
		repeat: 5.0,
	});

	/* Add label billboard Point */
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

	/* polygon */
	const polygon = viewer.entities.add({
		polygon: {
			hierarchy: Cesium.Cartesian3.fromDegreesArray([
				118.103267, 24.462255, 118.094003, 24.473385, 118.089611, 24.459878, 118.099767, 24.447496,
				118.118569, 24.44712, 118.13291, 24.452436, 118.137782, 24.461817, 118.12646, 24.470759,
				118.103267, 24.462255,
			]),
			material: Cesium.Color.fromRandom({ alpha: 0 }),
			height: 100.0,
			// heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
			extrudedHeight: 1000.0,
			// extrudedHeightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
			outline: false,
			outlineColor: Cesium.Color.WHITE,
			outlineWidth: 4,
		},
	});

	/* rectangle */
	let rotation = Cesium.Math.toRadians(30);
	function getRotationValue() {
		rotation += 0.005;
		return rotation;
	}
	const rectangle = viewer.entities.add({
		rectangle: {
			coordinates: Cesium.Rectangle.fromDegrees(118.103267, 24.468895, 118.176574, 24.508847),
			outline: true,
			outlineColor: Cesium.Color.WHITE,
			outlineWidth: 4,
			rotation: 0.0, // 矩形从北方向顺时针方向的旋转
			// stRotation: Cesium.Math.toRadians(45), //纹理从北方逆时针旋转
			stRotation: new Cesium.CallbackProperty(getRotationValue, false),
			// material: stripeMaterial,
			material: 'texture/Fire.png',
		},
	});

	/* 椭圆(面) */
	const ellipse = viewer.entities.add({
		position: Cesium.Cartesian3.fromDegrees(118.103267, 24.468895),
		ellipse: {
			semiMinorAxis: 50.0,
			semiMajorAxis: 50.0,
			rotation: Cesium.Math.toRadians(-40.0),
			outline: true,
			outlineColor: Cesium.Color.WHITE,
			outlineWidth: 4,
			stRotation: Cesium.Math.toRadians(22),
			material: stripeMaterial,
		},
	});

	/* box */
	const box = viewer.entities.add({
		position: Cesium.Cartesian3.fromDegrees(118.107416, 24.485191, 0.0),
		box: {
			dimensions: new Cesium.Cartesian3(40.0, 30.0, 50.0),
			material: Cesium.Color.fromRandom({ alpha: 1.0 }),
			heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
		},
	});

	/* wall */
	const wall = viewer.entities.add({
		wall: {
			positions: Cesium.Cartesian3.fromDegreesArray([
				118.09442, 24.501614, 118.126534, 24.499614, 118.161119, 24.498613,
			]),
			maximumHeights: [500, 500, 500],
			minimumHeights: [0, 400, 0],
			outline: true,
			outlineColor: Cesium.Color.LIGHTGRAY,
			outlineWidth: 4,
			material: Cesium.Color.fromRandom({ alpha: 0.7 }),
		},
	});

	/* 圆柱 */
	const cylinder = viewer.entities.add({
		position: Cesium.Cartesian3.fromDegrees(118.09678, 24.481108, 0.0),
		cylinder: {
			hierarchy: new Cesium.PolygonHierarchy(
				Cesium.Cartesian3.fromDegreesArray([-118.0, 30.0, -115.0, 30.0, -117.1, 31.1, -118.0, 33.0])
			),
			length: 50.0,
			topRadius: 20.0,
			bottomRadius: 20.0,
			material: Cesium.Color.fromRandom({ alpha: 1.0 }),
			heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
		},
	});

	/* 椭圆 */
	const ellipsoid = viewer.entities.add({
		position: Cesium.Cartesian3.fromDegrees(118.12678, 24.481108, 0.0),
		ellipsoid: {
			radii: new Cesium.Cartesian3(20.0, 15.0, 25.0),
			material: Cesium.Color.fromRandom({ alpha: 1.0 }),
			heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
		},
	});

	/* holes */
	const holes = viewer.entities.add({
		polygon: {
			hierarchy: {
				positions: Cesium.Cartesian3.fromDegreesArray([
					118.113405, 24.469327, 118.136461, 24.469327, 118.139069, 24.449659, 118.112582,
					24.448471, 118.113439, 24.469389,
				]),
				holes: [
					{
						positions: Cesium.Cartesian3.fromDegreesArray([
							118.117713, 24.466178, 118.130922, 24.465303, 118.131437, 24.457392, 118.116306,
							24.456798, 118.117747, 24.466147,
						]),
						holes: [
							{
								positions: Cesium.Cartesian3.fromDegreesArray([
									118.108571, 24.475389, 118.102258, 24.46751, 118.102738, 24.458943, 118.107473,
									24.454565, 118.119962, 24.461381, 118.122912, 24.473012, 118.108571, 24.475389,
								]),
								holes: [
									{
										positions: Cesium.Cartesian3.fromDegreesArray([
											118.109738, 24.469511, 118.114335, 24.464571, 118.105552, 24.461256,
											118.104454, 24.465446, 118.110218, 24.470011, 118.109875, 24.469198,
										]),
									},
								],
							},
						],
					},
				],
			},
			material: stripeMaterial,
		},
	});

	/* corridor 走廊 */
	const corridor = viewer.entities.add({
		corridor: {
			positions: Cesium.Cartesian3.fromDegreesArray([
				118.080821, 24.499052, 118.071626, 24.47992, 118.084801, 24.465038,
			]),
			width: 500,
			height: 0, // 矩形相对于椭球面的高度
			extrudedHeight: 100, // 矩形的拉伸面相对于椭球面的高度
			material: Cesium.Color.fromRandom({ alpha: 1 }),
			outline: true,
			outlineColor: Cesium.Color.WHITE,
			outlineWidth: 4,
		},
	});

	/* plane */
	const redPlane = viewer.entities.add({
		name: 'Red plane with black outline',
		position: Cesium.Cartesian3.fromDegrees(118.095434, 24.515401, 3000.0),
		plane: {
			plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_Y, 0.0),
			dimensions: new Cesium.Cartesian2(400000.0, 300000.0),
			material: Cesium.Color.RED.withAlpha(0.5),
			outline: true,
			outlineColor: Cesium.Color.BLACK,
		},
	});

	/* polyline */
	const polyline = viewer.entities.add({
		name: 'Wide blue dashed line with a gap color',
		polyline: {
			positions: Cesium.Cartesian3.fromDegreesArrayHeights([
				118.131148, 24.469292, 1000, 118.166281, 24.470168, 1000,
			]),
			width: 30,
			material: new Cesium.PolylineDashMaterialProperty({
				color: Cesium.Color.BLUE,
				gapColor: Cesium.Color.YELLOW,
			}),
		},
	});

	/* 贴地线 */
	const polyline2 = viewer.entities.add({
		name: 'Red line on terrain',
		polyline: {
			positions: Cesium.Cartesian3.fromDegreesArray([118.131148, 24.469292, 118.166281, 24.470168]),
			material: Cesium.Color.RED,
			clampToGround: true,
		},
	});

	/* 垂直线 */
	const greenRhumbLine = viewer.entities.add({
		name: 'Green rhumb line',
		polyline: {
			positions: Cesium.Cartesian3.fromDegreesArray([118.119518, 24.461257, 118.168375, 24.460881]),
			width: 50,
			arcType: Cesium.ArcType.RHUMB,
			material: Cesium.Color.GREEN,
		},
	});

	/* 箭头 */
	const purpleArrow = viewer.entities.add({
		name: 'Purple straight arrow at height',
		polyline: {
			positions: Cesium.Cartesian3.fromDegreesArrayHeights([
				118.119518, 24.461257, 500, 118.168375, 24.460881, 500,
			]),
			width: 10,
			arcType: Cesium.ArcType.NONE,
			material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.PURPLE),
		},
	});

	/* polylineVolume 多线段柱体 类似Shape*/
	function starPositions(arms, rOuter, rInner) {
		const angle = Math.PI / arms;
		const pos = [];
		for (let i = 0; i < 2 * arms; i++) {
			const r = i % 2 === 0 ? rOuter : rInner;
			const p = new Cesium.Cartesian2(Math.cos(i * angle) * r, Math.sin(i * angle) * r);
			pos.push(p);
		}
		return pos;
	}
	const polylineVolume = viewer.entities.add({
		polylineVolume: {
			positions: Cesium.Cartesian3.fromDegreesArrayHeights([
				118.094485, 24.527952, 100, 118.119188, 24.527202, 100, 118.143068, 24.527827, 100,
				118.16187, 24.527077, 100,
			]),
			shape: starPositions(7, 30000.0, 20000.0),
			outline: true,
			outlineColor: Cesium.Color.WHITE,
			outlineWidth: 1,
			material: Cesium.Color.fromRandom({ alpha: 1.0 }),
		},
	});
	function computeCircle(radius) {
		const positions = [];
		for (let i = 0; i < 360; i++) {
			const radians = Cesium.Math.toRadians(i);
			positions.push(new Cesium.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)));
		}
		return positions;
	}
	const polylineVolume2 = viewer.entities.add({
		polylineVolume: {
			positions: Cesium.Cartesian3.fromDegreesArrayHeights([
				118.094485, 24.527952, 100, 118.119188, 24.527202, 100, 118.143068, 24.527827, 100,
				118.16187, 24.527077, 100,
			]),
			shape: computeCircle(4000.0),
			material: Cesium.Color.WHITE,
		},
	});

	// 添加3D建筑
	// const osmBuildings = viewer.scene.primitives.add(await Cesium.createOsmBuildingsAsync());

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
	// viewer.trackedEntity = polylineVolume;
	viewer.zoomTo(viewer.entities);
	/**
	 * 绘制动态点
	 */
	// addAnimatedPoint(viewer);
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
		 * blog: [Clamp To 3DModel] https://blog.csdn.net/luoyun620/article/details/107609874
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
