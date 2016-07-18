---
layout: post
title: "Digest of <i>Working Effectively with Legacy Code</i>"
description: ""
category: 
tags: []
---
{% include JB/setup %}

[4-reasons-to-change]: https://farm9.staticflickr.com/8842/28276622872_ee20c98b6d_o_d.jpg

# Part I - The Mechanics of Change

## Chapter 1 - Changing Software

Code behavior:

- If we have to modify code (and HTML kind of counts as code), we could be changing behavior. 
- If we are only adding code and calling it, we are often adding behavior.
	- Adding a method doesn’t change behavior unless the method is called somehow.

Four primary reasons to change software:

1. Adding a feature
2. Fixing a bug
3. Improving the design
	- The act of improving design without changing its behavior is called _**refactoring**_.
4. Optimizing resource usage
	- With both refactoring and optimization, we say, “We’re going to keep functionality exactly the same when we make changes, but we are going to change something else.” 
		- In refactoring, the “something else” is program structure; we want to make it easier to maintain. 
		- In optimization, the “something else” is some resource used by the program, usually time or memory.
		
![][4-reasons-to-change]

The difference between good systems and bad ones is that, 

- In the good ones, you feel pretty calm after you’ve done that learning, and you are confident in the change you are about to make. 
- In poorly structured code, the move from figuring things out to making changes feels like jumping off a cliff to avoid a tiger. You hesitate and hesitate. “Am I ready to do it? Well, I guess I have to.”

## Chapter 2 - Working with Feedback

Changes in a system can be made in two primary ways. I like to call them

- _Edit and Pray_ and 
- _Cover and Modify_.

Two types of testing:

- “testing to attempt to show correctness”
- “testing to detect change”
	- which serves as a _software vise_
	
A unit test that takes 1/10th of a second to run is a **slow** unit test.

A test is not a unit test if:

1. It talks to a database.
2. It communicates across a network.
3. It touches the file system.
4. You have to do special things to your environment (such as editing configuration files) to run it.

Tests that do these things aren’t bad. Often they are worth writing, and you generally will write them in unit test harnesses. However, it is important to be able to _**separate them from true unit tests so that you can keep a set of tests that you can run fast whenever you make changes**_.

Dependencies:

- When classes depend directly on things that are hard to use in a test, they are hard to modify and hard to work with.
-  Much legacy code work involves breaking dependencies so that change can be easier.
	- The Legacy Code Dilemma: When we change code, we should have tests in place. To put tests in place, we often have to change code.
	- When you break dependencies in legacy code, you often have to suspend your sense of aesthetics a bit. Some dependencies break cleanly; others end up looking less than ideal from a design point of view.
	
The Legacy Code Change Algorithm

1. Identify change points.
	- Chapter 16, _I Don’t Understand the Code Well Enough to Change It._
	- Chapter 17, _My Application Has No Structure._
2. Find test points.
	- Chapter 11, _I Need to Make a Change. What Methods Should I Test?_
	- Chapter 12, _I Need to Make Many Changes in One Area. Do I Have to Break Dependencies for All the Classes Involved?_
3. Break dependencies.
	- Chapter 9, _I Can’t Get This Class into a Test Harness._
	- Chapter 10, _I Can’t Run This Method in a Test Harness._
	- Chapter 22, _I Need to Change a Monster Method and I Can’t Write Tests for It._
	- Chapter 23, _How Do I Know That I’m Not Breaking Anything?_
4. Write tests.
	- Chapter 13, _I Need to Make a Change but I Don’t Know What Tests to Write._
5. Make changes and refactor.
	- Chapter 8, _How Do I Add a Feature?_
	- Chapter 21, _I’m Changing the Same Code All Over the Place._
	- Chapter 20, _This Class Is Too Big and I Don’t Want It to Get Any Bigger._
	- Chapter 22, _I Need to Change a Monster Method and I Can’t Write Tests for It._
	
## Chapter 3 - Sensing and Separation