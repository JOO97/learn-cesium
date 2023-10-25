<!-- Cesium Interactive Building  -->
<template>
	<!-- 容器 -->
	<div id="cesiumContainer" style="width: 100vw; height: 100vh" />
	<button id="toggle-building">Toggle new building</button>
</template>

<script setup>
import { onMounted } from 'vue';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

window.Cesium = Cesium;
console.log(Cesium);

let viewer = null;

onMounted(async () => {
	Cesium.Ion.defaultAccessToken =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZDk3ZjUxYS0zMzkyLTQ3NWEtYmM1Ny0zMTUxM2ZlMDFjMjMiLCJpZCI6MTczNDg2LCJpYXQiOjE2OTgxMjgzODV9.xSyHyR2dPE4dvRqOh5pl1dFSsTg0zcDyQ0g-82OzqV4';

	viewer = new Cesium.Viewer('cesiumContainer', {
		terrain: Cesium.Terrain.fromWorldTerrain({
			requestWaterMask: true,
		}),
	});

	/* 图层更换 */
	viewer.imageryLayers.remove(viewer.imageryLayers.get(2));
	const imageryLayer = Cesium.ImageryLayer.fromProviderAsync(
		Cesium.IonImageryProvider.fromAssetId(4)
	);
	viewer.imageryLayers.add(imageryLayer);

	// 解决模型光照问题
	viewer.scene.light = new Cesium.DirectionalLight({
		direction: new Cesium.Cartesian3(0.354925, -0.890918, -0.283358),
	});

	// viewer.camera.flyTo({
	// 	destination: Cesium.Cartesian3.fromDegrees(-104.9965, 39.74248, 4000),
	// });

	/* Add OSM Buildings */
	/**
	 * 3D Tiles styles
	 * @see https://github.com/CesiumGS/3d-tiles/tree/main/specification/Styling
	 */
	const buildingsTilesetStyle = new Cesium.Cesium3DTileStyle({
		show: {
			conditions: [
				// Any building that has this elementId will have `show = false`.
				['${elementId} === 332469316', false],
				['${elementId} === 332469317', false],
				['${elementId} === 235368665', false],
				['${elementId} === 530288180', false],
				['${elementId} === 530288179', false],
				// If a building does not have one of these elementIds, set `show = true`.
				[true, true],
			],
		},
		//  color: "Boolean(${feature['cesium#color']}) ? color(${feature['cesium#color']}) : color('#ffffff')"
		color: {
			conditions: [
				["${feature['building']} === 'hospital'", "color('#FFFFF', 0.8)"],
				["${feature['building']} === 'school'", "color('#00FF00', 0.8)"],
				[true, "color('#ff0000', 0.5)"],
			],
		},
		// FIXME:表达式没有生效
		// color: {
		// 	conditions: [
		// 		["${feature['Height']} >= 100", "color('#0000FF')"],
		// 		["${feature['Height']} >= 70", "color('#00FFFF')"],
		// 		["${feature['Height']} >= 50", "color('#00FF00')"],
		// 		["${feature['Height']} >= 30", "color('#FFFF00')"],
		// 		["${feature['Height']} >= 10", "color('#FF0000')"],
		// 		["${feature['Height']} >= 1", "color('#FF00FF')"],
		// 		[true, "color('#FF00FF')"],
		// 	],
		// },
	});
	const buildingsTileset = await Cesium.createOsmBuildingsAsync({
		style: buildingsTilesetStyle,
	});
	viewer.scene.primitives.add(buildingsTileset);

	/* Add a Building */
	// addBuildingGeoJSON();

	/* Add a Building Model */
	// addBuildingModel();

	/* Add Entities */
	// addEntities();

	console.log('====viewer====', viewer, window);

	window.onclick = (e) => {
		console.log('picked ', pickEntity(viewer, new Cesium.Cartesian2(e.x, e.y)));
	};

	// addPointFeatures();

	add3DModels();
});

/**
 * Add a Building
 */
async function addBuildingGeoJSON() {
	// Load the GeoJSON file from Cesium ion.
	const geoJSONURL = await Cesium.IonResource.fromAssetId(2327069);
	// Create the geometry from the GeoJSON, and clamp it to the ground.
	const geoJSON = await Cesium.GeoJsonDataSource.load(geoJSONURL, { clampToGround: true });
	console.log('geoJSON', geoJSON);
	// Add it to the scene.
	const dataSource = await viewer.dataSources.add(geoJSON);
	// By default, polygons in CesiumJS will be draped over all 3D content in the scene.
	// Modify the polygons so that this draping only applies to the terrain, not 3D buildings.
	for (const entity of dataSource.entities.values) {
		entity.polygon.classificationType = Cesium.ClassificationType.TERRAIN;
	}
	viewer.flyTo(dataSource);
}

/**
 * Add a Building Model
 */
async function addBuildingModel() {
	const buildingModelTileset = await Cesium.Cesium3DTileset.fromIonAssetId(2327211, {
		lightColor: new Cesium.Cartesian3(255, 255, 255),
	});
	viewer.scene.primitives.add(buildingModelTileset);
	viewer.flyTo(buildingModelTileset);

	document.querySelector('#toggle-building').onclick = function () {
		buildingModelTileset.show = !buildingModelTileset.show;
	};
}

/**
 * Add Entities
 */
function addEntities() {
	// const polygon = viewer.entities.add({
	// 	polygon: {
	// 		hierarchy: Cesium.Cartesian3.fromDegreesArray([
	// 			-109.080842, 45.002073, -105.91517, 45.002073, -104.058488, 44.996596, -104.053011,
	// 			43.002989, -104.053011, 41.003906, -105.728954, 40.998429, -107.919731, 41.003906,
	// 			-109.04798, 40.998429, -111.047063, 40.998429, -111.047063, 42.000709, -111.047063,
	// 			44.476286, -111.05254, 45.002073,
	// 		]),
	// 		height: 100,
	// 		material: Cesium.Color.RED.withAlpha(0.5),
	// 		outline: true,
	// 		outlineColor: Cesium.Color.BLACK,
	// 	},
	// });
	const polygon = viewer.entities.add({
		id: 'entityId',
		name: 'Green wall from surface with outline',
		wall: {
			positions: Cesium.Cartesian3.fromDegreesArrayHeights([
				-107.0, 43.0, 100000.0, -97.0, 43.0, 100000.0, -97.0, 40.0, 100000.0, -107.0, 40.0,
				100000.0, -107.0, 43.0, 100000.0,
			]),
			material: Cesium.Color.GREEN,
			outline: true,
		},
		/* 与InfoBox绑定 viewer.infoBox.frame */
		description: `\
<img\
  width="50%"\
  style="float:left; margin: 0 1em 1em 0;"\
  src="/docs/tutorials/creating-entities/Flag_of_Wyoming.svg"/>\
<p>\
  Wyoming is a state in the mountain region of the Western \
  United States.\
</p>\
<p>\
  Wyoming is the 10th most extensive, but the least populous \
  and the second least densely populated of the 50 United \
  States. The western two thirds of the state is covered mostly \
  with the mountain ranges and rangelands in the foothills of \
  the eastern Rocky Mountains, while the eastern third of the \
  state is high elevation prairie known as the High Plains. \
  Cheyenne is the capital and the most populous city in Wyoming, \
  with a population estimate of 63,624 in 2017.\
</p>\
<p>\
  Source: \
  <a style="color: WHITE"\
    target="_blank"\
    href="http://en.wikipedia.org/wiki/Wyoming">Wikpedia</a>\
</p>`,
	});
	/* zoomTo默认45度  */
	viewer.zoomTo(
		polygon,
		new Cesium.HeadingPitchRange(Cesium.Math.toRadians(30), Cesium.Math.toDegrees(-30))
	);

	/* Find Entity */
	const findEntity = viewer.entities.getById('entityId');
	// console.log('findEntity', findEntity);

	/* Entities Change Event */
	viewer.entities.collectionChanged.addEventListener(onChanged);
}

function onChanged(collection, added, removed, changed) {
	let message = 'Added ids';
	for (var i = 0; i < added.length; i++) {
		message += '\n' + added[i].id;
	}
	console.log(message);
}

/**
 * Pick Entity
 * @param {*} viewer
 * @param {*} windowPosition
 */
function pickEntity(viewer, windowPosition) {
	const picked = viewer.scene.pick(windowPosition);
	if (Cesium.defined(picked)) {
		const pickedId = Cesium.defaultValue(picked.id, picked.primitive.id);
		if (pickedId instanceof Cesium.Entity) {
			return pickedId;
		}
	}
	return;
}

/**
 * Points, billboards, and labels
 */
function addPointFeatures() {
	const citizensBankPark = viewer.entities.add({
		name: 'Citizens Bank Park',
		position: Cesium.Cartesian3.fromDegrees(-75.166493, 39.9060534),
		point: {
			pixelSize: 5,
			color: Cesium.Color.RED,
			outlineColor: Cesium.Color.WHITE,
			outlineWidth: 2,
		},
		label: {
			text: 'Citizens Bank Park',
			font: '14pt monospace',
			style: Cesium.LabelStyle.FILL_AND_OUTLINE,
			outlineWidth: 2,
			verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
			pixelOffset: new Cesium.Cartesian2(0, -9),
		},
	});
	viewer.zoomTo(viewer.entities);
}

/**
 * Add 3D Models
 */
function add3DModels() {
	const position = Cesium.Cartesian3.fromDegrees(-75.360771, 39.886558, 150);
	const heading = Cesium.Math.toRadians(45.0);
	const pitch = Cesium.Math.toRadians(0.0);
	const roll = Cesium.Math.toRadians(0.0);
	const orientation = Cesium.Transforms.headingPitchRollQuaternion(
		position,
		new Cesium.HeadingPitchRoll(heading, pitch, roll)
	);
	const model = viewer.entities.add({
		model: {
			uri: '/src/assets/models/GroundVehicle.glb',
			runAnimations: true,
			color: Cesium.Color.WHITE,
		},
		position,
		// orientation,
	});
	viewer.trackedEntity = model;
}
</script>

<style lang="scss" scoped></style>
