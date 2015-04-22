---
layout: post
title: "C++: function object"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自：_Thinking in C++, Volumn 2_

-----

## 1. Intro

在 [C++: Generic Algorithm Examples](/c++/2015/04/21/cpp-generic-algorithm-examples/#ga2) 我们写过一个叫做 `gt15(int x)` 的函数，如果能把这个函数封装成一个对象 `Gt(15)` 明显会更灵活。这样的对象我们称为 function object，而实现的手段就是重载 `operator()`:

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
using namespace std;

class Gt {
    int than;
public:
    Gt(int than) : than(than) {}
    bool operator()(int x) { // 注意语法 
        return x &gt; than;
    }
};

int main() {
    Gt gt15(15);
    
    cout &lt;&lt; gt15(1) &lt;&lt; endl; // output: 0 (for false)
    cout &lt;&lt; gt15(20) &lt;&lt; endl; // output: 1 (for true)
}
</pre>

注意重载 `operator()` 的语法：`operator()` 表示你这个对象 `gt15` 可以当函数 `gt15()` 用；而 `operator()(int x)` 表示你这个函数是 `gt15(int x)` 形式。如果是无参函数，你要写成 `operator()()`。

我们进一步观察，其实可以把 `int than;` 变成 `template<T>`。这里我们不示范了，因为 lib 已经有写了，但是又稍微有点不同：

<pre class="prettyprint linenums">
template &lt;class T&gt; struct greater : binary_function &lt;T,T,bool&gt; {
	bool operator() (const T& x, const T& y) const {return x&gt;y;}
};
</pre>

首先它是一个 struct；然后它不像我们的 Gt 可以初始化一个参数，而且只能像 `greater<int>(15, 20)` 这样传两个参数进去才能用。这个 greater 无法直接用于 [C++: Generic Algorithm Examples](/c++/2015/04/21/cpp-generic-algorithm-examples/#ga2) 的场景，所以我们需要进一步封装：

<pre class="prettyprint linenums">
bind2nd(greater<int>(), 15));
</pre>

`bind2nd` 的意思是 "bind the 2nd parameter"，所以这一句的效果就是把 `greater<int>()` 这个 Binary Function 对象（虽然是个 struct，姑且这么称呼）变成了一个 Unary Function 对象，功能上等同于我们的 `Gt gt15(15);`。

同理还有 `bind1st`。

这样 [C++: Generic Algorithm Examples](/c++/2015/04/21/cpp-generic-algorithm-examples/#ga2) 里的例子就可以重写成：

<pre class="prettyprint linenums">
#include &lt;algorithm&gt;
#include &lt;cstddef&gt;
#include &lt;functional&gt;
#include &lt;iostream&gt;
#include &lt;iterator&gt;
using namespace std;

int main() {
    int a[] = { 10, 20, 30 };
    const size_t SIZE = sizeof a / sizeof a[0];
    
	remove_copy_if(a, a + SIZE,
                   ostream_iterator&lt;int&gt;(cout, "\n"),
                   bind2nd(greater&lt;int&gt;(), 15));
    // output: 10
}
</pre>

## 2. Classification of function objects

- **Generator**: Takes no arguments. The standard library provides one generator, the function `rand()` declared in `<cstdlib>`, and has some algorithms, such as `generate_n()`, which apply generators to a sequence.
- **Unary Function**: Takes a single argument. ReturnType includes `void`.
- **Binary Function**: Takes two arguments. ReturnType includes `void`.
- **Unary Predicate**: A Unary Function that returns a bool.
- **Binary Predicate**: A Binary Function that returns a bool.
- **Strict Weak Ordering**: A binary predicate that allows for a more general interpretation of “equality.” Some of the standard containers consider two elements equivalent if neither is less than the other (using `operator<`). This is important when comparing floating-point values, and objects of other types where `operator==` is unreliable or unavailable. This notion also applies if you want to sort a sequence of data records (structs) on a subset of the struct’s fields. That comparison scheme is considered a strict weak ordering because two records with equal keys are not really “equal” as total objects, but they are equal as far as the comparison you’re using is concerned. 

## 3. Standard function objects

| Name          | Type            | Result produced                |
|---------------|-----------------|--------------------------------|
| plus          | BinaryFunction  | arg1 + arg2                    |
| minus         | BinaryFunction  | arg1 - arg2                    |
| multiplies    | BinaryFunction  | arg1 * arg2                    |
| divides       | BinaryFunction  | arg1 / arg2                    |
| modulus       | BinaryFunction  | arg1 % arg2                    |
| negate        | UnaryFunction   | -arg1                          |
| equal_to      | BinaryPredicate | arg1 == arg2                   |
| not_equal_to  | BinaryPredicate | arg1 != arg2                   |
| greater       | BinaryPredicate | arg1 > arg2                    |
| less          | BinaryPredicate | arg1 < arg2                    |
| greater_equal | BinaryPredicate | arg1 >= arg2                   |
| less_equal    | BinaryPredicate | arg1 <= arg2                   |
| logical_and   | BinaryPredicate | arg1 && arg2                   |
| Logical_or    | BinaryPredicate | arg1 || arg2                   |
| logical_not   | UnaryPredicate  | !arg1                          |
| unary_negate  | Unary Logical   | !(UnaryPredicate(arg1))        |
| binary_negate | Binary Logical  | !(BinaryPredicate(arg1, arg2)) |

## 4. Function object adaptors

比如前面提到的 `bind1st` 和 `bind2nd` 都是 function object adaptors。

此外还有一个 `not1`, which takes a unary function object as a parameter and invert its truth value. 比如 `not1(bind1st(equal_to<int>(), 20))` 的作用就是 `bind1st(not_equal_to<int>(), 20)`。

需要注意的是，`gt15` 这样的 function name 在 `remove_copy_if` 操作中和 function object 起到的作用是一样的，但是 function name 不能用于 `bind1st` 和 `bind2nd`，这个时候你需要 `ptr_fun()` adaptor, which take a pointer to a function and turn it into a function object. `ptr_fun()` is not designed for a function that takes no arguments—they must only be used with unary functions or binary functions.

- `ptr_fun<class Arg, class Result>(funcName)` for unary functions
- `ptr_fun<class Arg1, class Arg2, class Result>(funcName)` for binary functions

## 5. Member function object adaptor

<pre class="prettyprint linenums">
#include &lt;algorithm&gt;
#include &lt;functional&gt;
#include &lt;iostream&gt;
#include &lt;vector&gt;
using namespace std;

class Shape {
public:
    virtual void draw() = 0;
    virtual ~Shape() {}
};

class Circle : public Shape {
private:
	int id; 
public:
	Circle(int id) : Shape(), id(id) {
		
	}
public:
    void draw() {
        cout &lt;&lt; "Circle." &lt;&lt; id &lt;&lt; "::Draw()" &lt;&lt; endl;
    }
    ~Circle() {
		
    }
};

class Square : public Shape {
private:
	int id; 
public:
	Square(int id) : Shape(), id(id) {
		
	}
    void draw() {
        cout &lt;&lt; "Square." &lt;&lt; id &lt;&lt; "::Draw()" &lt;&lt; endl;
    }
    ~Square() {
		
    }
};

int main() {
    vector&lt;Shape*&gt; shapeVec;
    shapeVec.push_back(new Circle(1));
    shapeVec.push_back(new Square(1));
    
	for_each(shapeVec.begin(), shapeVec.end(), mem_fun(&Shape::draw));
    for (Shape* ps : shapeVec) { // for-each loop is supported in C++11
    	delete ps;
	}
	
	// vector&lt;Shape&gt; shapeVec2; // ERROR: C++ 中不允许建立 abstract class 的 vector，只能像上面用指针 
	vector&lt;Circle&gt; circleVec;
	Circle c2(2), c3(3);
	circleVec.push_back(c2);
    circleVec.push_back(c3);
    
    for_each(circleVec.begin(), circleVec.end(), mem_fun_ref(&Shape::draw));
}


// output:
/*
	Circle.1::Draw()
	Square.1::Draw()
	Circle.2::Draw()
	Circle.3::Draw()
*/
</pre>

简单说就是 `mem_fun` 在遍历 object pointer `po` 时调用 `po->func()`，而 `mem_fun_ref` 是在遍历 object reference `ro` 时调用 `ro.func()`。

我觉得 for_each + mem_fun 的这个用法在 C++11 支持 for-each loop 后应该就没有啥市场了…… 

下面再举个 find_if + mem_fun 的例子：

<pre class="prettyprint linenums">
typedef vector<string>::iterator StrVecIterator;

vector<string> vs;
...
StrVecIterator svi = find_if(vs.begin(), vs.end(), mem_fun_ref(&string::empty));
if (svi != vs.end()) {
	...
}
</pre>