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

For testing, we use [Chinook database](https://chinookdatabase.codeplex.com/) here:

> The Chinook data model represents a digital media store, including tables for artists, albums, media tracks, invoices and customers.

Schema can be found [here](http://www.sqlitetutorial.net/sqlite-sample-database/).

### 5.1 Reflecting Individual Tables

`Artists` table stores artists data. It is a simple table that contains only two columns, `ArtistId` and `Name`. Here we construct a `Table` object by reflection:

```python
from sqlalchemy import MetaData, create_engine, Table

metadata = MetaData()
engine = create_engine('sqlite:///Chinook_Sqlite.sqlite')

artist = Table('Artist', metadata, autoload=True, autoload_with=engine)
```

Testing:

```python
>>> artist.columns.keys()
['ArtistId', 'Name']

>>> from sqlalchemy import select
>>> s = select([artist]).limit(10)
>>> engine.execute(s).fetchall()
[(1, u'AC/DC'),
(2, u'Accept'),
(3, u'Aerosmith'),
(4, u'Alanis Morissette'),
(5, u'Alice In Chains'),
(6, u'Ant\xf4nio Carlos Jobim'),
(7, u'Apocalyptica'),
(8, u'Audioslave'),
(9, u'BackBeat'),
(10, u'Billy Cobham')]
```

Similarly:

```python
>>> album = Table('Album', metadata, autoload=True, autoload_with=engine)
>>> metadata.tables['album']
Table('album',
      MetaData(bind=None),
      Column('AlbumId', INTEGER(), table=<album>, primary_key=True, nullable=False),
      Column('Title', NVARCHAR(length=160), table=<album>, nullable=False),
      Column('ArtistId', INTEGER(), table=<album>, nullable=False),
      schema=None)
)
>>> album.foreign_keys
set()
```

Interestingly, the foreign key to the `Artist` table has not been reflected. This occurred because the two tables weren’t reflected at the same time, and the target of the foreign key was not present during the reflection. In an effort to not leave you in a semi-broken state, SQLAlchemy discarded the one-sided relationship. We can use what we learned in Chapter 1 to add the missing `ForeignKey` constraint, and restore the relationship:

```python
from sqlalchemy import ForeignKeyConstraint

album.append_constraint(
    ForeignKeyConstraint(['ArtistId'], ['artist.ArtistId'])
)
```

It would be quite a bit of work to repeat the reflection process for each individual table in our database. Fortunately, SQLAlchemy lets you reflect an entire database at once.

### 5.2 Reflecting a Whole Database

```python
>>> metadata.reflect(bind=engine)
>>> metadata.tables.keys()
dict_keys(['InvoiceLine', 'Employee', 'Invoice', 'album', 'Genre',
           'PlaylistTrack', 'Album', 'Customer', 'MediaType', 'Artist',
           'Track', 'artist', 'Playlist'])
```

`Album` and `Artist` tables are listed twice but with different case letters. This is due to that fact that SQLAlchemy reflects the tables as they are named, and in the Chinook database they are uppercase (the `Table` objects we created manually are in lowercase). Due to SQLite’s handling of case sensitivity, both the lower- and uppercase names point to the same tables in the database.

### 5.3 Query Building with Reflected Objects

As of version 1.0 of SQLAlchemy, we cannot reflect `CheckConstraints`, comments, or triggers. You also can’t reflect client-side defaults or an association between a sequence and a column. However, it is possible to add them manually using the methods described in Chapter 1.

## Chapter 6 - Defining Schema with SQLAlchemy ORM

You define schema slightly different when using the SQLAlchemy ORM because it is focused around user-defined data objects instead of the schema of the underlying database. 

- In SQLAlchemy Core, we created a metadata container and then declared a `Table` object associated with that metadata. 
- In SQLAlchemy ORM, we are going to define a class that inherits from a special base class generated by `declarative_base()`. 
    - `declarative_base()` can return a base class with a metadata container and a mapper that maps our class to a database table. ([Full API](http://docs.sqlalchemy.org/en/latest/orm/extensions/declarative/api.html#sqlalchemy.ext.declarative.declarative_base))
    - Instances of the ORM class are mapped to records in that table if they have been saved. 

### 6.1 Defining Tables via ORM Classes

A proper class for use with the ORM must do four things:

- Inherit from the base class generated by `declarative_base()`.
- Contain `__tablename__`, which is the table name to be used in the database.
- Contain one or more attributes that are `Column` objects.
- Ensure one or more attributes make up a primary key.

```python
from sqlalchemy import Table, Column, Integer, Numeric, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Cookie(Base):
    __tablename__ = 'cookies'

    cookie_id = Column(Integer(), primary_key=True)
    cookie_name = Column(String(50), index=True)
    cookie_recipe_url = Column(String(255))
    cookie_sku = Column(String(55))
    quantity = Column(Integer())
    unit_cost = Column(Numeric(12, 2))
```

```python
>>> Cookie.__table__
Table('cookies', MetaData(bind=None),
    Column('cookie_id', Integer(), table=<cookies>, primary_key=True, nullable=False),
    Column('cookie_name', String(length=50), table=<cookies>),
    Column('cookie_recipe_url', String(length=255), table=<cookies>),
    Column('cookie_sku', String(length=15), table=<cookies>),
    Column('quantity', Integer(), table=<cookies>),
    Column('unit_cost', Numeric(precision=12, scale=2), table=<cookies>), 
    schema=None)
```

Additional keywords work the same in both ORM and Core schemas:

```python
from datetime import datetime
from sqlalchemy import DateTime

class User(Base):
    __tablename__ = 'users'

    user_id = Column(Integer(), primary_key=True)
    username = Column(String(15), nullable=False, unique=True)
    email_address = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    password = Column(String(25), nullable=False)
    created_on = Column(DateTime(), default=datetime.now)
    updated_on = Column(DateTime(), default=datetime.now, onupdate=datetime.now)
```

Keys, constraints and indices can also be added by using `__table_args__` attribute:

```python
class SomeDataClass(Base):
    __tablename__ = 'somedatatable'
    __table_args__ = (ForeignKeyConstraint(['id'], ['other_table.id']),
                      CheckConstraint(unit_cost >= 0.00, name='unit_cost_positive'))
```

### 6.2 Relationships

The ORM uses a similar `ForeignKey` column to constrain and link the objects; however, it also uses a `relationship` directive to provide a property that can be used to access the related object. This does add some extra database usage and overhead when using the ORM; however, the pluses of having this capability far outweigh the drawbacks. 

```python
from sqlalchemy import ForeignKey, Boolean
from sqlalchemy.orm import relationship, backref

class Order(Base):
    __tablename__ = 'orders'

    order_id = Column(Integer(), primary_key=True)
    user_id = Column(Integer(), ForeignKey('users.user_id'))
    shipped = Column(Boolean(), default=False)

    user = relationship("User", backref=backref('orders', order_by=order_id))
```

- We can get the `User` object related to this `Order` object by accessing the `user` property. 
- This relationship also establishes an `orders` property on the `User` class via the `backref` keyword argument, which is ordered by the `order_id`. 

The relationship directive needs a **target class** for the relationship, and can optionally include a **back reference** to be added to target class. SQLAlchemy knows to use the `ForeignKey` we defined that matches the class we defined in the relationship. In the preceding example, the `ForeignKey(users.user_id)`, which has the `users` table’s `user_id` column, maps to the `User` class via the `__tablename__` attribute of `users` and forms the relationship.

It is also possible to establish a one-to-one relationship by `uselist=False` argument:

```python
class LineItem(Base):
    __tablename__ = 'line_items'

    ......

    cookie = relationship("Cookie", uselist=False)
```

### 6.3 Persisiting the Schema

你可以先 reflect 出来，修改一番然后再存回 database 里面（意义不大，不如直接改 schema，就举个例子），或是转存到另外一个 database 里。比如你可以从线上库 reflect 出来，然后转存到 in-memory 库做测试：

```python
from sqlalchemy import create_engine

engine = create_engine('sqlite:///:memory:')

Base.metadata.create_all(engine)
```

## Chapter 7 - Working with Data via SQLAlchemy ORM

### 7.1 The session

A session: 

- Wraps a database connection via an engine, 
- Provides an identity map for objects that you load via the session or associate with the session. 
    - The identity map is a cache-like data structure that contains a unique list of objects determined by the object’s table and primary key. 
- Wraps a transaction, and that transaction will be open until the session is committed or rolled back.

To create a new session, SQLAlchemy provides the `sessionmaker` class to ensure that sessions can be created with the same parameters throughout an application. The sessionmaker factory should be used just once in your application global scope, and treated like a configuration setting. 

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine('sqlite:///:memory:')

Session = sessionmaker(bind=engine)

session = Session()
```

### 7.2 Inserting Data

#### 7.2.1 `session.commit()`

```python
cc_cookie = Cookie(cookie_name='chocolate chip',
                   cookie_recipe_url='http://some.aweso.me/cookie/recipe.html',
                   cookie_sku='CC01',
                   quantity=12,
                   unit_cost=0.50)

session.add(cc_cookie)
session.commit()
```

When we create the instance of the `Cookie` class and then add it to the `session`, nothing is sent to the database. It’s not until we call `commit()` on the `session` that anything is sent to the database. When `commit()` is called, the following happens:

1. `INFO:sqlalchemy.engine.base.Engine:BEGIN (implicit)`
1. `INFO:sqlalchemy.engine.base.Engine:INSERT INTO cookies (cookie_name, cookie_recipe_url, cookie_sku, quantity, unit_cost) VALUES (?, ?, ?, ?, ?)`
1. `INFO:sqlalchemy.engine.base.Engine:('chocolate chip', 'http://some.aweso.me/cookie/recipe.html', 'CC01', 12, 0.5)`
1. `INFO:sqlalchemy.engine.base.Engine:COMMIT`

P.S. If you want to see the details of what is happening here, you can add `echo=True` to your `create_engine` statement as a keyword argument after the connection string. Make sure to only do this for testing, and don’t use `echo=True` in production!

First, a fresh transaction is started, and the record is inserted into the database. Next, the engine sends the values of our insert statement. Finally, the transaction is committed to the database, and the transaction is closed. This method of processing is often called the **Unit of Work** pattern.

#### 7.2.2 `session.flush()`

[Full API](http://docs.sqlalchemy.org/en/latest/orm/session_api.html#sqlalchemy.orm.session.Session.flush):

> Flush all the object changes to the database.  
> <br/>
> Writes out all pending object creations, deletions and modifications to the database as INSERTs, DELETEs, UPDATEs, etc. Operations are automatically ordered by the Session’s unit of work dependency solver.  
> <br/>
> Database operations will be issued in the current transactional context and **do not affect the state of the transaction**, unless an error occurs, in which case the entire transaction is rolled back. You may `flush()` as often as you like within a transaction to move changes from Python to the database’s transaction buffer.  
> <br/>
> For `autocommit` Sessions with no active manual transaction, `flush()` will create a transaction on the fly that surrounds the entire set of operations into the flush.

注意 `commit()` 是一个完整的 Unit of Work，包括完整的 transaction creation 和 commit；`flush()` 相当于是把当前已有的 operations append 到 transaction，但是并不会 commit。

```python
dcc = Cookie(cookie_name='dark chocolate chip', ...)
mol = Cookie(cookie_name='molasses', ...)

session.add(dcc)
session.add(mol)

session.flush()
# session.commit()
```

#### 7.2.3 `session.bulk_save_object()`

[Full API](http://docs.sqlalchemy.org/en/latest/orm/session_api.html#sqlalchemy.orm.session.Session.bulk_save_objects):

> Perform a bulk save of the given list of objects.  
> <br/>
> The bulk save feature allows mapped objects to be used as the source of simple INSERT and UPDATE operations which can be more easily grouped together into higher performing “executemany” operations; the extraction of data from the objects is also performed using a lower-latency process that ignores whether or not attributes have actually been modified in the case of UPDATEs, and also ignores SQL expressions.  
> <br/>
> **The objects as given are not added to the session** and no additional state is established on them, unless the `return_defaults` flag is also set, in which case primary key attributes and server-side default values will be populated.

```python
c1 = Cookie(cookie_name='peanut butter', ...)
c2 = Cookie(cookie_name='oatmeal raisin', ...)

session.bulk_save_objects([c1,c2])
session.commit()
```

注意，"object added to the session" 的一个后果是：比如说 `session.add(c1)` 后，`session` 会 update `c1` 的状态，比如 auto-generated primary key 会设置到 `c1` 的字段里。`bulk_save_object()` 并没有 add objects to session，所以你无法获取到更新后的属性，比如 `print(c1.cookie_id)` 就打不出任何值。

另外 `bulk_save_object()` 会快过 multiple `add()`

### 7.3 Querying Data

