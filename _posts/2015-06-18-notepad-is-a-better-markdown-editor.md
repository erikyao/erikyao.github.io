---
layout: post
title: "Notepad++ is a better Markdown editor"
description: ""
category: Notepad++
tags: []
---
{% include JB/setup %}

## Digress: Word Wrap

word wrap (自动换行) 并不在 `Settings->Preferences` 里面，而是直接在 `View` 里，check 上就好了。每次总要找半天……

## Markdown Syntax Highlighting

`Language->Define your language...`。估计是我的 userDefineLang.xml 太老了，图片的 `![]()` 后面全部变成了 comment 的绿色。"User Language:" 下拉菜单选中 Markdown，直接 Remove 掉，然后重新 Import（不用 Create New...）。

新的 userDefineLang.xml 用 [Edditoria/markdown_npp_zenburn](https://github.com/Edditoria/markdown_npp_zenburn) 的 default_theme 就够用了。

## Digress: Installing "Python Script" Plugin

这个插件其实和 NppExec 没啥关系。NppExec 相当于是个 cmd，你要跑 python 的话需要把 `E:\xxx\python.exe zzz.py` 这样的命令整个写进去执行。

用 Plugin Manager 来装 Python Script 是会出问题的。我们按 [Emmet - Notepad++ “Unknown exception”](http://stackoverflow.com/a/26128628) 的回答到 [SourceForge: Notepad++ Python Script](http://sourceforge.net/projects/npppythonscript/files/?source=navbar) 去下一个 `PythonScript_Full_xxxx.zip` 然后直接扔到 `D:\Notepad++` 并 "解压到当前文件夹" 就好了。

如果安装成功的话，你打开 `Plugins->Python Script->Show Console` 会显示出：

```
Python 2.7.6-notepad++ r2 (default, Apr 21 2014, 19:26:54) [MSC v.1600 32 bit (Intel)]
Initialisation took 171ms
Ready.
```

## Wrapping Text

按 [Wrap Text with Quotation Marks in Notepad++](http://stackoverflow.com/a/11784510) 的思路，我们可以自己写 script 来实现诸如 "`Ctrl + B` 变 bold" 这样的功能。
