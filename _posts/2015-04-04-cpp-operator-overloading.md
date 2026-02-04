---
category: C++
description: ''
tags: []
title: 'C++: Operator Overloading'
toc: true
toc_sticky: true
---

整理自：_Thinking in C++_

[Basic_guidelines]: https://live.staticflickr.com/1528/23838060001_4db2a0b41d_z.jpg

-----

# 1. Intro

书上一开头就说了：Operator overloading is just “syntactic sugar,” which means it is simply another way for you to make a function call. 和我想得一样。You have no reason to overload an operator except if it will make the code involving your class easier to write and especially easier to read.

All the operators used in expressions that contain only built-in data types cannot be changed. Only an expression containing a user-defined type can have an overloaded operator.

Defining an overloaded operator is like defining a function, but the name of that function is `operator@`, in which `@` represents the operator that’s being overloaded. 

The number of arguments in the overloaded operator’s argument list depends on whether the operator is defined as:

* a global function
	* one argument for unary
	* two for binary 
* or a member function
	* zero arguments for unary
	* one for binary
		* the object becomes the left-hand argument
	
```cpp
#include <iostream>
using namespace std;

class Integer {
    int i;
public:
    Integer(int ii) : i(ii) {}
    
    int getValue() const {
		return i;
	}
    
	const Integer
    operator+(const Integer& rv) const {
        return Integer(i + rv.i);
    }
    
	Integer&
    operator+=(const Integer& rv) {
        i += rv.i;
        return *this;
    }
};

int main() {
    Integer ii(1), jj(2), kk = ii+jj;
    
    cout << "kk==" << kk.getValue() << endl;
    
    kk += ii;
    cout << "kk==" << kk.getValue() << endl;
}

// output:
/*
	kk==3
	kk==4
*/
```

另外需要注意的是，operator 可以像函数一样直接调用，比如：

```cpp
int main() {
    Integer ii(1), jj(2);
	
	Integer kk = ii.operator+(jj); // 等价于 Integer kk = ii+jj;
}
```

# 2. Overloadable operators

- You cannot combine operators that currently have no meaning in C.
- You cannot change the evaluation precedence of operators.
- You cannot change the number of arguments required by an operator

## 2.1 Examples

P536~P540 针对 overloadable unary operators 给了两个非常完整的例子，一个是用 global functions (non-member friend functions) 的写法，一个是用 member functions 的写法。

需要注意的是 `a++` 和 `++a` 这两个 operator 的区分（`a--` 和 `--a` 同理）：

* `++a` (pre-increment) 对应的而是 `operator++(a)`
	* 如果是 member function 就是 `a.operator++()`
* `a++` (post-increment) 对应的是 `operator++(a, int)`
	* 如果是 member function 就是 `a.operator++(int)`
	* 但是后面这个 int 完全用不上，完全是用来区分签名用的

给个例子：

```cpp
// Prefix; return incremented value
// ++a
const Integer& operator++(Integer& a) {
	a.i++;
	return a;
}

// Postfix; return the value before increment
// a++
const Integer operator++(Integer& a, int) {
	Integer before(a.i);
	a.i++;
	return before;
}
```

P541~P552 给的是 overloadable binary operators 的例子，也是一个用 global functions (non-member friend functions) 的写法，一个用 member functions 的写法。需要注意的是：

* 对 `operator=` 的实现最好做一下 self-assignment check，因为对 `A=A;` 这样的语句其实没必要做任何操作，直接 `return *this;` 就好了
* `operator=` 只能用 member function 的写法实现

## 2.2 Arguments & return values

* 如果是返回一个新 object，那么 returnType 就写 `T` 或者 `const T`
* 如果是把参数 object 修改一下再返回去，那么 returnType 就写 `T&` 或者 `const T&`
* returnType 是否要定成 `const` 要看你的需求
	* 书上给的一个说法是：The return value for all of the assignment operators (`=`, `+=`, `*=` 这些) should be a non-const reference to the lvalue.
	* 因为要支持 `(a=b).func();` 这样的写法，如果定成了 const 就只能 call const member function 了
	* 同时还要考虑到 temporaries
	* 如果没有类似的需求 returnType 就用 const 好了
* 参数一般是 `T&`，根据参数值是否发生变化酌情添加 const

## 2.3 Unusual operators

- Subscript operator, `operator[]`, must be a member function and it requires a single argument.
- Comma operator, `operator,`, 很少有需要重载这个的……
- Pointer dereference operator, `operator->`, especially useful if you want to “wrap” a class around a pointer to make that pointer safe, or in the common usage of an iterator
	- A pointer dereference operator must be a member function. 
	- `operator->` 的语法非常奇怪，它竟然是一个 unary！所以 `p->a` 实际上应该理解为 `(p->)a`……
	- `operator->` 的 returnType，i.e. `p->` 的 type 必须满足：
		- It must return an object (or reference to an object) that also has a pointer dereference operator, 
		- or it must return a pointer that can be used to select what the pointer dereference operator arrow is pointing at.
	- 需要的时候再看看书吧……看这个帖子也行：[Overloading member access operators ->, .* (C++)](http://stackoverflow.com/questions/8777845/overloading-member-access-operators-c)
	- 暂时没必要考虑 `operator->` 的逻辑，书上也说了 the underlying mechanics of the pointer dereference operator are more complex than the other operators，背后肯定有一些编译器の魔法……
- Pointer-to-member dereference operator, `operator–>*`, is a binary operator
	- It must return an object for which the `operator()` can be called with the arguments for the member function you’re calling.
- Function call operator, `operator()`, must be a member function, and it is unique in that it allows any number of arguments.

## 2.4 Operators you can’t overload

- Member selection operator, `operator.`
- Pointer-to-member dereference operator, `operator.*`

# 3. Member function or not

方便起见，用 global functions (non-member friend functions) 实现的 operator 我们起名 non-member operator；用 member functions 实现的 operator 我们起名 member operator。

因为 member operator 总是默认把 `*this` 当做 left-hand operand，如果我们想把 `*this` 当做 right-hand operand，就只能用 non-member operator，比如：

```cpp
class IntArray {
	friend ostream&
	operator<<(ostream& os, const IntArray& ia); 	// overload cout<<IntArray
	friend istream&
	operator>>(istream& is, IntArray& ia);		// overload cin>>IntArray
};
```

除了这一点外，书上给了个 basic guidelines：

![][Basic_guidelines]

至于为什么 `operator=` 必须是 member function，stackoverflow 上[有一个解释](http://stackoverflow.com/a/3933864)，大意是说：`operator=` 就像 constructor 一样，系统会默认给你生成一个，而且是 member function 的形式，我们记为 opA。如果你再写一个 non-member 的 `operator=` 的话——我们记为 opB——那么在 opB 的代码之前，`operator=` 执行的是 opA 的逻辑，opB 的代码之后，`operator=` 执行的是 opB 的逻辑。Bjarne 觉得自己无法接受这一点，于是就强制 `operator=` 必须是 member function。

其他几个标记为 "must be member" 的 operator 应该也是相同的道理。

顺便说一下这个系统自带的 `operator=` 行为上非常像系统自带的 copy-constructor，遇到复杂对象时也会逐一调用各个 member 的 `operator=`。