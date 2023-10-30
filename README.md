# CesiumJs

## Concept

### Viewer

```js
var viewer = new Cesium.Viewer('cesiumContainer', {
	scene3DOnly: true,
	selectionIndicator: false,
	baseLayerPicker: false,
});
```

### 地球坐标系转换

岁差章动计算(XYs):

1. https://github.com/CesiumGS/EarthKAMExplorer/tree/master/Cesium/Assets/IAU2006_XYS
2. https://blog.csdn.net/u011575168/article/details/108290011
3. http://cesium.xin/cesium/en/Documentationb28/Iau2006XysData.html

### Imagery(图层)

## Engine

### JulianDate

## Widgets

> Geocoder : 一种地理位置搜索工具，用于显示相机访问的地理位置。默认使用微软的 Bing 地图。
> HomeButton : 首页位置，点击之后将视图跳转到默认视角。
> SceneModePicker : 切换 2D、3D 和 Columbus View (CV) 模式。
> BaseLayerPicker : 选择三维数字地球的底图（imagery and terrain）。
> NavigationHelpButton : 帮助提示，如何操作数字地球。
> Animation :控制视窗动画的播放速度。
> CreditsDisplay : 展示商标版权和数据源。
> Timeline : 展示当前时间和允许用户在进度条上拖动到任何一个指定的时间。
> FullscreenButton : 视察全屏按钮。

### Timeline
