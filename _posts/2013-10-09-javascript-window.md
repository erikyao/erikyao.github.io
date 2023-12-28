---
category: JavaScript
description: ''
tags: []
title: 'JavaScript: window 注意事项'
---

## 调用 `window.open()` 的注意事项

`onclick` 里执行 `window.open()` 大部分情况下是没问题的

个别的情况下比如 ajax 返回时 `success` 事件里放一个 `window.open()` 就可能有问题了，因为浏览器会判断是用户主动点击还是程序自己做的。程序自己做的会被当做垃圾请求的，因为以前那些广告网站很喜欢这么做

## `window.onload` 和 `document.onready` 的区别

`window.onload` 是页面上的资源文件全部下载完毕，包括图片、多媒体这些资源

`document.onready` 就是 dom 节点准备完毕了就行，不需要图片下载完

## `window.location.hash` 注意事项

`window.location.hash` 指 url 末尾 `#` 后的内容，类似于：

```js
http://example.com/blah#123
http://example.com/blah#456
```

但是有一点要注意：用户修改 hash 并回车，浏览器是不跳转的。需要 iframe 定期去轮询扫描 `parent.location`，发现有用户修改就跳转

然后，跨域子页面读取父页面的 hash 值是读不到的