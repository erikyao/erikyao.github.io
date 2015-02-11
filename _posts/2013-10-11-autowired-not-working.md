---
layout: post
title: "@Autowired not working 的问题"
description: ""
category: Spring
tags: [Spring-101, Config-Spring]
---
{% include JB/setup %}

Looks like the `UserService` class is missing a 'stereotype' annotation like `@Component` or `@Service`. You also have to configure the Spring classpath scanning using the following configuration:

<pre class="prettyprint linenums">
&lt;beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans 
           http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
           http://www.springframework.org/schema/context
           http://www.springframework.org/schema/context/spring-context-3.0.xsd"&gt;

     &lt;!-- Add your classes base package here --&gt;          
     &lt;context:component-scan base-package="your.package"/&gt;&lt;/beans&gt;
</pre>

Your beans must include one of the Spring stereotype annotations like:

<pre class="prettyprint linenums">
package your.package;

@Service public class UserService { 
    // code goes here
}
</pre>
