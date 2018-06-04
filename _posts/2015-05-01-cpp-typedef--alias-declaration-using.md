---
layout: post
title: "C++: typedef & alias declaration (using)"
description: ""
category: C++
tags: [C++11]
---
{% include JB/setup %}

整理自 _C++ Primer, 5th Edition_

-----

所谓 alias declaration 就是 `using X = Y;`，它和 `typedef Y X;` 是完全等价的：

```cpp
class SalesItem {

};

class SalesReport {
	
};

int main() {
	typedef SalesItem SI, *PSI;
	// equivalent to:
	// typedef SalesItem SI;
	// typedef SalesItem* PSI;
	
	using SR = SalesReport;
	using PSR = SalesReport*;
	
	SI si;
	PSI psi = new SI;
	PSI psi2 = new SalesItem;
	
	SR sr;
	PSR psr = new SR;
	PSR psr2 = new SalesReport;
	
	delete psi;
	delete psi2;
	delete psr;
	delete psr2;
}
```

-----

_~~~~~~~~~~ 2015-05-16 补充；来自 C++ Primer, 5th Edition ~~~~~~~~~~_

Under C++11, we are able to define a type alias for a class template:

```cpp
template<typename T> using twin = pair<T, T>;
twin<string> authors; // authors is a pair<string, string>

template <typename T> using partNo = pair<T, unsigned>;
partNo<string> books; // books is a pair<string, unsigned>
```

简单地说就是 `twin<T> == pair<T, T>` 和 `partNo<T> == pair<T, unsigned>`。注意这种语法。
