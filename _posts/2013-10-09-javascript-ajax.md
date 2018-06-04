---
layout: post
title: "JavaScript: ajax 注意事项"
description: ""
category: JavaScript
tags: [ajax]
---
{% include JB/setup %}

## Ajax Post 数据加号变空格

采用 Ajax 传递数据时，通常会将数据整理为 `data="var1=abc&var2=def"`。而当数据中存在加号 (`+`) 或是连接符 (`&`) 时，服务器端接收数据时会有部分数据丢失现象。

分析一下 Ajax 传递数据的格式与 JavaScript 的语法不难发现：

1. `+`：JavaScript 解析为字符串连接符，所以服务器端接收数据时 `+` 会丢失。
2. `&`：JavaScript 解析为变量连接符，所以服务器端接收数据时 `&` 以后的数据都会丢失。

解决办法也相当简单，只需要为 `+` 与 `&` 符号编码即可：

```js
//使用post方式发送
function doRequestUsingPOST(){
   createXMLHttpRequest();
   var retCode = document.getElementById("retCode").value;
   var data = document.getElementById("data").value;
   data = data.replace(/\+/g, "%2B");
   data = data.replace(/\&/g, "%26")；

   var queryString = "retCode="+retCode+"&data="+data;
   var url="backSealServlet" ; //使用URL向后台传值
   //xmlHttp.open("POST",url,true);
   xmlHttp.open("POST",url,false);
   xmlHttp.onreadystatechange = handleStateChange;
   xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");

   xmlHttp.send(queryString);

   //alert("结束  "+retCode);
}
```

## Ajax 的 `onSuccess` 和 `onComplete` 接收到的 response 格式是不同的

问：AJAX 请求 http://foo.bar.com/baz/validate.do，`dataType:"text"`

该请求理应返回 `"0\nam success"` 或 `"-1\nwrong vcode"`

但用 `complete` 接收就只能得到 `XMLHttpRequest` 对象，用 `success` 就能得到期待的 `String`

解：看函数定义，`success(data, textStatus, jqXHR)`，而 `complete(jqXHR, textStatus)`

你写成 `$.ajax(..., complete: function onReceive(data) {...})`，肯定只能得到 `jqXHR`，也就是 `XMLHttpRequest`

当响应 Ajax 请求的 Controller 做如下操作：

- `forward`：不跳转（必然的），`ajax.success` 不执行，`ajax.complete` 执行
- `sendRedirect`：不跳转（浏览器不跳转），`ajax.success` 不执行，`ajax.complete` 执行