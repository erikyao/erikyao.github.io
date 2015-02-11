---
layout: post
title: "Spring AOP 学习（一）：组合对比继承的优势"
description: ""
category: AOP
tags: [Java-AOP, Proxy, Delegate, 动态代理]
---
{% include JB/setup %}

　　来自尚学堂Spring视频教程；作文字总结。

---

　　系统中现有接口 UserDAO 及其实现 UseDAOImpl：

<pre class="prettyprint linenums">
package com.bjsxt.dao;  
  
import com.bjsxt.model.User;  
  
public interface UserDAO {  
	public void save(User user);  
}  
</pre>

<pre class="prettyprint linenums">
package com.bjsxt.dao.impl;  
  
import com.bjsxt.dao.UserDAO;  
import com.bjsxt.model.User;  
  
public class UserDAOImpl implements UserDAO {  
	public void save(User user) {     
		// Hibernate or JDBC, whatever
		System.out.println("user saved!");  
	}  
}  
</pre>

现在需要在save方法前记录日志，如：

<pre class="prettyprint linenums">
package com.bjsxt.dao.impl;  
  
import com.bjsxt.dao.UserDAO;  
import com.bjsxt.model.User;  
  
public class UserDAOImpl implements UserDAO {  
	public void save(User user) {     
		// Hibernate or JDBC, whatever
		System.out.println("logging......");  
		System.out.println("user saved!");  
	}  
}  
</pre>

当然，像这样直接在源代码里添加当然是最简单的了。但如果拿不到源代码呢？此时可以新写一个类来继承 UserDAOImpl，用 delegation：

<pre class="prettyprint linenums">
package com.bjsxt.dao.impl;  
  
import com.bjsxt.model.User;  
  
public class UserDAOImpl2 extends UserDAOImpl {  
	public void save(User user) {  
		System.out.println("logging......");  
		super.save(user);     
	}  
}  
</pre>

用组合的方式也可以，如：

<pre class="prettyprint linenums">
package com.bjsxt.dao.impl;  
  
import com.bjsxt.dao.UserDAO;  
import com.bjsxt.model.User;  
  
public class UserDAOImpl3 implements UserDAO {    
	private UserDAO userDAO = new UserDAOImpl();  
	  
	public void save(User user) {     
		System.out.println("logging......");  
		userDAO.save(user);   
	}  
}  
</pre>

这样，把系统的 beans.xml 文件中配置的 UserDAOImpl 改成 UserDAOImpl2 或者 UserDAOImpl3，系统就有了记录日志的的功能了。  

　　这三种添加日志功能的方法中：

1. 直接在源码中写死是最不灵活的方式，因为万一要修改日志功能，要在 UserDAOImpl 的代码中去搜索日志功能的代码，耦合度太高
2. 继承的方式也不够灵活。首先 UserDAOImpl1 这个类无法再继承其他的类；再次，父类的改动必然引起子类的改动，耦合度太高
3. 组合没有耦合度太高的问题；成员 private UserDAO userDAO 可以使用多态；继承只能继承一个 Impl，而组合更为灵活，可以组合多个 Impl，如同时组合 UserDAOImpl 和 ForumDAOImpl。这3种方法中，组合的方式最好，在设计模式中也经常用组合来替代继承

　　另：这里的继承和组合都是静态代理，对应于 [Spring AOP 学习（二）：动态代理](/aop/2010/07/28/learning-spring-aop-part-2-dynamic-proxy/) 中的动态代理