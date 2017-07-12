---
layout: post
title: "ScheduledExecutorService.scheduleAtFixedRate() 注意事项两则"
description: ""
category: Java
tags: [Java-101]
---
{% include JB/setup %}

## `ScheduledExecutorService.scheduleAtFixedRate()` 内部任务发生异常时，不会继续定时运行

```java
ScheduledExecutorService exec = Executors.newSingleThreadScheduledExecutor();
exec.scheduleAtFixedRate(new Runnable() {
    @Override
    public void run() {
        System.out.println( "running");
        throw new NullPointerException();
    }
}, 0, 1, TimeUnit.SECONDS);
```

如上：如果 `run()` 抛了异常，则只能执行一遍，后面不执行

## `ScheduledExecutorService.scheduleAtFixedRate()` 内部任务的执行时间会影响定时运行的频率

```java
ScheduledExecutorService exec = Executors.newSingleThreadScheduledExecutor();
exec.scheduleAtFixedRate(new Runnable() {
    @Override
    public void run() {
        try {
            Thread.sleep(2000);
            System.out.println("sleep " + new Date());
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}, 0, 1, TimeUnit.SECONDS);
```

如上：虽然是每秒执行一次，但是 sleep 了两秒，所以还是每两秒 sysout 一条出来