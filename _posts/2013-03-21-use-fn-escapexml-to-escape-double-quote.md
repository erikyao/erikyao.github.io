---
layout: post
title: "use ${fn:escapeXml()} to escape double quote"
description: ""
category: JSP
tags: [JSP-101]
---
{% include JB/setup %}

　　页面关系是这样的：

主页面引用 share.jsp：
<pre class="prettyprint linenums">
&lt;jsp:include page= "/WEB-INF/jsp/parts/share.jsp"&gt;
     &lt;jsp:param name="title" value="something's title"/&gt;
     &lt;jsp:param name="description" value="something's description"/&gt;
&lt;/jsp:include&gt;
</pre>

share.jsp 去拼 js，还是 html inline 的 js：
<pre class="prettyprint linenums">
&lt;a href= "javascript:void(0);" title ="分享到微博" 
     onclick="window.open(gShare.share('${param.url}','${param.title}','${param.description}'))"&gt;
     &lt;b class="ico ico-share ico-share-t"&gt;&lt;/b&gt;
&lt;/a&gt;
</pre>

如果 ${param.title} 有双引号的话，拼出来的双引号就会和 `onclick="` 这里匹配，出现错误

-----

　　sw 的处理方法是：

<pre class="prettyprint linenums">
&lt;%
     request.setAttribute( "title", exchange.getTitle().replace("\"" ,"&quot;" ));
     request.setAttribute( "recommend", exchange.getRecommend().replace("\"" ,"&quot;" ));
%&gt;
&lt;jsp:param name="title" value="${title}"/&gt;
&lt;jsp:param name="description" value="${recommend}"/&gt;
</pre>

我依葫芦画瓢，但是用 fn:replace 死活不成功，以下写法都不行：

<pre class="prettyprint linenums">
value="${fn:replace(lottery.title, '"', '&quot;')}"
</pre>

<pre class="prettyprint linenums">
value="${fn:replace(lottery.title, '\"', '\\\"'}"
</pre>

<pre class="prettyprint linenums">
&lt;c:set var="search" value='"' /&gt;
&lt;c:set var="replace" value='\\"' /&gt;
value="${fn:replace(lottery.title, search, replace)}"
</pre>

-----

　　最后发现杀招 —— `fn:escapeXml`，不需要烦恼是 `&quot;` 还是 `\\\"`，还免费送上 XSS 过滤功能，何乐而不为？

<pre class="prettyprint linenums">
&lt;jsp:param name="title" value="${fn:escapeXml(lMap[lid].title)}"/&gt;
&lt;jsp:param name="description" value="${fn:escapeXml(lMap[lid].recommend)}"/&gt;
</pre>

　　参见 [How to escape double quotes in JSTL function?](http://stackoverflow.com/a/7111950)
