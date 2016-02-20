---
layout: post
title: "R Scoping Rules"
description: ""
category: R
tags: [R-101]
---
{% include JB/setup %}

总结自 [Introduction to the R Language - Scoping Rules (pdf)](https://d396qusza40orc.cloudfront.net/rprog/lecture_slides/Scoping.pdf)

---

如果我在 R Console 定义了一个 `lm` 函数，我调用 `lm` 一定是调用的我自己定义的函数，不会去调用 stat 包用来处理 linear model 的 `lm` 函数。这就是 Scoping Rules 的作用：决定 How to bind values to symbols.

## 1. Search List and the Environments

### 1.1 Search List

When R tries to bind a value to a symbol, it searches through a series of _environments_ to find the appropriate value. When you are working on the command line and need to retrieve the value of an R object, the order is roughly:

* Search the global environment for a symbol name matching the one requested.
* Search the namespaces of each of the packages on the search list

The search list can be found by using the `search` function.

	> search()
	[1] ".GlobalEnv"        "package:stats"     "package:graphics"
	[4] "package:grDevices" "package:utils"     "package:datasets"
	[7] "package:methods"   "Autoloads"         "package:base"

注意几点：

* The _**global**_ environment (i.e. the user’s workspace) is always the first element of the search list and the base package is always the last.
* When a user loads a package with `library` the namespace of that package gets put in position 2 of the search list (by default) and everything else gets shifted down the list.
* Note that R has _separate namespaces for functions and non-functions_ so it’s possible to have an object named c and a function named c.

### 1.2 Environments

* An environment is a collection of `<symbol, value>` pairs, i.e. x is a symbol and 3.14 might be its value.
* Every environment has a parent environment; it is possible for an environment to have multiple “children”
* the only environment without a parent is the empty environment
* A function + an environment = a closure (a.k.a. function closure)

## 2. Lexical Scoping

R uses _lexical scoping_ or _static scoping_. A common alternative is _dynamic scoping_.

wiki 上 [Lexical scoping vs. dynamic scoping](http://en.wikipedia.org/wiki/Scope_(computer_science\)#Lexical_scoping_vs._dynamic_scoping) 有说：

> In lexical scoping (or lexical scope; also called static scoping or static scope), if a variable name's scope is a certain function, then its scope is the program text of the function definition: within that text, the variable name exists, and is bound to the variable's value, but outside that text, the variable name does not exist. By contrast, in dynamic scoping (or dynamic scope), if a variable name's scope is a certain function, then its scope is the time-period during which the function is executing: while the function is running, the variable name exists, and is bound to its variable, but after the function returns, the variable name does not exist. This means that if function f invokes a separately defined function g, then under lexical scoping, function g does not have access to f's local variables (since the text of g is not inside the text of f), while under dynamic scoping, function g does have access to f's local variables (since the invocation of g is inside the invocation of f).

至于 lexical 的意思，这篇 [What is lexical scoping?](http://ericlippert.com/2013/05/20/what-is-lexical-scoping) 有说：

> The word “lexical” means, in a broad sense “relating to text”

值得一读。

### 2.1 Free Variables

考虑这样一个函数：

	f <- function(x, y) {
		x^2 + y / z
	}

x 和 y 是 formal argument (实参；调用时传入的参数，比如 `f(3, 5)` 的 3 和 5 称为实参，actual argument)，z 既不是实参也不是 local variable (which is assigned insided the function body)，称为 free variable。

Lexical scoping in R means that:

* The values of free variables are searched for in the environment in which the function was _**defined**_.
* If the value of a symbol is not found in the environment in which a function was defined, then the search is continued in the parent environment.
* The search continues down the sequence of parent environments until we hit the top-level environment; this usually the global environment (workspace) or the namespace of a package.
* After the top-level environment, the search continues down the search list until we hit the empty environment. If a value for a given symbol cannot be found once the empty environment is arrived at, then an error is thrown.

### 2.2 Functions Defined Inside Other Functions

比如这个返回函数的函数：

	make.power <- function(n) {
		pow <- function(x) {
				x^n 
		}
		pow 
	}

	> cube <- make.power(3)
	> square <- make.power(2)
	> cube(3)
	[1] 27
	> square(3)
	[1] 9

对 `pow` 而言，n 是 free variable，但是在 `pow` 被定义的 environment 里可以找到：

	> ls(environment(cube))
	[1] "n"   "pow"
	> get("n", environment(cube))
	[1] 3

	> ls(environment(square))
	[1] "n"   "pow"
	> get("n", environment(square))
	[1] 2

### 2.3 Lexical vs. Dynamic Scoping

再看一个例子：

	y <- 10

	f <- function(x) {
			y <- 2
			y^2 + g(x)
	}

	g <- function(x) { 
			x*y
	}

问 `g` 中 y 的值是多少？

Lexical Scoping:

* With lexical scoping the value of y in the function g is looked up in the environment in which the function was defined, in this case the global environment
* so the value of y is 10.

Dynamic Scoping:

* With dynamic scoping, the value of y is looked up in the environment from which the function was called (sometimes referred to as the calling environment).
	* In R the calling environment is known as the _**parent frame**_
* So the value of y would be 2.

### 2.4 Consequences of Lexical Scoping

* In R, all objects must be stored in memory
* All functions must carry a pointer to their respective defining environments, which could be anywhere
