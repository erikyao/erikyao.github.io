---
layout: post
title: "<%@ page contentType%> 注意事项两则"
description: ""
category: JSP
tags: [JSP-101]
---
{% include JB/setup %}

## 1. charset=utf-8 & charset=UTF-8 are both OK

jsp 设置编码 `<%@ page contentType="text/html; charset=utf-8"%>`，写成 UTF-8 也可以

-----
 
## 2. <%@ include file> 涉及到的两个 JSP 对 <%@ page contentType%> 有要求

　　如果写了 `<%@ include file="/WEB-INF/xxx.jsp" %>`，那么这两个 jsp 的 `<%@ page contentType%>` 必须完全相同  

　　注意是 _**完！全！相！同！**_ 一个空格都不能多。  

　　曾经的教训：

| file         | instruction |
|==============|=============|
| main JSP     | `<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>` |
| included JSP | `<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>` |

　　导致 resin 3.0.23 下报：

> JspLineParseException: contentType 'text/xml; charset=UTF-8' conflicts with previous value of contentType 'text/html;charset=UTF-8'. Check the .jsp and any included .jsp files for conflicts
