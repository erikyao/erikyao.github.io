---
layout: post
title: "Digest of <i>Mocks Aren't Stubs</i>"
description: ""
category: TDD
tags: [Article]
---
{% include JB/setup %}

## Pre-reading ##

[The difference between stubs and mocks](http://ayende.com/Wiki/Rhino+Mocks+3.5.ashx?AspxAutoDetectCookieSupport=1#Thedifferencebetweenstubsandmocks)

> A **mock** is an object that we can set expectations on, and which will verify that the expected actions have indeed occurred.   
> A **stub** is an object that you use in order to pass to the code under test. You can setup expectations on it, so it would act in certain ways, but those expectations will never be verified. A stub's properties will automatically behave like normal properties, and you can't set expectations on them.  
> <br/>
> If you want to verify the behavior of the code under test, you will use a mock with the appropriate expectation, and verify that. If you want just to pass a value that may need to act in a certain way, but isn't the focus of this test, you will use a stub.  
> <br/>
> IMPORTANT: A stub will never cause a test to fail.

[RhinoMocks 3.5 AAA Model](http://web.archive.org/web/20101221112808/http://nermins.net/post/2008/08/22/RhinoMocks-35-AAA-Model.aspx)

> ... Put simply there is a difference between Mock and Stub objects and RhinoMocks recognizes that allowing us to write tests that better state their purpose.  
<br/>
> ... Mock objects are used to define expectations i.e: In this scenario I expect method A() to be called with such and such parameters. Mocks record and verify such expectations.  
> <br/>
> Stubs, on the other hand have a different purpose: they do not record or verify expectations, but rather allow us to “replace” the behavior, state of the “fake”object in order to utilize a test scenario.  

-----
-----

## Digest of this [article](http://martinfowler.com/articles/mocksArentStubs.html "Mocks Aren't Stubs") ##

### 1. Regular Tests 

how test results are verified: 

- state verification 
- behavior verification

xUnit tests follow a typical four phase sequence: 

1. setup
2. exercise (i.e. run the method or operation under test)
3. verify
4. teardown

During setup there are two kinds of object that we are putting together:

- object-under-test or system-under-test (we use SUT below)
- collaborator

_注_：很明显，应该对 collaborator 写 stub/mock

_注_：我们 mc 项目里的所谓的 mock，只能算是 stub，它只能提供 state verification

----------

### 2. Tests with Mock Objects

After the exercise I then do verification, which has two aspects. I run asserts against the SUT - much as before. However I also verify the mocks - checking that they were called according to their expectations.

The key difference here is how we verify that the order did the right thing in its interaction with the warehouse. With state verification we do this by asserts against the warehouse's state. Mocks use **behavior verification**, where we instead check to see if the order made the correct calls on the warehouse.

----------
### 3. The Difference Between Mocks and Stubs

The vocabulary for talking about this soon gets messy - all sorts of words are used: **stub**, **mock**, **fake**, **dummy**. For this article I'm going to follow the vocabulary of Gerard Meszaros's book.

Meszaros uses the term **Test Double** as the generic term for any kind of pretend object used in place of a real object for testing purposes. The name comes from the notion of a Stunt Double in movies. (One of his aims was to avoid using any name that was already widely used.) Meszaros then defined four particular kinds of double:


- Dummy objects are passed around but never actually used. Usually they are just used to fill parameter lists.
- Fake objects actually have working implementations, but usually take some shortcut which makes them not suitable for production (an in memory database is a good example).
- Stubs provide canned answers to calls made during the test, usually not responding at all to anything outside what's programmed in for the test. Stubs may also record information about calls, such as an email gateway stub that remembers the messages it 'sent', or maybe only how many messages it 'sent'.
- Mocks are what we are talking about here: objects pre-programmed with expectations which form a specification of the calls they are expected to receive.

Of these kinds of doubles, only mocks insist upon behavior verification. The other doubles can, and usually do, use state verification.

Meszaros refers to stubs that use behavior verification as a [Test Spy](http://xunitpatterns.com/Test%20Spy.html "Test Spy")

----------

### 4. Classical and Mockist Testing

Now I'm at the point where I can explore the second dichotomy: that between classical and mockist TDD. The big issue here is when to use a mock (or other double).

The classical TDD style is to use real objects if possible and a double if it's awkward to use the real thing. So a classical TDDer would use a real warehouse and a double for the mail service. The kind of double doesn't really matter that much.

A mockist TDD practitioner, however, will always use a mock for any object with interesting behavior. In this case for both the warehouse and the mail service.

Although the various mock frameworks were designed with mockist testing in mind, many classicists find them useful for creating doubles.

An important offshoot of the mockist style is that of Behavior Driven Development (BDD). 

----------

### 5. Choosing Between the Differences

The first thing to consider is the context. Are we thinking about an easy collaboration, such as order and warehouse, or an awkward one, such as order and mail service? 

... State versus behavior verification is mostly not a big decision. The real issue is between classic and mockist TDD. As it turns out the characteristics of state and behavior verification do affect that discussion, and that's where I'll focus most of my energy.

But before I do, let me throw in an edge case. Occasionally you do run into things that are really hard to use state verification on, even if they aren't awkward collaborations. A great example of this is a cache. The whole point of a cache is that you can't tell from its state whether the cache hit or missed - this is a case where behavior verification would be the wise choice for even a hard core classical TDDer. I'm sure there are other exceptions in both directions.

As we delve into the classic/mockist choice, there's lots of factors to consider, so I've broken them out into rough groups.

#### 5.1. Driving TDD

##### 5.1.1. Mockist TDD: outside-in

With this style you begin developing a story by writing your first test for the outside of your system, making some interface object your SUT

Once you have your first test running, the expectations on the mocks provide a specification for the next step and a starting point for the tests.

You first start by programming the UI using mock layers underneath. Then you write tests for the lower layer, gradually stepping through the system one layer at a time.

##### 5.1.2 Classic TDD: middle-out

Once you're green with test using stub, you replace the hard coded stub with a proper code, turing it an domain object.

You get the domain objects to do what you need and once they are working you layer the UI on top. A lot of people like this because it focuses attention on the domain model first, which helps keep domain logic from leaking into the UI.

#### 5.2. Fixture Setup

As a result I've heard both styles accuse the other of being too much work. Mockists say that creating the fixtures is a lot of effort, but classicists say that this is reused （而且可以用 @before） but you have to create mocks with every test （mock 的 expectation 每次都要调整）.

#### 5.3 Test Isolation

因为 buggy object 可能被 classicist 拿来做 collaborator，所以 bug 带来的 test failure 会被放大

mockist 则不会有这个问题，因为只有 buggy object 做 SUT 时才可能 test failure

classicist 较容易遇到 granularity 的问题，而 mockist 天生是 fine grained。但反过来说，mockist 在 intergration test 方面逊于 classicist

#### 5.4. Coupling Tests to Implementations

Changing the nature of calls to collaborators usually cause a mockist test to break.

需要考虑重构可能对 test case 造成的影响：collaborator 重构了，test case 还能不能跑？

This can be worsened by the nature of mock toolkits. Often mock tools specify very specific method calls and parameter matches, even when they aren't relevant to this particular test. 

#### 5.5 Design Style

略

----------

### 6. So should I be a classicist or a mockist?

It's particularly worth trying if you are having problems in some of the areas that mockist TDD is intended to improve. I see two main areas here. 

One is if you're spending a lot of time debugging when tests fail because they aren't breaking cleanly and telling you where the problem is. (You could also improve this by using classic TDD on finer-grained clusters.) 

The second area is if your objects don't contain enough behavior, mockist testing may encourage the development team to create more behavior rich objects. 

----------

### 7. Final Thoughts

A lot of the time people learn a bit about the mock object frameworks, without fully understanding the mockist/classical divide that underpins them.

While you don't have to be a mockist to find the mock frameworks handy, it is useful to understand the thinking that guides many of the design decisions of the software.