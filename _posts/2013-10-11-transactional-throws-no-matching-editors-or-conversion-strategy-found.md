---
layout: post
title: "@Transactional throws \"no matching editors or conversion strategy found\""
description: ""
category: Spring
tags: [Spring-101, Config-Spring]
---
{% include JB/setup %}

I added `proxy-target-class="true"` at the `tx:`-statement:

<pre class="prettyprint linenums">
&lt;tx:annotation-driven transaction-manager="transactionManager" proxy-target-class="true"/&gt;
</pre>

and after adding `CGLIB` to my dependencies it finally worked ...

<font color="red">Answer Key:</font> Either program to interfaces or use class proxies.
