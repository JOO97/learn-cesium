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
		console.log('=========', tower);
		const position = Cesium.Cartesian3.fromDegrees(tower.longitude, tower.latitude, tower.height);
		const headingPitchRoll = new Cesium.HeadingPitchRoll(
			Cesium.Math.toRadians(tower.degree),
			Cesium.Math.toRadians(0),
			Cesium.Math.toRadians(0)
		);

		// let [point1, point2, point3, point4] = getLinkedPositions(position, tower.degree);

		// if (index === 0) {
		// 	polylines1.push(point1);
		// 	polylines2.push(point2);
		// 	polylines3.push(point3);
		// 	polylines4.push(point4);
		// } else {
		// 	let positions = generateCurve(polylines1[polylines1.length - 1], point1);
		// 	polylines1 = polylines1.concat(positions);

		// 	positions = generateCurve(polylines2[polylines2.length - 1], point2);
		// 	polylines2 = polylines2.concat(positions);

		// 	positions = generateCurve(polylines3[polylines3.length - 1], point3);
		// 	polylines3 = polylines3.concat(positions);

		// 	positions = generateCurve(polylines4[polylines4.length - 1], point4);
		// 	polylines4 = polylines4.concat(positions);
		// }

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

	// 绘制路线
	// drawGuideLine(polylines1, '#ffffff');
	// drawGuideLine(polylines2, '#00ff00');
	// drawGuideLine(polylines3, '#0000ff');
	// drawGuideLine(polylines4, '#ff0000');
}

/**
 * Add Labels
 * @param {*} labels
 * @param {*} position
 * @param {*} index
 */
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

/**
 * Draw line
 * @param {*} positions
 * @param {*} color
 */
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
 * 获取杆塔的连接点坐标
 * @param {*} position
 * @param {*} angle
 */
function getLinkedPositions(position, angle) {
	return [
		getPositionByOffsetAndAngle(position, new Cesium.Cartesian3(0, 9, 51.5), angle),
		getPositionByOffsetAndAngle(position, new Cesium.Cartesian3(0, -9, 51.5), angle),
		getPositionByOffsetAndAngle(position, new Cesium.Cartesian3(0, -12, 47.5), angle),
		getPositionByOffsetAndAngle(position, new Cesium.Cartesian3(0, 12, 47.5), angle),
	];
}

/**
 * 获取两点之间的曲线
 * @param {*} pos1
 * @param {*} pos2
 */
function generateCurve(pos1, pos2) {
	let newPos = new Cesium.Cartesian3();
	Cesium.Cartesian3.add(pos1, pos2, newPos);

	var newPos2 = new Cesium.Cartesian3();
	Cesium.Cartesian3.divideByScalar(newPos, 0x2, newPos2),
		((newPos = Cesium['Cartographic']['fromCartesian'](newPos2))['height'] =
			0.98 * newPos['height'] - 0.05 * Cesium.Cartesian3['distance'](pos1, pos2)),
		(newPos2 = new Cesium.Cartesian3()),
		Cesium['Ellipsoid']['WGS84']['cartographicToCartesian'](newPos, newPos2);
	for (
		var _0x8b45e1 = new Cesium['CatmullRomSpline']({
				times: [0x0, 0.5, 0x1],
				points: [pos1, newPos2, pos2],
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
	var _localToWorld_Matrix = Cesium.Transforms.eastNorthUpToFixedFrame(pos);
	var pos = Cesium.Matrix4.multiplyByTranslation(
		_localToWorld_Matrix,
		offset,
		new Cesium.Matrix4()
	);
	var offset = Cesium.Matrix4.getTranslation(pos, new Cesium.Cartesian3());
	pos = Cesium.Matrix4.inverse(_localToWorld_Matrix, new Cesium.Cartesian3());
	pos = Cesium.Matrix4.multiplyByPoint(pos, offset, new Cesium.Cartesian3());
	var angle = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(-angle));
	pos = Cesium.Matrix3.multiplyByVector(angle, pos, new Cesium.Cartesian3());
	return (offset = Cesium.Matrix4.multiplyByPoint(
		_localToWorld_Matrix,
		pos,
		new Cesium.Cartesian3()
	));
}

function getTowerAngle(_0x2da7da, _0x4d347e) {
	return (
		(_0x2da7da = (function (_0x569274, _0x47e280) {
			var _0x22e8b5 = a0_0x366f;
			return (
				(_0x47e280 = Cesium.Cartesian3.subtract(_0x47e280, _0x569274, new Cesium.Cartesian3())),
				(_0x47e280 = Cesium.Cartesian3.normalize(_0x47e280, new Cesium.Cartesian3())),
				(_0x47e280 = Cesium.Transforms.rotationMatrixFromPositionVelocity(
					_0x569274,
					_0x47e280,
					Cesium.Ellipsoid.WGS84
				)),
				Cesium.Matrix4.fromRotationTranslation(_0x47e280, _0x569274)
			);
		})(_0x2da7da, _0x4d347e)),
		(_0x4d347e = _0x2da7da),
		(_0x2da7da = Cesium.Transforms.eastNorthUpToFixedFrame(
			Cesium.Matrix4.getTranslation(_0x4d347e, new Cesium.Cartesian3()),
			Cesium.Ellipsoid.WGS84,
			new Cesium.Matrix4()
		)),
		(_0x4d347e = Cesium.Matrix4.multiply(
			Cesium.Matrix4.inverse(_0x2da7da, new Cesium.Matrix4()),
			_0x4d347e,
			new Cesium.Matrix4()
		)),
		(_0x4d347e = Cesium.Matrix4.getMatrix3(_0x4d347e, new Cesium.Matrix3())),
		(_0x4d347e = Cesium.Quaternion.fromRotationMatrix(_0x4d347e)),
		(_0x4d347e = Cesium.HeadingPitchRoll.fromQuaternion(_0x4d347e)),
		Cesium.Math.toDegrees(_0x4d347e['heading'])
	);
}
</script>
