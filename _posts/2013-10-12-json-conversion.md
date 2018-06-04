---
layout: post
title: "JSON conversion"
description: ""
category: JavaScript
tags: [JSON]
---
{% include JB/setup %}

## 1. Java Object <-> JSONObject

服务端是将 Java Object 经过 JSONObject (或者 JSONArray) 写到页面的 js 段。在服务端的转换是：

- JavaObject -> JSONObject：`JSONObject.fromObject(lottery);`
- JSONObject -> JavaObject：`JSONObject.toBean(json);`（略复杂，可能涉及反射和类型转换）


## 2. JavaScript Var <-> JSON

结合 jQuery 使用 [jquery-json](https://code.google.com/p/jquery-json/ "jquery-json") 插件。假设有：`var thing = {plugin: 'jquery-json', version: 2.3};`

- JavaScript Var -> JSON：`var encoded = $.toJSON( thing ); // {"plugin":"jquery-json","version":2.3} `
- JSON -> JavaScript Var：`var name = $.evalJSON( encoded ).plugin; // "jquery-json"`
