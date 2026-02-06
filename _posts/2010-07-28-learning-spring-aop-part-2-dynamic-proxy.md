---
category: AOP
description: ''
tags:
- Java-AOP
- Proxy
- 动态代理
title: Spring AOP 学习（二）：动态代理
---

如果系统中有 500 个类，每个类都要添加日志功能，此时无论是直接修改源代码、继承还是组合，都是十分巨大的工作量。此时 AOP 可以帮我们解决这个问题。  

现在假设记录日志的功能已经单独提出来了，由 `LogInterceptor` 来完成：

```java
package com.bjsxt.aop;  
  
public class LogInterceptor {  
	public void beforeMethod() {  
		System.out.println("logging...");  
	}  
}  
```

有了 Spring AOP，我们就可以用配置文件来说明：“在某个类的每一个方法执行之前，都给我调用一次 `beforeMethod()` 方法”（更复杂一点的做法是给 `beforeMethod()` 方法添加一个 Method 参数，这样可以配置可以具体到某个类的某个方法上），如：

```xml
<beans>  
	<bean id="u" class="com.bjsxt.dao.impl.UserDAOImpl" >  
		<!-- 非标准写法，仅作演示 -->  
		<Log class="com.bjsxt.aop.LogInterceptor" logMethod="beforeMethod" targetMethod="all" />  
	</bean>  
</beans>  
```

这样，在配置文件中给 500 个 bean 都加上这么一段，就能给这 500 个类都加上日志功能了。  

那么 Spring AOP 是如何实现的呢？用的是动态代理的方法。  

参考 [the proxy parameter of the invoke() method](/java/2009/08/13/proxy-parameter-of-the-invoke-method)，我们可以把 `LogInterceptor` 实现成一个 `InvocationHandler`:

```java
package com.bjsxt.aop;  
  
import java.lang.reflect.InvocationHandler;  
import java.lang.reflect.Method;  
  
public class LogInterceptor implements InvocationHandler {  
	private Object target;  
	  
	public Object getTarget() {  
		return target;  
	}  
  
	public void setTarget(Object target) {  
		this.target = target;  
	}  
  
	public void beforeMethod(Method m) {  
		System.out.println(m.getName() + ": logging...");  
	}  
  
	public Object invoke(Object proxy, Method m, Object[] args)　throws Throwable {  
		beforeMethod(m);  
		m.invoke(target, args);  
		return null;  
	}  
}  
```

调用的代码如下： 

```java
public class AOPTest {  
	public static void main(String[] args) {  
		UserDAO userDAO = new UserDAOImpl();  
		LogInterceptor li = new LogInterceptor();  
		li.setTarget(userDAO);  
		  
		UserDAO userDAOProxy = (UserDAO)Proxy.newProxyInstance(userDAO.getClass().getClassLoader(), userDAO.getClass().getInterfaces(), li);  
		  
		userDAOProxy.save(new User());  
	}  
}  
```

这里要特殊说明的是：

1. `userDAOProxy` 对象是 `UserDAOImpl` 类的动态代理，`userDAOProxy` 是 _**代理对象**_，`UserDAOImpl` 对象是 _**被代理对象**_；
2. 若想用 Java API 来给某个类（如 `UserDAOImpl`）来创建动态代理，那么这个类必须实现一个接口（如 `UserDAO`），没有实现接口的类用 Java API 是无法创建动态代理的（但 cglib 可以）。所以在 `Proxy.newProxyInstance()` 方法中，需要把被代理类的接口，即 `userDAO.getClass().getInterfaces()` 传递进去。
3. 代理对象和被代理对象应该在同一个 classLoader 中，如果在不同的 classLoader 中，它们就无法互相访问，所以 `userDAO.getClass().getClassLoader()` 也作为参数传递给了 `Proxy.newProxyInstance()`。代理对象和被代理对象需要互相访问的原因见第4点
4. 我们得到的 `userDAOProxy` 对象，其类型应该是一个组合了 `LogInterceptor` 的类（`li` 作为参数被传递给了 `Proxy.newProxyInstance()`），而 `LogInterceptor` 又组合了 `userDAOImpl（li.setTarget(userDAO)`）；加上 `userDAOProxy` 又实现了 `UserDAO` 接口，所以 `userDAOProxy` 看上去应该是这样一个类：

```java
// 非标准写法，仅作演示用  
public class UserDAOProxy implements UserDAO {  
	private InvocationHandler invocationHandler;  
  
	public UserDAOProxy(InvocationHandler invocationHandler) {  
		super();  
		this.invocationHandler = invocationHandler;  
	}  
  
	public InvocationHandler getInvocationHandler() {  
		return invocationHandler;  
	}  
  
	public void save(User user) {  
		this.invocationHandler.invoke(this, UserDAO.class.getDeclaredMethod("save", User.class), user);  
	}  
}  
```

这样，`Proxy.newProxyInstance(userDAO.getClass().getClassLoader(), userDAO.getClass().getInterfaces(), li)` 也就相当于 `new UserDAOProxy(li)`。

`userDAOProxy` 的 `save()` 方法的实际过程是：

![](/assets/posts/2010-07-28-learning-spring-aop-part-2-dynamic-proxy/23920547275_f31758bdd1_b.jpg)

Spring AOP 为系统添加业务逻辑的动态代理方法大抵就是这样。  

如果 `UserDAO` 还有个 `delete()` 方法，那么 `userDAOProxy.delete()` 也会去调用 `li.invoke(proxy, delete, user)`。这就体现了 `InvocationHandler` 是 “对被代理对象的任意方法的 invocation 都 handle” 这么一个概念。  

当然，更好的实现是把 `beforeMethod` 这部分逻辑提出来，让 `LogInterceptor` 这个类侧重 “Interceptor” 而不包含 "Log" 的逻辑，`beforeMethod` 完全可以用一个 Logger 类来实现