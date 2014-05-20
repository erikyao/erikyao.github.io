---
layout: post
title: "jBPM-4.3 中 deploymentId 和definitionId 应该是一对一的关系"
description: ""
category: jBPM-4.3
tags: []
---
{% include JB/setup %}

　　部署的时候，deploy() 返回的就是 deploymentId。deploymentId 虽然是个 String，不过仅包含数字，目前我还不清楚它的生成策略。  

　　每次部署，还会产生一个 definitionId。definitionId 的生成与 process.jpdl.xml 文件有关：

```xml
<?xml version="1.0" encoding="UTF-8"?>  
  
<process name="ProcessName" key="ProcessKey"  version="1024" xmlns="http://jbpm.org/4.3/jpdl">  
	……  
</process>  
```

definitionId == **key-version**，如上面这个 jpdl，部署后生成的 definitionId 就是 "ProcessKey-1024"。不过要注意两点：

1. 如果没有写 &lt;process key="xxx"&gt;，那么默认 key == name（特殊情况见 [jBPM-4.3 &lt;process&gt; 标签 name 属性中的短横线会变成下划线赋给 key 属性 ](/jbpm-4.3/2010/07/29/jbpm-4-3-process-hyphen-in-process-name-weirdly/)）
2. 如果写了 &lt;process version="xxx"&gt;，那么这个 jpdl 只能部署一次，因为 version 指定了，key-version 就定死了。若不写 &lt;process version="xxx"&lt;，可以把这个 jpdl 部署多次，且 jBPM 可以帮你实现 version 的自增1

　　deploymentId 和 definitionId 是可以互查的：

<pre class="prettyprint linenums">
/** 根据deployId找definitionId */  
String definitionId = processEngine.getRepositoryService().createProcessDefinitionQuery().deploymentId(deployId).uniqueResult().getId(); 

/** 根据definitionId找deployId */  
String deployId = processEngine.getRepositoryService().createProcessDefinitionQuery().processDefinitionId(definitionId).uniqueResult().getDeploymentId();   
</pre>

　　单位项目的需求中，没有解释 deploymentId 的概念，全部用 definitionId 代替，好在是一对一的关系，不然就大条了……