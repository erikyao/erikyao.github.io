---
category: vs-code
description: ''
tags: []
title: 'VS Code: change the default path of integrated terminal to current file''s
  directory'
---

Go to `Preference -> Settings -> terminal.integrated.cwd`, fill in `${fileDirname}`. Now every time you open a new terminal in VS Code, it will start at the directory of your current file.

![](/assets/posts/2021-08-23-vs-code-change-the-default-path-of-integrated-terminal-to-current-files-directory/cwd.png)