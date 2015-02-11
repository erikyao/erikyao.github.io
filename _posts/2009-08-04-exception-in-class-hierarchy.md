---
layout: post
title: "涉及继承的异常声明及捕捉"
description: ""
category: Java
tags: [Java-Exception]
---
{% include JB/setup %}

　　当有继承发生时，会伴随着重载、覆写 (包括接口方法的实现)、构造器的重写等行为。此时，如果基类或是接口的方法存在异常声明，那么导出类或是接口的实现类的对应方法该如何声明异常？同时对这些方法的调用该如何捕捉异常？下面就这2个问题进行探讨，你会看到，针对覆写和构造器的重写是2种完全不同的处理方式 (针对重载则没有任何限制)。代码如下：

<pre class="prettyprint linenums">
class ExtException extends Exception {}  
class AnotherException extends Exception {}  
  
class Base {  
    public void func() {}  
      
    public void func2() throws Exception {}  
    public void func3() throws ExtException {}  
      
    public Base() throws Exception {}  
    public Base(int i) throws Exception {}  
    //public Base(float f) throws ExtException{} // Error No.5: every other constructor will call the default constructor; same as Error No.4  
}  
  
interface Inf {  
    public void func2() throws ExtException;  
    // public void func3() throws AnotherException; // Error No.3: base and interface conflict
      
    public void func4() throws Exception;  
    public void func5() throws Exception;  
}  
  
class ExtImp extends Base implements Inf {  
    // public void func()  throws ExtException{} // Error No.1: if base method has no exception declaration, overriding CANNOT add one  
      
    // public void func2() throws Exception {} // Error No.2: cannot implement interface; base and interface conflict 
    public void func2() throws ExtException {} // implement interface with Hint No.2  
      
    // public void func3() throws ExtException {} // Error No.3  
    // public void func3() throws AnotherException {} // Error No.3  
      
    public void func4() {} // Hint No.1: if base method has exception declaration, overriding CAN ommit  
    public void func5() throws ExtException {} // Hint No.2: if base method has exception declaration, overriding CAN declare ext exception  
      
    // public ExtImp() {} // Error No.4: ext's construcor must declare the exact exception the base constructor declares  
    public ExtImp() throws Exception {}   
    // public ExtImp() throws ExtException {} // Error No.4  
      
    public ExtImp(int i) throws Exception, ExtException {} // Hint No.3: once ext decalres throwing the base's exception, it CAN declare other exception (不一定非要是父类声明异常的子类)
      
    // public ExtImp(float f) throws ExtException{} // Error No.5  
}  
</pre>

<pre class="prettyprint linenums">
class ExtException extends Exception {}  
class AnotherException extends Exception {}  
class ThirdException extends Exception {}  
class FourthException extends ThirdException {}  
  
class Base {  
    public Base() {}  
    public Base(int i) throws ExtException {}  
    public Base(float f) throws ExtException {}  
      
    public void func() throws ThirdException { System.out.println("Base.func()"); }  
}  
  
class Ext extends Base {  
    public Ext() throws Exception {}  // Hint No.4: ext's constructor CAN add exception declaration  
    public Ext(int i) throws ExtException, AnotherException {} // Hint No.4  
    public Ext(float f) throws Exception {} // Hint No.5: ext's constructor can declare base exception  
      
    public void func() throws FourthException { System.out.println("Ext.func()"); }  
}  
  
public class Example2 {  
    public static void main(String[] args) {  
        try {  
            Ext e = new Ext(5);  
            e.func();  
        } catch (ExtException ee) {}  
        catch (AnotherException ae) {}  
        catch (FourthException fe) {} // ***DIFFERENCE***  
      
        try {  
            Base b = new Ext(5);  
            b.func();  
        } catch (ExtException ee) {}  
        catch (AnotherException ae) {}  
        catch (ThirdException te) {} // ***DIFFERENCE***  
    }  
}  
  
//output:  
/* 
    Ext.func() 
    Ext.func() 
*/  
</pre>

　　针对覆写方法，有以下几点原则：

1. 如果基类方法没有声明异常，那么导出类的覆写方法也不能声明异常 (Error No.1)。
2. 如果基类方法有声明异常，那么导出类的覆写方法可以：(1)不声明异常；(2)声明抛出基类方法的异常；(3)声明抛出基类方法异常的导出类。(Hint No.1 & Hint No.2)
3. 如果基类和接口有同签名方法，且导出类实现了接口，如果基类方法和接口方法声明的异常不同，则称基类与接口冲突。如果基类方法抛出的异常和接口方法声明的异常存在继承关系，则实现接口的导出类必须声明抛出导出异常 (子异常) (Error No.2)；如果如果基类方法声明的异常和接口方法声明的异常不存在继承关系，则冲突不可调和，需要修改基类或是接口 (Error No.3)。
4. 由 Example2 可见，对于向上转型 Base b = new Ext(5)，调用 b.func() 虽然会动态绑定调用 Ext 的 func() 方法，可是 _**异常捕捉必须按照 Base 的 func() 方法的异常声明来捕捉**_ (见 DIFFERENCE 处)。  

　　针对构造器的重写，有以下几点原则：

1. 这里应该持这么一种观点，基类的带参构造器和导出类的所有构造器都默认调用了基类的默认构造器，Base(int i) 调用了 Base()，Ext() 调用了 super()，Ext(int i) 调用了 super(i)，依次类推。所以一旦基类的默认构造器声明了异常，那么基类的带参构造器和导出类的所有构造器都必须声明异常，异常类型可以是基类默认构造器的异常或是其基类，而决不能是其导出类 (Error No.4, Error No.5 & Hint No.5) (与覆写方法抛异常的情况刚好相反)。
	
	_p.s._ 导出类构造器虽然不能声明导出异常，不过可以抛出导出异常，如：
	
	<pre class="prettyprint linenums">
	class Base {  
		public Base() throws NullPointerException {}
	}
	
	class Ext extends Base { 
		public Ext() throws Exception { 
			throw new NullPointerException(); 
		}
	} </pre>

	所以牢记： _**声明异常和实际抛出异常完全是两码事**_。
	
1. 如 1. 所说，构造器的重写实际是调用关系，所以一旦默认构造器没有声明异常，那么其他构造器就可以随便添加异常声明 (Hint No.3 & Hint No.4)。