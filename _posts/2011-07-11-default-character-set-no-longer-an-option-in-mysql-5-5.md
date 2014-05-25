---
layout: post
title: "MySQL 5.5 版本下 my.ini 内 [mysqld] 项中不能再写 default-character-set=utf8"
description: ""
category: MySQL
tags: [Config, Config-MySQL]
---
{% include JB/setup %}

　　原来在 5.1 版本时，为了解决中文乱码问题设置默认字符集为 utf8 时，在 my.ini 内的 [mysql] 和 [mysqld] 项中都是写：

<pre class="prettyprint linenums">
default-character-set=utf8  
</pre>

　　到了 5.5 版本， [mysql] 项内可以这么写， [mysqld] 项内不能再这么写了，而是必须写：

<pre class="prettyprint linenums">
character-set-server=utf8  
</pre>

否则在启动MySQL服务时会有1067错误。