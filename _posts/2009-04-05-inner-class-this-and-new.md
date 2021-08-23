---
layout: post
title: "Java 内部类：对外部类的访问及 .this 和 .new"
description: ""
category: Java
tags: [Java-InnerClass]
---
{% include JB/setup %}

```java
class Outer {   
	public class Inner {   
		public String getInnerClassName() {   
			return Inner.this.getClass().toString(); // 'Inner' can be omitted here   
		}  
		  
		public String getOuterClassName() {   
			return Outer.this.getClass().toString(); // 'Outer' CANNOT be omitted here   
		}   
	}   
	  
	public Inner createInner() {   
		return new Inner(); 
		// return this.new Inner(); // also OK here   
	}   
}   
  
public class InnerTest {   
	public static void main(String[] args) {   
		Outer o = new Outer();   
		Outer.Inner i1 = o.new Inner();   
		Outer.Inner i2 = o.createInner();   
		  
		System.out.println(i1.getOuterClassName());   
		System.out.println(i2.getInnerClassName());   
	}   
}   
  
//output:   
/*  
	class Outer 
	class Outer$Inner  
*/  
```

## .new

内部类对象是不能直接创建的。必须先创建一个外部类对象，再由这个外部类对象来创建内部类对象。这样处理可能是为了体现内部类对象是依存外部类对象存在的，即内部类对象不能脱离外部类对象而存在。一个外部类对象可以创建多个内部类对象 (类似 Process 与 Thread 的关系)。创建方法有2种：  

* `OuterClassObj.new InnerClass()`：即使用 `.new` 和内部类构造器，如上面代码中的：

```java
	Outer.Inner i1 = o.new Inner(); 
```

* `OuterClassObj.InnerClassConstructorProxy()`：即使用在外部类中定义的内部类构造器的代理方法，如上面代码中的：

```java
    Outer.Inner i2 = o.createInner(); 
```
 
上面2种方法其实是等价的。  

这里注意，内部类的声明类型必须是 `Outer.Inner`，编译出的文件为 `Outer$Inner.class`。

---

## .this

其实可以把 `this` 当作 class 的一个 static field，就算不用内部类，也可以照样用 `class.this` 形式，如上面代码中的：  

```java
public String getInnerClassName() {   
	return Inner.this.getClass().toString(); // 'Inner' can be omitted here   
}  
```

不过鉴于内部类和外部类的特殊关系，内部类必须能够访问其创建者，所以在内部类中可以使用 `Outer.this` 来指向创建这个内部类对象的外部类对象。如： 

```java
public String getOuterClassName() {   
	return Outer.this.getClass().toString(); //'Outer' CANNOT be omitted here   
}  
```
 
总结一点，`.this` 与 class 连用 (比如 `Outer.this`)，`.new` 与 reference 连用 (比如 `o.new`)。 

---

## 对外部类的 field 和 method 的访问

就如同我们在一般类的方法或是 constructor 中省略 `this` 一样，内部类的方法也是如此，只是内部类中省略的是 `this` (i.e. `Inner.this`) 和 `Outer.this` 这 2 个 `this`。所以 **看上去** 在内部类的方法中可以直接访问外部类的 field/method，而且无论是哪种访问权限的 field/method 都可以访问，其实是因为内部类方法中可以通过 `Outer.this` 链接到外部类，由外部类来访问外部类的 field/method，自然是可以不考虑访问权限了。  

如果内部类和外部类有 _**同名**_ 的 field/method，单纯使用 `SameFieldName` 或是 `SameMethodName()` _**会被优先识别为内部类的**_ field/method，如果想要用外部类的 field/method，必须用 `Outer.this` 来指定。  

如果你手中只有内部类对象，比如 `i1`、`i2`，这样是无法直接访问外部类的 field/method 的，因为外部类的 field/method 并不属于内部类，类似 `i1.OuterField` 或是 `i2.OuterMethod()` 是无法通过编译的。所以 `i1`、`i2` 想要访问外部类的 field/method 只能间接通过内部类的方法。  

总之，简单的说，内部类对象要想访问外部类对象的 field 或是 method 的话，必须要先获得创建自己的外部类对象的引用。