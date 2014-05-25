---
layout: post
title: "struts2 interceptor config"
description: ""
category: Struts
tags: [Config, Config-Struts]
---
{% include JB/setup %}

　　为了解决昨天晚上碰到的 aLock 那个吞 Exception 的问题，下午配了一下 struts 2 的拦截器。  

　　基本的拦截器配置是这个样子的（在 struts.xml 的 &lt;package&gt; 元素内）：

<pre class="prettyprint linenums">
&lt;interceptors&gt;
    &lt;interceptor-stack name="xxx"&gt;
        &lt;interceptor-ref name="foo"/&gt;
    &lt;/interceptor-stack&gt;
&lt;/interceptors&gt;
&lt;default-interceptor-ref name="xxx" /&gt;
</pre>

这里 `interceptor-ref` 既可以是单个拦截器，也可以是一个拦截器栈。struts 2 指定了很多拦截器和拦截器栈的 alias，如果 interceptor-ref 的 name 设置为这些 alias，就表示使用默认的拦截器或者拦截器栈（所以如果自定义拦截器实现的时应该避免这些 alias？）

## 1. 最开始我只配了一个默认的 exception 拦截器

<pre class="prettyprint linenums">
&lt;interceptor-ref name="exception"&gt;
    &lt;param name="logEnabled"&gt;true&lt;/param&gt;
    &lt;param name="logCategory"&gt;com.netease.mail.advlock&lt;/param&gt;
    &lt;param name="logLevel"&gt;WARN&lt;/param&gt;
&lt;/interceptor-ref&gt;
</pre>

表示:

<pre class="prettyprint linenums">
log = LogFactory.getLog(new Category("com.netease.mail.advlock"));
log.warn(exception);
</pre>

---

## 2. 后来发现出现了新的错误

　　其实是因为 struts 2 有一个默认的拦截器栈的配置 defaultStack，比如 query?key=value 的自动注入（request.getParameter 自动注入到 Action 的同名属性中），就是 defaultStack 中的 params 拦截器实现的。  

　　如果你不写任何拦截器配置，这个 defaultStack 是默认使用的，但如果你写了拦截器配置，就必须指明是否继续使用 defaultStack。  

　　所以我改成了：

<pre class="prettyprint linenums">
&lt;interceptor-ref name="defaultStack"&gt;
&lt;/interceptor-ref&gt;
&lt;interceptor-ref name="exception"&gt;
    &lt;param name="logEnabled"&gt;true&lt;/param&gt;
    &lt;param name="logCategory"&gt;com.netease.mail.advlock&lt;/param&gt;
    &lt;param name="logLevel"&gt;WARN&lt;/param&gt;
&lt;/interceptor-ref&gt;
</pre>

---

## 3. 但我接着又发现了

　　defaultStack 其实是包含 exception 拦截器的，只是 exception 的配置不同，上面的配法相当于配置了两个 exception 拦截器。  

  所以又改成了 “interceptor configuration override” 的写法：
  
<pre class="prettyprint linenums">
&lt;interceptor-ref name="defaultStack"&gt;
    &lt;param name="exception.logEnabled"&gt;true&lt;/param&gt;
    &lt;param name="exception.logCategory"&gt;com.netease.mail.advlock&lt;/param&gt;
    &lt;param name="exception.logLevel"&gt;WARN&lt;/param&gt;
&lt;/interceptor-ref&gt;
</pre>

这下就圆满了~
 
---

　　参考：[Interceptor Configuration](http://struts.apache.org/2.3.1/docs/interceptor-configuration.html)、[Interceptors](http://struts.apache.org/2.3.1/docs/interceptors.html)
