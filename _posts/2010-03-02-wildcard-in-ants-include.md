---
category: Ant
description: ''
tags: []
title: Ant 路径之 **
---

```xml
<fileset dir="${lib.dir}" includes="*.jar"/>
```

表示 include `${lib.dir}` 文件夹 (不包括其子文件夹) 下的所有 \.jar 文件  

```xml
<fileset dir="${lib.dir}" includes="**/*.jar"/>  
```

表示的是 include `${lib.dir}` 及其子文件夹下的所有 \.jar 文件