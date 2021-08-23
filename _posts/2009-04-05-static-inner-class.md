---
layout: post
title: "Java: static inner class"
description: ""
category: Java
tags: [Java-InnerClass]
---
{% include JB/setup %}

![](https://farm2.staticflickr.com/1651/23293777973_188ed6b8c0_o_d.png)

一般的内部类是不能有 static member 的，因为普通的内部类必须创建对象，不需要有 static member 只属于内部类本身，所以 static member 对普通内部类来说是没有意义也是不允许的。同样，static 内部类也是 static，所以一般的内部类中也不能有 static 内部类。  

static 内部类可以有 static member，由于 static 内部类对象的创建不需要外部类对象，所以 static 内部类是无法通过 Outer.this 来连接到外部类对象的。所以根据 [内部类：对外部类的访问及 .this 和 .new](/java/2009/04/05/inner-class-this-and-new) 中关于内部类访问访问外部类 member 的说明，在 static 内部类中要访问外部类的 member 应该避免重名的现象发生。  

static 内部类表示这个内部类的定义是属于外部类的，但是 static 内部类的对象是可以有多个的，且可以直接创建。  

接口中允许有内部类存在，且接口中的内部类默认为 `public` + `static`，所以一定是 static 内部类。接口中的内部类可以实现这个接口本身。如果想要为接口创建公用代码，使得接口的不同实现都能使用这些代码，可以使用接口中的内部类。  

还有，可以使用 static 内部类来放置外部类的 main 测试方法。  