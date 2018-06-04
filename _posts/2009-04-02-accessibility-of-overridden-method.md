---
layout: post
title: "关于覆写方法的访问权限"
description: ""
category: Java
tags: []
---
{% include JB/setup %}

　　覆写方法的访问权限不得低于被覆写方法的访问权限（或者说覆写方法不能拥有比被覆写方法更严格的访问权限）。  

　　public > protected > package (default) > private （private最严格，public最宽松）