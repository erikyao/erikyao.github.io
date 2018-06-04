---
layout: post
title: "How to rename MySQL databases or tables?"
description: ""
category: MySQL
tags: []
---
{% include JB/setup %}

场景：我有一套老的数据，比如 2015 年发布的 `db`，现在 2016 年发布了新的数据，它的 dump file 里还是用的老的 database name `db`，我想把这两套数据都存在数据库里。

- 方案一：`db_2015` vs `db_2016`，两套数据库
- 方案二：`db.tb_2015` vs `db.tb_2016`，一套数据库，两套表

这时我就需要先把老的 database 或是 table 来 rename 一下。

其实 rename database 和 rename table 用的都是同一个命令 `RENAME TABLE tb_old TO tb_new`，因为 table name 是可以带上 database name 的，所以你可以顺带把 database name 也改掉，或者只修改 database name。

- 方案一的思路：`RENAME TABLE db.tb TO db_2015.tb`
- 方案二的思路：`RENAME TABLE db.tb TO db.tb_2015`

## Rename databases

需要注意的是，你必须先 `create database db_2015` 才能 rename to `db_2015`。

批量修改 `db` 里所有 table 的 database name：

```shell
for TB in `mysql -u root -s -N -e "show tables from db"` do 
    mysql -u root -s -N -e "rename table db.${TB} to db_2015.${TB}"
done
```

此时原来的 `db` 就成了一个 empty database，这样相当于是 rename 了 database 了。

如果你有多个 database 要 rename，可以用：

```shell
DBNAMES="db_a db_b db_c"

for DB in $DBNAMES; do
    mysql -u root -s -N -e "create database ${DB}_2015"; 
    for TB in `mysql -u root -s -N -e "show tables from ${DB}"`; do 
        mysql -u root -s -N -e "rename table ${DB}.${TB} to ${DB}_2015.${TB}"; 
    done
done
```

注意这个写法不能 rename view；view 只能在同一个 database 里面被 rename，不能移动到另外一个 database 里。

## Rename tables with one database

rename tables 不需要先 create，也不会留下 empty table；而且适用于 view：

```shell
DBNAMES="db_a db_b db_c"

for DB in $DBNAMES; do
    for TB in `mysql -u root -s -N -e "show tables from ${DB}"`; do 
        mysql -u root -s -N -e "rename table ${DB}.${TB} to ${DB}.${TB}_2015"; 
    done
done
```