---
layout: post
title: "SQL: Autocommit does not guarantee immediate committing"
description: ""
category: SQL
tags: [Autocommit]
---
{% include JB/setup %}

If you just google, you may find _**autocommit**_ a vaguely defined term.

[Wikipedia: Autocommit](https://en.wikipedia.org/wiki/Autocommit)：

> Each individual database interaction (i.e., each SQL statement) submitted through the database connection in autocommit mode will be executed in its own transaction that is implicitly committed. A SQL statement executed in autocommit mode cannot be rolled back.

[MySQL :: MySQL 5.6 Reference Manual :: 14.5.2.2 autocommit, Commit, and Rollback](https://dev.mysql.com/doc/refman/5.6/en/innodb-autocommit-commit-rollback.html):

> In InnoDB, all user activity occurs inside a transaction. If autocommit mode is enabled, each SQL statement forms a single transaction on its own. By default, MySQL starts the session for each new connection with autocommit enabled, so MySQL does a commit after each SQL statement if that statement did not return an error.

Despite all these statements, you may only care one question: will there be an automatically created transaction committed _**IMMEDIATELY**_ after I enter a query and then hit the ENTER in console, or my interpreter run over a statement like `session.run('query-goes-here')`? The answer is **NO**. Look carefully. **NO**.

Let's find a better explanation for this term.

[JSR-000221 JDBC 4.3 Maintenance Release 3 Specification - 10.1 Transaction Boundaries and Autocommit](http://download.oracle.com/otndocs/jcp/jdbc-4_3-mrel3-spec/index.html):

> Enabling auto-commit causes a transaction commit after each individual SQL statement as soon as that statement is complete. The point at which a statement is considered to be “complete” depends on the type of SQL statement as well as what the application does after executing it:  
> <br/>
> - For Data Manipulation Language (DML) statements such as `Insert`, `Update`, `Delete`, and DDL statements, the statement is complete as soon as it has finished executing.  
> - For `Select` statements, the statement is complete when the associated result set is closed.  
> - For `CallableStatement` objects or for statements that return multiple results, the statement is complete when all of the associated result sets have been closed, and all update counts and output parameters have been retrieved.  

Take `Insert` for example. The question now is: does the returning of my function call `session.run('insert-query')` mean my `insert-query` is "complete"? No, because its underlying implememtation might be a message queue and asynchronous execution (and the return result is lazily initialized.) If your programme just exits before `insert-query` is "complete", your data will not be inserted at all and you may blame autocommit.

Always manage your own transactions in your client programmes.