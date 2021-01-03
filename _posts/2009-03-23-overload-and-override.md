---
layout: post
title: "overload and override: 重载与覆写"
description: ""
category: Java
tags: []
---
{% include JB/setup %}

首先看概念：

- overload: 重载，指在同一个 class 中有多个 **同名** method 的现象。  
- override: 覆写，指 ext class 中重写 base class 中的 **同签名** method 的行为。  

注意，如果 `class Ext extends class Base`，且假设 `class Base` 中有一个 **非 private 非 final 的** `foo(argv_1)` 方法，那么 `class Ext` 中同样也会有 `foo(argv_1)` 方法。  

- 此时如果在 `class Ext` 中添加一个同名 method，如 `foo(argv_2)`，则是重载行为。  
- 此时如果在 `class Ext` 中添加一个同签名 method `foo(args_1)`，则是覆写行为。  

方法名与参数列表合称方法签名，是方法的唯一标识。return type 不属于方法签名。(3月27日补充：虽然如此，覆写对 return type 还是有要求的，more details see [关于覆写方法的return type](/java/2009/03/27/return-type-of-overridden-method))

如果 `class Base` 中的 `foo(argv_1)` 方法是 private 或是 final 的，那么 `class Ext` 中是不会有 `foo(argv_1)` 方法的，所以无论是添加 `foo(argv_1)` 方法或是 `foo(argv_2)` 方法，是既不算重载也不算覆写的。

_P.S._ 重载并不要求有继承，同一个类中也可以有重载行为

_P.S._ 静态方法没有覆写机制，如：

```java
class Base {  
	public static void print() {  
		System.out.println("Base prints.");  
	}  
}  
  
public class Ext extends Base {  
	public static void print() {  
		System.out.println("Ext prints.");  
	}  
	  
	public static void main(String[] args) {          
		Base.print(); // Base prints.  
		Ext.print(); // Ext prints.  
		  
		Base b = new Base();  
		b.print(); // Base prints.  
		  
		Base b2 = new Ext();  
		b2.print(); // Base prints.  
		  
		Ext e = new Ext();  
		e.print(); // Ext prints.  
	}  
}  
```

尤其需要注意的是 `b2`，这里不像多态机制，静态方法的绑定也是静态的，引用是啥类型，就调用啥类型的静态方法。