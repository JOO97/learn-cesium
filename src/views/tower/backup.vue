<!-- Tower -->
<template>
	<!-- 容器 -->
	<div id="cesiumContainer" style="width: 100vw; height: 100vh" />
</template>

<script setup>
import { onMounted } from 'vue';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

import towerData from './tower/towers.json';

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
		// terrainProvider: new Cesium.CesiumTerrainProvider({
		// 	url: 'http://data.xtgis.cn/terrain',
		// 	requestWaterMask: true,
		// 	requestVertexNormals: true,
		// }),
		// imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
		// 	url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
		// }),
	});
	// viewer.scene.fxaa = true;
	// viewer.scene.postProcessStages.fxaa.enabled = true;
	// viewer.scene.globe.enableLighting = true;

	addTowers();
});

function addTowers() {
	const labels = viewer.scene.primitives.add(new Cesium.LabelCollection());
	let polylines1 = [];
	let polylines2 = [];
	let polylines3 = [];
	let polylines4 = [];

	towerData.forEach((tower, index) => {
		const position = Cesium.Cartesian3.fromDegrees(tower.longitude, tower.latitude, tower.height);
		const headingPitchRoll = new Cesium.HeadingPitchRoll(
			Cesium.Math.toRadians(tower.degree),
			Cesium.Math.toRadians(0),
			Cesium.Math.toRadians(0)
		);

		let [point1, point2, point3, point4, point5] = getLinkedPositions(position, tower.degree);

		// const point1 = getPositionByHprAndOffset(
		// 	position,
		// 	new Cesium.Cartesian3(0, 9, 51.5),
		// 	headingPitchRoll
		// );

		// const point2 = getPositionByHprAndOffset(
		// 	position,
		// 	new Cesium.Cartesian3(0, -9, 51.5),
		// 	headingPitchRoll
		// );

		// const point3 = getPositionByHprAndOffset(
		// 	position,
		// 	new Cesium.Cartesian3(0, -12, 47.5),
		// 	headingPitchRoll
		// );
		// const point4 = getPositionByHprAndOffset(
		// 	position,
		// 	new Cesium.Cartesian3(0, 12, 47.5),
		// 	headingPitchRoll
		// );

		if (index === 0) {
			polylines1.push(point1);
			polylines2.push(point2);
			polylines3.push(point3);
			polylines4.push(point4);
		} else {
			// var angularityFactor = -5000;
			// var num = 50;
			// var positions = getLinkedPointList(
			// 	polylines1[polylines1.length - 1],
			// 	newPoint1,
			// 	angularityFactor,
			// 	num
			// ); // 计算曲线点
			// polylines1 = polylines1.concat(positions);
			let positions = generateCurve(polylines1[polylines1.length - 1], point1);
			polylines1 = polylines1.concat(positions);

			positions = generateCurve(polylines2[polylines2.length - 1], point2);
			polylines2 = polylines2.concat(positions);

			positions = generateCurve(polylines3[polylines3.length - 1], point3);
			polylines3 = polylines3.concat(positions);

			positions = generateCurve(polylines4[polylines4.length - 1], point4);
			polylines4 = polylines4.concat(positions);

			// positions = generateCurve(polylines5[polylines5.length - 1], point5);
			// polylines5 = polylines5.concat(positions);
		}

		const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, headingPitchRoll);
		const entity = viewer.entities.add({
			position,
			orientation,
			model: {
				uri: '/src/assets/models/tower.glb',
				colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,
				color: Cesium.Color.WHITE, //.withAlpha(0.5),
				scale: 1,
				maximumScale: 1,
			},
		});
		addLabel(labels, position, index + 1);
		if (index === 0) viewer.flyTo(entity);
	});

	console.log('polylines1', polylines1);
	console.log('polylines2', polylines2);
	console.log('polylines3', polylines3);
	console.log('polylines4', polylines4);
	// 绘制路线
	drawGuideLine(polylines1, '#ffffff');
	drawGuideLine(polylines2, '#ffffff');
	drawGuideLine(polylines3, '#0000ff');
	drawGuideLine(polylines4, '#ff0000');
}

function addLabel(labels, position, index) {
	labels.add({
		position: position,
		text: index + '',
		font: '32px Helvetica',
		horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
		verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
		distanceDisplayCondition: new Cesium.DistanceDisplayCondition(90, 50000),
		eyeOffset: new Cesium.Cartesian3(0.0, 80.0, 0.0),
	});
}

function drawGuideLine(positions, color) {
	// var graphic = new mars3d.graphic.PolylinePrimitive({
	// 	positions: positions,
	// 	style: {
	// 		width: 4,
	// 		color: color,
	// 	},
	// });
	// graphicLayer.addGraphic(graphic);
	// const arr = [];
	// positions.forEach((item) => {
	// 	arr.push(item.x);
	// 	arr.push(item.y);
	// 	arr.push(item.z);
	// });
	viewer.entities.add({
		name: 'Blue dashed line',
		polyline: {
			positions,
			width: 4,
			material: new Cesium.Color.fromCssColorString(color),
		},
	});
}

/**
 * 通过原始点, 原始点的hpr, 偏移量计算出新的坐标点
 * @param {*} pos
 * @param {*} offset
 * @param {*} hpr
 */
function getPositionByHprAndOffset(pos, offset, hpr) {
	/* 建立局部坐标 */
	const _localToWorld_Matrix = Cesium.Transforms.eastNorthUpToFixedFrame(pos);

	const _new_ca = Cesium.Matrix4.multiplyByPoint(
		_localToWorld_Matrix,
		Cesium.Cartesian3.fromElements(offset.x, offset.y, offset.z),
		new Cesium.Cartesian3()
	);

	// 计算旋转矩阵
	var rotationMatrix = Cesium.Matrix3.fromHeadingPitchRoll(hpr);

	// 将偏移量应用于旋转矩阵
	var deltaPosition = Cesium.Matrix3.multiplyByVector(
		rotationMatrix,
		offset,
		new Cesium.Cartesian3()
	);

	// 计算下一个点的位置
	var nextPosition = Cesium.Cartesian3.add(pos, deltaPosition, new Cesium.Cartesian3());

	// let rotz = Cesium.Matrix3.fromRotationZ(rad);
	// let rotationZ = Cesium.Matrix4.fromRotationTranslation(rotz);

	// Cesium.Matrix4.multiply(_localToWorld_Matrix, rotationZ, _localToWorld_Matrix);

	// let newPos = Cesium.clone(pos);
	// let transform = Cesium.Transforms.eastNorthUpToFixedFrame(pos); //东-北-上参考系构造出4*4的矩阵
	/*构造平移变换矩阵获取坐标 */
	// let m = new Cesium.Matrix4();
	// Cesium.Matrix4.setTranslation(Cesium.Matrix4.IDENTITY, offset, m); //构造平移矩阵
	// let modelMatrix = Cesium.Matrix4.multiply(transform, m, transform); //平移矩阵左乘当前位置矩阵
	// Cesium.Matrix4.getTranslation(modelMatrix, newPos); //从位置矩阵中取出坐标信息
	// return newPos;
	/*平移向量变换生成新的向量 */
	// newPos = Cesium.Matrix4.multiplyByPoint(transform, offset, new Cesium.Cartesian3(0, 0, 0));
	return nextPosition;
}

/**
 *
 * @param {*} pos1
 * @param {*} pos2
 */
function generateCurve(pos1, pos2) {
	let _0x2918f7 = new Cesium.Cartesian3();
	Cesium.Cartesian3.add(pos1, pos2, _0x2918f7);
	var _0x15348a = new Cesium.Cartesian3();
	Cesium.Cartesian3['divideByScalar'](_0x2918f7, 0x2, _0x15348a),
		((_0x2918f7 = Cesium['Cartographic']['fromCartesian'](_0x15348a))['height'] =
			0.98 * _0x2918f7['height'] - 0.05 * Cesium.Cartesian3['distance'](pos1, pos2)),
		(_0x15348a = new Cesium.Cartesian3()),
		Cesium['Ellipsoid']['WGS84']['cartographicToCartesian'](_0x2918f7, _0x15348a);
	for (
		var _0x8b45e1 = new Cesium['CatmullRomSpline']({
				times: [0x0, 0.5, 0x1],
				points: [pos1, _0x15348a, pos2],
			}),
			_0x2f47cc = [],
			_0x4ac740 = 0x0;
		_0x4ac740 < 0xc8;
		_0x4ac740++
	)
		_0x2f47cc['push'](_0x8b45e1['evaluate'](_0x4ac740 / 0xc8));
	return _0x2f47cc;
}

/**
 * 通过原始点, 原始点的hpr, 偏移量计算出新的坐标点
 * @param {*} pos
 * @param {*} offset
 * @param {*} hpr
 */
function getPositionByOffsetAndAngle(pos, offset, angle) {
	var _0x361d50 = Cesium['Transforms']['eastNorthUpToFixedFrame'](pos),
		pos = Cesium['Matrix4']['multiplyByTranslation'](_0x361d50, offset, new Cesium['Matrix4']()),
		offset = Cesium['Matrix4']['getTranslation'](pos, new Cesium['Cartesian3']()),
		pos = Cesium['Matrix4']['inverse'](_0x361d50, new Cesium['Cartesian4']()),
		pos = Cesium['Matrix4']['multiplyByPoint'](pos, offset, new Cesium['Cartesian3']()),
		angle = Cesium['Matrix3']['fromRotationZ'](Cesium['Math']['toRadians'](-angle)),
		pos = Cesium['Matrix3']['multiplyByVector'](angle, pos, new Cesium['Cartesian3']());
	return (offset = Cesium['Matrix4']['multiplyByPoint'](
		_0x361d50,
		pos,
		new Cesium['Cartesian3']()
	));
}

function getLinkedPositions(position, angle) {
	return [
		getPositionByOffsetAndAngle(
			position,
			new Cesium.Cartesian3(-0.025005, 0.022878, 39.540545),
			angle
		),
		getPositionByOffsetAndAngle(
			position,
			new Cesium.Cartesian3(-0.024999, 15.009109, 39.303012),
			angle
		),
		getPositionByOffsetAndAngle(
			position,
			new Cesium.Cartesian3(-0.025001, -15.009585, 39.301099),
			angle
		),
		getPositionByOffsetAndAngle(
			position,
			new Cesium.Cartesian3(0.341789, 16.837972, 50.717621),
			angle
		),
		getPositionByOffsetAndAngle(
			position,
			new Cesium.Cartesian3(0.34241, -16.838163, 50.717617),
			angle
		),
	];
}
</script>
