<template>
	<!-- 容器 -->
	<div id="cesiumContainer" style="width: 100vw; height: 100vh" />
</template>

<script setup>
import { onMounted } from 'vue';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

Cesium.Ion.defaultAccessToken =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMzNkNTE5Zi1mMjY4LTRiN2QtOTRlZC1lOTUyM2NhNDYzNWYiLCJpZCI6NTU0OTYsImlhdCI6MTYyNTAyNjMyOX0.a2PEM4hQGpeuMfeB9-rPp6_Gkm6O-02Dm4apNbv_Dlk';
// 设置默认视角
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
	89.5, // 西边的经度
	20.4, // 南边纬度
	110.4, // 东边经度
	61.2 // 北边纬度
);
let viewer = null;

/* 初始化 */
onMounted(() => {
	/* 1 Cesium.Viewer */
	const viewer = new Cesium.Viewer('cesiumContainer', {
		// 是否显示信息窗口
		infoBox: false,
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
		// 是否显示全屏按钮
		fullscreenButton: false,
		contextOptions: {
			webgl: {
				antialias: true,
			},
		},
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
	// 隐藏logo
	viewer.cesiumWidget.creditContainer.style.display = 'none';

	// 是否支持图像渲染像素化处理
	// if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
	// 	viewer.resolutionScale = window.devicePixelRatio;
	// }
	// if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
	// 	var vtxf_dpr = window.devicePixelRatio;
	// 	while (vtxf_dpr >= 2.0) {
	// 		vtxf_dpr /= 2.0;
	// 	}
	// 	viewer.resolutionScale = vtxf_dpr;
	// }
	// 开启抗锯齿
	viewer.scene.fxaa = false;
	viewer.scene.postProcessStages.fxaa.enabled = false;

	createPrimitive(viewer);
});

const createPrimitive = (viewer) => {
	/**
	 * 1 单个带颜色图元
	 * SimplePolylineGeometry
	 */
	var primitive = new Cesium.Primitive({
		geometryInstances: new Cesium.GeometryInstance({
			geometry: new Cesium.SimplePolylineGeometry({
				positions: Cesium.Cartesian3.fromDegreesArray([
					// 118.109676, 24.481108, 118.144355, 24.438919, 118.086327, 24.421414,
					118.128998, 24.494612, 118.149927, 24.466838,
				]),
				// vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
			}),
			attributes: {
				color: Cesium.ColorGeometryInstanceAttribute.fromColor(
					new Cesium.Color(1.0, 1.0, 1.0, 1.0)
				),
			},
		}),
		appearance: new Cesium.PerInstanceColorAppearance({
			flat: true,
			translucent: false,
		}),
	});

	/**
	 * 2 单个带颜色图元(每段线颜色不同)
	 * SimplePolylineGeometry
	 */
	//创建多段线和每段颜色随机的
	const positions11 = [];
	const colors1 = [];
	for (let j = 0; j <= 50; j += 5) {
		positions11.push(Cesium.Cartesian3.fromDegrees(108.94388 + j, 34.319, 5000.0 * (j % 10)));
		colors1.push(Cesium.Color.fromRandom({ alpha: 1.0 }));
	}

	const primitive2 = new Cesium.Primitive({
		geometryInstances: new Cesium.GeometryInstance({
			geometry: new Cesium.SimplePolylineGeometry({
				positions: positions11,
				colors: colors1,
				// arcType: Cesium.ArcType.NONE,
				// vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
				colorsPerVertex: true, //对于逐顶点着色 颜色过渡
			}),
			attributes: {
				// NOTE: 这里的color优先与geometry的colors
				// color: Cesium.ColorGeometryInstanceAttribute.fromColor(
				// 	new Cesium.Color(1.0, 1.0, 1.0, 1.0)
				// ),
			},
		}),
		appearance: new Cesium.PerInstanceColorAppearance({
			flat: true,
			translucent: false,
			renderState: { lineWidth: Math.min(5.0, viewer.scene.maximumAliasedLineWidth) },
		}),
	});

	/**
	 * 2 一个图元中有两个矩形，并且具有不同的颜色。
	 */
	var instance = new Cesium.GeometryInstance({
		geometry: new Cesium.RectangleGeometry({
			rectangle: Cesium.Rectangle.fromDegrees(0.0, 20.0, 10.0, 30.0),
		}),
		attributes: {
			color: new Cesium.ColorGeometryInstanceAttribute(1.0, 0.0, 0.0, 0.5),
		},
	});

	var anotherInstance = new Cesium.GeometryInstance({
		geometry: new Cesium.RectangleGeometry({
			rectangle: Cesium.Rectangle.fromDegrees(0.0, 40.0, 10.0, 50.0),
		}),
		attributes: {
			color: new Cesium.ColorGeometryInstanceAttribute(0.0, 0.0, 1.0, 0.5),
		},
	});

	var rectanglePrimitive = new Cesium.Primitive({
		geometryInstances: [instance, anotherInstance],
		appearance: new Cesium.PerInstanceColorAppearance(),
	});

	viewer.scene.primitives.add(primitive);
	viewer.scene.primitives.add(primitive2);
	viewer.scene.primitives.add(rectanglePrimitive);

	//视角飞行至立方体
	viewer.camera.flyTo(
		{
			destination: Cesium.Cartesian3.fromDegrees(108.94388, 34.319, 10000), // 目的地的经纬度坐标
			duration: 4,
		} // 动画持续时间，默认为3秒
	);
};
</script>

<style lang="scss" scoped></style>
