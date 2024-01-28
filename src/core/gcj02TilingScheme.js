import {
	WebMercatorTilingScheme,
	WebMercatorProjection,
	Math as CesiumMath,
	Cartographic,
	Cartesian3,
} from '@cesium/engine';

import CoordTransform from './coordTransform';

class GCJ02TilingScheme extends WebMercatorTilingScheme {
	constructor(options) {
		super(options);
		let projection = new WebMercatorProjection();
		/* 投影project 经纬度坐标->gcj02->web墨卡托 */
		this._projection.project = function (cartographic, result) {
			result = CoordTransform.WGS84ToGCJ02(
				CesiumMath.toDegrees(cartographic.longitude),
				CesiumMath.toDegrees(cartographic.latitude)
			);
			result = projection.project(
				new Cartographic(CesiumMath.toRadians(result[0]), CesiumMath.toRadians(result[1]))
			);
			console.log('result', result);

			return new Cartesian3(result.x, result.y, result.z);
		};
		/* unproject web墨卡托->gcj02->经纬度坐标 */
		this._projection.unproject = function (cartesian, result) {
			let cartographic = projection.unproject(cartesian);
			result = CoordTransform.GCJ02ToWGS84(
				CesiumMath.toDegrees(cartographic.longitude),
				CesiumMath.toDegrees(cartographic.latitude)
			);
			return new Cartographic(CesiumMath.toRadians(result[0]), CesiumMath.toRadians(result[1]));
		};
	}
}

export default GCJ02TilingScheme;
