---
layout: post
title: "Isolation"
description: ""
category: Database
tags: []
---
{% include JB/setup %}

[Dirty_Read]: https://farm6.staticflickr.com/5656/23624880920_95574a7d25_o_d.png
[Nonrepeatable_Read]: https://farm6.staticflickr.com/5664/23552710379_1c571a15dc_o_d.png
[Phantom_Read]: https://farm6.staticflickr.com/5786/23292345284_40e94b9ea8_o_d.png

　　参考 [Isolation (database systems)](http://en.wikipedia.org/wiki/Isolation_%28database_systems%29#Read_phenomena)

---

　　Isolation 的理想状态是：the result of Transaction A is invisible to Transaction B until Transaction A is completed。不过这么一来，只有 Serializable 级别才能满足要求，即 Transactions 是一个接一个地执行，不允许 Transactions 的并行。如果想要 Transactions 的并行，那么就不可能有绝对的 Isolation。为此，ANSI/ISO 制定的 SQL 标准给 Isolation 分了4个级别，由高到低分别是：

* Serializable
* Repeatable Read (Phantom Read)
* Read Committed (Nonrepeatable Read)
* Read Uncommitted (Dirty Read)

级别越高的，isolation 性越好，而低级别的 isolation 会有各种各样的并发问题 (如上面括号中所示)。下面一一介绍。

---

## 1. Read Uncommitted

　　Transaction 1 可以查看 Transaction 2 未提交的操作结果，这会导致 Dirty Read 的问题，如下图所示：

![][Dirty_Read]

Transaction 1 的执行的第二个 query 会读到 Transaction 2 中 update 的结果，如果 Transaction 2 rollback 的话，这个读到的数据明显是错误的。

---

## 2. Read Committed

　　如果我们强制 Transaction 1 只能读 Transaction 2 中已经 commit 的 update，就可以解决 Dirty Read 的问题。强制的手段是：每次 query（比如SELECT）时，都会获取当前数据库（或者可能只是 query 涉及的表）的一个 snapshot，query 从这个 snapshot中获得结果。没有 commit 的 update 不会在 snapshot 中出现，所以就不会被 query 到。  

　　这样允许 Transaction 2 并行执行，且不会影响 Transaction 1。当 Transaction 1 commit 的时候，DBMS 检测是否有冲突（比如 Transaction 1 也 update 了 Transaction 2 中 update 的 row），如果执行的结果等同于顺序执行 Transaction 1 和 Transaction 2，则认为没有冲突。  

　　但这样也会有问题：Nonrepeatable Read，即可能执行同一 query 两次而出现不同的结果，我们认为这是不符合一致性原则的。  

![][Nonrepeatable_Read]

---

## 3. Repeatable Read

　　解决 Nonrepeatable Read 问题的办法是给 Transaction 1 中 SELECT 涉及的行加一个 read lock。  

　　锁的排斥功能很明确：read locks 不会 block read locks，只 block write locks；write locks block both read locks and write locks。  

　　不过会有新的问题：Phantom Read。

![][Phantom_Read]

当 Transaction 1 执行一个 range query（范围查询，如 like, between 等）时，只会为涉及到的 row 加 read lock，如果插入一个新 row 在 range 之内，第二次 range query 还是会被读出。

---

## 4. Serializable

　　强制 Transactions 按顺序执行，所以 Transaction 之间不可能冲突。强制的手段是 place a read lock on every row the transaction read；同时，如果有 range query，还会添加一个 range lock。明显，Serializable 会耗费很多的 lock overhead。  

　　Serializable 相当于在 Transaction 1 开始时（而不是 query 开始时）给当前数据库（或是 Transaction 涉及的表）take a snapshot，Transaction 1 中的所有 query 都从这一个 snapshot 中获取结果。