---
layout: post
title: "Java: foreach 与 iterable"
description: ""
category: Java
tags: []
---
{% include JB/setup %}

`Iterable` 是一个接口，它只有一个方法 `iterator()`，要求返回一个 `Iterator`。

```java
package java.lang;  
  
public interface Iterable<T> {  
    Iterator<T> iterator();  
} 
```

而 `Iterator` 本身也是个接口，它有 `hasNext()`、`next()`、`remove()` 三个方法。

```java
package java.util;  
  
public interface Iterator<T> {  
	boolean hasNext();  
	T       next();  
	void    remove(); //optional  
}  
```

一般的实现为：

```java
import java.util.*;  
  
public class StringArray implements Iterable<String> {  
    private String[] words;  
      
    public StringArray() {  
        words = "This is the default sentence".split(" ");  
    }  
      
    public StringArray(String sentence) {  
        words = sentence.split(" ");  
    }  
      
    public Iterator<String> iterator() {  
        return new Iterator<String>() {  
            private int index = 0;  
              
            public boolean hasNext() {  
                return index <= words.length - 1;  
            }  
              
            public String next() {  
                return words[index++];  
            }  
              
            public void remove() {  
                // we do not implement it here  
                throw new UnsupportedOperationException();  
            }  
        };  
    }  
      
    public static void main(String[] args) {  
        StringArray sa = new StringArray("Hello World");  
          
        for (String s : sa) {
            System.out.println(s);  
		}
	}  
}  

//output:  
/*   
    Hello    
    World 
*/ 
```

目前有这么一个问题，如果一个类想要有不同的 `Iterable` 效果怎么办？我们可以给这个类定义不同的方法来返回不同的 `Iterable` 实现，而不是让类自己去实现 `Iterable` 接口。这样也是可以使用 `foreach` 语句的，因为 `foreach` 的语法要求就是 `for (Obj o : Iterable i)`，冒号后面放一个 Iterable 实现就好了，具体是什么形式并不限制。如下：

```java
public class ReverseStringArray {  
    private String[] words;  
      
    public ReverseStringArray() {
        words = "This is the default sentence".split(" ");  
    }  
      
    public ReverseStringArray(String sentence) {
        words = sentence.split(" ");  
    }  
      
    public Iterable<String> reverseIterable() {
        return new Iterable<String>() {  
            public Iterator<String> iterator() {  
                return new Iterator<String>() {  
                    private int index = words.length - 1;  
                  
                    public boolean hasNext() {  
                        return index >= 0;  
                    }  
                  
                    public String next() {  
                        return words[index--];  
                    }  
                      
                    public void remove() {  
                        // we do not implement it here  
                        throw new UnsupportedOperationException();  
                    }  
                };  
            }  
        };  
    }  
      
    public static void main(String[] args) {
        ReverseStringArray rsa = new ReverseStringArray("Hello World");  
          
        for (String s : rsa.reverseIterable()) { 
            System.out.println(s);
		}
    }  
}  
  
//output:  
/* 
    World 
    Hello 
*/  
```
