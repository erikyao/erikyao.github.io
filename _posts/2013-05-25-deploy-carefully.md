---
layout: post
title: "Deploy carefully!"
description: ""
category: as-a-coder
tags: [Discernment]
---
{% include JB/setup %}

## Deploy 最需要注意的问题 ##

　　严格区分测试环境和线上环境，不要混用（如：测试 dfs + 测试 db、线上 dfs + 线上 db，lp 项目）

## 接手老项目后第一次 Deploy 时千万要小心 ##

　　老项目各种凶险，you cannot be too careful on that!

1. 检查是否有测试环境配置文件。若没有，检查 SVN 上的配置文件是测试环境的还是线上环境；若是打补丁，请 _**务必**_ 与服务器上的配置文件做 diff （比如：aupg 第一个补丁，SVN 上是测试环境 mysql 配置，直接覆盖到线上了，12 天后才发现，又花大力气 merge 数据库）
2. 检查 build.xml 打包的结果是否正确
3. 若是打补丁，请 _**务必**_ 保留原始备份（比如：aupg 第一个补丁，没有备份就玩完了！）
