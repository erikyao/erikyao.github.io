---
layout: post
title: "设计 Service 的一些经验"
description: ""
category: as-a-coder
tags: [Discernment-Design]
---
{% include JB/setup %}


## 1. 接口粒度设计

　　Dao 接口应该 raw 一点，更贴近 DB，细粒度一点（接受参数列表），参数多一点。  

　　Service 接口应该是 “应用定制型”，粗粒度一点（比如接受对象参数），参数少一点。  

　　如：CouponDao.getCoupon() 我们可以传一个 status 参数；但是 CouponService.getCoupon() 就没必要用 status 参数了，线上没有拿 STATUS_USED 券的应用场合，调用 CouponDao.getCoupon() 时直接把 status = STATUS_AVAIL 写死就可以

## 2. 大原则：不要自己空想！

　　从 Controller 和前端接口文档入手，Controller 需要啥就写啥！

## 3. 拆分 Service

　　不知道把方法放到哪个 Service 或是不知道该不该新建一个 Service 时，直接把新方法写到最大的 Service 里，等接口多了，再来拆分 Service。  

　　拆分 Service 的原则：

1. 返回类型一致的方法可以放到同一个 Service 里；
2. 使用同一套 dao 的方法可以放到同一个 Service 里；
3. 现实本体（程序是对现实世界的模拟，那么方法、类都是模拟了现实世界的一部分，这个部分我们成为现实本体）明显是同类的方法可以放到同一个 Service 里，比如 BasketBallService 的 timeout、substitution、dnp 方法就应该 extract 到 CoachService

## 4. 如果是长时间的后台处理，且前端可以暂时不返回正确结果的，用 ExecutorService