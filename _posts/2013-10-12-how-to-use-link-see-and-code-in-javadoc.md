---
layout: post
title: "How to use @link, @see and @code in JavaDoc"
description: ""
category: Java
tags: [Java-101]
---
{% include JB/setup %}

## @link

<pre class="prettyprint linenums">
{@link [&lt;package&gt;.]&lt;class&gt;[#&lt;method&gt;]}
{@link #&lt;method&gt;}
</pre>

　　引用其他类或者方法，注意方法前的 # 与 UML 中表示 protected 的 # 不同（参 [visibility symbol in UML](/uml/2013/04/09/visibility-symbol-in-uml/)），这个 # 仅仅用来连接方法和类

## @see

　　加一个 see also 外链:

<pre class="prettyprint linenums">
@see &lt;a href="http://google.com"&gt;Google&lt;/a&gt;
</pre>

　　以下两种写法效果相同：

<pre class="prettyprint linenums">
@see [&lt;package&gt;.]&lt;class&gt;
@see {@link [&lt;package&gt;.]&lt;class&gt;} 
</pre>

## @code

　　参 [Multiple line code example in Javadoc comment](http://stackoverflow.com/a/542142)：

<pre class="prettyprint linenums">
/**
 * &lt;pre&gt;
 * {@code
 * Set<String> s;
 * System.out.println(s);
 * }
 * &lt;/pre&gt;
 */
</pre>

　　注意评论里有说：

> Another unfortunate, if you have blocks in your example code using curly braces "{}", the first closing brace will terminate the @code block.

