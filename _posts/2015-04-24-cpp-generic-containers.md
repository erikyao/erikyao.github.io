---
layout: post
title: "C++: Generic Containers"
description: ""
category: C++
tags: [Cpp-101, C++11]
---
{% include JB/setup %}

整理自：_Thinking in C++, Volume 2_ & _C++ Primer, 5th Edition_

-----

## 1. Categories

The containers and their categories are summarized in the following table:

| Category               | Containers                                |
|------------------------|-------------------------------------------|
| Sequence Containers    | vector, list, deque, forward_list, array  |
| Container Adaptors     | queue, stack, priority_queue              |
| Associative Containers | set, map, multiset, multimap, unordered_x |

## 2. The basic sequences: vector, list, deque

- A **vector** is a linear sequence that allows rapid random access to its elements. However, it’s expensive to insert an element in the middle. 
	- 应该可以类比成 java 的 ArrayList
- A **deque** (double-ended-queue, pronounced “deck”) also allows random access that’s nearly as fast as **vector**, but it’s significantly faster when it needs to allocate new storage, and you can easily add new elements at the front as well as the back of the sequence. 
	- Does not keep everything in a single sequential block of memory like **vector**s. Instead, a typical implementation of **deque** uses multiple blocks of sequential storage (keeping track of all the blocks and their order in a mapping structure). For this reason, the overhead for a **deque** to add or remove elements at either end is low. 
	- In addition, it never needs to copy and destroy contained objects during a new storage allocation (like **vector** does), so it is far more efficient than **vector** if you are adding an unknown quantity of objects at either end. This means that **vector** is the best choice only if you have a good idea of how many objects you need. 
- A **list** is a doubly linked list, so it’s expensive to move around randomly but cheap to insert an element anywhere.
	- With a **vector** or **deque**, it is possible to use the indexing `operator[]`, but that doesn’t work with **list**.
- A **forward_list** is a singly linked list.
	- Introducced by C++11. 
	- Does not have the size operation.
- An **array** is a safer, easier-to-use alternative to built-in arrays. 
	- Introducced by C++11. 
	- Like built-in arrays, library **array**s have fixed size. As a result, **array** does not support operations to add and remove elements or to resize the container.
	- `array<string, 10>` is an array that holds 10 strings.
	- Although we cannot copy or assign objects of built-in array types, there is no such restriction on **array**.
	
<pre class="prettyprint linenums">
typedef std::vector&lt;Shape*&gt; Container;
typedef Container::iterator Iter;

Container shapes;
shapes.push_back(new Circle);
shapes.push_back(new Square);
shapes.push_back(new Triangle);

// DO NOT use "i &lt; shapes.end()" or "i &lt;= shapes.end()"
for(Iter i = shapes.begin(); i != shapes.end(); i++) 
	(*i)-&gt;draw(); // 注意 *i 得到的是 pointer
	
for(Iter j = shapes.begin(); j != shapes.end(); j++)
	delete *j;
</pre>

### Digress: Holding bits

`bitset` and `vector<bool>` are both designed to manipulate a group of on-off (0-1) values. The primary differences between these types are:

- Each `bitset` holds a fixed number of bits. The `vector<bool>` can, like a regular vector, expand dynamically to hold any number of bool values.
	- `bitset` is not a STL container. It has no iterators. 
	- The number of bits, being a template parameter, is known at compile time. 比如 `bitset<16>`。
- The `bitset` template is explicitly designed for performance when manipulating bits.

### Digress: valarray

- `valarray` template class is a vector-like container that is optimized for efficient numeric computation. 
- It has no iterators. 
- Although you can instantiate a valarray with nonnumeric types, it has mathematical functions that are intended to operate with numeric data, such as sin, cos, tan, and so on.
- A `slice` object can be used to fetch subsets of a `valarray`.
	- A slice object takes three arguments: the starting index, the number of elements to extract, and the “stride,” which is the gap between elements of interest.
	
### Rules of thumb

- Unless you have a reason to use another container, use a **vector**.
- If your program has lots of small elements and space overhead matters, don’t use **list** or **forward_list**.
- If the program requires random access to elements, use a **vector** or a **deque**.
- If the program needs to insert or delete elements in the middle of the container, use a **list** or **forward_list**.
- If the program needs to insert or delete elements at the front and the back, but not in the middle, use a **deque**.
- If the program needs to insert elements in the middle of the container only while reading input, and subsequently needs random access to the elements:
	* First, decide whether you actually need to add elements in the middle of a container. It is often easier to append to a **vector** and then call the library `sort` function to reorder the container when you’re done with input.
	* If you must insert into the middle, consider using a **list** for the input phase. Once the input is complete, copy the **list** into a **vector**.

## 3. Container adaptors: queue, stack, priority_queue

Container adaptors adapt one of the basic sequence containers to store their data. In most cases you won’t need to concern yourself with the underlying implementation.

### 3.1 Stack

<pre class="prettyprint linenums">
stack&lt;string&gt; strStack1; 					// Default implementation with deque&lt;string&gt;
stack&lt;string, vector&lt;string&gt;&gt; strStack2;	// implementation with vector&lt;string&gt;
stack&lt;string, list&lt;string&gt;&gt; strStack3;		// implementation with list&lt;string&gt;

while(!strStack1.empty()) {
	cout &lt;&lt; strStack1.top();
	strStack1.pop();
	// top 与 pop 操作分工明确；pop 并不返回 top 值
}
</pre>

You cannot iterate through a **stack**; this emphasizes that you only want to perform stack operations when you create a **stack** because actually you can get equivalent “stack” functionality using a **vector** and its `back()`, `push_back()`, and `pop_back()` member functions.

### 3.2 Queue

A **queue** uses a first-in, first-out (FIFO) storage and retrieval policy. Objects entering the queue are placed in the back and objects leaving the queue are removed from the front.

The **queue** container is a restricted form of a **deque**. Functionally, you could use a **deque** anywhere you need a **queue**.

### 3.3 Priority queues

When you `push()` an object onto a **priority_queue**, that object is sorted into the queue according to a comparison function or function object. (You can allow the default `less` template to supply this, or you can provide one of your own.) The **priority_queue** ensures that when you look at the `top()` element, it will be the one with the highest priority.

<pre class="prettyprint linenums">
#include &lt;cstdlib&gt;
#include &lt;ctime&gt;
#include &lt;iostream&gt;
#include &lt;queue&gt;
using namespace std;

int main() {
    priority_queue&lt;int&gt; pqi;
    
	srand(time(0)); // Seed the random number generator
    for(int i = 0; i &lt; 10; i++)
        pqi.push(rand() % 7);
    
	while(!pqi.empty()) {
        cout &lt;&lt; pqi.top() &lt;&lt; ' ';
        pqi.pop();
    }
    // output: 6 5 4 3 3 3 2 1 1 0
}
</pre>

<pre class="prettyprint linenums">
// implementation with vector&lt;int&gt;
// use greater&lt;int&gt; to sort
priority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt; pqi;
</pre>

You cannot iterate through a **priority_queue**, but it’s possible to simulate the behavior of a **priority_queue** using a **vector**.

The implementation of **priority_queue** uses `make_heap()`, `push_heap()`, and `pop_heap()`. In fact you could say that **priority_queue** is just a wrapper around heap.

## 4. Associative containers

The **set**, **map**, **multiset**, and **multimap** are called associative containers because they associate keys with values.

**Set**’s primary job description is to hold only unique elements in sorted order
	
- 自带排序效果，无需手动操作。
- Its `find()` member function has logarithmic complexity and so is much faster than the generic `find()` algorithm. (联系 hashset)

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
#include &lt;set&gt;
using namespace std;

int main() {
    set&lt;int&gt; iset;
    iset.insert(1);
    iset.insert(3);
    iset.insert(2);
    
    for(set&lt;int&gt;::iterator i = iset.begin(); i != iset.end(); ++i) {
    	cout &lt;&lt; *i &lt;&lt; endl;
	}
	
	for(const int& i : iset) { // C++11 syntax
		cout &lt;&lt; i &lt;&lt; endl;
	}
}
</pre>

A **multimap** is a **map** that can contain duplicate keys.

A **multiset** allows more than one object of each value to be inserted. 

- Like any STL container that must order its elements, the **multiset** template uses the `less` function object by default to determine element ordering. This uses the contained class’s `operator<`, but you can always substitute your own comparison function.
- 因为 **multiset** 也是自动排序的，所以 A **multiset** requires that all duplicate elements be adjacent to each other.

**unordered_set**, **unordered_map**, **unordered_multiset**, and **unordered_multimap** 全部是基于 hash 的，**unordered_map** 应该就等同于 java 的 HashMap。但是有时候需要你自己提供一个 hash 函数。

## 5. Memorandum

- All the containers in the standard library hold copies of the objects you place in them, so your objects must be copy-constructible (have an accessible copy constructor) and assignable (have an accessible assignment operator).
- If the container is const, `begin()` and `end()` produce const iterators, which disallow changing the elements pointed to (because the appropriate operators are const).
- All standard containers support bidirectional iteration.
- A reversible container has the member functions `rbegin()` (to produce a `reverse_iterator` selecting the end) and `rend()` (to produce a `reverse_iterator` indicating “one past the beginning”).
- All the containers except the unordered associative containers also support the relational operators (>, >=, <, <=). The right- and left-hand operands must be the same kind of container and must hold elements of the same type.
	- Appropriate comparison operatos must be defined for the element type.

<pre class="prettyprint linenums">
vector&lt;int&gt; v1 = { 1, 3, 5, 7, 9, 12 };
vector&lt;int&gt; v2 = { 1, 3, 9 };
vector&lt;int&gt; v3 = { 1, 3, 5, 7 };
vector&lt;int&gt; v4 = { 1, 3, 5, 7, 9, 12 };

v1 &lt; v2 // true; v1 and v2 differ at element [2]: v1[2] is less than v2[2]
v1 &lt; v3 // false; all elements are equal, but v3 has fewer of them;
v1 == v4 // true; each element is equal and v1 and v4 have the same size()
v1 == v2 // false; v2 has fewer elements than v1
</pre>