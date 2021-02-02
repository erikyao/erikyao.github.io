---
layout: post
title: "Win10/Python3.7 jupyter notebook issues"
description: ""
category: 
tags: []
---
{% include JB/setup %}

## 1. Cannot connect to kernel

[Jupyter notebook: No connection to server because websocket connection fails](https://stackoverflow.com/a/54965251):

> Uninstall tornado 6 and reinstall tornado 5.

```bash
sudo pip3 uninstall tornado
sudo pip3 install tornado==5.1.1
```

## 2. Ugly fonts

Install [jupyterthemes](https://github.com/dunovank/jupyter-themes):

```bash
pip install jupyterthemes
```

My current setting is:

```bash
jt -t grade3 -f source -fs 9 -ofs 8 -T -N -kl
```