---
layout: post-mathjax
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

	\begin{equation}
		Y \approx \beta\_0 + \beta\_1 X
		\tag{1.1}
	\end{equation}

效果是：	

$$
\begin{equation}
	Y \approx \beta\_0 + \beta\_1 X
	\tag{1.1}
\end{equation} 
$$

## 2. Equation Referencing

用 `\label{}` 和 `\ref{}`。类比一下：

* `\label{xxx}` 就是 `<a name="xxx"></a>` 
* `\ref{xxx}` 就是 `<a href="#xxx"></a>`

比如：  

	\begin{equation}
		Y \approx \beta\_0 + \beta\_1 X
		\tag{1.1}
		\label{eq1.1}
	\end{equation}
	
显示效果没有变化：	

$$
\begin{equation}
	Y \approx \beta\_0 + \beta\_1 X
	\tag{1.1}
	\label{eq1.1}
\end{equation} 
$$

但是现在可以通过 `\ref{}` 来生成一个 Anchor：  

	According to \\( \ref{eq1.1} \\), we have ...
	
效果是：  

According to \\( \ref{eq1.1} \\), we have ...