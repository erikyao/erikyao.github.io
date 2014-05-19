---
layout: post
title: "a simple delegation example"
description: ""
category: Java
tags: [Java-101, Delegate]
---
{% include JB/setup %}

<pre class="prettyprint linenums">
public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {  
    doGet(req, resp);  
}  
</pre>

　　简直是最简单也最直白的例子了。我们称 doPost() delegates its function to doGet() 或者说 doPost() delegates doGet() to function。