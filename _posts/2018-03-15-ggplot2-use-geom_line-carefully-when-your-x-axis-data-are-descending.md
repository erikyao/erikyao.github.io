---
category: R
description: ''
tags:
- ggplot
title: 'ggplot2: use <i>geom_line()</i> carefully when your x-axis data are descending'
---

Given 3 points, $(1,1), (2,1), (2,2)$, how would you connect them with 2 segments? Subtly, `geom_line` of `ggplot2` thinks in a different way when you order the points by $x$ descendingly.

```r
library(ggplot2)
library(cowplot)

df <- data.frame(x=c(2,2,1), y=c(2,1,1))

p_line <- ggplot(data=df, mapping=aes(x=x, y=y)) + 
	      geom_line(size=0.3) + geom_point(size=0.4, color=I("blue")) + 
	      ggtitle("geom_line")

p_path <- ggplot(data=df, mapping=aes(x=x, y=y)) + 
	      geom_path(size=0.3) + geom_point(size=0.4, color=I("blue")) + 
	      ggtitle("geom_path")

df_rev <- data.frame(x=rev(c(2,2,1)), y=rev(c(2,1,1)))

p_line_rev <- ggplot(data=df_rev, mapping=aes(x=x, y=y)) + 
	          geom_line(size=0.3) + geom_point(size=0.4, color=I("blue")) + 
	          ggtitle("geom_line + rev")

p_path_rev <- ggplot(data=df_rev, mapping=aes(x=x, y=y)) + 
	          geom_path(size=0.3) + geom_point(size=0.4, color=I("blue")) + 
	          ggtitle("geom_path + rev")

plot_grid(p_line, p_path, p_line_rev, p_path_rev)
```

![](https://live.staticflickr.com/796/40832875091_baf8ddec61.jpg)

[geom_line connects dots on the wrong axis](https://stackoverflow.com/a/36156406) mentioned that:

> `geom_line` joins lines up from the minimum `x` to maximum

Obviously in my example, `geom_line` did not follow the order in `df_rev`, i.e. $(1,1) \rightarrow (2,1) \rightarrow (2,2)$. `geom_line` would not sort tied `x`'s by `y`, but leave them in the original order, so it became $(1,1) \rightarrow (2,2) \rightarrow (2,1)$.

If you are certain that your `x` is in order and want to connect them in that very order, just use `geom_path`.