---
layout: post
title: "依赖、依赖注入（DI）以及控制反转（IoC）"
description: ""
category: Spring
tags: [Spring-101, Java-DesignPattern]
---
{% include JB/setup %}

## 1. 何为依赖

　　不管是面向对象，还是面向过程，一个应用总会分成许多的模块，然后由这些模块协同工作完成任务。要协同工作就会产生依赖，如一个方法调用另一个方法、一个对象包含另一个对象，这些都是依赖关系。  

　　比如：类 A 要包含对象 b 的话，就需要在 A 里 B b =  new B()，这里明显是类 A 依赖对象b

## 2. 何为依赖注入

　　Dependency Injection，我讨厌翻译，后续就用 DI 表示好了。  

　　所谓DI，就是由容器动态的生成依赖关系，应用可以方便的获取依赖 (通俗地说就是类 A 不用再亲自 B b = new B() 来获取 b 对象)。从外表上看，就好像是容器将生成的依赖关系注入到应用之中。

## 3. DI 的3种实现方式

* Interface Injection: 类 A 里不是用对象b，而是接口 IB 的实现 ib，ib 由外部创建并传入类 A，类 A 不负责创建工作，如：

```java
public class A {  
	private InterfaceB ib;  
	  
	public Object doSomething(InterfaceB impB) {  
		ib = impB;  
		return ib.doIt();  
	}  
}  
```

最典型的例子的是 doGet()、doPost() 方法：

```java
public class HelloServlet extends HttpServlet {  
	public void doGet(HttpServletRequest req, HttpServletResponse resp)   
		throws IOException {
		...
	}  
}  
```

这里要注意的是，HttpServletRequest、HttpServletResponse 都是接口，不要再当成是对象了。  

* Setter Injection: 容器来构造 B b = new B()，再使用类 A 的 setter 将 b 注入类 A。不需要类 A 自己动手，只需要类 A 留一个 setter 即可。如 Spring 中 bean.xml 的段

```xml
<bean id="TheAction" class="org.xxx.spring.UpperAction">  
	<property name="message">  
		<value>HeLLo</value>  
	</property>  
</bean>
```

就指定了调用 UpperAction 的 setMessage("HeLLo")。

* Constructor Injection: 与 Setter Injection 相对，Construction Injection 就是不使用 setter，而是把对象 b 直接作为参数传给类 A 的构造器。但是容易造成构造器参数列表过长。

## 4. 控制反转

　　实际是 Inversion of Control，“控制的反转”，还是用 IoC 表示好了。

　　IoC，用白话来讲，就是由容器控制程序之间的关系，而非传统实现中，由程序代码直接操控。这也就是所谓 “控制反转” 的概念所在：控制权由应用代码中转到了外部容器，控制权的转移，是所谓反转。
