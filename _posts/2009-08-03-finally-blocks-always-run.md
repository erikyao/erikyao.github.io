---
layout: post
title: "finally 总是会被执行"
description: ""
category: Java
tags: [Java-Exception]
---
{% include JB/setup %}

`finally` 总是会被执行，即使 `try` 中有 `break`、`continue`、`return`，如：

```java
public class FinallyTest {  
	public static void main(String[] args) {  
		int i;  
		  
		for (i = 0; ;i++) {  
			try {  
				if (i == 0) { 
					continue;
				}
				else if (i == 1) {
					break; 
				}
			} finally {  
				System.out.println("loop " + i + " ends");  
			}  
		}  
		  
		try {  
			return;  
		} finally {  
			System.out.println("return ends");  
		}  
	}  
}  
  
// output  
/* 
	loop 0 ends 
	loop 1 ends 
	return ends 
*/  
```

另外，从这个例子可以看出，不写 `catch`，直接 try-finally 也是可以的。