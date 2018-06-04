---
layout: post
title: "scikit-learn: Pipeline"
description: ""
category: sklearn
tags: []
---
{% include JB/setup %}

Pipeline 的作用，见名知意，就是把多个 processor units chain up 起来。Pipeline 要求前 $N-1$ 个 processor units 是 `Transformer`，最后一个 processor unit 是 `Estimator`。我们举个例子看看就很好理解了：

```python
from sklearn.base import TransformerMixin
from sklearn.base import BaseEstimator
from sklearn.pipeline import Pipeline
from sklearn.pipeline import make_pipeline


class DullTransformer(TransformerMixin):
    def __init__(self, number):
        self.number = number

    def fit(self, X, y=None):
        print("Dull Transformer No.{}: fit X={}".format(self.number, X))
        return self

    def transform(self, X):
        print("Dull Transformer No.{}: transform X={} => X={}".format(self.number, X, X+10))
        return X+10


class DullEstimator(BaseEstimator):
    def __init__(self, number):
        self.number = number

    def fit(self, X, y=None):
        print("Dull Estimator No.{}: fit X={}".format(self.number, X))
        return self

    def predict(self, X):
        print("Dull Estimator No.{}: predict X={} is...".format(self.number, X))
        return 0


if __name__ == '__main__':
    p1 = Pipeline(steps=[("Trans1", DullTransformer(1)),
                         ("Trans2", DullTransformer(2)),
                         ("Estmt1", DullEstimator(1))])
    print("#===== Pipeline 1 repr =====#")
    print(p1)
    print("#===== Pipeline 1 fitting =====#")
    p1.fit(X=100)
    print("#===== Pipeline 1 predicting =====#")
    pred = p1.predict(X=100)
    print(pred)

    p2 = make_pipeline(DullTransformer(1), DullTransformer(2), DullEstimator(1))
    print("#===== Pipeline 2 repr =====#")
    print(p2)
    
# output:
#    #===== Pipeline 1 repr =====#
#    Pipeline(steps=[('Trans1', <__main__.DullTransformer object at 0x7f7008051ad0>), ('Trans2', <__main__.DullTransformer object at 0x7f7008061590>), ('Estmt1', DullEstimator(number=1))])
#    #===== Pipeline 1 fitting =====#
#    Dull Transformer No.1: fit X=100
#    Dull Transformer No.1: transform X=100 => X=110
#    Dull Transformer No.2: fit X=110
#    Dull Transformer No.2: transform X=110 => X=120
#    Dull Estimator No.1: fit X=120
#    #===== Pipeline 1 predicting =====#
#    Dull Transformer No.1: transform X=100 => X=110
#    Dull Transformer No.2: transform X=110 => X=120
#    Dull Estimator No.1: predict X=120 is...
#    0
#    #===== Pipeline 2 repr =====#
#    Pipeline(steps=[('dulltransformer-1', <__main__.DullTransformer object at 0x7f7011c8f750>), ('dulltransformer-2', <__main__.DullTransformer object at 0x7f7008061890>), ('dullestimator', DullEstimator(number=1))])
``` 

Pipeline `fit()` 的逻辑是：

1. `DullTransformer(1).fit(100).transform(100)`，输出 110 给 `DullTransformer(2)` 作输入
1. `DullTransformer(2).fit(110).transform(110)`，输出 120 给 `DullEstimator(1)` 作输入
1. `DullEstimator(1).fit(120)`

`predict()` 的逻辑类似。此外还有 `fit_transform()` 和 `fit_predict()` 等方法可以连环组织你的处理步骤。

因为 Pipeline 也符合 `fit()`、`predict()` 这一套接口规范，所以你可以把它当做一个 estimator 来用，也就是说你可以去 `cross_val_score()` 或者 `GridSearchCV()` 一个 Pipeline！

如果你要去 `GridSearchCV()` 一个 Pipeline，那我们一定会用到 `FeatureUnion` 的支持去访问 Pipeline 内部 processor unit 的参数。比方说，我们可以用 `p1.set_params(Trans1__number=66)` 去修改 `DullTransformer(1)` 的 `number` 字段。`p1` 的这个新字段 `Trans1__number` 实际就是由 `FeatureUnion` 合成的。

可以简单设想这么两种应用场景：

1. 我可以在 `GridSearchCV()` 里尝试一个 Transformer 的不同参数。比如，是先 $\log_2(X)$ 再 predict 还是先 $\ln(X)$ 再 predict。
1. 我可以设计一个 Transformer dispatcher，根据参数来指定具体使用哪个 Transformer。比如接收到 `type="log2"`，我就 delegate 一个 $\log_2(X)$ 的 transformer； 接收到 `type="abs"`，就 delegate 一个 $\vert X \vert$ 的 transformer。

