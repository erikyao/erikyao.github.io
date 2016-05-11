---
layout: post
title: "Pointer Swizzling"
description: ""
category: OS
tags: [Database-101]
---
{% include JB/setup %}

　　swizzle 本来的用法应该是 to swizzle a beverage with a spoon，基本就是 "搅动" 的意思。pointer swizzling 有的翻译叫 “指针混写”，第一眼看上去简直不知所云。  

　　以下来自 Jargon File：

> To convert external names, array indices, or references within a data structure into address pointers when the data structure is brought into main memory from external storage; this may be done for speed in chasing references or to simplify code (e.g., by turning lots of name lookups into pointer dereferences). The converse operation is sometimes termed ‘unswizzling'.

　　Jargon File 的这一段解释得还是不怎么清楚，看 Wikipedia 上的这个例子就很清楚了：

> In computer science, pointer swizzling is the conversion of references based on name or position to direct pointer references. It is typically performed during the deserialization (loading) of a relocatable object from disk, such as an executable file or pointer-based data structure. The reverse operation, replacing pointers with position-independent symbols or positions, is sometimes referred to as unswizzling, and is performed during serialization(saving).  
>   
> For example, suppose we have the following linked list data structure:  
>   
> 	struct node {  
>		int data;  
>		struct node *next;  
> 	};  
> 
> We can easily create a linked list data structure in memory using such an object, but when we attempt to save it to disk we run into trouble. Directly saving the pointer values won't work on most architectures, because the next time we load it the memory positions the nodes now use may be in use by other data. One way of dealing with this is to assign a unique id number to each node and then unswizzle the pointers by turning them into a field indicating the id number of the next node:  
>   
>
> 	struct node_saved {  
> 		int data;  
> 		int id_number;  
> 		int id_number_of_next_node;  
> 	};  
>   
> 
> We can save these records to disk in any order, and no information will be lost. Other options include saving the file offset of the next node or a number indicating its position in the sequence of saved records.  
>   
> When we go to load these nodes, however, we quickly discover that attempting to find a node based on its number is cumbersome and inefficient. We'd like our original data structure back so we can simply follow next pointers to traverse the list. To do this, we perform pointer swizzling, finding the address of each node and turning the _id_number_of_next_node_ fields back into direct pointers to the right node.

　　简单地说来，就是内存中的节点间通过“逻辑”指针（实质是内存地址）连接，而将这些节点保存到磁盘时，“逻辑”指针就没有任何意义了，需要变换一种方式来表示这些节点间的连接关系（这里也不好叫做“物理”指针……），这个变换的过程称为 unswizzling。反过来，将这些节点从磁盘 load 到内存中时的变换就是 swizzling。