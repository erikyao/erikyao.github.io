---
layout: post
title: "Digest of <i>ggplot2</i>"
description: ""
category: R
tags: [R-101, Book]
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
	- Traditionally used for time series data. 
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
		
#### 2.5.1 Adding a smoother to a plot: $y = f(x)$

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

#### 2.5.2 Boxplots and jittered points (value of $y$ categorized on $x$)

When a set of data includes a categorical variable and one or more continuous variables, you will probably be interested to know how the values of the continuous variables vary with the levels of the categorical variable. Boxplots and jittered points offer two ways to do this.

也就是，将 data point 按 categorical variable 分类：

- x-axis 是分类
- y-axis 是 continuous variable 的值

<!-- -->

- `geom = "jitter"`: jittering
- `geom = "boxplot"`: box-and-whisker plot

```r
qplot(color, price / carat, data = diamonds, geom = "jitter", alpha = I(1 / 5))
qplot(color, price / carat, data = diamonds, geom = "jitter", alpha = I(1 / 50))
qplot(color, price / carat, data = diamonds, geom = "jitter", alpha = I(1 / 200))
```

Another way to look at conditional distributions is to use faceting to plot a separate histogram or density plot for each value of the categorical variable.

#### 2.5.3 Histogram and density plots (count of $x$ categorized on $x$)

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

<del>To compare the distributions of different subgroups, just add an aesthetic mapping, as in the following code.</del>

```r
## Hard to interpret ##

# qplot(carat, data = diamonds, geom = "density", colour = color) 
# qplot(carat, data = diamonds, geom = "histogram", fill = color) 
```

另外注意 histogram 的 y-axis 默认是 count，可以改成 density：

```r
qplot(x = carat, y = ..count.., data = diamonds, geom = "histogram")
	## OR equivalently ##
qplot(carat, ..count.., data = diamonds, geom = "histogram") # 这里啰嗦一下是为了确认你看得懂不指定 `y = ...` 的写法

qplot(carat, ..density.., data = diamonds, geom = "histogram") # 用 histogram 的形式显示 density
```

注意 `geom = "density"` 是曲线，而这里 `..density..` 任然是 histogram，数据上有关联但形式上是截然不同的。

#### 2.5.4 Bar charts (count of $x$ for each value of $x$; extensible)

1. 基本用法：对每一个 $x_i$，计算 $y_i = nrow(df[X == x_i,])$
1. 扩展用法：对每一个 $x_i$，计算 $y_i = sum(df[X == x_i,]\\$foo)$
	- 这里 `foo` 通过 `weight = foo` 来指定
	
```r
qplot(color, data = diamonds, geom = "bar")
qplot(color, data = diamonds, geom = "bar", weight = carat) + scale_y_continuous("carat") # 按 color 分组，统计各组的 carat 之和
qplot(color, data = diamonds, geom = "bar", weight = x*y*z) + scale_y_continuous("volumn") # 按 color 分组，统计各组的 x*y*z 之和
``` 

`scale_y_continuous` 表示 “我需要一个 continuous 的 y-axis”.

#### 2.5.5 Time series with line and path plots

其实这两个图不一定非要用于 time series。简单来说，这两个图的画法就是：在 scatter plot $n$ 个 data point $p_1,\dots,p_n$ 的过程中，将 $p_1 \rightarrow p_2 \rightarrow \dots \rightarrow p_n$ 在坐标系内按顺序连起来。区别在于：

- line plot 会将 data point 按 `x` 排序。如果 x-axis 是时间，那就正好反映了 how `y` has changed over time
- path plot 不会排序，完全按照 appear in dataset 的顺序来，所以它反映的是 how `x` and `y` have simultaneously changed

```r
qplot(carat, price, data = dsmall, geom = c("point", "line"))

## Time Series using `ecnomics` dataset ##
qplot(date, unemploy / pop, data = economics, geom = "line") # unemploy / pop = unemployment rate
qplot(date, uempmed, data = economics, geom = "line") # uempmed = median number of weeks unemployed

year <- function(x) as.POSIXlt(x)$year + 1900
qplot(unemploy / pop, uempmed, data = economics, geom = c("point", "path"))
qplot(unemploy / pop, uempmed, data = economics, geom = "path", colour = year(date)) + scale_area()
```

### 2.6 Faceting

We have already discussed using aesthetics (colour and shape) to compare subgroups, drawing all groups on the same plot. Faceting takes an alternative approach: It creates tables of graphics by splitting the data into subsets and displaying the same graph for each subset in an arrangement that facilitates comparison.

The default faceting method in `qplot()` creates plots arranged on a grid specified by a faceting formula which looks like `row_var ∼ col_var`. 简单说，`x ~ y` 的意思就是把 `df` group by `df$x` and `df$y`； `x + y ~ z` 的意思就是把 `df` group by `df$x`， `df$y` and `df$z`。所有出现在 formula 里的 column name 都是 group by 的标准，出现在 `~` 左边或是右边的区别在于，say `x ~ y`：

- 最终的 grid plot 按 `～` 左边的 column name，i.e. `df$x` 的值排列 row
- 最终的 grid plot 按 `～` 右边的 column name，i.e. `df$y` 的值排列 column

而 `.` 是一个 place holder，表示 “我没有 column name 需要指定在 formula 的这一边”。比较下面两句：

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

### 2.7 Other options for `qplot`

- `xlim = c(a,b)`: 必须是一个 length 2 vector，表示 "x-axis 只要画 `[a,b]` 这一段就好了"，如果 `[a,b]` 范围之外还有点或者线，直接截掉。一般是先在草图里确定了 x-axis 的有效范围后再指定
	- `ylim = c(a,b)`: 同上
- `log = "y"`: 表示 "y-axis 的 scale 换成 $\log_{10}$ 值，但是 scale mark 不变"
	- 你比较一下这两句就明白了：
		- `qplot(x = c(1,2,3), y = log10(c(10,100,1000)))`
		- `qplot(x = c(1,2,3), y = c(10,100,1000), log="y")`
	- `log = "x"`: 同上
	- `log = "xy"`: x-axis 和 y-axis 都做这个处理，尼玛这个语法我是万万没想到……
- `main = "plot title"`: 例子已经说明一切
	- `main = expression(beta[1] == 1)` 给出的 plot title 是 "$\beta_1 = 1$"，注意一定要是 `==`
	- See `？plotmath` for more
- `xlab = "x-axis label"`: 例子已经说明一切
	- 同 `main` 一样，也可以用 expression
	- `ylab` 同上
	
几个综合运用的例子：

```r
qplot(carat, price, data = dsmall, xlab = "Price ($)", ylab = "Weight (carats)", main = "Price-weight relationship")

qplot(carat, price/carat, data = dsmall, xlab = "Weight (carats)", ylab = expression(frac(price,carat)), main="Small diamonds", xlim = c(.2,1))

qplot(carat, price, data = dsmall, log = "xy")
```
### 2.8 Differences from `plot`

- `qplot` is not generic: you CANNOT write `q = qplot()` and expect to get some kind of default plot. Note, however, that `ggplot()` is generic, and may provide a starting point for producing visualizations of arbitrary R objects.
- With base graphics, to add further graphic elements to a plot, you can use `points()`, `lines()` and `text()`. With ggplot2, you need to add additional **layers** to the existing plot, described in the next chapter.

## 3. Mastering the grammar

### 3.1 Introduction






