---
layout: post
title: "Digest of <i>ggplot2</i>"
description: ""
category: R
tags: [R-101]
---
{% include JB/setup %}

## 1. Introduction

### 1.1 Welcome to ggplot2

... it has a deep underlying grammar. This grammar, based on the _Grammar of Graphics_ (Wilkinson, 2005), is composed of a set of independent components that can be composed in many different ways. This makes `ggplot2` very powerful, because you are not limited to a set of pre-specified graphics, but you can create new graphics that are precisely tailored for your problem.

`ggplot2` is designed to work in a layered fashion, starting with a layer showing the raw data then adding layers of annotations and statistical summaries. It allows you to produce graphics using the same structured thinking that you use to design an analysis, reducing the distance between a plot in your head and one on the page.

### 1.3 What is the grammar of graphics?

In brief, the grammar tells us that a statistical graphic is a mapping from data to aesthetic attributes (colour, shape, size) of geometric objects (points, lines, bars).

The first description of the components follows below:

- The _**data**_ that you want to visualise and a set of aesthetic _**mappings**_ describing how variables in the data are mapped to aesthetic attributes that you can perceive.
- Geometric objects, _**geoms**_ for short, represent what you actually see on the plot: points, lines, polygons, etc.
- Statistical transformations, _**stats**_ for short, summarise data in many useful ways. For example, binning and counting observations to create a histogram, or summarising a 2d relationship with a linear model. Stats are optional, but very useful.
- The _**scales**_ map values in the data space to values in an aesthetic space, whether it be colour, or size, or shape. _**Scales draw a legend or axes**_, which provide an inverse mapping to make it possible to read the original data values from the graph.
- A coordinate system, _**coord**_ for short, describes how data coordinates are mapped to the plane of the graphic.
	- We normally use a Cartesian coordinate system, but a number of others are available, including polar coordinates and map projections.
- A _**faceting**_ specification describes how to break up the data into subsets and how to display those subsets as small multiples. This is also known as conditioning or latticing/trellising.
	- faceting: [ˈfæsɪt] 
		- [verb] to cut facets on
		- [noun] one of the small, polished plane surfaces of a cut gem
		
It is also important to talk about what the grammar doesn’t do:

- It doesn’t suggest what graphics you should use to answer the questions you are interested in.
- Ironically, the grammar doesn’t specify what a graphic should look like. The finer points of display, for example, font size or background colour, are not specified by the grammar. In practice, a useful plotting system will need to describe these, as `ggplot2` does with its theming system.
- It does not describe interaction: the grammar of graphics describes only static graphics.

### 1.4 How does ggplot2 fit in with other R graphics?

- Base graphics has a pen on paper model: you can only draw on top of the plot, you cannot modify or delete existing content.
- Grid graphics have a system of viewports (each containing its own coordinate system) that makes it easier to lay out complex graphics.
- The `lattice` package uses grid graphics to implement the trellis graphics system and is a considerable improvement over base graphics. 
	- However, lattice graphics lacks a formal model, which can make it hard to extend.
- `ggplot2` is an attempt to take the good things about base and lattice graphics and improve on them with a strong underlying model which supports the production of any kind of statistical graphic.
	- Like `lattice`, `ggplot2` uses grid to draw the graphics, which means you can exercise much low-level control over the appearance of the plot.
	
## 2. Getting started with `qplot`

### 2.2 Datasets

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

### 2.3 Basic use

Simple xy-scatter-plots:

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

### 2.4 Colour, size, shape and other aesthetic attributes

With `plot`, it’s your responsibility to convert a categorical variable in your data (e.g., “apples”, “bananas”, “pears”) into something that plot knows how to use (e.g., “red”, “yellow”, “green”). `qplot` can do this for you automatically, and it will automatically provide a legend that maps the displayed attributes to the data values.

```r
qplot(carat, price, data = dsmall, colour = color) # or `color = color`
qplot(carat, price, data = dsmall, shape = cut)
qplot(carat, price, data = dsmall, size = x * y * z)
```

- 注意：上面三幅，本质还是 xy-scatter-plot 没跑：
	- `color` 修改了 data point 的颜色
	- `shape` 修改了 data point 的符号（比如用 `*` 代替了圆点）
	- `size` 修改了 data point 的符号的大小
- 另外自带 legend 真是好！

`Colour`, `size` and `shape` are all examples of _**aesthetic attributes**_, visual properties that affect the way observations are displayed.

For every aesthetic attribute, there is a function, called a `scale`, which maps data values to valid values for that aesthetic. It is this scale that controls the appearance of the points and associated legend. For example, in the above plots, the `colour` scale maps `J` to purple and `F` to green.

- 注意这里 scale 大约可以理解为 “秤”
	- `J` 来称一称，OK，“purple”
	
You can also manually set the aesthetics using `I()`, e.g., `colour = I("red")` or `size = I(2)`.

注意：这里 `I(x)` 的作用是 "to inhibit interpretation or conversion of `x`"，也可以描述为 "indicate that `x` should be treated ‘as is’"。具体是实现是 `"AsIs" <- attr(x, "class")`。那么不用 `I()` 会导致什么后果呢？比较下面两句：

```r
qplot(carat, price, data = dsmall, colour = I("blue"))	# (1)
qplot(carat, price, data = dsmall, colour = "blue")		# (2)
```

- (1) 句的 `"blue"` 没有被 interpret，所以所有的 data point 都是蓝色
- (2) 句的 `"blue"` 有被 interpret，所以所有的 data point 显示出来的是……浅红色
	- 这个浅红色其实是 `colour = color` 的 legend 的第一个颜色
	
For large datasets, like the diamonds data, semitransparent points are often useful to alleviate some of the overplotting. To make a semi-transparent colour you can use the alpha aesthetic, which takes a value between 0 (completely transparent) and 1 (complete opaque). It’s often useful to specify the transparency as a fraction, e.g., `1/10` or `1/20`, as the denominator specifies the number of points that must overplot to get a completely opaque colour.

```r
qplot(carat, price, data = diamonds, alpha = I(1/10))
qplot(carat, price, data = diamonds, alpha = I(1/100))
qplot(carat, price, data = diamonds, alpha = I(1/200))
```

Different types of aesthetic attributes work better with different types of variables: 	

- Colour and shape work well with categorical variables, 
- while size works better with continuous variables.

The amount of data also makes a difference: 

- If there is a lot of data, it can be hard to distinguish the different groups. 
- An alternative solution is to use _**faceting**_.

### 2.5 Plot `geoms`

Geom, short for geometric object, describes the type of object that is used to display the data. Some geoms have an associated statistical transformation, for example, a histogram is a binning statistic plus a bar geom. 

`qplot` is not limited to scatterplots, but can produce almost any kind of plot by varying the `geom`.

For 2d data (x-y):

- `geom = "point"`: scatterplot. This is the default when you supply both `x` and `y` arguments to `qplot()`.
- `geom = "smooth"`: fits a smoother to the data and displays the smooth and its standard error.
- `geom = "boxplot"`: box-and-whisker plot.
- `geom = "path"` or `geom = "line"`: draw lines between the data points. 
	- Traditionally used to explore relationships between time and another variable. 
	- A line is constrained to travel from left to right, while paths can go in any direction.
	
For 1d data (x only):

- For continuous variables:
	- `geom = "histogram"`: histogram, the default when you only supply an `x` value to `qplot()`.
	- `geom = "freqpoly"`: frequency polygon. 类似 histogram，不过是曲线
	- `geom = "density"`: density plot
- For discrete variables：
	- `geom = "bar"`: bar chart.
		- histogram 是先分 bin，然后统计落到每个 bin 的数量。所以 histogram 用于 continuous variable
		- discrete variable 不需要分 bin，直接统计每一个具体值的数量就可以了。所以在形状上这两个图有点类似。
		
#### 2.5.1 Adding a smoother to a plot

```r
qplot(carat, price, data = dsmall, geom = c("point", "smooth"))
qplot(carat, price, data = diamonds, geom = c("point", "smooth"))
```

If you want to turn the confidence interval off, use `se = FALSE`.

There are many different smoothers you can choose between by using the `method` argument:

- $method = "loess"$ 