---
layout: post
title: "Octave: fmincg and Anonymous Functions"
description: ""
category: Octave
tags: []
---
{% include JB/setup %}

One-vs-all Classfication 的作业里用到了 `fmincg`，但是语法有点奇怪：

```matlab
[theta] = fmincg (@(t)(lrCostFunction(t, X, (y == c), lambda)), initial_theta, options);
```

我们 `lrCostFunction` 的定义是：

```matlab
function [J, grad] = lrCostFunction(theta, X, y, lambda)
```

forum 里 [The meaning of @(t) in fmincg ?](https://class.coursera.org/ml-006/forum/thread?thread_id=1363) 解释得非常好：

> The `@`-symbol means that what we are sending to the `fmincg`-function, `lrCostFunction`, is not a matrix, vector or number, but a function. And the `(t)` symbol means that it is a function of `t`. `lrCostFunction` is a function of four varibles, but with the command `@(t)lrCostFunction(t,X,(y==c),lambda)` it becomas a function of one varible, `t`, and the rest of the varablas are set to `X`, `(y==c)`, and `lambda`.  
> <!-- -->  
> We use this notation because `fmincg` minimize a function with respect to one varible.

进一步得知 `@(t)` 其实是 Anonymous Function，参 [11.11.2 Anonymous Functions](https://www.gnu.org/software/octave/doc/interpreter/Anonymous-Functions.html#Anonymous-Functions)。  

这里有点像 Adapter Pattern，在 Java 里就这么写了：

```java
public ReturnType anony(Theta t) {
	return lrCostFunction(t, X, (y == c), lambda);
}
```

