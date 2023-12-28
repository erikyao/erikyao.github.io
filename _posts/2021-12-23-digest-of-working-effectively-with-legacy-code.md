---
category: null
description: ''
tags: []
title: Digest of Working Effectively with Legacy Code
toc: true
toc_sticky: true
---

# Part I - The Mechanics of Change

## Chapter 1 - 修改代码的 4 个理由

修改代码的 4 个理由以及其侧重点：

|理由/侧重点   |Code Structure|New Behavior|Old Behavior|Resource Usage|
|----------- |:------------:|:----------:|:----------:|:------------:|
|添加 feature |  **Change**  |   **Add**  |    **-**   |     **-**    |
|修正 bug     |  **Change**  |    **-**   | **Change** |     **-**    |
|refactoring |  **Change**  |    **-**   |    **-**   |     **-**    |
|optimizing  |     **-**    |    **-**   |    **-**   |  **Change**  |

## Chapter 2 - 修改代码的 2 种方式

修改代码的 2 种方式：

- Edit-and-Pray
- Cover-and-Modify

那第一种也不是说不行，但肯定不如第二种保险。

### 如何 Edit-and-Pray

请阅读 Chapter 6

### 如何 Cover-and-Modify: 要 Unit Test 而不是 Regression Test

Unit Test 和 Regression Test 虽然都是 test，但是它俩不是一个维度的概念。Unit Test 强调的是形式、是组成单位，Regression Test 强调的是性质。简单说，所有检测 "引入的新代码后，旧的 behavior 有没有改变" 的测试都是 Regression Test，它可以是 Unit Test、Integration Test、UI Test、etc.，或是它们的组合。

一般来说 Regression Test 会比较费时，对频繁的修改不够效率。Unit Test 颗粒明显要小很多，效率更高。如何判断一个 Unit Test 快不快？作者的理论是：耗时超过 0.1 秒的都不算快！考虑到 Java 的 application 可能有上千个 class，这个标准也说得通。

严格来说，Unit Test 有这么些要求：

- 要跑得快
- 不应该与 DB 交互
- 不应该有 network 通信
- 不应该调用 File System
- 不应该依赖特定的运行环境 (比如配置文件)

但实际情况往往无法做到这么严格。

### 依赖 (Dependency) 是 Unit Test 的障碍

表现在：

1. 难以在测试中初始化 target 对象
2. 难以在测试中调用 target 方法

### 如何 Cover-and-Modify: 流程

The Legacy-Code-Change algorithm:

1. Identify change points. (确定改动点)
2. Find test points. (找出测试点)
3. Break dependencies. (解依赖)
4. Write tests. (写测试)
5. Make changes and refactor. (修改代码、重构)

## Chapter 3 - 解依赖的两个目的：Sensing and Separation

这一章是作者模糊表达的重灾区！写得弯弯绕绕的，真的有那么复杂吗？！

### 啥叫 sensing？给翻译翻译！

结合后面作者的用词，**"to sense through object/method"** 的意思其实就是 **"搞清楚 object/method 具体干了啥"**，具体说来就是：

1. "搞清楚 object/method 计算了哪些 value" (这是书上的意思)
2. "搞清楚 object/method 产生了哪些 side effect" (这是我个人的扩展)

所以简单来说，**"sensing"** 就是 **"搞清楚"** 的意思 (MD，搞 OO 的这帮人一天到晚在这嚼词汇也不是一天两天了)。

那我们说要 **"sense the effect of change"** 的意思就是 **"搞清楚 change 对 target object/method 的 computed value/side effect 的影响"**。

那我们为啥需要 sensing？这不明显着嘛：test 需要知道这些 computed value/side effect 啊，不然它咋测试？

那 sensing 和 break dependency 有啥关系？我个人的理解是：不需要 break dependency 也可以 sensing 啊，你读代码算不算 sensing？也算啊，对不对？所以这里我认为更准确的陈述是：**"break dependency 是 sensing 的一种辅助手段"**，因为有时候 dependency 部分的代码不太好 sense (或者说：target object/method 调用 dependency 产生的 computed value/side effect 不太好 sense) (这里涉及到一个 "你到底是 sense through dependency 还是 sense through target object/method" 的问题)

那什么是 fake collaborator？我个人的理解是：**"fake collaborator 是一个具体的 break dependency 的技术，用来辅助 sensing"**。

### Separation

Separation 比较简单，它主要就是解决前面说的两个问题：

1. 难以在测试中初始化 target 对象
2. 难以在测试中调用 target 方法

If dependency makes it impossible to set up a test harness, we need to separate the code from that dependency.

本书的大部分章节其实都是在解决 separation 的问题。

### Fake Collaborator

这一小节从技术角度好理解，注意 mock objects 是 "能够对 internal behavior 做 assertion 的" 高级 fake object 就可以了。

## Chapter 4 - Seam

Seam 本意是 "接缝"，比如两块布的连接处、两片金属的焊接处，这里指：

> A seam is a place where you can alter behavior in your program without editing in that place.

注意它定义的落脚点是 "place"，后面的 "seam types" 其实就是在介绍 "有哪些 places":

1. Preprocessing Seam: 比如用 `#ifdef` 来控制 behavior (的地方)
2. Link Seam: 通过控制 linking 的 library 来控制 behavior (的地方)
3. Object Seam: 简单来说就是尽可能地利用多态，方便传入 fake/mock objects (的地方)

### Preprocessing Seam 举例

可以看 Chapter 19

### Link Seam 举例

用 python 举个例子。假设你的 prod 环境只有 `orjson`，你的 test 环境只有 `json` (或者在 prod/test 上都安装 `orjson` 和 `json`，但是在启动脚本里提供不同的 classpath)，你可以用:

```python
try: 
  import orjson
except Exception: 
  import json
```

来动态 import，从而控制 caller 的 hehavior。

### Object Seam 举例

用 java 举个例子：

```java
  public foo() {
    Bar b = new Bar();
    b.doSomething();
  }

  // 改写成：
  public foo(Bar b) {
    b.doSomething();
  }
```

后面一种写法就能利用 `Bar` 的多态，使得我们能传入一个 `Bar b = new MockBar()` 来方便测试。

## Chapter 5 - Tools (略)

这一章没啥用，略过。

# Part III - Dependency-Breaking Techniques

Part III 就一章，我也是醉了。对的，我就是要先写 Chapter 25，因为这些技能在 Part II 没有被完全 cover 到，等把 Part II 写完再写 Part III 就显得支离破碎的，不如先写了。

## Chapter 25 - Dependency-Breaking Techniques

### 技能树

灾难的 Chapter 25！一共 24 个技能，作者发了疯按技能名字的 alphabet 排序！然后这些名字还是作者自己起的，所以这个顺序本质上是随机的！大哥你好歹分一下类吧？有的技巧是修改测试目标类、有的是修改 dependency，大部分是 object seam 的范畴、小部分是 link seam/preprocessing seam。你就大喇喇地 24 条一起扔那儿，这样好吗？这样不好！

我大概分了一下：

- Link Seam / Preprocessing Seam: 我基本用不上，放一边
- 边缘辅助技能：这三个超简单，但又不好分类，姑且叫它边缘辅助
- "逃避可耻但有用"：逃离 dependency 但无法彻底消灭 dependency
- "我成替身了"：通过 substitution (包括 fake/mock) 消灭 dependency；分三步：
    1. 把 dependency 纳入 object seam 里，否则没法做替换
    2. 如果 dependency 的替身不好做，我们就虚化、弱化 dependency class 的结构
    3. 给 dependency 做替身，然后在 object seam 里替换 dependency

![](https://live.staticflickr.com/65535/51784572991_affa9a03ce_c_d.jpg)

### $\dagger$ Link Seam / Preprocessing Seam

#### $\Diamond \texttt{[03]Definition Completion}$ (C/C++)

简单说或就是用 `#include <dependency.h>` 中的 function declaration，但是测试用 `#include <fake.c>` 中的 function definition。

#### $\Diamond \texttt{[13]Link Substitution}$

通过 linking 替换 library。

#### $\Diamond \texttt{[23]Template Redefinition}$ (C++)

将 Target Class 改写成 template，然后 template 的 parameter 就是 seam。

- 感觉像是个 Strategy Pattern

#### $\Diamond \texttt{[24]Text Redefinition}$ (Interpreted Language)

有的 Interpreted Language 允许 function/class definition 的覆盖 (类似 REPL 中用一个新的 `def foo()` 覆盖原有的 `def foo()`)，所以可以用 fake definition 来测试。

### $\dagger$ 边缘辅助

#### $\Diamond \texttt{[04]Encapsulate Global References}$ 

封装成组的 global 的 variables/function，感觉像是减小依赖的 "散度" (从 "依赖多个 global variables/functions" 减小到 "依赖于一个 global object")。

后续还可以接一个 $\texttt{[20]Replace Global Reference with Getter}$

#### $\Diamond \texttt{[05]Expose Static Method}$

如果你依赖的 dependency call 本质是个 static，那我们就可以省去实例化 dependency class

#### $\Diamond \texttt{[11]Introduce Instance Delegator}$

如果你依赖的 dependency call 已经是个 static，但是很笨重，我想要替换掉它，该怎么办？

```java
// Target Class + Target Method
class Application {
    public void doSomething() {
        Service.foo();  // 笨重
    }
}

// Dependency class
class Service {
    public static void foo() {
        // pass
    }
}
```

注意 Java 的 static method 不能被 override，所以直接 fake/mock 是没法用的。可以考虑原地 tp，在 dependency class 里加一个 member method 来 delegate 这个 static method，然后再用 "我成替身了" 系技能来做替换。比如：

```java
// 改写成：
class Application {
    public void doSomething() {
        this.service.foobar();  // 后续替换掉 service instance
    }
}

class Service {
    public static void foo() {
        // pass
    }

    public void foobar() {
        foo();  // 原地 tp
    }
}
```

### $\dagger$ "逃避可耻但有用"

这几个技能适用的场景是：Target Class 的 constructor 有 dependency，但 Target Method 并不依赖那些 dependency。我们的目的就是 "把 Target Method 从 Target Class 挪到一个新的、不需要 dependency 的新 class 中"，然后测试这个新的 class。但是这个技能系的问题是：原来的 Target Class 中仍然有 dependency，你要全局测试的话还是逃不脱。

#### $\Diamond \texttt{[02]Break Out Method Object}$

简单说就是 _M2C (Method to Class)_，做法是：

1. 把 Target Method 整体平移到一个 New Class 里
2. Target Method 参数列表不变
3. Target Method 原来用到的 Target Class 的 member 平移成 New Class 的 member
4. 现在只需要实例化 New Class 就能测试了

额外优点：

1. 对冗长的 Target Method 是一次 refactor 的机会，比如可以考虑 "要不要再细分计算步骤"、"要不要对用到的 local variable 建 class" 之类的
2. New Class 可以考虑转型成 Strategy 或者 Visitor Pattern

#### $\Diamond \texttt{[06]Extract and Override Call}$ 

比如说的 Target Method 有 10 行是有 dependency 的，我想甩掉这个 dependency，可以把这 10 行 extract 成一个新的 method，然后再做一个 Target Class 的 subclass 替换掉这个有 dependency 的 class，然后测试 subclass。举个例子：

```java
// 原代码：
class TargetClass {
    public void targetMethod() {
        int i = dependency.call();  // 笨重
        this.bussinessLogic(i);
    }
}

// 改写成：
class TargetClass {
    public void targetMethod() {
        int i = this.callDependency();
        this.bussinessLogic(i);
    }

    public int callDependency() {
        return dependency.call();  // 笨重
    }
}

// 真正被测试的类：
class FakeTargetClass extends TargetClass {
    @Override
    public int callDependency() {
        return fakeValue;
    }
}
```

#### $\Diamond \texttt{[17]Pull Up Feature}$ / $\Diamond \texttt{[18]Push Down Dependency}$

和 $\texttt{[02]Break Out Method Object}$ 很像，本质就是从 Target Class 引申出一个 Abstract Target Class，把不依赖 dependency 的 Target Method 挪到 Abstract Target Class，然后再生成一个 Abstract Target Class 的子类来测试。

这两个技能本质是一样的，区别在于你是准备用 Target Class 的名字当实现类的名字、还是抽象类的名字，和 $\texttt{[09]Extract Implementer}$ / $\texttt{[10]Extract Interface}$ 的关系是类似的。

### $\dagger$ "我成替身了" $\rhd$ 将 dependency 纳入 object seam

#### $\Diamond \texttt{[07]Extract and Override Factory Method}$

用 factory method 作为 object seam：

```java
// 原代码：
class Foo {
    public Foo(Baz baz) {
        this.bar = new Bar();
        this.baz = baz;
    }
}

// 改写成：
class Foo {
    public Foo(Baz baz) {
        this.bar = makeBar();
        this.baz = baz;
    }

    public static Bar makeBar() {
        return new Bar()
    }
}
```

有了这个 `Bar` 的 factory method 之后，原代码的逻辑不变，但现在我们可以 subclass `Foo` 然后 override 这个 factory method 来替换掉 `new Bar()` 这个 dependency (比如用 `Bar` 的 fake/mock；甚至直接用 null，如果它不影响测试的话)。

虽然我们并没有把 `Bar bar` 放到参数列表里，但是这个 `makeBar()` 相当于就是个 object seam。

#### $\Diamond \texttt{[08]Extract and Override Getter}$

用 lazy getter 作为 object seam：

```java
// 原代码：
class Foo {
    public Foo(Baz baz) {
        this.bar = new Bar();
        this.baz = baz;
    }
}

// 改写成：
class Foo {
    public Foo(Baz baz) {
        this.bar = null;
        this.baz = baz;
    }

    public Bar getBar() {
        if (this.bar == null) {
            this.bar = new Bar();
        }
        return this.bar
    }
}
```

有了这个 lazy getter 之后，原代码的逻辑不变，但现在我们可以 subclass `Foo` 然后 override 这个 lazy getter 来替换掉 `new Bar()` 这个 dependency (比如用 `Bar` 的 fake/mock；甚至直接用 null，如果它不影响测试的话)。

虽然我们并没有把 `Bar bar` 放到参数列表里，但是这个 `getBar()` 相当于就是个 object seam。

#### $\Diamond \texttt{[14]Parameterize Constructor}$ / $\Diamond \texttt{[15]Parameterize Method}$

最直接的 object seam 就是参数列表。

更地道一点的话，可以保留原 signature 的 constructor/method (for back compatibility)，然后新加一个 parameterized constructor/method。举例：

```java
// 原代码：
class Foo {
    public Foo(Baz baz) {
        this.bar = new Bar();
        this.baz = baz;
    }
}

// 改写成：
class Foo {
    public Foo(Baz baz) {
        Bar bar = new Bar();
        this(bar, baz);
    }

    public Foo(Bar bar, Baz baz) {
        this.bar = bar;
        this.baz = baz;
    }
}
```

#### $\Diamond \texttt{[19]Replace Function with Function Pointer}$

如果 language 有 first-class function 的话，或者有 callable object 的话，我们可以把 dependency call 的函数体通过参数列表传给 parameterized constructor 或者 parameterized method。

#### $\Diamond \texttt{[20]Replace Global Reference with Getter}$

我们对 global reference (包括 singleton instance) 都是直接 access，没有经过 object seam，如果这个 global reference 是个 dependency，我们就需要把它放到 seam 里然后替换掉。我们可以用一个 getter 来做这个 seam：

```java
Global G = new Global();

// 原代码：
import static com.global.G;

class Foo {
    public foo() {
        G.doSomething();
    }
}

// 改写成：
import static com.global.G;

class Foo {
    public foo() {
        this.getGlobal().doSomething();
    }

    public Global getGlobal()) {
        return G;
    }
}
```

#### $\Diamond \texttt{[22]Supersede Instance Variable}$ 

"supersede" 可以简单理解成 "replace"，但这个 "super-" 前缀暗含了一层 "A supersedes B because A is superior" 的意思，有一点中文 "取代" 的意思。

这是个万不得已才使用的技能：

- 如果我的 dependency class 无法 subclass 怎么办？(比如 `final class`)
- 如果我的 dependency method 无法 override 怎么办？(比如有的 language 不允许 override 被 constructor 调用的 virtual function)

迫不得已的话只能：

1. 在 Target Class 内忍痛做 dependency class 的实例化 (不可避)
2. 但是我可以给 Target Class 加一个 setter 在 dependency class 的实例化之后替换掉 dependency instance

这个 setter 就是 dependency instance 的 object seam。

### $\dagger$ "我成替身了" $\rhd$ 虚化、弱化 dependency class

虚化、弱化 dependency class 是为了方便我们更好地做替身 (fake/mock)：

- 虚化就是提取 dependency 的 interface/abstract class，然后通过 implementation/subclass 来做替身
- 弱化是用一个新的 simple dependency class 来代替原来的 complex dependency class，降低做替身的工作量

#### $\Diamond \texttt{[09]Extract Implementer}$ / $\Diamond \texttt{[10]Extract Interface}$ 

针对很难实例化的 parameter 提取一个 interface 便于我们创建 fake/mock…… (这么简单的技术这需要一个新建一个概念吗？)

至于这两个技能的区别，举个例子：

- $\texttt{Extract Interface}$ 是从 `class Bar` 出发，得到 `interface IBar` + `class Bar`
- $\texttt{Extract Inplementer}$ 是从 `class Bar` 出发，得到 `interface Bar` + `class BarImpl`
- 决定是使用哪个技能完全取决于你起始的这个 `Bar` 是适合做类名还是接口名

吐槽：

- 就这么个简单的破玩意儿还用得着专门写好几页？！
- 我就姑且认为这俩是 interchangeable 了

#### $\Diamond \texttt{[01]Adapt Parameter}$ 

书上的例子：

```java
// 原代码：
public class Dispatcher {
    public void populate(HttpServletRequest request) {
        String [] values = request.getParameterValues(this.pageStateName);
        if (values != null && values.length > 0) {
            String value = values[0];
        }
        // pass
    }
}
```

假设 `HttpServletRequest` 是一个烦人的 dependency，且假设我们只使用了这么一小段，那么我们可以给 `HttpServletRequest` 写一个 adapter，使得 Target Class `Dispatcher` 只依赖于这个 adapter 而不直接依赖 `HttpServletRequest`：

```java
// 新添代码：
interface ParameterSource {
    String getByName(String name)
}

class FakeParameterSource implements ParameterSource {
    private String value;
    
    public String getByName(String name) {
        return value;
    }
}

class ServletParameterSource implements ParameterSource {
    private HttpServletRequest request;
    
    public String getByName(String name) {
        String [] values = request.getParameterValues(name);
        if (values != null && values.length > 0) {
            return values[0];
        } 
        return null;
    }
}
```

注意要修改原来的方法签名：

```java
// 改写成：
public class Dispatcher {
    public void populate(ParameterSource source) {
        String value = source.getByName(this.pageStateName)
        // pass
    }
}
```

这个改动就是把 `HttpServletRequest` 这个 dependency 弱化成了 `ParameterSource`。

#### $\Diamond \texttt{[16]Primitivize Parameter}$

中文版在 P14 的脚注特别强调了一下翻译，"primitivize" 不是说 "要转换成 primitive type" 的意思。译者翻译成了 "朴素化"，因为他觉得 "简化" 这个词又太模糊了，我表示同意。

那啥叫 "朴素化"？比方说 parameter 是一个复杂的 class，有 10 个 attributes，但其实我 Target Method 只用了其中 3 个，那我可以就用这 3 个 attributes 做一个新的中间层 class，然后让 Target Method 改成依赖这个中间层 class。代码举例：

```java
// 原代码：
class TargetClass {
    public void targetMethod(Parameter p) {
        // uses p.a, p.b, p.c
    }
}

class Parameter {
    // pass
}
```

```java
// 新添代码：
class PrimitivizedParameter {
    public PrimitivizedParameter(Parameter p) {
        this.a = p.a;
        this.b = p.b;
        this.c = p.c;
    }
}

// 改写成：
class TargetClass {
    public void targetMethod(Parameter p) {
        PrimitivizedParameter pp = p.primitivize();
        targetMethod(pp);
    }

    public void targetMethod(PrimitivizedParameter pp) {
        // uses pp.a, pp.b, pp.c
    }
}

class Parameter {
    public PrimitivizedParameter primitivize() {
        return new PrimitivizedParameter(this);
    }
}
```

这个改动就是把 `Parameter` 这个 dependency 弱化成了 `PrimitivizedParameter`。

普通技 $\texttt{Do You Really Need this Parameter?}$ 是本技能的极端情况。

### $\dagger$ "我成替身了" $\rhd$ 在 object seam 里替换 dependency

#### $\Diamond \texttt{[21]Subclass and Override Method}$

可以宽泛地认为 fake/mock 用的就是这个技能。

对 dependency 做 subclass 然后 override 复杂的部分，用这个 subclass 作为 dependency 的替身。

如果有对 dependency 做 $\texttt{[10]Extract Interface}$ 的话，我觉得做一个 dependency 的 sibling class 也应该归并到这个技能内。

#### $\Diamond \texttt{[12]Introduce Static Setter}$ 

注意这个技能和 $\texttt{[22]Supersede Instance Variable}$ 的不同：

- $\texttt{[22]Supersede Instance Variable}$ 是在 Target Class 中加 setter
- $\texttt{[12]Introduce Static Setter}$ 是在 singleton dependency class 中加 static setter

这个技能起源于一个想法：在 singleton dependency class 中用 static setter 直接替换掉 singleton instance。比如：

```java
public class Singleton {
    private static Singleton instance = null;

    private Singleton() {}
    
    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }

    // 原始想法：
    // 新添加的代码：
    public static void setTestingInstance(Singleton newInstance) {
        instance = newInstance;
    }
}
```

但这个想法有个问题：你这个 `newInstance` 应该是什么类型？

1. 首先这里是个 singleton，是不应该有多个 instance 的，所以 `newInstance` 不可能是 `Singleton` 类型
2. 那 `newInstance` 就只能是 `Singleton` 的子类，但这又引入了新的问题：
    - 如果 `Singleton` 不允许继承呢？
    - 如果 `Singleton` 允许继承，那我为什么不直接用 $\texttt{[21]Subclass and Override Method}$ 呢？

为了继续这个想法，我们可以再结合一个 $\texttt{[10]Extract Interface}$，写成这样：

```java
// 原代码：
public class Singleton {
    private static Singleton instance = null;

    private Singleton() {}
    
    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}

// 改写成：
public class Singleton implements ISingleton {
    private static Singleton instance = null;

    private Singleton() {}
    
    public static ISingleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }

    // 新添加的代码：
    public static void setTestingInstance(ISingleton newInstance) {
        instance = newInstance;
    }
}
```

然后我就可以这样来做 fake/mock：

```java
class FakeSingleton implements ISingleton {
    // pass
}
    
Singleton.setTestingInstance(new FakeSingleton());
```

# Part II - Changing Software

## Chapter 6 - 旧代码没有 test，我也没时间写，但现在我需要修改它

假设只针对 OO 的情况。你有一个 `TargetClass`，需要修改其中的 `targetMethod()`，添加一段新的代码逻辑：

- `TargetClass` 没有 test case，我们当前对原来的 method 也不打算测试
- 但是我们对新添加的代码逻辑想做测试

### $\Diamond \texttt{Sprout Method}$ (新生方法)

将新逻辑添加到一个全新的 `TargetClass.newMethod()` 里，只在 `TargetClass.targetMethod()` 里添加一个调用，最大程度减小 intrusion (侵入量)。后续 `TargetClass.targetMethod()` 和 `TargetClass.newMethod()` 可以独立测试：

```java
class TargetClass {
    public void targetMethod() {
        // original logic
    }
}

// 改写成：
class TargetClass {
    public void targetMethod() {
        this.newMethod();
        // original logic
    }
}
```

### $\Diamond \texttt{Sprout Class}$ (新生类)

如果我们用了 $\texttt{Sprout Method}$，我们就需要测试 `TargetClass.newMethod()`，但是问题是：如果 `TargetClass` 很难创建 instance 该怎么办？(我们也不打算用 mock 啥的)

我们就把代码 wrap 到 `NewClass.targetMethod()` 里，然后只测试 `NewClass` 就好了，就这么简单 (`TargetClass` 保持不动)。

```java
class TargetClass implements ITarget {
    public void targetMethod() {
        // original logic
    }
}

// 改写成：
class TargetClass implements ITarget {
    public void targetMethod() {
        // original logic
    }
}

class NewClass implements ITarget {
    public void targetMethod() {
        // new logic
    }
}
```

改完后，我们还需要修改原来 `TargetClass` 的 caller，可能的情况有：

1. 用 `NewClass` 完全代替 `TargetClass` (即将 `NewClass` 看做 `TargetClass` 的 decorator; 参见 [Middleman Patterns: Adapter / Proxy / Decorator](/java/2021/09/08/middleman-patterns-adapter-proxy-decorator))
2. 持有一个 `ITarget` 的 collection

然后作者又啰哩吧嗦说了一大段，无非是说这种做法可以引发你对 design 的思考：新的代码逻辑是不是应该独立于 `TargetClass`？有两个类是不是更好？要不要提取公共 interface？

如果逻辑上没有必要设计成两个类，那 Sprout Class 这个方法就会带来它最大的缺点：对 Class Hierarchy 的严重破坏。

另外还有一个问题我很好奇：你 `TargetClass` 的 caller 改动了，如何测试 caller？书上可没说……

### $\Diamond \texttt{Wrap Method}$ (外覆方法)

将 `TargetClass.targetMethod()` 的逻辑转移到 `TargetClass.foo()`，然后添加新的逻辑到 sprout method `TargetClass.bar()`，重新构建 `TargetClass.targetMethod()`:

```java
class TargetClass {
    private void foo() {
        // original logic
    }

    private void bar() {
        // new logic
    }

    public void targetMethod() {
        this.foo()
        this.bar()
    }
}
```

- I usually use $\texttt{Sprout Method}$ when the code I have in the existing method communicates a clear algorithm to the reader. 
- I move toward $\texttt{Wrap Method}$ when I think that the new feature I'm adding is as important as the work that was there before. 
  - In that case, after I've wrapped, I often end up with a new high-level algorithm (instead of a long text of instructions).

### $\Diamond \texttt{Wrap Class}$ (外覆类)

和 $\Diamond \texttt{Sprout Class}$ 很像，但是 `NewClass` 是 `extends TargetClass` 或者组合一个 `TargetClass` instance，然后 overwrite `targetMethod()`。本质还是一个 decorator pattern。

## Chapter 7 - It Takes Forever to Make a Change (略)

我完全不知道为什么要有这么一章？为什么是这个标题？为什么要放到这个位置？我就简单把本章看做是后续章节的一个指路环节好了。略。

## Chapter 8 - How Do I Add a Feature? (可以略)

### TDD

8.1 是一个 TDD 的示例 walk-through

### Programming by Difference

8.2 给了一个 Programming by Difference 的示例 walk-through，但是又没有说啥叫 Programming by Difference…… (MD，我发现这种写文章的鬼手法，OO 界也是重灾区，就是喜欢搞描述性的概念，w/o definition at all)

所谓 Programming by Difference 就是：

> In defining derived classes, we only need to specify what’s different about them from their base classes.

在本章的 context 下，它意味着将新 feature 完全反映在子类与父类的差异上。(这不是理所当然的吗？还需要新建个概念？)

然后书上提了一句注意考虑 LSP，这一点倒是很 reasonable。

## Chapter 9 - 实例化 Target Class 会遇到的困难

### Case 1: constructor 需要的 parameter 很难实例化

可以使用的技能：

- _null枪打鸟_
  - 试试 null 值?
  - 试试 null object？(参考 [PPP chapter 17. Null Object 模式](https://blog.listcomp.com/java/2014/06/24/digest-of-agile-software-development-ppp#ch17))
- $\dagger$ "我成替身了" 技能系都可以用

### Case 2: constructor 中直接 new 了一个很难实例化的 object (书上称之为 Hidden Dependency)

其实最常见的 Hidden Dependency 就是就是在 constructor 中直接 new 其他的 object，而不是把这个 object 创建好再传入 constructor。

所以首先应该把这个 dependency object 放到 Target Class 的 object seam 里，再考虑替换。

### Case 3: constructor 中直接 new 了一个 "onion object"

所谓 "onion object" 是指多层 "object inside object" 的情况，就像一个洋葱，可以一直剥一直剥。

基本可以看做是 Case 2 但不方便使用 $\texttt{[14]Parameterize Constructor}$ 的特殊情况，举例：

```java
class Foo {
    public Foo() {
        this.bar = new Bar();
        this.baz = new Baz(this.bar);
        this.qux = new Qux(this.baz);
        this.quux = new Quux(this.qux);  // 笨重
    }
}
```

这里 `quux` 就是个 onion-object。考虑 `quux` 很不好实例化的情况，你会发现：

1. 只 parameterize `bar` 和 `baz` 并不能解决问题
2. 全员 parameterize `bar`、`baz`、`qux` 和 `quux` 的话:
   - 参数列表过长
   - construction 的难度增大

此时只能：

- 要么 $\texttt{[07]Extract and Override Factory Method}$
- 要么 $\texttt{[22]Supersede Instance Variable}$ 

### Case 4: constructors、member methods、static methods 都依赖于一个笨重的 Singleton Instance

注意这里的 scenario：

1. 书上有用 "global variable" 这个词，但这里肯定不是简单的 int、string 全局变量，它们很好处理；书上这里指的是一个笨重的 global instance，最常见的就是 singleton
2. 然后这个 "笨重" 体现在：a) 要么它很难实例化；b) 要么它的 behavior 很耗时 (比如访问 DB 或是网络通信)
3. 书上还用了 "extensive" 这个词，但这里不是说我会依赖很多个 global instances，而是说 constructors、member methods、static methods 都会依赖某一个 global instance

"extensive" 带来的问题：

- 如果只是 constructors 或 member methods 依赖这个 global instance，我们可以 $\texttt{[14]Parameterize Constructor}$
- 如果只有 static methods 依赖这个 global instance，我们可以 $\texttt{[15]Parameterize Method}$ 
- 但现在是 constructors、member methods、static methods 全都依赖这个 global instance，你总不能把它们全都 parameterize 了吧？（影响可读性、可维护性、封装 etc）

举个例子就知道 parameterize 技术对这个 scenario 的不足：

```java
// 原代码：
class Foo {
    public Foo() {
        // ...
        Singleton.getInstance().initialize();  // 笨重
    }

    public void bar(int i) {
        // ...
        Singleton.getInstance().doSomething(i);  // 笨重
    }

    public static void baz(int j) {
        // ...
        Singleton.getInstance().doSomethingElse(j);  // 笨重
    }
}

// 不适合的 parameterize：
class Foo {
    public Foo(ISingleton singleton) {  // parameterize constructor
        // ...
        this.singleton = singleton
    }

    public void bar(int i) {
        // ...
        this.singleton.doSomething(i);
    }

    public static void baz(int j, ISingleton singleton) {  // parameterize method
        // ...
        singleton.doSomethingElse(j); 
    }
}
```

解决方法：

- 如果 Singleton 允许继承，用 $\texttt{[21]Subclass and Override Method}$
- 否则就用 $\texttt{[12]Introduce Static Setter}$ 

### Case 5: Horrible `#include` Dependency (略)

### Case 6: constructor 有一个 "onion-parameter"

注意和 Case 3 区分。现在的 scenario 是：

```java
class Foo {
    public Foo(Bar bar) {
        // pass
    }
}

class Bar {
    public Bar(Baz baz) {
        // pass
    }
}

class Baz {
    public Baz(Qux qux) {
        // pass
    }
}

class Qux {
    public Qux(Quux quux) {
        // pass
    }
}

// pass
```

我现在要测试 `Foo`，然后发现 `quux`、`Qux`、`Baz`、`Bar` 全都要 new 一个，其中任何一个不方便实例化的话，`Foo` 就不方便实例化。

解决方法：

1. _null枪打鸟_
2. $\texttt{[10]Extract Interface}$ 

### Case 7: constructor 的 parameter 不适合用 $\texttt{[10]Extract Interface}$ 

主要出现在 parameter 位于 class hierarchy 底端时。比如 constructor 需要一个 `Bar4`，但是它的 hierarchy 是这样的:

```java
Bar <- Bar1 <- Bar2 <- Bar3 <- Bar4
```

若是为 `Bar4` 做一个 interface，最终的效果可能是：

```java
IBar
 ^
 Bar <- Bar1 <- Bar2 <- Bar3 <- Bar4
```

或者：

```java
IBar <- IBar1 <- IBar2 <- IBar3 <- IBar4
 ^       ^        ^        ^        ^
 Bar <-  Bar1 <-  Bar2 <-  Bar3 <-  Bar4
```

波及的范围有点大……所以此时还是直接用 $\texttt{[21]Subclass and Override Method}$ 为上策。

## Chapter 10 - 测试 Target Method 会遇到的困难

### Quest 0: 不实例化 Target Class 来测试 Target Method

- $\texttt{[05]Expose Static Method}$
- $\texttt{[02]Break Out Method Object}$

### Quest 1: 如何测试 private method?

首先考虑改成 public 是否合适 (是个人就能想到；但一般我是不会这么搞的)。不行的话只能改成 protected 或 package 权限，然后考虑用 $\texttt{[21]Subclass and Override Method}$，但其实也可以不 override，原地 delegate 一下也行。

我个人的意见是：private method 应该是开发人员自己 unit test 要保证的内容。

### Quest 2: Target Method 需要的 parameter 很难初始化

其实 _Chapter 9 - Case 1_ 的技术都能用。

这里讨论一种额外的 scenario，即 parameter 的类型是一个 framework 的 class：

- 可能有容器负责了它的实例化，所以它自己干脆没有 constructor
- 它已经有 interface 了，但你 fake/mock 这个 interface 会很麻烦 (比如说它是一个非常多方法的 interface)

此时常用的技术是有下面两个。

#### $\Diamond \texttt{Do You Really Need this Parameter?}$

如果你只是需要这个 parameter 的两个 field，我们完全可以 overload 这个 Target Method，比如：

```java
// 原代码：
class Foo {
    public void foo(Bar bar) {
        // uses bar.a and bar.b
    }
}

// 改写成：
class Foo {
    public void foo(Bar bar) {
        this.foo(bar.getA(), bar.getB());
    }

    public void foo(int a, int b) {
        // uses a and b
    }
}
```

#### $\Diamond \texttt{去找一个针对这个 framework 的 mock object library}$ (略)

### Quest 3: 如何测试 Side Effect?

#### $\Diamond \texttt{是谁引入的 Side Effect?}$

这个问题其实很重要。因为：

1. 如果是 Target Method 自己 **直接** 造成的 Side Effect，那作为开发者你自己应该清楚如何测试
    - 如果我 Target Class 是一个 JDBC，Target Method 是 insert 了一条 record，我作为 JDBC 的开发者我肯定知道这个要怎么测
2. 如果是 Target Method 新建了一个 local variable，然后是这个 local variable 造成的 Side Effect，那么我应该考虑 **把这个 local variable 提升为 Target Class 的 member**
    - 比如我 Target Class 是一个 DAO，Target Method 自己创建了一个 JDBC connection，然后 insert 了一条 record
    - 那么 DAO 的 Unit Test 是无法 access 这个 JDBC connection 的，也就无法测试它
    - 如果你 DAO 是持有这个 JDBC connection，别的不说，DAO 的 Unit Test 至少能 fake/mock 这个 JDBC connection
      - 题外话：我觉得这应该叫 Testability-Oriented Design，隶属 defensive programming 的范畴

#### $\Diamond \texttt{Command/Query Separation (CQS)}$

> Command/Query Separation is a design principle first described by Bertrand Meyer.

- A $\texttt{command}$ is a method that can modify the state of the object but that doesn’t return a value. 
- A $\texttt{query}$ is a method that returns a value but that does not modify the object.
  - $\texttt{query}$ 应该是 idempotent 的

**CQS:** A method should be a $\texttt{command}$ or a $\texttt{query}$, but **not both**.

这个 principle 没法做法绝对哈，比如我有一个 lookup 的方法：

```java
class DAO {
    privaite DBConnection conn;
    private RecordCache cache;

    public Record lookup(Table table, Field field, int i) {
        // this is a command
        this.updateLookupCounter(table, field, i);  
        
        // this is a query
        Record r = this.cache.get(table, field, i);
        if (r != null) {
            return r;
        }

        // this is a query
        Record r = this.conn.select(table, field, i);
        
        // this is a command
        this.cache.put(table, field, i, r);

        return r;
    }
}
```

你无论怎么 separation，这个 lookup method 始终是一个 $\texttt{command}$ 和 $\texttt{query}$ 的混合体。我觉得 CQS 的重点在于：我们在面对一个复杂的、既有 $\texttt{command}$ 又有 $\texttt{query}$ 的方法时，要依据 CQS 尽量将 $\texttt{command}$ 和 $\texttt{query}$ 区分 (指划入不同的小方法)。

- 这么做也能保持你 extract 出来的 $\texttt{command}$ 和 $\texttt{query}$ methods 处于相同的抽象层次

细分之后，有助于我们确定 _是谁引入的 Side Effect？_，然后我们就能用上一小节的方法来测试。

## Chapter 11 - 修改时应该测试哪些 methods? (可以略)

还能有啥？这值得专门写一章？

你修改了一个 method，那么这个 method 的所有 caller 你都要检查；如果你这个 method 是父类的一个 method，那么所有的子类你都要检查。复杂的情况就画调用图呗，画 class hierarchy 呗，还能有啥招数？

## Chapter 12 - 续•修改时应该测试哪些 methods?

这一章比上一章有用。

### Interception Point / Pinch Point

假设现在我做了一个修改，不管我是画了调用图还是 class hierarchy，这个图都可以看做 "change's effect" 传播的一个路径图，书上叫 "effect sketch"。

- **change point** 就是你做出修改的地方，相当于是 effect sketch 的 source node
- **interception point** 就是指 effect sketch 上的一个 node, where 你决定要测试这个 effect 的正确性
    - 有的时候并不是你修改了哪个 method 就能测试哪个 method 的，比方说你修改了一个 private method，此时离 change point 最近的一个 interception point 应该是 class 内调用了这个 private method 的一个 public method

有时候不见得离 **change point** 最近的 **interception point** 就是最优的选择，比如说我现在要修改 5 个离散的 classes 的 5 个 public methods，然后我又没有时间去处理这 5 个 classes 各自的 dependency，但是我发现这 5 个 public method 有一个共同的 caller，那我可以选择把 interception point (从 change point 前线) 战术撤退到这个 caller。

- **pinch point** 相当于是 effect sketch 中的 critical point，在 pinch point 拦截可以一次测试多个改动
  - 但是同时要注意，太后方的 pinch point 的测试可能会很笨重

## Chapter 13 - How to Write Tests (略)

## Chapter 14 - Dependencies on Libraries (略)

这一章，是一章哦，只有 1.5 pages，我都不知为作者为什么要这么写。然后这 1.5 pages 我还没看懂他要表达啥意思……

## Chapter 15 - 如何重构充斥着 API Calls 的代码 (可以略)

其实也没啥，说的都是业界 best practice。

啥 "Wrap the API"，不就是写 DAO 嘛，通过 DAO 暴露限定的 high-level API，隐藏 library 的 low-level API。

啥 "Responsibility-Based Extraction"，不就是 "模块化"、"封装" 嘛。

我都懒得吐槽了。

## Chapter 16 - 如何读代码 (没啥内容)

- 画图
- 代码段 (比如一个很长的方法) tagging
- 草稿式重构
- 删掉无用代码

## Chapter 17 - 如何读懂架构 (没啥内容)

## Chapter 18 - 测试类咋命名 / 测试代码放哪儿 (略)

这一章为什么不和 Chapter 13 放一起？

## Chapter 19 - 如何修改 non-OO 的代码 (略)

一个利用 Chapter 4 的 Preprocessing Seam 和 Link Seam 的 C/C++ 例子的 walk-through

## Chapter 20 - 如何重构一个 big class (可以略)

## Chapter 21 - 如何重构大量重复的代码 (可以略)

## Chapter 22 - 如何重构一个 monster method 

extract 小方法时注意：

- 尽量将隔离出的局部逻辑与 monster method 整体的 dependency 分离
- 引入 seam 以方便测试

### Coupling Count

代码段的逻辑复杂程度的一个度量：coupling count (耦合数)，即传入值的数量加上传出值的数量。比如：

```java
int maximum = max(a, b);  // coupling count == 3

Record r = db.select(table, field, i);  // coupling count == 4

db.insert(r);  // cooupling count == 1
```

- coupling count 越小的代码段，extraction 越安全
  - 如果一段代码的 coupling count 是 0，那么它就是一个不接收参数的 $\texttt{command}$

## Chapter 23 - 如何降低修改引入的风险 (略)

## Chapter 24 - 当你感到绝望时 (略)