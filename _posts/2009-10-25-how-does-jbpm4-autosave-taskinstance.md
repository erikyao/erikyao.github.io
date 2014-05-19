---
layout: post
title: "jBPM 自动保存 TaskInstance 至数据库的机制"
description: ""
category: jBPM-4.3
tags: [HowDoes]
---
{% include JB/setup %}

1. org.jbpm 包下的 JbpmContext 类:

<pre class="prettyprint linenums">
close()  
    --> autoSave()  
        --> save(ProcessInstance)  
            --> services.save(ProcessInstance, JbpmContext)
</pre>

　　services 是 JbpmContext 类的 Services 类变量  

2. org.jbpm.svc 包下的 Services 类:

<pre class="prettyprint linenums">
save(ProcessInstance, JbpmContext)  
	--> for (saveOperation: SaveOperations)   
		saveOperation.save(ProcessInstance, JbpmContext)  
</pre>   

　　saveOperation 是 SaveOpration 类型，且如果不带参构造的话，SaveOperations 列表会等于 defaultSaveOperations 列表，而 defaultSaveOperations 列表中有一项是 HibernateSaveOperation

3. org.jbpm.svc.save 包下的 HibernateSaveOperation 类

<pre class="prettyprint linenums">
save(ProcessInstance, JbpmContext)  
	-->session.save(ProcessInstance)
</pre>

　　已经能够说明问题了吧……