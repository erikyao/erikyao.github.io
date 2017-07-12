---
layout: post
title: "常见 HTTP Status Code 及场景"
description: ""
category: HTTP
tags: [HTTP-101]
---
{% include JB/setup %}

- `302`：我们常说的 "302 跳转" 其实就是 `sendRedirect`
- `404`：说明 URL 不对，可能是后台 URL 没发出来，可能浏览器 URL 写错，或者后台 URL 写错
- `500`：后台异常，一定会有 exception log，不要因为 log 刷屏而认为没有 exception
- `503`：Service Temporarily Unavailable，服务器在重启时，请求会返回503