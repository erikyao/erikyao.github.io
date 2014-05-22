---
layout: post
title: "Java 多线程：终止线程的方法"
description: ""
category: Java
tags: [Java-101, Java-Concurrent]
---
{% include JB/setup %}

　　虽说 Thread 类提供了 stop() 和 suspend() 方法，但这两种方法过于粗暴，如果线程占用了一些资源（如打开了一个文件，建立了一个数据库连接什么的），直接 stop() 或是 suspend() 是会产生问题的。

　　要终止 Thread，最好的方法就是让 run() 方法正常运行完毕，不过有的 run() 方法里面直接是一个 while (true)，这时就要使用一些特殊的手段。

## 1. 使用中断

　　基本思想就是在 run() 方法中的 while (true) 里检查线程是否中断，如果中断就退出（当然，退出之前可以做一些关闭资源的操作）；这么一来在主线程中就可以调用 Thread.interrupt() 来中断线程，进而使线程退出。 

<pre class="prettyprint linenums">
public class Runner3 implements Runnable {     
	@Override    
	public void run() {     
		while(true) {     
			System.out.println(new Date());     
				 
			long time = System.currentTimeMillis();     
			while (System.currentTimeMillis() - time < 1000) {     
				// 不使用Thread.sleep(1000)     
				// 使用while来消耗一秒钟时间     
			}     
				 
			if (Thread.currentThread().isInterrupted()) { // 时刻检查该线程是否中断     
			// 或者使用 if (Thread.interrupted()) {     
				return; // 如果线程中断就退出     
			}     
		}     
	}     
}    
</pre>

<pre class="prettyprint linenums">
public class MultiThreadTest3 {     
    public static void main(String[] args) {     
        Runner3 r = new Runner3();     
    
        Thread t = new Thread(r);     
        t.start();     
             
        try {     
            Thread.sleep(10000);     
        } catch (InterruptedException e) {     
            // do nothing     
        }     
             
        t.interrupt(); // 中断Thread t，使run()方法退出，线程结束     
    }     
}    
</pre>

如果在 run() 方法中的 while (true) 里有可能导致 InterruptedException 的操作，那么退出 run() 方法的代码可以放在 catch 语句里。

<pre class="prettyprint linenums">
public class Runner2 implements Runnable {  
	@Override  
	public void run() {  
		while(true) {  
			System.out.println(new Date());  
			  
			try {  
				Thread.sleep(1000);  
			} catch (InterruptedException e) {  
				return; // 发生中断异常时，线程直接退出  
			}  
		}  
	}  
}   
</pre>

<pre class="prettyprint linenums">
public class MultiThreadTest2 {     
	public static void main(String[] args) {     
		Runner2 r = new Runner2();     
	
		Thread t = new Thread(r);     
		t.start();     
			 
		try {     
			Thread.sleep(10000);     
		} catch (InterruptedException e) {     
			// do nothing     
		}     
			 
		t.interrupt(); // 中断Thread t，使t.sleep()时产生中断异常，进而终止线程     
	}     
}    
</pre>

## 2. 使用标志位

　　使用标志位 boolean flag，将 run() 方法中的 while (true) 改为while (flag)（轮询标志位），主线程中就就可以通过修改 flag 来退出线程。

<pre class="prettyprint linenums">
public class Runner4 implements Runnable {  
	private boolean flag = true;  
	  
	public void setFlag(boolean flag) {  
		this.flag = flag;  
	}  
  
	@Override  
	public void run() {  
		while(flag) {  
			System.out.println(new Date());  
			  
			long time = System.currentTimeMillis();  
			while (System.currentTimeMillis() - time < 1000) {  
				// 不使用Thread.sleep(1000)  
				// 使用while来消耗一秒钟时间  
			}  
		}  
	}  
}  
</pre> 

<pre class="prettyprint linenums">
public class MultiThreadTest4 {  
	public static void main(String[] args) {  
		Runner4 r = new Runner4();  
  
		Thread t = new Thread(r);  
		t.start();  
		  
		try {  
			Thread.sleep(10000);  
		} catch (InterruptedException e) {  
			// do nothing  
		}  
		  
		r.setFlag(false); // 设置标志位，使run()方法退出，线程结束  
	}  
}  
</pre>

这个方法有一个缺点：如果 while (flag) {...} 方法阻塞了，则 flag 的设置会失效。 

## 3. 最好的方法是使用线程池

　　当线程不用了，就让它 sleep 并放进队列中，这样可以最大限度地利用资源。

<br/>

_2010-10-04补充_：

　　注意这里说的退出是这样的一种情况：主线程（比如说 main 方法）创建了一个 Thread t，然后想在主线程中使t退出。  
　　文章一开始说的 stop()、suspend() 方法的问题是：主线程一句 t.stop() 或是 t.suspend() 就了事了，t 在 run() 方法中没有机会去关闭资源，不像中断或是轮询标志位的方法中，t 在 run() 方法里还握有一点主动权

_2011-11-03补充_：

　　方法 2 可以使用的一个优化步骤是将标志位设置为 volatile