<script setup>
/**
 * DataSource
 * 加载矢量数据
 * @see https://zhuanlan.zhihu.com/p/344042884
 */
import { onMounted } from 'vue';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

window.Cesium = Cesium;

let viewer = null,
	layer = null,
	dataSources = null;

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
	Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
		117.861711,
		24.363349,
		118.236017,
		24.663633
	);

	viewer = new Cesium.Viewer('cesiumContainer', {});

	layer = viewer.scene.imageryLayers;

	addDataSource();

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

const addDataSource = () => {
	viewer.camera.lookAt(
		Cesium.Cartesian3.fromDegrees(-98.0, 40.0),
		new Cesium.Cartesian3(0.0, -4790000.0, 3930000.0)
	);
	dataSources = viewer.dataSources;

	/**
	 * NOTE: geojson [examples]
	 */
	geojsonDataSource();

	/**
	 * NOTE: kml [examples]
	 */
	kmlDataSource();

	/**
	 * czml [example]
	 */
	czmlDataSource();

	/**
	 * GpxDataSource
	 */
	gpxDataSource();

	/**
	 * CustomDataSource
	 */
	customDataSource();

	/* Methods: removeAll */
	// dataSources.removeAll();
};

/**
 * Cesium.GeojsonDataSource
 */
const geojsonDataSource = () => {
	/* 1 simple style */
	// dataSources.add(
	// 	Cesium.GeoJsonDataSource.load('/SampleData/ne_10m_us_states.topojson', {
	// 		stroke: Cesium.Color.HOTPINK,
	// 		fill: Cesium.Color.PINK,
	// 		strokeWidth: 3,
	// 		markerSymbol: '?',
	//      clampToGround: true //贴地
	// 	})
	// );
	/* 2 custom style */
	// Cesium.GeoJsonDataSource.load('/SampleData/ne_10m_us_states.topojson').then((dataSource) => {
	// 	dataSources.add(dataSource);
	// 	console.log('dataSource', dataSource);
	// 	/* entities: EntityCollection */
	// 	const entities = dataSource.entities.values;
	// 	entities.forEach((entity) => {
	// 		console.log('entity', entity);
	// 		const color = Cesium.Color.fromRandom({
	// 			alpha: 1.0,
	// 		});
	// 		entity.polygon.material = color;
	// 		entity.polygon.outline = false;
	// 		/* 多边形高度 */
	// 		entity.polygon.extrudedHeight = entity.properties.Population / 100;
	// 	});
	// });
	// 3 加载点数据
	// dataSources
	// 	.add(
	// 		Cesium.GeoJsonDataSource.load('/SampleData/simplestyles.geojson', {
	// 			// stroke: Cesium.Color.HOTPINK,
	// 			// fill: Cesium.Color.PINK,
	// 			// strokeWidth: 3,
	// 			markerSymbol: '?',
	// 			// clampToGround: true, //贴地
	// 		})
	// 	)
	// 	.then((geoJsonDataSource) => {
	// 		/* NOTE: geojson中的点数据默认会被渲染成billboard */
	// 		console.log('geoJsonDataSource', geoJsonDataSource);
	// 		// viewer.camera.lookAt(geoJsonDataSource.entities);
	// 		viewer.flyTo(geoJsonDataSource.entities);
	// 	});
};

/**
 * Cesium.KmlDataSource
 */
const kmlDataSource = () => {
	/* 1 load kml/kmz file */
	/* KMZ with embedded data */
	// dataSources
	// 	.add(Cesium.KmlDataSource.load('/SampleData/kml/gdpPerCapita2008.kmz'))
	// 	.then((dataSource) => {
	// 		console.log('kmz', dataSource);
	// 	});
	// dataSources
	// 	.add(Cesium.KmlDataSource.load('/SampleData/kml/facilities/facilities.kml'))
	// 	.then((dataSource) => {
	// 		console.log('kml facilities.kml', dataSource);
	// 	});
	/* 2 load custom kml file */
	// dataSources.add(Cesium.KmlDataSource.load('/SampleData/kml/test.kml')).then((dataSource) => {
	// console.log('kml test.kml', dataSource);
	// viewer.flyTo(dataSource.entities);
	// });
	/* 3 KML Tours */
	// let tour = null;
	// dataSources
	// 	.add(
	// 		Cesium.KmlDataSource.load('/SampleData/kml/eiffel-tower-flyto.kml', {
	// 			camera: viewer.scene.camera,
	// 			canvas: viewer.scene.canvas,
	// 		})
	// 	)
	// 	.then((dataSource) => {
	// 		console.log('kml', dataSource);
	// 		tour = dataSource.kmlTours[0];
	// 		tour.tourStart.addEventListener(() => {
	// 			console.log('kml-tourStart');
	// 		});
	// 		tour.tourEnd.addEventListener(() => {
	// 			console.log('kml-tourEnd');
	// 		});
	// 		tour.entryStart.addEventListener((entry) => {
	// 			console.log('kml-entryStart', entry);
	// 		});
	// 		tour.entryEnd.addEventListener((entry, terminated) => {
	// 			console.log('terminated', terminated ? 'terminate' : 'end');
	// 			console.log('kml-entryEnd', entry);
	// 		});
	// 		// setTimeout(() => {
	// 		// 	tour && tour.play(viewer.cesiumWidget);
	// 		// }, 4000);
	// 	});
	/* 4 gx KML extensions */
	// dataSources
	// 	.add(
	// 		Cesium.KmlDataSource.load('/SampleData/kml/bikeRide.kml', {
	// 			/* NOTE: 对于包含视图依赖特性的 KML 文件需要传递下列参数 */
	// 			camera: viewer.scene.camera,
	// 			canvas: viewer.scene.canvas,
	// 			screenOverlayContainer: viewer.container,
	// 		})
	// 	)
	// 	.then((dataSource) => {
	// 		console.log('bikeRide.kml', dataSource);
	// 		viewer.clock.shouldAnimate = false;
	// 		const rider = dataSource.entities.getById('tour');
	// 		viewer.flyTo(rider).then(function () {
	// 			viewer.trackedEntity = rider;
	// 			viewer.selectedEntity = viewer.trackedEntity;
	// 			viewer.clock.multiplier = 10;
	// 			viewer.clock.shouldAnimate = true;
	// 		});
	// 	});
};

/**
 * Cesium.CzmlDataSource
 */
const czmlDataSource = () => {
	return;
	/* NOTE: 需要开启时间轴动画 */
	viewer.clock.shouldAnimate = true;
	//1
	// dataSources.add(Cesium.CzmlDataSource.load('/SampleData/simple.czml')).then((dataSource) => {
	// console.log('czmlDataSource', dataSource);
	// viewer.flyTo(dataSource.entities);
	// });

	//2
	// dataSources.add(Cesium.CzmlDataSource.load('/SampleData/Vehicle.czml')).then((dataSource) => {
	// console.log('czmlDataSource', dataSource);
	// viewer.trackedEntity = dataSource.entities.getById('Vehicle');
	/* remove dataSource */
	// dataSources.remove(dataSource, true);
	// });
};

/**
 * Cesium.GpxDataSource
 * 加载和解析 GPX（GPS Exchange Format - gps交换格式）文件的数据源
 */
const gpxDataSource = () => {
	return;
	// dataSources.add(Cesium.GpxDataSource.load('/SampleData/gpx/simple.gpx')).then((dataSource) => {
	// 	console.log('GpxDataSource', dataSource);
	// 	viewer.zoomTo(dataSource);
	// });
	const pinBuilder = new Cesium.PinBuilder();
	/* 如果不播放动画 设置为false  */
	viewer.clock.shouldAnimate = true;
	dataSources
		.add(
			Cesium.GpxDataSource.load('/SampleData/gpx/lamina.gpx', {
				clampToGround: true,
				trackColor: Cesium.Color.YELLOW,
				waypointImage: pinBuilder.fromMakiIconId('bicycle', Cesium.Color.BLUE, 48),
			})
		)
		.then((dataSource) => {
			console.log('GpxDataSource', dataSource);
			console.log('dataSourceClock', dataSource.clock);
			viewer.zoomTo(dataSource);
		});

	// dataSources
	// 	.add(
	// 		Cesium.GpxDataSource.load('/SampleData/gpx/wpt.gpx', {
	// 			clampToGround: true,
	// 		})
	// 	)
	// 	.then((dataSource) => {
	// 		console.log('GpxDataSource', dataSource);
	// 		viewer.zoomTo(dataSource);
	// 	});
};

const customDataSource = () => {
	const dataSource = new Cesium.CustomDataSource('joo');
	dataSource.entities.add({
		position: Cesium.Cartesian3.fromDegrees(122, 29, 0),
		billboard: {
			image: '/SampleData/fire.png',
		},
	});
	dataSources.add(dataSource);
	viewer.flyTo(dataSource.entities);
};
</script>

<template>
	<div id="cesiumContainer" style="width: 100vw; height: 100vh" />
</template>
