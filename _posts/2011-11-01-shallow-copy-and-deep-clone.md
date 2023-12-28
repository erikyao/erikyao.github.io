---
category: Java
description: ''
tags: []
title: 'Java: shallow copy v.s. deep clone'
---

```java
class Field implements Cloneable {  
	public String name;  
	  
	@Override  
	protected Object clone() {  
		Field f;  
		try {  
			f = (Field) super.clone(); // shallow clone  
			// f.name = new String(this.name); // deep clone  
			  
			return f;  
		} catch (CloneNotSupportedException e) {  
			e.printStackTrace();  
		}  
		return null;  
	}  
	
	public static void main(String[] args) {
		Field f1 = new Field();
		f1.name = "test";
		Field f2 = (Field) f1.clone();
		
		System.out.println(f1.name == f2.name); // true
	}
}  
```

shallow clone 时要注意对象中的字段是可变类还是不可变类。比如上面的例子中，`Field` 中的字段是 `String`，不可变类，所以 `f.name = "world";` 不会影响到 `f.clone().name;`；如果是 `StringBuffer` 或是 `Collection` 这类的可变类，`f.name.append();` 或是 `f.name.sort();` 一下，`f.clone().name` 也会跟着变，所以就不是标准的 clone 了。