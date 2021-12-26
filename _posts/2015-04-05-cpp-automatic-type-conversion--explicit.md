---
layout: post
title: "C++: Automatic type conversion / explicit"
description: ""
category: C++
tags: [copy-constructor]
---
{% include JB/setup %}

整理自：_Thinking in C++_

-----

ToC:

- [1. Constructor conversion](#1-constructor-conversion)
- [2. explicit: banning constructor conversion](#2-explicit-banning-constructor-conversion)
- [3. Operator conversion](#3-operator-conversion)
- [4. Operand Reflexivity](#4-operand-reflexivity)

## 1. Constructor conversion

直接上例子：

```cpp
#include <iostream>
using namespace std;

class T {
private:
    int i;
public:
    T(int i);
    T(const T&);
    ~T();
    int getI() const {
        return i; 
    }
    void setI(int i) {
        this->i = i;
    }
};

T::T(int i) {
	cout << "constructor: i==" << i << endl;
    cout << "constructor: this==" << this << endl;
    this->i = i;
}

T::T(const T& t) : i(t.getI()) {
    cout << "copy-constructor: &t==" << &t << endl;
    cout << "copy-constructor: this==" << this << endl;
} 

T::~T() {
    cout << "destructor: this==" << this << endl;
}

void f(T t) {
	cout << "f: t.getI()==" << t.getI() << endl;
}

int main() {
	T t1(1);
    T t2 = T(2);
	T t3 = 3;
	
	f(4);
}

// output:
/* 
	constructor: i==1
	constructor: this==0x22fe20
	constructor: i==2
	constructor: this==0x22fe10
	constructor: i==3
	constructor: this==0x22fe00
	constructor: i==4
	constructor: this==0x22fe30
	f: t.getI()==4
	destructor: this==0x22fe30
	destructor: this==0x22fe00
	destructor: this==0x22fe10
	destructor: this==0x22fe20
*/
```

* `T t1(1);` 这是最常见的用法
* `T t2 = T(2);` 这个有点像 java 的写法也是可以的，但是根据 [Explicit Call to a Constructor](http://stackoverflow.com/a/12038485)，这个写法实际会调用 copy-constructor，虽然编译器会把这个步骤优化掉（所以我们的 output 显示没有调用 copy-constructor），但是如果把 copy-constructor 标为 `private` 的话，这句其实是会报错的
* `T t3 = 3;` 这句就是通过 constructor 进行的 type conversion。lvalue 是 `T`，rvalue 是 `int`，明显不匹配，于是编译器会问：有没有 `T(int i)` ？有的话就直接帮你转了，没有的话就报错
*  `f(4);` 这句表示不光是 define 的时候可以做自动装换，传参的时候也可以做
* Creating a single-argument constructor always defines an automatic type conversion (even if it’s got more than one argument, if the rest of the arguments are defaulted).
* An example in which automatic type conversion is extremely helpful occurs with any class that encapsulates character strings.

## 2. explicit: banning constructor conversion

你觉得这个 constructor conversion 太智能了或者是影响了 type checking（至少我是这么觉得的），可以把 constructor 声明为 `explicit` 把这个功能 ban 掉。

```cpp
#include <iostream>
using namespace std;

class T {
private:
    int i;
public:
    explicit T(int i);
    T(const T&);
};

T::T(int i) {
	cout << "constructor: i==" << i << endl;
    cout << "constructor: this==" << this << endl;
    this->i = i;
}

T::T(const T& t) : i(t.getI()) {
    cout << "copy-constructor: &t==" << &t << endl;
    cout << "copy-constructor: this==" << this << endl;
} 

T::~T() {
    cout << "destructor: this==" << this << endl;
}

int main() {
	T t3 = 3; // ERROR. conversion from 'int' to non-scalar type 'T' requested
}
```

需要注意的是，copy-constructor 也可以声明为 `explicit`，只是这么做以后，所有后台隐式调用 copy-constructor 的地方（比如 pass-by-value）的地方都会报错。

## 3. Operator conversion

```cpp
#include <iostream>
using namespace std;

class T {
private:
    int i;
public:
    T(int i);
    T(const T&);
    ~T();
    int getI() const {
        return i; 
    }
    void setI(int i) {
        this->i = i;
    }
};

T::T(int i) {
	cout << "constructor: i==" << i << endl;
    cout << "constructor: this==" << this << endl;
    this->i = i;
}

T::T(const T& t) : i(t.getI()) {
    cout << "copy-constructor: &t==" << &t << endl;
    cout << "copy-constructor: this==" << this << endl;
} 

T::~T() {
    cout << "destructor: this==" << this << endl;
}

void f(T t) {
	cout << "f: t.getI()==" << t.getI() << endl;
}

class Tango {
private:
    int i;
public:
    Tango(int i) : i(i) {
    	
	}
	operator T() const {
		return T(i);
	}
};

// 如果把 operator T() 放外面实现得这么写
Tango::operator T() const {
	return T(i);
}

int main() {
	Tango tango(3);
	T t3 = tango;
	
	f(tango);
}

// output:
/* 
	constructor: i==3
	constructor: this==0x22fe10
	constructor: i==3
	constructor: this==0x22fe30
	f: t.getI()==3
	destructor: this==0x22fe30
	destructor: this==0x22fe10
*/
```

* 注意下这里的逻辑，你的转换方向是 `Tango` → `T`，所以你需要写一个 `Tango::operator T()`。如果你想像 constructor convention 的例子那样 `int` → `T`，用 operator conversion 是实现不了的，因为你没办法写 `int::operator T()`
	* 但是反过来，你要 `T` → `int`，又只能用 operator conversion `T::operator int()`，constructor convention 没办法实现
* 这个 `Tango::operator T()` 看上去很像是个 constructor，但实际是个 operator（而且也没见过 constructor 写 return 的）。但是又与一般的 operator 不一样：它没有 returnType
	* const 不是必须的
	* 这个 operator 必须用 member function 来实现，不能用 non-member friend

## 4. Operand Reflexivity

比如我们重载了 `operator+`，我们可以自然地写 `t1+t2`；再加上 automatic type conversion，我们可以进一步写 `t1+2`。但是你实现 `operator+` 的方式会限制 type conversion（这里我们并不关心 type conversion 的实现方式）。具体说来就是：

* 如果 `operator+` 是用 non-member friend 实现的，automatic type conversion may be applied to either operand，你写 `t1+2` 和 `2+t1` 都可以
* whereas with member function, the left-hand operand must already be the proper type，也就是说你只能写 `t1+2` 不能写 `2+t1`

```cpp
class Number {
    int i;
public:
    Number(int ii = 0) : i(ii) {}
    
    const Number
    operator+(const Number& n) const {
        return Number(i + n.i);
    }
    
    friend const Number
    operator-(const Number&, const Number&);
};

const Number
operator-(const Number& n1,
          const Number& n2) {
    return Number(n1.i - n2.i);
}

int main() {
    Number a(47), b(11);
    
	a + b; // OK
    a + 1; // OK. 2nd arg converted to Number
	1 + a; // ERROR. 1st arg not of type Number
    
	a - b; // OK
    a - 1; // OK. 2nd arg converted to Number
    1 - a; // OK. 1st arg converted to Number
}
```
