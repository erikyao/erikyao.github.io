---
layout: post
title: "有关 Java 的 main 方法"
description: ""
category: Java
tags: [Java-101]
---
{% include JB/setup %}

<pre class="prettyprint linenums">
public static void main(String[] args) {  
    ...  
}
</pre>

## 1、关于 main 方法中的修饰符 public

　　main 方法是个特殊的方法，它是 JDK/JRE 约定的运行应用程序的启动入口方法，如果你用 java.exe 运行一个 class，它就会在这个 class 里面寻找这个方法，并调用它，等它返回了，程序也就结束了。JVM 规范并没有要求 main 一定是 public 的，你用其他修饰符也不会有编译错误，只是在执行时，JVM 会提示 main 方法的修饰符不是 public，JVM 无法启动应用程序。

---

## 2、关于 main 方法中的 static

　　main 方法必须是一个静态方法，因为 JVM 是直接访问 main 方法的，事先不用先创建 main class 对象，直接运行应用程序。

---

## 3、main 方法的 return type 必须为 void

---

## 4、main 方法只作为 Java 应用程序的入口

　　比如 Applet 程序就不需要 main() 方法，其入口程序一般为 init() 方法。

---

## 5、main 可作为普通方法名

　　不符合 main 方法严格定义的其他 main 方法将视为 class 的普通方法。

---

## 6、main 可以用 final 来修饰。
