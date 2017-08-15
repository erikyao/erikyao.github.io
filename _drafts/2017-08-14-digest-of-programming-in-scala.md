---
layout: post
title: "Digest of Programming in Scala"
description: ""
category: 
tags: []
---
{% include JB/setup %}

## Chapter 1 - A Scalable Language

Scala stands for "scalable language". Technically, Scala is a blend of object-oriented and functional programming concepts in a statically typed language.

### 1.1 A language that grows on you

- grow on sb: to become increasingly liked or appreciated by sb

Eric Raymond introduced the cathedral and bazaar as two metaphors of software development. The cathedral is a near-perfect building that takes a long time to build. Once built, it stays unchanged for a long time. The bazaar, by contrast, is adapted and extended each day by the people working in it. In Raymond’s work the bazaar is a metaphor for open-source software development.

Java’s threading model is built around shared memory and locking. It is hard to be sure you don’t have a race condition or deadlock lurking—something that didn’t show up during testing, but might just show up in production. An arguably safer alternative is a message passing architecture such as the “actors” approach used by the Erlang programming language.

### 1.2 What makes Scala scalable?

#### Scala is object-oriented

Function types are classes that can be inherited by subclasses.

Even though object-oriented programming has been mainstream for a long time, there are relatively few languages that have followed Smalltalk in pushing this construction principle to its logical conclusion. For instance, many languages admit values that are not objects, such as the primitive values in Java. Or they allow static fields and methods that are not members of any object. These deviations from the pure idea of object-oriented programming look quite harmless at first, but they have an annoying tendency to complicate things and limit scalability.

By contrast, **Scala is an object-oriented language in pure form: every value is an object and every operation is a method call**. For example, when you say `1 + 2` in Scala, you are actually invoking a method named `.+()` defined in class `Int`.

Scala’s traits are like interfaces in Java, but they can also have method implementations and even fields.

Unlike a class, a trait can add some new functionality to an unspecified superclass. This makes traits more “pluggable” than classes. In particular, it avoids the classical “diamond inheritance” problems of multiple inheritance.

#### Scala is functional

Functional programming is guided by two main ideas. 

- The first idea is that functions are first-class values. 
	- In a functional language, a function is a value of the same status as, say, an integer or a string. You can pass functions as arguments to other functions, return them as results from functions, or store them in variables. You can also define a function inside another function, just as you can define an integer value inside a function. And you can define functions without giving them a name, sprinkling your code with function literals as easily as you might write integer literals like `42`.
- The second main idea of functional programming is that the operations
of a program should map input values to output values rather than change
data in place.
	- Immutable data structures are one of the cornerstones of functional programming.
	- Functional languages encourage immutable data structures and referentially transparent methods. 
		- A referentially transparent function is one which only depends on its input. 更多见 [stack overflow: What is referential transparency?](https://stackoverflow.com/questions/210835/what-is-referential-transparency)
		- Some functional languages retquire both immutability and referential transparency. Scala gives you a choice.
			- When you want to, you can write in an **imperative** style, which is what programming with mutable data and side effects is called. 
			- But Scala generally makes it easy to avoid imperative constructs when you want, because good functional alternatives exist.
			
### 1.3 Why Scala?

#### Scala is compatible
































