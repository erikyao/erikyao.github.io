---
layout: post
title: "@Transactional throws \"no matching editors or conversion strategy found\""
description: ""
category: Spring
tags: []
---
{% include JB/setup %}

I added `proxy-target-class="true"` at the `tx:`-statement:

```xml
<tx:annotation-driven transaction-manager="transactionManager" proxy-target-class="true"/>
```

and after adding `CGLIB` to my dependencies it finally worked ...

<font color="red">Answer Key:</font> Either program to interfaces or use class proxies.
