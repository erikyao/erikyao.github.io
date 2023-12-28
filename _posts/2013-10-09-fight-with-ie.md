---
category: JavaScript
description: ''
tags:
- IE
title: IE 下的奇葩注意事项
---

## IE 6 下，json 内部末尾不能有逗号

```js
var oConfs = {
    a6 : {
        url : "http://foo.bar.com",
        title : "欢迎登录！",
        period : [new Date(2011, 11, 8), new Date(2012, 0, 1)]
    }, // this comma kills  
};
```

## IE6/7/8 下，空的 `<img src="" />` 会发一个请求到当前域名

可谓神不知鬼不觉

## IE6/7/8 不支持 JS 的 `String.trim()` 方法

一定要用的话可以自己加一个 `String.prototype.trim = function( ) { ... };`

可参 [給 js 的 String 添加 trim 方法](https://my.oschina.net/snandy/blog/12724)