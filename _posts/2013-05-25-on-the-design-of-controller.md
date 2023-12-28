---
category: Thought
description: ''
tags:
- Experience
title: 设计 Controller 的一些经验
---

### (1)

区分哪些接口是自己用的，哪些接口是给别人用的，据此至少要分两个 controller（如：wmail 接口，lp 项目）

### (2)

区分哪些接口是跳转接口（返回 `ModelAndView`），哪些接口是 ajax 接口（`response.write(JSON or JS)`）。考虑初始化页面是用跳转接口，还是用 ajax 接口？（如：blog 页面，前端大作业项目）

### (3)

Controller 里时常有这样的逻辑：
	
```java
Data1 data1 = getData1();
if (data1 == null) { response.write(errorCode1); return; }

Data2 data2 = getData2(data1); 
if (data2 == null) { response.write(errorCode2); return; }

// build json from data2 and write it to page
```

此时应该设计一个 `Enum DataError` 来包含 `errorCode` 和 `errorMsg`，然后设计一个 `Exception(DataError)`，接着在 Service 里写一个 `getData2()` 方法，隐藏获取 `data1` 的逻辑。如果出错，抛 `Exception(DataError)` 给 Controller，Controller 根据 `DataError` 来写 error

如果 Controller 后续还需要 `data1`，可以在 Service 写一个 `getData()` 方法返回 `TwoTuple(data1, data2)`

### (4)

需要联合多个 PO 大段拼 json 的逻辑，都放到 Controller 的 private 方法里吧，保持 `@RequestMapping` 方法都是较高层次的逻辑，或者说确保逻辑层次的落差不是太大（比如说你获取 `data2` 只用了一行 Service 代码，用 `data2` 来拼 json 却花了 30 行，还是两个 for 嵌套，附带大量字符串常量横飞，那么我觉得这两处逻辑的层次是不对等的）