---
layout: post
title: "A Hash Set is NOT a Hash Table!"
description: ""
category: Algorithm
tags: []
---
{% include JB/setup %}

This seems obvious. However, I've found interview problems that can be solved with hash sets be categorized or tagged as hash table problems, which can be very misleading.

Recall what I've learned in Java:

- `HashTable` and `HashMap` implement `Map`
    - `HashTable` is legacy and should not be used
    - equivalent to `dict` classes in Python
- `HashSet` implements `Set`
    - equivalent to `set` classes in Python
    
At most, you can say hash set is a "hash table-based" data structure. Otherwise use "hashing-based data structures" to refer to them together. 