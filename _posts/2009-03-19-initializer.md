---
layout: post
title: "initializer"
description: ""
category: Java
tags: []
---
{% include JB/setup %}

　　A block-formed initializer can be appended after the fields declared.  

　　If the fields are static, the initializer can also be static too, which means it's only executed once. If the initializer is not static, it will be executed as many times as the class constructor will be, even if the fields are static.  

　　The non-static fields can not be initialized in a static intializer.

```java
class Book {     
    Book(int id) {     
        System.out.println("This is book No." + id);     
    }     
}     
    
class Bookshelf {     
    // case 1:     
    /**   
    Book b1;   
    Book b2;    
    {   
        b1 = new Book(1);   
        b2 = new Book(2);   
    }   
    */    
    //output:     
    //This is book No.1     
    //This is book No.2     
    //This is book No.1     
    //This is book No.2     
    
    //case 2:     
    static Book b1;     
    static Book b2;     
    static      
    {     
        b1 = new Book(1);     
        b2 = new Book(2);     
    }     
    //output:     
    //This is book No.1     
    //This is book No.2     
    
    //case 3:     
    /**   
    static Book b1;   
    static Book b2;   
    {   
        b1 = new Book(1);   
        b2 = new Book(2);   
    }   
    */    
    //output:     
    //This is book No.1     
    //This is book No.2     
    //This is book No.1     
    //This is book No.2     
    
    //case 4:     
    /**   
    Book b1;   
    Book b2;   
    static    
    {   
        b1 = new Book(1);   
        b2 = new Book(2);   
    }   
    */    
    //output: error     
}     
    
class InitBlockTest {     
    public static void main(String[] arg) {     
        new Bookshelf();     
        new Bookshelf();     
    }     
}
```

_9月4号补充:_   

　　initializer 不一定非要是初始化成员，在 initializer 内部其实是可以随便写的，像这样也可以：

```java
class Test {  
	//static  
	{  
		System.out.println("pass");  
	}  
}  
  
public class InitializerTest {  
	public static void main(String[] args) {  
		new Test();  
		new Test();  
	}  
}  
  
//output  
/* 
	pass 
	pass 
*/ 
```

　　另：在声明 field 的时候，常常会当场初始化 field，这个称为 variable intializer (更倾向于将声明 field 的表达式右值称为 variable initializer)。根据 field 是否 static 及初始化是否调用了 static 方法，variable initializer 有的属于 class 行为，有的属于 object 行为。static initializer 完全属于 class 行为。

<br/> 

_2009年09月04日归纳_：[class loading: further discussion involving steps of instance creation](/java/2009/09/04/class-loading-further-discussion-involving-steps-of-instance-creation)