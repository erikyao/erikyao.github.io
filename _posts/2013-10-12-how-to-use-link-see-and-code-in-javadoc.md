---
category: Java
description: ''
tags:
- JavaDoc
title: How to use @link, @see and @code in JavaDoc
---

## @link

```java
{@link [<package>.]<class>[#<method>]}
{@link #<method>}
```

引用其他类或者方法，注意方法前的 # 与 UML 中表示 protected 的 # 不同（参 [visibility symbol in UML](/uml/2013/04/09/visibility-symbol-in-uml)），这个 # 仅仅用来连接方法和类

## @see

加一个 see also 外链:

```java
@see <a href="http://google.com">Google</a>
```

以下两种写法效果相同：

```java
@see [<package>.]<class>
@see {@link [<package>.]<class>} 
```

## @code

参 [Multiple line code example in Javadoc comment](http://stackoverflow.com/a/542142)：

```java
/**
 * <pre>
 * {@code
 * Set<String> s;
 * System.out.println(s);
 * }
 * </pre>
 */
```

注意评论里有说：

> Another unfortunate, if you have blocks in your example code using curly braces "{}", the first closing brace will terminate the @code block.