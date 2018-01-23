---
layout: post
title: "Check the header of Columbia Eigen tab delimited files"
description: ""
category: 
tags: []
---
{% include JB/setup %}

Precomputed Eigen scores are available at [Download Eigen/Eigen-PC scores](http://www.columbia.edu/~ii2135/download.html).

It's weird that my `tabix -h` or `tabix -H` cannot print the headers of those `.bgz` files.

```bash
Erik:Downloads$ tabix --version
tabix (htslib) 1.3.2-228-g0c32631
Copyright (C) 2017 Genome Research Ltd.
```

So I need to decompress one such file to inspect. However, my `bgzip` cannot recognize the `.bgz` suffix... 

```bash
Erik:Downloads$ bgzip -d Eigen_hg19_noncoding_annot_chr21.tab.bgz
[bgzip] Eigen_hg19_noncoding_annot_chr21.tab.bgz: unknown suffix -- ignored
```

A workaround is to change it into a `.gz` file.

```bash
Erik:Downloads$ mv Eigen_hg19_noncoding_annot_chr21.tab.bgz Eigen_hg19_noncoding_annot_chr21.tab.gz
Erik:Downloads$
Erik:Downloads$ bgzip -cd Eigen_hg19_noncoding_annot_chr21.tab.gz | head -n3
chr  position  ref  alt  GERP_NR  GERP_RS  PhyloPri  PhyloPla  PhyloVer  PhastPri  PhastPla  PhastVer  H3K4Me1  H3K4Me3  H3K27ac  TFBS_max  TFBS_sum  TFBS_num  OCPval  DnaseSig  DnasePval  FaireSig  FairePval  PolIISig  PolIIPval  ctcfSig  ctcfPval  cmycSig  cmycPval  Eigen-raw  Eigen-phred  Eigen-PC-raw  Eigen-PC-phred
21	9411194	G	A	0	0	0.121	0.119	0.251	0.117	0.053	0.055	1	2.2	1.08	0	0	0	0	0	0	0	0	0	0	0	0	0	0	-0.343630566947083	0.857783	-0.220709412747219	0.69382
21	9411194	G	C	0	0	0.121	0.119	0.251	0.117	0.053	0.055	1	2.2	1.08	0	0	0	0	0	0	0	0	0	0	0	0	0	0	-0.343630566947083	0.857783	-0.220709412747219	0.69382
```

There must be some other way to fix the "unknown suffix" issue but I am not interested in so far...

From the output we can see that:

- `Eigen-raw` is the 30th column (counting from 1, hereinafter)  
- `Eigen-phred` the 31st  
- `Eigen-PC-raw` the 32nd
- `Eigen-PC-phred` the 33rd