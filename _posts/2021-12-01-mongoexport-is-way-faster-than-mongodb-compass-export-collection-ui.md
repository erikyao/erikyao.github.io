---
category: MongoDB
description: ''
tags: []
title: mongoexport is WAY FASTER than MongoDB Compass' Export Collection UI, but...
---

首先这俩工具对没有耐心的人真的非常不友好：

1. 它们的施法前摇都非常长，一开始会很长时间都没动静、或者 log 不断显示 "0 documents exported"
2. 然后它们最后会像迅雷一样卡在 99.9%，你也不知道是不是哪里出了问题 (按道理即使是文件 flushing 也不应该要那么久)

但是 `mongoexport` 会比较快！我导出 1500 万个 `_id` 只花了 30 分钟 (5 分钟施法前摇、10 分钟卡在 99.9%)，但是 MongoDB Compass 的 Export Collection 花了 90 分钟还没搞定 (卡在 99.9% 了)！

需要注意的：不要随便拿网上的 `mongoexport` 例子拿来改叭改叭就 paste 到 terminal 运行了，仔细看下 `mongoexport --help` 永远不亏。很多小错误，比如把 `-f <field>` 和 `--fields=<field>` 写混了之类的，`mongoexport` **是不会有提示的！**然后你就在等它全 collection 扫描 30 分钟之后才能发觉肯定是 command 哪里写错了。

最坑爹的是 `-q <query>`/`--query=<query>` 的写法，因为 `<query>` 这个部分是个 json string，但是这是在 terminal，是 bash 解析，所以你无论是 "双引号套单引号"、还是 "单引号套双引号" 都不好使 (而且这俩一个是合法的、一个是不合法的，但 whatever 都是错的)，正确的写法是 "双引号内 escape 双引号"。我举个完整的例子：

```bash
mongoexport -h localhost:27017 -d mv_src -c dbsnp --type=csv --fields="_id" --query="{\"dbsnp.chrom\":\"22\"}" --out=dbsnp_id.csv
```

这一点 `mongoexport --help` 有说吗？没有。这样好吗？这样不好。