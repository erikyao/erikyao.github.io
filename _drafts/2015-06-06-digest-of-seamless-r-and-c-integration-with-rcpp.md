---
layout: post
title: "Digest of <i>Seamless R and C++ Integration with Rcpp</i>"
description: ""
category: R
tags: [Rcpp, Book]
---
{% include JB/setup %}

## Chapter 1. A Gentle Introduction to Rcpp

第一章简单介绍了两种 Rcpp 写法，这里不追求原理，只展示下例子。

### 1.1 inline 写法

#### inline 原理之一：C++ function wrapper

假设我们有一个 C++ function：

<pre class="prettyprint linenums">
int fibonacci(const int x) {
	if (x == 0) return(0);
	if (x == 1) return(1);
	return (fibonacci(x - 1)) + fibonacci(x - 2);
}
</pre>

R 的底层是 C，我们要把这个 C++ function 给 R 调用的话，需要写一个 wrapper。具体的原理这里不展示，你只要知道要有这个 wrapper 就好了：

<pre class="prettyprint linenums">
// SEXP means "pointer to S expression"

extern "C" SEXP fibWrapper(SEXP xs) {
	int x = Rcpp::as&lt;int&gt;(xs);
	int fib = fibonacci(x);
	return (Rcpp::wrap(fib));
}
</pre>

- `Rcpp::as<int>(xs)` converts the incoming argument `xs` from `SEXP` to integer. 
- `Rcpp::wrap(fib)` converts the integer result `fib` to the `SEXP` type.

#### inline 实例

注意这里 inline 不是指 C++ 的 inline，而是一个 R package。前面的 `SEXP` 是 R 的底层，是 C 代码；而 `inline::cxxfunction()` 是在 R 的环境里内嵌 C++ 代码，本质上还是 R 代码。

With `inline` package providing a complete wrapper around the compilation, linking, and loading steps, the programmer can concentrate on the actual code (in either one of the supported languages C, C++, or Fortran) and forget about the operating-system specific details of compilation, linking, and loading. A single entry point, the function `cxxfunction()` can be used to turn code supplied as a text variable into an executable function.

- 类似地还有一个 `cfunction()` 接口

<pre class="prettyprint linenums">
library(inline)

incltxt <- ’
	int fibonacci(const int x) {
		if (x == 0) return(0);
		if (x == 1) return(1);
		return fibonacci(x - 1) + fibonacci(x - 2);
	}
’

fibRcpp <- cxxfunction(signature(xs="int"),
	plugin="Rcpp",
	incl=incltxt,
	body=’
		int x = Rcpp::as&lt;int&gt;(xs);
		return Rcpp::wrap(fibonacci(x));
	’
)
</pre>

这里 `incl` 就是 inline 的 C++ code，`body` 就是 C++ function wrapper。复杂一点的情况，`incl` 里可以定一个 class，然后 `body` 里 new 一个对象，然后调用对象的方法再 return 回去。

若想看后台生成的文件以及调用的过程，可以给 `cxxfunction()` 加一个参数 `verbose=TRUE`。这个设置在调试时也很有用。

### 1.2 Rcpp Attributes 写法

看起来比 inline 要来得简单。这里 Rcpp Attribute 可以理解为 java annotation，但是形式上它是一个注释：

<pre class="prettyprint linenums">
/***** fibonacci.cpp *****/

#include &lt;Rcpp.h&gt;
using namespace Rcpp;

// [[Rcpp::export]]
int fibonacci(const int x) {
	if (x &lt; 2)
		return x;
	else
		return (fibonacci(x - 1)) + fibonacci(x - 2);
}
</pre>

这里 `[[Rcpp::export]]` 就是一个 Rcpp Attribute。

R 调用起来也很方便：

<pre class="prettyprint linenums">
library(Rcpp)

sourceCpp("fibonacci.cpp")
fibonacci(20)
[1] 6765
</pre>

## Chapter 2. Tools and Setup

### Only gcc compilers are supported on Windows platform

在 windows 系统上只能使用 gcc 编译器，因为 For example, how function names, and member function names inside classes, are represented is not standardized between compiler makers, and this generally prevents mixing of object code between different compilers.

As Rcpp is of course a C++ application, this last restriction applies and we need to stick with the compilers used to build R on the different platforms. 而 R 的 windows 版本是用 gcc 编译器编译的，所以我们自己写的 C++ 文件也要配套使用 gcc 编译器。

### inline 原理之二：.Call() 接口

我们把 C++ 编译好之后（书上的编译过程这里就不研究了），就可以通过 `.Call()` 接口配合 wrapper 来调用：

<pre class="prettyprint linenums">
dyn.load("fibonacci.so")
.Call("fibWrapper", 10)
[1] 55
</pre>

- `dyn.load()` loads the shared library. It uses the full filename, including 
	- the explicit platform-dependent extension which is .so on Unix, 
	- .dll onWindows, 
	- and .dylib on OS X
	
### Plugins of inline

We have seen the use of the options `plugin="Rcpp"` in the previous examples. Plugins provide a general mechanism for packages using Rcpp to supply additional information which may be needed to compile and link the particular package. 这里说的 additional information，may include additional header files and directories, as well as additional library names to link against as well as their locations.

像 RcppArmadillo, RcppEigen, RcppGSL 这些都是 plugins。

也可以自己手动写一个 plugin，具体参书上 P30。

### cppFunction() of Rcpp Attributes

Rcpp Attributes 除了 `sourceCpp()` 外，还有 

- `cppFunction()`: creates a function from a argument of text. 
	- 步骤包括：
		1. It creates a temporary file.
		1. It creates a wrapper.
		1. It returns an R function which calls the wrapper.
	- 注意 `cxxfunction()` 是 inline 包的。
- `evalCpp()`: evaluates a C++ expression directly

<pre class="prettyprint linenums">
cpptxt &lt;- ’
	int fibonacci(const int x) {
		if (x &lt; 2) return(x);
		return (fibonacci(x - 1)) + fibonacci(x - 2);
	}
’

fibCpp &lt;- cppFunction(cpptxt) # compiles, load, links, ...
</pre>

这种用法也可以使用 inline 的 plugin，比如：

<pre class="prettyprint linenums">
code &lt;- ’C++ code goes here’

gslVolumes &lt;- cppFunction(code, depends="RcppGSL")
</pre>

## Chapter 3 Data Structures: Part One

### 3.1 The RObject Class

In Rcpp class hierarchy, although RObject is not directly user-facing, it provides the foundation upon which many important and frequently-used classes are built. 感觉就像 java 的 Object class。

- An instance of the RObject class encapsulates an R object. 
	- Every R object itself is internally represented by a `SEXP`.
		- `SEXP` is a pointer to `SEXPREC`. 
			- `SEXPREC` is S expression object.
			- One key aspect is that S expression objects are union types.
	- In fact, the `SEXP` is indeed the only data member of an RObject.
	- 另外还有一种类型 `VECSXP` is a vector of `SEXP`.
- The RObject effectively treats its underlying `SEXP` as a resource. 
	- The constructor of the RObject class takes the necessary measures to guarantee that the underlying `SEXP` is protected from the R garbage collector, 
	- and the destructor assumes the responsibility to withdraw that protection.
	
### 3.2 Rcpp::IntegerVector

`Rcpp::IntegerVector` 可以理解为 `vector<int>`，我们可以把 `c(1,2,3)` 或者 `1:10` 传给它，或者 return 一个 `IntegerVector` 回来给 R 用。

### 3.3 Rcpp::NumericVector

类似地，`Rcpp::NumericVector` 可以理解为 `vector<double>`。

#### shallow copy 和 deep copy 的问题

<pre class="prettyprint linenums">
src &lt;- ’
	Rcpp::NumericVector invec(vx);
	Rcpp::NumericVector outvec(vx);
	for (int i=0; i&lt;invec.size(); i++) {
		outvec[i] = log(invec[i]);
	}
	return outvec;
’

fun &lt;- cxxfunction(signature(vx="numeric"), src, plugin="Rcpp")
x &lt;- seq(1.0, 3.0, by=1)

cbind(x, fun(x))
x
[1,] 0.0000000 0.0000000
[2,] 0.6931472 0.6931472
[3,] 1.0986123 1.0986123
</pre>

上面这一段最大的问题是：你修改 `outvec` 的同时也改动了 `invec`。反映到 R 上就是你调用 `fun(x)` 的同时也修改了 `x`。这是因为 `NumericVector` 本质是 RObject，而 RObject 的本质是 `SEXP`，而 `SEXP` 又是 pointer to R expression，所以这里 `invec` 和 `outvec` 是两个不同的 pointer 指向了同一个 R vector。

正确的写法是：

<pre class="prettyprint linenums">
// method 1
Rcpp::NumericVector invec(vx);
Rcpp::NumericVector outvec = Rcpp::clone(vx);
...

// method 2
Rcpp::NumericVector invec(vx);
Rcpp::NumericVector outvec = log(invec); // This is Rcpp sugar
</pre>

### 3.4 Other Vector Classes

- `LogicalVector`: `vector<bool>`，但是要注意可以有 NA
- `CharacterVector`: `vector<const char*>`，并不是 `vector<string>`

## Chapter 4 Data Structures: Part Two

### 4.1 Rcpp::Named

<pre class="prettyprint linenums">
someVec &lt;- c(mean=1.23, dim=42.0, cnt=12)
someVec
mean dim cnt
1.23 42.00 12.00
</pre>

等同于：

<pre class="prettyprint linenums">
src &lt;- ’
	Rcpp::NumericVector x =
	Rcpp::NumericVector::create(
		Rcpp::Named("mean") = 1.23,
		Rcpp::Named("dim") = 42,
		Rcpp::Named("cnt") = 12
	);
	return x; 
’

fun &lt;- cxxfunction(signature(), src, plugin="Rcpp")
fun()
mean dim cnt
1.23 42.00 12.00
</pre>

而 `Rcpp::Named("mean")` 部分又可以简写为：

<pre class="prettyprint linenums">
	Rcpp::NumericVector x = NumericVector::create(
		_["mean"] = 1.23,
		_["dim"] = 42,
		_["cnt"] = 12
	);
</pre>

### 4.2 Rcpp::GenericVector

对应 R 的 list。用法类似 4.1。

### 4.3 Rcpp::DataFrame

对应 R 的 `data.frame`。Internally, data frames are represented as lists.

### 4.4 Rcpp::Function

#### 4.4.1 Rcpp::Function 包装一个 R function

A `Function` object is needed whenever an R function—either supplied by the user or by accessing an R function—is employed.

<pre class="prettyprint linenums">
src &lt;- ’
	Function sort(x);
	return sort(y, Named("decreasing", true));
’

fun &lt;- cxxfunction(signature(x="function", y="ANY"), src, plugin="Rcpp")
fun(sort, sample(1:5, 10, TRUE))
[1] 5 5 5 3 3 3 2 2 2 1
</pre>

这里是把 R 的 `sort` 作为 `x` 传给了 `Function sort(x)`。然后注意调用 `Function sort` 的传参方法是 `Named("paraName", paraVal)`

Another useful point to note is that because the second argument `y` is never instantiated (即我们没有把 `y` 转成 Rcpp 的对象), we can pass different types of a suitable nature. 

#### 4.4.2 Rcpp::Function 调用一个 R function

The `Function` class can also be used to access R functions directly. In the example below, we draw five random numbers from a t-distribution with three degrees of freedom. As we are accessing the random number generators, we need to ensure that it is in a proper state. The `RNGScope` class ensures this by initializing the random number generator by calling the `GetRNGState()` function from the class constructor, and by restoring the initial state via `PutRNGState()` via its destructor.

<pre class="prettyprint linenums">
src <- ’
	RNGScope scp;
	Rcpp::Function rt("rt");
	return rt(5, 3);
’
fun &lt;- cxxfunction(signature(), src, plugin="Rcpp")

set.seed(42)
fun()
[1] 2.339681 0.130995 -0.074028 -0.057701 -0.046482
</pre>

注意这里我们是把 R function 的 name "rt" 传给了 `Rcpp::Function rt("rt");`。

### 4.5 Rcpp::Environment

Environment 主要负责 variable lookup、namespace 这类的职责。

#### 使用 Rcpp::Environment 定位到 R package 中的某个 functions

<pre class="prettyprint linenums">
Rcpp::Environment stats("package:stats");	// 用 environment 定位到 package
Rcpp::Function rnorm = stats["rnorm"];		// 定位到 function

return rnorm(10, Rcpp::Named("sd", 100.0));
</pre>

#### 使用 Rcpp::Environment 访问 R global environment 的 variable、创建新的 variable

<pre class="prettyprint linenums">
Rcpp::Environment global = Rcpp::Environment::global_env();

std::vector<double> vx = global["x"];	// 访问 x

std::map<std::string,std::string> map;
map["foo"] = "oof";
map["bar"] = "rab";
global["y"] = map;						// 创建 y
</pre>

