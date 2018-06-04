---
layout: post
title: "Lab Memo: Use Cases for Pipeline Refactoring"
description: ""
category: Lab
tags: []
---
{% include JB/setup %}

[Pipeline]: https://farm6.staticflickr.com/5755/23567557869_3e00975672_o_d.png

![][Pipeline]

For pipeline refactoring, there are several use cases that need special attention:

1. How to easily switch to a new ML alg? Or use multiple ML algs together in one run?
1. How to integrate new features?
1. How to integrate new metric?
1. Get ready for the update for existing features.
	- E.g. the remote databases might update their records without notification.
	- E.g. snapshots for remote data at local storage
	- E.g. data serialization
	- This is a specific issue of "Persistence and Traceability"
1. We'll switch to new assembly some day.
1. We'll have new ground-truth cases some day. Prepare to rerun the pipeline.
1. We might need to make prediction for millions of examples. Speed it up?
1. Persistence and Traceability

There is another issue for engineering:

- Better project/folder structure for 
	- multilingual scripts, and
	- intermediate/final data files 
