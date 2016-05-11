---
layout: post
title: "UML 类图之关联、聚合、组合、依赖"
description: ""
category: UML
tags: [Java-DesignPattern]
---
{% include JB/setup %}

[association]: https://farm2.staticflickr.com/1565/23624880750_e11ceece0a_o_d.png
[aggregation]: https://farm2.staticflickr.com/1713/23624880760_1a8f3a1773_o_d.png
[composition]: https://farm6.staticflickr.com/5775/23552710139_6efab66856_o_d.png

　　一直没有搞清楚这几个概念，这里做总结。来自《大话设计模式》。

---

## 1. 关联 (Association)

　　仅仅表示对象 A “知道” 对象 B，对象 A 并不 “拥有” 对象 B（这里的 “知道” 和 “拥有” 并不一定是从业务逻辑上判断，应该宽泛到从常识上判断）。如下图：

![][association]

企鹅 “知道” 气候，但并不 “拥有” 气候，在代码上反映为：

```
class Penguin extends Bird {  
	private Climate c;  
}  
```

---

## 2. 聚合 (Aggregation)

　　聚合在关联的基础上更近一步，表示一种弱 “拥有” 关系，对象 A 可以包含对象 B，对象 B 可以是对象 A 的一部分，但也可以不是（在代码上的表现是对象 B 为 null）。如下图：

![][aggregation]

虽然雁群理所当然应该包含大雁，但也存在着 null 雁群，即 WildGoose 数组为空的情况。从代码上看：

```
class WildGooseGroup {  
	private arrayWildGoose WildGoose[];  
}  
```

与关联并没有什么不同。的确是这样，关联和聚合的区别仅体现在这两个对象在业务逻辑或是在常识中的关系，在代码层次是没有区别的。

---

## 3. 组合 (Composition)

　　在聚合关系上更进一步，表示一种强 “拥有” 关系，对象 A 和对象 B 的生命周期一样，通俗说来就是 “同年同月同日生，同年同月同日死”。如下图：

![][composition]

鸟必然 “拥有” 翅膀，如果 Wing[2] 为空，那么这个这个 Bird 对象是不应该存在的。在代码上体现为：

```
class Bird extends Animal {  
	private wings Wing[2];  
	  
	public Bird() {  
		wings[0] = new Wing();  
		wings[1] = new Wing();  
	}  
}  
```

可见 Bird 和 Wing 对象是强制绑定在一起的。

---
 
## 4. 依赖 (Dependency)

　　依赖表示一种 “需要” 的关系，但一般被依赖的对象 B 不是对象 A 的成员。如上图所示，鸟的新陈代谢需要氧气和水，但氧气和水都不会是鸟的成员。依赖和关联的区别大抵体现于此。