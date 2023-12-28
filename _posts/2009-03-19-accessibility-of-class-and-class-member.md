---
category: Java
description: ''
tags: []
title: 'Java: 关于 class 和 class member 的访问权限'
---

## class的访问权限

class 的访问权限只有 `public` 和 package 两种，不存在 `private` 和 `protected`（内部类是特例）。  

每一个编译单元（即 `.java` 文件）至多只能有一个 public class，且如果有的话，该 public class 名必须与文件名相同。  

class 访问权限是 member 访问权限的基础。  

---

## member的访问权限

当一个 class 是可访问的时候，member 的访问权限才有意义。  

- 还是 `private`、package、`protected`、`public` 这四种 
- `protected` 包含 package 权限。  
  
<br/>
_7月27日补充：member的访问权限是针对类而言的_  

- `public`: 对所有类可见。  
- `protectd`: 对其 Ext Class 可见 + package。  
- package: 对同一 pkg 内的类可见。  
- `private`: 仅对 member 所在的类可见。  

我们这里说的都是 Class，而不是 Object。有时候在理解上会有这样的混淆：

```java
class Test {  
	private int i;  
}  
  
public class PrivateTest {  
	public static void main(String[] args) {  
		Test t = new Test();  
		System.out.println("i = " + t.i); // syntax error  
	}  
} 
```

我们的确是获得了 `Test` 对象 `t`，`i` 也的确是 `t` 的 member，不过我们访问 `i` 是在 `PrivateTest` 类中，根据 `private` 的定义，这里依旧是会出错。  

所以说，member 的访问权限是针对类而言的，而不是针对对象。不能单纯地以为只要获得了对象 (引用)，就能随便访问对象中的所有成员。  
  
<br/>
_10月10日补充：可见的意思_

如果类 `A` 的字段 `i` 对类 `B` 可见，则在类 `B` 中可以通过类的对象引用（假设有 `A a = new A();`）（如果是 `static` 字段，则是通过类名）来访问字段 `i`，即：可以在类 `B` 中直接写 `a.i`（如果是 static 字段，则是可以写 `A.i`）。  

那么，我们现在回头看，如果类 A 的字段 i 是：

Accessibility  |  Comment
-------------- | -------------
`public`: 对所有类可见 | 所有的类中都可以写 `a.i` 或是 `A.i`
`protectd`: 对其 Ext Class 可见 + package | 只有与类 `A` 同包的类，或是类 `A` 的子类中可以写 `a.i` 或是 `A.i`
package: 对同一 pkg 内的类可见 | 只有与类 `A` 同包的类中可以写 `a.i` 或是 `A.i`
`private`: 仅对 member 所在的类可见 | 只有类 `A` 本身可以直接用 `a.i` 或是 `A.i`

这里又涉及到另外一个问题，即我自己常用的表达："`private`、package 不可继承"。其实这里 `private`、package 权限字段是由于对子类不可见所以不能继承。可以理解为 ext class 隐式包含一个 base class，base class 根据 member 的访问权限决定是否将 member 暴露给 ext class。