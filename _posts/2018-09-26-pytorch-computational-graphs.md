---
category: PyTorch
description: ''
tags: []
title: 'PyTorch: Computational Graphs'
---

首先感谢有 [PyTorchViz](https://github.com/szagoruyko/pytorchviz) 这个项目 (依赖 [Graphviz](https://www.graphviz.org/)) 使得我们可以画出 PyTorch 的 computational graph。PyTorch 自己好像并没有 built-in 的机制来做这件事情。

一个简单的例子 (直接在 notebook 中运行)：

```python
import torch as t
from torchviz import make_dot

a = t.randn(3,4).requires_grad_()
b = t.zeros(3,4).requires_grad_()

c = a + b

make_dot(var=c, params={"a": a, "b": b})
```

![](https://farm2.staticflickr.com/1973/44011086785_4f3e40c167_z_d.jpg)

查看 `torchviz::make_dot()` 的[源代码](https://github.com/szagoruyko/pytorchviz/blob/master/torchviz/dot.py)，发现：

- 上例中画图的过程，开端其实是 `add_nodes(var.grad_fn)`，这里 `var = c`
- `c.grad_fn` 类型是 `ThAddBackward` 
- `c.grad_fn.next_functions` 是个 tuple，包含两个 `AccumulateGrad`
- `AccumulateGrad.variable` 可以回溯到 `a` 和 `b`

![](https://farm2.staticflickr.com/1943/44923719451_57f940faa4_z_d.jpg)

`c.grad_fn.next_functions` 这棵 tree，唯一可能的构建时间是在 `c = a + b`。我猜测是 PyTorch 是 overload 了 `Tensor` 的 `+`，但是这一点有点难验证，原因：

- 继承关系有 `class Tensor(torch._C._TensorBase)` ([源代码](https://github.com/pytorch/pytorch/blob/master/torch/tensor.py))，所以 `Tensor.__add__()` 其实是在 `torch._C._TensorBase` 里定义的
- 而 `torch._C._TensorBase` 其实是 C++ 代码

PyTorch 的 C++ 代码目前看来有 [pytorch/torch/csrc/](https://github.com/pytorch/pytorch/tree/master/torch/csrc) 这么多，目前我还不知道要从何读起。另外有人提到有些 operation 是通过一个 YAML 定义的，即 [pytorch/torch/csrc/generic/methods/TensorMath.cwrap](https://github.com/pytorch/pytorch/blob/169ed0cd4bab8c30ba5f3a71dddacc7707d013a6/torch/csrc/generic/methods/TensorMath.cwrap)，其中的确有 `add` 的 entry，但是这个机制我也不懂。具体的讨论及资源有：

- [Stackoverflow: How to find functions imported from torch._C in source code](https://stackoverflow.com/questions/48874968/how-to-find-functions-imported-from-torch-c-in-source-code)
- [A Tour of PyTorch Internals (Part I)](https://pytorch.org/blog/a-tour-of-pytorch-internals-1/)
- [PyTorch Internals Part II - The Build System](https://pytorch.org/blog/a-tour-of-pytorch-internals-2/)
- [PyTorch – Internal Architecture Tour](http://blog.christianperone.com/2018/03/pytorch-internal-architecture-tour/)