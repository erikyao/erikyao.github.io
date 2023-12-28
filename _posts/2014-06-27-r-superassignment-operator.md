---
category: R
description: ''
tags: []
title: R <<- operator
---

第一次看到这个 <<- 赋值是在 [coursera 的 assignment](https://class.coursera.org/rprog-004/human_grading/view/courses/972139/assessments/3/submissions)，这里是实现了一个 cache 了 mean 结果的 vector：

```r
makeVector <- function(x = numeric()) {
	m <- NULL
	set <- function(y) {
		x <<- y
		m <<- NULL
	}
	get <- function() x
	setmean <- function(mean) m <<- mean
	getmean <- function() m
	list(set = set, get = get,
		setmean = setmean,
		getmean = getmean)
}

cachemean <- function(x, ...) {
	m <- x$getmean()
	if(!is.null(m)) {
		message("getting cached data")
		return(m)
	}
	data <- x$get()
	m <- mean(data, ...)
	x$setmean(m)
	m
}
```

对 `set` 而言，并不是看不到 x、m，这里 x、m 是 free variable，在 `set` 被定义的范围内都能看到，所以这不是可见性的问题。那这个 <<- 与 <- 有啥不同呢？还是 [manual](http://cran.r-project.org/doc/manuals/R-intro.html#Assignment-within-functions) 最有用：

> Note that <font color="red">any ordinary assignments done within the function are local and temporary and are lost after exit from the function</font>. Thus the assignment `X <- qr(X)` does not affect the value of the argument in the calling program.    
> <br/>
> To understand completely the rules governing the scope of R assignments the reader needs to be familiar with the notion of an evaluation frame. This is a somewhat advanced, though hardly difficult, topic and is not covered further here.  
> <br/>
> If global and permanent assignments are intended within a function, then <font color="red">either the “superassignment” operator, `<<-` or the function assign()</font> can be used. See the help document for details. S-PLUS users should be aware that `<<-` has different semantics in R. These are discussed further in Scope.

我们可以做个小实验：

```r
change <- function(x) {
	innerChange <- function(x0) {
		x <- x0
		x
	}
	innerChange(5)
	print(paste("after innerChange(5) (x <- 5), x =", x))
	x
}

> x <- 10
> change(x)
[1] "after innerChange(5) (x <- 5), x = 10"
[1] 10
> x
[1] 10
```

可见 `x <- 5` 出了 `innerChange` 就被 discard 掉了。再试试 <<-：

```r
change <- function(x) {
	innerChange <- function(x0) {
		x <<- x0
		x
	}
	innerChange(5)
	print(paste("after innerChange(5) (x <<- 5), x =", x))
	x
}

> x <- 10
> change(x)
[1] "after innerChange(5) (x <<- 5), x = 5"
[1] 5
> x
[1] 10
```

`x <<- 5` 出了 `innerChange` 仍然有效。注意 `[1] 5` 这一行是 `change` 的返回值。出了 `change` 之后，这个赋值还是失效了，x 仍然为 10，可见 <<- 的作用只能跨一级 function。如果一定要修改 x 为 5 的话，在 `change` 这一层也要 <<- 一下才行。