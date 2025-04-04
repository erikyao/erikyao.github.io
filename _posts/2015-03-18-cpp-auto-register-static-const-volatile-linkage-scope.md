---
category: C++
description: ''
tags:
- const
title: 'C++: auto / register / static / const / volatile / linkage / scope'
toc: true
toc_sticky: true
---

[linkage]: https://farm2.staticflickr.com/1595/23552708989_a3cd413238_o_d.png

整理自：

* _Thinking in C++_
* [C++ Tutorial](http://www.tutorialspoint.com/cplusplus)
	* [C++ Variable Scope](http://www.tutorialspoint.com/cplusplus/cpp_variable_scope.htm)
	* [Storage Classes in C++](http://www.tutorialspoint.com/cplusplus/cpp_storage_classes.htm)
	* [C++ Modifier Types](http://www.tutorialspoint.com/cplusplus/cpp_modifier_types.htm)
* MSDN
	* [Using extern to Specify Linkage](https://msdn.microsoft.com/en-us/library/0603949d.aspx)
	* [Static (C++)](https://msdn.microsoft.com/en-us/library/s1sb61xd.aspx)
	* [Constant Values](https://msdn.microsoft.com/en-us/library/357syhfh.aspx)
	* [volatile (C++)](https://msdn.microsoft.com/en-us/library/12a04hfd.aspx)
	* [Type Qualifiers](https://msdn.microsoft.com/en-us/library/888bfst6.aspx)
	* [Names with No Linkage](https://msdn.microsoft.com/en-us/library/hfs9f82w.aspx)
	* [register Keyword](https://msdn.microsoft.com/en-us/library/482s4fy9.aspx)
* [Linkage Types](https://www.informit.com/guides/content.aspx?g=cplusplus&seqNum=41)

-----

_Thinking in C++_ 的路线是：

* Global variables
* Local variables
	* `auto`
	* `register`
* `static`
* `extern`
* `const`
* `volatile`

中间穿插讲了 linkage。

首先我觉得这个分类不利于理解，对 variable 而言，按 "Variable Scope" 和 "Storage Classes" 交叉分类再清楚不过了；然后我觉得应该先讲 linkage，讲了 linkage 之后很多效果就可以用 linkage 解释了，不用浪费那么多口舌；最后，`const` 和 `volatile` 是属于大类 "Type Qualifiers" 的。

-----
	
# 1. linkage

## Digress: Identifiers vs. Names

在调查 linkage 的时候，发现书上用的是 "identifier"，MSDN 和其他的一些地方用的是 "name"，它俩基本等价

以下这些都是 name/id:

* object or variable name
* function or member method name
* `class`, `struct`, or `union` name
* `enum` type name
* member of a `class`, `struct`, `union`, or `enum`
* `typedef` type name
* `goto` label name
* macro name
* macro parameter

## Internal linkage vs. External linkage

Linkage describes how identifiers can or can not refer to the same entity throughout the whole program or one single translation unit.

There are two types of linkage: 

* Internal linkage
	* Internal linkage means that storage is created to represent the identifier only for the translation unit being compiled. 
	* Other translation units may use the same identifier name with internal linkage, or for a global variable, and no conflicts will be found by the linker because separate storage is created for each identifier.
* External linkage
	* External linkage means that a single piece of storage is created to represent the identifier for all translation units being compiled. The storage is created once, and the linker must resolve all other references to that storage. 
	* Identifiers with external linkage can be accessed from other translation units by declaring them with the keyword `extern`.
	
注意书上用的原词是 "file"，这里用了标准用词 "translation unit"，其定义是 (出自 [What is external linkage and internal linkage in C++](http://stackoverflow.com/questions/1358400/what-is-external-linkage-and-internal-linkage-in-c))：

> A translation unit is a source file plus all the headers you `#include`d in it, from which the compiler creates the object file. 

<a name="linkage-example"></a>而 `#include` 的作用基本可以理解为 "copy the included file into the current one"。在实际应用中，要注意区分 `#include` 和 declare。举个例子：

* 如果我在 `lib.h` 写了 `const int STASH_NUM = 8;`，这是个 internal linkage
* 我在 `main.cpp` 里用 `extern const int STASH_NUM;` 是无法 declare 到这个 `const int`，使用时会报 "undefined reference"
	* 因为 `lib.h` 和 `main.cpp` 是两个不同的 translation units，因为 internal linkage，所以 `main.cpp` 看不到 `lib.h` 里的 `const int STASH_NUM = 8;`
* 如果我在 `main.cpp` 里写的是 `#include 'lib.h'`，这时 `main.cpp` 和 `lib.h` 是同一个 translation unit。而同一个 translation unit 是可以看到 `const int STASH_NUM = 8;` 的，所以 `main.cpp` 可以直接用 `STASH_NUM`，此时也不需要写 `extern const int STASH_NUM;`（因为没必要；但是你写了也不会报错）

后面 `extern const` 还有个更大的 [例子](#global-const-example)。

## No linkage
	
Any name that has neither external linkage nor internal linkage has no linkage (i.e. the linker doesn’t know about this name, 因为这个 name 根本就不需要被 link). The only names that have no linkage are:

* Function parameters.
* Block-scoped names not declared as `extern` or `static`. (大部分的 local variable 就落到这个大类了)
* Enumerators. (定义 `enum` 时，`{}` 内的那一系列常量我们称为 enumerator)
	* enum 和 enumerator 的 scope 和 linkage，C++ standard 是修改过的，不同的 standard 有不同的定义，所以需要考虑这个问题的时候再仔细 google 下，不要死记硬背
	* 这个定义是从 MSDN 扒下来的，我也不知道它用的是哪个标准……
* Names declared in a `typedef` statement. An exception is when the `typedef` statement is used to provide a name for an unnamed class type. The name may then have external linkage if the class has external linkage.

# 2. Variable Scope

A scope is a region of the program and broadly speaking there are three places, where variables can be declared:

* In the definition of function parameters
	* 这样的 variable 我们称为 formal parameters
* Inside a function or a block
	* 这样的 variable 我们称为 local variables
	* they are local to a function.
* Outside of all functions
	* 这样的 variable 我们称为 global variables
	* _**By default**_, an object or variable that is defined outside all blocks <font color="red">has static duration and external linkage.</font>
		* Static duration means that the object or variable is allocated when the program starts and is deallocated when the program ends.
		
## Digress: file scope
		
另外还有个词叫 file scope，MSDN 的说法是：

* [MSDN: Static (C++)](https://msdn.microsoft.com/en-us/library/s1sb61xd.aspx)：
	> When you declare a variable or function at file scope (global and/or namespace scope), the `static` keyword specifies that the variable or function has internal linkage. 
* [MSDN: Scope](https://msdn.microsoft.com/en-us/library/b7kfh662.aspx)：
	> Any name declared outside all blocks or classes has file scope. It is accessible anywhere in the translation unit after its declaration. Names with file scope that do not declare static objects are often called global names. In C++, file scope is also known as namespace scope.
	
书上有一句原话 "... is local to the file; we say it has **file scope**." 非常容易引起误解，或者说这句根本就是说错了。file scope 并不是 local to file 的意思；这句其实说的是 static identifier，你在函数外定义自然就是 file scope，用 static 限定为 internal linkage 就变成了 local to file，因果关系不对。

书上后来自己又说："Ordinarily, any name at file scope (that is, not nested inside a class or function) is visible throughout all translation units in a program." 所以我觉得按 MSDN 的说法理解就好。
	
# 3. Storage Classes

## 3.1 auto

They are often called **automatic** variables because they automatically come into being when the scope is entered and automatically go away when the scope closes. 

The `auto` storage class is the _**default**_ storage class for all local variables, so it is never necessary to declare something as an `auto`.

## 3.2 register

The `register` storage class is used to define local variables that should be stored in a register instead of RAM (if possible) (for faster access speed). This means that the variable has a maximum size equal to the register size (usually one word) and can't have the unary `&` operator applied to it (as it does not have a memory location).

However, there is no guarantee that the variable will be placed in a register or even that the access speed will increase. It is just a hint to the compiler. (向后兼容的产物（笑）)

* A `register` variable can be declared only within a block (you cannot have global or `static` register variables).
	* 至于为什么 `register` 不能是 global 的理由，我觉得这篇 [Why cant register variables be made global?](http://stackoverflow.com/questions/3486715/why-cant-register-variables-be-made-global) 并没有解释得很清楚，姑且一看
* You can use a `register` variable as a formal argument in a function (i.e., in the argument list).

## 3.3 static

The static `keyword` can be used in the following situations: 

* When you declare a variable or function at file scope (global and/or namespace scope), the `static` keyword <font color="red">specifies that the variable or function has internal linkage</font>. 
	* When you declare a `static` variable, the variable has <font color="red">static duration</font> and the compiler initializes it to 0 unless you specify another value.
* When you declare a variable in a function, the `static` keyword specifies that the variable retains its state between calls to that function.
* When you declare a data member in a class declaration, the `static` keyword specifies that one copy of the member is shared by all instances of the class. 
	* A `static` data member must be defined at file scope. 
	* An integral data member that you declare as `const static` can have an initializer.
* When you declare a member function in a class declaration, the `static` keyword specifies that the function is shared by all instances of the class. 
	* A static member function cannot access an instance member because the function does not have an implicit `this` pointer. 
	* To access an instance member, declare the function with a parameter that is an instance pointer or reference.
* You cannot declare the members of a union as `static`. However, a globally declared anonymous union must be explicitly declared `static`.

Static global variables (我造的这个词；姑且这么用) are extant throughout the life of a program, just like common global variables. 但是 static global variable 的一个好处是它是 file scope：scope 限定了，出问题的几率也就下降了。

# 4. Type Qualifiers

## 4.1 const

### 4.1.1 `#define` 有什么不好

比如 `#define PI 3.14159`。缺点有：

* No type checking is performed on the name `PI`. 
* You can’t take the address of `PI` (so you can’t pass a pointer or a reference to `PI`). 
* `PI` cannot be a constant of a user-defined type. 
* The meaning of `PI` lasts from the point it is defined to the end of the file; the preprocessor doesn’t recognize scoping.

### 4.1.2 Linkage type of const

* In C, constant values default to external linkage
* In C++, constant values _**default**_ to <font color="red">internal linkage</font>.

### 4.1.3 extern: forcing const into external linkage

注意我们在 [C++: declarations vs. definitions / extern](/c++/2015/03/15/cpp-declarations-vs-definitions-extern) 说的 “This is only a declaration; it's defined elsewhere.” 只是 `extern` 的功能之一。

我们来看下 `extern` 用法的标准解释（来自 [MSDN: Using extern to Specify Linkage](https://msdn.microsoft.com/en-us/library/0603949d.aspx)）：

> The `extern` keyword declares a variable or function and specifies that it has external linkage (its name is visible from files other than the one in which it's defined). When modifying a variable, `extern` specifies that the variable has <font color="red">static duration</font> (it is allocated when the program begins and deallocated when the program ends). The variable or function may be defined in another source file, <font color="red">or later in the same file</font>.

所以，要做一个 global const (我造的词)，要用 `extern`。不过也要注意写的形式，下面举几个例子。

### 4.1.4 Examples of declaring and defining global const

首先说下 rule of thumb:

* Declare in `lib.h`
* Define in `lib.cpp`

```cpp
/***** CASE 1 *****/

///// MyLib.h /////
extern const int STASH_NUM;

///// MyLib.cpp /////
const int STASH_NUM = 8;

///// MyMain.cpp /////
int main(int argc, char* argv[]) {
	cout << STASH_NUM; // ERROR. Not declared in this scope
}
```

```cpp
/***** CASE 2 *****/

///// MyLib.h /////
extern const int STASH_NUM;

///// MyLib.cpp /////
extern const int STASH_NUM;
const int STASH_NUM = 8;

///// MyMain.cpp /////
int main(int argc, char* argv[]) {
	cout << STASH_NUM; // ERROR. Not declared in this scope
}
```

```cpp
/***** CASE 3 *****/

///// MyLib.h /////
extern const int STASH_NUM;

///// MyLib.cpp /////
#include "MyLib.h"
const int STASH_NUM = 8;

///// MyMain.cpp /////
int main(int argc, char* argv[]) {
	cout << STASH_NUM; // ERROR. Not declared in this scope
}
```

```cpp
/***** CASE 4 *****/

///// MyLib.h /////
extern const int STASH_NUM;

///// MyLib.cpp /////
const int STASH_NUM = 8;

///// MyMain.cpp /////
extern const int STASH_NUM;

int main(int argc, char* argv[]) {
	cout << STASH_NUM; // ERROR. Undefined reference
}
```

```cpp
/***** CASE 5 *****/

///// MyLib.h /////
extern const int STASH_NUM;

///// MyLib.cpp /////
const int STASH_NUM = 8;

///// MyMain.cpp /////
#include "MyLib.h"

int main(int argc, char* argv[]) {
	cout << STASH_NUM; // ERROR. Undefined reference
}
```

```cpp
/***** CASE 6 *****/

///// MyLib.h /////
extern const int STASH_NUM;

///// MyLib.cpp /////
#include "MyLib.h"
const int STASH_NUM = 8;

///// MyMain.cpp /////
int main(int argc, char* argv[]) {
	cout << STASH_NUM; // ERROR. Not declared in this scope
}
```

```cpp
/***** CASE 7 *****/

///// MyLib.h /////
extern const int STASH_NUM;

///// MyLib.cpp /////
#include "MyLib.h"
const int STASH_NUM = 8;

///// MyMain.cpp /////
extern const int STASH_NUM;

int main(int argc, char* argv[]) {
	cout << STASH_NUM; // OK! output: 8
}
```

```cpp
/***** CASE 8 *****/

///// MyLib.h /////
extern const int STASH_NUM;

///// MyLib.cpp /////
#include "MyLib.h"
const int STASH_NUM = 8;

///// MyMain.cpp /////
#include "MyLib.h"

int main(int argc, char* argv[]) {
	cout << STASH_NUM; // OK! output: 8
}
```

```cpp
/***** CASE 9 *****/

///// MyLib.h /////
extern const int STASH_NUM;

///// MyLib.cpp /////
extern const int STASH_NUM;

const int STASH_NUM = 8;

///// MyMain.cpp /////
#include "MyLib.h"

int main(int argc, char* argv[]) {
	cout << STASH_NUM; // OK! output: 8
}
```

```cpp
/***** CASE 10 *****/

///// MyLib.h /////
extern const int STASH_NUM;

///// MyLib.cpp /////
extern const int STASH_NUM;

const int STASH_NUM = 8;

// extern const int STASH_NUM = 8; // also OK

///// MyMain.cpp /////
extern const int STASH_NUM;

int main(int argc, char* argv[]) {
	cout << STASH_NUM; // OK! output: 8
}
```

```cpp
/***** CASE 11 *****/

///// MyLib.h /////
extern const int STASH_NUM;

///// MyLib.cpp /////
#include "MyLib.h"
const int STASH_NUM = 8;

///// MyMain.cpp /////
#include "MyLib.h"

extern const int STASH_NUM;

int main(int argc, char* argv[]) {
	cout << STASH_NUM; // OK! output: 8
}
```

总结并更新下 rule of thumb:

* Declare in `lib.h`
* Declare + define in `lib.cpp`
* Declare + use in `main.cpp`
* 因为 `lib.h` 本身只有一个 declaration，所以在这种情况下，在 `lib.cpp` 和 `main.cpp` 中，你 `#include "MyLib.h"` 和写 `extern const int STASH_NUM;` 效果是一样的，都是 declare（CASE 7、8、9、10）
	* 如果 `lib.h` 本身是 declare + define，那你 `#include` 的作用也应该等同于 declare + define，此时就和单单 declare 的情况不同了。参 [linkage 中的例子](#linkage-example)。
* 重复 declare 不犯法（CASE 11）

如果直接在 `lib.h` 里 declare + define (比如 `extern const int STASH_NUM = 8;`)、然后不写 `lib.cpp`，会出现很奇怪的效果：

```cpp
/***** CASE 12 *****/

///// MyLib.h /////
extern const int STASH_NUM = 8;

///// MyMain.cpp /////
extern const int STASH_NUM;

int main(int argc, char* argv[]) {
	cout << STASH_NUM; // ERROR. Undefined reference
}
```

```cpp
/***** CASE 13 *****/

///// MyLib.h /////
extern const int STASH_NUM = 8;

///// MyMain.cpp /////
#include "MyLib.h"

int main(int argc, char* argv[]) {
	cout << STASH_NUM; // OK! output: 8
}
```

* CASE 13 好解释：`#include` 进来相当于直接在 main 之前 declare + define
* CASE 12 我实在不懂，它和 CASE 10 有嘛区别嘛！
	* 顺带记录一下我用的是 TDM-GCC 4.8.1 64-bit Release
	
-> _~~~~~~~~~~ 2015-07-19 更新开始 ~~~~~~~~~~_ <-

感谢 [chetui](https://disqus.com/by/chetui) 的评论！

> Case 10: 会生成两个.o:   
>   `MyLib.h` 和 `MyLib.cpp` 编译成 MyLib.o，  
>   `MyLib.cpp` 编译成 `MyMain.o`，  
> `extern const` 这句的意思是：在编译时即使没有找到 `STASH_NUM` 的定义也不要报错，因为有可能这个变量被定义在外部，链接时链进去就好了。然后两个 `.o` 链接成同一个 `a.out` 时，在 `MyLib.o` 里找到了 `STASH_NUM` 的定义，链接成功。

<!-- -->

> Case 12: 只有一个编译单元 `MyMain.o`，里面没有 `#include MyLib.h`。所以 `MyLib.h` 根本没有存在感，它并没有参与编译个链接。

-> _~~~~~~~~~~ 2015-07-19 更新结束 ~~~~~~~~~~_ <-
	
-> _~~~~~~~~~~ 2015-03-26 更新开始 ~~~~~~~~~~_ <-

我稍微设计了一个试验，猜测：`lib.h` 里 `extern const` 的 initialization 貌似是会被忽略的（而前面 [linkage 的例子](#linkage-example) 里，`lib.h` 里 declare + define 一个 common `const` 是没有问题的）。看代码：

```cpp
/***** CASE 14 *****/

///// MyLib.h /////
extern const int STASH_NUM = 7;

///// MyLib.cpp /////
extern const int STASH_NUM = 8; // 给 const 重复赋值成功！你敢信？

///// MyMain.cpp /////
extern const int STASH_NUM;

int main(int argc, char* argv[]) {
	cout << STASH_NUM; // OK! output: 8
	// 从输出结果来看，我只能猜测 .h 里 =7 的赋值实际没有执行
}
```

-> _~~~~~~~~~~ 2015-03-26 更新结束 ~~~~~~~~~~_ <-
	
### 4.1.5 其他注意事项

* In C++, a `const` must always have an initialization value (in C, this is not true).
* You can add suffixes to force the type of floating-point number: `f` or `F` forces a `float`, `L` or `l` forces a `long double`; otherwise the number will be a `double`.

## 4.2 volatile

Whereas the qualifier `const` tells the compiler "this never changes" (which allows the compiler to perform extra optimizations), the qualifier `volatile` tells the compiler "you never know when this will change," and prevents the compiler from performing any optimizations based on the stability of that variable. 

或者理解为：`volatile` means "this data may change outside the knowledge of the compiler." (possibly through multitasking, multithreading or interrupts)
{: .notice--info}

Use this keyword when you read some value outside the control of your code, such as a `register` in a piece of communication hardware. A `volatile` variable is **always** read whenever its value is required, even if it was just read the line before. 

* If the compiler says, "I read this data into a register earlier, and I haven't touched that register," normally it wouldn't need to read the data again. 
* But if the data is `volatile`, the compiler cannot make such an assumption because the data may have been changed by another process, and it must re-read that data rather than optimizing the code to remove what would normally be a redundant read.

You can also create `const volatile` objects, which can't be changed by the client programmer but instead change through some outside agency.

As with `const`, you can use `volatile` for data members, member functions, and objects themselves. You can only call `volatile` member functions for `volatile` objects. 鉴于 the syntax of `volatile` is identical to that for `const`，所以 volatile object / member / member function 的语法请参考 [C++: const object / const member & const member function / mutable](/c++/2015/03/29/cpp-const-object-const-member-const-member-function-mutable)。

_~~~~~~~~~~ 2015-05-19 补充；来自 C++ Primer, 5th Edition ~~~~~~~~~~_

**Warning**: The precise meaning of `volatile` is inherently machine dependent and can be understood only by reading the compiler documentation. Programs that use `volatile` usually must be changed when they are moved to new machines or compilers.

In the same way that a class may define `const` member functions, it can also define member functions as `volatile`. Only `volatile` member functions may be called on `volatile` objects.

_~~~~~~~~~~ 2015-05-19 补充完毕 ~~~~~~~~~~_

# 5. Summary

![][linkage]

"common" 指 non-`static` + non-`extern`
{: .notice--info}

根据 [Linkage Types](https://www.informit.com/guides/content.aspx?g=cplusplus&seqNum=41)，有：

* Internal linkage: 
	* name of a static object
	* a `static` function
	* a member of an anonymous union
	* a member of an anonymous namespace
	* a `typedef` name
	* a `const` object not declared `extern`
* External linkage:
	* ordinary functions that aren't explicitly declared as `static`
	* global objects
	* `const` objects explicitly declared `extern`
	* classes
	* enumerations and their enumerators (文章写于 2003 年；存疑)
	* templates
	* namespaces
	* and so on