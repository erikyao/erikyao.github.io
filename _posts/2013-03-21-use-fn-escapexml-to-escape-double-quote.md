---
layout: post
title: "JSP: use ${fn:escapeXml()} to escape double quotes"
description: ""
category: JSP
tags: [escape]
---
{% include JB/setup %}

页面关系是这样的：

主页面引用 share.jsp：

```xml
<jsp:include page= "/WEB-INF/jsp/parts/share.jsp">
     <jsp:param name="title" value="something's title"/>
     <jsp:param name="description" value="something's description"/>
</jsp:include>
```

share.jsp 去拼 js，还是 html inline 的 js：

```html
<a href= "javascript:void(0);" title ="分享到微博" 
	onclick="window.open(gShare.share('${param.url}','${param.title}','${param.description}'))">
     <b class="ico ico-share ico-share-t"></b>
</a>
```

如果 `${param.title}` 有双引号的话，拼出来的双引号就会和 `onclick="` 这里匹配，出现错误

-----

sw 的处理方法是：

```html
<%
     request.setAttribute( "title", exchange.getTitle().replace("\"" ,""" ));
     request.setAttribute( "recommend", exchange.getRecommend().replace("\"" ,""" ));
%>
<jsp:param name="title" value="${title}"/>
<jsp:param name="description" value="${recommend}"/>
```

我依葫芦画瓢，但是用 `fn:replace` 死活不成功，以下写法都不行：

```javascript
value="${fn:replace(lottery.title, '"', '"')}"
```

```javascript
value="${fn:replace(lottery.title, '\"', '\\\"'}"
```

```html
<c:set var="search" value='"' />
<c:set var="replace" value='\\"' />
value="${fn:replace(lottery.title, search, replace)}"
```

-----

最后发现杀招 —— `fn:escapeXml`，不需要烦恼是 `"` 还是 `\\\"`，还免费送上 XSS 过滤功能，何乐而不为？

```javascript
<jsp:param name="title" value="${fn:escapeXml(lMap[lid].title)}"/>
<jsp:param name="description" value="${fn:escapeXml(lMap[lid].recommend)}"/>
```

参见 [How to escape double quotes in JSTL function?](http://stackoverflow.com/a/7111950)
