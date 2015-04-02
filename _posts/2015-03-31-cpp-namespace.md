---
layout: post
title: "C++: Namespace"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自：_Thinking in C++_

-----

## 目录：

- [1. Creating a namespace](#create-namespace)
- [2. Unnamed namespaces](#unnamed-namespace)
- [3. When `friend` meets namespace](#friend-and-namespace)
- [4. `using`](#using)
	- [4.1 Where to put `using`](#where-to-put-using)
	- [4.2 Name overriding](#name-override)
	- [4.3 `using` declaration](#using-declaration)
	- [4.4 Name conflict](#name-conflict)

-----

## <a name="create-namespace"></a>1. Creating a namespace

The creation of a namespace is notably similar to the creation of a class:

<pre class="prettyprint linenums">
namespace foo {
	// Declarations
}
</pre>

- A namespace definition can appear only at global scope, or nested within another namespace.
	- Access nested namespace via `::`, like `foo::bar::baz::myCout << i << endl;`
- No terminating semicolon is necessary after the closing brace of a namespace definition. (我一直没注意 class 的末尾是需要加 `;` 的……)
- A namespace definition can be “continued” over multiple header files. (如果是 class 之类的就要报错 redefinition 了)
- A namespace name can be aliased to another name. 
	- 写法是：`namespace fbz = foo::bar::baz;`
	- 这样前面那一句就可以写成 `fbz::myCout << i << endl;`
	- namespace 编写者和 client 端程序都可以给 namespace 取 alias
	
## <a name="unnamed-namespace"></a>2. Unnamed namespaces

- unnamed namespace 内的 variable 和 function 都是 internal linkage。
- unnamed namespace 设计出来就是为了取代 global static 的。

<pre class="prettyprint linenums">
#include &lt;iostream&gt;

using namespace std;
 
namespace { int i = 5; } 
 
int main(int argc, char* argv[]) {
	cout &lt;&lt; i; // output: 5
}
</pre>

## <a name="friend-and-namespace"></a>3. When friend meets namespace

根据 [class friend function inside a namespace](http://stackoverflow.com/questions/10934226/class-friend-function-inside-a-namespace)，namespace 内的 function 内写 friend 还需要一点技巧：

<pre class="prettyprint linenums">
#include &lt;iostream&gt;

/***** forward declare *****/
namespace A {
	class window;
	void f(window rhs);
}
void g(A::window rhs);
/***** forward declare *****/

namespace A {
	class window {
	private:
	    int a;
	    friend void f(window);
	    friend void ::g(window); // :: 定位到 global namespace 
	public:
		window(int a) {
			this->a = a;
		}
	};
	
	void f(window rhs) {
		std::cout &lt;&lt; rhs.a &lt;&lt; std::endl;
	}
}

void g(A::window rhs) {
	std::cout &lt;&lt; rhs.a &lt;&lt; std::endl;
}

int main() {
	A::window w(1);
	A::f(w);	// output: 1 
	g(w);		// output: 1 
}
</pre>

* 注意 forward declare 的用法
* 注意 friend function 放在 namespace 内和放在 namespace 外的区别

## <a name="using"></a>4. Using

### <a name="where-to-put-using"></a>4.1 Where to put using

* `using` 最常见的位置就是在函数外，在文件全局范围内引入一个 namespace
* 其实 `using` 也可以在 function 内使用，作用域是 function 内部，出了 function 就失效
* namespace 内 `using` 另一个 namespace 也是可以的，效果同 function 内 `using`

### <a name="name-override"></a>4.2 Name overriding

`using` 引入的 variable 和 function，其实是可以 "override" 的，但是与覆写又有点不同的是：覆写后，原来的 variable 和 function 还是可以用全称显式地访问到的。举个例子：

<pre class="prettyprint linenums">
#include <iostream>

namespace A {
	int i = 5;
}

using namespace A;
using namespace std;

int main() {
	int i = 47; // override A::i
	
	cout &lt;&lt; i &lt;&lt; endl;		// output: 47
	cout &lt;&lt; A::i &lt;&lt; endl;	// output: 5
}
</pre>

### <a name="using-declaration"></a>4.3 `using` declaration

有点像 java 的 static import，只引入一个 name 而不是整个 namespace：

<pre class="prettyprint linenums">
#include &lt;iostream&gt;

using std::cout; // 只引入一个 cout

int main() {
	cout &lt;&lt; "Hello" &lt;&lt; std::endl;
	// cout 可以直接用；但是 endl 就要写全称
}
</pre>

A `using` declaration can also appear within a namespace.

### <a name="name-conflict"></a>4.4 Name conflict

如果两个 namespace 有同名的 variable 或者 function，引入的时候不会报错，使用这个 variable 或者 function 的时候才报错：

<pre class="prettyprint linenums">
namespace U {
	int i = 5;
	inline void f() {}
}

namespace V {
	int i = 47;
	inline void f() {}
}

int main() {
	using namespace U;
	using namespace V; // no conflict yet
	
	i++;	// ERROR. reference to 'i' is ambiguous
	
	f(); 	// ERROR. call of overloaded 'f()' is ambiguous
	U::f();	// OK
	V::f();	// OK
}
</pre>

这种情况不算做 override，我猜是因为 override 是程序员自己控制的，而 namespace 成员重名程序员很难发觉，于是编译器直接报个错提示你……

