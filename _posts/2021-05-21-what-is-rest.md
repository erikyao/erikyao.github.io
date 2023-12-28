---
category: Thought
description: ''
tags: []
title: What is REST?
toc: true
toc_sticky: true
---

## 1. What does REST mean literally?

我这里先不讨论 REST 提倡的设计原则，我就研究一个问题：**RE**presentational **S**tate **T**ransfer 这三个词到底啥意思？

### 1.1 Representation

研究 REST 的最重要的资料，当然是作者 Roy Thomas Fielding 的论文 [Architectural Styles and the Design of Network-based Software Architectures](https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm)。同时 [WarmForest 这位知乎网友](https://www.zhihu.com/question/438825740/answer/1692102935) 疾呼：一定要去看 [RFC 7231 - Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content](https://datatracker.ietf.org/doc/html/rfc7231)！我去看了，结合 HTTP 1.1 和 REST 的作者都是 Dr. Fielding，我总结一下我的收获是：

1. (确定) 先有的 HTTP 1.1 (1997)，再有的 REST (2000)
2. (推测) REST 应该是一种 "脱胎于 HTTP 设计理念的" Network-based Software Architectures
    - 这里 "Network-based Software" 可以引申到 web application，可以引申到 web API
    - 这里 "Architectures" 可以引申成 "设计理念"、"设计原则"、"架构风格"、"架构倡议"
      - REST 没有限定实现手段，就是个 general 的原则
3. (推测) REST 在命名的时候应该是去强行贴贴了 HTTP
    - **HTTP: H**ypertext **T**ransfer **P**rotocol
    - **REST: RE**presentational **S**tate **T**ransfer
      - 至少这俩的 "transfer" 的意思应该是一样的
      - 我觉得 REST 应该命名成 RSTM，**R**epresentational **S**tate **T**ransfer **M**odel，与 HTTP 强对应。当然这是后话了。
4. (确定) representation 是对 resource state 的描述
    - 这里的 state 是 general 层面的意思。
    - 联系 OO 里 object 的模型：attributes 是 states，methods 是 behaviors。这里 state 也是这个意思。

关于上述第 4 点，引用一下 [RFC 7231 - Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content](https://datatracker.ietf.org/doc/html/rfc7231) 的原文：

> Considering that a resource could be anything, and that the uniform interface provided by HTTP is similar to a window through which one can observe and act upon such a thing only through the communication of messages to some independent actor on the other side, an abstraction is needed **to represent ("take the place of")** the current or desired state of that thing in our communications. That abstraction is called a representation [REST].  
> <br/>
> For the purposes of HTTP, a "representation" is information that is intended to reflect a past, current, or desired state of a given resource, ...

但 Dr. Fielding 在 [Architectural Styles and the Design of Network-based Software Architectures](https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm) 里没有说得这么形象，而是：

> A representation is a sequence of bytes, plus representation metadata to describe those bytes. Other commonly used but less precise names for a representation include: document, file, and HTTP message entity, instance, or variant.

### 1.2 State & Transfer

这个 state 的 ambiguity 很大。你看 10 个 Stack Overflow 的解答，有 9 个会告诉你这个 state 是 resource 的 state。但我 Ctrl + F 过了遍 Dr. Fielding 的论文，发现他大部分的篇幅都在谈 application 的 state，这一段尤其明显：

> REST was originally referred to as the **"HTTP object model"**, but that name would often lead to misinterpretation of it as the implementation model of an HTTP server. The name **"Representational State Transfer"** is intended to evoke an image of how a well-designed Web application behaves: a network of web pages (**a virtual state-machine**), where the user progresses through the application by selecting links (**state transitions**), resulting in the next page (representing the next state of the application) **being transferred** to the user and rendered for their use.

- 注意 transition 的意思是 "转变" (指单个物体的内部形态)，transfer 是 "传输" (涉及 sender 和 receiver 两方)

按照他这段话的逻辑，我觉得 REST 应该是 **"基于 resource representation 的 application state transfer 模型"** 的意思。有一些人也认为 REST 的 state 指的是 applicaton state，比如：

- [REST, where’s my state?](https://ruben.verborgh.org/blog/2012/08/24/rest-wheres-my-state/)
- [Ciro Corvino on "In what do consist the misunderstandings about the “REST” word and its meaning"](https://stackoverflow.com/a/37683965)
  - 虽然他的论述我没有看懂……

如果把 REST 的 state 理解成 resource state，我觉得有这么两个问题：

1. representation 本身就是描述 resource state 的，用 "representational state" 这个词组感觉有点啰嗦，除非 Dr. Fielding 是硬要凑这个缩写
2. 如果是 resource state，那么 REST 感觉就是 "基于 resource state 的 representation 的通信" 这么个概念，和 Dr. Fielding 的论文的论题 (Network-based Software Architectures) 不太对得上 (格局小了)

但这种理解给了我们一个用 OO 来解释 REST 行为的说法，尤其是考虑到 Dr. Fielding 原先考虑到把 REST 命名为 **"HTTP object model"**：

1. URI 指向 resource (相当于是 OO 的 object；看做 noun)
2. representation 表示 resource state (相当于 object 的 attributes)
3. HTTP methods 表示对 resource 的操作 (相当于 object 的 methods；看做 verb)

这种理解很常见，我觉得也有可取之处。更有甚者把这两种理解结合起来，比如 [Samuel Liew & Darrel Miller on "What does Representational State mean in REST?"](https://stackoverflow.com/a/10421579):

> Representational State Transfer refers to transferring "representations". You are using a "representation" of a resource to transfer **resource state which lives on the server** into **application state on the client**.

关于 state 的意思，我觉得讨论这么多就足够了。另外我觉得很诡异的是：这么多年了，就没有人去问一下 Dr. Fielding 他的这个 state 到底是啥意思么……

## 2. Digression

### 2.1 REST 和 OSI 七层模型的 Representation Layer 没有啥关系

因为 REST 和 HTTP 的亲密关系，我一度猜想 REST 的 representational 是不是指的 representation layer，其实这俩啥关系都没有……

### 2.2 What does "REST is stateless" mean?

我不客气地说，说 "REST is stateless" 的人算是非蠢极坏，因为原文说的是：

> **communication must be stateless** in nature, as in the **client-stateless-server** (CSS) style of Section 3.4.3 (Figure 5-3), such that each request from client to server must contain all of the information necessary to understand the request, and cannot take advantage of any stored context on the server. Session state is therefore kept entirely on the client.

你明知 stateless 说的是 communication，明知 REST 名字里带一个 state，然后说 "REST is stateless"，就非常有国内本科考试那种意思：为了出个题目，强行瞎联系。这么搞就是故意提高理解的门槛，本末倒置，品味低下。

## 3. REST 提倡的设计原则、风格

Dr. Fielding 在 [Architectural Styles and the Design of Network-based Software Architectures](https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm) 里把 REST 称作一种 architectural style for distributed hypermedia systems。他从 Null style 开始，一点一点往上加 constraints，最终演化到 REST style。这些 constraints 其实就可以看做是 rules、principles 的意思。

### 3.1 演化第一步：REST 是一种 client-server (CS) architectural style

这个没啥好说的，就是从 Null style 开始演化的第一步。值得学习的是，Dr. Fielding 说这里用到了 "separation of concerns" 的设计思路，我们不管是水文章还是面试吹牛皮都应该学习这种说法。我们在做数学题时遇到的 "分情况讨论"、"不妨设 $x > y$" 这些技术，都算是 separation of concerns。

### 3.2 演化第二步：REST 使用 stateless communication $\Rightarrow$ REST 是一种 client-stateless-server (CSS) style

这个前面讲 stateless 的时候说过了。

stateless communication 意味着没有 session 这个玩意儿了，我有点好奇 authentication 要咋做…… (这里暂不研究)

原文说 stateless communication 有以下三个方面的好处。

#### 3.2.1 好处一：提高了 application 的 visibility

原文说的是：

> Visibility is improved because a monitoring system does not have to look beyond a single request datum in order to determine the full nature of the request.

翻译一下就是 (摘自 _RESTful Web API Design with Node.js 10_)：

> Since the requests and responses are stateless and atomic, nothing more is needed to flow the behavior of the application and to understand whether anything has gone wrong.

所以这个 visibility 指 restful application 对 monitoring system 变得更 visible、更 transparent 了

#### 3.2.2 好处二：提高了 application 的 reliability

原文说的是：

> Reliability is improved because it eases the task of recovering from partial failures.

这个比较直接。如果 application 用的 stateful communication，一旦出错，我们就要考虑当前 state 到底是不是一个正确的 state。这有点像 rollback 一个 transaction，直觉上就很复杂。

另外 _RESTful Web API Design with Node.js 10_ 这本书又提到另外一个 reliability 的话题，就是 HTTP methods 的 idempotency and safety：

- An HTTP method is considered to be **safe** provided that, when requested, it does not modify or cause any side effects on the state of the resource.
- An HTTP method is considered to be **idempotent** if its response stays the same, regardless of the number of times it is requested, am idempotent request always gives back the same request, if repeated identically.

|HTTP Method|Idempotent|Safe|
|-----------|:--------:|:--:|
|DELETE     |   yes    | no |
|GET        |   yes    |yes |
|HEAD       |   yes    |yes |
|OPTIONS    |   yes    |yes |
|PATCH      |    no    | no |
|POST       |    no    | no |
|PUT        |   yes    | no |

具体的 application 的 reliability 要结合 HTTP methods 的性质来讨论。

#### 3.2.3 好处三：提高了 application 的 scalability

原文说的是：

> Scalability is improved because not having to store state between requests allows the server component to quickly free resources, and further simplifies implementation because the server doesn't have to manage resource usage across requests.

这个也好理解。因为 server 端不保存 client 的 state 了，所以 RAM 的压力就小了，scalability 自然就上去了。

### 3.3 演化第三步：REST 使用 cache $\Rightarrow$ REST 是一种 client-cache-stateless-server (C$SS) style

他原文的缩写就是 "C\\$SS"，他也没有解释为啥 cache 的缩写是 \\$，难道是谐音梗 "cash"？

cache 的好处毋庸置疑，但是原文并没有明说这个 cache 是 server 端的还是 client 端的。[Caching REST API Response](https://restfulapi.net/caching/) 这篇文章说：

> When a consumer requests a resource representation, the request goes through a cache or a series of caches **(local cache, proxy cache, or reverse proxy)** toward the service hosting the resource.

可见 cache 可以有多种形式，还能叠加。

### 3.4 演化第四步：REST 使用 uniform interface

作者在这一步没有再继续创建新的缩写，所以这里可以认为 REST 是一种 "使用 uniform interface 的 C$SS style"。

原文第一段信息量很大：

> The central feature that distinguishes the REST architectural style from other network-based styles is its emphasis on a uniform interface between components. By applying the software engineering **principle of generality** to the component interface, the overall system architecture is **simplified** and the visibility of interactions is improved. Implementations are **decoupled** from the services they provide, which encourages independent evolvability. The trade-off, though, is that a uniform interface **degrades efficiency**, **since information is transferred in a standardized form rather than one which is specific to an application's needs**. The REST interface is designed to be **efficient for large-grain hypermedia data transfer**, optimizing for the common case of the Web, but resulting in an interface that is **not optimal for other forms of architectural interaction**.

- 所谓 generality 就是指 a quality of being not limited to one particular case. 
  - Software should be designed so that it can handle changes easily.
- interface 被拆解成了 HTTP methods (verb) + URI as resource (noun)，的确是一种简化，而且创建了一套统一的 interface semantic，方便 interface 的 discovery
- REST 的确没有限制实现的手段，所以说 implementations are decoupled 没啥问题
- 效率问题主要来自于 REST 的这套 semantic 的表现力不足。不是所有的场景都适合用 CRUD + noun 来表示的，比如 [为什么很多后端写接口都不按照restful规范？](https://www.zhihu.com/question/438825740) 说到的 "login/logout" 过程，用 REST 表示就很别扭
- 但作者其实也说了 "not optimal for other forms of architectural interaction"，所以你 "login/logout" 过程可能一开始就不应该考虑用 REST

原文第二段提出了 uniform interface 需要满足的 4 个方面的要求：

1. identification of resources
2. manipulation of resources through representations
3. self-descriptive messages
4. hypermedia as the engine of application state (HATEOAS)

这 4 个方面在原文 5.2 大节有详细论述，我可能需要另写一篇来记录，这里先不展开。

### 3.5 演化第五步：REST 是 layered system $\Rightarrow$ REST 是一种 (使用 uniform interface 的) layered-client-cache-stateless-server (LC$SS) style

原文：

> the layered system style allows an architecture to be composed of hierarchical layers by constraining component behavior such that each component cannot "see" beyond the immediate layer with which they are interacting. By restricting knowledge of the system to a single layer, we place a bound on the overall system complexity and promote substrate independence. Layers can be used to encapsulate legacy services and to protect new services from legacy clients, simplifying components by moving infrequently used functionality to a shared intermediary. Intermediaries can also be used to improve system scalability by enabling load balancing of services across multiple networks and processors.

这个好理解：你 client -> client cache -> server cache -> server 这就可以铺 4 层了。原文的 encapsulate legacy services 相当于是个 adapter pattern，把 server 端又继续分层了。我甚至觉得 server 都可以是个 interface network/graph，前面架一个 NLP，后面做 interface discovery/composition，这个层次就更多了。

### 3.6 演化第六步：REST 允许 code-on-demand $\Rightarrow$ REST 是一种 (使用 uniform interface 的) layered-code-on-demand-client-cache-stateless-server (LCODC$SS) style

> In the code-on-demand style, a client component has access to a set of resources, but not the know-how on how to process them. It sends a request to a remote server for the code representing that know-how, receives that code, and executes it locally.

COD 的优劣势要结合 HATEOAS 来研究，这里先略过，后续连 HATEOAS 一起写。

COD 对 REST 是 optional 的

### 3.7 总结

如果允许了 COD，那么：

$$
\operatorname{REST} = \operatorname{Uniform Interface} + \operatorname{LCODC$SS}
$$

如果没有允许 COD，那么：

$$
\operatorname{REST} = \operatorname{Uniform Interface} + \operatorname{LC$SS}
$$

这不比 Stack Overflow 讲得清楚？！