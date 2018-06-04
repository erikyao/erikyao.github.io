---
layout: post
title: "Every servlet, controller, service, DAO, etc is Singleton in a SpringMVC application context"
description: ""
category: SpringMVC
tags: []
---
{% include JB/setup %}

　　默认情况下，Servlet、Controller、Service、Dao 什么的，在 SpringMVC 中都是单例，[spring mvc declaring all beans singleton](http://stackoverflow.com/a/12147396) 有说：

> Because Spring beans are typically stateless, you can safely call them from multiple threads. That's how your application works: there is only one instance of every controller, service, DAO, etc. But your servlet container (through Spring) calls these beans from multiple threads - and it's completely thread safe.  
> <br/>
> In fact in plain servlets the situation is the same - there is only instance of each servlet and it can be accessed by infinite number of threads. As long as this servlet is stateless or properly synchronized.  
> <br/>
> Do not confuse Spring with stateless session beans in ejb that are pooled and each client gets its own instance from the pool.
> In fact that's a bit dumb - since the beans are stateless by the definition, there is no point in pooling them and preventing concurrent access...  

　　简单说就是这样：

request1 -> thread1 -> xxxControllerInstance1.process()  
request2 -> thread2 -> xxxControllerInstance1.process()  
request3 -> thread3 -> xxxControllerInstance1.process()  
