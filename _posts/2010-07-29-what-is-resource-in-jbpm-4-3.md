---
layout: post
title: "jBPM-4.3 流程定义 zip 包中的所有文件都是资源"
description: ""
category: jBPM-4.3
tags: [jbpm-101]
---
{% include JB/setup %}

<pre class="prettyprint linenums">
ZipInputStream zis = new ZipInputStream(new FileInputStream("process.jpdl.zip"));  
  
processEngine.getRepositoryService().createDeployment().addResourcesFromZipInputStream(zis).deploy();  
</pre>

　　如果是部署的是 zip 包，那么 zip 包中的所有文件都是可用的资源。换句话说，你可以把杂七杂八的文件都放在 zip 包中一起部署。比如现在我的 process.jpdl.zip 里面不仅有 process.jpdl.xml 和 process.png，还有一个 resource.xml，那么这个 resource.xml 也是可以被获取到的，如：

<pre class="prettyprint linenums">
Set<String> resourceSet = processEngine.getRepositoryService().getResourceNames(deployId);  
for (String s : resourceSet) {  
	System.out.println(s);   
}

// Output:   
// resource.xml  
// process.jpdl.xml  
// process.png  
</pre>

除了得到资源的 InputStream 外：

<pre class="prettyprint linenums">
ByteArrayInputStream bis = (ByteArrayInputStream)processEngine.getRepositoryService().getResourceAsStream(deployId, "resource.xml");  
</pre>

资源还可以被动态修改，不过要注意，动态修改资源这个方法在 RepositoryServiceImpl 中，RepositoryService 接口并没有暴露这个方法：

<pre class="prettyprint linenums">
is2 = new FileInputStream("newResource.xml");  
  
RepositoryServiceImpl rsi = (RepositoryServiceImpl)processEngine.getRepositoryService();  
rsi.updateDeploymentResource(deployId, "resource.xml", is2);  
</pre>

这样就把 newResource.xml 的内容写入了 resource.xml 中（覆盖原有内容），此时再获取 resource.xml 的 InputStream，输出出来的结果就是 newResource.xml 的内容