---
layout: post-mathjax
title: "Digest of <i>Molecular Biology for Computer Scientists</i>"
description: ""
category: Biology
tags: [Biology-101]
---
{% include JB/setup %}

## 1. What Is Life?

Another approach to defining “life” is to recognize its fundamental interrelatedness. All living things are related to each other. Any pair of organisms, no matter how different, have a common ancestor sometime in the distant past. Organisms came to differ from each other, and to reach modern levels of complexity through evolution.

Evolution has three components: 

- **Inheritance**, the passing of characteristics from parents to offspring; 
- **Variation**, the processes that make offspring other than exact copies of their parents; and 
	- In order to evolve, there must be a source of variation in the inheritance.
	- Sources of variation include mutation, sexual recombination and genetic rearrangements.
		- Most mutations are neutral or deleterious, and evolutionary change by mutation is a very slow, random search of a vast space.
		- Sex, the ability of two successful organisms to combine bits of their genomes into an offspring, produces variants with a much higher probability of success.
	- Given enough time, the search of the variation space has produced many viable organisms.
- **Selection**, the process that differentially favors the reproduction of some organisms, and hence their characteristics, over others.
	- Selection is the process by which it is determined which variants will persist, and therefore also which parts of the space of possible variations will be explored.

These three factors define an evolutionary process. Perhaps the best definition of life is that it is  the result of the evolutionary process taking place on Earth.

I have likened evolution to a search through a very large space of possible organism characteristics. That space can be defined quite precisely. All of an organism’s inherited characteristics are contained in a single messenger molecule: deoxyribonucleic ([di:ˌɒksi:raɪbəʊnu:'kli:ɪk]) acid, or DNA. 

- The particular genetic encoding for an organism is called its **genotype**. 
- The resulting physical characteristics of an organism is called its **phenotype**.

In the search space metaphor, every point in the space is a genotype. Evolutionary variation identifies the legal moves in this space. Selection is an evaluation function that determines how many other points a point can generate, and how long each point persists.

- It is worth noting that search happens in genotype space, but selection occurs on phenotypes.

### Prokaryotes & Eukaryotes, Yeasts & People

Since Aristotle, scholars have tried to group these myriad ([ˈmɪriəd], 大量的) species into meaningful classes. This pursuit remains active, and the classifications are, to some degree, still controversial. Traditionally, these classifications have been based on the **morphology** of organisms. Literally, morphology means shape, but it is generally taken to include internal structure as well. **Morhpology is only part of phenotype**, however; other parts include physiology (the functioning of living structures) and development.

- physiology: [ˌfɪziˈɒlədʒi], 生理机能, 生理学
- development: The process by which a mature multicellular organism or part of an organism is produced by the addition of new cells, 发育

Here I will follow _Woese, Kandler & Wheelis (1990)_, although some aspects of their taxonomy are controversial. They developed their classification of organisms by using distances based on sequence divergence in a ubiquitous piece of genetic sequence as shown in Figure 1.

![](https://bn1304files.storage.live.com/y3pG_a76LanBU0Kl8f5NfN5ykByNH20sSP41pmlZAwAvn8qjvYR5-b8Ap-u-Le58Mapu9GkLIhyZFPjt1dGaJdEo1KlEnezXmEbJDUeZgoHAocH7DWCDJFEuDsQpdx9v_jD1JLbEOVeXs4EjrPpkzFzJw/figure-01.png?psid=1&width=548&height=454&cropMode=center)

- elide: [iˈlaɪd], to omit; to suppress or alter (as a vowel or syllable); to strike out (as a written word)

更多内容参考 [Taxonomic Ranks](/biology/2015/07/28/taxonomic-ranks/).

### Evolutionary Time and Relatedness

There are a variety of ways to estimate how long ago two organisms diverged; that is, the last time they had a common ancestor. The more related two species are, the more recently they diverged.

Growing knowledge of the DNA sequences of many genes in many organisms makes possible estimates of the time of genetic divergence directly, by comparing their genetic sequences. If the rate of change can be quantified, and standards set, these differences can be translated into a “molecular clock”. The underlying and somewhat controversial assumption is that in some parts of the genome, the rate of mutation is fairly constant.

In order to get a rough idea of the degrees of relatedness among creatures, it is helpful to know the basic timeline of life on Earth.

- The oldest known fossils, stromalites found in Australia, indicate that life began at least 3.8 billion years ago. Geological evidence indicates that a major meteor impact about 4 billion years ago vaporized all of the oceans, effectively destroying any life that may have existed before that.
- Life remained like that for nearly 2 billion years. Then Eukarya came into being. There is evidence that eucarya began as symbiotic collections of simpler cells which were eventually assimilated and became organelles. Therefore, single-celled eukarya become very complex.
- The next major change in the history of life was the invention of sex.

An important difference between multicellular organisms and a colony of unicellular organisms (e.g. coral) is that multicellular organisms have separated germ (reproductive) cells from somatic (all the other) cells.

- Sperm and eggs are germ cells.
- All the other kinds of cells in the body are somatic. E.g. skin cells, or nerve cells, and blood cells.
- Both kinds of cells divide (细胞分裂) and create more of the same kind of cell, but only germ cells make new organisms. 

更多内容参考 [Cell Cycle](/biology/2015/07/29/cell-cycle/).

Multicellular organisms all begin their lives from a single cell, a fertilized egg. From that single cell, all of the specialized cells arise through a process called cellular differentiation (细胞分化).

## 2. Living Parts: Tissues, Cells, Compartments and Organelles

The main advantage multicellular organisms possess over their single-celled competitors is cell specialization. Groups of cells specialized for a particular function are **tissues**, and their cells are said to have differentiated. Differentiated cells (except reproductive cells) cannot reproduce an entire organism.

Yet despite all of this variation, all of the cells in a multicellular organism have exactly the same genetic code. The differences between them come from differences in **gene expression**. Genes code for products that turn on and off other genes, which in turn regulate other genes, and so on.

The composition of cells:

- Membranes
	- All present day cells have a phospholipid cell membrane. 
	- Phospholipids are lipids (oils or fats) with a phosphate group attached. The end with the phosphate group is hydrophillic (attracted to water) and the lipid end is hydrophobic (repelled by water). 
	- Cell membranes consist of two layers of these molecules, with the hydrophobic ends facing in, and the hydrophillic ends facing out. This keeps water and other materials from getting through the membrane, except through special pores or channels.
- Proteins
- Genetic material
	- In Bacteria, the DNA is generally circular. 
	- In Eukaryotes, the DNA is linear.
	- Some viruses (like the AIDS virus) store their genetic material in RNA.
- Nuclei 
	- Nuclei are the defining feature of Eucaryotic cells
- Cytoplasm
	- Cytoplasm is the name for the gel-like collection of substances inside the cell.
- Ribosomes
	- The function of ribosomes is to assemble proteins.
	- The process of translating genetic information into proteins occurs within ribosomes.
- Mitochondria and Chroloplasts
- Other Parts of Cells

更多内容参考 [Eukaryotic Cell Structure](/biology/2015/07/30/eukaryotic-cell-structure/).

## 3. Life as a Biochemical Process

More and more of the functions of life (e.g. cell division, immune reaction, neural transmission) are coming to be understood as the interactions of complicated, self-regulating networks of chemical reactions. The substances that carry out and regulate these activities are generally referred to as **biomolecules**. Biomolecules include proteins, carbohydrates, lipids—all called **macromolecules** because they are relatively large—and a variety of small molecules.

The genetic material itself is also now known to be a particular macromolecule: DNA.

Life can be seen as a kind of information processing. The processes that transform matter and energy in living systems do so under the direction of a set of symbolically encoded instructions, i.e. the genomes.

## 4. The Molecular Building Blocks of Life

Living systems process matter, energy and information.

- The basic units of matter are proteins, which subserve all of the structural and many of the functional roles in the cell;
- The basic unit of energy is a phosphate bond in the molecule adenosine triphosphate (ATP); 
- The basic units of information are four nucleotides, which are assembled together into DNA and RNA.

The chemical composition of living things is fairly constant across the entire range of life forms. 

- About 70% of any cell is water. 
- About 4% are small molecules like sugars, inorganic ions and ATP. 
- Proteins make up between 15% and 20% of the cell. 
- DNA and RNA range from 2% to 7% of the weight. 
- The cell membranes, lipids and other, similar molecules make up the remaining 4% to 7%.

### 4.1 Energy

Living things obey all the laws of chemistry and physics, including the second law of thermodynamics, which states that the amount of entropy (disorder) in the universe is always increasing. The consumption of energy is the only way to create order in the face of entropy. Life doesn’t violate the second law; living things capture energy in a variety of forms, use it to create internal order, and then transfer energy back to the environment as heat. An increase in organization within a cell is coupled with a greater increase in disorder outside the cell.

Energy is taken out of ATP by the process of hydrolysis, which removes the outermost phosphate group, producing the molecule adenosine diphosphate (ADP). This process generates about 12 kcal (kilocalorie) per mole of ATP, a quantity appropriate for performing many cellular tasks. The energy “charge” of a cell is expressed in the ratio of ATP/ADP and the electrochemical difference between the inside and the outside of the cell (which is called the transmembrane potential). If ATP is depleted, the movement of ions caused by the transmembrane potential will result in the synthesis of additional ATP. If the transmembrane potential has been reduced (for example, after a neuron fires), ATP will be consumed to pump ions back across the gradient and restore the potential.

ATP is involved in most cellular processes, so it is sometimes called a currency metabolite. ATP can also be converted to other high energy phosphate compounds such as creatine phosphate, or other nucleotide triphosphates. In turn, these molecules provide the higher levels of energy necessary to transcribe genes and replicate chromosomes. Energy can also be stored in different chemical forms like carbohydrates and fats.

### 4.2 Proteins

Proteins are the primary components of living things, and they play many roles. 

- Proteins provide structural support and the infrastructure that holds a creature together; 
- they are enzymes that make the chemical reactions necessary for life possible; 
- they are the switches that control whether genes are turned on or off; 
- they are the sensors that see and taste and smell, and the effectors that make muscles move; 
- they are the detectors that distinguish self from nonself and create an immune response. 

Finding the proteins that make up a creature and understanding their function is the foundation of explanation in molecular biology.

Despite their radical differences in function, all proteins are made of the same basic constituents: the amino acids. Each amino acid shares a basic structure, consisting of 

- a central carbon atom (C), 
- an amino group (NH3) at one end, 
- a carboxyl group (COOH) at the other, and 
- a variable sidechain (R), 

as shown in Figure 2.

![](https://bn1304files.storage.live.com/y3pVATuFIYAGf9mxqF0ZQeV3_0tSflG6XOu48LbjbiakbxrpTVDf9iU_TS41SXYUKHdpZB72F5UcenaR3RE_efmLXxRJ_-vWhy42YUzPYSQ5ibSDOszKYcqWTbxXEv5AANrEpVnU7bMvt2YKwrRABU4FA/figure-02.png?psid=1&width=585&height=334&cropMode=center)

Under biological conditions the amino end of the molecule is positively charged, and the carboxyl end is negatively charged. Chains of amino acids are assembled by a reaction that occurs between the nitrogen atom at the amino end of one amino acid and the carbon atom at the carboxyl end of another, bonding the two amino acids and releasing a molecule of water. The linkage is called a peptide bond, and long chains of amino acids can be strung together into polymers, called polypeptides.

When a peptide bond is formed, the amino acid is changed (losing two hydrogen atoms and an oxygen atom), so the portion of the original molecule integrated into the polypeptide is often called a **residue**. The sequence of amino acid residues that make up a protein is called the protein’s **primary structure**. The primary structure is directly coded for in the genetic material.

It is interesting to note that only a small proportion of the very many possible polypeptide chains are naturally occurring proteins. Computationally, this is unsurprising.

The twenty naturally occuring amino acids all have the common elements shown in Figure 2. The varying parts are called **sidechains**; the two carbons and the nitrogen in the core are sometimes called the **backbone**. Peptide bonds link together the backbones of a sequence of amino acids. That link can be characterized as having two degrees of rotational freedom, the phi (\\( \phi \\)) and psi (\\( \psi \\)) angles (although from the point of view of physics this is a drastic simplification, in most biological contexts it is valid). The conformation of a protein backbone (i.e. its shape when folded) can be adequately described as a series of \\( \phi/\psi \\) angles, although it is also possible to represent the shape using the Cartesian coordinates ([kɑ:ˈti:ziən], 笛卡尔坐标系) of the central backbone atom (the alpha carbon, written \\( C\alpha \\)), or using various other representational schemes (see, e.g., Hunter or Zhang & Waltz in this volume).

Exactly how the properties of the amino acids in the primary structure of a protein interact to determine the protein’s ultimate conformation remains unknown. The chemical properties of the individual amino acids, however, are known with great precision. These properties form the basis for many representations of amino acids, e.g. in programs attempting to predict structure from sequence. Here is a brief summary of some of them:

- _Glycine_: ['glaɪsi:n], 甘氨酸, \\( C\_2H\_5NO\_2 \\)
	- Glycine is the simplest amino acid: 
		- Its sidechain is a single hydrogen atom. 
		- It is nonpolar, and does not ionize easily.
			- The **polarity** (极性) of a molecule refers to the degree that its electrons are distributed asymmetrically. A nonpolar molecule has a relatively even distribution of charge. 
			- **Ionization** (电离) is the process that causes a molecule to gain or lose an electron, and hence become charged overall. The distribution of charge has a strong effect on the behavior of a molecule (e.g. like charges repel).
	- Another important characteristic of glycine is that as a result of having no heavy (i.e. non-hydrogen) atoms in its sidechain, it is very flexible. That flexibility can give rise to unusual kinks in the folded protein.
- _Alanine_: ['æləni:n], 丙氨酸, \\( C\_3H\_7NO\_2 \\)
	- Alanine is also small and simple; its sidechain is just a methyl (['meθɪl] or ['meθəl], 甲基) group (consisting of a carbon and three hydrogen atoms).
	- Alanine is one of the most commonly appearing amino acids.
	- Glycine and alanine’s sidechains are **aliphatic** ([ˌælə'fætɪk], 脂肪族的), which means that they are straight chains (no loops) containing only carbon and hydrogen atoms. 
		- There are three other aliphatic amino acids: 
			- _valine_: ['væli:n], 缬氨酸, \\( C\_5H\_{11}NO\_2 \\)
			- _leucine_: ['lu:si:n], 亮氨酸, \\( C\_6H\_{13}NO\_2 \\)
			- _isoleucine_: [ˌaɪsə'lu:ˌsi:n], 异亮氨酸, \\( C\_6H\_{13}NO\_2 \\)
		- The longer aliphatic sidechains are hydrophobic ([ˌhaɪdrə'fəʊbɪk]). Hydrophobicity ([haɪdrəfəʊ'bɪsɪtɪ]) is one of the key factors that determines how the chain of amino acids will fold up into an active protein. Hydrophobic residues tend to come together to form compact core that exclude water. Because the environment inside cells is aqueous ([ˈeɪkwiəs], primarily water), these hydrophobic residues will tend to be on the inside of a protein, rather than on its surface.
- In contrast to alanine and glycine, the sidechains of amino acids _phenylalanine_, _tyrosine_ and _tryptophan_ are quite large.
	- _phenylalanine_
	- _tyrosine_
	- _tryptophan_