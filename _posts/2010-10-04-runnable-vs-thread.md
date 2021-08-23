---
layout: post
title: "Java 多线程：Runnable 接口 v.s. Thread 类"
description: ""
category: Java
tags: [Java-Concurrency]
---
{% include JB/setup %}

```java
public class Runner implements Runnable {  
	@Override  
	public void run() {  
		for(int i = 0; i < 100; i++) {  
			System.out.println("Runner runs to --> " + i);  
		}  
	}  
}  
```

```java
public class MultiThreadTest {  
  
	public static void main(String[] args) {  
		Runner r = new Runner();  
		//r.run(); // 方法调用，没有启动新线程  
  
		Thread t = new Thread(r);  
		//t.run(); // 方法调用，没有启动新线程  
		t.start(); // 启动新线程  
		  
		for(int i = 0; i < 200; i++) {  
			System.out.println("Main goes " + i);   
		}  
	} 
}  
```

`Runnable` 接口和 `Thread` 类的关系：

1. 首先有 `Thread implememts Runnable`
2. 虽说 `Runnable` 有一个方法 `run()`，但基本上 `Runnable` 可以看做是一个标记接口；`Runnable` 本身并不提供多线程机制，只有 `Thread` 类才能启动新线程；`Runnable` 的实现类只有传递给 `Thread` 构造器才有意义
3. `Thread.run()` 默认会调用传递给 `Thread` 构造器的 `Runnable` 实现类的 `run()`，如果没有 `Runnable` 实现类传进来的话，`Thraed.run()` 方法什么都不做直接返回
4. `Thread.run()` _**并不能**_ 启动新线程（相当于一般的方法调用，直接调用 `Runnable` 实现类的 `run()` 方法亦是如此），_**只有**_ `Thread.start()` 方法才能启动新线程；`Thread.start()` 方法会调用 `Thread.run()` 方法
5. 定制自己的线程类的方法：

	* `class Runner implements Runnable`，实现 `run()` 方法，然后 `Thread t = new Thread(new Ruuner()); t.start();`
	* `class MyThread extends Thread`，覆写 `run()` 方法，然后 `MyThread mt = new MyThread(); mt.start();`

	这两种方式又涉及到 "接口还是继承" 的设计原则问题了