---
layout: post
title: "Locate Bugs by Replaying"
description: ""
category: Thought
tags: [Experience]
---
{% include JB/setup %}

线上机的 exception log 可能被吞（日志量很大的时候，exception log 根本就打不出来），此时可以用测试机 debug。如果测试机没问题，说明是线上环境问题（网络不好、依赖的外部接口挂了之类的）。如果测试机一样挂，那么直接在测试机上找问题就好了