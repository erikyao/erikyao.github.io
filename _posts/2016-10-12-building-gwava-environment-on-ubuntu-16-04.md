---
layout: post
title: "Building GWAVA environment on Ubuntu 16.04"
description: ""
category: Lab
tags: []
---
{% include JB/setup %}

[GWAVA](https://www.sanger.ac.uk/sanger/StatGen_Gwava), Genome Wide Annotation of VAriants, is a tool aiming to predict the functional impact of non-coding genetic variants. It consists of two parts:

1. a procedure of variant annotation
2. a random-forest classifier using variant annotations to predict function variants vs non-functional ones

GWAVA was published in 2014. As you can see from the [README](ftp://ftp.sanger.ac.uk/pub/resources/software/gwava/v1.0/README) from its [FTP site](ftp://ftp.sanger.ac.uk/pub/resources/software/gwava/v1.0/), it took advantage of some older versions of libs:

- `numpy==1.7.0`
- `scipy==0.11.0`
- `pandas==0.12.0`
- `scikit-learn==0.14.1`
- `pybedtools==0.6.4`
- `tabix` (0.2.5)

The source code can be found in the [_src_](ftp://ftp.sanger.ac.uk/pub/resources/software/gwava/v1.0/src/) folder on its FTP, or in the [_Supplementary Information_](http://www.nature.com/nmeth/journal/v11/n3/full/nmeth.2832.html#/supplementary-information) section on its _Nature Methods_ page.

Of course, it's better to establish an `virtualenv` specially to run the GWAVA code. The project folder structure is like:

- {PROJECT}
    - _src_ (copy fom FTP)
    - _annotated_ (ditto)
    - _paper_data_ (ditto)
    - _source_data_ (ditto)
    - _training_sets_ (ditto)
    - _tmp_ (an empty folder)

## Issue 1: `numpy` compatibility

My current python2 version, `2.7.12`, is not compatible with such an old `numpy`, so I just install a newest version, `numpy==1.11.1`.

## Issue 2: `tabix` installation

You can go with `apt install tabix` and probably get [tabix (1.2.1-2ubuntu1)](http://packages.ubuntu.com/xenial/tabix).

To install the specific version manually, go to [SAM tools](https://sourceforge.net/projects/samtools/files/tabix/) site to download and then

```bash
tar jxvf tabix-0.2.5.tar.bz2
cd tabix-0.2.5/python
python2 setup.py install
```

However, somehow misleading, `tabix --version` would show "Version: 1.0" because of the information written in `setup.py`.

## Issue 3: `pybedtools`, the python interface, needs its implementation, a binary lib `bedtools`

The latest `bedtools 2.25.0`, available via `apt`, is not back-compatible and will raise errors like:

```bash
***** ERROR: Unrecognized parameter: -ops *****
***** ERROR: Unrecognized parameter: freqdesc *****
```

even although `-ops` and `freqdesc` are "legal" options listed in its man page... (Jesus!)

From the title of the post [bedtools 2.18.2 and pybedtools 0.6.4](https://groups.google.com/forum/#!topic/bedtools-discuss/8kfkutrodKI) from [bedtools-discuss](https://groups.google.com/forum/#!forum/bedtools-discuss) google group by _Aaron Quinlan_, one of the developers of `bedtools`, we can see that we should use `bedtools 2.18.2`.

`bedtools` was originally hosted on [Google Code - bedtools](https://code.google.com/archive/p/bedtools/), but now has been moved to [Github - arq5x/bedtools2](https://github.com/arq5x/bedtools2/releases). Follow [this document](http://gensoft.pasteur.fr/docs/bedtools/2.19.1/content/installation.html) to install:

```bash
tar -zxvf bedtools-2.18.2.tar.gz
cd BEDTools-2.18.2
make
cp ./bin/bedtools /usr/local/bin
```

Yes, you can get other versions rather than `2.25.0` of `bedtools` by `apt`, but I am not sure whether those versions are compatible or not. See [Ubuntu - bedtools package](https://launchpad.net/ubuntu/+source/bedtools) for more details.

## Issue 4: nobody ever told me that `samtools` is required...

... and which version?! 

Luckily, the [Availability and Requirements](http://bmcresnotes.biomedcentral.com/articles/10.1186/1756-0500-7-618#Sec16) section of a 2014 paper, _SPANDx: a genomics pipeline for comparative analysis of large haploid whole genome re-sequencing datasets_, indicates:

> Other requirements: ... SAMtools 0.1.19, BEDTools 2.18.2...

Yes, let's use `samtools 0.1.19`. (SMH...) And this time finally we can just use `apt install samtools`! Yikes! See [Ubuntu - samtools package](https://launchpad.net/ubuntu/+source/samtools) for more details.