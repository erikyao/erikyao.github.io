---
category: Java
description: ''
tags:
- Java-Concurrency
title: Java 多线程：synchronized
---

首先明确一点，同步方法本质上也是一个同步控制块（仅针对于锁定 `this` 的情况，如果同步控制块锁定的不是 `this`，那么它是不能直接改写为同步方法的），区别在于同步方法的粒度是整个方法，而同步控制块的粒度可以是方法的一部分。

```java
// 同步方法示例  
public class Counter {  
	int count;  
	static int classCount;  
	  
	public synchronized void bump() {  
		System.out.println("bump() starts");  
		count++;  
		try {  
			Thread.sleep(1000);  
		} catch (InterruptedException e) {  
			e.printStackTrace();  
		}  
		System.out.println("bump() ends");  
	}  
	  
	public static synchronized void classBump() {  
		classCount++;  
		System.out.println("classBump()");  
	}  
}  
  
// 同步方法可以等价地写成同步控制块  
public class Counter {  
	int count;  
	static int classCount;  
	  
	public void bump() {  
		synchronized (this) {  
			// ...  
		}  
	}  
	  
	public static void classBump() {  
		synchronized (Counter.class) {  
			// ...  
		}  
		  
		// 或者不用Counter.class，用Class.forName()  
		/** 
		try { 
			synchronized (Class.forName("Counter")) { 
				// ... 
			} 
		} catch (ClassNotFoundException e) { 
			e.printStack(); 
		} 
		*/  
	}  
}  
```

从这个例子可以看出，Class 锁（针对 static 方法）和 Object 锁（针对非 static 方法）是两种锁。从实验的结果来看，这两种锁是不冲突的，即：假设有 `Counter c = new Counter();`，如果 `Thread A` 调用 `c.bump()` 方法，那么 `synchronized(this)` 只是锁定了 `c` 这个对象，`Thread B` 可以无所顾忌地调用 `Counter.classBump()`（或者 `c.classBump()` 也可以），不用等待 `Thread A` 释放 `c` 的锁。如：

```java
public class MultiThreadTest8 {  
	public static void main(String[] args) {  
		final Counter c = new Counter();  
		  
		Thread t1 = new Thread(  
				new Runnable() {  
					@Override public void run() {  
						c.bump();  
					}  
				}, "Runner 1");  
		  
		Thread t2 = new Thread(  
				new Runnable() {  
					@Override public void run() {  
						//Counter.classBump();  
						c.classBump();  
					}  
				}, "Runner 2");  
		  
		t1.setPriority(Thread.NORM_PRIORITY + 2);  
		t1.start();  
		t2.start();  
		  
		// output:   
		/** 
			bump() starts 
			classBump() 
			bump() ends      
		*/  
	}  
}  
```

不过一旦 `Thread A` 调用 `c.bump()`，锁定了 `c`，那么 `Thread B` 就不能调用 `c.bump()` 了，`c` 中的其他同步方法或是同步控制块 `Thread B` 也不能访问，只有等到 `Thread A` 释放 `c` 的锁（即 `c.bump()` 同步部分执行完）。`Counter` 的非同步方法不受锁的限制，即使 `Thread A` 锁定了 `c`，`Thread B` 也可以随意访问 `c` 的非同步方法。

<br/>

_p.s._ 这里说锁定一个对象，并不是说属性不能访问，锁定对象只是锁定同步方法或是同步控制块，使同步方法或是同步控制块的执行不会被其他线程打断（可以理解为：锁定方法到一个线程）。如果有一个同步方法去修改某个字段，此时是可以有另一个非同步方法也去修改这个字段，这样仍然有可能产生数据不一致的情况。  

_p.s._ synchronized 关键字可以放在类的前面，表示类中的所有方法都是同步方法。

_p.s._ 实际工作经验告诉我们：不管是多小的 `synchronized` 方法体，多线程下一样会非常卡，自己的并发测试都很难通过……