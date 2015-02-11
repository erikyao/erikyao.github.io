---
layout: post
title: "throw 的屏蔽作用"
description: ""
category: Java
tags: [Java-Exception]
---
{% include JB/setup %}

　　在其所在的块内 (如方法 body、if () {...} 等)，throw 语句可以屏蔽其后的语句，即在块内，该 throw 语句后面不能再写其他语句；但在块之外，还是可以写其他的语句的。如：

<pre class="prettyprint linenums">
public class ExceptionTest {  
	private static void func() throws Exception {  
		throw new Exception();  
		//System.out.println("Threw Exception"); // error  
	}  
  
	private static void func2() throws Exception {  
		boolean tag = true;  
		  
		if (tag) {  
			throw new Exception();  
			//System.out.println("Threw Exception"); // error  
		}  
		System.out.println("No Exception"); // pass // Mark No.3  
	}  
  
	public static void main(String[] args) {  
		try {  
			func2(); // Mark No.1  
			throw new Exception(); // Mark No.2: direct throw in try  
		} catch (Exception e) {  
			System.out.println("Caught Exception");  
		}  
		  
		System.out.println("Continue"); // Mark No.4  
	}  
}  
  
//output:  
/* 
	Caught Exception 
	Continue 
*/  
</pre>

　　如果不是直接在 try 中抛出异常 (Mark No.2)，而是调用会抛出异常的方法 (Mark No.1)，一旦 throw 语句执行，则包含该 throw 语句的方法 (如本例的 func2()) 直接退出，后续的语句都不执行 (如 Mark No.3 处就没有运行)。而处理异常的函数 (如本例的 main()) 依旧是顺序运行，不会有什么影响，后续的语句继续运行 (如 Mark No.4 处照常运行)。  

<br/>

_2011-10-27补充_：多个throw的覆盖作用

　　如果你 throw 了一个 Exception，紧接着后面的 catch/finally 也 throw 了一个 Exception，那么，只有最后抛出的 Exception 才能被外围捕捉，前面 throw 的 Exception 就被覆盖掉了。  

　　一个典型的可能的例子是：

<pre class="prettyprint linenums">
try {  
	// 读文件  
} finally {   
	if (io != null) {  
		io.close();  
	}  
}  
</pre>

如果读文件时出了 FileNotFoundException，而不巧 io.close() 也出了 IOException，那么外围只能捕捉到 IOException，而真实的原因 FileNotFoundException 却捕捉不到。  

　　_Practical Java_ 上一个略奇葩的思路是用一个 Collection 来保存 Exception，最后 throw 出一个 AllException(Collection<Exception> c) 这样的异常出来。