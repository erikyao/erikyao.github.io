---
layout: post
title: "Ant路径之**"
description: ""
category: Ant
tags: [Config, Ant-Config]
---
{% include JB/setup %}

<pre class="prettyprint linenums">
&lt;fileset dir="${lib.dir}" includes="*.jar"/&gt;>  
</pre>

　　表示 include ${lib.dir} 文件夹 (不包括其子文件夹) 下的所有 \.jar 文件  

<pre class="prettyprint linenums">
&lt;fileset dir="${lib.dir}" includes="**/*.jar"/&gt;>  
</pre>

　　表示的是 include ${lib.dir} 及其子文件夹下的所有 \.jar 文件