---
layout: post
title: "class loading: further discussion involving steps of instance creation"
description: ""
category: Java
tags: [Java-101]
---
{% include JB/setup %}

　　本文对 [initializer](/java/2009/03/19/initializer/)、[class loading: an example](/java/2009/03/25/class-loading-an-example/)、[warning: 在构造器中请谨慎使用被覆写方法](/java/2009/03/27/using-overridden-method-in-constructor-is-dangerous/) 做统一归纳。

---

　　一个类在能够被程序使用之前，必须经历三个准备工作 (以下统称为类的执行)：

1. loading
2. linking
    2. verification
	2. preparation
	2. resolution (optional)
3. inintialization

　　在 [class loading: an example](/java/2009/03/25/class-loading-an-example/)、[warning: 在构造器中请谨慎使用被覆写方法](/java/2009/03/27/using-overridden-method-in-constructor-is-dangerous/) 中，我们使用的loading (加载)，其实是统指了以上三个步骤。

　　loading 指从 \.class 文件中读取类的 binary representation (即类的 Class 对象) 的过程。  

　　verfication 过程验证 binary representation 的结构是否正确。  

　　preparation 过程为类的 static field 申请空间并赋默认值，同时为类的一些内部数据结构 (如方法列表) 申请空间。  

　　resolution 过程分析类中的引用。resolution 过程是一个 optional 的过程，在 resolution 过程中可以有不同的 loading 策略，比如说，在 resolve class A 的时候，发现 class A 中有一个 class B 的引用，此时可以立即加载 class B，也可以 do nothing。  

　　initialization 过程执行 static initializer 和 initializer for static field (i.e. static variable initializer)。如：

<pre class="prettyprint linenums">
private static int i = 5; // static variable initializer  
  
// static initializer  
static {  
	......  
}
</pre>

　　以下 _**不**_ 属于 initialization 阶段执行的代码：

<pre class="prettyprint linenums">
private int i = StaticFunction(); // 虽然涉及到了 static 方法，不过 field 不是 static，不能算是 static variable initialzer  
  
//虽然是对 static field 初始化，但这个 initializer 本身不是 static，依旧不能算是 static initializer  
{  
	StaticField = xxx;  
	......  
}
</pre>

　　由于 loading 和 linking 过程是 implementation-dependent，且不方便追踪和查看，所以暂不讨论 loading 和 linking 的触发条件。以下着重讨论 initialization。

　　initialization 三原则：

1. 触发原则：以下三种场景 _**执行之前**_ 会触发 initialization
    * 创建类的实例 (constrcutor or Class.newInstance())
	* 调用类的 static 方法 (包括 constructor)
	* _**非**_ final 的 static field is used or assigned
2. 父类原则：子类 initialization 之前，其 direct 父类必须 initialization，and so recursively. (p.s. 类实现的接口无需 initialization，类实现的接口的父接口亦无需如此)
3. 引发原则：如果子类 initialization 引发了父类的 initialization，而此时父类还没有 loading 和 linking，则父类的 loading 和 linking 也会被引发 (_p.s._ 我觉得子类的 initialization 同样可以引发子类的 loading 和 linking，如果 loading 和 linking 还没有执行的话)。  

　　这里需要着重强调的是：loading、linking 和 initialization 都是类的行为 (class behavior) (所以 initialization 执行的都是 static)，而实例的创建 (constructor or Class.newInstance()) 则是对象行为 (object behavior)。  

　　constructor 执行的过程：

1. 执行 this() or super()
2. 执行 initializer 和 non-static variable initializer
3. 执行 constructor 的余下部分

---

回头看 [class loading: an example](/java/2009/03/25/class-loading-an-example/) 的例子：

<pre class="prettyprint linenums">
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
</pre>

1. 访问 Insect 的 main 方法，是个 static，引发 Beetle 的 loading、linking 和 initialization，initialization 又引发 Insect 的 loading、linking和 initialization
    * 执行 Insect 的 initialization，private static int x1( = 3)，打印 "static Insect.x1 initialized"
	* 执行 Beetle 的 initialization，private static int x2( = 3)，打印 "static Beetle.x2 initialized"
2. 进入 main()，发现 constructor
3. 隐式调用 super()，转到 Insect 的 constructor
    * Insect 已经 loading、linking 和 initialization了，直接执行 non-static variable initializer，初始化 private int i( = 1) 和 protected int j( = 0 by default)
	* 执行 Insect constructor 的余下部分，打印 "Insect constructor" 和 "i = 1, j = 0, x1 = 3"，然后j = 2
4. 执行 Beetle 的 non-static variable initializer，初始化 private int k( = 3)，打印 "Beetle.k initialized"
5. 执行 Beetle constructor 的余下部分，打印 "Beetle constructor" 和 "j = 2, k = 3, x2 = 3"

---

回头看 [warning: 在构造器中请谨慎使用被覆写方法](/java/2009/03/27/using-overridden-method-in-constructor-is-dangerous/) 的例子：

<pre class="prettyprint linenums">
class Glyph {  
	void draw() {   
		System.out.println("Glyph.draw()");  
	}  
	  
	Glyph() {  
		System.out.println("Glyph constructor");  
		draw();  
	}  
}     
  
class RoundGlyph extends Glyph {  
	private int radius = 1;  
  
	RoundGlyph(int r) {  
		System.out.println("before assignment in constructor, radius = " + radius);  
		radius = r;  
		System.out.println("RoundGlyph constructor, radius = " + radius);  
	}  
	  
	void draw() {  
		System.out.println("RoundGlyph.draw(), radius = " + radius);  
	}  
}     
  
public class PolyConstructors {  
	public static void main(String[] args) {  
		new RoundGlyph(5);  
	}  
}  
//Output:  
/* 
	Glyph constructor 
	RoundGlyph.draw(), radius = 0 
	before assignment in constructor, radius = 1 
	RoundGlyph constructor, radius = 5 
*/ 
</pre>

1. 访问 PolyConstructors 的 main 方法，loading、linking PolyConstructors，进入 main，发现 RoundGlyph 构造器
2. 隐式调用 super()，打印 "Glyph constructor"，执行 RoundGlyph 的 draw() 方法，打印 "RoundGlyph.draw(), radius = 0" (此时还没有执行到 RoundGlyph 的 non-static variable initializer)
3. 执行 RoundGlyph 的 non-static variable initializer，radius = 1
4. 执行 RoundGlyph 构造器的余下部分，打印 "before assignment in constructor, radius = 1"，然后 radius = 5，打印 "RoundGlyph constructor, radius = 5"
