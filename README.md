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







## Primitive

> Steps：
>
> 1. 创建几何(geometry)
> 2. 创建几何实例(GeometryInstance)： geometry
> 3. 创建图元(Primitive)： geometryInstances 、appearance

### Geometry

#### polyline

1. PolylineGeometry（折线几何体）
2. SimplePolylineGeometry（以线带（line strip）形式建模的折线）:  
3. GroundPolylineGeometry（贴地折线几何体）：
4. ...





vertexFormat

> 用于指定折线几何体的顶点格式。顶点格式定义了每个顶点的属性，例如位置、法线、纹理坐标等。

- `Cesium.VertexFormat.POSITION_ONLY`：仅包含位置信息的顶点格式。
- `Cesium.VertexFormat.POSITION_AND_COLOR`：包含位置和颜色信息的顶点格式。
- `Cesium.VertexFormat.POSITION_NORMAL`：包含位置和法线信息的顶点格式。
- `Cesium.VertexFormat.ALL`：包含位置、颜色、法线、纹理坐标等所有属性的顶点格式。



arcType 

1. `Cesium.ArcType.NONE`：表示折线不进行插值，直接连接折线的顶点。这是默认值。
2. `Cesium.ArcType.GEODESIC`：表示折线使用大地线插值，按照地球曲率进行插值生成曲线。这种插值方法会在地球表面形成弧线。
3. `Cesium.ArcType.RHUMB`：表示折线使用恒向线插值，按照恒向线的方向进行插值生成曲线。这种插值方法会在地球表面形成一系列等角度的线段。

### GeometryInstance

1. 



### Cesium.Primitive

#### appearance

1. Appearance：Appearance定义了完整的GLSL顶点和片段着色器，以及用于绘制[`Primitive`](https://www.vvpstk.com/public/Cesium/Documentation/Primitive.html)的渲染状态。 所有的appearances实现都基于这个基础的`Appearance`接口。
2. MaterialAppearance：用于设置基于材质的外观，可以通过指定材质属性来定义Primitive对象的表面特性，如颜色、透明度、反射率等。支持材质着色的任意几何图形的外观（与[`EllipsoidSurfaceAppearance`](https://www.vvpstk.com/public/Cesium/Documentation/EllipsoidSurfaceAppearance.html)相反）。
3. EllipsoidSurfaceAppearance：用于设置椭球体或球体表面的外观，可以通过指定颜色属性来定义表面的颜色。如[`PolygonGeometry`](https://www.vvpstk.com/public/Cesium/Documentation/PolygonGeometry.html)和[`RectangleGeometry`](https://www.vvpstk.com/public/Cesium/Documentation/RectangleGeometry.html)， 它支持[`MaterialAppearance`](https://www.vvpstk.com/public/Cesium/Documentation/MaterialAppearance.html)和`MaterialAppearance.MaterialSupport.ALL`等所有材质
4. PerInstanceColorAppearance：带有颜色属性的[`GeometryInstance`](https://www.vvpstk.com/public/Cesium/Documentation/GeometryInstance.html)实例的外观。 用于根据每个实例的颜色属性来设置每个实例的外观。这个类常用于需要为每个实例指定不同颜色的场景，如点云数据可视化。
5. PolylineMaterialAppearance：用于设置折线或线段的外观，可以通过指定材质属性来定义Primitive对象的外观，如颜色、透明度、线宽等。



## Material



### Fabric







