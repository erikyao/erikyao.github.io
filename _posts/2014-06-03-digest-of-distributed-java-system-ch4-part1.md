---
layout: post
title: "《分布式 Java 应用：基础与实践》第四章总结其一：集合类"
description: ""
category: Java
tags: [Book, Java-101]
---
{% include JB/setup %}

ArrayList: 非线程安全  
LinkedList: 非线程安全
  
Vector: 用 synchronized 实现的线程安全的 ArrayList  
Stack: 继承自 Vector  

HashSet: 非线程安全。其实是用 HashMap 实现的，一个 HashSet<E> 的内部包含一个 HashMap<E,Object>，但是 map 的 value 是没有作用的，永远是这个 dummy object

```java
// Dummy value to associate with an Object in the backing Map
private static final Object PRESENT = new Object(); 
```

HashMap: 非线程安全，且多线程下，get() 有可能导致 high CPU。多线程下请使用 ConcurrentHashMap  
  
TreeMap: 非线程安全，排序是一个红黑树实现  
Hashtable: HashMap 的历史版本，功能不及 HashMap，但是是线程安全的  
