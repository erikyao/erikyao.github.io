---
category: C++
description: ''
tags:
- template
title: 'C++: <i>typename</i> & <i>template</i>'
---

## typename

Put simply, 当你在 `template<class T>` 的内部需要使用 `T` 的内部类时，需要使用 `typename`，比如：

```cpp
template <class T>
void foo() {
	typename T::Iterator * iter; 	// Iterator 是 T 的内部类
	int size = T::DEFAULT_SIZE;		// DEFAULT_SIZE 是 T 的 static member
}
```

其实主要就是为了区分 T 内部类和 T 的 static member。

这篇 [A Description of the C++ typename keyword](http://pages.cs.wisc.edu/~driscoll/typename.html) 写得非常工整和详细，简单说就是：

- `std::cout` 这样的 "全称" 我们称为 qualified name，意思是不受 scope 约束的 name
	- qualified:
		- Meeting the standards, requirements, and training for a position.
			- She is highly qualified for the job.
			- I'm not qualified to give you advice about what you should do.
		- Restricted or limited by conditions.
			- Assuming that I have all the information, my qualified opinion is that your plan will work.
			- She gave a qualified yes to the question.
- 在 `template<class T>` 内部，`T` 是 dependent type，因为 depends on a template parameter。不需要 parameter 指定的 type 称为 independent type
- Before a qualified dependent type, you need `typename`.

另外还有个额外的用法，就是 `template<typename T>` 等价于 `template<class T>`，从语义上说 typename 这个用词更准确。

## template

_Thinking in C++, Volume 2_ 书上的那个例子并不直观，还是 [Where and why do I have to put the “template” and “typename” keywords?](http://stackoverflow.com/a/613132) 这个帖子的例子举得好：

```cpp
boost::function<int()> f;
```

这是 boost 库的一个 template，注意 `int()` 这里其实是一个 function 签名，并不是调用 int 构造器。

同样地，我们还可以写：

```cpp
namespace boost { int function = 0; }
int main() { 
	int f = 0;
	boost::function<int()> f; 
}
```

最后一句的 `int()` 这里就会被解析为一个 int 构造器，所以这句就等价于 `0 <0> 1`，变成了一个合法的表达式！

实际应用中，如果编译器确定 `boost::function` 是一个 template 的话，它其实是不会犯错的，因为：

> After name lookup finds that a name is a template-name, if this name is followed by a `<`, the `<` is always taken as the beginning of a template-argument-list and never as a name followed by the less-than operator

但是如果编译器不知道呢？（我猜一种可能的情形是：比如 template name 和某个变量同名？）这时我们就需要用 `template` 来指明 "这里是一个 template"。（这完全是将设计缺陷转嫁给消费者的行为！）

这种用法的 `template` 关键字只能出现在 after a `::`, or after a `->` or `.` in a class member access，比如：

```cpp
t::template f<int>();		// call a function template
this->template f<int>();	// call a function template
```