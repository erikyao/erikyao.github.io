---
category: Docker
description: ''
tags: []
title: 'Docker: volume'
---

## 1. Volume 是什么

我觉得 docker 关于 volume 写了那么多 document，但还是没咋说清楚。其实联系 mount 就知道 volume 是啥了 (但是 mount 自己也有点没讲清楚)。

先看 mount。根据 [Mounting Definition](http://www.linfo.org/mounting.html):

> **Mounting** is the attaching of an additional filesystem to the currently accessible filesystem of a computer.  
> <br/>
> A **mount point** is a directory (typically an empty one) in the currently accessible filesystem on which an additional filesystem is mounted (i.e., logically attached).

我觉得 mount 的定义的一个问题就是：没有单独给 currently accessible filesystem 和 additional filesystem 单独取名字。其实理解成 `主体 fs` 和 `挂件 fs` 就可以了

根据定义，mount point 一定是在 `主体 fs` 上的。如果我们把 docker container 看做 `主体 os`，把 docker host 看做 `挂件 os`，那么 **volume 就是 `挂件 os` 上的一个 path**，它会被 mount 到 `主体 fs` 的 mount point 上。

注意在 docker 里这个管辖的权利是倒挂的：

- 一般是 `主体 os` 来负责 mounting 
  - 比如你在 ubuntu 里 mount 一个 hard drive，你肯定是操作 ubuntu，而 hard drive 不具备运行能力
- 但是 docker 是 `挂件 os` (docker host) 反过来操作 `主体 os` (docker container) 
  - 而且他们两者都具备运行能力

```text
┌─────────────┐  controls  ┌──────────────────┐
│ Docker Host ├───────────►│ Docker Container │
│             │            │                  │
│  ┌──────┐   │ mounted to │   ┌───────────┐  │
│  │volume├───┼────────────┼──►│mount point│  │
│  └──────┘   │            │   └───────────┘  │
│             │            │                  │
└─────────────┘            └──────────────────┘
```

## 2. Volume 的分类

这个问题 document 也没咋说清楚。volume 有三类：

- named volume
  - 比如先 `docker volume create <volume-name>`
  - 然后 `docker run -v <volume-name>:<mount-point>`
- anonymous volume
  - 比如 Dockerfile 里的 `VOLUME <mount-point>`
    - 这个语法的逻辑其实有点 tricky
- host volume
  - 比如 `docker run -v <volume-path>:<mount-point>`

这三个名字起得也是挺灾难的。它们主要的区别在于：

1. volume 是否在 docker 默认的路径下
2. volume 与 mount point 之间的 copy 行为

### 2.1 Volume 的默认路径

docker 会有一个默认的 volume 的主路径，比如 linux 下可能是：

```bash
/var/lib/docker/volume/
```

如果你创建一个 named volume，比如：

```bash
docker volume create vee
```

那么就会创建一个 `/var/lib/docker/volume/vee` 作为你实际的 volume 路径，只不过 docker 会做 name-path 的 binding，方便你管理：

```bash
vee <-> /var/lib/docker/volume/vee
```

那 anonymous volume 的使用场景就是：用户不关心这个 volume 具体叫啥，他只关心有这么个 volume 就可以了。此时 docker 就会生成一个随机的 volume path，比如这样的：

```bash
/var/lib/docker/volume/6yXiv7LOAa
```

因为我最开始研究 volume 是为了 sync host 的代码到 docker container 内运行，所以这两种 volume 对我都不适用 (除非你不嫌麻烦每次都把代码 copy 到默认的 volume 路径下)。但是这两个 volume 在 **多 containers 协同** 的场景下非常好用，比如：

- 一个 container 生产数据
- 另一个 container 读取数据并呈现

那么这两个 containers 共享一个 volume 就可以了。

最后 host volume 最简单，就是用户指定路径，指哪儿 mount 哪儿。

### 2.2 Volume 与 mount point 间的 copy 行为

回到 mount。如果可以强制 mount 到 non-empty 的 mount point 的话，可以有以下 4 种情况：

1. `mount point` is empty; `mounted fs` is emtpy
2. `mount point` is empty; `mounted fs` is non-emtpy
3. `mount point` is non-empty; `mounted fs` is emtpy
4. `mount point` is non-empty; `mounted fs` is non-emtpy

考虑 `mount point` 的后续情况。第一种最简单，无事发生。二三四可以用两条规则判定：

- original data in the `mount point` will not be available until you `unmoumt` again
- `mounted fs` is accessible from the `mount point`

所以上面 4 种情况：

1. `mount point` 保持 empty
2. `mount point` 有 new data
3. `mount point` 的 old data 暂时不可见，又没有 new data，所以暂时为 empty
4. `mount point` 的 old data 暂时不可见，同时有 new data

docker volume 和 mount 的一个区别就是：

- mount 的时候，你不关心 `mounted fs` 上发生了啥，你只关心 `mount point` 上有啥
- 但是 docker 需要关心 `mounted fs`，即 volume 上发生了啥

类似地，对 volume 有 4 种情况：

1. `mount point` is empty; `volume` is emtpy
2. `mount point` is empty; `volume` is non-emtpy
3. `mount point` is non-empty; `volume` is emtpy
4. `mount point` is non-empty; `volume` is non-emtpy

现在考察 `volume` 的后续情况：

1. 无事发生 (`volume` 保持 empty)
2. 无事发生 (`volume` 保持原样)
3. 按类型：
    - 对 host volume => 无事发生
    - 对 named volume 和 anonymous volume => `mount point` 的 data 会被 copy 到 `volume` 
      - 除非你设置了 `nocopy` 参数
4. 按类型：
    - 对 host volume => 无事发生
    - 对 named volume 和 anonymous volume => 无事发生

- **这个 tricky 的判定让我觉得 `nocopy` 的行为应该被设置成默认。**

[joaofnfernandes](https://github.com/docker/docker.github.io/issues/2992#issuecomment-299596714) 画了三张图来帮助我们理解 (已拆封并打乱顺序；原图的 title 有误)：

CASE 1: volume is empty; `-v my-volume:/lib`

![](/assets/posts/2021-04-04-docker-volume/case-1.png)

CASE 2: volume is empty; `-v my-volume:/lib:nocopy`

![](/assets/posts/2021-04-04-docker-volume/case-2.png)

CASE 3: volume is non-empty; `-v my-volume:/lib`

![](/assets/posts/2021-04-04-docker-volume/case-3.png)