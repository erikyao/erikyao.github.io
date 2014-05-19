---
layout: post
title: "jbpm 4.3 variable 的 name 和 mapped-name"
description: ""
category: jBPM-4.3
tags: []
---
{% include JB/setup %}

　　看似是一个 variable 有 name 和 mapped-name 两个名称，其实情况很复杂。看例子。  

　　假定我们有一个极其简单的流程 vartest。在 start-state 的 controller 里添加一个 variable，name 为 "var"，mapped-name 为 "variable"，如下：

<pre class="prettyprint linenums">
&lt;?xml version="1.0" encoding="UTF-8"?&gt;  
  
&lt;process-definition  xmlns=""  name="vartest"&gt;  
  
	&lt;start-state name="start-state1"&gt;  
		&lt;task&gt;  
			&lt;controller&gt;  
				&lt;variable access="read,write" name="var" mapped-name="variable"&gt;&lt;/variable&gt;  
			&lt;/controller&gt;  
		&lt;/task&gt;  
		&lt;transition to="task-node1"&gt;&lt;/transition&gt;  
	&lt;/start-state&gt;  
  
	&lt;task-node name="task-node1"&gt;   
		&lt;transition to="end-state1"&gt;&lt;/transition&gt;  
	&lt;/task-node&gt;  
  
	&lt;end-state name="end-state1"&gt;&lt;/end-state&gt;  
  
&lt;/process-definition&gt;
</pre>

　　然后我们来写一个 Test Case：
	
<pre class="prettyprint linenums">
public class AccessVariable extends TestCase {
	public void testPayProcess() throws Exception {  
        JbpmContext jc = JbpmConfiguration.getInstance().  
                createJbpmContext();  
          
        ProcessDefinition pd = jc.getGraphSession().  
                findLatestProcessDefinition("vartest");  
        ProcessInstance pi = pd.createProcessInstance();  
        ContextInstance ci = pi.getContextInstance();  
        TaskInstance ti = pi.getTaskMgmtInstance().createStartTaskInstance()  
          
        // hint 1:  
        // ci can create new variable (not declared in &lt;controller&gt;)  
        // and ti can access the variable ci created  
        ci.setVariable("abc", "ABC");  
        System.out.println(ti.getVariable("abc")); // ABC  
        ti.setVariable("abc", "CBA");  
        System.out.println(ci.getVariable("abc")); // CBA  
      
        // hint 1:     
        // also, ti can create this kind of variables  
        // and ci can access the variable ti created  
        ti.setVariable("def", "DEF");  
        System.out.println(ci.getVariable("def")); // DEF      
        ci.setVariable("def", "FED");  
        System.out.println(ti.getVariable("def")); // FED  
          
        // hint 2:         
        // for the variables declared in &lt;controller&gt;, it's the same situation  
        // both ci and ti can create and access this kind of variable  
        ci.setVariable("var", "VAR");  
        System.out.println(ti.getVariable("var")); // VAR  
        ti.setVariable("var", "RAV");  
        System.out.println(ci.getVariable("var")); // RAV  
  
        // hint 3:     
        // "var" doesn't affect "variable"  
        System.out.println(ti.getVariable("variable")); // null  
        System.out.println(ci.getVariable("variable")); // null  
  
        // hint 4:     
        // things becaome a little different when using mapped-name  
        ti.setVariable("variable", "VARIABLE");  
        System.out.println(ti.getVariable("variable")); // VARIABLE  
        System.out.println(ci.getVariable("variable")); // null  
      
        // hint 4:     
        // it's clear that ti and ci both holds an "variable", respectively  
        ci.setVariable("variable", "ELBAIRAV");  
        System.out.println(ti.getVariable("variable")); // VARIABLE  
        System.out.println(ci.getVariable("variable")); // ELBAIRAV  
  
        // hint 3:     
        // and "variable" doesn't affect "var"  
        System.out.println(ti.getVariable("var")); // RAV  
        System.out.println(ci.getVariable("var")); // RAV  
              
        ti.end();  
        pi.end();  
        jc.close();  
    }
}
</pre>

　　可以看出，除了 mapped-name 之外，ti 和 ci 可以随意 setVariable(key, value)，setVariable 的过程包含了 create 的过程，key 可以是 name，也可以是其他字符串，且这种类型的变量 (名称为 name 或是任意字符串，只要不是 mapped-name) ti 和 ci 可以随意访问，这类变量对 ti 和 ci 的作用域是一样的 (类似于全局变量)。  

　　但 name 和 mapped-name 变量没有任何关系，如 hint 3 所示，"var" 的值不会影响 "variable"，反过来 "variable" 的值也不会影响 "var"。  

　　且 mapped-name 变量对 ti 和 ci 来说更像是2个变量，其作用域严格区分，没有任何交集，如 hint 4 所示。  