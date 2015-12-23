---
layout: post
title: "Spring MVC example anatomy"
description: ""
category: SpringMVC
tags: [SpringMVC-101]
---
{% include JB/setup %}

　　例子来自 [Developing a Spring Framework MVC application step-by-step](http://docs.spring.io/docs/Spring-MVC-step-by-step/) ，版本是 spring-framework-2.5.6.SEC01

![](https://farm6.staticflickr.com/5754/23624881030_43a4c82b85_o_d.png)

## 1. DispatchServlet 接过浏览器的 /hello.htm请求

　　在 springapp/war/WEB-INF/web.xml 中，定义了homepage：

```xml
<welcome-file-list>
	<welcome-file>index.jsp</welcome-file>
</welcome-file-list>
```

所以 http://localhost:8080/springapp 即相当于 http://localhost:8080/springapp/index.jsp。

　　而 springapp/war/index.jsp 是直接 sendRedirect：

```html
<%-- Redirected because we can't set the welcome page to a virtual URL. --%>
<c:redirect url="/hello.htm"/>
```

所以又转到 http://localhost:8080/springapp/hello.htm

　　在 springapp/war/WEB-INF/web.xml 中有：

<pre class="prettyprint linenums">
&lt;servlet&gt;  
	&lt;servlet-name&gt;springapp&lt;/servlet-name&gt;  
	&lt;servlet-class&gt;org.springframework.web.servlet.DispatcherServlet&lt;/servlet-class&gt;  
&lt;/servlet&gt;  
  
&lt;servlet-mapping&gt;  
	&lt;servlet-name&gt;springapp&lt;/servlet-name&gt;  
	&lt;url-pattern&gt;*.htm&lt;/url-pattern&gt;  
&lt;/servlet-mapping&gt;
</pre>

所以这个 http://localhost:8080/springapp/hello.htm 请求由 DispatcherServlet 来处理。

---

## 2. DispatchServlet 确定 mapping of <Request, Controller>

　　DispatchServlet 默认使用的是 BeanNameUrlHandlerMapping，即通过 controller 的 bean name 来与 request 对应。  

　　Controller 在 WebApplicationContext 文件中定义，而 WebApplicationContext 文件的命名规则是 &lt;servlet-name&gt;-servlet.xml，所以本案例的 WebApplicationContext 文件即是 springapp-servlet.xml。  

　　bean name 必须是 slash 开头，然后只能写 request 中最后一个 slash 后面的部分。

```xml
<bean name="/hello.htm" class="springapp.web.InventoryController">  
	<property xxx="zzz"></property>  
</bean> 
```

　　另外还有 SimpleUrlHandlerMapping、ControllerClassNameHandlerMapping 和 CommonsPathMapHandlerMapping 三种 mapping 形式，这里就不展开了。

---

## 3. Controller 返回 ModelAndView 给 DispatchServlet

　　Controller 的类型有很多，最简单的形式就是自己实现一个 Controller 接口 (spring 自带了很多 Controller 及其子接口的实现)，只需实现一个 handleRequest(HttpServletRequest, HttpServletResponse) 方法，返回一个 ModelAndView 即可。  

　　ModelAndView(viewName, modelName, modelObject)，其中的 modelName 和 modelObject 是一个 pair；viewName 可以写一个长路径，如 “WEB-INF/jsp/hello.jsp”，更常见的方法是返回一个短字符串，比如 "hello"，交给 ViewResolver 去解析。

---

## 4. DispatchServlet 通过 ViewResolver 来解析 ViewName

　　DispatchServlet 默认使用的 ViewResolver 是 InternalResourceViewResolver (更多关于 DispatchServlet 的默认配置请参见 spring-framework-2.5.6.SEC01\src\org\springframework\web\servlet\DispatcherServlet.properties)，但与 BeanNameUrlHandlerMapping 不同的是，虽然 InternalResourceViewResolver 是默认的，但需要进一步对 InternalResourceViewResolver 进行配置。

<pre class="prettyprint linenums">
&lt;!-- spingapp/war/WEB-INF/springapp-servlet.xml --&gt;  
  
&lt;bean id="viewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver"&gt;  
	&lt;property name="viewClass" value="org.springframework.web.servlet.view.JstlView"&gt;&lt;/property&gt;  
	&lt;property name="prefix" value="/WEB-INF/jsp/"&gt;&lt;/property&gt;  
	&lt;property name="suffix" value=".jsp"&gt;&lt;/property&gt;  
&lt;/bean&gt;  
</pre>

prefix + “hello” + suffix == "/WEB-INF/jsp/hello.jsp"  

　　注意这里的 bean id，虽然在 spring-framework-2.5.6.SEC01\src\org\springframework\web\servlet\DispatcherServlet.java 里有：

<pre class="prettyprint linenums">
public static final String VIEW_RESOLVER_BEAN_NAME = "viewResolver";  
</pre>

但这里的bean id可以随便写。  

　　However, MessageSource 类的 bean id 必须是 "messageSource"，不能随便写。我们在 spring-framework-2.5.6.SEC01\src\org\springframework\context\support\AbstractApplicationContext.java 里面可以看到有：

<pre class="prettyprint linenums">
public static final String MESSAGE_SOURCE_BEAN_NAME = "messageSource";  
</pre>

　　另外，bean name 和 bean id 的区别：

> Either one would work. It depends on your needs:
> If your bean identifier contains special character(s) for example (/viewSummary.html), it (the slash) won't be allowed as the bean id, because it's not a valid XML ID. In such cases you could skip defining the bean id and supply the bean name instead.
> The name attribute also helps in defining aliases for your bean, since it allows specifying multiple identifiers for a given bean.

---

## 5. JSP dispatched to browser by DispatchServlet

　　hello.jsp 被 dispatch 给浏览器显示，注意是 dispatch，所以浏览器的地址栏仍然是 hello.htm。  

　　JSP 可以使用 ModelAndView 中的 Model，形式如 "${ModelName.ModelObject}"，类似于 getAttribute。

<pre class="prettyprint linenums">
&lt;%-- springapp/war/WEB-INF/jsp/hello.jsp --%&gt;  
  
&lt;body&gt;  
	&lt;h1&gt;&lt;fmt:message key="heading"/&gt;&lt;/h1&gt;  
	&lt;p&gt;&lt;fmt:message key="greeting"/&gt; &lt;c:out value="${model.now}"&gt;&lt;/c:out&gt;&lt;/p&gt;  
	&lt;h3&gt;Product&lt;/h3&gt;  
	&lt;c:forEach items="${model.products}" var="prod"&gt;  
		&lt;c:out value="${prod.description}"/&gt;   
		&lt;i&gt;&lt;c:out value="${prod.price}"/&gt;&lt;/i&gt;&lt;br&gt;&lt;br&gt;  
	&lt;/c:forEach&gt;  
	&lt;br&gt;  
	&lt;a href="&lt;c:url value="priceincrease.htm"/&gt;"&gt;Increase Price&lt;/a&gt;  
	&lt;br&gt;  
&lt;/body&gt;  
</pre>