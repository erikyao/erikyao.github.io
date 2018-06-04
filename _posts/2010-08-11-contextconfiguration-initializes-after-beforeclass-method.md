---
layout: post
title: "Spring TestContext 测试框架中 @BeforeClass 方法无法使用 @ContextConfiguration 初始化的 bean"
description: ""
category: Spring
tags: []
---
{% include JB/setup %}

例如我们有：

```java
@ContextConfiguration(locations = {"classpath:datasource.xml", "classpath:process-engine.xml"})  
public class ProcessConfigurationManagerTest extends AbstractJUnit4SpringContextTests {  
	……  
}  
```

在写 `@BeforeClass` 方法时，datasource.xml 和 process-engine.xml 这两个文件并没有读取，所以不能实例化 bean。也就是说这两个文件的读取在 `@BeforeClass` 之后。`@BeforeClass` 方法中就不能使用这两个 xml 文件中配置的 bean，否则直接是 `NullPointerException`。  

在 `@Before` 方法中就不会有这中情况。  

遇到两次了，谨记。  

_P.S._：一个 annotation 类型被定义为 `@Retent(RetentionPolicy.RUNTIME)` 后，它才是在运行时可见，当 class 文件被装载时被保存在 class 文件中的 annotation 才会被虚拟机读取。