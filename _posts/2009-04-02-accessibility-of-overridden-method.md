---
category: Java
description: ''
tags: []
title: 'Java: 关于覆写方法的访问权限'
---

覆写方法的访问权限不得低于被覆写方法的访问权限（或者说覆写方法不能拥有比被覆写方法更严格的访问权限）。  

- `public` > `protected` > package (default) > `private`
  - 可以立即成 `private` 最严格，`public` 最宽松