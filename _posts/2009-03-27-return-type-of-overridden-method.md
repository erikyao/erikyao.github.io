---
layout: post
title: "关于覆写方法的 return type"
description: ""
category: Java
tags: [Java-101]
---
{% include JB/setup %}

在 [overload and override: 重载与覆写](/java/2009/03/23/overload-and-override) 里面提到过，如果在 base class 中有一个可继承的方法，在 ext class 中添加一个同签名的方法则是覆写行为。其实，覆写对 return type 还是有要求的。  

一般说来，覆写方法要求除了签名相同外，return type 也要相同。  

另外，Java SE 5 新推出了“协变返回类型(covariant return type)”，即覆写方法的 return type 可以是被覆写方法 return type 的 ext class，如：

<pre class="prettyprint linenums">
class BaseReturnType {  
}  
  
class ExtReturnType extends BaseReturnType {  
}  
  
class Base {  
	BaseReturnType work() {  
		return new BaseReturnType();  
	}  
}  
  
class Ext extends Base {  
	ExtReturnType work() {  
		return new ExtReturnType();  
	}  
} 
</pre> 