---
layout: post
title: "Rcpp: inline 生成的临时文件举例以及 exception 相关的宏"
description: ""
category: R
tags: [Rcpp]
---
{% include JB/setup %}

总结自 _Seamless R and C++ Integration with Rcpp_

-----

```r
library(inline)

src <- '
	Rcpp::NumericVector xa(a);
	Rcpp::NumericVector xb(b);
	int n_xa = xa.size(), n_xb = xb.size();

	Rcpp::NumericVector xab(n_xa + n_xb - 1);
	for (int i = 0; i < n_xa; i++)
		for (int j = 0; j < n_xb; j++)
			xab[i + j] += xa[i] * xb[j];

	return xab;
'

fun <- cxxfunction(signature(a="numeric", b="numeric"), src, plugin="Rcpp", verbose=TRUE)
```

执行上面的 R 代码，console 会显示出编译、链接信息以及生成的 C++ 临时文件：

```r
 >> setting environment variables: 
PKG_LIBS = 

 >> LinkingTo : Rcpp
CLINK_CPPFLAGS =  -I"E:/R/R-3.1.0/library/Rcpp/include" 

 >> Program source :

   1 : 
   2 : // includes from the plugin
   3 : 
   4 : #include <Rcpp.h>
   5 : 
   6 : 
   7 : #ifndef BEGIN_RCPP
   8 : #define BEGIN_RCPP
   9 : #endif
  10 : 
  11 : #ifndef END_RCPP
  12 : #define END_RCPP
  13 : #endif
  14 : 
  15 : using namespace Rcpp;
  16 : 
  17 : 
  18 : // user includes
  19 : 
  20 : 
  21 : // declarations
  22 : extern "C" {
  23 : SEXP file11f437244ecf( SEXP a, SEXP b) ;
  24 : }
  25 : 
  26 : // definition
  27 : 
  28 : SEXP file11f437244ecf( SEXP a, SEXP b ){
  29 : BEGIN_RCPP
  30 : 
  31 : Rcpp::NumericVector xa(a);
  32 : Rcpp::NumericVector xb(b);
  33 : int n_xa = xa.size(), n_xb = xb.size();
  34 : 
  35 : Rcpp::NumericVector xab(n_xa + n_xb - 1);
  36 : for (int i = 0; i < n_xa; i++)
  37 : for (int j = 0; j < n_xb; j++)
  38 : xab[i + j] += xa[i] * xb[j];
  39 : 
  40 : return xab;
  41 : 
  42 : END_RCPP
  43 : }
  44 : 
  45 : 
```

我们把生成的 C++ 临时文件拎出来排下版：

```r
// includes from the plugin
#include <Rcpp.h>

#ifndef BEGIN_RCPP
#define BEGIN_RCPP
#endif

#ifndef END_RCPP
#define END_RCPP
#endif

using namespace Rcpp;

// user includes
// 自注：nothing 

// declarations
extern "C" {
	SEXP file11f437244ecf( SEXP a, SEXP b) ;
}

// definition
SEXP file11f437244ecf( SEXP a, SEXP b ){
	BEGIN_RCPP

		Rcpp::NumericVector xa(a);
		Rcpp::NumericVector xb(b);
		int n_xa = xa.size(), n_xb = xb.size();

		Rcpp::NumericVector xab(n_xa + n_xb - 1);
		for (int i = 0; i < n_xa; i++)
			for (int j = 0; j < n_xb; j++)
				xab[i + j] += xa[i] * xb[j];
		
		return xab;
	
	END_RCPP
}
```

注意 `BEGIN_RCPP` 和 `END_RCPP` 这个两个宏，它们的作用其实是用来拼 exception handling 语句的：

```r
#ifndef BEGIN_RCPP
#define BEGIN_RCPP try {
#endif

#ifndef VOID_END_RCPP
#define VOID_END_RCPP } catch (std::exception& __ex__) { \
	forward_exception_to_r(__ex__); \
} catch(...) { \
	::Rf_error("c++ exception (unknown reason)"); \
}
#endif

#ifndef END_RCPP
#define END_RCPP VOID_END_RCPP return R_NilValue;
#endif
```

这两个宏的定义在 [Rcpp Version 0.11.6 - macros.h File Reference](http://dirk.eddelbuettel.com/code/rcpp/html/macros_2macros_8h.html)。现在的版本比上面的要高级一点，但是主体结构没有大的变化。

另外，查看本机 R package 的版本可以用：

```r
packageVersion("Rcpp") # 引号不能省
[1] ‘0.11.2’
```
