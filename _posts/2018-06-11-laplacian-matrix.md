---
layout: post
title: "Laplacian Matrix"
description: ""
category: Algorithm
tags: [Graph]
---
{% include JB/setup %}

## Definition

Quote from [Wikipedia: Laplacian matrix](https://en.wikipedia.org/wiki/Laplacian_matrix):

Given a simple graph $G$ with $n$ vertices, its Laplacian matrix $L_{n\times n}$ is defined as:

$$
L = D - A,
$$

where $D$ is the degree matrix and $A$ is the adjacency matrix of the graph. Since $G$ is a simple graph, $A$ only contains $1$s or $0$s and its diagonal elements are all $0$s.

In the case of directed graphs, either the indegree or outdegree might be used, depending on the application.

The elements of $L$ are given by:

$$
L_{i,j}:={\begin{cases}\deg(v_{i})&{\mbox{if}}\ i=j\\-1&{\mbox{if}}\ i\neq j\ {\mbox{and}}\ v_{i}{\mbox{ is adjacent to }}v_{j}\\0&{\mbox{otherwise}}\end{cases}}
$$

E.g., here is a simple example of undirected graph and its Laplacian matrix.

![](https://farm1.staticflickr.com/896/42694234382_d4d95ac4db_z_d.jpg)

至于 Symmetric normalized Laplacian 和 Random-walk normalized Laplacian 请看 Wikipedia

## Why is it called "Laplacian"?

http://mathworld.wolfram.com/LaplacianMatrix.html
https://en.wikipedia.org/wiki/Discrete_Laplace_operator#Graph_Laplacians
https://en.wikipedia.org/wiki/Incidence_matrix
https://www.quora.com/Whats-the-intuition-behind-a-Laplacian-matrix-Im-not-so-much-interested-in-mathematical-details-or-technical-applications-Im-trying-to-grasp-what-a-laplacian-matrix-actually-represents-and-what-aspects-of-a-graph-it-makes-accessible#SAYyw