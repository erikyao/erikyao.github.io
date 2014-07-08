---
layout: post
title: "《分布式 Java 应用：基础与实践》第四章总结其二：并发工具类"
description: ""
category: Java
tags: [Digest, Java-Concurrent]
---
{% include JB/setup %}

### XxxBlockingQueue

* ArrayBlockingQueue: 基于数组的，FIFO 的，线程安全的 Queue
* LinkedBlockingQueue: 性能更好

### AtomicXxx

* AtomicInteger: 使用 CAS 自增的 Integer
* AtomicBoolean: 使用 CAS 做赋值的 Boolean，常见的用法：init方法只用执行一次，但可能被多个线程调用，此时可以加一个 AtomicBoolean 的 flag

### FutureTask

　　跑个例子看看：

<pre class="prettyprint linenums">
private ConcurrentMap&lt;String, FutureTask&lt;FooConnection&gt;&gt; connectionPool = 
	new ConcurrentHashMap&lt;String, FutureTask&lt;FooConnection&gt;&gt;();

public FooConnection getConnection(String key) throws InterruptedException, ExecutionException {
	FutureTask&lt;FooConnection&gt; connectionTask = connectionPool.get(key);
   
	// 有 key，直接返回
	if (connectionTask != null) {
		return connectionTask.get();
	}
   
	// 无 key，需要 new 一个 &lt;key, FutureTask&lt;FooConnection&gt;&gt;
	Callable&lt;FooConnection&gt; connectionBuilder = new Callable&lt;FooConnection&gt;() {
		@Override
		public FooConnection call() throws Exception {
			return new FooConnection();
		}
	};
	FutureTask&lt;FooConnection&gt; newTask = new FutureTask&lt;FooConnection&gt;(connectionBuilder);
   
	/**
	 * putIfAbsent 相当于：
	 * {@code
	 *      if (!map.containsKey(key))
	 *          return map.put(key, value);
	 *      else
	 *          return map.get(key);
	 * }
	 *
	 * 注意这里 map.put() 的返回值是 the previous value associated with key, or null if there was no mapping for key。
	 * 在 !map.containsKey(key) 的情况下，一定是返回 null。
	 *
	 * putIfAbsent() is thread-safe
	 */
	connectionTask = connectionPool.putIfAbsent(key, newTask);
   
	// 返回 null 也说明，&lt;key, newTask&gt; 是 map 中的新值，所以我们接着 run 一下
	if (connectionTask == null) {
		connectionTask = newTask;
		connectionTask.run();
	}
   
	return connectionTask.get();
}
</pre>

### Semaphore

　　原意是 “臂板信号系统”，就是这种铁路上用的。  

->![](https://7atftq.bn1.livefilestore.com/y2pEhkFoMyL6Mf8GUTCEN9DdnASBVoozkF2fzp-e4B40QYrkjJ9tAibAjn6ux_XHCZ0tfxRt-UJsGcIA_fPdbca-VK7YAB17W9W-A3YEjImFQs/Semaphore.png?psid=1)<-

　　可以类比于 “地铁口的闸机” 或者 “收费站的栏杆”，是一种准入机制。同时，Semaphore 可以带数量限制，比如面试时是 5 个 5 个一组，那么 HR 那里就有一个 Semaphore(5)，每次最多只能放 5 个人进来。

### CountDownLatch

　　Latch 的原意是 “门闩”

* await(): 将当前线程放入 CountDownLatch 的内部队列进行等待
* coutnDown(): 信号量减 1，当信号量减为 0 时，notify 队列中的所有进程

### CyclicBarrier

　　cyclic: 周期的，循环的；轮转的  
　　barrier: 障碍  

　　与 CountDownLatch 不同，它是等待 await 的线程数量到达一定阈值后才能继续执行。类比于那种 “一定要坐满 XX 人才发车的巴士”

### ReentrantLock: 

　　[API 在此](http://docs.oracle.com/javase/7/docs/api/java/util/concurrent/locks/ReentrantLock.html)  

　　说它 “可重入”，应该是指它内部的 state 不止 0 和 1 两种状态，同一个线程 lock 两次的话，state 可能为 2，而且重复加锁不会造成 blocking（你重复 synchronized 试试！）。[更具体的说明](http://stackoverflow.com/questions/1312259/what-is-the-re-entrant-lock-and-concept-in-general)  

　　注意 fair 和 unfair 两种策略的主要区别在于 “当持有锁的线程结束后，如何重新分配锁”，unfair 是自由竞争，fair 是分配给等待时间最长的线程

### ReentrantReadWriteLock:

1. ReentrantReadWriteLock 和 ReentrantLock 没有继承关系
2. ReentrantReadWriteLock 内部分离了读锁和写锁

	<pre class="prettyprint linenums">
	ReentrantReadWriteLock rrwLock = new ReentrantReadWriteLock();
	ReadLock readLock = rrwLock.readLock();
	WriteLock writeLock = rrwLock.writeLock();
	</pre>

3. [when readLock.lock()](http://docs.oracle.com/javase/7/docs/api/java/util/concurrent/locks/ReentrantReadWriteLock.ReadLock.html#lock(\)): 

	> Acquires the read lock if the write lock is not held by <font color="red">another</font> thread and returns immediately.   
	> <br/>
	> If the write lock is held by <font color="red">another</font> thread then the current thread becomes disabled for thread scheduling purposes and lies dormant until the read lock has been acquired, <font color="red">i.e current thread gets blocked</font>. 

	意味着 “如果有线程在写操作，不准任何线程来读；没有写操作时，大家都可以来读”

4. [when writeLock.lock()](http://docs.oracle.com/javase/7/docs/api/java/util/concurrent/locks/ReentrantReadWriteLock.WriteLock.html#lock(\)): 

	> Acquires the write lock if neither the read nor write lock are held by another thread and returns immediately, setting the write lock hold count to one.  
	> <br/>
	> If the current thread already holds the write lock then the hold count is incremented by one and the method returns immediately.  
	> <br/>
	> If the lock is held by another thread then the current thread becomes disabled for thread scheduling purposes and lies dormant until the write lock has been acquired, at which time the write lock hold count is set to one.

	若有<font color="red">其他</font>线程持有 writeLock 或者 readLock，则不可获取 writeLock，当前线程 blocking。意味着 “只要有读写操作时，不准新的写操作进来”。可见 “<font color="red">readlock可以有多个，但是writeLock只能有一个</font>”

5. 注意 3. 中的 "<font color="red">another</font>"。如果是同一个线程内，writeLock.lock() 成功后再 readLock.lock()，同一个线程不算是 "<font color="red">another</font> thread"，所以不会引起 blocking，线程同时获取到 writeLock 和 readLock。此时如果再 writeLock.unlock() 一下，我们就称为 “writeLock 降级（downgrade）为 readLock”
6. 与 5. 同理，4. 中也说的是 "<font color="red">another</font>"，但是 but somehow，在同一线程内，readLock.lock() 成功后再 writeLock.lock() 是不会成功的，而且会造成死锁。称为 “readLock 不可升级（upgrade）为 writeLock”
7. 适用于 “读多写少” 的场景




### CopyOnWriteArrayList

　　适合读多写少的并发场景

* add(E): 

	1. ReentranLock 加锁
	2. newInnerArray = copy(innerArray); 
	3. newInnerArray.append(E);
	4. assign newInnerArray to CopyOnWriteArrayList; leave innerArray to GC
	5. ReentranLock 解锁

* remove(E): 与 add 类似，也是 ReentranLock 加锁，复制一个新的 array，将没有被删除的元素填到新的 array 中，旧的 array 被抛弃
* get(int): 没有加锁保护，可能读到脏数据
* interator: 会在 array 的 snapshot 上遍历，所以不会有 ConcurrentModificationException