---
category: Math
description: ''
tags: []
title: RBF (Radial Basis Function) Kernel
---

知道了 [Radial basis function](/math/2018/05/09/radial-function-radial-basis-function-base-exponent-power) 和 [kernel function](/math/2018/05/09/kernel) 之后，Radial basis function kernel 就好理解了：它是一个 kernel function，然后属于 radial basis function 大类。

[Wikipedia: Radial basis function kernel](https://en.wikipedia.org/wiki/Radial_basis_function_kernel): The RBF kernel on two samples $\mathbf{x}$ and $\mathbf{x'}$, represented as feature vectors in some input space, is defined as

$$
K(\mathbf{x}, \mathbf{x'})= \exp \left ( -{\frac {\|\mathbf{x} - \mathbf{x'} \|^{2}}{2\sigma ^{2}}} \right )
$$

$\\|\mathbf{x} -\mathbf{x'} \\|^{2}$ may be recognized as the squared Euclidean distance between the two feature vectors. $\sigma$ is a free parameter. An equivalent, but simpler, definition involves a parameter $\gamma ={\tfrac{1}{2\sigma^{2}}}$:

$$
K(\mathbf{x} , \mathbf{x'} ) = \exp(-\gamma \|\mathbf{x} -\mathbf{x'} \|^{2})
$$

Since the value of the RBF kernel decreases with distance and ranges between 0 (in the limit) and 1 (when $\mathbf{x} = \mathbf{x'}$), it has a ready interpretation as a similarity measure.