---
layout: post
title: "Equation Numbering and Referencing in MathJax"
description: ""
category: Latex
tags: [Latex-101]
---
{% include JB/setup %}

## 1. Equation Numbering

### 1.1 Automatically

See [Automatic Equation Numbering](http://docs.mathjax.org/en/latest/tex.html#tex-eq-numbers)

### 1.2 Manually

根据 [Automatic Equation Numbering](http://docs.mathjax.org/en/latest/tex.html#tex-eq-numbers) 说的：

> and `\tag{}` can be used to override the usual equation number with your own symbol instead.

那我们用 `\tag{}` 就好了。比如：

```latex
\begin{equation}
	Y \approx \beta_0 + \beta_1 X
	\tag{1.1}
\end{equation}
```

效果是：	

$$
\begin{equation}
	Y \approx \beta_0 + \beta_1 X
	\tag{1.1}
\end{equation} 
$$

## 2. Equation Referencing

用 `\label{}` 和 `\ref{}`。类比一下：

* `\label{xxx}` 就是 `<a name="xxx"></a>` 
* `\ref{xxx}` 就是 `<a href="#xxx"></a>`

比如：  

```latex
\begin{equation}
	Y \approx \beta_0 + \beta_1 X
	\tag{1.1}
	\label{eq1.1}
\end{equation}
```
	
显示效果没有变化：	

$$
\begin{equation}
	Y \approx \beta_0 + \beta_1 X
	\tag{1.1}
	\label{eq1.1}
\end{equation} 
$$

但是现在可以通过 `\ref{}` 来生成一个 Anchor：  

```latex
According to $ \ref{eq1.1} $, we have ...
```

效果是：  

According to $ \ref{eq1.1} $, we have ...

如果想让公式编号自带括号的话，可以用 `amsmath` package 的 `\eqref{}`:

```latex
According to $ \eqref{eq1.1} $, we have ...
```

效果是：  

According to $ \eqref{eq1.1} $, we have ...