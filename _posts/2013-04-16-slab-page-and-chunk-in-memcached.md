---
layout: post
title: "slab, page and chunk in memcached"
description: ""
category: Memcached
tags: []
---
{% include JB/setup %}

## slab / page / chunk

1. 假定 slab 的增长策略是 2^n，那么会有 1KB slab、2KB slab、4KB slab、16KB slab...
2. 我们说 slab 的 size 是 1KB，实际是指 chunk 的 size 为 1KB
3. 1个 slab 包含 n 个 page （n 暂不可知），每个 page 的 size 固定为 1MB （底层硬编码为 1MB，不可配置）。
4. page 是 chunk 的容器。如果是 1KB slab，那么 chunk 也为 1KB，所以 page 就包含 1024 个chunk。如果是 1MB slab，那么 chunk 也是 1MB，page 就只包含这1个 chunk
5. 如果一个对象是 0.8KB，它会存入 1KB slab；如果是 1.2KB，会存入 2KB slab；依次类推，直到 1MB 的对象
6. 1个 chunk 只能存1个对象
7. 为减少 chunk 的浪费，目前一般采取 1.25^n 的 slab 增长策略
8. Memcached 在启动时通过 \-m 指定最大使用内存，但是这个不会一启动就占用，是随着需要逐步分配给各 slab 的。如果一个新的缓存数 据要被存放，memcached 首先选择一个合适的 slab，然后查看该 slab 是否还有空闲的 chunk，如果有则直接存放进去；如果没有则要进行申 请。slab 申请内存时以 page 为单位，所以在申请时，无论数据大小为多少，都会有 1M 大小的 page 被分配给该 slab。申请到 page 后，slab 会将这个 page 的内存按 chunk 的大小进行切分，这样就变成了一个 chunk 的数组，在从这个 chunk 数组中选择一个用于存储数据。
9. page 一旦被分配，在 memcached 重启前不会被回收或者重新分配


