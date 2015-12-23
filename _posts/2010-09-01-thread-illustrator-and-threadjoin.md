---
layout: post
title: "多线程示意和 thread.join() 用法示意"
description: ""
category: Java
tags: [Java-Concurrent]
---
{% include JB/setup %}

[1]: https://farm6.staticflickr.com/5831/23293777493_04aeb2f146_o_d.png
[2]: https://farm6.staticflickr.com/5618/23838061221_1ba9bdc5b6_o_d.png
[3]: https://farm2.staticflickr.com/1637/23920547175_cb21513ed5_o_d.png

　　简单理解，一个线程就是程序的一条直行路径，比如下面这段：

<pre class="prettyprint linenums">
public static void main(String[] args) {
	m1();
}

private static void m1() {
	m2();
}

private static void m2() {
	// do something;
}
</pre>

是一个串行的执行路径：

![][1]

这里只有一条执行路径，main 方法又成为主线程。

　　多线程就不一样，它可以分成两条并行的执行路径：

![][2]

t.start() 之后，main 如果没有调用 t 的其他方法的话，那么主线程和 t 就两条并行线路同时跑下去，两者的执行也没有什么直接关系了。


　　如果 t.start() 之后，main 又调用 t.join()，（假设此时 t 还没跑完）则此时 main 就像调用一个普通方法一样（比如第一幅图的 m1()），main 要等 t 执行完之后才能继续执行 t.join() 之后的代码，称为 “将 t 合并到主线程”

![][3]

API 的说法更直接：t.join() 的作用就是 wait for t to die
