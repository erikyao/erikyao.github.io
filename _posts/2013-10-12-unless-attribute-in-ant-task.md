---
layout: post
title: "Ant target 的 unless 含义"
description: ""
category: Ant
tags: []
---
{% include JB/setup %}

`<target unless="condition">`

=> RUN target if "condition" is not set or eq false

ant -Dcondition=true 传参数