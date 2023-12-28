---
category: sklearn
description: ''
tags:
- cross-validation
title: 'scikit-learn: init your estimator lightly and fit heavily'
---

If you run `cross_validate(n_jobs > 1)` with your own estimator, pay attention that your estimator will be copied per job.

[sklearn.model_selection.cross_validate()](https://github.com/scikit-learn/scikit-learn/blob/a24c8b464d094d2c468a16ea9f8bf8d42d949f84/sklearn/model_selection/_validation.py#L203)

```python
scores = parallel(
        delayed(_fit_and_score)(
            clone(estimator), X, y, scorers, train, test, verbose, None,
            fit_params, return_train_score=return_train_score,
            return_times=True)
        for train, test in cv.split(X, y, groups))
```

[sklearn.base.copy()](https://github.com/scikit-learn/scikit-learn/blob/a24c8b464d094d2c468a16ea9f8bf8d42d949f84/sklearn/base.py#L30):

```python
estimator_type = type(estimator)
if estimator_type in (list, tuple, set, frozenset):
    return estimator_type([clone(e, safe=safe) for e in estimator])
elif not hasattr(estimator, 'get_params'):
    if not safe:
        return copy.deepcopy(estimator)

# Serveral lines omitted

new_object_params = estimator.get_params(deep=False)
for name, param in six.iteritems(new_object_params):
    new_object_params[name] = clone(param, safe=False)
```

[sklearn.base.get_params()](https://github.com/scikit-learn/scikit-learn/blob/a24c8b464d094d2c468a16ea9f8bf8d42d949f84/sklearn/base.py#L187)

```python
init = getattr(cls.__init__, 'deprecated_original', cls.__init__)
```

So basically what you list in your estimator's `__init__` signature will be DEEP copied. Once I initialized my estimator with a 6GB matrix and run `cross_validate(n_jobs = 10)`...My workstation exploded that day.

If possible, put all those heavy parameters to your `fit` method. Afterall, we can call `cross_validate(n_jobs > 1, fit_params=kwargs)`.

-----

Update: <del>It's not enough. `fit_params` will be copied as well!</del>

Solution: `numpy.memmap`. See discussions:

- [scikit-learn joblib bug: multiprocessing pool self.value out of range for 'i' format code, only with large numpy arrays](https://stackoverflow.com/a/24411581)
- [Working with numerical data in shared memory (memmaping)](https://pythonhosted.org/joblib/parallel.html#working-with-numerical-data-in-shared-memory-memmaping)

-----

Update: Objects in `fit_params` won't be copied, only references of them will be. By default, `sklearn.externals.joblib.Parallel` uses `MultiprocessingBackend`, so there would be $n$ `python3` **processes** in the background. However, my ubuntu task manager showed that each `python3` process had taken a big chunk of memory while the total memory usage had not boomed. It looked like each process copied the parameter objects.

On the other hand, a *memory map* is like an in-memory index of its `.joblib` file (and it's much smaller!). The memory map will be read first to find the positions of data in that `.joblib` file, then the corresponding positions will be accessed.

The `mmap_mode` parameter of `joblib.load(filename, mmap_mode)` actually means:

- If `None`, **do not use memory mapping**
- If not `None`, use memory mapping with the mode of `mmap_mode`. Available modes are the the same with [`numpy.memmap`](https://docs.scipy.org/doc/numpy/reference/generated/numpy.memmap.html):
    - `'r'`: Open existing file for reading only.
    - `'r+'`: Open existing file for reading and writing.
    - `'w+'`: Create or overwrite existing file for reading and writing.
    - `'c'`: Copy-on-write: assignments affect data in memory, but changes are not saved to disk. The file on disk is read-only.