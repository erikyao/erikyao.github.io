---
layout: post
title: "hibernate 延迟加载的错误"
description: ""
category: Hibernate
tags: [Config-Hibernate]
---
{% include JB/setup %}

　　异常信息：`failed to lazily initialize a collection of role: <容器类对象>, no session or session was closed`

　　这个问题一般出现在 @OneToMany 的情况下，解决的方法：

1. 如果是 xml 配置，在 hbm 文件中的对应属性上配置 lazy="false"
2. 如果是用 annotation，则配置如下：

	<pre class="prettyprint linenums">
	@OneToMany(
	　　targetEntity = CourseAuthorizationItem.class,
	　　cascade = { CascadeType.PERSIST, CascadeType.MERGE },
	　　mappedBy = "xxx", fetch = FetchType.EAGER
	) </pre>

	将 fetch 类型设置成直接获取