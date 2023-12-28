---
category: Lab
description: ''
tags: []
title: Building GWAVA environment on Ubuntu 16.04
---

[GWAVA](https://www.sanger.ac.uk/sanger/StatGen_Gwava), _Genome Wide Annotation of VAriants_, is a tool aiming to predict the functional impact of non-coding genetic variants. It consists of two parts:

1. a procedure of variant annotation
2. a random-forest classifier using variant annotations to predict functional variants vs non-functional ones

GWAVA was published in 2014. As you can see from the [README](ftp://ftp.sanger.ac.uk/pub/resources/software/gwava/v1.0/README) from its [FTP site](ftp://ftp.sanger.ac.uk/pub/resources/software/gwava/v1.0/), it depends on some older versions of libs:

- `numpy==1.7.0`
- `scipy==0.11.0`
- `pandas==0.12.0`
- `scikit-learn==0.14.1`
- `pybedtools==0.6.4`
- `tabix` (0.2.5)

The source code can be found in the [_src_](ftp://ftp.sanger.ac.uk/pub/resources/software/gwava/v1.0/src/) folder on its FTP, or in the [_Supplementary Information_](http://www.nature.com/nmeth/journal/v11/n3/full/nmeth.2832.html#/supplementary-information) section on its _Nature Methods_ page.

Of course, it's better to establish an `virtualenv` specially to run GWAVA code. The project folder structure is like:

- {PROJECT}
    - _src_ (download fom FTP)
    - _annotated_ (Ditto)
    - _paper_data_ (Ditto)
    - _source_data_ (Ditto. Caution: >22G; plan ahead.)
    - _training_sets_ (Ditto)
    - _tmp_ (just `mkdir` a new folder; it's required but won't be created automatically by GWAVA)

## Issue 1: `numpy` compatibility

My current python2 version, `2.7.12`, is not compatible with such an old `numpy`, so I just installed the newest `numpy==1.11.1`.

## Issue 2: `tabix` installation

You can go with `apt install tabix` and probably get [tabix (1.2.1-2ubuntu1)](http://packages.ubuntu.com/xenial/tabix).

To install the specific version manually, go to [SAM tools](https://sourceforge.net/projects/samtools/files/tabix/) site to download and then run:

```bash
tar jxvf tabix-0.2.5.tar.bz2
cd tabix-0.2.5
make
cp bgzip tabix /YourBinFolder
```

### Update 2018-04-23

I met a `make` error today:

```txt
erik:tabix-0.2.5$ make
make[1]: Entering directory '/home/erik/Downloads/tabix-0.2.5'
gcc -g -Wall -O2 -fPIC  -o tabix main.o -lm  -lz -L. -ltabix
./libtabix.a(bgzf.o): In function `deflate_block':
/home/erik/Downloads/tabix-0.2.5/bgzf.c:311: undefined reference to `deflate'
/home/erik/Downloads/tabix-0.2.5/bgzf.c:313: undefined reference to `deflateEnd'
/home/erik/Downloads/tabix-0.2.5/bgzf.c:305: undefined reference to `deflateInit2_'
/home/erik/Downloads/tabix-0.2.5/bgzf.c:329: undefined reference to `deflateEnd'
/home/erik/Downloads/tabix-0.2.5/bgzf.c:345: undefined reference to `crc32'
/home/erik/Downloads/tabix-0.2.5/bgzf.c:346: undefined reference to `crc32'
./libtabix.a(bgzf.o): In function `inflate_block':
/home/erik/Downloads/tabix-0.2.5/bgzf.c:380: undefined reference to `inflateInit2_'
/home/erik/Downloads/tabix-0.2.5/bgzf.c:385: undefined reference to `inflate'
/home/erik/Downloads/tabix-0.2.5/bgzf.c:391: undefined reference to `inflateEnd'
/home/erik/Downloads/tabix-0.2.5/bgzf.c:387: undefined reference to `inflateEnd'
./libtabix.a(bedidx.o): In function `ks_getuntil':
/home/erik/Downloads/tabix-0.2.5/bedidx.c:11: undefined reference to `gzread'
./libtabix.a(bedidx.o): In function `bed_read':
/home/erik/Downloads/tabix-0.2.5/bedidx.c:103: undefined reference to `gzdopen'
/home/erik/Downloads/tabix-0.2.5/bedidx.c:138: undefined reference to `gzclose'
./libtabix.a(bedidx.o): In function `ks_getc':
/home/erik/Downloads/tabix-0.2.5/bedidx.c:11: undefined reference to `gzread'
./libtabix.a(bedidx.o): In function `bed_read':
/home/erik/Downloads/tabix-0.2.5/bedidx.c:103: undefined reference to `gzopen64'
collect2: error: ld returned 1 exit status
Makefile:41: recipe for target 'tabix' failed
make[1]: *** [tabix] Error 1
make[1]: Leaving directory '/home/erik/Downloads/tabix-0.2.5'
Makefile:18: recipe for target 'all-recur' failed
make: *** [all-recur] Error 1
erik:tabix-0.2.5$ make
make[1]: Entering directory '/home/erik/Downloads/tabix-0.2.5'
gcc -g -Wall -O2 -fPIC  -o tabix main.o -lm  -L. -ltabix -lz
gcc -c -g -Wall -O2 -fPIC  -D_FILE_OFFSET_BITS=64 -D_USE_KNETFILE  bgzip.c -o bgzip.o
```

I am not a C++ expert but I found a possible cause mentioned by [djcsdy](https://github.com/djcsdy/swfmill/issues/37#issuecomment-336618361):

> The problem was that the dynamic linking policy has changed in recent versions of GNU ld.

More details from [djcsdy](https://github.com/djcsdy/swfmill/commit/ecc04cfbd658d24ffd7de67d34963b2ee1aafb36)'s comments:

> This is required due to changes in DSO linking policy in recent versions of GNU ld.  
> <br/>
> Previously ld would automatically link transitive dependencies, but it no longer does so.  
> <br/>
> libpng depends on zlib, so we must now also explicitly link in zlib.  

The workaround is mentioned in [Undefined reference to _gzopen etc](https://stackoverflow.com/a/13149696). In my case, simply moving the `-lz` option to the end of line 41 of the Makefile would do:

```make
tabix:lib $(AOBJS)
		$(CC) $(CFLAGS) -o $@ $(AOBJS) -lm $(LIBPATH) -L. -ltabix -lz
```

## Issue 3: `pybedtools`, the python interface, needs its implementation, a binary lib `bedtools`

The latest `bedtools 2.25.0`, available via `apt`, is not back-compatible and would raise errors like:

```bash
***** ERROR: Unrecognized parameter: -ops *****
***** ERROR: Unrecognized parameter: freqdesc *****
```

even though `-ops` and `freqdesc` are "legal" options listed in its man page... (Jesus!)

From the title of the post [bedtools 2.18.2 and pybedtools 0.6.4](https://groups.google.com/forum/#!topic/bedtools-discuss/8kfkutrodKI) from [Google Group - bedtools-discuss](https://groups.google.com/forum/#!forum/bedtools-discuss) by _Aaron Quinlan_, one of the developers of `bedtools`, we can see that we should use `bedtools 2.18.2`.

`bedtools` was originally hosted on [Google Code - bedtools](https://code.google.com/archive/p/bedtools/), but now on [Github - arq5x/bedtools2](https://github.com/arq5x/bedtools2/releases). Follow [this document](http://gensoft.pasteur.fr/docs/bedtools/2.19.1/content/installation.html) to install:

```bash
tar -zxvf bedtools-2.18.2.tar.gz
cd bedtools-2.18.2
make
cp ./bin/bedtools /usr/local/bin
```

If you don't want to mess up your `/usr/local/bin` directory, add the following line to `gwava_annotate.py`:

```python
# pybedtools.set_bedtools_path("~/Downloads/bedtools-2.18.2/bin")  # WRONG. See update 2018-11-13
```

You can get other versions rather than `2.25.0` of `bedtools` by `apt`, but I am not sure whether those versions are compatible or not. See [Ubuntu - bedtools package](https://launchpad.net/ubuntu/+source/bedtools) for more details.

### Update 2018-11-13

Python cannot recognize `~` as home path. So use either full path like

```python
pybedtools.set_bedtools_path("/home/erik/Downloads/bedtools-2.18.2/bin")
```

or `os.path.expanduser`:

```python
import os

pybedtools.set_bedtools_path(os.path.expanduser("~/Downloads/bedtools-2.18.2/bin"))
```

## Issue 4: nobody ever told me that `samtools` is required...

... and which version?

Luckily, the [Availability and Requirements](http://bmcresnotes.biomedcentral.com/articles/10.1186/1756-0500-7-618#Sec16) section of a 2014 paper, _SPANDx: a genomics pipeline for comparative analysis of large haploid whole genome re-sequencing datasets_, indicated:

> Other requirements: ... SAMtools 0.1.19, BEDTools 2.18.2...

Well, let's use `samtools 0.1.19`. (SMH...) And this time finally we can just use `apt install samtools`! Yikes! See [Ubuntu - samtools package](https://launchpad.net/ubuntu/+source/samtools) for more details.