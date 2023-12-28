---
category: AOP
description: ''
tags:
- Java-AOP
title: 'Spring AOP 学习（四）：简单 XML 配置 '
---

紧接着 [Spring AOP 学习（三）：例子与基本概念](/aop/2010/08/02/learning-spring-aop-part-3-example-and-basic-concept) 中的例子。其实 Spring AOP 注解的概念理解了后，看 XML 配置就是件很简单的事情了。

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
  
	<bean id="logInterceptor" class="com.bjsxt.aop.LogInterceptor"></bean>  
	<aop:config>  
		<aop:pointcut expression="execution(public * com.bjsxt.service..*.add(..))" id="logPointCut"/>  
		<aop:aspect id="logAspect" ref="logInterceptor">  
			<aop:before method="before" pointcut-ref="logPointCut" />  
		</aop:aspect>  
	</aop:config>  
</beans>  
```

1. 首先去掉了 `<aop:aspectj-autoproxy/>` 这句
2. 还是得先初始化一个 LogInteceptor 对象，所以要先写一个 `<bean>`
3. AOP 的配置写在 `<aop:config></aop:config>` 内
4. 调用 `add()` 方法时，Spring 发现符合 `pointcut("logPointCut")`，然后这个 poincut 又被 `aspect("logAspect")` 引用到了，所以就去执行相应的切面逻辑
5. 上面定义了一个全局的 `pointcut("logPointCut")`，这意味着其他的 aspect 都可以通过 id 引用这个 pointcut。其实也可以将 pointcut 写在 aspect 内，这样相当于一个私有 pointcut，其他的 aspect 无法引用这个 pointcut（因为没有 id）：

```xml
<bean id="logInterceptor" class="com.bjsxt.aop.LogInterceptor"></bean>  
<aop:config>    
	<aop:aspect id="logAspect" ref="logInterceptor">  
		<aop:before method="before" pointcut="execution(public * com.bjsxt.service..*.add(..))" />  
	</aop:aspect>  
</aop:config>  
```

某些情况下，要使用别人的切面类（比如一个测量代码性能的工具，要把测量的逻辑织入你自己的代码），这时你不可能在别人的切面类代码上加注解，所以只有通过 XML 来配置。目前在实际使用中，XML 的使用也是多于注解。