---
category: C++
description: ''
tags: []
title: 'C++: Standard Type Transformation Templates'
---

整理自 _C++ Primer, 5th Edition_

-----

前面在 [C++: 6 things you must know about functions](/c++/2015/05/03/cpp-things-you-must-know-about-functions#thing4) 的 Trailing Return Type 小节我们介绍了一个例子：

```cpp
// a trailing return lets us declare the return type after the parameter list is seen
template <typename It>
auto fcn(It beg, It end) -> decltype(*beg) {
	// process the range
	return *beg; // return a reference to an element from the range
}
```

现在我们有一个新的要求：如果 `decltype(*beg)` 是 reference 的话，这个函数就是 return by reference；现在我们希望把它变成 return by value，该怎么做？

这个时候就可以用 Type Transformation Template 了：

- Type Transformation Template 并没有要求只能在 template function 中使用

![](https://farm2.staticflickr.com/1611/23838059871_57765689bd_o_d.png)

具体到我们这个场景，使用 `remove_reference` 就好了，transform 之后的新类型保存在一个 public member `type` 中：

```cpp
remove_reference<decltype(*beg)>::type // value type of decltype(*beg)
```

于是上面那个例子就可以写成：

```cpp
template <typename It>
auto fcn2(It beg, It end) ->
typename remove_reference<decltype(*beg)>::type { // "typename" keyword is necessary here
	// process the range
	return *beg; // return a copy of an element from the range
}
```