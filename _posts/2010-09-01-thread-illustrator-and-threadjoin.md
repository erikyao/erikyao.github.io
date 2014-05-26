---
layout: post
title: "多线程示意和 thread.join() 用法示意"
description: ""
category: Java
tags: [Java-101, Java-Concurrent]
---
{% include JB/setup %}

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

![](https://ujdazg.bn1303.livefilestore.com/y2pfMP5HbP9kDZ1xA3Rf7Yz9oMLfk-qwnkuijo7WHIQa-6wRJwoU4bffQxDA-3B5S2luAJyv3GnVg19j44C3Q9OEwZUmuVw1Zg81W1Ezwpl3Ek/Image1.png?psid=1)

这里只有一条执行路径，main 方法又成为主线程。

　　多线程就不一样，它可以分成两条并行的执行路径：

![](https://ujdazg.bn1302.livefilestore.com/y2pBt2dYt29Lm69WtU08bONGr0eZV8ls18Dzg-W1t6ZcOkT-sTUmu8ZYGbPGAFa1IJMED_OsWT4fXFuPZSWQ59u7VAhIUT2tRfMDPHJnY5Gqnw/Image2.png?psid=1)

t.start() 之后，main 如果没有调用 t 的其他方法的话，那么主线程和 t 就两条并行线路同时跑下去，两者的执行也没有什么直接关系了。


　　如果 t.start() 之后，main 又调用 t.join()，（假设此时 t 还没跑完）则此时 main 就像调用一个普通方法一样（比如第一幅图的 m1()），main 要等 t 执行完之后才能继续执行 t.join() 之后的代码，称为 “将 t 合并到主线程”

![](https://ujdazg.bn1302.livefilestore.com/y2p7waBXhXTSB9CPi4BuTCLSYpRI7BtQPErG5yUVMJY4rDrL-YDN98WD6_6gxKX749P1HKsD7dRU6XqVzqtYt2X6uEF9Mk4NE7CuZhn6Nq0vKs/Image3.png?psid=1)

API 的说法更直接：t.join() 的作用就是 wait for t to die
