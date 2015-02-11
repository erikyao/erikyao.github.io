---
layout: post
title: "自定义 ServletContextListener 的写法举例"
description: ""
category: Java
tags: [Servlet]
---
{% include JB/setup %}

<pre class="prettyprint linenums">
&lt;context-param&gt;
	 &lt;param-name&gt;ibatisResourceCharset&lt;/param-name&gt;
	 &lt;param-value&gt;UTF-8&lt;/param-value&gt;
&lt;/context-param&gt;
&lt;listener&gt;
     &lt;listener-class&gt;xxx.xxx.xxx.listener.IbatisConfigListener&lt;/listener-class&gt;
&lt;/listener&gt;
</pre>

<pre class="prettyprint linenums">
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
</pre>
