---
layout: post
title: "调教 GitHub Pages 与 jekyll bootstrap 时遇到的一些问题"
description: ""
category: jekyll
tags: [Config-Jekyll]
---
{% include JB/setup %}

## 1. User, Organization, and Project Pages

见 [User, Organization, and Project Pages](https://help.github.com/articles/user-organization-and-project-pages)，列个表说明下吧：

&nbsp;  | User & Organization Pages | Project Pages
- | ------------------------- | -------------
repository | username.github.io | whatever
branch | master | gh-pages
url | http://username.github.io | http://username.github.io/projectname，其实 projectname 就是你的 repositoryname

　　很多老的教程都是教你建 Project Pages 的（gh-pages 是最显著的特征，比如这篇 [搭建一个免费的，无限流量的Blog----github Pages和Jekyll入门](http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html)），可能原先并没有 User & Organization Pages。不过两者并没有太大的区别，注意下 branch 就好了

---

## 2. username.github.io 和 username.github.com

jekyll bootstrap 的教程 [Jekyll QuickStart](http://jekyllbootstrap.com/usage/jekyll-quick-start.html) 里用的是 username.github.com，其实这应该是原先的 User & Organization Pages 地址，见 [Should I rename <username.github.com> repositories to <username.github.io>?](https://help.github.com/articles/should-i-rename-username-github-com-repositories-to-username-github-io)，而且现在 username.github.com 会直接 redirect 到 username.github.io

---

## 3. install jekyll

我用的是 [RubyInstaller for Windows](http://rubyinstaller.org)，安装完之后按这篇 [Play with Jekyll ](http://blog.skydark.info/programming/2012/03/23/play-with-jekyll) 换了 taobao 的 source（这篇写得不错，很多东西可以参考），接着安装 jekyll 就出了 `The 'fast-stemmer' native gem requires installed build tools.` 的问题，按照这篇 [Installing Jekyll on Windows](http://flatshaded.com/2013/05/installing-jekyll-on-windows) 解决。注意 DevKit 和 RubyInstaller 都有 32-bit 和 64-bit 版本，必须配套

---

## 4. Markdown 解析中文的问题

参见 [Jekyll对中文问题的处理](http://nepshi.com/2012-10-08/chinese-characters-in-jekyll)，换 rdiscount 就好了

---

## 5. 语法高亮

我用的是 [google-code-prettify](https://code.google.com/p/google-code-prettify/wiki/GettingStarted)，参见 [Jekyll-bootstrap添加代码高亮 ](http://jesusjzp.github.io/blog/2013/08/17/jekyll-bootstrap-code-highlighting)。  

顺便还换了个 style，见 [Gallery of themes for code prettify](http://google-code-prettify.googlecode.com/svn/trunk/styles/index.html)

---

## 6. jekyll bootstrap twitter theme 的导航栏顺序问题

我先看到的是这篇 [Twitter bootstrap navigation bar with Jekyll](http://steve0hh.wordpress.com/2013/03/29/twitter-bootstrap-navigation-bar-with-jekyll)，但是 GitHub Pages 上不允许使用第三方的 plugin （GitHub Pages 自己定了几个 plugin 可以配，但是没有解决这个问题的 plugin），所以改用了这个解决方案 [How to change the default order pages in jekyll](http://stackoverflow.com/a/16625558)

---

## 7. pagination 的问题

I just gave it up.

先后试了两套页面，结构可以参考 [Jekyll Pagination - More awkward than it needs to be](http://patrick-mckinley.com/tech/jekyll-pagination.html)。但是最后的结果总是一样：本地一点问题都没有，push 上去第一页死活是空白，page2 开始又一切正常。找不出是哪里出问题。  

曾经想过将站点文件归到一个 \_src 文件夹，然后和 jekyll build 出的 \_site 一起 push 过去，后来觉得何必呢……等 pagination 特性更新好了，搜出来的 issue 也不少，目前没有 pagination 也足够我用了。

---

## 8. MathJax

　　按这篇 [Set up a blog using Jekyll Bootstrap](http://blog.jincan.info/web/2013/05/04/set-up-a-blog-using-jekyll-bootstrap/#latex-support) 的配置，挺顺利的。rdiscount 解析 `a^2` 的问题用 `a^{2}` 可以很好地解决。就是默认情况下字体有点偏小，应该是 post 本身文字的字体就偏小，MathJax 自动适应的，我也懒得改了。
