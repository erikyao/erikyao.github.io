---
layout: post
title: "Generative Models"
description: ""
category: Machine-Learning
tags: [generative]
---
{% include JB/setup %}

```java
public interface MixtureModel {
    public Assumption asm = "We know how the instances from each class are distributed, so we can decompose the mixture (of instances) into individual classes.";
}

public abstract class GenerativeModel {
    private ConditionalProbability cp;
    private PriorProbability pp;
    private ClassConditionalProbabability cpp;
    
    public ConditionalProbability calculateConditionalProbability() {
        this.cp = Bayes.calculateConditionalProbabilityFrom(this.pp, this.cpp)
    }

    public generateXY() {
        return this.cp.generate()
    }
}

public class GaussianMixtureModel extends GenerativeModel implements MixtureModel {
    private ParameterSet theta;
    
    public GaussianMixtureModel(x, y) {
        this.theta = Algortithm.MLE(x, y);
        
        this.pp = new PriorProbability(new MultivariateGaussianDistribution(theta, x, y));
        this.cpp = new ClassConditionalProbabability(new DiscreteDistribution(theta, y));
    }
}

public class MultinomialMixtureModel extends GenerativeModel implements MixtureModel {
    private ParameterSet theta;
    
    public MultinomialMixtureModel(x, y) {
        this.theta = Algortithm.MLE(x, y);
        
        this.pp = new PriorProbability(new MultinomialDistribution(theta, x, y));
        this.cpp = new ClassConditionalProbabability(new DiscreteDistribution(theta, y));
    }
}

public class HiddenMarkovModel extends GenerativeModel implements MixtureModel {
    // TODO
}

```