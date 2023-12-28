---
category: Java
description: ''
tags:
- JVM
title: 'Java Class Loading: an example'
---

class loading 是一个比较复杂的过程。一般说来，类是在其 static member 被访问时被加载的。在加载时会做的一件事是：初始化 static member 和 static 代码段 (static block, i.e. `static {......}`)，当然，static 是只会被执行 only once 的。

以下是一个例子 (adapted from _Chapter 7, Thinking in Java, Fourth Edition_)：

```java
import static java.lang.System.out;  
  
class Insect {  
    private int i = 1;  
    protected int j;  
    private static int x1 = printInit("static Insect.x1 initialized");  
      
    Insect() {  
        out.println("Insect constructor");  
        out.println("i = " + i + ", j = " + j + ", x1 = " + x1);  
        this.j = 2;  
    }  
      
    static int printInit(String s) {  
        out.println(s);  
  
        return 3;  
    }  
}  
  
public class Beetle extends Insect {  
    private int k = printInit("Beetle.k initialized");  
    private static int x2 = printInit("static Beetle.x2 initialized");  
      
    public Beetle() {  
        out.println("Beetle constructor");  
        out.println("j = " + j + ", k = " + k + ", x2 = " + x2);  
    }  
   
    public static void main(String[] args) {  
        Beetle b = new Beetle();  
    }  
}  
//output:  
/* 
    static Insect.x1 initialized 
    static Beetle.x2 initialized 
    Insect constructor 
    i = 1, j = 0, x1 = 3 
    Beetle.k initialized 
    Beetle constructor 
    j = 2, k = 3, x2 = 3 
*/ 
```

1. 首先，访问 `Beetle.main()`，是个 static，好，加载 Beetle.class；
    * 发现 `Beetle extends Insect`，好，加载 Insect.class (如果 Insect 还有 base class，则持续这一过程，直到找到 root base class)；
        * 初始化 `private static int x1` (=3)，打印 "static Insect.x1 initialized"；
		* Insect.class 加载完毕
    * 继续加载 Beetle.class；
        * 初始化 `private static int x2` (=3)，打印 "static Beetle.x2 initialized"；
		* Beetle.class 加载完毕，
2. 开始执行 `Beetle.main()`；
    * 要 new 一个 `Beetle`，须先 new 一个 `Insect`；
	    * 在执行 `Insect` constructor 前，先要初始化 member，由于 `private static int x1` 是 static 且已经初始化了，所以这次只初始化 `private int i` (=1) 和 `protected int j` (=0 by default)；
		* 执行 `Insect` constructor，打印 "Insect constructor" 和 "i = 1, j = 0, x1 = 3"，然后 `j = 2`；
		* `Insect` constructor 执行完毕，即 new Insect 过程完毕
    * 继续 `new Beetle()`；
	    * 同理，在执行 `Beetle` constructor 之前，要先初始化 member，这里是初始化 `private int k` (=3)，打印 "Beetle.k initialized"；
		* 执行 `Beetle` constructor，打印 "Beetle constructor" 和 "j = 2, k = 3, x2 = 3"；
		* `Beetle` constructor 执行完毕，即 `new Beetle()` 过程完毕
3. `Beetle.main()` 执行完毕。

<br/>

_2009年03月27日补充_：more details see [warning: 在构造器中请谨慎使用被覆写方法](/java/2009/03/27/using-overridden-method-in-constructor-is-dangerous)

<br/>

_2009年09月04日归纳_：[Java Class Loading: further discussion involving steps of instance creation](/java/2009/09/04/class-loading-further-discussion-involving-steps-of-instance-creation)