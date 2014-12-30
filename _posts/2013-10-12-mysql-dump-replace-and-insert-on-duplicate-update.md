---
layout: post
title: "MySQL dump, replace and insert-on-duplicate-update"
description: ""
category: MySQL
tags: [Database-101]
---
{% include JB/setup %}

## Dump

1. `--insert-ignore`: Insert rows with INSERT IGNORE.
2. `--replace`: Use REPLACE INTO instead of INSERT INTO.
3. `-t, --no-create-info`: Don't write table creation info.

## Replace Into

　　语法结构与 insert into 一样；MySQL 的实现是：on duplicated key, delete then insert  

## Insert on Duplicate Update

　　比如：`INSERT INTO table (a,b,c) VALUES (1,2,3) ON DUPLICATE KEY UPDATE c=c+1;`  

	参 [INSERT ... ON DUPLICATE KEY UPDATE Syntax](http://dev.mysql.com/doc/refman/5.0/en/insert-on-duplicate.html)

