---
layout: post
title: "Digest of Deep Learning"
description: ""
category: Machine-Learning
tags: [Book]
---
{% include JB/setup %}

## 1. Introduction

Modern deep learning draws inspiration from many fields, especially applied math fundamentals like 

- linear algebra, 
- probability, 
- information theory, and
- numerical optimization.

## Part I: Applied Math and Machine Learning Basic

## 2. Linear Algebra

## 3. Probability and Information Theory

### 3.1 Why Probability?

Nearly all activities require some ability to reason in the presence of uncertainty. There are three possible sources of uncertainty:

1. Inherent stochasticity in the system being modeled. 
2. Incomplete observability. 
    - Even deterministic systems can appear stochastic when we cannot observe all of the variables that drive the behavior of the system. 
3. Incomplete modeling. 
    - When we use a model that must discard some of the information we have observed, the discarded information results in uncertainty in the model’s predictions. 
    - 比如 assumption。任何一个 statistical model 都会涉及 assumption，但是 true system 是不是一定满足这个 assumption？如果不满足的话，那我们这个 model 就无法 cover assumption 之外的 information

In many cases, it is more practical to use a simple but uncertain rule rather than a complex but certain one, even if the true rule is deterministic and our modeling system has the fidelity to accommodate a complex rule. For example, 

- the simple rule "Most birds fly" is cheap to develop and is broadly useful, 
- while a rule of the form, "Birds fly, except for very young birds that have not yet learned to fly, sick or injured birds that have lost the ability to fly, flightless species of birds including the cassowary, ostrich and kiwi..." is expensive to develop, maintain and communicate, and after all of this effort is still very brittle and prone to failure.

