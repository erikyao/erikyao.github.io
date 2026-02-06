---
category: Lab
description: ''
tags: []
title: 'Lab Memo: Use Cases for Pipeline Refactoring'
---

[Pipeline]: /assets/posts/2015-12-16-lab-memo-use-cases-for-pipeline-refactoring/Pipeline.jpg

![][Pipeline]

For pipeline refactoring, there are several use cases that need special attention:

1. How to easily switch to a new ML alg? Or use multiple ML algs together in one run?
2. How to integrate new features?
3. How to integrate new metric?
4. Get ready for the update for existing features.
	- E.g. the remote databases might update their records without notification.
	- E.g. snapshots for remote data at local storage
	- E.g. data serialization
	- This is a specific issue of "Persistence and Traceability"
5. We'll switch to new assembly some day.
6. We'll have new ground-truth cases some day. Prepare to rerun the pipeline.
7. We might need to make prediction for millions of examples. Speed it up?
8. Persistence and Traceability

There is another issue for engineering:

- Better project/folder structure for 
	- multilingual scripts, and
	- intermediate/final data files