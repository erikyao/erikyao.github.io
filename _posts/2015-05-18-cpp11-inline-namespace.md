---
layout: post
title: "C++11: inline namespace"
description: ""
category: C++
tags: [Cpp-101, C++11]
---
{% include JB/setup %}

搬运自 [C++11 FAQ: Inline namespace](http://www.stroustrup.com/C++11FAQ.html#inline-namespace)。

-----

The inline namespace mechanism is intended to support library evolution by providing a mechanism that support a form of **symbol versioning**. Consider:

```cpp
// file V99.h:
inline namespace V99 {
	void f(int);	// does something better than the V98 version
	// ...
}

// file V98.h:
namespace V98 {
	void f(int);	// does something
	// ...
}

// file Mine.h:
namespace Mine {
	#include "V99.h"
	#include "V98.h"
}
```

We here have a namespace `Mine` with both the latest release (V99) and the previous one (V98). If you want to be specific, you can:

```cpp
// file Main.cpp
#include "Mine.h"
using namespace Mine;

V98::f(1);	// old version
V99::f(1);	// new version
f(1);		// default version is V99::f(1)
```

The point is that the inline specifier makes the declarations from the nested namespace appear exactly as if they had been declared in the enclosing namespace.