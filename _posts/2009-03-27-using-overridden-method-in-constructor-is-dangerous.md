---
layout: post
title: "Java: 在构造器中请谨慎使用被覆写方法"
description: ""
category: Java
tags: []
---
{% include JB/setup %}

先上代码 (adapted from _Chapter 8, Thinking in Java, Fourth Edition_)：

```java
class Glyph {  
	void draw() {   
		System.out.println("Glyph.draw()");  
	}  
	  
	Glyph() {  
		System.out.println("Glyph constructor");  
		draw();  
	}  
}     
  
class RoundGlyph extends Glyph {  
	private int radius = 1;  
  
	RoundGlyph(int r) {  
		System.out.println("before assignment in constructor, radius = " + radius);  
		radius = r;  
		System.out.println("RoundGlyph constructor, radius = " + radius);  
	}  
	  
	void draw() {  
		System.out.println("RoundGlyph.draw(), radius = " + radius);  
	}  
}     
  
public class PolyConstructors {  
	public static void main(String[] args) {  
		new RoundGlyph(5);  
	}  
}  
//Output:  
/* 
	Glyph constructor 
	RoundGlyph.draw(), radius = 0 
	before assignment in constructor, radius = 1 
	RoundGlyph constructor, radius = 5 
*/ 
```

根据 [Java Class Loading: an example](/java/2009/03/25/class-loading-an-example)，调用 `RoundGlyph` 的构造器时，会先调用 `Glyph` 的构造器。`Glyph` 的构造器里调用了一个被覆写方法 `draw()`。这里我们惊奇地发现：虽然 `RoundGlyph` 对象还没有创建完毕，但 `Glyph` 的构造器却实际调用了 `RoundGlyph` 的 `draw()` 方法 (覆写方法)，而且 `radius == 0`。  

而 [JVM-Spec 2.17.6 - Creation of New Class Instances](https://docs.oracle.com/javase/specs/jvms/se6/html/Concepts.doc.html#24383) 最后一段有：

> If methods are invoked that are overridden in subclasses in the object being initialized, then these overriding methods are used, even before the new object is completely created.

由此，我们可以对 [Java Class Loading: an example](/java/2009/03/25/class-loading-an-example) 做一些补充，即在调用 ext class 的 constructor 时，会有如下的过程：

1. 将分配给该 ext class object 的内存空间全部初始化为 0x00 (即用 0x00 填满该段内存空间)；
2. 调用 base class 的 constructor。如果 base class 的 constructor 有使用被覆写方法的话，则实际调用 ext class 中的覆写方法。由于上一个步骤的原因，此时 ext class 中各 field 均为 0；
3. base class 的 constructor 调用完毕后后，开始初始化 (包括默认初始化) ext class 的 member；
4. 调用 ext class 的 constructor。

_2009年09月04日归纳_：[Java Class Loading: further discussion involving steps of instance creation](/java/2009/09/04/class-loading-further-discussion-involving-steps-of-instance-creation)