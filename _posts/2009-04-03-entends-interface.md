---
layout: post
title: "entends interface"
description: ""
category: Java
tags: [Java-101]
---
{% include JB/setup %}

　　一个 imp class 可以同时实现多个 interface，格式如下：

<pre class="prettyprint linenums">
class Impl implements Intf1,  Intf2, ..., IntfN;
</pre>

　　如果一个 class 又有继承又有实现，那么应该先 extends 再 implements，如：

<pre class="prettyprint linenums">
class ImplExt extends Base implements Intf;  
</pre>
　　
　　Java 中不支持 class 的多重继承，但 interface 可以，如：

<pre class="prettyprint linenums">
class Ext extends Base1, Base2, ..., BaseN; // syntax error  
interface ExtIntf extends BaseIntf1, BaseIntf2, ..., BaseIntfN; // OK 
</pre>