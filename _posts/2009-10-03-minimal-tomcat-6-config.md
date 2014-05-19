---
layout: post
title: "Tomcat 6.0 环境变量和 Tomcat Manager Account"
description: ""
category: Tomcat
tags: [Tomcat-Config, Config]
---
{% include JB/setup %}

　　有的文章上说只用 CATALINA_HOME 这么一个，也有的说是 CATALINA_HOME、CATALINA_BASE、TOMCAT_HOME 这3个。我看 Tomcat Document ，CATALINA_HOME 好像是必须的，还有地方提到了 CATALINA_BASE，既然这样的话，那就三个都设置好了。

<pre class="prettyprint linenums">
CATALINA_HOME = x:\apache-tomcat-yyy  
CATALINA_BASE = x:\apache-tomcat-yyy  
TOMCAT_HOME   = x:\apache-tomcat-yyy 
</pre>
     
　　_注意_：如果环境变量的内容只有一项的话，就不要加分号了 (如设置 CATALINA_HOME 为“x:\apache-tomcat-yyy;")，否则的话 startup 和 shutdown 会有问题，双击不显示信息，窗口一闪而过。

　　然后更新 classpath 和 Path。

<pre class="prettyprint linenums">
classpath = %CATALINA_HOME%\lib\servlet-api.jar;  
Path      = %CATALINA_HOME%\bin;
</pre>
        
　　环境变量就OK了。

　　设置一个 Tomcat Manager Account 只用修改 CATALINA_HOME\conf\tomcat-user.xml，更新 <tomcat-users></tomcat-users> 块，如：

	<tomcat-users>  
		<role rolename="manager"/>   
		<user username="admin" password="admin" roles="manager"/>  
	</tomcat-users>

然后就能登录在 http://localhost:zzzz/ 页面左侧的 Tomcat Manager 了。