---
layout: post
title: "多态"
description: ""
category: Java
tags: []
---
{% include JB/setup %}

## 1. 向上转型 (upcast)

一个子类的 object 可以用父类的 reference 来指向，即我们可以不用子类的 reference 而是升级使用父类的 reference。如：`Base b = new Ext();`

---

## 2. 动态绑定 (dynamic binding)

一般说来，将一个方法调用和一个方法主体关联起来叫做绑定。也可以理解为将方法名和方法 body (方法代码段) 关联起来叫做绑定。除了 `static` 方法和 `final` 方法 (`final` 包含 `private`) 外，Java 对其他所有的方法都采用 dynamic binding (_3月27日补充_：请正确理解这句话；more details see [有关向下转型的必要性和动态绑定的细节](/java/2009/03/27/more-on-downcast-and-dynamic-binding))，即直到调用方法的那个时刻才开始绑定。  

多态即是利用了动态绑定这一特点。举个例子来说，`class Base` 有个 `work()` 方法，`Base` 类的两个子类 `Ext1` 和 `Ext2` 都覆写了 `work()` 方法，现在有一个 `Base b`，它可能是一个 `new Base()`，也可能是一个 `new Ext1()` 或是 `new Ext2()` (向上转型允许)，若此时调用 `b.work()`，编译器会判断究竟是调用 `Base` 类的 `work()` 还是 `Ext1` 类的 `work()` 或是 `Ext2` 类的 `work()`。从这个角度来说，动态绑定更像是动态确定 reference 指向的 object，即这个 reference 到底是指向 `Base` object 还是 `Ext1` object 或是 `Ext2` object。  

注意，`Ext1` 和 `Ext2` 必须是都覆写了 `work()` 方法，如果不是覆写就没有动态绑定的意义了，因为只有覆写才能造成 `Base`、`Ext1`、`Ext2` 中各有一个同签名不同方法 body 的 `work()` 方法。  

_p.s._ 多态的 3 个条件：继承或实现、`@Override`、`Base` reference 指向 `Ext` 对象

_p.s._ 不存在平行转型 (horizontal-cast)，即 `Ext1 e = new Ext2()`。

---

## 3. field 和 static 方法没有动态绑定

意味着 `b.field` 和 `b.staticMethod()` 完全看 `b` 的声明类型。若是声明了 `Ext b`，则是 `Ext` 的 field 和 static method；若是声明了 `Base b`，则是 `Base` 的 field 和 static method，就算有 `Base b = new Ext()`; 也是如此。

---

## 4. 利用多态的一个例子

如在某方法中，不管传进来的参数是 `Ext1` object 还是 `Ext2` object，都要求执行 `work()` 方法，这是可以写成：

```java
return-type xxx(..., Base b, ...) {  
	...;  
	b.work();  
	...;  
}  
```

这就相当于把类型判断交给编译器去执行了。
