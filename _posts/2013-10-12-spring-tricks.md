---
layout: post
title: "Spring 小技巧"
description: ""
category: Spring
tags: []
---
{% include JB/setup %}

## SpringMVC Controller 如何返回 404？

```java
... {
    ...
    response.setStatus(404); 
    return null; // 404
}

... {
    ...
    return null; // 200，空白页面，reponse为空
}
```

## `PropertyPlaceholderConfigurer` 配置 `properties` 示例

单个 properties 文件用 `location` 属性

```xml
<bean id="daoPlaceholderConfigurer" class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">
      <property name="location" value="WEB-INF/config/db/connect.properties" />
      <property name="ignoreUnresolvablePlaceholders" value="true" />
</bean>
```

多个 properties 文件用 `locations`（注意复数）属性

```xml
<bean id="daoPlaceholderConfigurer" class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">
      <property name="locations">
            <list>
                  <value>WEB-INF/config/db/connect.properties</value>
                  <value>WEB-INF/config/db/connect_test.properties</value>
            </list>
      </property>
      <property name="ignoreUnresolvablePlaceholders" value="true" />
      <property name="order" value="2" />
</bean>
```

其中 `order` 属性代表 Configurer 加载顺序，而 `ignoreUnresolvablePlaceholders` 为是否忽略不可解析的 Placeholder，如配置了多个 `PropertyPlaceholderConfigurer`，则需设置为 `true`

## 使用 `<util:map>` 配置一个 `Map` 对象

```xml
<beans xmlns:util="http://www.springframework.org/schema/util"
    xsi:schemaLocation="http://www.springframework.org/schema/util http://www.springframework.org/schema/util/spring-util-3.0.xsd">
    <util:map id="clientPoolMap" map-class="java.util.HashMap" >
        <entry key="foo.com" value-ref="clientPool_foo" />
        <entry key="bar.com" value-ref="clientPool_bar" />
        <entry key="baz.net" value-ref="clientPool_baz" />
    </util:map>
</beans>
```

## 使用 `<util:constant static-field="">` 引用常量

```xml
<bean class="com.bar.foo.frontend.impl.ExchangeQuotaRuleFilter">
    <property name="targetTypes">
        <util:list>
            <util:constant static-field="com.bar.foo.po.Exchange.TYPE_ONCE_GOODS"/>
            <util:constant static-field="com.bar.foo.po.Exchange.TYPE_ONCE_COUPON"/>
        </util:list>
    </property>
</bean>
```

## 使用 Factory 来创建对象

如果 `factory-method` 是 static 的话，那么 class 直接写 Factory 类

`<bean class="">`: this is normally the actual implementation class of the bean being defined. However, if the bean is to be instantiated by invoking a static factory method instead of using a normal constructor, this will actually be the class name of the factory class.

```xml
<bean id="clientPool_foo"
    class="com.bar.foo.commons.newapi.ClientPoolFactory" factory-method="createClientPool" >
    <constructor-arg index="0" value="internal" />
    <constructor-arg index="1" value="2700" type="int" />
</bean>
```

如果 `factory-method` 非 static，需要配置一个 Factory 对象，再把 factory-bean ref 到这个 Factory 对象

## 使用 @Resource 来注入集合

`@Autowired` 对类型的要求过严，泛型对象的注入，比如你想给一个 `@Autowired Collection` 注入一个 `LinkedList` 什么的是不行的，这时候可以用 `@Resource`

具体说明见：[http://stackoverflow.com/questions/1363310/auto-wiring-a-list-using-util-schema-gives-nosuchbeandefinitionexception](http://stackoverflow.com/questions/1363310/auto-wiring-a-list-using-util-schema-gives-nosuchbeandefinitionexception "Autowired throws NoSuchBeanDefinitionException")

## junit 中 @Rollback 的用法

首先，需要一个 txManager

```xml
<tx:annotation-driven transaction-manager="transactionManager" />

<bean id="transactionManager"
    class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <property name="dataSource" ref="dataSource" />
</bean>
```

注意 txManager 的类型，club 的 ibatis + ddb 用 jdbc 的 txManager 是可以的。hibernate 的话，需要用 `HibernateTransactionManager`

然后，重点：

```java
public class CouponDaoImplTest extends AbstractTransactionalJUnit4SpringContextTests  { ... }
```

TestCase 的父类一定要是 `AbstractTransactionalJUnit4SpringContextTests`，用 `AbstractJUnit4SpringContextTests` 的话，`@Rollback` 怎么试也试不出来……

加各种注解，最终形态形如：

```java
@RunWith(value=SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={
    "file:web/WEB-INF/config/spring/junit/datasource-junit.xml",
    "file:web/WEB-INF/config/spring/dao.xml"
})
// "transactionManager" 是 txManager 的 bean id；defaultRollback = true 任何情况都回滚
@TransactionConfiguration(transactionManager="transactionManager",defaultRollback=false)
public class CouponDaoImplTest extends AbstractTransactionalJUnit4SpringContextTests  {
    @Autowired
    protected CouponDao couponDao;

    @Test
    // @Transactional
    // @NotTransactional
    @Rollback(true)
    public void testUpdateCoupon() {
            Coupon c = couponDao.getCoupon(relatedId, relatedType, status, type, beginId);
            c.setStatus(Coupon.STATUS_USED);
            couponDao.updateCoupon(c);

            Coupon c2 = couponDao.getCoupon(relatedId, relatedType, Coupon.STATUS_USED, type, beginId);
    }
}
```

注意：

1. `AbstractTransactionalJUnit4SpringContextTests` 本身在整个类上有一个 `@Transactional`，所以我们自己的 TestCase 也是默认整个类 `@Transactional`，所有的 `@Test` 方法也是 `@Transactional` 的。若是某个 `@Test` 方法不需要事务支持，需要明确写上 `@NotTransactional`
2. 如果是 `@NotTransactional`，那么 `@Rollback(true)` 失效，无法回滚
3. 若在 `couponDao.updateCoupon(c);` 之后加断点，执行至断点时再跑去 ddb console 查询，你是看不到 update 的结果的。因为 `@Test` 方法 和 ddb console 是两个 tx，而且 `@Test` 方法的 tx 还没提交呢，你要是在 ddb console 看到了 update 的结果，那就是 *dirty read* 了
4. 但是在 `@Test` 方法 tx 内部，update 之后你再去 select ，是可以 select 到 update 的结果的
4. 如果是 `@NotTransactional`，`couponDao.updateCoupon(c);` 是立刻提交的，此时在断点挂住，跑去 ddb console 是可以看到 update 结果的

题外话：

* 将 log4j 配置文件放到 src/test 下（ie. TestCase 的 source folder，且这个 source folder 须是 classpath），这样 junit 运行时会就会打出 log4j 的日志了