---
category: R
description: ''
tags: []
title: 'R: dive into types'
---

- [1. 预备知识：`class()` / `typeof()` / `mode()` / `storage.mode()`](#1-预备知识class--typeof--mode--storagemode)
- [2. 预备知识：R Basic Types 总览](#2-预备知识r-basic-types-总览)
- [3. 深入 Language Objects](#3-深入-language-objects)
- [4. 深入 Function Types](#4-深入-function-types)

## 1. 预备知识：`class()` / `typeof()` / `mode()` / `storage.mode()`

[Stack Overflow: Mode, Class and Type of R objects](https://stats.stackexchange.com/a/3213) 曰：

- `class()` 是 OO 的角度
- `typeof()` 是 R language 的角度
- `mode()` 是 S language 的角度
- `storage.mode()` 是 compiled S 的角度

我只想说：Go fxxk yourself.

[Stack Overflow: A comprehensive survey of the types of things in R; 'mode' and 'class' and 'typeof' are insufficient](https://stackoverflow.com/a/40171527) 有大善人做了个总结，我做了两点改进：

1. 我调了一下 column 的顺序，把 `mode` 和 `storage.mode` 搁一起了
2. 我新加了 `library(pryr)` 去获取 S-expression type

```r
library(methods)
library(dplyr)
library(xml2)
library(pryr)

setClass("dummy", representation(x="numeric", y="numeric"))

types <- list(
	"logical vector" = logical(),
	"integer vector" = integer(),
	"numeric vector" = numeric(),
	"complex vector" = complex(),
	"character vector" = character(),
	"raw vector" = raw(),
	factor = factor(),
	"logical matrix" = matrix(logical()),
	"numeric matrix" = matrix(numeric()),
	"logical array" = array(logical(8), c(2, 2, 2)),
	"numeric array" = array(numeric(8), c(2, 2, 2)),
	list = list(),
	pairlist = .Options,
	"data frame" = data.frame(),
	"closure function" = identity,
	"builtin function" = `+`,
	"special function" = `if`,
	environment = new.env(),
	null = NULL,
	formula = y ~ x,
	expression = expression(),
	call = call("identity"),
	name = as.name("x"),
	"paren in expression" = expression((1))[[1]],
	"brace in expression" = expression({1})[[1]],
	"S3 lm object" = lm(dist ~ speed, cars),
	"S4 dummy object" = new("dummy", x = 1:10, y = rnorm(10)),
	"external pointer" = read_xml("<foo><bar /></foo>")$node
)

type_info <- Map(
	function(x, nm)
	{
		data_frame(
			"spoken type" = nm,
			class = class(x), 
			typeof = typeof(x),
			mode = mode(x),
			storage.mode = storage.mode(x), 
			sexp_type = sexp_type(x)
		)
	},
	types,
	names(types)
) %>% bind_rows

knitr::kable(type_info)
```

得到的结果：

|spoken type         |class       |typeof      |mode        |storage.mode |sexp_type  |
|:-------------------|:-----------|:-----------|:-----------|:------------|:----------|
|logical vector      |logical     |logical     |logical     |logical      |LGLSXP     |
|integer vector      |integer     |integer     |numeric     |integer      |INTSXP     |
|numeric vector      |numeric     |double      |numeric     |double       |REALSXP    |
|complex vector      |complex     |complex     |complex     |complex      |CPLXSXP    |
|character vector    |character   |character   |character   |character    |STRSXP     |
|raw vector          |raw         |raw         |raw         |raw          |RAWSXP     |
|factor              |factor      |integer     |numeric     |integer      |INTSXP     |
|logical matrix      |matrix      |logical     |logical     |logical      |LGLSXP     |
|numeric matrix      |matrix      |double      |numeric     |double       |REALSXP    |
|logical array       |array       |logical     |logical     |logical      |LGLSXP     |
|numeric array       |array       |double      |numeric     |double       |REALSXP    |
|list                |list        |list        |list        |list         |VECSXP     |
|pairlist            |pairlist    |pairlist    |pairlist    |pairlist     |LISTSXP    |
|data frame          |data.frame  |list        |list        |list         |VECSXP     |
|closure function    |function    |closure     |function    |function     |CLOSXP     |
|builtin function    |function    |builtin     |function    |function     |BUILTINSXP |
|special function    |function    |special     |function    |function     |SPECIALSXP |
|environment         |environment |environment |environment |environment  |ENVSXP     |
|null                |NULL        |NULL        |NULL        |NULL         |NILSXP     |
|formula             |formula     |language    |call        |language     |LANGSXP    |
|expression          |expression  |expression  |expression  |expression   |EXPRSXP    |
|call                |call        |language    |call        |language     |LANGSXP    |
|name                |name        |symbol      |name        |symbol       |SYMSXP     |
|paren in expression |(           |language    |(           |language     |LANGSXP    |
|brace in expression |{           |language    |call        |language     |LANGSXP    |
|S3 lm object        |lm          |list        |list        |list         |VECSXP     |
|S4 dummy object     |dummy       |S4          |S4          |S4           |S4SXP      |
|external pointer    |externalptr |externalptr |externalptr |externalptr  |EXTPTRSXP  |

我只想说：Go fxxk yourself.

有用的地方也不是没有，比如：

- 实力说明 `data.frame` 的本质是 `list`
- 实力说明 `name` 其实就是 `symbol`
- 他用来举例的类型也可以参考一下

## 2. 预备知识：R Basic Types 总览

[R Language Definition](https://cran.r-project.org/doc/manuals/r-patched/R-lang.html#Basic-types) 曰 Basic Types 有：

- Vector
- List
- Language ([第 3 节](#3-深入-language-objects)详述):
    - $\texttt{class=expression}$ object
    - $\texttt{class=call}$ object
    - $\texttt{class=name}$ object
- Function ([第 4 节](#4-深入-function-types)详述):
    - $\texttt{type=closure}$ function
    - $\texttt{type=builtin}$ function
    - $\texttt{type=special}$ function
- NULL (i.e. of `NULL`)
- Promise
- Dot-dot-dot (i.e. of `...`)
- Environment
- Pairlist
- "Any"

## 3. 深入 Language Objects

[R Language Definition - Language objects](https://cran.r-project.org/doc/manuals/r-patched/R-lang.html#Language-objects):

> Since R has objects of type "expression" we will try to avoid the use of the word expression in other contexts. In particular syntactically correct expressions will be referred to as **statements**.

- 后面为了区分，我们约定：程序语言层面的 expression 就不用特殊格式，类型的话用 $\texttt{class=expression}$ 表示

解释几个概念：

- Expression 和 statement 的区别在于：
    - An expression contains one or more statements. 
    - A statement is a syntactically correct collection of tokens. 
- Symbol 与 name 的关系：
    - Symbols refer to R objects. 
    - The name of any R object is usually a symbol. (whatever. \:frowning\:)

Language objects 的分类与相关的函数:

- $\texttt{class=expression}$ object
    - `base::expression()`：接收一个 (程序语言层面的) expression (不是字符串)，返回一个 $\texttt{class=expression}$ object
        - 比如 `base::expression(x + y, z - 100)` $\Rightarrow$ `expression(x + y, z - 100)` (这是个包含两个 statements 的 expression)
            - 注意：只有 $\texttt{class=expression}$ object 有这样 `expression(...)` 格式化的输出；$\texttt{class=call}$ object 和 $\texttt{class=name}$ object 都没有
- $\texttt{class=call}$ object
    - `base::call()`：接收一个符串 (后续可跟参数)，生成 $\texttt{class=call}$ object 
        - 比如 `base::call("foo")` $\Rightarrow$ $\texttt{class=call}$ object `foo()`
            - 注意这是个 $\texttt{class=call}$ object 而不是一个 `function` object
        - 带参数的情况：`base::call("foo", 2)` $\Rightarrow$ $\texttt{class=call}$ object `foo(2)`
            - 等价于 `base::quote(foo(2))`
    - `base::quote()`：接收一个 function call statement，生成 $\texttt{class=call}$ object 
        - 比如 `base::quote(foo())` $\Rightarrow$ $\texttt{class=call}$ object `foo()`
            - 注意 `foo()` 是一个 function call statement 而 `foo` 是一个 name statement
- $\texttt{class=name}$ object
    - **不存在** `base::name()` 这么一个 function
    - `base::as.name()`：接收一个字符串，生成一个 $\texttt{class=name}$ object 
        - 比如 `base::as.name("x")` $\Rightarrow$ $\texttt{class=name}$ object `x`
    - `base::quote()`：接收一个 name statement，生成 $\texttt{class=name}$ object 
        - 比如 `base::quote(x)` $\Rightarrow$ $\texttt{class=name}$ object `x`

## 4. 深入 Function Types

基本分类：

- $\texttt{type=closure}$ function
- $\texttt{type=builtin}$ function
- $\texttt{type=special}$ function

从实现方式的角度来看：

- $\texttt{type=closure}$ function：
    - 内部没有调用 `.Primitive()` 或者 `.Internal()`
    - 一般你自定义的函数都是这种
- $\texttt{type=builtin}$ function 和 $\texttt{type=special}$ function：
    - 内部有调用 `.Primitive()` 或者 `.Internal()` 的函数
        - 我们约定称之为 `.Primitive()`-caller 或者 `.Internal()`-caller

注意 $\texttt{type=builtin}$/$\texttt{type=special}$ 与 `.Primitive()`-caller/`.Internal()`-caller 并没有排斥关系，也就是说它们可以组合出 4 个小类型。[R Internals - 1.5 Argument evaluation](https://cran.r-project.org/doc/manuals/r-release/R-ints.html#Argument-evaluation) 就举了 4 个例子：

- $\texttt{type=builtin}$ `.Primitive()`-caller:
    ```r
    > `+`
    function (e1, e2)  .Primitive("+")
    ```
- $\texttt{type=builtin}$ `.Internal()`-caller:
    ```r
    > grep
    function (pattern, x, ignore.case = FALSE, perl = FALSE, value = FALSE, 
        fixed = FALSE, useBytes = FALSE, invert = FALSE) 
    {
        if (!is.character(x)) 
            x <- structure(as.character(x), names = names(x))
        .Internal(grep(as.character(pattern), x, ignore.case, value, 
            perl, fixed, useBytes, invert))
    }
    <bytecode: 0x000000000a1ea060>
    <environment: namespace:base>
    ```
- $\texttt{type=special}$ `.Primitive()`-caller:
    ```r
    > quote
    function (expr)  .Primitive("quote")
    ```
- $\texttt{type=special}$ `.Internal()`-caller:
    ```r
    > cbind
    function (..., deparse.level = 1) 
    .Internal(cbind(deparse.level, ...))
    <bytecode: 0x000000000c49ce50>
    <environment: namespace:base>
    ```

说起查看函数的实现方式，相关的还有 [function components](http://adv-r.had.co.nz/Functions.html#function-components) 这个概念。任何一个 R function `f` 都有 3 个 components:

- `body(f)`: function 的代码 (in R)
- `formals(f)`: list of formal arguments
- `environment(f)`

但是要注意一个问题：你在 R console 里直接输入函数名并回车，同样也会显示这个函数的部分信息，我姑且称之函数的格式化输出。从上面的 4 个例子来看，似乎 `.Primitive()`-caller 没有 environment？对的，而且准确来说，它的 `body(f)`、`formals(f)`、`environment(f)` 都是 `NULL`:

```r
> body(quote)
NULL
> formals(quote)
NULL
> environment(quote)
NULL
```

只有 `.Primitive()`-caller 有这个特点；`.Internal()`-caller 和 $\texttt{type=closure}$ function 是不会这样的。

看到这里，你可能会觉得：那为什么我们不按 $\texttt{type=closure}$ function、`.Internal()`-caller、`.Primitive()`-caller 这三种情况来分类？$\texttt{type=builtin}$ function 和 $\texttt{type=special}$ function 的区别何在？

其实我们按 $\texttt{type=closure}$、$\texttt{type=builtin}$、$\texttt{type=special}$ 分类的重要依据是：**它们 evaulate arguments 的方式不同**。按 [R Internals - 1.5 Argument evaluation](https://cran.r-project.org/doc/manuals/r-release/R-ints.html#Argument-evaluation) 的说法：

> For a call to a closure, the actual and formal arguments are matched and a matched call (another `LANGSXP`) is constructed. This process first replaces the actual argument list by a list of promises to the values supplied. It then constructs a new environment which contains the names of the formal parameters matched to actual or default values: all the matched values are promises, the defaults as promises to be evaluated in the environment just created. That environment is then used for the evaluation of the body of the function, and promises will be forced (and hence actual or default arguments evaluated) when they are encountered. (Evaluating a promise sets `NAMED = NAMEDMAX` on its value, so if the argument was a symbol its binding is regarded as having multiple references during the evaluation of the closure call.)

> The essential difference5 between special and builtin functions is that the arguments of specials are not evaluated before the C code is called, and those of builtins are.

[R Language Definition - 2.1.7 Builtin objects and special forms](https://cran.r-project.org/doc/manuals/r-patched/R-lang.html#Builtin-objects-and-special-forms) 也提到：

> The difference between the two lies in the argument handling. Builtin functions have all their arguments evaluated and passed to the internal function, in accordance with _call-by-value_, whereas special functions pass the unevaluated arguments to the internal function.