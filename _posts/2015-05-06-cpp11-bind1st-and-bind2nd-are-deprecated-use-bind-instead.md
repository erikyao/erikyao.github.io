---
layout: post
title: "C++11: bind1st() and bind2nd() are deprecated. Use bind() instead."
description: ""
category: C++
tags: [Cpp-101, C++11]
---
{% include JB/setup %}

整理自：

- _C++ Primer, 5th Edition_
- [std::bind](http://www.cplusplus.com/reference/functional/bind/)

-----

在 [C++: function object](/c++/2015/04/21/cpp-function-object/) 里我们提到了 `bind1st()` 和 `bind2nd()`，C++11 里已经 deprecated 了，我们看下新标准的 `bind()` 的用法：

<pre class="prettyprint linenums">
#include &lt;iostream&gt;     // for std::cout
#include &lt;functional&gt;   // for std::bind

// a function: (also works with function object: std::divides&lt;double&gt; my_divide;)
double my_divide (double x, double y) {
    return x/y;
}

struct MyPair {
    double a,b;
    double multiply() {
        return a*b;
    }
};

int main () {
    using namespace std::placeholders;    // adds visibility of _1, _2, _3,...

    // binding functions:
    auto fn_five = std::bind (my_divide,10,2);               // fn_five() = my_divide(10, 2)
    std::cout &lt;&lt; fn_five() &lt;&lt; '\n';                          // output: 5

    auto fn_half = std::bind (my_divide,_1,2);               // fn_half(x) = my_divide(x, 2)
    std::cout &lt;&lt; fn_half(10) &lt;&lt; '\n';                        // output: 5

    auto fn_invert = std::bind (my_divide,_2,_1);            // fn_invert(x, y) = my_divide(y, x)
    std::cout &lt;&lt; fn_invert(10,2) &lt;&lt; '\n';                    // output: 0.2

    auto fn_rounding = std::bind&lt;int&gt; (my_divide,_1,_2);     // fn_rounding(x, y) = (int)my_divide(x, y)
    std::cout &lt;&lt; fn_rounding(10,3) &lt;&lt; '\n';                  // output: 3

    MyPair ten_two {10,2};

    // binding members:
    auto bound_member_fn = std::bind (&MyPair::multiply,_1); // bound_member_fn(x) = x.multiply()
    std::cout &lt;&lt; bound_member_fn(ten_two) &lt;&lt; '\n';           // output: 20

    auto bound_member_data = std::bind (&MyPair::a,ten_two); // bound_member_data() = ten_two.a
    std::cout &lt;&lt; bound_member_data() &lt;&lt; '\n';                // output: 10

    return 0;
}
</pre>

注意 placeholder `_1`、`_2` 这些是对 bind 所产生的新函数而言的，比如 `auto fn_half = std::bind (my_divide,_1,2);` 这里的 `_1` 其实指的是 "`fn_half` 的第一个参数"，并不是指 "把 `my_divide` 的第一个参数绑定为 2"。换言之，有几个 placeholder，bind 所产生的新函数就有几个参数。