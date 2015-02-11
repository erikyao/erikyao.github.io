---
layout: post
title: "《分布式 Java 应用：基础与实践》第二章总结：SOA 扫盲"
description: ""
category: Java
tags: [Book, Java-DistributedSystem]
---
{% include JB/setup %}

　　系统大了就要拆分，比如豆瓣读书、豆瓣电影和豆瓣音乐。  

　　拆分之后就面临着多个相关系统之间交互的问题：

1. 系统间通信的方式有很多，多个系统间凑到一起可能会引入各种通信方式，导致学习和开发成本巨大
2. 容易造成各团队重复造轮子，各自有各自的接口客户端，导致开发和维护的成本巨大（比如我们的 mc、mission 与 credit 系统）

　　为了解决 "多个相关系统之间如何交互才能简单方便省成本" 这个问题，我们引入了 SOA，Service-Oriented Architecture，它强调系统之间以标准的服务方式进行交互，至于系统本身的实现可以用不同的语言和框架，SOA 不关心。

　　SOA 也不关心具体交互的通信方式，这是 SOA 框架实现的问题。所以说，SOA 就是一种想法（包括后续的一些要求，比如 QoS），没有涉及到具体的实现细节。

![](https://7atftq.bn1.livefilestore.com/y2pT13H51hWXMUJGWZJ2Swhb42h4vFgvuBPxe9Hy3qQB7mz1jC-kC9yCzP5vsWqw7PZpytRZxcbqrBMdK8QiznGw1j0n3gVpExXKWMe_cpMxp8/SOA%E6%A6%82%E5%BF%B5.png?psid=1)