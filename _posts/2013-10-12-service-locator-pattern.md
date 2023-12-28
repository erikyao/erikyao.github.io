---
category: Java
description: ''
tags:
- Article
- Java-DesignPattern
title: Service Locator Pattern
---

Martin Fowler 的 [Inversion of Control Containers and the Dependency Injection pattern](http://martinfowler.com/articles/injection.html) 中提到的。

-----

basic idea: service locator is an object that knows how to get hold of all of the services that an application might need.（我是否可以理解为一个应用可能有 DaoLocator 和 ServiceLocator 来分层管理，而不是只有一个 locator 管理全部组件？）

A well-known object that other objects can use to find common objects and services is known as a **registry**. Therefore, no doubt，ServiceLocator is a registry.

如果 Service 包含一个 DaoLocator，也可以实现注入的效果。

segregated (['segrigeitid], 种族隔离的) locator：如果不想把所有的 DaoLocator 接口都暴露给 XXXService，可以写成 DaoLocator implements AppleDaoLocator，然后 AppleService 只包含 AppleDaoLocator。

-----

如果要深入研究的话，先看下这篇 [Service Locator is an Anti-Pattern](http://blog.ploeh.dk/2010/02/03/ServiceLocatorisanAnti-Pattern).