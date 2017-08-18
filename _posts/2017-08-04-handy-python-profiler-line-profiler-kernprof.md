---
layout: post
title: "Handy Python Profiler: <i>line_profiler</i> + <i>kernprof</i>"
description: ""
category: Python
tags: []
---
{% include JB/setup %}

Just take a look at an exemplar output and you'll know what [they](https://github.com/rkern/line_profiler) are designed for.

![](https://farm5.staticflickr.com/4411/35537257544_24366ab950_z_d.jpg)

Usage:

```bash
# Decorate your function of interest in your python script, say "foo.py" 

kernprof -l foo.py
python -m line_profiler foo.py.lprof

    # ----- OR SIMPLY----- #

kernprof -l -v foo.py
```