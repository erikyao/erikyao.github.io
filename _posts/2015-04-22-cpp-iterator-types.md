---
layout: post
title: "C++: Iterator Types"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自：

- _Thinking in C++, Volume 2_
- [Apache C++ Standard Library User's Guide: 2.2 Varieties of Iterators](https://stdcxx.apache.org/doc/stdlibug/2-2.html)
- [&lt;iterator&gt;](http://www.cplusplus.com/reference/iterator/)
- [SGI: Iterators](http://www.sgi.com/tech/stl/Iterators.html)
- [C++ concepts: Iterator](http://en.cppreference.com/w/cpp/concept/Iterator)

-----

- **InputIterator**: 
	- Reads elements of its sequence in a single, forward pass using `operator++` and `operator*`. 
	- Can also be tested with `operator==` and `operator!=` (a.k.a _EqualityComparable_).
	- 比如: 
		- `istream_iterator`
- **OutputIterator**:
	- Writes elements to a sequence in a single, forward pass using `operator++` and `operator*`. 
	- CANNOT be tested with `operator==` and `operator!=`
	- 比如：
		- `ostream_iterator`
		- `inserter()`
		- `front_inserter()`
		- `back_inserter()`
- **ForwardIterator**:
	- Only moves forward using `operator++`, 
		- but you can both write and read, (所以 replace 操作需要 ForwardIterator) 
		- and you can compare such iterators in the same range for equality.
	- ALL standard containers support at least forward iterator types.
		- Ordinary pointers, like all iterators produced by containers in the C++ Standard Library, can be used as forward iterators.
	- 比如：
		- `vector::begin()`
- **BidirectionalIterator**: 
	- Effectively, this is a ForwardIterator that can also go backward. 
		- That is, it supports all the operations that a ForwardIterator does, 
		- but in addition it has an `operator--`. (所以 reverse_copy 操作需要 BidirectionalIterator)
	- 比如：
		- `list::begin()`
- **RandomAccessIterator**
	- This type of iterator supports all the operations that a regular pointer does: 
		- you can add and subtract integral values to move it forward and backward by jumps (rather than just one element at a time), 
		- you can subscript it with `operator[]`, 
		- you can subtract one iterator from another, 
		- and you can compare iterators to see which is greater using `operator<`, `operator>`, and so on. 
		- If you’re implementing a sorting routine or something similar, random access iterators are necessary to be able to create an efficient algorithm.
	- 比如：
		- `vector::iterator()`
		
在继承关系上我们有：

<pre class="prettyprint linenums">
struct output_iterator_tag {};

struct input_iterator_tag {};
	struct forward_iterator_tag : public input_iterator_tag {};
		struct bidirectional_iterator_tag : public forward_iterator_tag {};
			struct random_access_iterator_tag : public bidirectional_iterator_tag {};
</pre>

-----
		
最后说几个描述 class 的概念，也可以用来描述 iterator：

- _LessThanComparable_: 
	- A class that has a `operator<`.
- _Assignable_: 
	- A class that has a `operator=` for its own type.
- _EqualityComparable_: 
	- A class that has an `operator==` for its own type.

以下这两个概念应该只能用来描述 iterator：

- _Dereferenceable_: 
	- Iterator `i` for which the behavior of the expression `*i` is defined is called dereferenceable.
	- Iterators are not dereferenceable if
		- they are _past-the-end_ iterators (including pointers past the end of an array) or _before-begin_ iterators. 
			- Such iterators may be dereferenceable in a particular implementation, but the library never assumes that they are.
			- 比如 `vector::end()` 就是个 _past-the-end_ iterator，你可以对它 dereference，不会报错但是这是一个 undefined behavior
		- they are _singular_ iterators, that is, iterators that are not associated with any sequence. 
			- A null pointer, as well as a default-constructed pointer (holding an indeterminate value) is _singular_
		- they were invalidated by one of the iterator-invalidating operations on the sequence to which they refer.
- _incrementable_: 
	- Iterator `i` for which the behavior of the expression `++i` is defined is called incrementable.