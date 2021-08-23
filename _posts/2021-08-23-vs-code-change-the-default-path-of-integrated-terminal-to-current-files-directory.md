---
layout: post
title: "VS Code: change the default path of integrated terminal to current file's directory"
description: ""
category: vs-code
tags: []
---
{% include JB/setup %}

Go to `Preference -> Settings -> terminal.integrated.cwd`, fill in `${fileDirname}`. Now every time you open a new terminal in VS Code, it will start at the directory of your current file.

![](https://live.staticflickr.com/65535/51398703635_f50783925b_o_d.png)
