---
layout: post
title: "Git commands"
description: ""
category: Git
tags: []
---
{% include JB/setup %}

## Show all history of a file

```bash
git log -p -- README.md
```

## Save a previous version

```bash
git show <revision>:main.cpp > old_main.cpp
```

`<revision>` examples: `HEAD`, `HEAD^`, `master`, `9f3dbbb` etc.

