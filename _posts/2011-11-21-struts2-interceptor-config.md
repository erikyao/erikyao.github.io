---
category: Struts
description: ''
tags: []
title: 'struts2: interceptor config'
---

为了解决昨天晚上碰到的 aLock 那个吞 Exception 的问题，下午配了一下 struts 2 的拦截器。  

基本的拦截器配置是这个样子的（在 struts.xml 的 `<package>` 元素内）：

```xml
<interceptors>
    <interceptor-stack name="xxx">
        <interceptor-ref name="foo"/>
    </interceptor-stack>
</interceptors>
<default-interceptor-ref name="xxx" />
```

这里 `interceptor-ref` 既可以是单个拦截器，也可以是一个拦截器栈。struts 2 指定了很多拦截器和拦截器栈的 alias，如果 `interceptor-ref` 的 name 设置为这些 alias，就表示使用默认的拦截器或者拦截器栈（所以如果自定义拦截器实现的时应该避免这些 alias？）

## 1. 最开始我只配了一个默认的 exception 拦截器

```xml
<interceptor-ref name="exception">
    <param name="logEnabled">true</param>
    <param name="logCategory">com.netease.mail.advlock</param>
    <param name="logLevel">WARN</param>
</interceptor-ref>
```

表示:

```java
log = LogFactory.getLog(new Category("com.netease.mail.advlock"));
log.warn(exception);
```

---

## 2. 后来发现出现了新的错误

其实是因为 struts 2 有一个默认的拦截器栈的配置 `defaultStack`，比如 `query?key=value` 的自动注入（`request.getParameter` 自动注入到 Action 的同名属性中），就是 `defaultStack` 中的 `params` 拦截器实现的。  

如果你不写任何拦截器配置，这个 `defaultStack` 是默认使用的，但如果你写了拦截器配置，就必须指明是否继续使用 `defaultStack`。  

所以我改成了：

```xml
<interceptor-ref name="defaultStack">
</interceptor-ref>
<interceptor-ref name="exception">
    <param name="logEnabled">true</param>
    <param name="logCategory">com.netease.mail.advlock</param>
    <param name="logLevel">WARN</param>
</interceptor-ref>
```

---

## 3. 但我接着又发现了

`defaultStack` 其实是包含 `exception` 拦截器的，只是 `exception` 的配置不同，上面的配法相当于配置了两个 `exception` 拦截器。  

所以又改成了 “interceptor configuration override” 的写法：
  
```xml
<interceptor-ref name="defaultStack">
    <param name="exception.logEnabled">true</param>
    <param name="exception.logCategory">com.netease.mail.advlock</param>
    <param name="exception.logLevel">WARN</param>
</interceptor-ref>
```

这下就圆满了~
 
---

参考：[Interceptor Configuration](http://struts.apache.org/2.3.1/docs/interceptor-configuration.html)、[Interceptors](http://struts.apache.org/2.3.1/docs/interceptors.html)