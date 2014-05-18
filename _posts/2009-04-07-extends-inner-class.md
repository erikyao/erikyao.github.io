---
layout: post
title: "对内部类的继承"
description: ""
category: Java
tags: [Java-101, Java-InnerClass]
---
{% include JB/setup %}

　　首先我们明确下 enclose 这个单词的逻辑关系：OuterClass encloses InnerClass，所以外部类就是 enclosing class，内部类是 enclosed class。  

---

　　如果一个一般类来继承内部类，需要在构造器中使用特殊的语法。  

<pre class="prettyprint linenums">
class Outer {  
	class Inner {}  
}  
  
public class ExtInner extends Outer.Inner {  
	public ExtInner(Outer o) {  
		o.super();  
	}  
}  
</pre>

　　ExtInner 的构造器必须要有一个 Outer 参数，然后调用 \.super();。这里要求必须使用一个 `enclosingClassReference.super();`。  

　　_题外话_：你可能会问：在 ExtInner 的构造器里 return o.new Inner(); 行不行？编译器会告诉你：constructor 的 return-type 是 void。这个是本话题的意外收获。  

　　然后 ExtInner 中无法通过 Outer.this 来连接到外部类对象，在 ExtInner 中使用 Outer.this 会得到编译错误 “Outer 不是封闭类” (Java SE 1.5.0_15)，这里的封闭类应该就是 enclosing class 的意思，“Outer不是封闭类” 表示 Outer 并没有 enclose ExtInner，虽然 Outer 有 enclose Inner，且 ExtInner 继承自 Inner。  

　　如果 Base 有一个 Inner，然后 Ext 继承了 Base，这时 Ext 并没有继承 Base.Inner 的代码，即 Base.Inner 的代码没有复制到 Ext 中。此时，如果在 Ext 中也写一个 Inner，其实是不会发生冲突的。  

---

　　如果内部类、外部类双重继承，情况如何呢？看下面代码：

<pre class="prettyprint linenums">
class BaseOuter {  
	void print() {  
		System.out.println("BaseOuter prints");  
	}  
	  
	class BaseInner {  
		void print2() {  
			System.out.println("BaseInner prints");  
		}  
		  
		void print3() {  
			BaseOuter.this.print();  
		}  
	}  
}  
  
class ExtOuter extends BaseOuter {  
	void print4() {  
		System.out.println("ExtOuter prints");  
	}  
	  
	class ExtInner extends BaseOuter.BaseInner {  
		void print5() {  
			System.out.println("ExtInner prints");  
		}  
		  
		void print6() {  
			ExtOuter.this.print4();  
		}  
		  
		void print7() {  
			BaseOuter.this.print(); // error: BaseOut is not the enclosing class  
		}  
	}  
}  
  
public class ExtInnerTest {  
	public static void main(String[] args) {  
		ExtOuter eo = new ExtOuter();  
		ExtOuter.ExtInner ei = eo.new ExtInner();  
		  
		ei.print2();  
		ei.print3();  
		ei.print5();  
		ei.print6();  
		ei.print7(); // error: BaseOut is not the enclosing class  
	}  
}  
</pre>

　　可以看到 ExtInner 可以通过向上转型变成 BaseInner，然后再连接到 BaseOut.this (ei.print3(); // OK)，但是不能直接使用 BaseOut.this (ei.print7(); // won't compile)。  

　　总结一点，内部类不能被外部类的导出类继承，外部类也不 enclose 内部类的导出类。