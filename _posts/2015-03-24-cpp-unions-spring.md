---
category: C++
description: ''
tags: []
title: 'C++: union 也有春天'
---

整理自 _Thinking in C++_。

-----

## 1. A union can also have a constructor, destructor, member functions, and access control

```cpp
//: C07:UnionClass.cpp
// Unions with constructors and member functions
#include<iostream>
using namespace std;

union U {
private: // Access control too!
	int i;
	float f;
public:
	U(int a);
	U(float b);
	~U();
	int read_int();
	float read_float();
};

U::U(int a) { i = a; }
U::U(float b) { f = b;}
U::~U() { cout << "U::~U()\n"; }
int U::read_int() { return i; }
float U::read_float() { return f; }

int main() {
	U X(12), Y(1.9F);
	cout << X.read_int() << endl;
	cout << Y.read_float() << endl;
}
```

## 2. However, a union cannot be used as a base class during inheritance

我也实在想不出在怎样的场合下才需要 extend 一个 union……

## 3. untagged enum & anonymous union

```cpp
//: C07:SuperVar.cpp
// A super-variable
#include<iostream>
using namespace std;

class SuperVar {
	enum {		// Untagged enum
		character,
		integer,
		floating_point
	} vartype;	// Define a variable of this untagged enum type
	
	union {		// Anonymous union
		char c;
		int i;
		float f;
	};
	
public:
	SuperVar(char ch);
	SuperVar(int ii);
	SuperVar(float ff);
	void print();
};

SuperVar::SuperVar(char ch) {
	vartype = character;
	c = ch;
}

SuperVar::SuperVar(int ii) {
	vartype = integer;
	i = ii;
}

SuperVar::SuperVar(float ff) {
	vartype = floating_point;
	f = ff;
}

void SuperVar::print() {
	switch (vartype) {
		case character:
			cout << "character: " << c << endl;
			break;
		case integer:
			cout << "integer: " << i << endl;
			break;
		case floating_point:
			cout << "float: " << f << endl;
			break;
	}
}

int main() {
	SuperVar A('c'), B(12), C(1.44F);
	A.print();
	B.print();
	C.print();
}
```

In the code above, the `enum` has no type name (it is an **untagged enumeration**). This is acceptable if you are going to immediately define instances of the enum, as is done here. There is no need to refer to the enum’s type name in the future, so the type name is optional.

The `union` has no type name and no variable name. This is called an **anonymous union**, and creates space for the union but doesn’t require accessing the union elements with a variable name and the dot operator. 

Note that you access members of an anonymous union just as if they were ordinary variables. The only difference is that both variables occupy the same space.