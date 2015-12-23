---
layout: post
title: "C++: Copy-constructor &amp; the return value on the stack"
description: ""
category: C++
tags: [Cpp-101, copy-constructor]
---
{% include JB/setup %}

整理自：

- _Thinking in C++_
- [LearnCpp: 7.9 — The stack and the heap](http://www.learncpp.com/cpp-tutorial/79-the-stack-and-the-heap/)

[function_frame_1]: https://farm2.staticflickr.com/1608/23894467526_f92a9b7358_o_d.png
[function_frame_2]: https://farm6.staticflickr.com/5790/23293776353_b73a3a58b8_o_d.png
[function_frame_3]: https://farm2.staticflickr.com/1523/23920546245_3901a22e4c_o_d.png

-----

## 1. copy-constructor 你能想到的最常见的用法就是 copy-by-value 时 copy 参数

类似于 java 的 `obj.clone();` 的感觉，copy-constructor 的作用也是生成一个原对象的 copy，而且 copy-constructor 是 class 默认会提供的（就像默认构造器一样，也有一个默认 copy-constructor）。

_~~~~~~~~~~ 2015-05-14 补充；来自 C++ Primer, 5th Edition ~~~~~~~~~~_

Copy initialization happens when we 

- Define variables using an `=`, e.g.
	- `string s2 = s1;`
	- `string null_book = "9-999-99999-9";`
	- `string nines = string(100, '9');`
- Pass an object as an argument to a parameter of nonreference type
- Return an object from a function that has a nonreference return type
- Brace initialize the elements in an array or the members of an aggregate class
- Call `insert()` or `push()` on some library containers
	- By contrast, elements created by `emplace()` are direct initialized.
	
_~~~~~~~~~~ 2015-05-14 补充完毕 ~~~~~~~~~~_

下面我们通过一个实验来展开。

## 2. 大实验一

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
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
	this->i = i;
}

T::T(const T& t) : i(t.getI()) {
	cout &lt;&lt; "copy-constructor: &t==" &lt;&lt; &t &lt;&lt; endl;
	cout &lt;&lt; "copy-constructor: this==" &lt;&lt; this &lt;&lt; endl;
} 

T::~T() {
	cout &lt;&lt; "destructor: this==" &lt;&lt; this &lt;&lt; endl;
}

T foo(T t) {
	t.setI(47);
	cout &lt;&lt; "foo: &t==" &lt;&lt; &t &lt;&lt; endl;
	return t;
}

int main() {
	T t1(5);
	
	cout &lt;&lt; "main: &t1==" &lt;&lt; &t1 &lt;&lt; endl;
	
	T t2 = foo(t1);
	
	cout &lt;&lt; "main: &t1==" &lt;&lt; &t1 &lt;&lt; endl;
	cout &lt;&lt; "main: &t2==" &lt;&lt; &t2 &lt;&lt; endl;
	
	cout &lt;&lt; "main: t1.i==" &lt;&lt; t1.getI() &lt;&lt; endl;
	cout &lt;&lt; "main: t2.i==" &lt;&lt; t2.getI() &lt;&lt; endl;
}
</pre>

output: (序号是我自己加的)
 
**(01) main: &t1==<font color="red">0x22fe20</font>**  
**(02) copy-constructor: &t==<font color="red">0x22fe20</font>**  
**(03) copy-constructor: this==<font color="blue">0x22fe30</font>**  
**(04) foo: &t==<font color="blue">0x22fe30</font>**  
**(05) copy-constructor: &t==<font color="blue">0x22fe30</font>**  
**(06) copy-constructor: this==<font color="green">0x22fe10</font>**  
**(07) destructor: this==<font color="blue">0x22fe30</font>**  
**(08) main: &t1==<font color="red">0x22fe20</font>**  
**(09) main: &t2==<font color="green">0x22fe10</font>**  
**(10) main: t1.i==5**  
**(11) main: t2.i==47**  
**(12) destructor: this==<font color="green">0x22fe10</font>**  
**(13) destructor: this==<font color="red">0x22fe20</font>**  


1. 注意 copy-constructor 的写法，参数必须是 `const T&`
1. class 默认会带一个 copy-constructor，而且会保证 copy member 的值（我们称为 bitcopy，i.e. copy every bit）；如果自己写一个 copy-constructor，必须手动 copy member，比如上面的 `T::T(const T& t) : i(t.getI()) {...}`，如果不写这个 constructor initializer list `i(t.getI())`，那么 output **(11)** 处 `t2.i` 的值就是随机（比如我碰到过 1 和 -1）
1. 我们来详细解读一下这个 ouput：
	- **(01)**: `t1` 的地址，没啥好说的
	- **(02)(03)**: `t1` 传入了 `foo(t)`，要 copy 参数 `t1`，于是调用 copy-constructor
		- 从 **(02)** 看出，给 copy-constructor 的 `const T&` 参数传的是 `t1`（和 **(01)** 的地址相同）
		- **(03)** 是新生成的参数 copy （下称 `t1_copy`）的地址，明显与 `t1` 的不同，所以这是两个 object
	- **(04)**: `foo()` 函数内 cout，输出的是 `t1_copy` 的地址（和 **(03)** 的地址相同）
	- **(05)(06)**: 这个很有意思，其实是 return 语句触发的 copy-constructor。因为 `t1_copy` 在 argument 区，return 后会被销毁，所以 return 之前先 copy 一份到 argument 区之外。这部分后面会详述。
		- 从 **(05)** 看出，这里给 copy-constructor 的 `const T&` 参数传的是 `t1_copy`（和 **(03)(04)** 的地址相同）
		- **(06)**: 这个地址就是 return 值的地址
	- **(07)**: `t1_copy` 销毁（和 **(03)(04)(05)** 的地址相同）
	- **(08)**: `foo()` 之后再次输出 `t1` 的地址，没变（和 **(01)** 一样）
	- **(09)**: `foo()` 之后输出 `t2` 的地址，发现与 return 值的地址相同（和 **(06)** 一样）
	- **(10)(11)**: 输出 i 值，和我们预想的一致
	- **(12)(13)**: `t1` 和 `t2` 销毁，接下来 `main` return

## 3. Return value on the stack

书上从 P503 开始就在讲函数调用时 stack 的情况，讲了 stack 运作规则的设计考虑了 Re-entrancy、ISR、recursion 等因素。但是其实还是 [LearnCpp: 7.9 — The stack and the heap](http://www.learncpp.com/cpp-tutorial/79-the-stack-and-the-heap/) 说得干脆：

> Here is the sequence of steps that takes place when a function is called:  
> <br/>
> 1. The address of the instruction beyond the function call is pushed onto the stack. This is how the CPU remembers where to go after the function returns.  
> 2. Room is made on the stack for the function’s return type. This is just a **placeholder** for now.  
> 3. The CPU jumps to the function’s code.  
> 4. The current top of the stack is held in a special pointer called the **stack frame**. Everything added to the stack after this point is considered “local” to the function.  
> 5. All function arguments are placed on the stack.  
> 6. The instructions inside of the function begin executing.  
> 7. Local variables are pushed onto the stack as they are defined.  
> <br/>
> When the function terminates, the following steps happen:  
> <br/>
> 1. The function’s return value is copied into the placeholder that was put on the stack for this purpose.  
> 2. Everything after the stack frame pointer is popped off. This destroys all local variables and arguments.  
> 3. The return value is popped off the stack and is assigned as the value of the function. If the value of the function isn’t assigned to anything, no assignment takes place, and the value is lost.  
> 4. The address of the next instruction to execute is popped off the stack, and the CPU resumes execution at that instruction.  

结合书上 P503 的图和 "The answer is to push the address of the return value’s destination on the stack as one of the function arguments" 这句话，以及后续的实验，可以得到一个简略的 function frame 结构（区域划分基本正确，但是细节上与实验的观察结果不是完全吻合，下面实验会超详细展开）：

![][function_frame_1]

另外 [LearnCpp: 7.9 — The stack and the heap](http://www.learncpp.com/cpp-tutorial/79-the-stack-and-the-heap/) 的内容有一点要强调下，那就是 "The function’s return value is copied into the placeholder." 不一定每次都会发生，从下面实验的结果来看，如果是 return an argument 就有 copy，如果是 return a local variable 就没有 copy，因为 compiler 会非常机智地把要 return 的 local variable 直接分配到 return value placeholder 上。

## 4. 大实验二

先看 return an argument 的情况：

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
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
	this->i = i;
}

T::T(const T& t) : i(t.getI()) {
	cout &lt;&lt; "copy-constructor: &t==" &lt;&lt; &t &lt;&lt; endl;
	cout &lt;&lt; "copy-constructor: this==" &lt;&lt; this &lt;&lt; endl;
} 

T::~T() {
	cout &lt;&lt; "destructor: this==" &lt;&lt; this &lt;&lt; endl;
}

T foo(T t1, T t2, T t3) {
	
	cout &lt;&lt; "foo: &t1==" &lt;&lt; &t1 &lt;&lt; endl;
	cout &lt;&lt; "foo: &t2==" &lt;&lt; &t2 &lt;&lt; endl;
	cout &lt;&lt; "foo: &t3==" &lt;&lt; &t3 &lt;&lt; endl;

	T newT1(47);
	T newT2(48);
	T newT3(49);
	
	cout &lt;&lt; "foo: &newT1==" &lt;&lt; &newT1 &lt;&lt; endl;
	cout &lt;&lt; "foo: &newT2==" &lt;&lt; &newT2 &lt;&lt; endl;
	cout &lt;&lt; "foo: &newT3==" &lt;&lt; &newT3 &lt;&lt; endl;
	
	return t2; // 返回一个 argument
}

T bar(T t1, T t2, T t3) {
	
	cout &lt;&lt; "foo: &t1==" &lt;&lt; &t1 &lt;&lt; endl;
	cout &lt;&lt; "foo: &t2==" &lt;&lt; &t2 &lt;&lt; endl;
	cout &lt;&lt; "foo: &t3==" &lt;&lt; &t3 &lt;&lt; endl;

	T newT1(47);
	T newT2(48);
	T newT3(49);
	
	cout &lt;&lt; "foo: &newT1==" &lt;&lt; &newT1 &lt;&lt; endl;
	cout &lt;&lt; "foo: &newT2==" &lt;&lt; &newT2 &lt;&lt; endl;
	cout &lt;&lt; "foo: &newT3==" &lt;&lt; &newT3 &lt;&lt; endl;
	
	return newT2; // 返回一个 local variable
}

int main() {
	T t1(5), t2(6), t3(7), t4(8);
	
	cout &lt;&lt; "main: &t1==" &lt;&lt; &t1 &lt;&lt; endl;
	cout &lt;&lt; "main: &t2==" &lt;&lt; &t2 &lt;&lt; endl;
	cout &lt;&lt; "main: &t3==" &lt;&lt; &t3 &lt;&lt; endl;
	cout &lt;&lt; "main: &t4==" &lt;&lt; &t4 &lt;&lt; endl;
	
	T t123 = foo(t1, t2, t3);
	//T t123 = bar(t1, t2, t3);
	
	cout &lt;&lt; "main: &t123==" &lt;&lt; &t123 &lt;&lt; endl;
}
</pre>

output: (序号是我自己加的；配色与之前不同，这里同组的 variable 标为相同的颜色)

**(01) main: &t1==<font color="red">0x22fe00</font>**  
**(02) main: &t2==<font color="red">0x22fdf0</font>**  
**(03) main: &t3==<font color="red">0x22fde0</font>**  
**(04) main: &t4==<font color="purple">0x22fdd0</font>**  
**(05) copy-constructor: &t==<font color="red">0x22fde0</font>**  
**(06) copy-constructor: this==<font color="blue">0x22fe10</font>**  
**(07) copy-constructor: &t==<font color="red">0x22fdf0</font>**  
**(08) copy-constructor: this==<font color="blue">0x22fe20</font>**  
**(09) copy-constructor: &t==<font color="red">0x22fe00</font>**  
**(10) copy-constructor: this==<font color="blue">0x22fe30</font>**  
**(11) foo: &t1==<font color="blue">0x22fe30</font>**  
**(12) foo: &t2==<font color="blue">0x22fe20</font>**  
**(13) foo: &t3==<font color="blue">0x22fe10</font>**  
**(14) foo: &newT1==<font color="lightblue">0x22fd70</font>**  
**(15) foo: &newT2==<font color="lightblue">0x22fd60</font>**  
**(16) foo: &newT3==<font color="lightblue">0x22fd50</font>**  
**(17) copy-constructor: &t==<font color="blue">0x22fe20</font>**  
**(18) copy-constructor: this==<font color="orange">0x22fdc0</font>**  
**(19) destructor: this==<font color="lightblue">0x22fd50</font>**  
**(20) destructor: this==<font color="lightblue">0x22fd60</font>**  
**(21) destructor: this==<font color="lightblue">0x22fd70</font>**  
**(22) destructor: this==<font color="blue">0x22fe30</font>**  
**(23) destructor: this==<font color="blue">0x22fe20</font>**  
**(24) destructor: this==<font color="blue">0x22fe10</font>**  
**(25) main: &t123==<font color="orange">0x22fdc0</font>**  
**(26) destructor: this==<font color="orange">0x22fdc0</font>**  
**(27) destructor: this==<font color="purple">0x22fdd0</font>**  
**(28) destructor: this==<font color="red">0x22fde0</font>**  
**(29) destructor: this==<font color="red">0x22fdf0</font>**  
**(30) destructor: this==<font color="red">0x22fe00</font>**  

这个无非是大实验一的复杂版本，一共有 4 次 copy-construct，前三次是 `t1`、`t2`、`t3` 的参数 copy，第四次是把 `t2_copy` 再 copy 到 return value placeholder 上。注意这第四次 copy 是由 `return t2;` 引发的而不是由 `T t123 = foo(t1, t2, t3);` 的赋值引发的，即使没有赋值，也是一样要 copy。

function frame 的区域如图：

![][function_frame_2]

- 第一个问题就是 main 的 local variable（对 `foo()` 函数而言就是 outer variable）横在中间
- 然后 **stack frame** 这个栈顶指针我不知道是如何运作的
	- 因为书上说了一句 "In C and C++, arguments are first pushed on the stack from right to left, then the function call is made." 
		- from right to left 指参数列表从右到左
		- 具体到这个实验里，就是 `t3_copy` 先入栈，`t1_copy` 后入栈，这么一来这个栈应该是递增的；但是从 `newT1`、`newT2`、`newT3` 来看，这个栈又是递减的；或者这里其实是有两个栈？总之不是很清楚
	- 不过 copy-constructor 的调用的确是 from right to left，即先 copy `t3`，最后 copy `t1`。

如果我们是返回一个 local variable，情况会有很大的不同。我们把 main 里的 `T t123 = foo(t1, t2, t3);` 改成 `T t123 = bar(t1, t2, t3);` 再运行一遍，得到：

**(01) main: &t1==<font color="red">0x22fe00</font>**  
**(02) main: &t2==<font color="red">0x22fdf0</font>**  
**(03) main: &t3==<font color="red">0x22fde0</font>**  
**(04) main: &t4==<font color="purple">0x22fdd0</font>**  
**(05) copy-constructor: &t==<font color="red">0x22fde0</font>**  
**(06) copy-constructor: this==<font color="blue">0x22fe10</font>**  
**(07) copy-constructor: &t==<font color="red">0x22fdf0</font>**  
**(08) copy-constructor: this==<font color="blue">0x22fe20</font>**  
**(09) copy-constructor: &t==<font color="red">0x22fe00</font>**  
**(10) copy-constructor: this==<font color="blue">0x22fe30</font>**  
**(11) foo: &t1==<font color="blue">0x22fe30</font>**  
**(12) foo: &t2==<font color="blue">0x22fe20</font>**  
**(13) foo: &t3==<font color="blue">0x22fe10</font>**  
**(14) foo: &newT1==<font color="lightblue">0x22fd70</font>**  
**(15) foo: &newT2==<font color="orange">0x22fdc0</font>**  
**(16) foo: &newT3==<font color="lightblue">0x22fd60</font>**  
**(17) destructor: this==<font color="lightblue">0x22fd60</font>**  
**(18) destructor: this==<font color="lightblue">0x22fd70</font>**  
**(19) destructor: this==<font color="blue">0x22fe30</font>**  
**(20) destructor: this==<font color="blue">0x22fe20</font>**  
**(21) destructor: this==<font color="blue">0x22fe10</font>**  
**(22) main: &t123==<font color="orange">0x22fdc0</font>**  
**(23) destructor: this==<font color="orange">0x22fdc0</font>**  
**(24) destructor: this==<font color="purple">0x22fdd0</font>**  
**(25) destructor: this==<font color="red">0x22fde0</font>**  
**(26) destructor: this==<font color="red">0x22fdf0</font>**  
**(27) destructor: this==<font color="red">0x22fe00</font>**  

function frame 的区域如图：

![][function_frame_3]

我们看到编译器是把 `newT2` 直接分配到了 return variable placeholder 上！这样就省掉了一次 copy-construct，真是太机智了！（编译器：嘁，老子看得到你的代码，知道你要 `return newT2;`，有什么好奇怪的……

不知道是不是所有的编译器都这样，于是记录一下我自己用的是 TDM-GCC 4.8.1 64-bit Release。