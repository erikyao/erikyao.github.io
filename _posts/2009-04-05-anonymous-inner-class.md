---
layout: post
title: "Java: 匿名内部类 (anonymous inner class)：简化形式及自动向上转型"
description: ""
category: Java
tags: [Java-InnerClass]
---
{% include JB/setup %}

内部类的一个重要作用是隐藏继承或是对接口的实现，典型的形式是：内部类来继承或是实现接口，由外部类提供代理 constructor 方法。这些代理 constructor 方法一般都利用的向上转型，即不返回内部类对象，而是返回内部类继承的父类对象或是实现的接口对象。如：

```java
interface Intf {...}  
  
class Outer {  
	class Inner implements Intf {...}  
  
	public Intf createInner() {  
		return new Inner();  
	}  
} 
```

而匿名内部类实际是对上述代码的简化，如：

```java
interface Intf {...}  
  
class Outer {  
	public Intf createInner() {  
		return new Intf() {...};  
	}  
}  
```

这里的匿名内部类表示：我要创建一个 implements Intf 的 class，这个 class 的定义是 `{...}`。由于这个 class 没有名字，我们用的是 `new Intf()`，可以看作是自动的向上转型。  

<br/>

_2014-05-18补充_：匿名内部类可以是继承，不一定是 `new Intf()` 

```java
public class InnerBase {  
	...
}  
  
public class Outer {
	private InnerBase ib = new InnerBase() {
		@Override
		public String toString() {
			return "whatever";
		}
	};
}
```

_4月7日补充_：匿名内部类的另一种用法

```java
interface Intf {  
	int sum();  
}  
  
public class Outer {  
	public static int getSum() {  
		return new Intf() {  
			public int sum() {  
				return 1;  
			}  
		}.sum();  
	}  
	  
	public static void main(String[] args) {  
		System.out.println(getSum());  
	}  
} 
```

因为对匿名内部类的使用是直接 new 一个匿名内部类对象，所以也可以直接使用这个对象的方法或是域。  

_7月27日补充_：匿名内部类的另一种用法

```java
interface Intf {...}  
  
class Outer {  
	public Intf createInner() {  
		return new Intf() {  
			// Anonymous inner class CANNOT have a named constructor  
			// only an instance initializer here  
			{  
				......  
			}  
  
			// method allowed here  
			return-type xxx(arg list) {  
				......  
			}   
		};  
	}  
}  
```

匿名内部类没有构造器， **只能** 有一个 initializer (当然，你不用也可以)；另外，可以在匿名内部类中写方法。