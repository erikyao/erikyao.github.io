---
layout: post-mathjax
title: "Hidden Markov Models"
description: ""
category: Machine-Learning
tags: [ML-101, HMM]
---
{% include JB/setup %}

总结自 [Hidden Markov Models](http://www.comp.leeds.ac.uk/roger/HiddenMarkovModels/html_dev/main.html)

-----

## 1. Introduction

我们的确是从 pattern 和 predict tommorow's weather 入手来引出 HMM 的，但是要注意 HMM 并不是专门为了解决这个问题而设计的，所以在看到 HMM 的组成时不要再围绕 predict tommorow's weather 来思考。

## 2. Generating Patterns

### 2.1 Deterministic Patterns

Consider a set of traffic lights: red-amber-green-red. The sequence can be pictured as a state machine. 

Notice that each state is dependent solely on the previous state, so if the lights are green, an red light will always follow - that is, the system is deterministic. Deterministic systems are relatively easy to understand and analyse, once the transitions are fully known.

### 2.2 Non-deterministic patterns

To make the weather example a little more realistic, introduce a third state - cloudy. Unlike the traffic light example, we cannot expect these three weather states to follow each other deterministically, but we might still hope to model the system that generates a weather pattern.

One way to do this is to assume that the state of the model depends only upon the previous states of the model. This is called the **Markov assumption** and simplifies problems greatly. Obviously, this may be a gross simplification and much important information may be lost because of it.

When considering the weather, the Markov assumption presumes that today's weather can always be predicted solely given knowledge of the weather of the past few days - factors such as wind, air pressure etc. are not considered. In this example, and many others, such assumptions are obviously unrealistic. Nevertheless (in spite of what preceded; in spite of what has just been said), since such simplified systems can be subjected to analysis, we often accept the assumption in the knowledge that it may generate information that is not fully accurate.

### 2.3 Markov Process

A **Markov process** is a process which moves from state to state depending (only) on the previous $ n $ states. The process is called an **order $ n $ model** accordingly. The simplest Markov process is a 1^st order process. Notice this is not the same as a deterministic system, since we expect the choice to be made probabalistically, not deterministically.

Notice that for a 1^st order process with $ M $ states, there are $ M^2 $ transitions between states since it is possible for any one state to follow another. Associated with each transition is a probability called the state transition probability - this is the probability of moving from one state to another. These $ M^2 $ probabilities may be collected together in an obvious way into a _state transition matrix_. Notice that these probabilities do not vary in time - this is an important (if often unrealistic) assumption.

E.g. 

|               |       |      | Today |       |
|---------------|-------|------|-------|-------|
|               |       | Sun  | Cloud | Rain  |
|               | Sun   | 0.50 | 0.375 | 0.125 |
| **Yesterday** | Cloud | 0.25 | 0.125 | 0.625 |
|               | Rain  | 0.25 | 0.375 | 0.375 |

\- that is, if it was sunny yesterday, there is a probability of 0.5 that it will be sunny today, and 0.375 that it will be cloudy.

An important point about the assumption is that the state transition probabilites do not vary in time - the matrix is fixed throughout the life of the system.

To initialise such a system, we need to state what the weather was (or probably was) on the day after creation; we define this in a vector of initial probabilities, called the $ \Pi $ vector.

E.g. 

| Sunn | Cloud | Rain  |
|------|-------|-------|
| 1    | 0     | 0     |

\- that is, we know it was sunny on day 1.

We have now defined a $1^{st}$ order Markov process consisting of :

* states: Three in this case - sunny, cloudy, rainy.
* $ \Pi $ vector: Defining the probability of the system being in each of the states at time 0.
* state transition matrix: The probability of the weather given the previous day's weather. (the 3x3 matrix above) 

总结一下：

* A process generates a pattern.
* 遵守 Markov assumption 的 process 称为 Markov process
* Markov assumption 说的是 the state of the model depends only upon the previous states of the model.

## 3. Hidden Markov Models

### 3.1 Definition

In some cases the patterns that we wish to find are not described sufficiently by a Markov process. Returning to the weather example, we may perhaps not have access to direct weather observations, but does have a cat (E.g. it is a sign of rain if the cat washes her head behind her ear.). 

It is important to note that the number of states in the hidden process and the number of observable states may be different. In a three state weather system (sunny, cloudy, rainy) it may be possible to observe four actions of the cat (head-washing, sneezing, lying-on-head, none)

In such cases the observed sequence of states is probabalistically related to the hidden process. We model such processes using a **hidden Markov model** where there is an underlying hidden Markov process changing over time, and a set of observable states which are related somehow to the hidden states. I.e. in this case we have two sets of states: 

* the observable states (the action of the cat) 
* and the hidden states (the state of the weather)

Assume that the hidden states (the true weather) are modelled by a hidden simple 1^st order Markov process. The connections between the hidden states and the observable states represent the probability of generating a particular observed state given that the Markov process is in a particular hidden state.

We therefore have another matrix, termed the _confusion matrix_, which contains the probabilities of the observable states given a particular hidden state.

E.g.

|             |       |      | Cat    |      |      |
|-------------|-------|------|--------|------|------|
|             |       | Wash | Sneeze | Lie  | None |
|             | Sun   | 0.05 | 0.10   | 0.35 | 0.50 |
| **Weather** | Cloud | 0.25 | 0.25   | 0.25 | 0.25 |
|             | Rain  | 0.60 | 0.20   | 0.15 | 0.05 |

\- that is, if it is rainy today, there is a probability of 0.6 that the cat has washed her head behind her ear.

* 我们用 $ X $ 表示 hidden state
	* $ x_i $ 表示系统处于 i^th hidden state
	* $ x_{i_t} $ 表示在 t 时间，系统处于 $i^{th}$ hidden state
* 我们用 $ Y $ 表示 observation
	* $ y_i $ 表示观测到 i^th observation
* $ a_{ij} = P(x_{i_t} \vert x_{j_{t-1}}) $ 表示从 $j^{th}$ hidden state 迁移到 $i^{th}$ hidden state 的概率
* $ b_{ij} = P(y_i \vert x_j) $，表示在 $j^{th}$ hidden state 状态下观测到 $i^{th}$ observation 的概率

We define a hidden Markov model as a triple $ (\Pi,A,B) $, where:

* $ \Pi = (\pi_i) $ is the vector of the initial state probabilities
* $ A = (a_{ij}) $ is the state transition matrix
* $ B = (b_{ij}) $ is the confusion matrix

Each probability in the state transition matrix and in the confusion matrix is time independent - that is, the matrices do not change in time as the system evolves (所以 $ x_{i_t} $ 的 t 我们可以省略不考虑). In practice, this is one of the most unrealistic assumptions of Markov models about real processes.

### 3.2 Usages

Once a system can be described as an HMM, 3 problems can be solved. The first two are pattern recognition problems: 

* Finding the probability of an observed sequence given a HMM (evaluation). 
	* I.e. given $ Y_1 Y_2 \cdots Y_n $, to calculate $ P(Y_1 Y_2 \cdots Y_n) $ 
		* E.g. $ \begin{align} P(wash,sneeze) &= P(wash,sneeze \vert sun,sun) + P(wash,sneeze \vert sun,cloud) \newline &+ \cdots + P(wash,sneeze \vert rain,rain) \end{align} $
	* 已知模型参数，计算某一特定 observation 序列的概率
	* 通常使用 forward 算法解决
* Finding the sequence of hidden states that most probably generated an observed sequence (decoding). 
	* I.e. given $ Y_1 Y_2 \cdots Y_n $, to find $ \arg_{X_1 X_2 \cdots X_n} \max{P(Y_1 Y_2 \cdots Y_n \vert X_1 X_2 \cdots X_n)} $
		* E.g. $ \max{(P(wash,sneeze \vert sun,sun), \cdots, P(wash,sneeze \vert rain,rain))} $
	* 已知模型参数，寻找最可能产生某一特定 observation 序列的 hidden state 序列
	* 通常使用 Viterbi 算法解决
* Generating a HMM given a sequence of observations (learning)
	* 已知 observation 序列和 state 集合，寻找最可能的 $ \Pi $ vector, state transition matrix 以及 confusion matrix
	* 通常使用 forward-backward 算法、Baum-Welch 算法以及 Reversed Viterbi 算法解决

具体的算法就不展开了。