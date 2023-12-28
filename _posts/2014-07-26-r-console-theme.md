---
category: R
description: ''
tags: []
title: R console theme
---

R console 并没有提供 theme 选项，只有自己配 color。在 "X:[R-folder]\etc\Rconsole" 文件中可以指定 color（在 ## Colours for console and pager(s) 小节）（color 的名称在 "X:[R-folder]\etc\rgb.txt"，不过我觉得看起来很不方便）。目前配了一个觉得还不错的方案是：

```ini
background = gray10 
normaltext = DarkSeaGreen 
usertext = LightSkyBlue4 
highlight = HotPink 
```

整体感觉和 RStudio 的 "Tomorrow Night 80's" theme 接近。