---
layout: post
title: "Java: Arrays.asList()"
description: ""
category: Java
tags: []
---
{% include JB/setup %}

`Arrays.asList()` 这个方法有点特殊，这里记录一下。  

首先，`Arrays.asList()` 返回的是一个 `List` 接口实现，这个 `List` 在底层是有数组实现的，所以 size 是 fixed 的。所以，下面的代码是不可以的：

```java
List<Integer> list = Arrays.asList(1, 2, 3);  
list.add(4); // java.lang.UnsupportedOperationException
```

_2014-05-19补充_：`Arrays.asList()` 返回的是 `Arrays` 自己定义的一个内部类 `java.util.Arrays$ArrayList`，与我们常用的 `java.util.ArrayList` 是两个不同的类  

其次，如果不指定返回 `List` 的类型 (即 `<...>` 部分)的话，`Arrays.asList()` 对其返回 `List` 的类型有自己的判断，可以视为它自身的一种优化机制，如下所示：

```java
// Arrays.asList() makes its best guess about type.  
  
import java.util.*;  
  
class Snow {}  
  
class Powder extends Snow {}  
class Crusty extends Snow {}  
class Slush extends Snow {}  
  
class Light extends Powder {}  
class Heavy extends Powder {}  
  
public class AsListInference {  
	public static void main(String[] args) {  
		List<Snow> snow1 = Arrays.asList(new Crusty(), new Slush(), new Powder()); // pass  
  
		//List<Snow> snow2 = Arrays.asList(new Light(), new Heavy()); // error  
		List<Powder> snow2 = Arrays.asList(new Light(), new Heavy()); // pass  
		  
		List<Snow> snow3 = Arrays.asList(new Light(), new Crusty()); // pass  
  
		List<Snow> snow4 = new ArrayList<Snow>();  
		Collections.addAll(snow4, new Light(), new Heavy()); // pass  
  
		List<Snow> snow5 = Arrays.<Snow>asList(new Light(), new Heavy()); // pass  
	}  
}  
```

- `snow1` 添加 3 个 `Snow` 的导出类对象，没有问题。  
- `snow2` 添加 2 个 `Snow` 的导出类对象，按理也是可以的，不过由于它们都是 `Powder`，所以 `Arrays.asList()` 返回的是一个 `List<Powder>`。可见 `Arrays.asList()` 返回的是精确类型的 `List`。  
- `snow3` 混合添加，也没有问题。
- `snow4` 不用 `Arrays.asList()`，使用 `Collections.addAll()`，就没有 `snow2` 中的局限了。
- 如果一定要 `Arrays.asList(new Light(), new Heavy())` 返回 `List<Snow>` 而不是 `List<Powder>`，可以用 `Arrays.<Snow>asList()` 来强制产生 `List<Snow>`，如 `snow5`。
