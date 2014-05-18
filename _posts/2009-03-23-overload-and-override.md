---
layout: post
title: "overload and override: 重载与覆写"
description: ""
category: Java
tags: [Java-101]
---
{% include JB/setup %}

　　overload: 重载，指在同一个 class 中有多个 **同名** function 的现象。  

　　override: 覆写，指 ext class 中重写base class中的 **同签名** function 的行为。  

　　注意，如果 ext class 继承了 base class ——假设 base class 中一个 **非private非final的** work(arg list 1)方法—— ext class 中同样也会有 work(arg list 1) 方法。  

　　此时如果在 ext class 中再添加一个同名 function，如 work(arg list 2)，则是重载行为。  

　　如果添加一个同签名 function，即work(arg list 1)，则是覆写行为。  

　　方法名与参数列表合称方法签名，是方法的唯一标识。return type不属于方法签名。(3月27日补充：虽然如此，覆写对return type还是有要求的，more details see [关于覆写方法的return type](/java/2014/05/17/return-type-of-overridden-method/))

　　如果base class中的work(arg list 1)方法是private或是final的，那么ext class中是不会有work(arg list 1)方法的，所以无论是添加work(arg list 1)方法或是work(arg list 2)方法，是既不算重载也不算覆写的。

_P.S._ 重载并不要求有继承，同一个类中也可以有重载行为

_P.S._ 静态方法没有覆写机制，如：

<pre class="prettyprint linenums">
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
</pre>

尤其需要注意的是 b2，这里不像多态机制，静态方法的绑定也是静态的，引用是啥类型，就调用啥类型的静态方法。