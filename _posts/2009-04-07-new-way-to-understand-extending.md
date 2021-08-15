---
layout: post
title: "关于 Java 继承的新认识：导出类调用基类方法其实是向上转型"
description: ""
category: Java
tags: []
---
{% include JB/setup %}

前面对继承的理解常常用到了这么一用表述：`Base` 的代码会被复制到 `Ext` 中。其实这么理解欠妥，看代码：

```java
class Base {  
    private String info = "Here is Base";  
      
    public String getInfo() {  
        return info;  
    }  
}  
  
class Ext extends Base {  
    public static void main(String[] args) {  
        Ext e = new Ext();  
          
        System.out.println(e.getInfo());  
    }  
} 
```

很明显，`Base` 的 `private String info` 是不能被继承的，所以就算 `getInf()` 的代码被复制到 `Ext` 中，`Ext` 也是无法调用的 `getInfo()` 的，因为 `Ext` 中没有 `info` 字段。所以 `e.getInf()` 其实隐藏了 `e` 的向上转型。  

所以我们至多只能说 `getInfo()` 被复制到 `Ext` 的方法列表里。  

当然，"复制说" 还是很形象的，有助理解，细节方面自己知道就好。  