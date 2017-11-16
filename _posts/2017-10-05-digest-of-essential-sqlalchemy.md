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

### 2.1 Inserting Data

```python
ins = cookies.insert().values(
    cookie_name="chocolate chip",
    cookie_recipe_url="http://some.aweso.me/cookie/recipe.html",
    cookie_sku="CC01",
    quantity="12",
    unit_cost="0.50"
)
print(str(ins))

# Output:
"""
INSERT INTO cookies
    (cookie_name, cookie_recipe_url, cookie_sku, quantity, unit_cost)
VALUES
    (:cookie_name, :cookie_recipe_url, :cookie_sku, :quantity, :unit_cost)
"""
```

Our supplied values have been replaced with `:column_name` in this SQL statement, which is how SQLAlchemy represents parameters displayed via the `str()` function. Parameters are used to help ensure that our data has been properly escaped, which mitigates security issues such as SQL injection attacks. 

The `compile()` method on the `ins` object returns a `SQLCompiler` object that gives us access to the actual parameters that will be sent with the query via the params attribute:

```python
print(ins.compile().params)

# Output:
"""
{
    'cookie_name': 'chocolate chip',
    'cookie_recipe_url': 'http://some.aweso.me/cookie/recipe.html',
    'cookie_sku': 'CC01',
    'quantity': '12',
    'unit_cost': '0.50'
}
"""
```

To execute this query:

```python
result = connection.execute(ins)
```

We can also get the ID of the record we just inserted by accessing:

```python
result.inserted_primary_key
```

Another way of executing:

```python
ins = cookies.insert()
result = connection.execute(ins,
    cookie_name="chocolate chip",
    cookie_recipe_url="http://some.aweso.me/cookie/recipe.html",
    cookie_sku="CC01",
    quantity="12",
    unit_cost="0.50"
)
```

It's also possible to pass a list of records to `execute`:

```python
inventory_list = [
    {
        'cookie_name': 'peanut butter',
        'cookie_recipe_url': 'http://some.aweso.me/cookie/peanut.html',
        'cookie_sku': 'PB01',
        'quantity': '24',
        'unit_cost': '0.25'
    },
    {
        'cookie_name': 'oatmeal raisin',
        'cookie_recipe_url': 'http://some.okay.me/cookie/raisin.html',
        'cookie_sku': 'EWW01',
        'quantity': '100',
        'unit_cost': '1.00'
    }
]

result = connection.execute(ins, inventory_list)
```

When the `Table` object is not initially known, we can use top-level function `ins = insert(table)` instead of `ins = table.insert()`:

```python
from sqlalchemy import insert

ins = insert(cookies).values(
    cookie_name="chocolate chip",
    cookie_recipe_url="http://some.aweso.me/cookie/recipe.html",
    cookie_sku="CC01",
    quantity="12",
    unit_cost="0.50"
)
```

For example, our company might run two separate divisions, each with its own separate inventory tables. Using the `insert` function above would allow us to use one statement and just swap the tables.

### 2.2 Querying Data

```python
from sqlalchemy.sql import select

s = select([cookies])
rp = connection.execute(s)  # ResultProxy
results = rp.fetchall()
```

The `select` method expects a list of columns to select; however, for convenience, it also accepts `Table` objects and selects all the columns on the table. 

It is also OK to use `s = table.select()`.

#### 2.2.1 `ResultProxy`

```python
results = rp.fetchall()

first_row = results[0]  # first row
first_row[1]  # access column by index
first_row.cookie_name  # access column by name
first_row[cookies.c.cookie_name]  # access column by `Column` object
```

```python
s = select([cookies.c.cookie_name, cookies.c.quantity])
rp = connection.execute(s)
print(rp.keys())  # column names

# output:
#   ['cookie_name', 'quantity']
```

```python
record = rp.first()
print(record.items())  # A list of `(column_name, value)`
```

#### 2.2.2 Ordering

```python
s = select([cookies.c.cookie_name, cookies.c.quantity])
s = s.order_by(cookies.c.quantity)

from sqlalchemy import desc
s = s.order_by(desc(cookies.c.quantity))
```

#### 2.2.3 Limiting

```python
s = select([cookies.c.cookie_name, cookies.c.quantity])
s = s.order_by(cookies.c.quantity)
s = s.limit(2)
```

#### 2.2.4 Built-In SQL Functions and Labels

SQLAlchemy can also leverage SQL functions found in the backend database. Two very commonly used database functions are `SUM()` and `COUNT()`. To use these functions, we need to import the `sqlalchemy.sql.func` module where they are found.

```python
from sqlalchemy.sql import func

s = select([func.sum(cookies.c.quantity)])
rp = connection.execute(s)
print(rp.scalar())  # `scalar()` returns a single value if a query results in a single record with one column.
```

```python
s = select([func.count(cookies.c.cookie_name)])
rp = connection.execute(s)
record = rp.first()
print(record.keys())  # ['count_1']
print(record.count_1)
```

The `COUNT()` column name is autogenerated and is commonly `<func_name>_<position>`. This column name is annoying and cumbersome. Thankfully, SQLAlchemy provides a way to fix this via the `label()` function, which could give us a more useful name to this column.

```python
s = select([func.count(cookies.c.cookie_name).label('inventory_count')])
rp = connection.execute(s)
record = rp.first()
print(record.keys())  # ['inventory_count']
print(record.inventory_count)
```

#### 2.2.5 Filtering

```python
s = select([cookies]).where(cookies.c.cookie_name == 'chocolate chip')

s = select([cookies]).where(cookies.c.cookie_name.like('%chocolate%'))
```

#### 2.2.6 `ClauseElement`

`ClauseElement`s are just an entity we use in a clause, and they are typically columns; however, `ClauseElement`s also come with many methods just like `like` above.

- `between(left, right)`
- `concat(column_two)`: Concatenate column with column_two
- `distinct()`
- `in_([list])`
- `is_(None)`
- `contains(string)`
- `startswith(string)`
- `endswith(string)`
- `like(string)`
- `ilike(string)`: case-insensitive

There are also negative versions of these methods, such as `notlike()` and `notin_()`. The only exception to the `not<method>` naming convention is the `isnot()` method, which also drops the underscore.

If we don’t use one of the methods listed, then we will have an operator in our `where` clauses, e.g. `==`. 

#### 2.2.7 Operators

`== None` will be converted to `IS NULL`.

`+`， `-`， `*`, `/` can be used to do colum-wise arithmetic：

```python
from sqlalchemy import cast
s = select([cookies.c.cookie_name, 
            cast(cookies.c.quantity * cookies.c.unit_cost,
                 Numeric(12,2)).label('inv_cost')])

# Cast() is a function that allows us to convert types
```

`+` can also be used to concatenate a string to all values of a column:

```python
s = select([cookies.c.cookie_name, 'SKU-' + cookies.c.cookie_sku])
for row in connection.execute(s):
    print(row)

# Output:
"""
('chocolate chip', 'SKU-CC01')
('dark chocolate chip', 'SKU-CC02')
('peanut butter', 'SKU-PB01')
('oatmeal raisin', 'SKU-EWW01')
"""
```

`AND`, `OR` and `NOT` are supported by `&`, `|` and `~`. However, the precedence rules need special care. E.g. `A < B & C < D` is actually `A < (B & C) < D`. USe conjuncations in such cases.

#### 2.2.8 Conjunctions

`AND`, `OR` and `NOT` are also supported by `and_()`, `or_()` and `not_()`:

```python
from sqlalchemy import and_, or_, not_

s = select([cookies]).where(
    and_(
        cookies.c.quantity > 23,
        cookies.c.unit_cost < 0.40
    )
)

s = select([cookies]).where(
    or_(
        cookies.c.quantity.between(10, 50),
        cookies.c.cookie_name.contains('chip')
    )
)
```

### 2.3 Updating Data

```python
from sqlalchemy import update

u = update(cookies).where(cookies.c.cookie_name == "chocolate chip")
u = u.values(quantity=(cookies.c.quantity + 120))

result = connection.execute(u)

print(result.rowcount)  # print how many rows were updated
```

### 2.4 Deleting Data

```python
from sqlalchemy import delete

u = delete(cookies).where(cookies.c.cookie_name == "dark chocolate chip")

result = connection.execute(u)

print(result.rowcount)  # print how many rows were deleted
```

### 2.5 Joins

Typically, `select(table.c.column)` would genereate an SQL statement `SELECT table.column FROM table`. We can apply `select(table.c.column).select_from('XXX')` to set the `FROM` clause to `FROM XXX`. This can be used together with `joins`.

```python
columns = [orders.c.order_id, users.c.username, users.c.phone,
           cookies.c.cookie_name, line_items.c.quantity,
           line_items.c.extended_cost]
cookiemon_orders = select(columns)
cookiemon_orders = cookiemon_orders.select_from(orders.join(users).join(line_items).join(cookies)).where(users.c.username == 'cookiemon')

result = connection.execute(cookiemon_orders).fetchall()

for row in result:
    print(row)
```

The SQL generated is like:

```sql
SELECT orders.order_id, users.username, users.phone, cookies.cookie_name, line_items.quantity, line_items.extended_cost 
FROM users 
     JOIN orders ON users.user_id = orders.user_id 
     JOIN line_items ON orders.order_id = line_items.order_id 
     JOIN cookies ON cookies.cookie_id = line_items.cookie_id
WHERE users.username = 'cookiemon'
```

Similarly, we have `outjoin`:

```python
columns = [users.c.username, func.count(orders.c.order_id)]
all_orders = select(columns)
all_orders = all_orders.select_from(users.outerjoin(orders))
# SQLAlchemy knows how to join the users and orders tables because of the foreign key defined in the orders table.
all_orders = all_orders.group_by(users.c.username)

result = connection.execute(all_orders).fetchall()

for row in result:
    print(row)
```

### 2.6 Aliases

Suppose we have a table:

```python
employee_table = Table(
    'employee', metadata,
    Column('id', Integer, primary_key=True),
    Column('manager', None, ForeignKey('employee.id')),
    Column('name', String(255)))
```

and we want to query:

```sql
SELECT employee.name
FROM employee, employee AS manager
WHERE employee.manager_id = manager.id
      AND manager.name = 'Fred'
```

We can do:

```python
manager = employee_table.alias('mgr')
stmt = select([employee_table.c.name]).where(and_(employee_table.c.manager_id==manager.c.id, manager.c.name=='Fred'))
```

the statement generated is:

```sql
SELECT employee.name
FROM employee, employee AS mgr
WHERE employee.manager_id = mgr.id AND mgr.name = 'Fred'
```

SQLAlchemy can also choose the alias name automatically, which is useful for guaranteeing that there are no name collisions:

```python
# manager = employee_table.alias('mgr')
# You never used the string 'mgr' in your python code so you don't have to care what it is.
manager = employee_table.alias()
```

### 2.7 Grouping

```python
columns = [users.c.username, func.count(orders.c.order_id)]
all_orders = select(columns)
all_orders = all_orders.select_from(users.outerjoin(orders))
all_orders = all_orders.group_by(users.c.username)

result = connection.execute(all_orders).fetchall()

for row in result:
    print(row)
```

### 2.8 Chaining Clauses

E.g.

```python
columns = [orders.c.order_id, users.c.username, users.c.phone]
joins = users.join(orders)

cust_orders = select(columns)
cust_orders = cust_orders.select_from(joins)

cust_orders = cust_orders.where(users.c.username == cust_name)
cust_orders = cust_orders.where(orders.c.shipped == shipped)  # Chain another .where() method
```

Chained `.where()` generates `AND` logic.

It's implementation:

```python
# ----- https://github.com/zzzeek/sqlalchemy/blob/master/lib/sqlalchemy/sql/base.py#L41 ---- #

@util.decorator
def _generative(fn, *args, **kw):
    """Mark a method as generative."""

    self = args[0]._generate()
    fn(self, *args[1:], **kw)
    return self
```

```python
# ----- https://github.com/zzzeek/sqlalchemy/blob/master/lib/sqlalchemy/sql/selectable.py#L3164 ----- #

class Select(HasPrefixes, HasSuffixes, GenerativeSelect):
    @_generative
    def where(self, whereclause):
        """return a new select() construct with the given expression added to
        its WHERE clause, joined to the existing clause via AND, if any.
        """

        self.append_whereclause(whereclause)

    def append_whereclause(self, whereclause):
        """append the given expression to this select() construct's WHERE
        criterion.
        The expression will be joined to existing WHERE criterion via AND.
        This is an **in-place** mutation method; the
        :meth:`~.Select.where` method is preferred, as it provides standard
        :term:`method chaining`.
        """

        self._reset_exported()
        self._whereclause = and_(
            True_._ifnone(self._whereclause), whereclause)
```

### 2.9 Raw Queries

It still returns a `ResultProxy`:

```python
result = connection.execute("select * from orders").fetchall()

print(result)
```

While I rarely use a full raw SQL statement, I will often use small `text` snippets to help make a query clearer.

```python
from sqlalchemy import text

stmt = select([users]).where(text("username='cookiemon'"))

print(connection.execute(stmt).fetchall())
```

## Chapter 3 - Exceptions and Transactions

### 3.1 Exceptions

Most common ones are `AttributeError`s and `IntegrityError`s

- `AttributeError` often occurs when you attempt to access an attribute that doesn’t exist.
- `IntegrityError` occurs when we try to do something that would violate the constraints configured on a Column or Table.

### 3.2 Transactions

```python
transaction = connection.begin()

try:
    connection.execute(...)
    connection.execute(...)
    connection.execute(...)

    transaction.commit()
except IntegrityError as error:
    transaction.rollback()
    print(error)
```

## Chapter 4 - Testing

This chapter covers how to perform functional tests against a database, and how to mock out SQLAlchemy queries and connections.

你记住 url 可以用 `'sqlite:///:memory:'` 这样的纯 in-memory 的数据库就可以了。剩下的无非是动态创建表、添加测试数据之类的，并没有什么简单的方法，setup 的代码量还是会远超测试逻辑本身。

另外 python 3 的 `unittest` 自带 mock，需要用的时候再研究。

```python
from unittest import mock
```

## Chapter 5 - Reflection

