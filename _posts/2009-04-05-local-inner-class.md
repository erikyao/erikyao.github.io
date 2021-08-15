---
layout: post
title: "Java: 局部内部类 (local inner class)"
description: ""
category: Java
tags: [Java-InnerClass]
---
{% include JB/setup %}

如果把 `{...}` 这么一段称为 “域”，那么方法 body 明显是一个域，方法 body 中的 `if {}` 或是 `for {}` 之类的也是域。在方法 body 或是方法 body 中其他域里定义的类就是局部内部类。  

局部内部类 _**只能**_ 在定义它的域中使用。且局部内部类的编译不受域执行与否的影响，即比如在 `if {}` 中定义了一个局部内部类，即使这个 `if` 不执行，这个局部内部类也照常编译。