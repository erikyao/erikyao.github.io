---
title: "Revisited: Polymorphism / RTTI"
description: ""
category: C++
tags: [RTTI]
toc: true
toc_sticky: true
---

# Q1: What is polymorphism, again?

_ChatGPT_ 和 _Claude_ 都提到了：

- compile-time (static) polymorphism: achieved through method overloading
- runtime (dynamic) polymorphism: achieved through method overriding

这个分类我觉得还可以。

那讨论 polymorphism 我们其实可以考虑 3 个问题：

1. 主体是谁？
2. 主体具有的 polymorphic forms (i.e. polymorphism) 有哪些？
3. 主体具有的 polymorphic behaviors 有哪些？

对 compile-time (static) polymorphism 而言：

1. 主体一般是 method (or method's name)
2. polymorphic forms 就是 overloaded methods
3. polymorphic behaviors 就是 overloaded methods 的运行

比如：

```java
public class Calculator {
    // Method to add two integers
    public int add(int a, int b) {
        return a + b;
    }

    // Overloaded method to add three integers
    public int add(int a, int b, int c) {
        return a + b + c;
    }

    // Overloaded method to add two doubles
    public double add(double a, double b) {
        return a + b;
    }

    public static void main(String[] args) {
        Calculator calc = new Calculator();
        
        System.out.println(calc.add(5, 10));          // Calls 1st method (two ints)
        System.out.println(calc.add(5, 10, 15));      // Calls 2nd method (three ints)
        System.out.println(calc.add(5.5, 10.5));      // Calls 3rd method (two doubles)
    }
}
```

1. 主体是 `add` 这个 method (or method name)
2. 它有 3 个 polymorphic forms (i.e. 3 个 method definition)
3. 它有 3 个 polymorphic behaviors (i.e. 3 个运行逻辑)

对 runtime (dynamic) polymorphism 而言：

1. 主体一般是 reference
2. polymorphic forms 就是 reference's declared type + actual type 
3. polymorphic behaviors 就是 dynamic binding (根据 actual type 确定具体要调用那个 method)

比如：

```java
class Animal {
    // This method will be overridden in subclasses
    public void makeSound() {
        System.out.println("Some generic animal sound");
    }
}

class Dog extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Bark!");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal myDog = new Dog();

        // Single dispatch in action
        myDog.makeSound();  // Prints "Bark!"
    }
}
```

1. 主体是 `myDog`
2. polymorphic forms 即：`myDog` 虽然 declared 是 `Animal`，但 actual 是 `Dog`
3. polymorphic behaviors 即：`myDog` 虽然 declared 是 `Animal`，但是能调用 `Dog.makeSound()`

# Q2: What is binding?

谈到 polymorphism 时一定会提到 static ("early") binding 和 dynamic ("late") binding，但 binding 更广泛的意义是在 **Name Lookup** 层面的 (参 [编译和链接](https://listcomp.com/os/2016/06/29/linking-loading-and-library#2-%E7%BC%96%E8%AF%91%E5%92%8C%E9%93%BE%E6%8E%A5))

这个问题我觉得 [Sergey Kalinichenko 的回答](https://stackoverflow.com/a/49759863/11640888) 很好：

> Most generally, "binding" is about associating an identifier to whatever it identifies, be it a method, a variable, or a type. 
> 
> All bindings in Java are static ("early") except for bindings of instance methods, which may be static or dynamic ("late"), depending on method's accessibility.

所以，polymorphism context 下的 binding 一般指的都是 **binding of instance methods**:

- static ("early") binding (of instance methods):
    - happens at compile-time
    - (instance and method are) bound by compiler
    - compiler carries out binding based on instance's declared type
- dynamic ("late") binding (of instance methods):
    - happens at runtime
    - (instance and method are) bound by runtime
    - runtime carries out binding based on instance's actual type

Java 中具体哪些情况是 static binding？哪些是 dynamic binding？可以参考 [Java 的 Single Dispatch 与 Override、Overload、Static Binding、Dynamic Binding](https://listcomp.com/java/2021/01/03/single-dispatch-in-java-and-python#3-java-%E7%9A%84-single-dispatch-%E4%B8%8E-overrideoverloadstatic-bindingdynamic-binding)

# Q3: Does static binding always happen at compile-time?

Yes (should be)

# Q4: Does dynamic binding always happen at runtime?

Yes (should be)

所以可以建立规律：

- compile-time (static) polymorphism 使用 static ("early") binding (of instance methods)
    - 需要时刻注意：存在 static binding of other things (e.g. instance fields) 和 static polymorphism 没有任何关系 
- runtime (dynamic) polymorphism 使用 dynamic ("late") binding (of instance methods)

# Q5: What is runtime then?

Java 的情况比较好理解：你在 JVM 中 compile，你在 JVM 中 run，所以 runtime 就是 JVM

C++ 的话：你有一个 compiler，所以 compile-time 就是 compilation 的 instance；但你在 OS 中运行，所以 runtime 应该可以认为是 OS + Runtime Lib 的结合体

# Q6: What's the relationship between dynamic ("late") binding (of instance methods) and single dispatch?

我们在 [Single Dispatch in Java and Python](https://listcomp.com/java/2021/01/03/single-dispatch-in-java-and-python#3-java-%E7%9A%84-single-dispatch-%E4%B8%8E-overrideoverloadstatic-bindingdynamic-binding) 有说：

> **single dispatch:** 这个简写也简得太厉害了，其实是 dynamic dispatch on a single parameter

它们的名称里都有 dynamic，所以它们的关系有：

- single dispatch 本质是个 dispatch strategy
- single dispatch **relies on** dynamic binding
- dynamic binding **enables** single dispatch

# Q7: What's the relationship between dynamic ("late") binding (of instance methods) and virtual table (in C++)

_vtable_ is C++'s implementation of dynamic binding

Java 的实现应该和 C++ 类似

# Q8: What is RTTI?

**RTTI** == **R**un-**T**ime **T**ype **I**nformation/**I**dentification. 简单说就是允许你在 runtime 时获取 object 的 (actual) type information. 叫 identification 也行，你 identify 的其实也就也是 object 的 type.

RTTI 是一个 **feature** of programming languages，这是个很高层面的概念，而不是一个具体的 mechanism

在 C++ 中，我们认为 [`typeid`](/c++/2015/04/24/cpp-typeid) 和 [`dynamic_cast`](https://listcomp.com/c++/2015/03/18/cpp-explicit-cast-operator-static_cast-const_cast-reinterpret_cast-dynamic_cast#4-dynamic_cast) 是 RTTI 的具体体现:

- 因为 C++ 明确了说它有 RTTI，所以法理上你就应该是可以做 `typeid` 和 `dynamic_cast` 这类的操作的
- 如果 C++ 没有 `typeid` 和 `dynamic_cast` 这类的操作，那你就很难说 C++ 有 RTTI
- RTTI 并没有规定 `typeid` 和 `dynamic_cast` 这类的操作具体要怎么实现。Again, RTTI is not a concrete mechanism

# Q9: Is RTTI an exclusive thing in C++? Does Java have RTTI?

[wikipedia](https://en.wikipedia.org/wiki/Run-time_type_information) 说 C++、Object Pascal、Ada 都有 RTTI，但鉴于后两者的流行程度，我们在讨论 RTTI 时，一般都是在 C++ 的 context 下。

那至于 "Java 有没有 RTTI ?" 这个问题，你貌似搜索不出一个统一的答案，但这其实不重要，因为我们可以搬出 **(Run-Time) Type Introspection** 和 **(Run-Time) Type Reflection** 这两个更大的概念来讨论。(我不是很懂，这两个概念的名字往往是不带 runtime 字样的，但实际都在讨论 at runtime)

RTTI is a feature of progamming language, which means a language has ability at runtime:

- to expose type information
- to do basic type checking and type conversion

RTT Introspection (more broader than RTTI) means a language has extra ability at runtime:

- to examine type information
- to examine object properties
- to check type relationships

RTT Reflection (more broader than Introspection) means a language has extra ability at runtime:

- to modify object properties
- to dynamically invoke methods
- to dynamically create objects
- to dynamically create types

我们可以认为：

- Java 有一些 core language feature 和 RTTI 是一致的 (但名字不一定叫 RTTI)
- Java 有 reflection 是比 RTTI 更 broader 的 feature

# Q10: Does Java's `instanceof` always happen at runtime?

在某些认为 "Java 有 RTTI" 的文章中，你会看到它们认为 `instanceof` 是 Java RTTI 的一种体现，就好比 C++ 中的 `typeid`

`instanceof` 的确也是用于 runtime type determination 的，但根据 [wkl & Kirk Woll](https://stackoverflow.com/a/3897495/11640888):

> ... if you were checking if `x` is an `instanceof` a concrete class, and the compiler can determine `x`'s type, then you will get an error at compile time.

Example:

```java
import java.io.Serializable;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.io.ObjectInputStream;

class SerializableClass implements Serializable
{
   private void writeObject(ObjectOutputStream out) {}
   private void readObject(ObjectInputStream in) {}
}

class DerivedSerializableClass extends SerializableClass
{
   public static void main(String[] args)
   {
      DerivedSerializableClass dsc = new DerivedSerializableClass();

      if (dsc instanceof DerivedSerializableClass) {} // fine
      if (dsc instanceof Serializable) {} // fine because check is done at runtime
      if (dsc instanceof String) {} // error because compiler knows dsc has no derivation from String in the hierarchy

      Object o = (Object)dsc;
      if (o instanceof DerivedSerializableClass) {} // fine because you made it Object, so runtime determination is necessary
   }
}
```

# Q11: How to determine if an operation happens at compile-time, or runtime?

除了记住一些铁律 (比如 [static binding vs dynamic binding](https://listcomp.com/java/2021/01/03/single-dispatch-in-java-and-python#3-java-%E7%9A%84-single-dispatch-%E4%B8%8E-overrideoverloadstatic-bindingdynamic-binding) 那些) 之外，我们也提到过一个这么一个经验趋势：

- compiler 在 compile-time 尽全力做它力所能及的事情
- compiler 实在做不了的，再交给 runtime

比如我们站在 compiler 的角度 (i.e. 假设我自己是 compiler)，考虑我在处理 `Animal myDog = new Dog(); myDog.makeSound();` 时应该怎么做：

- 你知，我知，compiler 肯定也可以知道，`myDog` 的 actual type 是 `Dog` 而不是 `Animal`
- 但 compiler 能把 `myDog` 的 type 记录成 `Animal` 吗？它不能，因为你不知道后续你会不会写 `myDog = new Cat();` 这样的代码
    - 可能存在某些 optimization 技术，比如：在确定 `myDog` object 不会 re-bind 到其他类型时，compiler 直接把 `myDog` 类型记录成 `Dog`，从而避免 dynamic binding 的 overhead。但这不是 general 的 case
- 所以我作为一个 compiler 只能把 `myDog` 的 type 记录成 `Animal`，然后交给 runtime 去 dynamic binding

# Q12: What's the relationship between RTTI and dynamic binding?

没有关系。

我觉得我会产生 "它们有点联系" 的错觉，大概是因为以前考到有材料说 "可以用 downcast 来理解多态"，但这只是个比喻。**dynamic binding 不需要做 type conversion.**

```cpp
class Base {
public:
    virtual void foo() { std::cout << "Base foo" << std::endl; }
    virtual ~Base() {} // Virtual destructor
};

class Derived : public Base {
public:
    void foo() override { std::cout << "Derived foo" << std::endl; }
};

int main() {
    Base* ptr = new Derived();

    // dynamic binding
    ptr->foo();

    // 先 RTTI，然后 dynamic binding
    dynamic_cast<Derived*>(ptr)->foo();

    delete ptr;
    return 0;
}
```

`ptr->foo();` 这一步不需要做 downcast，所以说 dynamic binding 和 RTTI 没有关系

`dynamic_cast<Derived*>(ptr)->foo();` 这一步任然是 dynamic binding，因为你 (as a compiler) 无法确定是否还有 `class MoreDerived : public Derived`

当然，直接 `dynamic_cast<Derived*>(ptr)->foo();` 这么写不推荐，更 safe 的写法是：

```cpp
Derived* derivedPtr = dynamic_cast<Derived*>(ptr);
// dynamic_cast might return nullptr if the cast fails
if (derivedPtr) {
    derivedPtr->foo(); // Safe to call
}
```