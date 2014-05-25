---
layout: post
title: "never fake a &lt;input type=file&gt;"
description: ""
category: HTML
tags: [Discernment, Discernment-HTML]
---
{% include JB/setup %}

　　不管这篇 [自定义input type=”file”的样式以及引出的相关技术问题](http://www.haojii.com/2011/04/jquery-change-event-to-input-file-on-ie/) 描绘得有多么好，永远不要妄想用 `<span>` 来代替 `<input type="file">` （即自定义样式的file控件），浏览器兼容性问题 is watching you! 我们可是连 IE6 都要测的……（如：图片上传弹窗，lp 项目）