---
layout: post
title: "array reference and initialization"
description: ""
category: Java
tags: []
---
{% include JB/setup %}

## array reference

　　可以用这么一种观点审视数组：数组其实是一个特殊的类，我们在声明数组时得到的是数组对象的引用。

```java
int[] a; // 得到的 a 是 int[] 对象的一个引用
int[5] a; //syntax error
```

　　从引用的角度来说，声明引用时也没必要知道 int[] 的 length：那是 int[] 对象的事情，与引用本身没有关系。  

　　还有一种形式可以用来声明数组引用，但不能直接接上初始化:

```java
int[] c = new int[x]; // x 可以是变量、常量、magic number、表达式……只要能产生一个 value 即可  
int[] d = new int[x] {……}; // syntax error
```

---

## initialization of an array

　　数组的初始化只能通过 {...} 来进行，有2种方式：

```java
int[] a = {1, 2, 3};  
int[] b = new int[] {1, 2, 3};  
```

　　其中 new int[] {...} 形式可以像 new Object() 一样可以传递给方法作参数，如：

```java
method(new int[] {1, 2});  
```
