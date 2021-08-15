---
layout: post
title: "Java: first catch"
description: ""
category: Java
tags: [Java-Exception]
---
{% include JB/setup %}

`try` 块里有异常抛出时，程序会进入 _**第一个**_ 异常类型匹配的 `catch` 块执行，其他的 `catch` 块不执行。  

注意这里说的 "第一个匹配的异常类型"。我们知道，所有的异常类型都是 `extends Exception`，所以 `catch (Exception e)` 可以 catch 所有的异常。  

同时，对基类异常的 `catch` 块会屏蔽其后的对其导出类异常的 `catch` 块，而且这个屏蔽只与 `catch` 块代码的位置有关系，如：

```java
class MyException extends Exception {  
}  
  
public class ExceptionTest {  
	public static void main(String[] args) {  
		try {  
			throw new MyException();  
		} catch (Exception e) {  
			System.out.println("Catch an Exception: " + e.getClass().toString());  
		} catch (MyException me) {  
			System.out.println("Catch a MyException: " + me.getClass().toString());  
		}     
	}  
}  
  
// output: Compiling Error  
/* 已捕捉到异常 MyException */  
  
// when comment or delete the 'catch (MyException me)' block  
// output:  
/* Catch an Exception: class MyException */  
```

这里，`catch (Exception e)` 就屏蔽了 `catch (MyException me)`。但是，如果我们把 `catch (MyException me)` 置于 `catch (Exception e)` 之上，就不会有屏蔽。如：

```java
class MyException extends Exception {  
}  
  
public class ExceptionTest {  
	public static void main(String[] args) {  
		try {  
			throw new MyException();  
		} catch (MyException e) {  
			System.out.println("Catch a MyException: " + e.getClass().toString());  
		} catch (Exception e) {  
			System.out.println("Catch an Exception: " + e.getClass().toString());  
		}     
	}  
}  
  
// output:  
/* Catch a MyException: class MyException */  
```
