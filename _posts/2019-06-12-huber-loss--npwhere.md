---
category: Numpy
description: ''
tags: []
title: Huber loss / <i>np.where</i>
---

Huber loss:

$$
L_{\delta }(y,f(x)) = {\begin{cases}{
    \frac{1}{2}}(y-f(x))^{2} & {\textrm {for}}|y-f(x)| \leq \delta, \newline 
    \delta \,|y-f(x)|-{\frac{1}{2}} \delta^{2} & {\textrm {otherwise.}}
\end{cases}}
$$

- Usually set $\delta = 1$
- Huber loss is less sensitive to outliers (those $y$ such that $\vert y-f(x) \vert > \delta$) than the MSE
- And converges faster than the mean absolute error (because of larger gradients).

A python implementation:

```python
def huber_fn(y_true, y_pred):
    # Suppose delta == 1
    error = y_true - y_pred
    
    is_small_error = tf.abs(error) < 1
    
    squared_loss = tf.square(error) / 2
    linear_loss = tf.abs(error) - 0.5
    
    return tf.where(is_small_error, squared_loss, linear_loss)
```

If all the arrays are 1-D, `np.where(condition, X, Y)` is equivalent to:

```python
for (c, x, y) in zip(condition, X, Y):
    yield c ? x : y
```