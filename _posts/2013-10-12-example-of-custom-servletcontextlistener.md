---
layout: post
title: "自定义 ServletContextListener 的写法举例"
description: ""
category: Java
tags: [Servlet]
---
{% include JB/setup %}

```xml
<context-param>
	 <param-name>ibatisResourceCharset</param-name>
	 <param-value>UTF-8</param-value>
</context-param>
<listener>
     <listener-class>xxx.xxx.xxx.listener.IbatisConfigListener</listener-class>
</listener>
```

```java
package xxx.xxx.xxx.listener;

import java.nio.charset.Charset;

import com.ibatis.common.resources.Resources;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class IbatisConfigListener implements ServletContextListener {

     @Override
     public void contextInitialized(ServletContextEvent event) {
          String charset = event.getServletContext().
                    getInitParameter("ibatisResourceCharset");
          
          Resources.setCharset(Charset.forName(charset));
     }

     @Override
     public void contextDestroyed(ServletContextEvent event) {
          // do nothing
     }

     public static void main(String[] args) {
          System.out.println(Charset.isSupported("UTF-8"));
     }
}
```
