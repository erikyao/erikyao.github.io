---
layout: post
title: "JavaScript: sleep"
description: ""
category: JavaScript
tags: [JavaScript-101]
---
{% include JB/setup %}

## 模拟 sleep 功能

```js
function sleep(millis) {
    var date = new Date();
    var curDate = null;

    do {
        curDate = new Date();
    } while(curDate-date < millis);
}
```

## 不要在前端 sleep 来模拟长时间的响应

前端 sleep 的话，整个窗口被占住，其他的 js 根本不会响应。请转到后端 `Thread.sleep(long)`
