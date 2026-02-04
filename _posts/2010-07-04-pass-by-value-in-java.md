---
category: Java
description: ''
tags: []
title: Java 的值传递
---

[1]: https://live.staticflickr.com/1558/23624880720_fc91c4bf4d_w.jpg
[2]: https://live.staticflickr.com/1477/23552710069_482b93e217_w.jpg
[3]: https://live.staticflickr.com/1720/23292345074_546743c016_w.jpg
[4]: https://live.staticflickr.com/5797/23838061301_1a4c253fa1_w.jpg

所谓的值传递 (pass-by-value) 指的是：传递给方法的是参数值的一个 copy。Java 方法使用的永远是值传递 (很多地方说到的“引用传递”其实也可以看做是值传递，概念搞多了反而还不好理解，干脆说死一点，Java 就只使用值传递)。  

通过例子来看：

```java
public class Test {  
	public static void change(String s) {  
		s = "changed";  
	}  
	  
	public static void main(String[] args) {  
		String s = "original";  
		  
		change(s);  
		System.out.println(s); // Output: original  
	}  
}
```

值传递的示意图如下：

![][1]

由于 `String` 是 immutable class，即：`String` 对象一旦创建，就不可修改。所以应该这么理解：

```java
String s = "original"; // String s = new String("original");
s = "changed"; // s = new String("changed");
```

即 `s = "changed"` 并不是把 `"original"` 对象修改成 `"changed"`，而是新建了一个 `"changed"` 对象，而且于此同时 `"original"` 对象依然存在。亦即不应该看成下面这种表示：

```java
String s = new String("original");  
s.setValue("changed");  
```

正因为 `String` 是个不可变类，所以在 `change()` 方法中，参数 `s` 指向 `"original"`，而 `s 的拷贝` 指向 `"changed"`，`s 的拷贝` 的行为对 `s` 没有影响，所以 `System.out.println(s)` 还是打印出 `"original"`。

---

下面是一个 `StringBuffer` 的例子：

```java
public class Test {   
	public static void change(StringBuffer sb) {  
		sb.replace(0, sb.length(), "changed");  
	}  
	  
	public static void main(String[] args) {  
		StringBuffer sb = new StringBuffer("original");  
		  
		change(sb);  
		System.out.println(sb.toString()); // Output: changed  
	}  
} 
```

![][2]

_题外话_：一般说来，`String` 和 primitive 都是 immutable class，而 `StringBuffer`、`Date` 还有数组都是可变类。

_2010-7-6补充_：用 `final` 来修饰方法的参数可以强制禁止参数的拷贝指向新的对象，例如：

```java
public class Test {  
	public static void change(final String s) {  
		s = "changed"; // 非法！！！  
	}  
	  
	public static void main(String[] args) {  
		String s = "original";  
		  
		change(s);  
		System.out.println(s);   
	}  
}
```

这里 `final` 就可以禁止 `copy of String s` 指向新对象 `"changed"` 的行为。  

_2011.10.23补充：_

对参数来说，可以分三类：(1) 基本类型 primitive type；(2) 可变类对象 reference；(3) 不可变类对象 reference。(2)(3)的情况上面已经讨论过了，那么基本类型的情况如何呢？

基本类型的情况有一点特殊。基本类型和 reference 都是在栈上的值，只是 reference 存的是堆上对象的地址值，而基本类型存的是本身的值。如下图所示：

![][3]

当 `(i, j)` 作为参数传入时，`j` 会被原样 copy 一份，这份 copy 仍然指向 `Integer(10)`；`i` 也会被原样 copy 一份，值仍然为 5。如下图所示：

![][4]

所以此时在方法里 `i = xxx` 或者 `j = new Integer(xxx)`，其实对 `(i, j)` 并没有什么影响：当方法执行完毕，堆栈内容和方法执行前没有变化。

可以总结一下，java 的值传递是在栈上进行的，即将栈上的 primitive type 或是 reference copy 一份，再传递给方法，方法实际操作的是这份 copy。这份 copy 能否影响到堆上的值，要看方法具体对 copy 的操作是啥：如果是 setter，那肯定改变了堆值；如果是 `new`，其实不会改变。  

_2011.10.26补充：_

联系 `== 与 Object.equals() 的区别`，我们是否可以认为：`== 比较的是栈上的两个值是否相等`？