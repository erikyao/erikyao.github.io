---
layout: post
title: "Binary Encoding vs One hot Encoding"
description: ""
category: 
tags: []
---
{% include JB/setup %}

需要注意的是：one-hot encoding 应该是 binary encoding 的特殊情况。one-hot 的意思就是：只有一个 bit 是高位（1）；类似还有 one-cold encoding

```python
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
import pandas as pd
import numpy as np


def binary_encode(dfm, cat_col_name, cat_col_sep, new_col_prefix=None, integrate=False):
    """
    Binary-encode categorical column `cat_col_name` separated by `cat_col_sep`
    in data frame `dfm` to multiple binary columns with the same prefix `new_col_prefix`

    :param dfm: the data frame
    :param cat_col_name: the name of the categorical column whose values would be encoded
    :param cat_col_sep: the separator of the categorical values
    :param new_col_prefix: the prefix of the new columns after binary encoding
    :param integrate:
        if True, integrate the encoded part into the original data frame and return the integrated one;
        otherwise return only the encoded part
    :return:
    """

    """
    E.g. MySQL returns `GROUP_CONCAT(tf.name)` in `tfName` column in a comma-separated string, such as

        tfName
        ARID3A,ATF1,ATF2
        ARID3A

    Calling `binary_encode(dfm, 'tfName', ',', 'tf_')` would transform the column as:

        tfName               tf_ARID3A   tf_ATF1  tf_ATF2
        ARID3A,ATF1,ATF2  =>     1           1        1
        ARID3A                   1           0        0
    """
    encoded = dfm.loc[:, cat_col_name].str.get_dummies(sep=cat_col_sep)

    if new_col_prefix is not None:
        # Add a prefix to all column names
        encoded = encoded.add_prefix(new_col_prefix)

    if integrate:
        dfm = pd.concat([dfm, encoded], axis=1).drop(cat_col_name, axis=1)
        return dfm
    else:
        return encoded


def one_hot_encode(dfm, cat_col_name, new_col_prefix=None, integrate=False):
    """
    One-hot-encode categorical column `cat_col_name` in data frame `dfm`
    to multiple binary columns with the same prefix `new_col_prefix`
    """

    """
    LabelEncoder transforms the categorical values to integers. E.g

        minorAllele      minorAllele
            A                0
            C        =>      1
            G                2
            T                3

    Note that data structure is changed from `pandas.Series` to `numpy.ndarray`
    """
    le = LabelEncoder()
    le_data = pd.Series(le.fit_transform(dfm.loc[:, cat_col_name]))  # le_data.shape == (nrow,)

    # reshaping is required by OneHotEncoder below
    # `reshape` is not well documented by Numpy developers. Refer to https://stackoverflow.com/a/42510505 instead
    le_data = le_data.values.reshape(-1, 1)  # le_data.shape == (nrow, 1)

    """
    OneHotEncoder encodes categorical integer features using one-hot scheme. E.g

        minorAllele      0  1  2  3
            0            1  0  0  0
            1        =>  0  1  0  0
            2            0  0  1  0
            3            0  0  0  1
    """
    ohe = OneHotEncoder(dtype=np.int, sparse=False)
    ohe_data = ohe.fit_transform(le_data)

    """
    Encapsulate the encoded data into a DataFrame. E.g.

        0  1  2  3      A  C  G  T
        1  0  0  0      1  0  0  0
        0  1  0  0  =>  0  1  0  0
        0  0  1  0      0  0  1  0
        0  0  0  1      0  0  0  1

    `le.classes_` stores the original categorical values; it would be ['A', 'C', 'G', 'T'] in the example.
    """
    ohe_data = pd.DataFrame(data=ohe_data, columns=le.classes_)

    if new_col_prefix is not None:
        # Add a prefix to all column names
        ohe_data = ohe_data.add_prefix(new_col_prefix)

    if integrate:
        dfm = pd.concat([dfm, ohe_data], axis=1).drop(cat_col_name, axis=1)
        return dfm
    else:
        return ohe_data


def list_categorical_columns(dfm, exclude=['name']):
    """
    List all categorical columns.

    Typically, a categorical column has `dtype` set to 'category' or "str".

    This function relies on `pandas.DataFrame.select_dtypes(include=?)`.

    - To select strings you must use the `object` dtype, but note that this will return all `object` dtype columns
    - To select Pandas categorical dtypes, use "category"

    Check https://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.select_dtypes.html for more details

    Column "name" is excluded here by default.

    :param dfm:
    :param exclude:
    :return:
    """
    columns = list(dfm.select_dtypes(include=['category', 'object']))

    return [c for c in columns if c not in exclude]


# DO NOT use `binary_encode` to one-hot-encode although it's feasible

# %timeit -n 100 one_hot_encode(dfm, 'chrom', 'chrom_', integrate=False)
#   100 loops, best of 3: 19.6 ms per loop
# %timeit -n 100 binary_encode(dfm, 'chrom', ',', 'chrom_', integrate=False)
#   100 loops, best of 3: 381 ms per loop
```

用 [patsy](https://patsy.readthedocs.io/en/latest/categorical-coding.html) 来处理似乎有点 overkill，而且它默认 encoded 展开后 first column 的名字是 "Intercept"，剩下的 column name 也很难控制。