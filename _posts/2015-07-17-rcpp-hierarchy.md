---
category: R
description: ''
tags:
- Rcpp
title: Rcpp Hierarchy
---

## 1. The C beneath R 

我们在 [Digest of Advanced R](/r/2015/07/08/digest-of-advanced-r) 的 [13.4 Implementation performance](/r/2015/07/08/digest-of-advanced-r#13-4-Implementation-performance) 讲过：

> R is over 20 years old. It contains nearly 800,000 lines of code (about 45% C, 19% R, and 17% Fortran).

而 R 中的 C 的代表就是 `SEXP` 那一套，具体可以参 [17.2 R's C data structures](http://erikyao.github.io/r/2015/07/08/digest-of-advanced-r#17-2-R's-C-data-structures)。

## 2. Related R APIs

_Seamless R and C++ Integration with Rcpp_ 的 _2.3 The R Applicataion Programming Interface_ 小节有讲：

- `.C()`: appeared in an earlier version of the R language and is much more restrictive.
	- It only supports pointers to basic C types.
- `.Call()`: is a much richer interface.
	- It can operate on `SEXP` objects.
	
此外在 [Digest of Advanced R](/r/2015/07/08/digest-of-advanced-r) 我们还提到过：

- `.Internal()`
- `.External()`
- `.Primitive()`

这里不做讨论。

## 3. 结合 1 和 2 可以做到在 R 中调用 C 函数

结合 [Digest of Advanced R](/r/2015/07/08/digest-of-advanced-r) 的 [17.1 Calling C functions from R](/r/2015/07/08/digest-of-advanced-r#17-1-Calling-C-functions-from-R) 和 _Seamless R and C++ Integration with Rcpp_ 的 _2.4 A First Compilation with Rcpp_ 小节，我们可以得到一个完整点的例子：

```c
// In C ----------------------------------------
#include <R.h>
#include <Rinternals.h>

SEXP add(SEXP a, SEXP b) {
  SEXP result = PROTECT(allocVector(REALSXP, 1));
  REAL(result)[0] = asReal(a) + asReal(b);
  UNPROTECT(1);

  return result;
}

// 假设编译得到 add.so
```

```r
# In R ----------------------------------------
dyn.load("add.so")

add <- function(a, b) {
  .Call("add", a, b)
}
```

- `dyn.load()` loads the shared library. It uses the full filename, including 
	- the explicit platform-dependent extension which is .so (Shared Object) on Unix, 
	- .dll (Dynamic-Link Library) on Windows, 
	- and .dylib (Dynamic Library) on OS X

其实我们在 R 里调用 `.Call("add", a, b)` 就已经做到了 "在 R 里调用 C 函数"；然后我们再定义一个同名的 R 函数 `add <- fucntion() { .Call("add") }`，就成了 "把 C 函数转化成了 R 函数"。

## 4. library(inline) 简化了上面这种模式

_Seamless R and C++ Integration with Rcpp_ 的 _1.2.4 Using Inline_ 小节有讲：

> With `inline` package providing a complete wrapper around the compilation, linking, and loading steps, the programmer can concentrate on the actual code (in either one of the supported languages C, C++, or Fortran) and forget about the operating-system specific details of compilation, linking, and loading.

所以就是把上面第 3 节的模式（写 C 函数 => 编译 C 函数 => R 里 load .so => R 里 `.Call()` C 函数）全包了：

- `add <- cfunction()` 就相当于上面的 `add <- fucntion(...) { .Call(...) }` 
	- 如果底层是 C++ 代码，就用 `add <- cxxfunction()`
- C 代码不用单独写在一个 C 文件里，直接把代码文本写在 `cfunction(body=xxx)` 参数里
	- `body=xxx` 里面不用写函数名和参数列表，直接写 function body 即可
- `dyn.load("add.so")` 的步骤帮你省掉了

我们用 `inline` 来实现上面那个例子：

```r
library(inline)

code <- '
	SEXP result = PROTECT(allocVector(REALSXP, 1));
	REAL(result)[0] = asReal(a) + asReal(b);
	UNPROTECT(1);
	return result;
'

add <- cfunction(signature(a="numeric", b="numeric"), body=code)
// 加一个 verbose=TREU 参数可以看到 cfunction 生成的临时的 C 文件
```

此外还需要注意的是：

- `inline` package 支持 C, C++, and Fortran。所以它是一个广泛的底层机制，并不是专门为 C++ 服务的。
- 理解到这个层次，`cxxfunction(plugin="Rcpp")` 就成了个非常混淆视线的东西，因为我们用的仍然是 `inline`，而不是后面 `library(Rcpp)` 的写法；指定 `plugin="Rcpp"` 的作用是 "可以在 `body=xxxx` 的 C++ 代码里使用 Rcpp namespace 下的数据结构和方法，比如 `Rcpp::wrap()` 和 `Rcpp::NumericVector`"。
	- 这从另一个角度说明，Rcpp 其实是包含两个层面的东西：
		- C++ 层面：Rcpp namespace，比如 `Rcpp::wrap()` 和 `Rcpp::NumericVector`
		- R 层面：`library(Rcpp)`，比如 `Rcpp::cppFunction()` 和 `Rcpp::sourceCpp()`

## 5. library(Rcpp)

已知有两种用法：

- `cppFunction()` 
	- 注意 `cppFunction()` 里面是写一个完整的函数，包括函数名、参数列表、函数体；不像 `cfunction(body=xxx)` 只写函数体。
	- 可以不写 `add <- cppFunction(...)`，因为 `cppFunction(...)` 执行后，R 中就有一个同名的函数，可以直接调用。当然，你写也不会出错。
	- `cppFunction()` 也可以使用 plugin，写法为 `cppFunction(..., depends="PLUGIN-NAME")` 
- C++ 文件里写 Rcpp Attributes (比如 `[[Rcpp::export]]`)，然后 R 里执行 `sourceCpp()`
	- 这么搞其实又回到第 3 节的 "C文件 + R文件" 模式上去了。
	
具体的例子参考 [Digest of Advanced R](/r/2015/07/08/digest-of-advanced-r) 的 [16. High performance functions with Rcpp](/r/2015/07/08/digest-of-advanced-r#16--High-performance-functions-with-Rcpp)。

注意这两种用法的实现方法是不同的：

- `cppFunction()` 用的是 `.Call` (参 [cppFunction {Rcpp}](http://www.inside-r.org/packages/cran/rcpp/docs/cppFunction))
- `sourceCpp()` 用的是 `inline` (参 [Rcpp Attributes](http://dirk.eddelbuettel.com/code/rcpp/Rcpp-attributes.pdf))

## 6. 更进一步

`RcppArmadillo`, `RcppEigen`, `RcppBDT` and `RcppGSL` are packages using `Rcpp`. 同时它们也是 plugins。

要进一步研究，可以从这几个包入手，它们都是很好的例子。