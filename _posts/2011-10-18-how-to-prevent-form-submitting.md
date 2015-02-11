---
layout: post
title: "阻止 form submit 的方法"
description: ""
category: JavaScript
tags: [JavaScript-101]
---
{% include JB/setup %}

　　有两个地方可以可以阻止 form submit，一是 `<form onsubmit="">` ，二是 &lt;form&gt; 下的 `<input type="submit" onclick="">` ，只要这两个函数有一个是 return false;，那么点击这个 button 并不会 submit form。  

　　具体的执行流程是这样的：

<pre class="prettyprint linenums">
if (submitInput.onclick() == false) {  
	// 不触发 form.onsubmit();  
	// form 不提交;  
} else {  
	// 触发 form.onsubmit();  
	if (form.onsubmit() == false) {  
		// form 不提交  
	} else {  
		// 提交 form  
	}  
}  
</pre>

所以在这个两个函数里面可以加一些验证工作，同时，可以根据验证结果来判断是否提交form。比如有：

<pre class="prettyprint linenums">
var checkForm = function() {  
	// 获取输入  
	if (校验失败)  
		return false；  
	else  
		return true；  
}  
</pre>

然后把这个函数写到 onsubmit 或是 onclick，也可以针对不同的 button 写不同的逻辑的校验函数，比如这样：

<pre class="prettyprint linenums">
&lt;html&gt;  
	&lt;form onsubmit="return checkFormStep2();" method="post" action="/XXX.do"&gt;  
		&lt;input type="text" id="username"&gt;  
		&lt;input type="password" id="password"&gt;  
  
		&lt;input type="submit" onclick="return checkFormStep1();" value="go" /&gt;  
	&lt;/form&gt;  
&lt;/html&gt;  
</pre>

在点击时先执行 checkFormStep1()，在 form 提交前再执行 checkFormStep2()，两个都通过都 return true 了才提交。  

　　也可以针对 “撤销” 功能的按钮写一些类似清空输入的功能，再禁止它提交 form，比如这样：

<pre class="prettyprint linenums">
&lt;html&gt;  
	&lt;form method="post" action="/XXX.do"&gt;  
		&lt;input type="text" id="username"&gt;  
		&lt;input type="password" id="password"&gt;  
  
		&lt;input type="submit" onclick="return checkFormStep();" value="go" /&gt;  
		&lt;input type="submit" onclick="clearInput(); return false;" value="reset" /&gt;  
	&lt;/form&gt;  
&lt;/html&gt;  
</pre>