---
layout: post
title: "\"Could not resolve placeholder\" 解决方案"
description: ""
category: Spring
tags: [Spring-101, Config-Spring]
---
{% include JB/setup %}

　　除去 properites 文件路径错误、拼写错误外，出现 "Could not resolve placeholder" 很有可能是使用了多个 `PropertyPlaceholderConfigurer` 或者多个 `<context:property-placeholder>` 的原因。 

　　比如我有一个 dao.xml 读取 dbConnect.properties，还有一个 dfs.xml 读取 dfsManager.properties，然后 web.xml 统一 load 这两个 xml 文件

<pre class="prettyprint linenums">
&lt;context-param&gt;  
	&lt;param-name&gt;contextConfigLocation&lt;/param-name&gt;  
	&lt;param-value&gt;  
			WEB-INF/config/spring/dao.xml,   
			WEB-INF/config/spring/dfs.xml  
	&lt;/param-value&gt;  
&lt;/context-param&gt; 
</pre>

如果这两个 xml 文件中分别有：

<pre class="prettyprint linenums">
&lt;context:property-placeholder location="WEB-INF/config/db/dbConnect.properties" /&gt;  
</pre>

<pre class="prettyprint linenums">
&lt;context:property-placeholder location="WEB-INF/config/dfs/dfsManager.properties" /&gt;  
</pre>

那么，一定会出 "Could not resolve placeholder"。

　　一定要记住，不管是在一个 Spring 文件还是在多个 Spring 文件被统一 load 的情况下，直接写：

<pre class="prettyprint linenums">
&lt;context:property-placeholder location="" /&gt;  
&lt;context:property-placeholder location="" /&gt;  
</pre>

是不允许的。   

　　解决方案：

　　(1) 在 Spring 3.0 中，可以写：

<pre class="prettyprint linenums">
&lt;context:property-placeholder location="xxx.properties" ignore-unresolvable="true" /&gt;    
&lt;context:property-placeholder location="yyy.properties" ignore-unresolvable="true" /&gt;   
</pre>

注意两个都要加上ignore-unresolvable="true"，一个加另一个不加也是不行的  

　　(2) 在Spring 2.5中，`<context:property-placeholder>` 没有 ignore-unresolvable 属性，此时可以改用 PropertyPlaceholderConfigurer。其实 `<context:property-placeholder location="xxx.properties" ignore-unresolvable="true" />` 与下面的配置是等价的

<pre class="prettyprint linenums">
&lt;bean id="随便" class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer"&gt;  
    &lt;property name="location" value="xxx.properties" /&gt;  
    &lt;property name="ignoreUnresolvablePlaceholders" value="true" /&gt;   
&lt;/bean&gt; 
</pre>

正因为如此，写多个 PropertyPlaceholderConfigurer 不加 ignoreUnresolvablePlaceholders 属性也是一样会出 "Could not resolve placeholder"。