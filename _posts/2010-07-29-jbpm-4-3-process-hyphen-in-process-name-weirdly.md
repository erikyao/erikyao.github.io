---
layout: post
title: "jBPM-4.3 &lt;process&gt; 标签 name 属性中的短横线会变成下划线赋给 key 属性"
description: ""
category: jBPM-4.3
tags: [jbpm-101]
---
{% include JB/setup %}

　　假设我部署了一个 jpdl.xml，&lt;process name="test-vehicle"&gt;，那么，查询出的 ProcessDefinition 的属性如下：

```java
System.out.println(pd.getName());    // definitionName == "test-vehicle"  
System.out.println(pd.getKey());       // definitionKey == "test_vehicle"  
System.out.println(pd.getVersion()); // definitionVersion == "1"  
System.out.println(pd.getId());         // definitionId == "test_vehicle-1" 
```

这在创建流程实例和查询流程定义的时候要特别注意：

```java
ExecutionService.startProcessInstanceById(“test_vehicle-1”);  
ExecutionService.startProcessInstanceByKey(“test_vehicle”);  
```

startProcessInstanceById() 传的是 definitionId（不是 deploymentId），startProcessInstanceByKey() 传的是 definitionKey。查询的时候，还可以通过 definitionName 来查：

```java
RepositoryService.createProcessDefinitionQuery().processDefinitionName("test-vehicle"); 
```

在项目中有一个方法，是传入 definitionName 来创建实例，先 `RepositoryService.createProcessDefinitionQuery().processDefinitionName("test-vehicle")` 来确定时候有 processDefinition 存在，如果有，就 `ExecutionService.startProcessInstanceByKey("test-vehicle")`。结果就悲剧了。