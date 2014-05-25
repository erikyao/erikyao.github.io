---
layout: post
title: "a weird problem caused by encoding"
description: ""
category: Tomcat
tags: [GTR]
---
{% include JB/setup %}

　　copy 一段代码到 jsp，tomcat 的 catalina.err 总说：`org.apache.jasper.JasperException: /WEB-INF/jsp/admin/lottery/add.jsp(425,32) equal symbol expected`。  

　　而且总是 `var operation` 那一行出错，`var message` 那一行是不出错的。  

　　试了千百遍，又发现：自己手动输入的代码是没有问题的，只有copy 的代码出问题，换了下编码，真相大白：尼玛的等号什么时候也这么坑爹了！

- UTF-8下
![](https://hefufa.bn1.livefilestore.com/y2pNFVKQc6X-9opCDE7U3CmbOBaFLnFv3Ew3Jz5VSB6FqQsq1U6Ouo1TTnKhuiiyhZuvz6H61_j2Gkv0-tj_w2VSaGarI6oFMeUt1uDItXn3E8/%E6%9C%AA%E5%91%BD%E5%90%8D.png?psid=1)
- GBK下 
![](https://fqcs5w.bn1302.livefilestore.com/y2p0Tdbl35fYSp0Pvvgmpnc9l_hD_Eyq02ibhQb9i-_MH1GMNA9Y5_rnv1awnb4upH7i_utn8-Zr5_bq405jPdMLlyC0Tt8tAE7WAt4KRA_em8/%E6%9C%AA%E5%91%BD%E5%90%8D2.png?psid=1)