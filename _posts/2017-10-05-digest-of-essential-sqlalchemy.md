---
layout: post
title: "Digest of <i>Essential SQLAlchemy</i>"
description: ""
category: Python
tags: [Book]
---
{% include JB/setup %}

## Introduction to SQLAlchemy

SQLAlchemy provides two major modes of usage:

- SQLAlchemy Core: SQL Expression Language, a Pythonic way of representing common SQL statements and expressions, and is only a mild abstraction from the typical SQL language.
- SQLAlchemy ORM: Object Relational Mapper
    - Built on top of SQLAlchemy Core
    - Focused around the domain model of the application and leverages the **Unit of Work** pattern to maintain object state. 

By default, SQLAlchemy will support SQLite3 with no additional drivers; however, an additional database driver that uses the standard Python DBAPI ([PEP-249](https://www.python.org/dev/peps/pep-0249/)) specification is needed to connect to other databases.

To connect to a database, we need to create a SQLAlchemy **engine**. The SQLAlchemy engine creates a common interface to the database to execute SQL statements by wrapping a pool of database connections and a dialect in such a way that they can work together to provide uniform access to the backend database. E.g.,

```python
from sqlalchemy import create_engine

engine = create_engine('postgresql+psycopg2://username:password@localhost:5432/mydb')
```

Note that I use `postgresql+psycopg2` as the engine and dialect components of the connection string, even though using only `postgres` will work. Better to be explicit instead of implicit.

Use `pool_recycle` to define how often to recycle the connections (by default, MySQL closes connections idle for more than 8 hours):

```python
engine = create_engine('mysql+pymysql://cookiemonster:chocolatechip@mysql01.monster.internal/cookies', pool_recycle=3600)
```

Once we have an engine initialized, we are ready to actually open a connection to the database. That is done by calling the `connect()` method on the engine as shown here:

```python
connection = engine.connect()
```

## Chapter 1 - Schema and Types

In order to provide access to the underlying database, SQLAlchemy needs a representation of the tables that should be present in the database. We can do this in one of three ways:

- Using user-defined Table objects
- Using declarative classes that represent your tables
- Inferring them from the database

This chapter focuses on the first of these, as that is the approach used with SQLAlchemy Core; we'll cover the other two options in later chapters.

### 1.1 Types

There are four categories of types we can use inside of SQLAlchemy:

- SQLAlchemy Generic
- SQL standard
- Vendor-specific
- User-defined

SQLAlchemy generic types hide minor details in backend databases from you. E.g., some databases don't support a `BOOLEAN` type and use `SMALLINT` instead. In SQLAlchemy, there is only one `BOOLEAN` type and it works for all these databases.

| SQLAlchemy Generic | Python               | SQL                             |
|--------------------|----------------------|---------------------------------|
| `BigInteger`       | `int`                | `BIGINT`                        |
| `Boolean`          | `bool`               | `BOOLEAN` or `SMALLINT`         |
| `Date`             | `datetime.date`      | `DATE` (SQLite: `STRING`)       |
| `DateTime`         | `datetime.datetime`  | `DATETIME` (SQLite: `STRING`)   |
| `Enum`             | `str`                | `ENUM` or `VARCHAR`             |
| `Float`            | `float or Decimal`   | `FLOAT` or `REAL`               |
| `Integer`          | `int`                | `INTEGER`                       |
| `Interval`         | `datetime.timedelta` | `INTERVAL` or `DATE` from epoch |
| `LargeBinary`      | `byte`               | `BLOB` or `BYTEA`               |
| `Numeric`          | `decimal.Decimal`    | `NUMERIC` or `DECIMAL`          |
| `Unicode`          | `unicode`            | `UNICODE` or `VARCHAR`          |
| `Text`             | `str`                | `CLOB` or `TEXT`                |

SQL standard types are available both within `sqlalchemy` and `sqlalchemy.types` module and, to distinguish from the generic types, they are all in capital letters. E.g., `CHAR` and `NVARCHAR`.

Vendor-specific types are available within `sqlalchemy.dialects.xxx` modules where `xxx` is the database name. Vendor-specific types are also all in capital letters. E.g.:

```python
from sqlalchemy.dialects.postgresql import JSON
```

### 1.2 Metadata

Metadata is used to tie together the database structure so it can be quickly accessed inside SQLAlchemy. 

All Table objects associated with the same `metadata` object can be accessed via `metadata.tables`, which is a dictionary. 

Read operations are thread-safe; however, table construction is not completely thread-safe. 

### 1.3 Tables

A full in-memory SQLite example:

```python
from datetime import datetime
from sqlalchemy import MetaData, Table, Column, Integer, Numeric, String, DateTime, ForeignKey, create_engine


metadata = MetaData()

cookies = Table('cookies', metadata,
    Column('cookie_id', Integer(), primary_key=True),
    Column('cookie_name', String(50), index=True),
    Column('cookie_recipe_url', String(255)),
    Column('cookie_sku', String(55)),
    Column('quantity', Integer()),
    Column('unit_cost', Numeric(12, 2))
)

users = Table('users', metadata,
    Column('user_id', Integer(), primary_key=True),
    Column('customer_number', Integer(), autoincrement=True),
    Column('username', String(15), nullable=False, unique=True),
    Column('email_address', String(255), nullable=False),
    Column('phone', String(20), nullable=False),
    Column('password', String(25), nullable=False),
    Column('created_on', DateTime(), default=datetime.now),
    Column('updated_on', DateTime(), default=datetime.now, onupdate=datetime.now)
)

orders = Table('orders', metadata,
    Column('order_id', Integer(), primary_key=True),
    Column('user_id', ForeignKey('users.user_id'))
)

line_items = Table('line_items', metadata,
    Column('line_items_id', Integer(), primary_key=True),
    Column('order_id', ForeignKey('orders.order_id')),
    Column('cookie_id', ForeignKey('cookies.cookie_id')),
    Column('quantity', Integer()),
    Column('extended_cost', Numeric(12, 2))
)

engine = create_engine('sqlite:///:memory:')

metadata.create_all(bind=engine)
```

By default, `create_all` will not attempt to re-create tables that already exist in the database, and it is safe to run multiple times. 

#### 1.3.1 Primary Keys

The above example uses column keyword arguments to define table constructs and constraints; however, it is also possible to declare them outside of a `Column` object. This is critical when you are working with an existing database.

E.g., prime keys can be defined via `Column(..., primary_key=True)` or `Table(..., PrimaryKeyConstrain(...))`.

```python
from sqlalchemy import PrimaryKeyConstraint


my_table = Table('mytable', metadata,
    Column('id', Integer, primary_key=True),
    Column('version_id', Integer, primary_key=True),  # composite primary key
    Column('data', String(50))
)

# ----- IS EQUIVALENT TO ----- #

my_table = Table('mytable', metadata,
    Column('id', Integer),
    Column('version_id', Integer),
    Column('data', String(50)),
    PrimaryKeyConstraint('id', 'version_id', name='mytable_pk')  # `name` enables explicit access to this constraint
)

mytable.create(bind=engine)
```

#### 1.3.2 Unique and check Constraints

Similarly on unique constraints and check constraints:

```python
from sqlalchemy import UniqueConstraint, CheckConstraint


mytable = Table('mytable', meta,
    Column('col1', Integer, unique=True),
    Column('col2', Integer, CheckConstraint('col2>5')),
)

# ----- IS EQUIVALENT TO ----- #

mytable = Table('mytable', meta,
    Column('col1', Integer),
    Column('col2', Integer),

    UniqueConstraint('col1', name='uix_1')  # `name` is optional
    CheckConstraint('col2 > 5', name='check1')
)

mytable.create(bind=engine)
```

Composite check constraints are possible, e.g. `CheckConstraint('col2 > col3 + 5')`.

#### 1.3.3 Indices

Indices can be created in 3 ways:

- ① `Column(..., index=True)` (This index will have an auto-generated name "ix_&lt;column label&gt;")
- ② Inside a `Table(...)` statement
- ③ Outside a `Table(...)` statement

```python
mytable = Table('mytable', meta,
    Column('col1', Integer, index=True),  # ①
    Column('col2', Integer, index=True, unique=True),  # ①

    Column('col3', Integer),
    Column('col4', Integer),

    Column('col5', Integer),
    Column('col6', Integer),

    # Composite Indices
    Index('idx_col34', 'col3', 'col4'),  # ②
    Index('idx_col56', 'col5', 'col6', unique=True)  # ②

    Column('col7', Integer),
    Column('col8', Integer),

    Column('col9', Integer),
    Column('col10', Integer),
)

Index('idx_col78', mytable.c.col7, mytable.c.col8)  # ③
Index('myindex', mytable.c.col9, mytable.c.col10, unique=True)  # ③

mytable.create(engine)
```

The `Index` object also supports its own `create()` method:

```python
i = Index('someindex', mytable.c.col5)
i.create(bind=engine)
```

#### 1.3.4 Foreign Keys

There are two ways to build a foreign key constraint `tb_A.col_x` $\Leftrightarrow$ `tb_B.col_y`:

```python
tb_A = Table('tb_A', metadata,
    Column('col_x', Integer, ForeignKey('tb_B.col_y'))
)

# ----- IS EQUIVALENT TO ----- # 

tb_A = Table('tb_A', metadata,
    Column('col_x', Integer),

    # Composite foreign keys are possible, so use a list of column IDs here
    ForeignKeyConstraint(['col_x'], ['tb_B.col_y'], name='fk_xy')
)
```

Using strings instead of an actual column allows us to separate the table definitions across multiple modules and not have to worry about the order in which our tables are loaded. This is because SQLAlchemy will only perform the resolution of that string to a table name and column the first time it is accessed. If we use hard references, such as `mytable.c.col9`, in our `ForeignKey` definitions, it will perform that resolution during module initialization and could fail depending on the order in which the tables are loaded.

## Chapter 2 - Working with Data via SQLAlchemy Core
