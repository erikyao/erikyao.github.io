---
layout: post
title: "Sqlmap Namespace"
description: ""
category: iBatis
tags: [iBatis-101]
---
{% include JB/setup %}

　　若设置了 `useStatementNamespaces="true"`，如：

```xml
<sqlMapConfig>
    <settings useStatementNamespaces="true" ... />
    ...
</sqlMapConfig>
```

那么，在执行 this.getSqlMapClientTemplate().queryForObject(statement, params); 时，statement 应该是 "namespace.operation"；此时，隶属不同 sqlmap 下的 两个 operation 就可以同名了

　　比如有 ActDao 和 LotDao。Act.xml 的配置是：

```xml
<sqlMap namespace="Act">
    <select id="getMax" resultClass="Integer">
        ...
    </select>
</sqlMap>
```

Lot.xml 的配置是：

```xml
<sqlMap namespace="Lot">
    <select id="getMax" resultClass="Integer">
        ...
    </select>
</sqlMap>
```

那么调用方式应该是：

```java
ActDao.getSqlMapClientTemplate().queryForObject("Act.getMaxPK");
LotDao.getSqlMapClientTemplate().queryForObject("Lot.getMaxPK");
```

-----

　　用类名（带包名）来做 namespace 是个很好的做法，比如：

```xml
<sqlMap namespace="com.xxx.xxx.xxx.backend.activity.po.Act">
```

这样一来，我们可以加一个父级方法：

```java
protected String getStatementById(String id) {
    String statement = clazz.getName() + "." + id;
    return statement;
}
```



