---
layout: post
title: "Docker: generate a Dockerfile from an image"
description: ""
category: Docker
tags: []
---
{% include JB/setup %}

按 [AndrewD on How to generate a Dockerfile from an image?](https://stackoverflow.com/a/53841690)，可以这么操作:

```bash
docker pull chenzj/dfimage

alias dfimage="docker run -v /var/run/docker.sock:/var/run/docker.sock --rm chenzj/dfimage"

dfimage IMAGE_ID > Dockerfile
```

得出来的 Dockerfile 并不能 100% 还原，但还是可以探测一下它的大概结构。