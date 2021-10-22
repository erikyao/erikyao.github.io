---
layout: post
title: "Middleman Patterns: Adapter / Proxy / Decorator"
description: ""
category: Java
tags: [Java-DesignPattern]
---
{% include JB/setup %}

我觉得用 Java 学 design pattern 有个问题就是：总是要有 interface / abstract class 介入，搞得整个 class hierarchy 非常复杂。其实我用 duck typing 的思路来看，Adapter、Proxy、Decorator 这三个模式的基本结构是一样的，都是 _客户端_、_中间商_、_旧实现_。你撇开 interface layer 看下面三个图，我只能说是完全一致！

```txt
+------+        +---------+        +------------+
| User |------->| Adapter |------->| RealObject |
+------+        +----+----+        +-----+------+
                     |                   |
                     v                   v
              +--------------+    +---------------+
              | NewInterface |    | RealInterface |
              +--------------+    +---------------+

xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

+------+         +-------+         +------------+
| User |-------->| Proxy |-------->| RealObject |
+------+         +---+---+         +-----+------+
                     |                   |
                     |                   v
                     |            +---------------+
                     +----------->| RealInterface |
                                  +---------------+

xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

+------+        +-----------+      +------------+
| User |------->| Decorator |----->| RealObject |
+------+        +-----+-----+      +-----+------+
                      |                  |
                      |                  v
                      |           +---------------+
                      +---------->| RealInterface |
                                  +---------------+
```

撇开 class hierarchy，这里先看看这三个 pattern 在功能上的区别：

- Adapter: 接口修正
- Proxy: 接口 Access Control
  - Proxy 并不会给 User 提供新的接口，也不会修改旧的业务逻辑 (behavior)，它提供的都是 side effect
  - 比如 security / caching / lazy loading
- Decorator: 维持原接口，但可能会修改业务逻辑 (behavior) 或者添加新的接口
  - "添加新的接口" 是可能的，比如我们可以把 Decorator 设计成 Interface which `extends RealInterface` 或者 abstract class

假设我们用 $\Lambda$ 表示 `RealObject` 提供的接口，用 $\Lambda'$ 表示 _中间商_ 提供的接口，于是有：

$$
\begin{aligned}
\text{Adapter: }   &\Lambda' = f(\Lambda), \, f \neq I \newline
\text{Proxy: }     &\Lambda' = I(\Lambda) = \Lambda \newline
\text{Decorator: } &\Lambda' \supseteq \Lambda
\end{aligned}
$$

那至于 class hierarchy，我觉得这是 Java 的设计技巧，这里就不谈了。这三个 patterns 都有一个明显的特点是：_中间商_ holds an instance of `RealObject`，再次体现 "组合优先于继承"。

扩展：

- 可以有 Proxy Chain (体现 Single Responsibility Principle，一个 Proxy 只做一方面的功能)
- 同理可以有 Decorator Chain

-----

20211021 补充：

我们这一篇的侧重点是接口和行为，但 Decorator 也可以作为一种 "组合" 的方式 (用来生产子类)。比如 _Head First Design Patterns_ 的例子：如何给 coffee shop 设计一个 "Dark Roast with Mocha and Whip" 类？

我们可以简单地用组合，比如：

```python
class DarkRoastWithMochaAndWhip:
    def __init__(self):
        self.ingredients = [DarkRoast(), Mocha(), Whip()]
```

也可以用 Decorator Chain：

```python
class DarkRoastWithMochaAndWhip:
    def __init__(self):
        self.ingredients = Whip(Mocha(DarkRoast(None)))
```

假设现在我要实现 `def get_price(self): ...`，那么上面两种写法的实现方式是不同的。简单说就是 "平铺式组合" 和 "嵌套式组合" 的区别。另外在实际应用中，是否需要定义 `DarkRoastWithMochaAndWhip` 这么一个子类？还是直接用组合来代替？这是另外需要考虑的问题，并不是说本文的写法就是最合适的。