---
layout: post
title: "&lt;form&gt;&lt;input name=?&gt;"
description: ""
category: JavaScript
tags: [JavaScript-101]
---
{% include JB/setup %}

## `<form>` 下的 `<input>` 必须写 name

只有设置了 name 属性的表单元素才能在提交表单时传递它们的值！

所以在 `form.submit()` 的时候请一定将 `<form>` 下的 `<input>` 加上 name！

## `<form>` 下的多个 `<input>` 可以有相同的 name

如果一个 `<form>` 下 有多个相同 name 的 `<input>`，那么请用 `String[] = request.getParameterValues()` 来获取这多个 `<input>` 的值
