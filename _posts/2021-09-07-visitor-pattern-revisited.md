---
category: Java
description: ''
tags:
- Java-DesignPattern
title: Visitor Pattern Revisited
---

我们在 _PPP_ 里其实有讲 [visitor pattern](https://blog.listcomp.com/java/2014/06/24/digest-of-agile-software-development-ppp#dp_visitor)，但最近在读的 [_Crafting Interpreters_](https://craftinginterpreters.com/) 提供了一个绝妙的解读，虽然只能适用于 vanilla 的 visitor pattern，但还是值得记录下。

## The $\operatorname{Class} \times \operatorname{Method}$ Matrix

假设我现在的 class hierarchy 是一个父类 + 一堆子类。"添加一个 new subclass" 这个操作是容易的；但是 "在父类里定义一个 new method，然后在每个 existing subclasses 都实现一遍这个方法" 这个操作是繁的。这就好比是一个 $\operatorname{Class} \times \operatorname{Method}$ 的 matrix:

![](/assets/posts/2021-09-07-visitor-pattern-revisited/class_x_method.png)

- 你添加 row 是容易的，但是添加 column 是繁的

如果我们跳脱出 OO，看一下 FP (Functionnal Programming) 的情形，就会发现它们类似地有一个 $\operatorname{Type} \times \operatorname{Function}$ 的 matrix:

![](/assets/posts/2021-09-07-visitor-pattern-revisited/type_x_function.png)

- 每个 function 内都要做 type matching (想象 switch-case) 来细分 function 的逻辑。但如果 type matching 的逻辑是固定的，那么 "添加一个 new function" 这个操作不复杂
- 但如果要添加一个新的 type，我要跑到每个 function 里面写一个新的 type matching 的 case，就很繁
- 类似地，相当于是：你添加 column 是容易的，但是添加 row 是繁的

那 vanilla 的 visitor pattern 就相当于在 OO 里借用了 FP 的 type matching 的思路来实现 "添加 column" (高屋建瓴！)

## 一个 vanilla 的 visitor pattern 的实现

假设我们有一个 `Modem` (调制解调器) 父类，然后有一堆子类，它们的 "设置" (the new method) 的逻辑不一样。用一个 visitor 集中实现这个 new method 的演示代码如下：

```java
// 1. the abstract host
abstract class Modem {
    private String config;
    
    public void setConfig(String config) {
        this.config = config;
    }
    
    abstract public void accept(ModemConfigVisitor mcv);
}

// 2. the concrete host subclasses
class HayesModem extends Modem {
    @Override
    public void accept(ModemConfigVisitor mcv) {
        mcv.visit(this);
    }
}
class ZoomModem extends Modem {
    @Override
    public void accept(ModemConfigVisitor mcv) {
        mcv.visit(this);
    }
}

// 3. the concrete visitor
class ModemConfigVisitor{
    public void visit(HayesModem hm) {
        hm.setConfig("Hayes::0xFF");  // 假设 Hayes 型 modem 的参数 protocol 是 Hayes::<mode>
    }
    public void visit(ZoomModem zm) {
        zm.setConfig("Z$442");  // 假设 Zoom 型 modem 的参数 protocol 是 Z$<mode>
    }
} 

// 4. the main hall where hosts meet the visitor
public class Main {
	public static void main(String[] args) {
	    HayesModem hm = new HayesModem();
	    ZoomModem zm = new ZoomModem();
	    
	    ModemConfigVisitor mcv = new ModemConfigVisitor();
	    hm.accept(mcv);
	    zm.accept(mcv);
	}
}
```

注意：

- 老实说我觉得这套 `visitor.visit(host)`/`host.accept(visitor)` 的语义不是很形象，我觉得叫 `comeToHelp`/`callForHelp` 之类的更好……
- 这里的逻辑是把 "原本要分散到各个 `Modem` 子类中的 `config()` 方法" 聚拢到 `ModemConfigVisitor` 里集中实现
    - 但是 "添加 column" 这个操作是省不掉的，只是用 visitor pattern 添加的这个 "column" 是个 **lightweight 的 "column"**

```txt
            |
            |              +------------------------------------------+
            |  AlphaModem  |  config() { setConfig("alpha://66"); }   |
            |              +------------------------------------------+
            |  BetaModem   |  config() { setConfig("/beta/77"); }     |
  PREVIOUS  |              +------------------------------------------+
            |  HayesModem  |  config() { setConfig("Hayes::0xFF"); }  |
            |              +------------------------------------------+
            |  ZoomModem   |  config() { setConfig("Z$442"); }        |
            |              +------------------------------------------+
            |
------------+-----------------------------------------------------------------------------
            |
            |
            |              +-------------------------------------------------------+
            |  AlphaModem  |  accept(ModemConfigVisitor mcv) { mcv.visit(this); }  |
            |              +-------------------------------------------------------+
            |  BetaModem   |  accept(ModemConfigVisitor mcv) { mcv.visit(this); }  |
            |              +-------------------------------------------------------+
            |  HayesModem  |  accept(ModemConfigVisitor mcv) { mcv.visit(this); }  |
            |              +-------------------------------------------------------+
            |  ZoomModem   |  accept(ModemConfigVisitor mcv) { mcv.visit(this); }  |
            |              +-------------------------------------------------------+
    AFTER   |
            |
            |              +---------------------------------------------------------+
            |              |  visit(AlphaModem am) { am.setConfig("alpha://66"); }   |
            |              |                                                         |
            | ModemConfig  |  visit(BetaModem bm) { bm.setConfig("/beta/77"); }      |
            |   Visitor    |                                                         |
            |              |  visit(HayesModem hm) { hm.setConfig("Hayes::0xFF"); }  |
            |              |                                                         |
            |              |  visit(ZoomModem zm) { zm.setConfig("Z$442"); }         |
            |              +---------------------------------------------------------+
            |
```

- 这里 `ModemConfigVisitor` 的 "type matching" 其实是利用了 Java 的 method overloading (注意这里不构成 double dispatch，参见 [Java 的 Single Dispatch 与 Overload](https://blog.listcomp.com/java/2021/01/03/single-dispatch-in-java-and-python#3-java-%E7%9A%84-single-dispatch-%E4%B8%8E-overrideoverloadstatic-bindingdynamic-binding))
    - 对于没有 overloading 机制的语言 (注意现在的 python 有 `from typing import overload` 可以用，世道变了！)，可以显示地定义成 `visitHayesModem()`、`visitZoomModem()` 这样，_Crafting Interpreters_ 的作者认为这样写 "更能凸显出我在用 visitor pattern"

PPP 里认为 visitor pattern 的作用还有 "separating an algorithm from an object structure"，但这个作用在我们的例子里无法体现。我觉得 visitor pattern 的作用得按情况区分：

- 如果是 "多子类" 的场景，它的作用是 "聚拢分散的 method 实现"
- 如果是 "单个类" 的场景，它的作用是 "割离 method 实现"
  - somehow 是统一的