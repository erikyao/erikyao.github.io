---
category: Spring
description: ''
tags: []
title: 'Spring: "Could not resolve placeholder" 解决方案'
---

除去 properites 文件路径错误、拼写错误外，出现 "Could not resolve placeholder" 很有可能是使用了多个 `PropertyPlaceholderConfigurer` 或者多个 `<context:property-placeholder>` 的原因。 

比如我有一个 `dao.xml` 读取 `dbConnect.properties`，还有一个 `dfs.xml` 读取 `dfsManager.properties`，然后 `web.xml` 统一 load 这两个 xml 文件

```xml
<context-param>  
	<param-name>contextConfigLocation</param-name>  
	<param-value>  
		WEB-INF/config/spring/dao.xml,   
		WEB-INF/config/spring/dfs.xml  
	</param-value>  
</context-param> 
```

如果这两个 xml 文件中分别有：

```xml
<context:property-placeholder location="WEB-INF/config/db/dbConnect.properties" />  
```

```xml
<context:property-placeholder location="WEB-INF/config/dfs/dfsManager.properties" />  
```

那么，一定会出 "Could not resolve placeholder"。

一定要记住，不管是在一个 Spring 文件内还是在多个 Spring 文件被统一 load 的情况下，直接出现重复的 `<context:property-placeholder location="" />` 是不允许的。

解决方案：

(1) 在 Spring 3.0 中，可以写：

```xml
<context:property-placeholder location="xxx.properties" ignore-unresolvable="true" />    
<context:property-placeholder location="yyy.properties" ignore-unresolvable="true" />   
```

注意两个都要加上 `ignore-unresolvable="true"`，一个加另一个不加也是不行的  

(2) 在 Spring 2.5 中，`<context:property-placeholder>` 没有 `ignore-unresolvable` 属性，此时可以改用 `PropertyPlaceholderConfigurer`。其实 `<context:property-placeholder location="xxx.properties" ignore-unresolvable="true" />` 与下面的配置是等价的

```xml
<bean id="随便" class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">  
    <property name="location" value="xxx.properties" />  
    <property name="ignoreUnresolvablePlaceholders" value="true" />   
</bean> 
```

正因为如此，写多个 `PropertyPlaceholderConfigurer` 不加 `ignoreUnresolvablePlaceholders` 属性也是一样会出 "Could not resolve placeholder"。