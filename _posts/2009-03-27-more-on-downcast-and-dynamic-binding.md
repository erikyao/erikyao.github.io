---
category: Java
description: ''
tags: []
title: 'Java: 有关向下转型的必要性和动态绑定的细节'
---

2021-01-03 更新：大一统至 [Single Dispatch in Java and Python](/java/2021/01/03/single-dispatch-in-java-and-python)

---

在 [多态](/java/2009/03/27/polymorphism) 里面说过：

> 除了 `static` 方法和 `final` 方法 (`final` 包含 `private`) 外，Java 对其他所有的方法都采用 dynamic binding. -- _P151, Chapter 8, Thinking in Java, Fourth Edition_

不过下面的这个例子也许会让人有点吃惊 (also from _Chapter 8, Thinking in Java, Fourth Edition_)：

```java
class Useful {  
	public void f() {System.out.println("Useful.f()");}  
}  
  
class MoreUseful extends Useful {  
	public void f() {System.out.println("MoreUseful.f()");}  
	public void g() {System.out.println("MoreUseful.g()");}  
}     

public class Demo {  
	public static void main(String[] args) {  
		Useful x = new MoreUseful();  
		  
		x.f();  
		// x.g(); // 编译错误：找不到符号  
		((MoreUseful)x).g(); // OK. This is Downcast/RTTI (Run-Time Type Identification)
	}  
}  
// output:  
/* 
	MoreUseful.f() 
	MoreUseful.g() 
*/
```

按理来说，`x.f()` 通过动态绑定能够正确调用 `MoreUseful` 的 `f()` 方法，那么为什么 `x.g()` 就不行呢？真的是 “除了 `static` 方法和 `final` 方法 (`final` 包含 `private`) 外，Java 对其他 _**‘所有’**_ 的方法都采用 dynamic binding” 吗？还是只对覆写方法才动态绑定？  

其实这里涉及到动态绑定的细节问题。当然，的确是 “除了 `static` 方法和 `final` 方法 (`final` 包含 `private`) 外，Java 对其他所有的方法都采用 dynamic binding”，只不过在使用动态绑定之前，编译器还做了一些其他的工作，而这些工作，就是造成上面代码结果的原因。  

Java的方法调用过程：

1. 编译器查看引用 (`x`) 的声明类型 (`Useful`) 和方法名 (`g()`)；通过声明类型找到方法列表；
	* 如果方法名不在方法列表中，则编译器报错 (`g()` 不在 `Useful` 的方法列表里，所以出错)；
	* 如果方法名在方法列表中，则继续下列步骤；
2. 编译器查看方法的参数列表，获取参数方法签名；
	* 如果方法是 `private`、`static`、`final` 或者构造器，编译器就可以确定调用那个方法 (这是静态绑定)；
	* 如果不是上述情况，就要使用动态绑定；

可见，`x.g()` 出错是由于使用动态绑定前的方法名检查未通过。从这个角度来说，动态绑定似乎的确只适用于覆写方法。  

由于无法使用动态绑定，所以要正确调用 `x.g()` 方法，向下转型 `((MoreUseful)x)` 就必不可少了。

_p.s._ 方法是位于代码段内存的；对象中会存一个指针指向方法所在的代码段内存。