---
layout: post
title: "the proxy parameter of the invoke() method"
description: ""
category: Java
tags: [Java-101, Java-AOP, Proxy, 动态代理]
---
{% include JB/setup %}

　　关于动态代理，一般的代码结构为：一个业务接口、一个业务接口的实现、一个自定义的 InvocationHandler 实现和 main 类，如下：

<pre class="prettyprint linenums">
import java.lang.reflect.*;

interface Inf {
	public void print(String s);
}

class Imp implements Inf {
	public void print(String s) {
		System.out.println(s);
	}
}

class MyProxyHandler implements InvocationHandler {
	private Object target;

	public MyProxyHandler(Object target) {
		this.target = target;
	}

	@Override
	public Object invoke(Object proxy, Method method, Object[] args)
			throws Throwable {
		return method.invoke(target, args);
	}
}

public class ProxyTest {
	public static void main(String[] args) {
		Inf infProxy = (Inf) Proxy.newProxyInstance(Inf.class.getClassLoader(),
				new Class[] { Inf.class }, new MyProxyHandler(new Imp()));

		infProxy.print("Hello World");
	}
}
</pre>

　　其中 newProxyInstance 虽然返回的是 Object，但只能转换成 Interface；newProxyInstance 同时也相当于起到一个“注册”的作用，即注册 infProxy 使用参数一来加载 (Inf.class.getClassLoader())、实现了参数二所示的一系列 Interface (这里用 Class 类来表示)、具体使用参数三的实现 (即 infProxy 代理的是 Imp，通过 MyProxyHandler 来中转)。  

　　这里说的“中转”，其实是通过 invoke 方法。针对 infProxy.print("Hello World")，我们会发现，invoke 的三个参数中，Method method 是 print，Object[] args 是 "Hello World"，Object Proxy 根本没有使用，而且我们在 MyProxyHandler 中还添加了一个 Object target 来接收 new Imp()。  

　　按照 [JDK文档](http://docs.oracle.com/javase/7/docs/api/java/lang/reflect/InvocationHandler.html) 的说法：

> proxy - the proxy instance that the method was invoked on

　　查到的 [一篇博文](http://tutorials.jenkov.com/java-reflection/dynamic-proxies.html) 有说：

> The proxy parameter passed to the invoke() method is the dynamic proxy object implementing the interface. Most often you don't need this object. 

　　曾经我很困惑：“这个 proxy 参数倒是是干嘛用的？” 其实也不是啥大不了的事：你 MyProxyHandler 不是自己加了个 Object target 来接收 new Imp() 么？那我同样也可以加一个 Object proxy 来接收 new ImpProxy() 啊。这里 invoke 让你可以用三个参数来实现，看你个人喜欢。  

　　最后感谢 [chaisencs](http://chaisencs.iteye.com/) 网友提到：

> 你去看一下这个类 RemoteObjectInvocationHandler 的源代码，就知道参数 proxy 其实是有用的