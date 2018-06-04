---
layout: post
title: "阻止 form submit 的方法"
description: ""
category: JavaScript
tags: []
---
{% include JB/setup %}

有两个地方可以可以阻止 form submit，一是 `<form onsubmit="">` ，二是 `<form>` 下的 `<input type="submit" onclick="">` ，只要这两个函数有一个是 `return false;`，那么点击这个 button 并不会 submit form。  

具体的执行流程是这样的：

```javascript
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
```

所以在这个两个函数里面可以加一些验证工作，同时，可以根据验证结果来判断是否提交 form。比如有：

```javascript
var checkForm = function() {  
	// 获取输入  
	if (校验失败)  
		return false；  
	else  
		return true；  
}  
```

然后把这个函数写到 `onsubmit` 或是 `onclick`，也可以针对不同的 button 写不同的逻辑的校验函数，比如这样：

```html
<html>  
	<form onsubmit="return checkFormStep2();" method="post" action="/XXX.do">  
		<input type="text" id="username">  
		<input type="password" id="password">  
  
		<input type="submit" onclick="return checkFormStep1();" value="go" />  
	</form>  
</html>  
```

在点击时先执行 `checkFormStep1()`，在 form 提交前再执行 `checkFormStep2()`，两个都通过都 `return true` 了才提交。  

也可以针对 “撤销” 功能的按钮写一些类似清空输入的功能，再禁止它提交 form，比如这样：

```html
<html>  
	<form method="post" action="/XXX.do">  
		<input type="text" id="username">  
		<input type="password" id="password">  
  
		<input type="submit" onclick="return checkFormStep();" value="go" />  
		<input type="submit" onclick="clearInput(); return false;" value="reset" />  
	</form>  
</html>  
```
