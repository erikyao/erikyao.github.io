---
layout: post
title: "Eigenbasis / Eigenspace"
description: ""
category: Math
tags: []
---
{% include JB/setup %}

Given a eigenvalue $\lambda$ of matrix $A$, the null space (kernel) of $A - \lambda I$ is called the **eigenspace** of $A$ associated with $\lambda$.

In another way, eigenspace $E_{\lambda; A} = \lbrace \mathbf{v} \mid (A - \lambda I)\mathbf{v} = \mathbf{0} \rbrace$ is the set of all eigenvectors associated with $\lambda$ plus zero vector.

If all the eigenvectors of $A_{n \times n}$ can form a basis of $\mathbb{R}^n$, they are called an **eigenbasis** of $\mathbb{R}^n$.

- So eigenbasis is not a basis of eigenspace.