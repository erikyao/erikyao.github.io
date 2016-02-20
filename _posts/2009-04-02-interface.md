---
layout: post
title: "interface"
description: ""
category: Java
tags: [Java-101]
---
{% include JB/setup %}

我们大可将 interface 视为 abstract class 的延伸。  

首先，interface 默认具有 abstract 属性，所以你不能 new 一个 interface。  

其次，interface 中的方法默认为 public。由 [关于覆写方法的访问权限](/java/2009/04/02/accessibility-of-overridden-method) 可知，如果一个 imp class 实现了一个 interface (相当于一个 ext class 继承了一个 base class)，那么 imp class 中对 interface 中声明方法的实现 (相当于是覆写方法) 也必须是 public。  

再次，interface 中的 field 默认为 public + static + final，但不能为 blank final，即必须初始化。  

还有，和 abstract class 一样，interface 支持向上转型，即原来对一般 base class 的向上转型用法对 interface 同样适用。  

_p.s._ 如果 abstract class 或是 interface 声明为 public，则必须与 \.java 文件同名，这一点与一般的 public class 无异。  

_2011-10-31补充_：interface 中的方法你可以看成是 abstract，但是不能声明为 abstract  

_2012-04-10补充_：interface 中的方法不能是 static  
