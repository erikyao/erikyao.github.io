---
layout: post
title: "a weird problem caused by encoding"
description: ""
category: JSP
tags: [JSP-101]
---
{% include JB/setup %}

　　copy 一段代码到 jsp，tomcat 的 catalina.err 总说：`org.apache.jasper.JasperException: /WEB-INF/jsp/admin/lottery/add.jsp(425,32) equal symbol expected`。  

　　而且总是 `var operation` 那一行出错，`var message` 那一行是不出错的。  

　　试了千百遍，又发现：自己手动输入的代码是没有问题的，只有 copy 的代码出问题，换了下编码，真相大白：尼玛的等号什么时候也这么坑爹了！

- UTF-8下
![](https://farm2.staticflickr.com/1534/23838061111_19b03da132_o_d.png)
- GBK下 
![](https://farm6.staticflickr.com/5649/23293777293_974b35a13d_o_d.png)