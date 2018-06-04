---
layout: post
title: "Python: MySQLdb"
description: ""
category: Python
tags: [MySQL-client]
---
{% include JB/setup %}

## 1. `MySQLdb` Installation

From a thread of [Python 3 ImportError: No module named 'ConfigParser'](http://stackoverflow.com/a/14087705), I knew that `MySQL-python` does not currently support Python 3. Therefore I chose `MySQLdb` as my Python mysql-connector. 

The installation commands, as [another thread](http://stackoverflow.com/a/23978968) of the above post indicated, are:

```shell
sudo apt-get install python3-dev libmysqlclient-dev
sudo pip3 install mysqlclient
```

## 2. Tutorials

[Python3 mysqlclient-1.3.6 (aka PyMySQL) usage?](http://stackoverflow.com/a/29533407) listed 2 helpful tutorials:

- [Writing MySQL Scripts with Python DB-API, Paul DuBois](http://www.kitebird.com/articles/pydbapi.html)
- [MySQL Python tutorial](http://zetcode.com/db/mysqlpython/)

The last one is more enjoyable :-)

## 3. Password inside Python Code?

```python
con = MySQLdb.connect(host = "localhost", user = "foo", passwd = "bar", db = "baz")
```

Leaving password in code looks dangerous. However, passing parameter `read_default_file="/etc/mysql/my.cnf"` could not help maybe because Python has no permission to read my config file.

A safer way to handle this is to create a user with limited privileges:

```sql
GRANT ALL PRIVILEGES ON db_baz.* To 'user_foo'@'localhost' IDENTIFIED BY 'passwd_bar';
```

See [Create new user in MySQL and give it full access to one database](http://stackoverflow.com/a/1720254) for more explanation.

## 4. PyDev Issue: Unsolvable import of `MySQLdb.Error`

Even after you `import MySQLdb`, PyDev would still paste a red cross to any line where `MySQLdb.Error` is written. However, you can still run your code and `try-except` block works well. 

Some suggestions were given in [How do I handle an UnresolvedImport Eclipse (Python)](http://stackoverflow.com/questions/2451682/how-do-i-handle-an-unresolvedimport-eclipse-python). I didn't try all of them but this one works for me:

1. Window -> Preferences -> PyDev -> Interpreter - Python
1. Select the python interpreter in the upper pane
1. Remove
1. Advanced Auto Config (I have Python 2 and Python 3 both on my ubuntu; this operation could detect both versions and ask you to choose one)
1. Agree to everything

It looks like that you need to brutally refresh your building path to include `MySQLdb`.