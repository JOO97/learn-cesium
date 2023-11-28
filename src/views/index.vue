<!-- Primitive -->
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

const longitude = 118.127582;
const latitude = 24.457932;

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
		// terrain: Cesium.Terrain.fromWorldTerrain({
		// 	requestVertexNormals: true, //光照效果
		// 	requestWaterMask: false, //水文贴图
		// }),
	});

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

	/* NOTE: 开启地形深度测试 */
	// viewer.scene.globe.depthTestAgainstTerrain = true;

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

	addPrimitives();
});

/**
 * Add Primitives
 */
const addPrimitives = () => {
	const collection = new Cesium.PrimitiveCollection();
	viewer.scene.primitives.add(collection);
	// const geometry = new Cesium.Geometry({});

	// const boxGeometry = Cesium.BoxGeometry.fromDimensions({
	// 	dimensions: new Cesium.Cartesian3.from(400000.0, 300000.0, 50000.0),
	// 	vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
	// });
	/**
	 * 通过 轴对齐边界框 创建
	 */
	const boundingBox = Cesium.AxisAlignedBoundingBox.fromPoints(
		Cesium.Cartesian3.fromDegreesArray([
			-72.0, 40.0, -70.0, 35.0, -75.0, 30.0, -70.0, 30.0, -68.0, 40.0,
		])
	);
	const boxGeometry = Cesium.BoxGeometry.fromDimensions({
		dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 50000.0),
		vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
		minimum: boundingBox.minimum,
		maximum: boundingBox.maximum,
	});

	const boxGeometryInstance = new Cesium.GeometryInstance({
		geometry: boxGeometry,
		attributes: {
			color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color.fromRandom()),
		},
	});

	/**
	 * RectangleGeometry
	 */
	const rectangleGeometry = new Cesium.RectangleGeometry({
		rectangle: Cesium.Rectangle.fromDegrees(118.083253, 24.488308, 118.094468, 24.49806),
		height: 500,
		extrudedHeight: 10,
		vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
	});
	const rectangleGeometryInstance = new Cesium.GeometryInstance({
		id: 'rectangle',
		geometry: rectangleGeometry,
		attributes: {
			color: Cesium.ColorGeometryInstanceAttribute.fromColor(
				new Cesium.Color.fromRandom({ alpha: 1 })
			),
		},
	});
	const rectangleGeometry2 = new Cesium.RectangleGeometry({
		rectangle: Cesium.Rectangle.fromDegrees(118.102691, 24.488308, 118.112691, 24.49806),
		height: 500,
		extrudedHeight: 10,
		vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
	});
	const rectangleGeometryInstance2 = new Cesium.GeometryInstance({
		id: 'rectangle',
		geometry: rectangleGeometry2,
		attributes: {},
	});

	/**
	 * Appearance
	 */

	/**
	 * Cesium.Primitive
	 */
	const primitive = new Cesium.Primitive({
		geometryInstances: [rectangleGeometryInstance],
		appearance: new Cesium.PerInstanceColorAppearance({
			flat: false,
		}),
		asynchronous: false,
	});
	collection.add(primitive);

	const primitive2 = new Cesium.Primitive({
		geometryInstances: [rectangleGeometryInstance2],
		appearance: new Cesium.EllipsoidSurfaceAppearance({
			// flat: false,
			material: Cesium.Material.fromType('Stripe'),
		}),
		asynchronous: false,
	});
	collection.add(primitive2);

	/* appearance: PerInstanceColorAppearance */
	const instances = [];
	for (let lon = -180.0; lon < 180.0; lon += 5.0) {
		for (let lat = -85.0; lat < 85.0; lat += 5.0) {
			instances.push(
				new Cesium.GeometryInstance({
					geometry: new Cesium.RectangleGeometry({
						rectangle: Cesium.Rectangle.fromDegrees(lon, lat, lon + 5.0, lat + 5.0),
						height: 0,
						extrudedHeight: Cesium.Math.randomBetween(100, 100000),
						vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
					}),
					attributes: {
						color: Cesium.ColorGeometryInstanceAttribute.fromColor(
							Cesium.Color.fromRandom({ alpha: 0.5 })
						),
					},
				})
			);
		}
	}
	collection.add(
		new Cesium.Primitive({
			geometryInstances: instances,
			appearance: new Cesium.PerInstanceColorAppearance(),
		})
	);

	// viewer.scene.requestRender();
	// primitive.update();

	// const attributes = primitive.getGeometryInstanceAttributes('box');
	// viewer.camera.lookAtTransform(attributes.boundingSphere.transform);

	// 获取 Primitive 的边界球
	// var boundingSphere = boxPrimitive.getBoundingSphere();

	// // 将摄像机定位到 Primitive
	// viewer.camera.viewBoundingSphere(boundingSphere, new Cesium.HeadingPitchRange(0, -Math.PI / 4, boundingSphere.radius * 3));
	// viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

	// 监听场景渲染完成事件
	let flag = false;
	viewer.scene.postRender.addEventListener(() => {
		if (flag) return;
		// flag = true;
		// viewer.camera.flyTo({
		// 	destination: primitive._instanceBoundingSpheres[0].center, // 目的地的经纬度坐标
		// 	orientation: new Cesium.HeadingPitchRoll(0, -45, 0),
		// });
	});
};
</script>
