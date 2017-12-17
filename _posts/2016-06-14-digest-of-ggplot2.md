---
layout: post
title: "Digest of <i>ggplot2</i>"
description: ""
category: R
tags: [R-101, Book]
---
{% include JB/setup %}

## Chapter 1. Introduction

### 1.1 Welcome to ggplot2

... it has a deep underlying grammar. This grammar, based on the _Grammar of Graphics_ (Wilkinson, 2005), is composed of a set of independent components that can be composed in many different ways. This makes `ggplot2` very powerful, because you are not limited to a set of pre-specified graphics, but you can create new graphics that are precisely tailored for your problem.

`ggplot2` is designed to work in a layered fashion, starting with a layer showing the raw data then adding layers of annotations and statistical summaries. It allows you to produce graphics using the same structured thinking that you use to design an analysis, reducing the distance between a plot in your head and one on the page.

### 1.3 What is the grammar of graphics?

In brief, the grammar tells us that **a statistical graphic is a mapping from data to aesthetic attributes (colour, shape, size) of geometric objects (points, lines, bars)**.

The first description of the components follows below:

- _**geoms**_: Geometric objects
	- 其实是指图像类型 (scatter, smooth, histogram, boxplot, etc.)
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
			- $f$: data space $righarrow$ aesthetic space
				- 比如给 dot 上颜色
			- $f^{-1}$ (inverse): aesthetic space $righarrow$ data space
				- 比如画颜色的 legend、给 axes 标指
- _**coord**_: A coordinate system, describes how data coordinates are mapped to the plane of the graphic.
	- We normally use a Cartesian coordinate system, but a number of others are available, including polar coordinates and map projections.
		
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
	
## Chapter 2. Getting started with `qplot`

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

For every aesthetic attribute, there is a function, called a _scale_, which maps data values to valid values for that aesthetic. It is this _scale_ that controls the appearance of the points and associated legend. For example, in the above plots, the `colour` _scale_ maps `J` to purple and `F` to green.
	
scale 有默认实现。You can also manually set the aesthetics using `I()`, e.g., `colour = I("red")` or `size = I(2)`.

注意：这里 `I(x)` 的作用是 "to inhibit interpretation or conversion of `x`"，也可以描述为 "indicate that `x` should be treated ‘as is’"。具体是实现是 `"AsIs" <- attr(x, "class")`。那么不用 `I()` 会导致什么后果呢？比较下面两句：

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

### 2.5 Plot `geoms`

Geom, short for geometric object, describes the type of object that is used to display the data. Some geoms have an associated statistical transformation, for example, a histogram is a binning statistic plus a bar geom. 

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

另外注意 histogram 的 $y$-axis 默认是 count，可以改成 density：

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

`scale_y_continuous` 表示 “我需要一个 continuous 的 $y$-axis”.

#### 2.5.5 Time series with line and path plots

其实这两个图不一定非要用于 time series。简单来说，这两个图的画法就是：在 scatter plot $n$ 个 data point $p_1,\dots,p_n$ 的过程中，将 $p_1 \rightarrow p_2 \rightarrow \dots \rightarrow p_n$ 在坐标系内按顺序连起来。区别在于：

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

### 2.6 Faceting

We have already discussed using aesthetics (colour and shape) to compare subgroups, drawing all groups on the same plot. Faceting takes an alternative approach: It creates tables of graphics by splitting the data into subsets and displaying the same graph for each subset in an arrangement that facilitates comparison.

The default faceting method in `qplot()` creates plots arranged on a grid specified by a faceting formula which looks like `row_var ~ col_var`. 简单说，`x ~ y` 的意思就是把 `df` group by `df$x` and `df$y`； `x + y ~ z` 的意思就是把 `df` group by `df$x`， `df$y` and `df$z`。所有出现在 formula 里的 column name 都是 group by 的标准，出现在 `~` 左边或是右边的区别在于，say `x ~ y`：

- 最终的 grid plot 按 `~` 左边的 column name，i.e. `df$x` 的值排列 row
- 最终的 grid plot 按 `~` 右边的 column name，i.e. `df$y` 的值排列 column

而 `.` 是一个 place holder，表示 “我没有 column name 需要指定在 formula 的这一边”,也就是 “我只要 1 row 或者 1 column”。比较下面两句：

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

### 2.8 Differences from `plot`

- With base graphics, to add further graphic elements to a plot, you can use `points()`, `lines()` and `text()`. With ggplot2, you need to add additional **layers** to the existing plot, described in the next chapter.

## Chapter 3. Mastering the grammar

### 3.2 Fuel economy data

这一章我们使用 `mpg` 这个 dataset

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

### 3.3 Building a scatterplot

```r
qplot(displ, hwy, data = mpg, colour = factor(cyl))
```

But what is going on underneath the surface? How does ggplot2 draw this plot?

1. Mapping aesthetics to data
	- 上图我们没有指定 size 和 shape，我们说 "Size and shape are not mapped to variables, but remain at their default values."
	- 这个 mapping 相当创建了一个 mapped dataframe，在我们的例子中，它有三列：
		- `x`: <- `mpg$displ`
		- `y`: <- `mpg$hwy`
		- `color`: <- `factor(mpg$cyl)`
	- 我们有了这个 mapped dataframe，就可以不局限于 scatterplot。在 `qplot` 中，我们还可以指定：
		- `geom = "point"`: scatterplot
		- `geom = "point"` + `size = foo`: bubblechart, 实质还是 scatterplot
		- `geom = "bar"`: barchart
		- `geom = "boxplot"`: boxplot
		- `geom = "line"`: line chart
		- Points, lines and bars are all examples of geometric objects, or `geom`s.
1. Scaling
	- Convert the mapped dataframe from data units to physical units (e.g. pixels and colors) that computer can display. 
		- 我们说："we have three aesthetics that need to be scaled: horizontal position (`x`), vertical position (`y`) and `colour`."
		- 负责完成这项工作的对象我们称为 `scale`s 
			- A scale is a function, and its inverse.
				- function 负责转换
				- inverse 负责 axis marks 和 legends
	- Physical units are meaningful to the computer, they may not be meaningful to us:
		- colours are represented by a six-letter hexadecimal string, 
		- sizes by a number
		- and shapes by an integer. 
	- Scaling position is easy in this example because we are using the default **linear scales**. 
		- We need only a linear mapping from the range of the data to [0, 1], 这是 `ggplot2` 的底层 drawing system, `grid`, 要求的
	- Scaling color, size or shape 的工作，简单说就是 mapping each value to a point in color-space, size-space or shape-space
	- 算上默认的 size 和 shape，这下我们的 mapped dataframe 就变成了一个 5 列的 scaled mapped dataframe
1. 有了 scaled mapped dataframe，现在就可以开始画了：
	- Coordinate system, `coord`, 负责：
		- 确定每个 scaled $(x,y)$ 在画出来的图中的位置；
		- 画 axes
			- In most cases this will be Cartesian coordinates, but it might be polar coordinates, or a spherical projection used for a map.
		- 画 legends
	- 最后添加 plot annotation，包括 background、title、axis labels 等等 

### 3.4 A more complex plot

```r
qplot(displ, hwy, data=mpg, facets = . ~ year) + geom_smooth()
```

`facets` 相当于把我们的 scaled mapped dataframe 变成了一个 3-D array；smooth layer 属于 statistics layers 的范畴，it doesn’t display the raw data, but instead displays a statistical transformation of the data.

- Extra step: after mapping the data to aesthetics, the data is passed to a statistical transformation, or `stat`
- 在我们这个例子中，我们说："The `stat` fits the data to a loess smoother."
- Other useful `stat`s include 1 and 2d binning, group means, quantile regression and contouring.

### 3.5 Components of the layered grammar

The layered grammar defines a plot as the combination of:

- A default dataset and set of mappings from variables to aesthetics.
- One or more layers, each composed of 
	- a geometric object (`geom`), 
	- a statistical transformation (`stat`), 
	- and a position adjustment (which deals with overlapping graphic objects, will be introduced later), 
	- and optionally (因为一般可以继承自原有的，所以不需要特别指定，比如我们的 `geom_smooth()` 就没有指定，但它还是知道哪个是 `x` 哪个是 `y`), 
		- a dataset and 
		- aesthetic mappings.
- One scale for each aesthetic mapping.
- A coordinate system (`coord`).
- The faceting specification.

举个例子：

```r
ggplot(mpg, aes(hwy, cty)) + 		# data and mapping
	geom_point(aes(color = cyl)) +	# layer
	geom_smooth(method ="lm") +	# layer
	coord_cartesian() +
	scale_color_gradient() +
	theme_bw()			# additional elements
```

你可以简单认为每个 `geom_*()` 或者 `stat_*()` 函数都是一个 layer。

我们接下来的章节：

- Chapter 4: properties of layers
- Chapter 5: how layers are used to visulize data
- Chapter 6: scales
- Chapter 7: coordinate system + faceting
- Chapter 8: plot-specific theme options

### 3.6 The plot object

A plot object is a list with components `data`, `mapping` (the default aesthetic mappings), `layers`, `scales` (functions carrying out `mapping`), `coordinates`, `facet` and `options`.

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

## Chapter 4. Build a plot layer by layer

### 4.2 Creating a plot

When we used `qplot()`, it did a lot of things for us: it created a plot object, added layers, and displayed the result, using many default values along the way. 

To create the plot object ourselves, we use `ggplot()`. It has two arguments: `data` and aesthetic `mapping`

- These 2 arguments set up defaults for the plot and can be omitted if you specify data and aesthetics when adding layers later. 

```r
p <- ggplot(diamonds, aes(carat, price, colour = cut))
```

This plot object cannot be displayed until we add a layer: there is nothing to see!

### 4.3 Layers

A minimal scatterplot layer:

```r
p <- p + layer(geom = "point")
```

Now it can be rendered!

A more fully specified layer can take any or all of these arguments:

```r
layer(geom, geom_params, stat, stat_params, data, mapping, position)
```

Here is what a more complicated call looks like. It produces a histogram (a combination of bars and binning) coloured “steelblue” with a bin width of 2:

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

### 4.4 Data

The `data` parameter must be a data frame and this is the only restriction.

This restriction also makes it very easy to produce the same plot for different data: you can update your current data frame and pass it to your plot object via `%+%` operator:

```r
p <- ggplot(mtcars, aes(mpg, wt, colour = cyl)) + geom_point()
p

mtcars <- transform(mtcars, mpg = mpg ^ 2)
p %+% mtcars
```

Any change of values or dimensions is legitimate. However, if a variable changes from discrete to continuous (or vice versa), you will need to change the default scales.

It is not necessary to specify a default dataset except when using faceting; faceting is a global operation (i.e., it works on all layers).

The `data` data frame is stored in the plot object **as a copy, not a reference**. This has two important consequences: 

- if your data changes, the plot will not; 
- and ggplot2 objects are entirely self-contained so that they can be `save()`d to disk and later `load()`ed and plotted without needing anything else from that session.

### 4.5 Aesthetic mappings

The `aes` function takes a list of aesthetic-variable pairs like these:

```r
aes(x = weight, y = height, colour = age)
```

Note that functions of variables can be used:

```r
aes(x = weight, y = height, colour = sqrt(age))
```

#### 4.5.1 Adding, extending, overriding and removing aesthetic mappings

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

#### 4.5.2 Setting vs mapping

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

#### 4.5.3 Grouping

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

#### 4.5.4 Matching aesthetics to graphic objects

Stacked bar chart:

```r
p <- ggplot(diamonds, aes(x = color, color=cut, fill=cut)) + geom_bar()
```

### 4.6 geom

| geom_\*                                                      | Description                                                                                                                                                                                                                                                                           | 描述                                        |
|--------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------|
| abline                                                       | Line, specified by slope and intercept                                                                                                                                                                                                                                                | 斜线                                        |
| area                                                         | Area plots                                                                                                                                                                                                                                                                            | 面积图（联系微积分）                        |
| bar                                                          | Bars, rectangles with bases on y-axis                                                                                                                                                                                                                                                 | 条形图                                      |
| bin2d                                                        | 2d heat map                                                                                                                                                                                                                                                                           | 二维热图                                    |
| blank                                                        | Blank, draws nothing                                                                                                                                                                                                                                                                  |                                             |
| boxplot                                                      | Box-and-whisker plot                                                                                                                                                                                                                                                                  | 箱线图                                      |
| contour                                                      | Display contours of a 3d surface in 2d                                                                                                                                                                                                                                                | 等高线图                                    |
| crossbar                                                     | Hollow bar with middle indicated by horizontal line 带有水平中心线的盒子图（类似只有 box 的 boxplot）                                                                                                                                                                                 |                                             |
| density                                                      | Display a smooth density estimate                                                                                                                                                                                                                                                     | 光滑密度曲线图                              |
| density2d                                                    | Contours from a 2d density estimate 二维密度等高线图                                                                                                                                                                                                                                  |                                             |
| errorbar                                                     | Error bars                                                                                                                                                                                                                                                                            | 误差棒（类似只有 box 顶和底的 boxplot）     |
| histogram                                                    | Histogram                                                                                                                                                                                                                                                                             | 直方图                                      |
| hline                                                        | Line, horizontal                                                                                                                                                                                                                                                                      | 水平线                                      |
| interval                                                     | Base for all interval (range) geoms                                                                                                                                                                                                                                                   |                                             |
| jitter                                                       | Points, jittered to reduce overplotting 本质是个 scatter，dots 被添加扰动，减少重叠                                                                                                                                                                                                   |                                             |
| line                                                         | Connect observations, in order of $x$ value 按 $x$-axis 的顺序连接各个点                                                                                                                                                                                                              |                                             |
| linerange                                                    | An interval represented by a vertical line                                                                                                                                                                                                                                            | 一条竖线，表示 $y$-axis 的一个区间          |
| path                                                         | Connect observations, in original order 与 line 不同，path 是按数据的原始 $x$ 顺序连接各个点                                                                                                                                                                                          |                                             |
| point                                                        | Points, as for a scatterplot                                                                                                                                                                                                                                                          | 散点图                                      |
| pointrange                                                   | An interval represented by a vertical line, with a point in the middle                                                                                                                                                                                                                | 在 linerange 的基础上，在中点处添加一个 dot |
| polygon                                                      | Polygon, a filled path                                                                                                                                                                                                                                                                | 多边形，相当于一个有填充的 path             |
| quantile                                                     | Add quantile lines from a [quantile regression](https//stackoverflow.com/a/37160755)                                                                                                                                                                                                  | 分位数回归线                                |
| ribbon                                                       | Ribbons, $y$ range with continuous $x$ values                                                                                                                                                                                                                                         | 色带图                                      |
| [rug](http//ggplot2.tidyverse.org/reference/geom_rug.html)   | rug plots in the margins                                                                                                                                                                                                                                                              | 边界地毯图                                  |
| segment Single line segments                                 | 线段（可带箭头）                                                                                                                                                                                                                                                                      |                                             |
| smooth                                                       | Add a smoothed condition mean                                                                                                                                                                                                                                                         | 光滑的条件均值线                            |
| step                                                         | Connect observations by stairs                                                                                                                                                                                                                                                        | 类似方波信号图                              |
| text                                                         | Textual annotations                                                                                                                                                                                                                                                                   |                                             |
| [tile](http//ggplot2.tidyverse.org/reference/geom_tile.html) | `geom_rect` and `geom_tile` do the same thing (其实都是 heat map), but are parameterised differently `geom_rect` uses the locations of the four corners (`xmin`, `xmax`, `ymin` and `ymax`), while `geom_tile` uses the center of the tile and its size (`x`, `y`, `width`, `height`) | 瓦片图                                      |
| vline                                                        | Line, vertical                                                                                                                                                                                                                                                                        | 垂直线                                      |

### 4.7 stat

Every geom has a default statistic, and every statistic a default geom.
