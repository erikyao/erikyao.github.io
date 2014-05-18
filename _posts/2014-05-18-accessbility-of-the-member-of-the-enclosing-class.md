---
layout: post
title: "局部内部类、匿名内部类对外部变量的访问权限 + 闭包"
description: ""
category: Java
tags: [Java-101, Java-InnerClass, Closure]
---
{% include JB/setup %}

## 局部内部类对外部变量的访问权限

　　[Local Class 的文档](http://docs.oracle.com/javase/tutorial/java/javaOO/localclasses.html) 有说：

> A local class has access to the members of its enclosing class.  
> <br/>
> In addition, a local class has access to local variables. However, a local class can only access local variables that are declared final.  
> <br/>
> However, starting in Java SE 8, a local class can access local variables and parameters of the enclosing block that are final or effectively final. A variable or parameter whose value is never changed after it is initialized is effectively final.

---

## 匿名内部类对外部变量的访问权限

　　[Anonymous Class 的文档](http://docs.oracle.com/javase/tutorial/java/javaOO/anonymousclasses.html#accessing) 有说：

> An anonymous class has access to the members of its enclosing class.  
> <br/>
> An anonymous class cannot access local variables in its enclosing scope that are not declared as final or effectively final.

---

## 闭包

　　以上两点限制的原因，一种论调是：

> the local class instance can remain in memory after the method returns. When the method returns the local variables go out of scope, so a copy of them is needed. If the variables weren’t final then the copy of the variable in the method could change, while the copy in the local class didn’t, so they’d be out of synch. 

　　有人说是编译器实现策略，也有人说这一种伪闭包实现。我比较认同，这就是一种实现策略，并不是什么原则性的问题。  

　　那么，什么是闭包呢？  

　　[英文维基](http://en.wikipedia.org/wiki/Closure_%28computer_science%29) 说：

> In programming languages, a closure (also lexical closure or function closure) is a function or reference to a function together with a referencing environment—a table storing a reference to each of the non-local variables (also called free variables or upvalues) of that function. A closure—unlike a plain function pointer—allows a function to access those non-local variables even when invoked outside its immediate lexical scope.

　　[中文维基](http://zh.wikipedia.org/zh/%E9%97%AD%E5%8C%85_%28%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6%29) 说：

> 在计算机科学中，闭包（Closure）是词法闭包（Lexical Closure）的简称，是引用了自由变量的函数。这个被引用的自由变量将和这个函数一同存在，即使已经离开了创造它的环境也不例外。所以，有另一种说法认为闭包是由函数和与其相关的引用环境组合而成的实体。闭包在运行时可以有多个实例，不同的引用环境和相同的函数组合可以产生不同的实例。  
> <br/>
> 在 C 语言中，支持回调函数的库有时在注册时需要两个参数：一个函数指针，一个独立的 void* 指针用以保存用户数据。这样的做法允许回调函数恢复其调用时的状态。这样的惯用法在功能上类似于闭包，但语法上有所不同。

　　C 语言的这个例子举得很容易理解。