---
layout: post
title: "Simple Form Handling Example"
description: ""
category: SpringMVC
tags: [Config, SpringMVC-Config]
---
{% include JB/setup %}

　　继续 [Spring MVC example anatomy](/springmvc/2009/11/29/spring-mvc-example-anatomy/) 中springapp的例子。  

　　PriceIncreaseController extends SimpleFormController。SimpleFormController 有2个视图：formView 用来显示 form，successView 则是 form 提交后转到的页面。  

　　当我们从hello.htm(实际是hello.jsp)上点击priceincrease.htm的超链接时，实际是发送了一个GET方法的请求，然后处理流程如下：

![](https://vgk9nq.bn1301.livefilestore.com/y2patK-yYFT1JWrgQxzD4EBfbRYeTdUTN3lNj55sUpUe47nOdHntmFbF0GGqBKGAeP5MG5IKK6LAXzZ5IOKf4p6rmiCIldN77eDe4rvJyyvq1o/1.png?psid=1)

　　如果priceincrease.jsp页面上需要显示一些数据，可以通过formBackingObject()方法来初始化Command Object，这个接下来再讲。  

　　一般使用 DI 来设置 SimpleFormController 的 formView 和 successView：

<pre class="prettyprint linenums">
&lt;bean name="/priceincrease.htm" class="springapp.web.PriceIncreaseFormController"&gt;  
	&lt;property name="sessionForm" value="true" /&gt;  
	&lt;property name="commandName" value="priceIncrease" /&gt;  
	&lt;property name="commandClass" value="springapp.service.PriceIncrease" /&gt;  
	&lt;property name="validator"&gt;  
		&lt;bean class="springapp.service.PriceIncreaseValidator" /&gt;  
	&lt;/property&gt;  
	&lt;property name="formView" value="priceincrease" /&gt;  
	&lt;property name="successView" value="hello.htm" /&gt;  
	&lt;property name="productManager" ref="productManager" /&gt;  
&lt;/bean&gt;  
</pre>

　　这里还有个有意思的事情：即使不配置formView，根据 [惯例优先原则](http://docs.spring.io/spring/docs/2.5.6/reference/mvc.html#mvc-coc)，DispatchServlet 还是能找到 priceincrease 这个 viewName，然后去交给 InternalResourceViewResolver 解析 (如果配置了，应该是 SimpleFormController 执行 showForm 操作，返回一个 new ModelAndView(formView) 给 DispatchServlet)  

　　我们注意到这里有 commandClass 和 commandName，这个还是相当于 jsp 页面的 Attribute。整个的提交的处理流程如下：

![](https://vgk9nq.bn1303.livefilestore.com/y2pBqhXu3IfpA39w6tXqjjL7-yKmlBoA9tDfLaDeK0Quye8CDjRkVQujsDWy4CQPixDvI-511juiJgYCTac1M4qvqmK9rT4P0e3IbiIp1XrXEU/2.png?psid=1)

　　这里需要注意的有以下几点：

 * Command Object 不需要名字。commandName 并不是 Command Object 的名字，所以在 formBackingObject() 方法里面创建 Command Object 不需要特别注意名字。formBackingObject() 是一个覆写方法，父类中的方法应该也只是简单地 new 一个 Command Object
 * Command Object 的属性、JSP 中 &lt;form&gt; 标签中的 “path”、和 Validator 中的 reject 方法的参数存在对应关系，如下图所示 (文字描述太复杂了，画图算了)：
 
 ![](https://vgk9nq.bn1.livefilestore.com/y2pG9gagUKiA4NcNi-gqmSLmgtmRJYYQEknWtsMBaswEMhp-ebqkcj8oaBenuhorSQGtTkku7y7pjFt7hGiqrNTCe9BaqgCtbFcMVu0dHEJW38/3.png?psid=1)
 
 * &lt;form:input path="percentage"&gt; 表示把这个文本框的输入内容写入 Command Object (已通过 commandName=“priceIncrease” 指定)；而 &lt;form:error path="percentage"&gt; 会被展开为成一个 &lt;span&gt; 来显示错误信息 (if any)，详见 [The errors tag](http://docs.spring.io/spring/docs/2.5.0/reference/mvc.html#mvc-formtaglib-errorstag)
