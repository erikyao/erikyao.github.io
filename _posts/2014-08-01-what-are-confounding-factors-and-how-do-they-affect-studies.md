---
layout: post
title: "What are Confounding Factors and How do they Affect Studies?"
description: ""
category: Math 
tags: [Math-Statistics]  
---  
{% include JB/setup %}  
  
confound 的意思是：

* to confuse; to puzzle;
	* The strategy confounded our opponents.
	* The murder case has confounded investigators.
* to put to shame; to cause to be ashamed; to abash; 简单说就是 "打脸"
	* The school's team confounded all predictions and won the game.
	* The success of the show confounded critics.
* from Latin confundere ("to pour together, confuse"), from com- + fundere ("to pour")
-----
  
摘自 [What are Confounding Factors and How do they Affect Studies?](http://www.stats.org/faq_factors.htm)。做排版。

-----

Designing a study is not easy. Suppose we want to understand the relationship between obesity ([əʊ'bi:sɪtɪ], 肥胖) and morbidity ([mɔ:'bɪdətɪ], 发病率). Do obese people die earlier than normal-weight people? If we just compare the numbers – i.e. compare the rates of death for these two groups – we might find a misleading story. What if obese people are also more likely to drive rather than walk, increasing the rate of deaths due to car accidents? What if thin people are more likely to binge [bɪndʒ] on (沉溺于) alcohol, increasing the rate of death by alcohol-related illnesses? Risk factors that affect the results of a study are called confounding factors. They play an extremely important role in the design and statistical analysis of any study involving human behavior, both biological and social.

Confounding factors can have a huge impact on the results of both controlled and observational studies. Researchers do not always consider the impact of these factors, especially when the research itself is not done by professionals. A recent example is an [ABC poll](http://abcnews.go.com/Primetime/News/story?id=180291) (ABC is American Broadcasting Corporation, Inc) that found that Democrats ['deməkræt] were less satisfied with their sex lives than Republicans [rɪˈpʌblɪkən]. But women are also less satisfied with their sex lives than men, and more Democrats are women than Republicans. How do we know whether the correlation between happy sex lives and political affiliation [əˌfɪliˈeɪʃn] is an honest relationship, or just a side effect of the gender differences between Democrats and Republicans? A simple "adjustment" for the confounding factor (in this case, gender) would solve the problem.

While there are standard statistical techniques to adjust for these confounding factors, at times it’s not clear whether some factor is confounding or not. In a recent [controversy](http://www.stats.org/stories/will_a_few_extra_pounds_may24_05.htm) ['kɒntrəvɜ:sɪ] over obesity, the Centers for Disease Control (CDC) published a study indicating that slightly overweight people live longer than thin people. The Harvard School of Public Health and the American Cancer Society later criticized the results, noting that more of the thin people were sick (and were thin because they were sick) than the overweight people.

In this case, illness was a confounding factor that had not been considered by the CDC. While it may seem obvious in retrospect, it can, when designing a study, be difficult to anticipate every possible confounder. And even if it had been brought to the attention of the CDC that there were more sick people among the group of thin people, the researchers may have wondered whether the thinness caused the illness, rather than the other way around. If people were sick because they were thin, then illness would not be a confounding factor.

Confounding factors can be accounted for using statistical techniques. Typical confounders include age, gender, smoking, and income, but there may be many other (possibly subtle or controversial) factors. If a study doesn’t consider confounding factors (especially an obvious one such as the gender gap of poll respondents (民意调查的受访者)), don’t believe it.

-----

Deal with protential confounder by randomization and blocking:

1. Fix a variable
2. If you cannot fix a variable, stratify it
	* e.g. to use different value equally.
3. Or randomize it
