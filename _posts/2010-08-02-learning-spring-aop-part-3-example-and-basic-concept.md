---
category: AOP
description: ''
tags:
- Java-AOP
title: Spring AOP 学习（三）：例子与基本概念
---

　　依旧是 LogInterceptor 的例子。下面是 beans.xml：

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<beans xmlns="http://www.springframework.org/schema/beans"  
	   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
	   xmlns:context="http://www.springframework.org/schema/context"  
	   xmlns:aop="http://www.springframework.org/schema/aop"  
	   xsi:schemaLocation="http://www.springframework.org/schema/beans  
		   http://www.springframework.org/schema/beans/spring-beans-2.5.xsd  
		   http://www.springframework.org/schema/context  
		   http://www.springframework.org/schema/context/spring-context-2.5.xsd  
		   http://www.springframework.org/schema/aop  
		   http://www.springframework.org/schema/aop/spring-aop-2.5.xsd">  
	<context:annotation-config />  
	<context:component-scan base-package="com.bjsxt"/>  
	<aop:aspectj-autoproxy />  
</beans>  
```

注意添加 aop 的 namespace 和 `<aop:aspectj-autoproxy />` 这一句。LogInterceptor 的代码如下：

```java
package com.bjsxt.aop;  
  
import org.aspectj.lang.ProceedingJoinPoint;  
import org.aspectj.lang.annotation.Around;  
import org.aspectj.lang.annotation.Aspect;  
import org.aspectj.lang.annotation.Before;  
import org.aspectj.lang.annotation.Pointcut;  
import org.springframework.stereotype.Component;  
  
@Aspect  
@Component  
public class LogInterceptor {  
	@Pointcut("execution(public * com.bjsxt.service..*.add(..))")  
	public void myMethod(){};  
	  
	@Before("myMethod()")  
	public void before() {  
		System.out.println("method before");  
	}  
	  
	@Around("myMethod()")  
	public void aroundMethod(ProceedingJoinPoint pjp) throws Throwable {  
		System.out.println("method around start");  
		pjp.proceed();  
		System.out.println("method around end");  
	}    
}  
```

这里需要注意两点：

1. 这里 **必须要有 @Component**，让 Spring 来 new 一个 LoginInterceptor 对象（我们定义了 `<context:component-scan base-package="com.bjsxt"/>`; 来让 Spring 来扫描 com.bjsxt 包；扫描到 @Aspect 就知道要织入这个类了）。这样才能把 LoginInterceptor 对象织入 UserDAOImpl
2. `execution(public void com.bjsxt.dao.UserDAOImpl.save(com.bjsxt.model.User)")`，这是 **AspectJ 语法**，execution 表示在方法执行时切入。另有其他的切入点，比如属性初始化时、类加载时

　　根据这个例子，我们来理解一些 AOP 的概念：

1. _Target_: UserDAOImpl 是织入的 Target
2. _JoinPoint_: `execution(public void save())` 这里就是 JoinPoint，即 **切入点**
3. _Advice_: before() 方法是 Advice，**Advice is an action taken by an Aspect at a certain JoinPoint**
4. _AdviceType_: @Before 是 AdviceType，表示这是一个 Advice that executes before a JoinPoint
5. _PointCut_: 从通配符（`@Pointcut("execution(public * com.bjsxt.service.*.add(.))`)）可以看出，**PointCut 是 JoinPoint 的集合**，但是注意 **PointCut 必须依赖于一个方法**
6. _Aspect_: LogInterceptor 这个类，或者说 LogInterceptor 这个类的逻辑（即记录日志）是一个 Aspect