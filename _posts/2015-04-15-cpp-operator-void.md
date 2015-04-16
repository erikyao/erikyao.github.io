---
layout: post
title: "C++: operator void*"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

用法有点奇葩的一个 operator。总结自 [What does operator void* () mean?](http://stackoverflow.com/questions/18215827/what-does-operator-void-mean)。

----

简单地说这是一个 type conversion operator，也就是说把 object 转成 void* 时会用到这个。看例子：

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
using namespace std;

struct Foo {
    Foo() : ptr(0) {
        std::cout &lt;&lt; "I'm this: " &lt;&lt; this &lt;&lt; "\n";
    }
    operator void* () {
        std::cout &lt;&lt; "Here, I look like this: " &lt;&lt; ptr &lt;&lt; "\n";
        return ptr;
    }
private:
    void *ptr;
};

int main() {
    Foo foo;
	
    foo.operator void*();	// 调用方式一
    (void*)foo;				// 调用方式二
    void* ptr = foo;		// 调用方式三
    
	// 调用方式四
    if (foo) { // boolean evaluation also uses the void* conversion
        std::cout &lt;&lt; "test succeeded\n";
    }
    else {
        std::cout &lt;&lt; "test failed\n";
    }
}
// output: 
/* 
	I'm this: 0x22fe40
	Here, I look like this: 0
	Here, I look like this: 0
	Here, I look like this: 0
	Here, I look like this: 0
	test failed
*/
</pre>

* 如果你的类 `Foo` 重载了 `operator void*`，你就可以用 `if(foo)` 这种写法；如果没重载就不能用
* `if(foo)` 的判定标准就是把 `foo` 转成 `void*`，如果为 0 就是 false。
	- C++ 中的 `NULL` 其实就是一个 0
* `while(cin >> i) { cout &lt;&lt; i &lt;&lt; endl; }` 也是这个原理，因为 `cin >> i` 会返回 `cin` 本身，然后这里会把 `cin` 转成 `void*`。
	- 而 `cin` 的 `operator void*` 又有点特殊，它并不是返回地址，而是直接返回了 `cin.good()`，如果是非 good 状态，就会 return 0，进而终止 while。

另外帖子里还提到了 `operator()`，它的用法是这样的：`Foo foo; foo();`，意思是如果你重载了 `operator()`，就可以把对象当函数用……