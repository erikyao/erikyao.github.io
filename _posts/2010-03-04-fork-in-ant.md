---
layout: post
title: "Ant 中的 fork=\"true\""
description: ""
category: Ant
tags: []
---
{% include JB/setup %}

Set _fork_ attribute to true, to run javac in a separate process with its own heap size settings. If _fork_ is set to false, or not set (default is false), javac will run in the same process as Ant, which has a default maximum heap size.