---
layout: post
title: "Digest of <i>ggplot2</i>"
description: ""
category: R
tags: [R-101, Book]
---
{% include JB/setup %}

[6-5-legend-position]: https://farm5.staticflickr.com/4682/39207350172_fe5b317949_m_d.jpg

## ToC

- [第一章 - 简介](#第一章---简介)
	- [1.1 Welcome to ggplot2](#1-1-Welcome-to-ggplot2)
	- [1.3 What is the grammar of graphics?](#1-3-What-is-the-grammar-of-graphics)
	- [1.4 How does ggplot2 fit in with other R graphics?](#1-4-How-does-ggplot2-fit-in-with-other-R-graphics)
- [第二章 - 从 `qplot` 入门](#第二章---从-qplot-入门)
	- [2.2 diamonds / dsmall 数据集](#2-2-diamonds---dsmall-数据集)
	- [2.3 基本用法](#2-3-基本用法)
	- [2.4 图形属性 (aesthetic attributes, e.g. color, size and shape)](#2-4-图形属性-aesthetic-attributes-e-g--color-size-and-shape)
	- [2.5 几何对象 (geom)](#2-5-几何对象-geom)
		- [2.5.1 添加 smooth 曲线](#2-5-1-添加-smooth-曲线)
		- [2.5.2 jitter plot 与 boxplot](#2-5-2-jitter-plot-与-boxplot)
		- [2.5.3 histogram 与 density plot](#2-5-3-histogram-与-density-plot)
		- [2.5.4 Bar charts](#2-5-4-Bar-charts)
		- [2.5.5 Time series with line and path plots](#2-5-5-Time-series-with-line-and-path-plots)
	- [2.6 分面 (facet)](#2-6-分面-facet)
	- [2.7 Other options for `qplot`](#2-7-Other-options-for-qplot)
- [第三章 - 语法突破](#第三章---语法突破)
	- [3.2 mpg 数据集](#3-2-mpg-数据集)
	- [3.3 散点图绘制的详细过程](#3-3-散点图绘制的详细过程)
	- [3.4 更复杂的图形示例](#3-4-更复杂的图形示例)
	- [3.5 图层 (layer) 的组件](#3-5-图层-layer-的组件)
	- [3.6 ggplot 对象](#3-6-ggplot-对象)
- [第四章 - 用图层构建图像](#第四章---用图层构建图像)
	- [4.2 创建 ggplot 对象](#4-2-创建-ggplot-对象)
	- [4.3 添加图层 (layer)](#4-3-添加图层-layer)
	- [4.4 `ggplot(data=?)` 参数设置](#4-4-ggplotdata=-参数设置)
	- [4.5 `ggplot(mapping=aes(...))` 参数设置](#4-5-ggplotmapping=aes----参数设置)
		- [4.5.1 `aes` 的扩展、覆盖、移除](#4-5-1-aes-的扩展、覆盖、移除)
		- [4.5.2 图形属性：设定 (setting) 与映射 (mapping) 的区别](#4-5-2-图形属性：设定-setting-与映射-mapping-的区别)
		- [4.5.3 分组: `aes(group=?)`](#4-5-3-分组-aesgroup=)
		- [4.5.4 匹配图形属性与图形对象](#4-5-4-匹配图形属性与图形对象)
	- [4.6 几何对象 (geom)](#4-6-几何对象-geom)
	- [4.7 统计变换 (stat)](#4-7-统计变换-stat)
	- [4.8 `geom_xxx(position=?)` 或 `stat_xxx(position=?)` 参数设置](#4-8-geom-xxxposition=-或-stat-xxxposition=-参数设置)
	- [4.9 整合](#4-9-整合)
		- [4.9.1 灵活使用 geom 与 stat](#4-9-1-灵活使用-geom-与-stat)
		- [4.9.2 统计量复用: `stat_identity()`](#4-9-2-统计量复用-stat-identity)
		- [4.9.3 不同图层可以使用不同的 `data=?`和 `mapping=aes(...)` 设置](#4-9-3-不同图层可以使用不同的-data=和-mapping=aes----设置)
- [第五章 - ggplot2 工具箱](#第五章---ggplot2-工具箱)
	- [5.2 图层的分类](#5-2-图层的分类)
	- [5.3 基本的 geom](#5-3-基本的-geom)
	- [5.4 展示数据分布的 geom](#5-4-展示数据分布的-geom)
	- [5.5 处理遮盖 (overplotting)](#5-5-处理遮盖-overplotting)
	- [5.6 如何绘制曲面图](#5-6-如何绘制曲面图)
	- [5.7 如何绘制地图](#5-7-如何绘制地图)
	- [5.8 如何展示 uncertainty](#5-8-如何展示-uncertainty)
	- [5.9 统计摘要: `stat_summary()`](#5-9-统计摘要-stat-summary)
	- [5.10 如何添加图形注解 (label, text, etc.)](#5-10-如何添加图形注解-label-text-etc-)
	- [5.11 如何体现数据的 weight](#5-11-如何体现数据的-weight)
- [第六章 - Scale, axis and legend](#第六章---Scale-axis-and-legend)
	- [6.2 scale 的工作原理](#6-2-scale-的工作原理)
	- [6.3 scale 的用法](#6-3-scale-的用法)
	- [6.4 scale 详解](#6-4-scale-详解)
		- [6.4.1 `scale_*_*(name=?)` 与 `labs()`](#6-4-1-scale-*-*name=-与-labs)
		- [6.4.2 `scale_x_*(limits=?, breaks=?, labels=?)` 与 formatter](#6-4-2-scale-x-*limits=-breaks=-labels=-与-formatter)
		- [6.4.3 `scale_colour_*` 与 `scale_fill_*`](#6-4-3-scale-colour-*-与-scale-fill-*)
		- [6.4.4 `scale_*_manual`](#6-4-4-scale-*-manual)
		- [6.4.5 `scale_*_identity`](#6-4-5-scale-*-identity)
	- [6.5 legend and axis](#6-5-legend-and-axis)
- [第七章 - Facet and coord system](#第七章---Facet-and-coord-system)
	- [7.2 分面 (facet)](#7-2-分面-facet)
		- [7.2.1 `facet_grid`](#7-2-1-facet-grid)
		- [7.2.2 `facet_wrap`](#7-2-2-facet-wrap)
		- [7.2.3 `facet_*(scales=?, space=?)` 参数设置](#7-2-3-facet-*scales=-space=-参数设置)
		- [7.2.4 如果某个图层的 data 没有 formula 指定的变量](#7-2-4-如果某个图层的-data-没有-formula-指定的变量)
		- [7.2.5 `aes(group=?)` vs faceting](#7-2-5-aesgroup=-vs-faceting)
		- [7.2.6 `geom_*(position="dodge")` vs faceting](#7-2-6-geom-*position="dodge"-vs-faceting)
		- [7.2.7 如何处理连续型的 facet variable](#7-2-7-如何处理连续型的-facet-variable)
	- [7.3 Coord system](#7-3-Coord-system)
		- [7.3.1 坐标系变换](#7-3-1-坐标系变换)
		- [7.3.2 stat 依赖于坐标系](#7-3-2-stat-依赖于坐标系)
		- [7.3.3 Cartesian 坐标系](#7-3-3-Cartesian-坐标系)
		- [7.3.4 Non-Cartesian 坐标系](#7-3-4-Non-Cartesian-坐标系)
- [第八章 - Polishing your plots for publication](#第八章---Polishing-your-plots-for-publication)
	- [8.1 主题 (theme)](#8-1-主题-theme)
		- [8.1.1 内置主题](#8-1-1-内置主题)
		- [8.1.2 主题元素的设置](#8-1-2-主题元素的设置)
	- [8.2 自定义 scale 和 geom](#8-2-自定义-scale-和-geom)
	- [8.3 保存作图到文件](#8-3-保存作图到文件)
	- [8.4 多图排列](#8-4-多图排列)
- [第九章 - Data Manipulation](#第九章---Data-Manipulation)
- [第十章 - 减少重复性的工作](#第十章---减少重复性的工作)

## 第一章 - 简介 <a name="第一章---简介"></a>

### 1.1 Welcome to ggplot2 <a name="1-1-Welcome-to-ggplot2"></a>

... it has a deep underlying grammar. This grammar, based on the _Grammar of Graphics_ (Wilkinson, 2005), is composed of a set of independent components that can be composed in many different ways. This makes `ggplot2` very powerful, because you are not limited to a set of pre-specified graphics, but you can create new graphics that are precisely tailored for your problem.

`ggplot2` is designed to work in a layered fashion, starting with a layer showing the raw data then adding layers of annotations and statistical summaries. It allows you to produce graphics using the same structured thinking that you use to design an analysis, reducing the distance between a plot in your head and one on the page.

- [ggplot2 Reference](http://ggplot2.tidyverse.org/reference/index.html)

### 1.3 What is the grammar of graphics? <a name="1-3-What-is-the-grammar-of-graphics"></a>

In brief, the grammar tells us that **a statistical graphic is a mapping from data to aesthetic attributes (colour, shape, size) of geometric objects (points, lines, bars)**.

The first description of the components follows below:

- _**geoms**_: Geometric objects
	- 其实是指图像类型 (scatterplot, smooth, histogram, boxplot, etc.)
- _**data**_: What you want to visualise 
	- _**facet**_: how to break up the data into subsets and how to display those subsets as small multiples. 
		- a.k.a conditioning or latticing/trellising.
		- facet: [ˈfæsɪt] 
			- [verb] to cut facets on
			- [noun] one of the small, polished plane surfaces of a cut gem
	- _**stats**_: Statistical transformations, which summarise data in many useful ways. 
		- E.g. binning and counting observations to create a histogram
		- E.g. summarising a 2d relationship with a linear model
		- Stats are optional, but very useful.
- aesthetic _**mappings**_: describles how variables in the data are mapped to aesthetic attributes that you can perceive.
	- 具体的执行是靠 _scales_
		- 比如我们常用的 `colour=?` 是一个 scale，`size=?` 是一个 scale，`shape=?` 也是一个 scale
			- `x=?` 和 `y=?` 其实也是 scale
		- scale 可以做两个方向的 mapping：
			- $f$: data space $\rightarrow$ aesthetic space
				- 比如给 dot 上颜色
			- $f^{-1}$ (inverse): aesthetic space $\rightarrow$ data space
				- 比如画颜色的 legend
- _**coord**_: A coordinate system, describes how data coordinates are mapped to the plane of the graphic.
	- We normally use a Cartesian coordinate system, but a number of others are available, including polar coordinates and map projections.
		
It is also important to talk about what the grammar doesn’t do:

- It doesn’t suggest what graphics you should use to answer the questions you are interested in.
- Ironically, the grammar doesn’t specify what a graphic should look like. The finer points of display, for example, font size or background colour, are not specified by the grammar. In practice, a useful plotting system will need to describe these, as `ggplot2` does with its theming system.
- It does not describe interaction: the grammar of graphics describes only static graphics.

### 1.4 How does ggplot2 fit in with other R graphics? <a name="1-4-How-does-ggplot2-fit-in-with-other-R-graphics"></a>

- Base graphics has a pen on paper model: you can only draw on top of the plot, you cannot modify or delete existing content.
- Grid graphics have a system of viewports (each containing its own coordinate system) that makes it easier to lay out complex graphics.
- The `lattice` package uses grid graphics to implement the trellis graphics system and is a considerable improvement over base graphics. 
	- However, lattice graphics lacks a formal model, which can make it hard to extend.
- `ggplot2` is an attempt to take the good things about base and lattice graphics and improve on them with a strong underlying model which supports the production of any kind of statistical graphic.
	- Like `lattice`, `ggplot2` uses grid to draw the graphics, which means you can exercise much low-level control over the appearance of the plot.
	
## 第二章 - 从 `qplot` 入门 <a name="第二章---从-qplot-入门"></a>

### 2.2 diamonds / dsmall 数据集 <a name="2-2-diamonds---dsmall-数据集"></a>

```r
> library(ggplot2)
> 
> head(diamonds)
  carat       cut color clarity depth table price    x    y    z
1  0.23     Ideal     E     SI2  61.5    55   326 3.95 3.98 2.43
2  0.21   Premium     E     SI1  59.8    61   326 3.89 3.84 2.31
3  0.23      Good     E     VS1  56.9    65   327 4.05 4.07 2.31
4  0.29   Premium     I     VS2  62.4    58   334 4.20 4.23 2.63
5  0.31      Good     J     SI2  63.3    58   335 4.34 4.35 2.75
6  0.24 Very Good     J    VVS2  62.8    57   336 3.94 3.96 2.48
> 
> set.seed(1410) # Make the sample reproducible
> dsmall <- diamonds[sample(nrow(diamonds), 100), ]
```

### 2.3 基本用法 <a name="2-3-基本用法"></a>

Simple xy-scatterplots:

```r
qplot(x = carat, y = price, data = diamonds)
	## OR equivalently ##
qplot(x = diamonds$carat, y = diamonds$price)
```

Using the `data` argument is recommended: it’s a good idea to keep related data in a single data frame.

Because `qplot()` accepts functions of variables as arguments, we can plot `log(price)` vs. `log(carat)`:

```r
qplot(log(carat), log(price), data = diamonds)
```

Arguments can also be combinations of existing variables:

```r
qplot(carat, x * y * z, data = diamonds)
```

### 2.4 图形属性 (aesthetic attributes, e.g. color, size and shape) <a name="2-4-图形属性-aesthetic-attributes-e-g--color-size-and-shape"></a>

With `plot`, it’s your responsibility to convert a categorical variable in your data (e.g., "apples", "bananas", "pears") into something that plot knows how to use (e.g., "red", "yellow", "green"). `qplot` can do this for you automatically, and it will automatically provide a legend that maps the displayed attributes to the data values.

```r
qplot(carat, price, data = dsmall, colour = color) # or `color = color`
qplot(carat, price, data = dsmall, shape = cut)
qplot(carat, price, data = dsmall, size = x * y * z)
```

`colour`, `size` and `shape` are all examples of _**aesthetic attributes**_, visual properties that affect the way observations are displayed.

For every aesthetic attribute, there is a function, called a _scale_, which maps data values to valid values for that aesthetic. It is this _scale_ that controls the appearance of the points and associated legend. For example, in the above plots, the `colour` _scale_ maps `J` to purple and `F` to green.
	
scale 有默认实现。You can also manually set the aesthetics using `I()`, e.g., `colour = I("red")` or `size = I(2)`.

注意：这里 `I(x)` 的作用是 "to inhibit interpretation or conversion of `x`"，也可以描述为 "indicate that `x` should be treated as-is"。具体是实现是 `"AsIs" <- attr(x, "class")`。那么不用 `I()` 会导致什么后果呢？比较下面两句：

```r
qplot(carat, price, data = dsmall, colour = I("blue"))	# (1)
qplot(carat, price, data = dsmall, colour = "blue")		# (2)
```

- (1) 句的 `"blue"` 没有被 interpret，所以所有的 data point 都是蓝色
- (2) 句的 `"blue"` 有被 interpret，所以所有的 data point 显示出来的是……浅红色
	- 这个浅红色其实是 `colour = color` 的 legend 的第一个颜色
	
For large datasets, like the diamonds data, semitransparent points are often useful to alleviate some of the overplotting. To make a semi-transparent colour you can use the `alpha` aesthetic, which takes a value between 0 (completely transparent) and 1 (complete opaque). It’s often useful to specify the transparency as a fraction, e.g., `1/10` or `1/20`, as the denominator specifies the number of points that must overplot to get a completely opaque colour.

```r
qplot(carat, price, data = diamonds, alpha = I(1/10))
qplot(carat, price, data = diamonds, alpha = I(1/100))
qplot(carat, price, data = diamonds, alpha = I(1/200))
```

Different types of aesthetic attributes work better with different types of variables: 	

- `colour` and `shape` work well with categorical variables, 
- while `size` works better with continuous variables.

The amount of data also makes a difference: 

- If there is a lot of data, it can be hard to distinguish the different groups. 
- An alternative solution is to use _**faceting**_.

### 2.5 几何对象 (geom) <a name="2-5-几何对象-geom"></a>

`qplot` is not limited to scatterplots, but can produce almost any kind of plot by varying the `geom`.

For 2d data $(X, Y)$:

- `geom = "point"`: scatterplot. This is the default when you do `qplot(x=?, y=?)`.
- `geom = "smooth"`: fits a smoother to the data and displays the smooth and its standard error.
- `geom = "boxplot"`: box-and-whisker plot.
- `geom = "path"` or `geom = "line"`: draw lines between the data points. 
	- Traditionally used for time series data. 
	- A line is constrained to travel from left to right, while paths can go in any direction.
	
For 1d data $X$:

- For continuous variables:
	- `geom = "histogram"`: histogram, the default when you do `qplot(x=?)`.
	- `geom = "freqpoly"`: frequency polygon. 类似 histogram，不过是曲线
	- `geom = "density"`: density plot
- For discrete variables：
	- `geom = "bar"`: bar chart.
		- histogram 是先分 bin，然后统计落到每个 bin 的数量。所以 histogram 用于 continuous variable
		- discrete variable 不需要分 bin，直接统计每一个具体值的数量就可以了。所以在形状上这两个图有点类似。
		
#### 2.5.1 添加 smooth 曲线 <a name="2-5-1-添加-smooth-曲线"></a>

```r
qplot(carat, price, data = dsmall, geom = c("point", "smooth"))
qplot(carat, price, data = diamonds, geom = c("point", "smooth"))
```

If you want to turn the confidence interval off, use `se = FALSE`.

There are many different smoothers you can choose between by using the `method` argument:

- `method = "loess"`: local regression, the default for small $n$.
	- More details about the algorithm used can be found in `?loess`. 
	- The wiggliness of the line is controlled by the `span` parameter, which ranges from 0 (exceedingly wiggly) to 1 (not so wiggly).
	- Loess does not work well for large datasets (it’s $O(n^2)$ in memory), and so alternatively `method = "gam"` is used when $n$ is greater than 1,000.
	
```r
qplot(carat, price, data = dsmall, geom = c("point", "smooth"), span = 0.2)
qplot(carat, price, data = dsmall, geom = c("point", "smooth"), span = 1)
```

- <del>`method = "gam"`</del>: Generalised Additive Model (GAM), the default for $n > 1000$
	- You need to load `mgcv` (Mixed GAM Computation Vehicle) library first to import [formula `s`](https://stat.ethz.ch/R-manual/R-devel/library/mgcv/html/s.html) for the common usage `method = "gam", formula = y ~ s(x)`.
		- This is similar to using a spline with `lm`, but the degree of smoothness is estimated from the data.
	- For large data, use the formula `y ~ s(x, bs = "cs")`. This is the extact default behavior for $n > 1000$.
		- `bs = "cs"` specifies a shrinkage version of `bs = "cr"`, the cubic regression.

```r
## Obsolete ## 

# library(mgcv) 

# qplot(carat, price, data = dsmall, geom = c("point", "smooth"), method = "gam", formula = y ~ s(x))
# qplot(carat, price, data = dsmall, geom = c("point", "smooth"), method = "gam", formula = y ~ s(x, bs = "cs"))
```

- <del>`method = "lm"`</del>: Linear Model
	- default: straight line
	- `formula = y ~ poly(x, 2)`: degree 2 polynomial
	- `library(splines); formula = y ~ ns(x, 2)`: natural spline. `2` is the degrees of freedom: a higher number will create a wigglier curve.
	- etc.
	
```r
## Obsolete ## 

# library(splines) 

# qplot(carat, price, data = dsmall, geom = c("point", "smooth"), method = "lm") 
# qplot(carat, price, data = dsmall, geom = c("point", "smooth"), method = "lm", formula = y ~ ns(x,5)) 
```

- <del>`method = "rlm"`</del>: Robust Linear Model
	- In `MASS` package.
	- Robust in that outliers don’t affect the fit as much.

注：`method` 和 `formula` 已经不再是 `qplot()` 的参数了，如果要画出上述几个 smooth，可以用 `stat_smooth`

```r
p <- ggplot(dsmall, aes(x = carat, y = price)) + geom_point()

p + stat_smooth(method = "loess", formula = y ~ x, size = 1)

p + stat_smooth(method = "lm", formula = y ~ x, size = 1)
p + stat_smooth(method = "lm", formula = y ~ x + I(x^2), size = 1)
p + stat_smooth(method = "lm", formula = y ~ poly(x, 2), size = 1)

require(mgcv)
p + stat_smooth(method = "gam", formula = y ~ s(x), size = 1)
p + stat_smooth(method = "gam", formula = y ~ s(x, k = 3), size = 1)
```

更多内容可以参考 [How can I explore different smooths in ggplot2?](http://www.ats.ucla.edu/STAT/r/faq/smooths.htm)。

#### 2.5.2 jitter plot 与 boxplot <a name="2-5-2-jitter-plot-与-boxplot"></a>

When a set of data includes a categorical variable and one or more continuous variables, you will probably be interested to know how the values of the continuous variables vary with the levels of the categorical variable. Boxplots and jittered points offer two ways to do this.

也就是，将 data point 按 categorical variable 分类：

- $x$-axis 是分类
- $y$-axis 是 continuous variable 的值

<!-- -->

- `geom = "jitter"`: jittering
- `geom = "boxplot"`: box-and-whisker plot

```r
qplot(color, price / carat, data = diamonds, geom = "jitter", alpha = I(1 / 5))
qplot(color, price / carat, data = diamonds, geom = "jitter", alpha = I(1 / 50))
qplot(color, price / carat, data = diamonds, geom = "jitter", alpha = I(1 / 200))
```

Another way to look at conditional distributions is to use faceting to plot a separate histogram or density plot for each value of the categorical variable.

#### 2.5.3 histogram 与 density plot <a name="2-5-3-histogram-与-density-plot"></a>

Histogram and density plots show the distribution of a single variable. 

```r
qplot(carat, data = diamonds, geom = "histogram")
qplot(carat, data = diamonds, geom = "density")
```

- For the density plot, the `adjust` argument controls the degree of smoothness (high values of `adjust` produce smoother plots). 
- For the histogram, the `binwidth` argument controls the amount of smoothing by setting the bin size. 
	- Break points can also be specified explicitly, using the `breaks` argument.
	
```r
qplot(carat, data = diamonds, geom = "histogram", binwidth = 1, xlim = c(0,3))
qplot(carat, data = diamonds, geom = "histogram", binwidth = 0.1, xlim = c(0,3))
qplot(carat, data = diamonds, geom = "histogram", binwidth = 0.01, xlim = c(0,3))
```

另外注意 histogram 的 $y$-axis 默认是 count，可以改成 density：

```r
# histogram 默认情况是用 stat_bin 的 ..count.. 输出 
qplot(x = carat, y = ..count.., data = diamonds, geom = "histogram")
	## OR equivalently ##
qplot(carat, ..count.., data = diamonds, geom = "histogram")

# 可以改用 stat_bin 的 ..density.. 输出 
qplot(carat, ..density.., data = diamonds, geom = "histogram")
```

#### 2.5.4 Bar charts <a name="2-5-4-Bar-charts"></a>

1. 基本用法：对每一个 $x_i$，计算 $y_i = nrow(df[X == x_i,])$
1. 扩展用法：对每一个 $x_i$，计算 $y_i = sum(df[X == x_i,]\\$foo)$
	- 这里 `foo` 通过 `weight = foo` 来指定
	
```r
qplot(color, data = diamonds, geom = "bar")
qplot(color, data = diamonds, geom = "bar", weight = carat) + scale_y_continuous("carat") # 按 color 分组，统计各组的 carat 之和
qplot(color, data = diamonds, geom = "bar", weight = x*y*z) + scale_y_continuous("volumn") # 按 color 分组，统计各组的 x*y*z 之和
``` 

`scale_y_continuous` 表示 “我需要一个 continuous 的 $y$-axis”.

#### 2.5.5 Time series with line and path plots <a name="2-5-5-Time-series-with-line-and-path-plots"></a>

其实这两个图不一定非要用于 time series。简单来说，这两个图的画法就是：在 scatterplot $n$ 个 data point $p_1,\dots,p_n$ 的过程中，将 $p_1 \rightarrow p_2 \rightarrow \dots \rightarrow p_n$ 在坐标系内按顺序连起来。区别在于：

- line plot 会将 data point 按 $x$ 排序。如果 $x$-axis 是时间，那就正好反映了 how $y$ has changed over time
- path plot 不会排序，完全按照 appear in dataset 的顺序来，所以它反映的是 how $x$ and $y$ have simultaneously changed

```r
qplot(carat, price, data = dsmall, geom = c("point", "line"))

## Time Series using `ecnomics` dataset ## 
qplot(date, unemploy / pop, data = economics, geom = "line") # unemploy / pop = unemployment rate
qplot(date, uempmed, data = economics, geom = "line") # uempmed = median number of weeks unemployed

year <- function(x) as.POSIXlt(x)$year + 1900
qplot(unemploy / pop, uempmed, data = economics, geom = c("point", "path"))
qplot(unemploy / pop, uempmed, data = economics, geom = "path", colour = year(date)) + scale_area()
```

### 2.6 分面 (facet) <a name="2-6-分面-facet"></a>

Faceting creates tables of graphics by splitting the data into subsets and displaying the same graph for each subset in an arrangement that facilitates comparison.

The default faceting method in `qplot()` creates plots arranged on a grid specified by a faceting formula which looks like `row_var ~ col_var`. 简单说，

- `x ~ y` 的意思就是把 `df` group by `df$x` and `df$y`
- `x + y ~ z` 的意思就是把 `df` group by `df$x`， `df$y` and `df$z`

所有出现在 formula 里的 column name 都是 group by 的标准，出现在 `~` 左边或是右边的区别在于，以 `x ~ y` 为例：

- 最终的 grid plot 按 `~` 左边的 column name，i.e. `df$x` 的值排列 row
- 最终的 grid plot 按 `~` 右边的 column name，i.e. `df$y` 的值排列 column

而 `.` 是一个 place holder，表示 “我没有 column name 需要指定在 formula 的这一边”，也就是 “我只要 1 row 或者 1 column”。比较下面两句：

```r
qplot(carat, data = diamonds, facets = color ~ ., geom = "histogram", binwidth = 0.1, xlim = c(0, 3)) # Grid Plot 1
qplot(carat, data = diamonds, facets = . ~ color, geom = "histogram", binwidth = 0.1, xlim = c(0, 3)) # Grid Plot 2
```

这两句的逻辑是：

- 把 `diamonds` 按 `diamonds$color` 分成 7 个 subset (因为 color 有 7 种取值)
- 对每一个 subset 画 `diamonds$carat` 的 histogram
- 然后我把这 7 个 histogram 放到一个 grid plot 里
	- Grid Plot 1 是 $7 \times 1$ 排列
	- Grid Plot 2 是 $1 \times 7$ 排列

### 2.7 Other options for `qplot` <a name="2-7-Other-options-for-qplot"></a>

- `xlim = c(a,b)`: 必须是一个 length 2 vector，表示 "$x$-axis 只要画 `[a,b]` 这一段就好了"，如果 `[a,b]` 范围之外还有点或者线，直接截掉。一般是先在草图里确定了 $x$-axis 的有效范围后再指定
	- `ylim = c(a,b)`: 同上
- `log = "y"`: 表示 "$y$-axis 的 scale 换成 $\log_{10}$ 值，但是 axis mark 不变"
	- 你比较一下这两句就明白了：
		- `qplot(x = c(1,2,3), y = log10(c(10,100,1000)))`
		- `qplot(x = c(1,2,3), y = c(10,100,1000), log="y")`
	- `log = "x"`: 同上
	- `log = "xy"`: $x$-axis 和 $y$-axis 都做这个处理，尼玛这个语法我是万万没想到……
- `main = "plot title"`: 例子已经说明一切
	- `main = expression(beta[1] == 1)` 给出的 plot title 是 "$\beta_1 = 1$"，注意一定要是 `==`
	- See `?plotmath` for more
- `xlab = "x-axis label"`: 例子已经说明一切
	- 同 `main` 一样，也可以用 expression
	- `ylab` 同上
	
几个综合运用的例子：

```r
qplot(carat, price, data = dsmall, xlab = "Price ($)", ylab = "Weight (carats)", main = "Price-weight relationship")

qplot(carat, price/carat, data = dsmall, xlab = "Weight (carats)", ylab = expression(frac(price,carat)), main="Small diamonds", xlim = c(.2,1))

qplot(carat, price, data = dsmall, log = "xy")
```

## 第三章 - 语法突破 <a name="第三章---语法突破"></a>

### 3.2 mpg 数据集 <a name="3-2-mpg-数据集"></a>

这一章我们使用 `mpg` 这个 dataset：

```r
> library(ggplot2)
> head(mpg)
  manufacturer model displ year cyl      trans drv cty hwy fl   class
1         audi    a4   1.8 1999   4   auto(l5)   f  18  29  p compact
2         audi    a4   1.8 1999   4 manual(m5)   f  21  29  p compact
3         audi    a4   2.0 2008   4 manual(m6)   f  20  31  p compact
4         audi    a4   2.0 2008   4   auto(av)   f  21  30  p compact
5         audi    a4   2.8 1999   6   auto(l5)   f  16  26  p compact
6         audi    a4   2.8 1999   6 manual(m5)   f  18  26  p compact
```

- `displ`: the engine displacement in litres, 排量
- [`fl`: fuel](http://stackoverflow.com/a/25548752)
	- `e`: E85, 85% ethanol ([ˈɛθəˌnɔl], 乙醇) + 15% gasoline
	- `d`: diesel ([ˈdizəl], 柴油)
	- `r`: regular
	- `p`: premium
	- `c`: CNG, Compressed Natural Gas 

### 3.3 散点图绘制的详细过程 <a name="3-3-散点图绘制的详细过程"></a>

```r
qplot(displ, hwy, data = mpg, colour = factor(cyl))
```

But what is going on underneath the surface? How does ggplot2 draw this plot?

1. Mapping aesthetics to data
	- 上图我们没有指定 size 和 shape，我们说 "Size and shape are not mapped to variables, but remain at their default values."
	- 这个 mapping 相当创建了一个 mapped dataframe，在我们的例子中，它有三列：
		- `mdf$x` := `mpg$displ`
		- `mdf$y` := `mpg$hwy`
		- `mdf$color` := `factor(mpg$cyl)`
1. Scaling
	- Convert the mapped dataframe from data units to physical units (e.g. pixels and colors) that computer can display. 
		- 我们说："we have three aesthetics that need to be scaled: horizontal position (`x`), vertical position (`y`) and `colour`."
		- 负责完成这项工作的对象我们称为 `scale`s 
			- A scale is a function, and its inverse.
				- function 负责转换
				- inverse 负责 axis marks 和 legends
	- Scaling position is easy in this example because we are using the default **linear scales**. 
		- We need only a linear mapping from the range of the data to [0, 1], 这是 `ggplot2` 的底层 drawing system, `grid`, 要求的
1. 有了 scaled mapped dataframe，现在就可以开始画了：
	- Coordinate system, `coord`, 负责：
		- 确定每个 scaled $(x,y)$ 在画出来的图中的位置；
		- 画 axes
			- In most cases this will be Cartesian coordinates, but it might be polar coordinates, or a spherical projection used for a map.
		- 画 legends
	- 最后添加 plot annotation，包括 background、title、axis labels 等等 

### 3.4 更复杂的图形示例 <a name="3-4-更复杂的图形示例"></a>

```r
qplot(displ, hwy, data=mpg, facets = . ~ year) + geom_smooth()
```

### 3.5 图层 (layer) 的组件 <a name="3-5-图层-layer-的组件"></a>

The layered grammar defines a plot as the combination of:

- Data 
- Mappings from variables to aesthetics
- One or more layers, each composed of 
	- a `geom`, 
	- a `stat`, 
	- a `position` adjustment (See 4.8), 
	- and optionally (因为一般可以继承自原有的，所以不需要特别指定，比如我们的 `geom_smooth()` 就没有指定，但它还是知道哪个是 `x` 哪个是 `y`), 
		- Data
		- Mappings from variables to aesthetics
- One `scale` for each aesthetic mapping.
- A coordinate system (`coord`)
- Faceting specification

举个例子：

```r
ggplot(mpg, aes(hwy, cty)) +        # data and mapping
	geom_point(aes(color = cyl)) +  # layer
	geom_smooth(method ="lm") +     # layer
	coord_cartesian() +             # coord
	scale_color_gradient() +        # scale
	theme_bw()                      # additional elements
```

你可以简单认为每个 `geom_*()` 或者 `stat_*()` 函数都是一个 layer。

我们接下来的章节：

- Chapter 4: properties of layers
- Chapter 5: how layers are used to visulize data
- Chapter 6: scales
- Chapter 7: coordinate system + faceting
- Chapter 8: plot-specific theme options

### 3.6 ggplot 对象 <a name="3-6-ggplot-对象"></a>

A ggplot object is a list with components `data`, `mapping` (the default aesthetic mappings), `layers`, `scales` (functions carrying out `mapping`), `coordinates`, `facet` and `options`.

```r
> p <- qplot(displ, hwy, data = mpg, colour = factor(cyl))
> 
> p		# 隐式 render to screen
> print(p)	# 显式 render to screen
> 
> summary(p)
data: manufacturer, model, displ, year, cyl, trans, drv, cty, hwy, fl,
  class [234x11]
mapping:  colour = factor(cyl), x = displ, y = hwy
faceting: facet_null() 
-----------------------------------
geom_point:  
stat_identity:  
position_identity: (width = NULL, height = NULL)
> 
> save(p, file = "plot.rdata")		# Save object to disk
> 
> load("plot.rdata")			# Load object from disk
> 
> ggsave("plot.png", width = 5, height = 5)	# Save png to disk
```

## 第四章 - 用图层构建图像 <a name="第四章---用图层构建图像"></a>

### 4.2 创建 ggplot 对象 <a name="4-2-创建-ggplot-对象"></a>

When we used `qplot()`, it did a lot of things for us: it created a ggplot object, added layers, and displayed the result, using many default values along the way. 

To create the ggplot object ourselves, we use `ggplot()`. It has two arguments: `data` and aesthetic `mapping`

- These 2 arguments set up defaults for the plot and can be omitted if you specify data and aesthetics when adding layers later. 

```r
p <- ggplot(diamonds, aes(carat, price, colour = cut))
```

This ggplot object cannot be displayed until we add a layer: there is nothing to see!

### 4.3 添加图层 (layer) <a name="4-3-添加图层-layer"></a>

A minimal scatterplot layer:

```r
p <- p + layer(geom = "point")
```

Now it can be rendered!

A more fully specified layer can take any or all of these arguments:

```r
layer(geom, geom_params, stat, stat_params, data, mapping, position)
```

Here is what a more complicated call looks like. It produces a histogram coloured “steelblue” with a bin width of 2:

```r
p <- ggplot(diamonds, aes(x = carat))
p <- p + layer(
	geom = "bar",
	geom_params = list(fill = "steelblue"),
	stat = "bin",
	stat_params = list(binwidth = 2)
)
p
```

This layer specification is precise but verbose. We can simplify it by using shortcuts:

```r
p <- ggplot(diamonds, aes(x = carat))
p <- p + geom_histogram(binwidth = 2, fill = "steelblue")
p
```

`qplot` object 也可以添加 layer：

```r
qplot(sleep_rem / sleep_total, awake, data = msleep, geom = c("point", "smooth"))
	## OR equivalently ##
qplot(sleep_rem / sleep_total, awake, data = msleep) + geom_smooth()
	## OR equivalently ##
ggplot(msleep, aes(sleep_rem / sleep_total, awake)) + geom_point() + geom_smooth()
```

Layers are regular R objects and so can be stored as variables, making it easy to write clean code that reduces duplication:

```r
bestfit <- geom_smooth(method = "lm", se = F, colour = alpha("steelblue", 0.5), size = 2)

qplot(sleep_rem, sleep_total, data = msleep) + bestfit
qplot(awake, brainwt, data = msleep, log = "y") + bestfit
qplot(bodywt, brainwt, data = msleep, log = "xy") + bestfit
```

### 4.4 `ggplot(data=?)` 参数设置 <a name="4-4-ggplotdata=-参数设置"></a>

The `data` parameter must be a data frame and this is the only restriction.

This restriction also makes it very easy to produce the same plot for different data: you can update your current data frame and pass it to your ggplot object via `%+%` operator:

```r
p <- ggplot(mtcars, aes(mpg, wt, colour = cyl)) + geom_point()
p

mtcars <- transform(mtcars, mpg = mpg ^ 2)
p %+% mtcars
```

Any change of values or dimensions is legitimate. However, if a variable changes from discrete to continuous (or vice versa), you will need to change the default scales.

It is not necessary to specify a default dataset except when using faceting; faceting is a global operation (i.e., it works on all layers).

The `data` data frame is stored in the ggplot object **as a copy, not a reference**. This has two important consequences: 

- if your data changes, the plot will not; 
- and ggplot2 objects are entirely self-contained so that they can be `save()`d to disk and later `load()`ed and plotted without needing anything else from that session.

### 4.5 `ggplot(mapping=aes(...))` 参数设置 <a name="4-5-ggplotmapping=aes----参数设置"></a>

The `aes` function takes a list of aesthetic-variable pairs like these:

```r
aes(x = weight, y = height, colour = age)
```

Note that functions of variables can be used:

```r
aes(x = weight, y = height, colour = sqrt(age))
```

#### 4.5.1 `aes` 的扩展、覆盖、移除 <a name="4-5-1-aes-的扩展、覆盖、移除"></a>

The default aesthetic mappings can be set when the plot is initialised or modified later using `+`:

```r
p <- ggplot(mtcars)
p <- p + aes(wt, hp)
```

The default mappings in the plot `p` can be extended, overridden or removed in the layers:

```r
p + geom_point(aes(colour = factor(cyl)))	# extend
p + geom_point(aes(y = disp))		# override
p + geom_point(aes(y = NULL))		# remove
```

#### 4.5.2 图形属性：设定 (setting) 与映射 (mapping) 的区别 <a name="4-5-2-图形属性：设定-setting-与映射-mapping-的区别"></a>

注意 `aes` 是 "**map** an aesthetic to a variable"，不用 `aes` 的时候我们可以 "**set** an aesthetic to a constant":

```r
p <- ggplot(mtcars, aes(mpg, wt))

p + geom_point(colour = "darkblue")	# OK
p + geom_point(aes(colour = "darkblue")) # Wrong!
```

后面一句的错误在于：它是 **maps** (not **sets**) the `colour` to the value “darkblue”. This effectively creates a new variable containing only the value “darkblue” and then maps `colour` to that new variable. Because this value is discrete, the default colour scale uses evenly spaced colours on the colour wheel, and since there is only one value, this colour is pinkish.

`qplot` 里我们可以用 `I()` 来 set：

```r
qplot(mpg, wt, data = mtcars, colour = I("darkblue"))
```

但是 we CANNOT use `aes(colour = I("darkblue"))`。

#### 4.5.3 分组: `aes(group=?)` <a name="4-5-3-分组-aesgroup="></a>

We use `Oxboys` dataset in `nlme` library here for demostration. It records the heights (`height`) and centered ages (`age`) of 26 boys (`Subject`), measured on nine occasions (`Occasion`).

```r
> library(nlme)
> head(Oxboys, n=18)
   Subject     age height Occasion
1        1 -1.0000  140.5        1
2        1 -0.7479  143.4        2
3        1 -0.4630  144.8        3
4        1 -0.1643  147.1        4
5        1 -0.0027  147.7        5
6        1  0.2466  150.2        6
7        1  0.5562  151.7        7
8        1  0.7781  153.3        8
9        1  0.9945  155.8        9
10       2 -1.0000  136.9        1
11       2 -0.7479  139.1        2
12       2 -0.4630  140.1        3
13       2 -0.1643  142.6        4
14       2 -0.0027  143.2        5
15       2  0.2466  144.0        6
16       2  0.5562  145.8        7
17       2  0.7781  146.8        8
18       2  0.9945  148.3        9
```

给每个 boy 画一条 age-height 的连线图 (由 9 个点连接而成)：

```r
p <- ggplot(Oxboys, aes(age, height, group = Subject)) + geom_line()
```

注意这会产生 26 条曲线，而且是画在**同一个**坐标轴里的。而 `facet = . ~ Subject` 是分成了 26 个坐标轴，每个坐标轴里只有一条曲线，注意区别。

默认情况下，没有分组时相当于 `aes(group = 1)`。

在这 26 条曲线的基础上，再加一条整个数据集的 smooth：

```r
p + geom_smooth(aes(group = 1), method="lm", size = 2, se = F)
```

注意，要画整个数据集的 smooth，我们要覆盖掉之前的 group 设定。这从另外一个角度说明，我们对不同的 layer，可以有不同的 group 设定。

#### 4.5.4 匹配图形属性与图形对象 <a name="4-5-4-匹配图形属性与图形对象"></a>

Stacked bar chart:

```r
p <- ggplot(diamonds, aes(x = color, color=cut, fill=cut)) + geom_bar()
```

### 4.6 几何对象 (geom) <a name="4-6-几何对象-geom"></a>

geom 列表：

| geom_\*                                                      | Description                                                                                                                                                                                                                                                                           | 描述                                        |
|--------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------|
| abline                                                       | Line, specified by slope and intercept                                                                                                                                                                                                                                                | 斜线                                        |
| area                                                         | Area plots                                                                                                                                                                                                                                                                            | 面积图（联系微积分）                        |
| bar                                                          | Bars, rectangles with bases on y-axis                                                                                                                                                                                                                                                 | 条形图                                      |
| bin2d                                                        | 2d heat map                                                                                                                                                                                                                                                                           | 二维热图                                    |
| blank                                                        | Blank, draws nothing                                                                                                                                                                                                                                                                  |                                             |
| boxplot                                                      | Box-and-whisker plot                                                                                                                                                                                                                                                                  | 箱线图                                      |
| contour                                                      | Display contours of a 3d surface in 2d                                                                                                                                                                                                                                                | 等高线图                                    |
| crossbar                                                     | Hollow bar with middle indicated by horizontal line                                                                                                                                                                                                                                   | 带有水平中心线的盒子图（类似只有 box 的 boxplot） |
| density                                                      | Display a smooth density estimate                                                                                                                                                                                                                                                     | 光滑密度曲线图                              |
| density2d                                                    | Contours from a 2d density estimate 二维密度等高线图                                                                                                                                                                                                                                  |                                             |
| errorbar                                                     | Error bars                                                                                                                                                                                                                                                                            | 误差棒（类似只有 box 顶和底的 boxplot）     |
| histogram                                                    | Histogram                                                                                                                                                                                                                                                                             | 直方图                                      |
| hline                                                        | Line, horizontal                                                                                                                                                                                                                                                                      | 水平线                                      |
| interval                                                     | Base for all interval (range) geoms                                                                                                                                                                                                                                                   |                                             |
| jitter                                                       | Points, jittered to reduce overplotting                                                                                                                                                                                                                                               | 本质是个 scatterplot，dots 被添加扰动，减少重叠 |
| line                                                         | Connect observations, in order of $x$ value                                                                                                                                                                                                                                           | 按 $x$-axis 的顺序连接各个点   |
| linerange                                                    | An interval represented by a vertical line                                                                                                                                                                                                                                            | 一条竖线，表示 $y$-axis 的一个区间          |
| path                                                         | Connect observations, in original order                                                                                                                                                                                                                                               | 与 line 不同，path 是按数据的原始 $x$ 顺序连接各个点 |
| point                                                        | Points, as for a scatterplot                                                                                                                                                                                                                                                          | 散点图                                      |
| pointrange                                                   | An interval represented by a vertical line, with a point in the middle                                                                                                                                                                                                                | 在 linerange 的基础上，在中点处添加一个 dot |
| polygon                                                      | Polygon, a filled path                                                                                                                                                                                                                                                                | 多边形，相当于一个有填充的 path             |
| quantile                                                     | Add quantile lines from a [quantile regression](https://stackoverflow.com/a/37160755)                                                                                                                                                                                                  | 分位数回归线                                |
| ribbon                                                       | Ribbons, $y$ range with continuous $x$ values                                                                                                                                                                                                                                         | 色带图                                      |
| [rug](http://ggplot2.tidyverse.org/reference/geom_rug.html)   | rug plots in the margins                                                                                                                                                                                                                                                              | 边界地毯图                                  |
| segment                                                      | Single line segments                                                                                                                                                                                                                                                                  | 线段（可带箭头）                             |
| smooth                                                       | Add a smoothed condition mean                                                                                                                                                                                                                                                         | 光滑的条件均值线                            |
| step                                                         | Connect observations by stairs                                                                                                                                                                                                                                                        | 类似方波信号图                              |
| text                                                         | Textual annotations                                                                                                                                                                                                                                                                   |                                             |
| [tile](http://ggplot2.tidyverse.org/reference/geom_tile.html) | `geom_rect` and `geom_tile` do the same thing (其实都是 heat map), but are parameterised differently `geom_rect` uses the locations of the four corners (`xmin`, `xmax`, `ymin` and `ymax`), while `geom_tile` uses the center of the tile and its size (`x`, `y`, `width`, `height`) | 瓦片图                                      |
| vline                                                        | Line, vertical                                                                                                                                                                                                                                                                        | 垂直线                                      |

geom aes 参数：

| Name       | Default Stat | Required Aesthetics              | Optional Aesthetics                         |
|------------|--------------|----------------------------------|---------------------------------------------|
| abline     | abline       |                                  | colour, linetype, size                      |
| area       | identity     | x, y                             | colour, fill, linetype, size                |
| bar        | bin          | x                                | colour, fill, linetype, size, weight        |
| bin2d      | bin2d        | xmax, xmin, ymax, ymin           | colour, fill, linetype, size, weight        |
| blank      | identity     |                                  |                                             |
| boxplot    | boxplot      | lower, middle, upper, ymax, ymin | colour, fill, size, weight, x               |
| contour    | contour      | x, y                             | colour, linetype, size, weight              |
| crossbar   | identity     | x, y, ymax, ymin                 | colour, fill, linetype, size                |
| density    | density      | x, y                             | colour, fill, linetype, size, weight        |
| density2d  | density2d    | x, y                             | colour, linetype, size, weight              |
| errorbar   | identity     | x, ymax, ymin                    | colour, linetype, size, width               |
| freqpoly   | bin          |                                  | colour, linetype, size                      |
| hex        | binhex       | x, y                             | colour, fill, size                          |
| histogram  | bin          | x                                | colour, fill, linetype, size, weight        |
| hline      | hline        |                                  | colour, linetype, size                      |
| jitter     | identity     | x, y                             | colour, fill, shape, size                   |
| line       | identity     | x, y                             | colour, linetype, size                      |
| linerange  | identity     | x, ymax, ymin                    | colour, linetype, size                      |
| path       | identity     | x, y                             | colour, linetype, size                      |
| point      | identity     | x, y                             | colour, fill, shape, size                   |
| pointrange | identity     | x, y, ymax, ymin                 | colour, fill, linetype, shape, size         |
| polygon    | identity     | x, y                             | colour, fill, linetype, size                |
| quantile   | quantile     | x, y                             | colour, linetype, size, weight              |
| rect       | identity     | xmax, xmin, ymax, ymin           | colour, fill, linetype, size                |
| ribbon     | identity     | x, ymax, ymin                    | colour, fill, linetype, size                |
| rug        | identity     |                                  | colour, linetype, size                      |
| segment    | identity     | x, xend, y, yend                 | colour, linetype, size,                     |
| smooth     | smooth       | x, y                             | alpha, colour, fill, linetype, size, weight |
| step       | identity     | x, y                             | colour, linetype, size                      |
| text       | identity     | label, x, y                      | angle, colour, hjust, size, vjust           |
| tile       | identity     | x, y                             | colour, fill, linetype, size                |
| vline      | vline        |                                  | colour, linetype, size                      |

### 4.7 统计变换 (stat) <a name="4-7-统计变换-stat"></a>

Every geom has a default stat, and every stat a default geom.

| stat_\*   | Description                                                | 描述             |
|-----------|------------------------------------------------------------|------------------|
| bin       | Bin data                                                   | 分 bin           |
| boxplot   | Calculate components of box-and-whisker plot               |                  |
| contour   | Contours of 3d data                                        |                  |
| density   | Density estimation, 1d                                     |                  |
| density2d | Density estimation, 2d                                     |                  |
| function  | Superimpose a function                                     | 自定义 stat 变换 |
| identity  | No transformation                                          |                  |
| qq        | Calculation for quantile-quantile plot                     |                  |
| quantile  | Continuous quantiles                                       | 计算连续的分位数 |
| smooth    | Add a smoother                                             |                  |
| spoke     | Convert angle and radius to `xend` and `yend`              |                  |
| step      | Create stair steps                                         |                  |
| sum       | Sum unique values. Useful for overplotting on scatterplots |                  |
| summary   | Summarise `y` values at every unique `x`                   |                  |
| unique    | Remove duplicates                                          |                  |

A stat takes a dataset as input and returns a dataset as output, and so a stat can add new variables to the original dataset. It is possible to map aesthetics to these new variables. For example, `stat_bin` produces the following variables:

- `count`, the number of observations in each bin
- `density`, the density of observations in each bin (percentage of total / bar width)
- `x`, the centre of the bin

These generated variables can be used instead of the variables present in the original dataset. E.g.

```r
ggplot(diamonds, aes(carat)) +
+ geom_histogram(aes(y = ..density..), binwidth = 0.1)
```

The names of generated variables must be surrounded with `..` when used.

### 4.8 `geom_xxx(position=?)` 或 `stat_xxx(position=?)` 参数设置 <a name="4-8-geom-xxxposition=-或-stat-xxxposition=-参数设置"></a>

| Position | Description                                                         | 描述                       |
|----------|---------------------------------------------------------------------|----------------------------|
| dodge    | Descriptionodging overlaps to the side                              | 避免重叠，并排放置         |
| fill     | Stack overlapping objects and standardise them to have equal height | 堆叠元素并将高度标准化为 1 |
| identity | No position adjustment                                              |                            |
| jitter   | Jitter points to avoid overplotting                                 | 给 dots 添加扰动避免重合   |
| stack    | Stack overlapping objects on top of one another                     | 堆叠元素                   |

### 4.9 整合 <a name="4-9-整合"></a>

#### 4.9.1 灵活使用 geom 与 stat <a name="4-9-1-灵活使用-geom-与-stat"></a>

A number of the geoms available in ggplot2 were derived from other geoms.

| Alias            | Equivalence                                              |
|------------------|----------------------------------------------------------|
| `geom_area`      | `geom_ribbon(aes(min = 0, max = y), position = "stack")` |
| `geom_density`   | `geom_area(stat = "density")`                            |
| `geom_freqpoly`  | `geom_line(stat = "bin")`                                |
| `geom_histogram` | `geom_bar(stat = "bin")`                                 |
| `geom_jitter`    | `geom_point(position = "jitter")`                        |
| `geom_quantile`  | `geom_line(stat = "quantile")`                           |
| `geom_smooth`    | `geom_ribbon(stat = "smooth")`                           |

#### 4.9.2 统计量复用: `stat_identity()` <a name="4-9-2-统计量复用-stat-identity"></a>

如果你已经有变换过的数据，并且想再次使用，可以用 `stat_identity(geom=?)` 将原有的变化过的数据画到新的图层里。

#### 4.9.3 不同图层可以使用不同的 `data=?`和 `mapping=aes(...)` 设置 <a name="4-9-3-不同图层可以使用不同的-data=和-mapping=aes----设置"></a>

略

## 第五章 - ggplot2 工具箱 <a name="第五章---ggplot2-工具箱"></a>

### 5.2 图层的分类 <a name="5-2-图层的分类"></a>

略

### 5.3 基本的 geom <a name="5-3-基本的-geom"></a>

略

### 5.4 展示数据分布的 geom <a name="5-4-展示数据分布的-geom"></a>

略

### 5.5 处理遮盖 (overplotting) <a name="5-5-处理遮盖-overplotting"></a>

略

### 5.6 如何绘制曲面图 <a name="5-6-如何绘制曲面图"></a>

略

### 5.7 如何绘制地图 <a name="5-7-如何绘制地图"></a>

略

### 5.8 如何展示 uncertainty <a name="5-8-如何展示-uncertainty"></a>

| 变量 $X$ 类型 | 仅展示区间       | 同时展现区间和中间值             |
|---------------|------------------|----------------------------------|
| 连续型        | `geom_ribbon`    | `geom_smooth(stat = "identity")` |
| 离散型        | `geom_errorbar`  | `geom_crossbar`                  |
|               | `geom_linerange` | `geom_pointrange`                |

### 5.9 统计摘要: `stat_summary()` <a name="5-9-统计摘要-stat-summary"></a>

参考：

- [Reference - Summarise y values at unique/binned x](http://ggplot2.tidyverse.org/reference/stat_summary.html)
- [Reference - Vector Helpers](http://ggplot2.tidyverse.org/reference/index.html#section-vector-helpers)

Summary functions from the `Hmisc` package that have special wrappers to make them easy to use with `stat_summary()`:

| Function           | `Hmisc` original  | Middle | Range                                    |
|--------------------|-------------------|--------|------------------------------------------|
| `mean_cl_normal()` | `smean.cl.boot()` | Mean   | Standard error from normal approximation |
| `mean_cl_boot()`   | `smean.cl.boot()` | Mean   | Standard error from bootstrap            |
| `mean_sdl()`       | `smean.sdl()`     | Mean   | Multiple of standard deviation           |
| `median_hilow()`   | `smedian.hilow()` | Median | Outer quantiles with equal tail areas    |

### 5.10 如何添加图形注解 (label, text, etc.) <a name="5-10-如何添加图形注解-label-text-etc-"></a>

略。图例精彩，可参考。

### 5.11 如何体现数据的 weight <a name="5-11-如何体现数据的-weight"></a>

略

## 第六章 - Scale, axis and legend <a name="第六章---Scale-axis-and-legend"></a>

### 6.2 scale 的工作原理 <a name="6-2-scale-的工作原理"></a>

略

### 6.3 scale 的用法 <a name="6-3-scale-的用法"></a>

See [Reference - Scales](http://ggplot2.tidyverse.org/reference/index.html#section-scales).

All scale constructors have a common naming scheme. They start with `scale_`, followed by the name of the aesthetic (e.g., `colour_`, `shape_` or `x_`), and finally by the name of the scale (e.g., `gradient`, `hue` or `manual`)

To change the default scales, use `set_default_scale()`.

### 6.4 scale 详解 <a name="6-4-scale-详解"></a>

#### 6.4.1 `scale_*_*(name=?)` 与 `labs()` <a name="6-4-1-scale-*-*name=-与-labs"></a>

设置 axis (比如 `scale_x_*`) 或者 legend (比如 `scale_color_*`) 上出现的标签。

注意标签可以使用 latex，具体参考 `?plotmath`。

因为修改 labels 这个操作经常用到，所以设计了 `labs()` 以及衍生的一些函数来简化操作：

- `xlab("Foo") == labs(x = "Foo")`
- `ylab("Bar") == labs(y = "Bar")`
- `ggtitle(label = "Foo", subtitle = "bar") == labs(title = "Foo", subtitle = "bar")`

而且，比如说你用了 `colour` 的 scale，就可以用 `labs(colour = "Foo")` 来设置 legend 上方的 label：

```r
p <- ggplot(mtcars, aes(mpg, wt, colour = cyl)) + geom_point()

p + labs(colour = "Cylinders")

p + labs(x = "New x label")

p + labs(title = "New plot title")

p + labs(caption = "(based on data from ...)")  # 加在 plot 的右下方
```

#### 6.4.2 `scale_x_*(limits=?, breaks=?, labels=?)` 与 formatter <a name="6-4-2-scale-x-*limits=-breaks=-labels=-与-formatter"></a>

以 $x$-axis 为例：

- `limits` 指 $x$-axis 的范围
	- 对 continuous 的 $X$ 而言，`limits = c(a, b)` 就设置了 $x$-axis 在 `[a, b]` 区间上
	- 对 discrete 的 $X$ 而言，`limits` 实际的作用相当于 `breaks`，而且 $x$-axis 上 breaks 的顺序和 `limits` 的一致。
		- 比如说 `limits = c("#3", "#2", "#1")`，你 $x$-axis 上就是 `#3`、`#2`、`#1` 的顺序
	- 类似 `xlab` 与 `ylab`，有 `xlim` 与 `ylim` 来简化操作
- `breaks` 指刻度线
	- 比如 `limits = c(0, 1), breaks = c(0, 0.5, 1)` 就是 3 个刻度 `0`、`0.5`、`1`
- `labels` 指自定义的刻度显示
	- 比如 `breaks = c(0, 0.5, 1), labels = c("zero", "half", "whole")` 就是在 `0` 刻度显示 `zero`、在 `0.5` 刻度显示 `half`、在 `1` 刻度显示 `whole`

此外，还可以指定 `labels = formatter` 而不是具体的值：

```r
library(scales)
# Format labels as percents 
p + scale_x_continuous(labels = percent)
# Format labels as scientific 
p + scale_x_continuous(labels = scientific)
```

- 对 continuous 的 $X$ 而言，可用的 formatter 有：
	- `comma`
	- `percent`
	- `dollar`
	- `scientific`
- 对 discrete 的 $X$ 而言，可用的 formatter 有：
	- `abbreviate`

另外对 continuous 的 $X$ 而言，`scale_x_log10() == scale_x_continuous(trans = "log10")`。类似的 `trans` 还可以设置为：

| Name     | Function $\operatorname f(x)$ |
|----------|-------------------------------|
| asn      | $\operatorname{tanh}^{−1}(x)$ |
| exp      | $e^x$                         |
| identity | $x$                           |
| log      | $\log(x)$                     |
| log10    | $\log_{10}(x)$                |
| log2     | $\log_{2}(x)$                 |
| logit    | $\log(\frac{1−x}{x})$         |
| pow10    | $10^x$                        |
| probit   | $\phi(x)$                     |
| recip    | $x^{−1}$                      |
| reverse  | $−x$                          |
| sqrt     | $\sqrt{x}$                    | 

注意 `trans = "log10"` 只会 plot `log10(y) ~ log10(x)`，并不会修改 limits、breaks 和 labels；如果你是直接 `ggplot(log10(x), log10(y), data)`，图形和 `trans = "log10"` 是一样的，但是 limits、breaks 和 labels 都会变成 log10。具体可以试验：

```r
qplot(carat, price, data = diamonds) + scale_x_log10() + scale_y_log10()

qplot(log10(carat), log10(price), data = diamonds)
```

#### 6.4.3 `scale_colour_*` 与 `scale_fill_*` <a name="6-4-3-scale-colour-*-与-scale-fill-*"></a>

连续型：颜色梯度，即渐变色

- `scale_*_gradient(low, high)`：双色梯度
- `scale_*_gradient2(low, mid, high)`：三色梯度
- `scale_*_gradientn()`：自定义 $n$ 色梯度

离散型：

- `scale_*_hue`：延着 hcl (hue 色相 / chroma 彩度 / luminance 明度) 色轮选取均匀分布的色相来生成颜色
	- 生成 $\leq 8$ 种颜色时,区分度较高
- `scale_*_brewer()`：使用 [ColorBrewer](https://cran.r-project.org/web/packages/RColorBrewer/RColorBrewer.pdf) 配色方案：
	- 比如 `scale_colour_brewer(pal = "Set1")`
		- `pal` for "palette" 
	- 使用 `RColorBrewer::display.brewer.all()` 查看所有配色方案
- `scale_*_manual(values = ?)`：手动设置颜色
	- 比如 `unique(mpg$drv) == c("f", "4", "r")`，如果是 `aes(x = drv, data = mpg)`，那么可以设置：
		- `scale_fill_manual(values = c("red", "yellow", "green"))` 或者
		- `scale_fill_manual(values = c(f = "red", "1" = "yellow", r = "green"))`

#### 6.4.4 `scale_*_manual` <a name="6-4-4-scale-*-manual"></a>

注意书上这个例子不错：

```r
huron <- data.frame(year = 1875:1972, level = LakeHuron)

# 没有 legend
ggplot(huron, aes(year)) 
	+ geom_line(aes(y = level - 5), colour = "blue")
	+ geom_line(aes(y = level + 5), colour = "red")

# 有 legend 但是 label 和颜色都不对 
ggplot(huron, aes(year))
	+ geom_line(aes(y = level - 5, colour = "below"))
	+ geom_line(aes(y = level + 5, colour = "above"))

# 有正确的 legend 和颜色 
ggplot(huron, aes(year))
	+ geom_line(aes(y = level - 5, colour = "below")) +
	+ geom_line(aes(y = level + 5, colour = "above")) +
	+ scale_colour_manual("Direction", c("below" = "blue", "above" = "red"))
```

注意最后这个例子里，`color` 是在 `aes` 里面的，所以第一条 line 的颜色是映射到常量 `"below"` 的，然后 `"below"` 在 scale 中映射到颜色 `"blue"`。这里明显不能用 `I("below")`。

#### 6.4.5 `scale_*_identity` <a name="6-4-5-scale-*-identity"></a>

略

### 6.5 legend and axis <a name="6-5-legend-and-axis"></a>

The theme settings `axis.*` and `legend.*` control the visual appearance of axes and legends. See Section 8.1.

调整 legend 的位置：

```r
# get rid of the legend 
p + theme(legend.position = 'none')

# Put legend outside the plotting area 
# On left, right, top or bottom margin 
p + theme(legend.position = 'left')

# Put legend inside the plotting area 
# 放到左下角 
p + theme(legend.justification = c(0, 0), legend.position = c(0, 0))
```

- 注意在 `legend.justification` 和 `legend.position` 中：
	- `c(0, 0)` 指左下角
	- `c(0, 1)` 指左上角
	- `c(1, 1)` 指右上角
	- `c(1, 0)` 指右下角
- `legend.justification` 指 legend 本身这个 rectangle 中的一个锚点，这个锚点会与 `legend.position` 指定的点重合，这就形成了 legend 在图中的位置
- `legend.position` 是 legend 锚点要对齐的点。注意 `legend.position = c(0, 0)` 并不是指坐标轴 $(0, 0)$ 这个点，而是整个画图区域（默认灰色背景方格区域）的左下角
- 同时指定 `legend.justification = c(0, 0)` 和 `legend.position = c(0, 0)` 的意思就是：“把 legend rectangle 的左下角与画图区域的左下角重合”
- 默认情况下，`legend.justification == "center" == c(0.5, 0.5)`，此外还可以指定：
	- `legend.justification = "left" = c(0, 0.5)`
	- `legend.justification = "right" = c(1, 0.5)`

举例：

```r
library(ggplot2)

xy <- data.frame(x=1:10, y=10:1, type = rep(LETTERS[1:2], each=5))

plot <- ggplot(data = xy) + geom_point(aes(x = x, y = y, color=type))
plot + theme(legend.justification = c(.1, .1), legend.position = c(0, 0), 
             legend.background= element_rect(colour = "pink", fill = "transparent"), 
             legend.key = element_rect(colour = "transparent", fill = "transparent"))
```

![][6-5-legend-position]

## 第七章 - Facet and coord system <a name="第七章---Facet-and-coord-system"></a>

### 7.2 分面 (facet) <a name="7-2-分面-facet"></a>

两种分面方式：

- `facet_grid`：如果 formula 是 `x ~ y` 且 $\vert X \vert = m, \vert Y \vert = n$，则最终结果是 $m \times n$ 的 grid
	- 这个 grid 中的一个子图，或者说一个 cell，我们称为一个 "panel"
- `facet_wrap`：不管你有多少个 panel，统一按参数 `nrow = m` 或者 `ncol = n` 排成 $m$ 行或者 $n$ 列

默认不使用分面的效果是 `facet_null()`。

#### 7.2.1 `facet_grid` <a name="7-2-1-facet-grid"></a>

formula 参 2.6

另外可以使用 `facet_grid(margins=TRUE)` 来添加 marginal 统计列和统计行

#### 7.2.2 `facet_wrap` <a name="7-2-2-facet-wrap"></a>

formula 是 ` ~ x` (没有 `.` placeholder) 或者 ` ~ x + y + ...`。

比如 ` ~ x + y` 且 $\vert X \vert = m, \vert Y \vert = n$，则一共有 $m \times n$ 个 panel，然后按 `nrow` 或者 `ncol` 排列

#### 7.2.3 `facet_*(scales=?, space=?)` 参数设置 <a name="7-2-3-facet-*scales=-space=-参数设置"></a>

对于 `facet_wrap`:

- 每个 panel 都可以拥有单独的 scale

对于 `facet_grid`:

- All panels in a column must share the same `x` scale
- All panels in a row must share the same `y` scale

`scales` 参数:

- `scales = "fixed"`: `x` and `y` scales are fixed across all panels.
- `scales = "free"`: `x` and `y` scales vary across panels.
- `scales = "free_x`": the `x` scale can vary, and the `y` scale is fixed.
- `scales = "free_y"`: the `y` scale can vary, and the `x` scale is fixed.

`space` 参数的设置同上。

When the space can vary freely, each column (or row) will have width (or height) proportional to the range of the scale for that column (or row)

这俩参数的效果非常微妙，实践中自己尝试即可。一个例子：

```r
mpg2 <- subset(mpg, cyl != 5 & drv %in% c("4", "f"))

mpg3 <- within(mpg2, {
  model <- reorder(model, cty)
  manufacturer <- reorder(manufacturer, -cty)
})

models <- qplot(cty, model, data = mpg3)

models

models + facet_grid(manufacturer ~ ., scales = "free", space = "free")

models + facet_grid(manufacturer ~ ., scales = "free", space = "free") 
       + theme(strip.text.y = element_text(angle=0))  # 右侧的 facet label (mpg3$manufacturer)，默认是竖排的，改成横排
```

#### 7.2.4 如果某个图层的 data 没有 formula 指定的变量 <a name="7-2-4-如果某个图层的-data-没有-formula-指定的变量"></a>

略

#### 7.2.5 `aes(group=?)` vs faceting <a name="7-2-5-aesgroup=-vs-faceting"></a>

When using `aes(group=?)`, the groups are close together and may overlap, but small differences are easier to see.

略

#### 7.2.6 `geom_*(position="dodge")` vs faceting <a name="7-2-6-geom-*position="dodge"-vs-faceting"></a>

Faceting is more useful as we can control whether the splitting is local (`scales = "free_x", space = "free"`) or global (`scales = "fixed"`).

略

#### 7.2.7 如何处理连续型的 facet variable <a name="7-2-7-如何处理连续型的-facet-variable"></a>

- `cut_interval(x, n = 10)`: 将 $x$ 分入 $n$ 个 bin，每个 bin 的长度都是 $\frac{\operatorname{max}(x) - \operatorname{min}(x)}{n}$
- `cut_interval(x, length = 1)`: 将 $x$ 分入若干个 bin，每个 bin 的长度都是 1
- `cut_number(x, n = 10)`: 将 $x$ 分入若干个 bin，每个 bin 内都有 10 个元素

```r
> mpg2 <- subset(mpg, cyl != 5 & drv %in% c("4", "f"))
> cut_interval(mpg2$displ, n = 6)
  [1] [1.6,2.42]  [1.6,2.42]  [1.6,2.42] 
  [4] [1.6,2.42]  (2.42,3.23] (2.42,3.23]
  ......
  [205] (3.23,4.05]
> cut_interval(mpg2$displ, length = 1)
  [1] [1,2] [1,2] [1,2] [1,2] (2,3] (2,3] (3,4]
  [8] [1,2] [1,2] [1,2] [1,2] (2,3] (2,3] (3,4]
  ......
  [204] (2,3] (3,4]
> cut_number(mpg2$displ, n = 6)
  [1] [1.6,2]   [1.6,2]   [1.6,2]   [1.6,2]  
  [5] (2.5,3]   (2.5,3]   (3,3.8]   [1.6,2]
  ......
  [205] (3,3.8]
```

```r
mpg2$disp_ww <- cut_interval(mpg2$displ, length = 1)
mpg2$disp_wn <- cut_interval(mpg2$displ, n = 6)
mpg2$disp_nn <- cut_number(mpg2$displ, n = 6)

plot <- qplot(cty, hwy, data = mpg2) + labs(x = NULL, y = NULL)

plot + facet_wrap(~ disp_ww, nrow = 1)
plot + facet_wrap(~ disp_wn, nrow = 1)
plot + facet_wrap(~ disp_nn, nrow = 1)
```

### 7.3 Coord system <a name="7-3-Coord-system"></a>

#### 7.3.1 坐标系变换 <a name="7-3-1-坐标系变换"></a>

略

#### 7.3.2 stat 依赖于坐标系 <a name="7-3-2-stat-依赖于坐标系"></a>

略

#### 7.3.3 Cartesian 坐标系 <a name="7-3-3-Cartesian-坐标系"></a>

There are 4 Cartesian-based coordinate systems:

- `coord_cartesian`
- `coord_fixed`
- `coord_flip`
- `coord_trans`

`coord_cartesian` 也有 `xlim` 和 `ylim` 参数。

`coord_cartesian(xlim = ?, ylim = ?)` 与 `lims(x = ?, y = ?)` 的区别：

- 首先 `xlim(...) == lims(x = ...)`；`ylim` 同理
- `lims` 可以设置所有 scale 的 limits。比如你有 `aes(colour = df$x)`，然后 `df$x` 取值是 2、4、6、8，我可以 `p + lims(colour = c(2, 4))` 只显示其中两种颜色，另外两种颜色的 point 根本就不会出现在图上
- 同理，如果设置了 `lims(x = ?, y = ?)`，范围之外的 point 也不会出现在图上 (相当于找不到映射关系，数据无法映射到一个点上)
	- 如果此时你画 smooth，和整体数据的 smooth 曲线是不一样的
- `coord_cartesian(xlim = ?, ylim = ?)` 不会排除任何一个 point，永远是使用全部的数据。它的作用相当于是 zoom-in (设置为小范围) 或是 zoom-out (设置为大范围)
	- smooth 永远是整体数据的 smooth，只是不同的范围你会看到 smooth 曲线不同的段

更多内容参考书上。

#### 7.3.4 Non-Cartesian 坐标系 <a name="7-3-4-Non-Cartesian-坐标系"></a>

略

## 第八章 - Polishing your plots for publication <a name="第八章---Polishing-your-plots-for-publication"></a>

### 8.1 主题 (theme) <a name="8-1-主题-theme"></a>

#### 8.1.1 内置主题 <a name="8-1-1-内置主题"></a>

- `theme_gray()`：默认主题。淡灰色背景 + 白色网格线
- `theme_bw()`：白色背景 + 深灰色网格线

更多内置主题参考 [Complete themes](http://ggplot2.tidyverse.org/reference/ggtheme.html)。

修改全局主题：

```r
previous_theme <- theme_set(theme_bw())  # 以后所有的 plotting 都使用 theme_bw()
......
theme_set(previous_theme)  # 恢复原有主题
```

另外使用 `theme_get()` 可以获取当前主题

修改单次作图主题：

```r
p + theme_bw()
```

注：第三方的主题可以用 `ggthemr` package；参考 [The ggthemr package – Theme and colour your ggplot figures](https://www.shanelynn.ie/themes-and-colours-for-r-ggplots-with-ggthemr/)

#### 8.1.2 主题元素的设置 <a name="8-1-2-主题元素的设置"></a>

参 [Modify components of a theme](http://ggplot2.tidyverse.org/reference/theme.html)。

另外 `theme_update()` 可以修改当前主题的单个元素。

注意主题是样式的修改，不涉及内容的修改。比如 `element_text` 就只能修改 label 的样式 (比如 font、size 之类)，而无法设置 label 的内容 (你必须用 `labs()`)。

### 8.2 自定义 scale 和 geom <a name="8-2-自定义-scale-和-geom"></a>

略

### 8.3 保存作图到文件 <a name="8-3-保存作图到文件"></a>

往大了说，图片有两种存储类型：

- raster: 光栅图
	- Raster graphics are stored as an array of pixels and have a fixed optimal viewing size.
- vector: 矢量图 
	- Vector graphics are essentially “infinitely” zoomable; there is no loss of detail. 

保存图像有两种方式：

- `ggsave()`，参考 [ggsave: Save a ggplot (or other grid object) with sensible defaults](http://ggplot2.tidyverse.org/reference/ggsave.html)
	- `scale` 参数指的是一个 ratio。比如 `scale = 2` 意味着实际打印出来的 size 是屏幕显示的 size 的 2 倍
	- `dpi` 即分辨率，针对 raster 而言
- 打开磁盘的图形设备 (比如 `png()` 或者 `pdf()`)，然后打印图形 (`print(p)`)，最后关闭图形设备 (`dev.off()`)

```r
qplot(mpg, wt, data = mtcars)
ggsave(file = "output.pdf")  # 默认参数：plot = last_plot()

pdf(file = "output2.pdf", width = 6, height = 6)
print(qplot(mpg, wt, data = mtcars))
print(qplot(wt, mpg, data = mtcars))
dev.off()
```

Recommended graphics device:

- latex: ps
- pdflatex: pdf, png (600 dpi)
- web: png (72 dpi)

### 8.4 多图排列 <a name="8-4-多图排列"></a>

略。需要的时候再查。

另外可以参考：

- [Multiple graphs on one page (ggplot2)](http://www.cookbook-r.com/Graphs/Multiple_graphs_on_one_page_(ggplot2)/)
- [Multiple plots on a page](http://stat545.com/block020_multiple-plots-on-a-page.html)

## 第九章 - Data Manipulation <a name="第九章---Data-Manipulation"></a>

略

## 第十章 - 减少重复性的工作 <a name="第十章---减少重复性的工作"></a>

只说一点：如果是设计一个函数去包括一系列的绘图操作，且允许用户输入变量名时，可以用 `aes_string` 代替 `aes`，他们本质是一样，只是 `aes_string` 接收的字符串：

```r
aes_string("cty", colour = "hwy") 

	# is equivalent to 

aes(cty, colour = hwy)
```

其余略。
