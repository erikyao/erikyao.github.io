---
layout: post
title: "Python: Query reference sequences using <i>rpy2</i> and <i>BSgenome</i>"
description: ""
category: Python
tags: [Bioconductor]
---
{% include JB/setup %}

Usually this job is done in R, as deescribed in [Using R + Bioconductor to Get Flanking Sequence Given Genomic Coordinates](http://www.gettinggeneticsdone.com/2011/04/using-rstats-bioconductor-to-get.html). An R sample could be this simple:

```r
library('BSgenome.Hsapiens.UCSC.hg19')  
# 'BSgenome.Hsapiens.UCSC.hg19' requires 'BSgenome'
# Then 'BSgenome' requires 'Biostrings'
#   `getSeq` is actually a 'Biostrings' function

# S4 method for signature 'BSgenome'
#   getSeq(x, names, start=NA, end=NA, width=NA, strand="+", as.character=FALSE)
# See https://bioconductor.org/packages/devel/bioc/manuals/BSgenome/man/BSgenome.pdf
one_seq <- getSeq(Hsapiens, "chr1", 10001, 10005, NA, "+", TRUE)
two_seq <- getSeq(Hsapiens, c("chr1", "chr1"), c(10001, 20001), c(10005, 20005), c(NA, NA), c("+", "+"), TRUE)
```

Suppose you have all related R libraries installed (well, you can install bioconductor with `rpy2` [if you like](https://stackoverflow.com/a/17003912)). If you want to do this in python for various reasons, it is feasible although things may be a little bit complicated:

```python
import rpy2.rinterface as rinterface
import rpy2.robjects as robjects
from rpy2.robjects.packages import importr


bs_genome = importr("BSgenome.Hsapiens.UCSC.hg19")
# You need to import 'Biostrings' explicitly
# `importr("BSgenome.Hsapiens.UCSC.hg19")` wont load 'Biostrings' automatically
bio_strings = importr("Biostrings")


# Note that:
#   - `getSeq` is actually a 'Biostrings' function
#   - `as.character` is not a legal parameter name in python
#   - `NA` in R, `rinterface.NA_Integer` in `rpy2`
#   - `robjects.XxxVector` accepts tuples, not lists
one_seq = bio_strings.getSeq(bs_genome.Hsapiens, "chr1", 10001, 10005, rinterface.NA_Integer, "+", True) 
two_seq = bio_strings.getSeq(bs_genome.Hsapiens,
                             robjects.StrVector(("chr1", "chr1")),
                             robjects.IntVector((10001, 20001)),
                             robjects.IntVector((10005, 20005)),
                             robjects.IntVector((rinterface.NA_Integer, rinterface.NA_Integer)),
                             robjects.StrVector(("-", "+")),
                             True)
```