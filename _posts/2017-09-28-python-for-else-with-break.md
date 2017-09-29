---
layout: post
title: "Python: <i>for-else</i> with <i>break</i>"
description: ""
category: Python
tags: [Python-101]
---
{% include JB/setup %}

[Python Tips: 19. For - Else](http://book.pythontips.com/en/latest/for_-_else.html):

> The `else` clause executes when the loop completes normally. This means that the loop did not encounter any `break`.

In addition, if an exception is raised in `for` without handling, `else` after this `for` won't execute.