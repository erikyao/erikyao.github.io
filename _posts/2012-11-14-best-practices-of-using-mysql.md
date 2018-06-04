---
layout: post
title: "MySQL 使用和优化基础"
description: ""
category: MySQL
tags: []
---
{% include JB/setup %}

## 1. 设计的总体原则 ##

### 1.1. 让数据库做擅长的事——存储，尽量不让数据库做运算，例如：

- `md5()`
- `order by rand()`

### 1.2. 评估：软硬件配置 / 操作类型（读为主或写为主或兼而有之）/ 访问量

### 1.3. 适当增加冗余

比如 `table_with_3_fields` 经常与 `table_with_17_fields` 做联结，不如直接和合并成一个 `table_with_20_fields`。`table_with_3_fields` 的数据冗余点也无所谓。  

但要控制字段数目，一般保持在 20-50 即可.

## 2. innodb 事务 & 锁 ##

### 2.1. 隔离级别 

学术上隔离级别的划分如下：

| 隔离级别 \ 读异常            | 脏读（Dirty Read） | 不可重复读（NonRepeatable Read） | 幻读（Phantom Read） |
|------------------------------|--------------------|----------------------------------|----------------------|
| 未提交读（Read Uncommitted） | √ 可能             | √ 可能                           | √ 可能               |
| 已提交读（Read Committed）   | × 不可能           | √ 可能                           | √ 可能               |
| 可重复读（Repeatable Read）  | × 不可能           | × 不可能                         | √ 可能               |
| 可串行化（Serializable ）    | × 不可能           | × 不可能                         | × 不可能             |

参见 [Isolation](/database/2009/12/25/isolation)

简而言之：

- 脏读：A dirty read occurs when a transaction is allowed to read data from a row that has been modified by another running transaction and not yet committed.

	> 比如：tx-A select row(id=1,data=2); tx-B update 成 row(id=1,data=3)，但未提交；但是 tx-A 第二次 select 居然能读到 row(id=1,data=3)。这明显是荒谬的

- 不可重复读：A non-repeatable read occurs, when during the course of a transaction, a row is retrieved twice and the values within the row differ between reads.

	> 比如：tx-A select row(id=1,data=2); tx-B update 成 row(id=1,data=3)，并提交；tx-A 第二次 select 读到 row(id=1,data=3)。在 tx-A 这一事务内部，连续两次 select 的数据不同，这是不太科学的。

- 幻读：A phantom read occurs when, in the course of a transaction, two identical queries are executed, and the collection of rows returned by the second query is different from the first.

	> 比如：tx-A select row(id>1)，一共有3 rows; tx-B insert 一条 row(id=2)，并提交；tx-A 第二次 select row(id>1) 能得到 4 rows。在 tx-A 这一事务内部，连续两次 select 出的集合的数量不同，这也是不太科学的。

innodb 的默认隔离级别是 Repeatable Read，但是实际上是可以防止幻读的。配置文件：

```ini
[mysqld]
transaction-isolation = REPEATABLE-READ
```

实际应用中，Read Uncommitted（有脏数据）和 Serializable（并发性太差）基本不予考虑

- 适用于 Repeatable Read 的场景：一致性要求较高，牺牲并发性能
- 适用于 Read Committed 的场景：一致性要求稍低，可以减少锁消耗，提高并发

### 2.2. InnoDB 事务应用注意事项

- 选择合适的事务隔离级别
- 尽量避免分布式事务（ddb 的话可以在 where 中加上 balance field 条件）
- 事务中拒绝长耗时的操作或外部调用，比如：开启事务/上传文件/写数据库/提交
- 事务保持短小，避免长事务，尽量用小事务改写

### 2.3. InnoDB 锁应用注意事项

- 更新语句的条件需要有合适的索引

	> 一般应用中最常用的应该是索引记录锁，又称行锁，在唯一性等值条件查询时会施加到索引，如果等值条件没有索引，会锁住整张表！（严重拖累性能）
    >   
	> 注意，select 不会加锁（BTW，select for update 会），所以行锁的施加场景如：update ... where field1=n，此时需保证 field1 有索引

- 避免对相同记录做大量并发写操作造成锁冲突

	> well, i made this mistake in Anniv15Lottery =。=

- 并发操作时，最好按相同次序来操作记录避免死锁。

	> 比如两个线程都是要操作 row(id=1) and row(id=2)，那么最好都按照相同的次序来操作，不要你在操作  row(id=1) 的时候我在操作 row(id=2)，这样只会增加死锁的风险。

- 少量锁异常，重试解决

## 3. 表字段设计 ##

### 关于数值 ###

- 精确浮点数，用 DECIMAL 替代 FLOAT 和 DOUBLE
- 尽量选择短数据类型，如取值为 [0, 80] 的整数，可以用 TINYINT UNSIGNED
- 不建议使用 ENUM、SET 类型，可使用 TINYINT 来代替

### 关于时间 ###

- 年，YEAR 类型
- 日期，DATE 类型
- 时间（精确到秒）建议使用 TIMESTAMP 类型，而非 DATETIME 类型。精度更高可以考虑使用 BIGINT 存储 UNIX TIMESTAMP。

### 关于 ip ###

- 建议使用 INT UNSIGNED 存储 IPV4
- 因为 MySQL 提供了函数给你，不用白不用……
	- `select INET_ATON('192.168.164.125') => 3232277629`  
    - `select INET_NTOA(3232277629) => '122.168.164.125'`  
    - ATON: Address TO Num, and vice vesa

### 关于 null ###

- 应尽量避免使用 null，因为：
	1. 很难进行查询优化；
	2. NULL 列加索引，需要额外空间
- 可利用 0、空串等设置默认值 ('' ≠ NULL)

### 关于大对象 ###

- 尽量不要用数据库存图片、文件类数据
- 尽量不用或少用 TEXT/BLOB 字段，若必须使用尽量拆分到单独的表，避免拖累主表
- TEXT 的处理性能低于 VARCHAR
    - IO 上可能引起跨页存储，可能会强制生成硬盘临时表
    - TEXT 本身比 VARCHAR 浪费更多的空间
    - 索引、排序都有局限
    - VARCHAR 最大 64K 容量，可满足大多数的需求

### 关于 VARCHAR ###

- VARCHAR 理论最大存储 65535 _**字节**_，实际存储量为 65532 字节（有3字节 VARCHAR 自己要用）。如果超过，根据 SQL_MODE 设置，有报错或自动转为 TEXT 类型等处理方式
- 其实 65535 是指 _**单行记录内所有 VARCHAR 字段字节数的上限**_ 是65535
- VARCHAR(N) 中 N 指字符长度
    - 若是 ascii，每个字符 1 字节，最大可以有 VARCHAR(65532)
    - 若是 gbk，每个字符 2 字节，最大可以有 VARCHAR(32766)
    - 若是 utf8，每个字符 3 字节，最大可以有 VARCHAR(21844)
- 对于 InnoDB 引擎，实际中就算是 TEXT/BLOB 也有可能不进行溢出；反之，即使是 VARCHAR 也可能发生溢出，进入 LOB 页

## 4. 索引 ##

### 4.1. 索引的实质

- index is ANOTHER TABLE
- index is SORTED
- index is a B+ tree
- 索引是对 key 排序后的另存的一张 key 的表。根据 index 的 row (i.e. a key) 可以直接定位到 table 的 row

### 4.2. 索引不是万能的

索引的功能在于：

- 改善数据查询
- 排序
- 覆盖数据避免回表（可看作是改善数据查询的一种）

索引不是越多越好，因为索引加速查询、减慢更新

### 4.3. 如何判断应该给哪些字段加索引？

- 访问频率高的字段必然是适合加索引的
- 数据区分度太小的字段不宜建索引，比如：gender 
- 数据区分度太小会导致索引的 Cardinality (集合的基数、集合的势，即集合中元素个数的多少) 过小
    - cardinality 简单的说就是你索引列的唯一值的个数，如果是复合索引就是唯一组合的个数。
    - cardinality 将会作为 mysql 优化器对语句执行计划进行判定时依据。如果唯一性太小，那么优化器会认为，这个索引对语句没有太大帮助，而不使用索引。
    - cardinality 越大，就意味着使用索引能排除越多的数据，执行也高效高越。

### 4.4. 索引覆盖

举例：

```sql
    SELECT Name FROM tbl WHERE UserID=?
    KEY IDX_UID_NAME(UserID,Name)
```

因为索引保存了 key 的值，所以这里 `SELECT name` 可以直接从索引中读到数据，避免了回表查询（即不用去读表的 row）

注意：

- 核心 SQL 需要考虑索引覆盖
- select 出很多字段的查询不宜做索引覆盖（否则联合索引过大）

### 4.5. 索引常见用法

- 对 WHERE、ORDER BY、GROUP BY、DISTINCT 字段建索引
- 索引字段的顺序根据区分区排，区分度大的放在前面
- 合理创建联合索引，避免冗余

	> 比如联合索引 (a,b,c) 可以起到以下三个索引的作用：(a),(a,b),(a,b,c)

- 对非常长的 VARCHAR 字段建索引时，可以添加一个冗余字段保存 crc32 或者 MD5 Hash 值，然后对这个 Hash 字段建索引；或者使用字符前缀索引，即：只对 VARCHAR 的前 n 个字符建索引，这样可以减小索引规模，进而减小索引 I/O

	> \`Name\` varchar(64) NOT NULL DEFAULT ''
	> KEY \`IDX_NAME\` (\`Name\`(10))
        
- 万精油战术：多使用 EXPLAIN 检查。注意避免 Using filesort、Using temporary

    > Using filesort: MySQL must do an extra pass to find out how to retrieve the rows in sorted order. The sort is done by going through all rows according to the join type and storing the sort key and pointer to the row for all rows that match the WHERE clause. The keys then are sorted and the rows are retrieved in sorted order  
    > <br/>
    > Using temporary: To resolve the query, MySQL needs to create a temporary table to hold the result. This typically happens if the query contains GROUP BY and ORDER BY clauses that list columns differently.   
    > <br/>
    > 更多 EXPLAIN 尽在 [EXPLAIN Output Format](http://dev.mysql.com/doc/refman/5.1/en/explain-output.html "EXPLAIN Output Format") 
    
- 控制索引个数及索引内字段数目（索引过大的话可能无法全部加载到内存，走后还是要走其他慢速的手段）

## 4.6. 无法使用索引的情形

- 查询条件里的索引列上有数学运算或函数运算。解决办法：让运算不接触索引列，比如：
        
	> `where id+1=10`  => `where id=(10-1)`
	> `where year(ctime)< 2007` => `where ctime < ‘2007-01-01’`

- 查询条件未包含复合索引的前缀字段

	> 假设有联合索引(a,b,c)，查询条件 where x=# and y=# 简写为 “(x,y)?”，那么：
	> 
	> * (a)? => 走索引(a) 
	> * (b)? => 不走索引
	> * (c)? => 不走索引
	> * (b,c)? => 不走索引
	> * (a,b)? => 走索引(a,b)
	> * (a,c)? => 走索引(a)
	> 
	> <br/>
    >     
	>  _题外话_：排序条件有类型的情况  
	>  
	>  假设有联合索引(a,b)，排序条件 where x=# order by y asc 简写为 “(x)?y↑”，那么：
	>  
	>  * a↑ => 排序走索引(a)
	>  * b↑ => 排序不走索引
	>  * (a>5)?a↑ => 排序走索引(a)
	>  * (a>5)?b↑ => 排序不走索引
	>  * (a=5)?b↑ => 排序走索引(a,b)
	>  * (a in (1,5))?b↑ => 排序不走索引 => 可改写为 [(a=1)?b↑ union all (a=5)?b↑]b↑
	>  * a↑b↑ => 排序走索引(a,b)
	>  * a↓b↓ => 排序走索引(a,b)
	>  * a↑b↓ => 排序不走索引
            
- 查询条件 `LIKE ‘%xxx%’` 不走索引，但是 `LIKE ‘xxx%’` 可以
- 查询条件为 NOT、<>、!= 的是不走索引的
- 查询条件里的字段类型与实际的表字段类型不匹配

### 4.7. 索引与联接

- 通常来讲，MySQL 的表联接只有 nest loop 一种可行方式
- 联接查询的所有条件都应当有合适的索引
- 一次联接查询对一张表只能使用一个索引，因此确定联接顺序非常重要。确定表联接顺序 => 确定表接入条件 => 确定需要的索引字段以及联合索引的字段顺序

	>  举例：select * from a,b,c where a.x = 123 and c.z = b.z  and a.y = c.y; 判断过程如下：
	> 
	> 1. (c.z = b.z) 和 (a.y = c.y) 无法确定，所以第一条件是 (a.x = 123)。如果有两个可确定的条件，比如 (a.x = 123)、(b.z = 456)，那么集合小的条件作为第一条件（对这一点不确定的话，在索引确定后应用 EXPLAIN 检验）。
	> 2. a 已经出来的话，那么 (a.y = c.y) 是第二条件，c 出来。
	> 3. 紧接着 (c.z = b.z) 是第三条件，b 出来。  
	> 
	> 所以表联接顺序是 a => c => b  
	> a 表联合索引的顺序是(x,y)，b 表索引是(z)，c 表联合索引的顺序是(y,z)

### 4.8. InnoDB 主键

- InnoDB 主键是聚簇索引，在二级索引上存储主键值
- 推荐独立于业务的自增列或全局 ID 做主键
- 尽量不用字符串做主键
- 一定要控制主键长度
    
	> 主键长度越长，单个索引页能存的索引条目就越少，索引页的数量就越多，导致索引数的层数就越多。索引树越深，I/O 消耗越多

- 尽量避免持续插入”随机”主键
- 尽量不用外键，用程序逻辑来控制

### 4.9. 索引 Tips

- 尽量避免顺序相似的联合索引，比如(a,b,c)、(a,b,d)。MySQL 不一定能从中选到最优的索引
- 分区表如果分区较多，查询尽可能带上分区字段，否则即使能够使用索引开销依然非常大。

	> yes, i've already met DDB
        
- 假设 InnoDB 表有 PK(a)，c、d 非主键，索引(c,d)可能比不上(c,d,a)有效

	> 这其实是 MySQL 比较二的一个地方。(c,d)在存储上其实就是(c,d,a)，但是你不显示说明索引是(c,d,a)的话，`SELECT a where b=# and c=#` 可能会回表查询！

- 索引字段应该有默认值，尽可能不要让含NULL的字段进入组合索引.
- 对于联合索引，MySQL 查询优化器每当遇到range类条件（>、<、between）就中止使用索引的后面部分

	> 但是 in 不是 range 类条件，所以可以把 between 改写为 in 来走索引，e.g.  
	> `where a between 1 and 3 and b = 2;` => using (a) only  
	> `where a in (1,2,3) and b = 2;` => using (a,b) both  

## 5. SQL 语句设计 ##

- 线上系统少用或不用存储过程/触发器
- 线上库禁止执行统计类等大 SQL 语句，一条大 SQL 可能会把整个数据库堵死
        
	> well, i'll never forget this.   
	> <br/>
	> 另外，count 的含义区分：
	>
	> - count(*) = count(1)
	> - count(1) = count(0)
	> - count(1) = count(100)
	> - count(*) != count(col)

- 将大 SQL 语句拆分为多个小 SQL
    
    > - 简单 SQL 的缓存命中率更高
    > - 减少锁表时间，特别是MyISAM

- UPDATE、DELETE 切忌使用 LIMIT
- SELECT/INSERT 必须显式的指明字段名称
- 尽量用 join 改写子查询；慎用子查询，因为 MySQL 对子查询的执行计划可能会坑爹……
- 如果逻辑允许，使用 union all 比 union 好
- 控制 OR 的个数，建议小于 200
    
    > - 同一字段的 or 查询，改写为 IN 的效率往往比 OR 高
    > - 不同字段的 or 查询，改写为 UNION 更好（因为 Merge Index 不够智能）

- limit m offset n 的 m 和 n 不能过大，越大越慢；分页推荐利用主键或唯一键定位