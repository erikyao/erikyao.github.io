---
layout: post
title: "Python: Use <i>datatime</i> instead of <i>time</i> for local clocks"
description: ""
category: Python
tags: []
---
{% include JB/setup %}

_Effective Python Item 45: Use datetime Instead of time for Local Clocks_

- UTC: [Coordinated Univeral Time](https://www.timeanddate.com/time/aboututc.html)
    - The abbreviation looks insane, but it is on purpose. [Why is it Called UTC – not CUT?](https://www.timeanddate.com/time/utc-abbreviation.html)
    - UTC is the standard, time-zone-independent time.
- Unix Epoch: 00:00:00 UTC, Thursday, 1 January 1970
- Unix Timestamp: number of seconds since Unix Epoch

## The built-in `time` module

- `time.time()`: returns the current timestamp (timestamps are in UTC by definition).
- `time.localtime(timestamp)`: convert a timestamp to a `struct_time` in local time **which matches the your computer's time zone**
- `time.localtime(timestamp)`: convert a timestamp to a `struct_time` in UTC.
- `time.mktime(struct_time)`: convert a `struct_time` to a timestamp
- `time.strftime(fmt_str, struct_time)`: convert a `struct_time` to a string of format defined by `fmt_str`
- `time.strptime(time_str, fmt_str)`: convert a string representation of time to a `struct_time` following the format defined by `fmt_str`

```python
>>> from time import time, localtime, gmtime, mktime, strftime, strptime, 
>>> time()
1507148549.8972251
>>> localtime(time())
time.struct_time(tm_year=2017, tm_mon=10, tm_mday=4, tm_hour=13, tm_min=22, tm_sec=56, tm_wday=2, tm_yday=277, tm_isdst=1)
>>> gmtime(time())
time.struct_time(tm_year=2017, tm_mon=10, tm_mday=4, tm_hour=20, tm_min=29, tm_sec=54, tm_wday=2, tm_yday=277, tm_isdst=0)
```

```python
>>> now = time()
>>> lt = localtime(now)
>>> ut = gmtime(now)
>>> now
1507149240.3904614
>>> mktime(lt)
1507149240.0
>>> mktime(ut)
1507178040.0
```

```python
>>> strftime('%Y-%m-%d %H:%M:%S', localtime(time()))
'2017-10-04 13:24:03'
>>> strptime('2017-10-04 13:24:03', '%Y-%m-%d %H:%M:%S')
time.struct_time(tm_year=2017, tm_mon=10, tm_mday=4, tm_hour=13, tm_min=24, tm_sec=3, tm_wday=2, tm_yday=277, tm_isdst=-1)
```

The limitation of `time` module is that you cannot get the time of other time zones, even if you can specify the time zones in your string representation of time.

```python
>>> fmt_str = '%Y-%m-%d %H:%M:%S %Z'  # %Z for time zones
>>> depart_sfo = '2017-10-04 13:24:03 PDT'  # I live in PDT zone
>>> strptime(depart_sfo, fmt_str)
time.struct_time(tm_year=2017, tm_mon=10, tm_mday=4, tm_hour=13, tm_min=24, tm_sec=3, tm_wday=2, tm_yday=277, tm_isdst=1)
>>> arrival_nyc = '2017-10-04 22:24:03 EDT'
>>> strptime(arrival_nyc, fmt_str)Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "/usr/lib/python3.5/_strptime.py", line 504, in _strptime_time
    tt = _strptime(data_string, format)[0]
  File "/usr/lib/python3.5/_strptime.py", line 343, in _strptime
    (data_string, format))
ValueError: time data '2017-10-04 22:24:03 EDT' does not match format '%Y-%m-%d %H:%M:%S %Z'
```

The problem here is the platform-dependent nature of the `time` module. Its actual behavior is determined by how the underlying C functions work with the host operating system. This makes the functionality of the `time` module unreliable in Python. The `time` module fails to consistently work properly for multiple local times. Thus, you should avoid the `time` module for this purpose. If you must use `time`, only use it to convert between UTC and the host computer’s local time. For all other types of conversions, use the `datetime` module.

## The built-in `datetime` module + `pytz`

`datetime` module is totally object-oriented, containing 6 classes:

- `date` with attributes `year`, `month` and `day`
- `time` with attributes `hour`, `minute`, `second`, `microsecond`, and `tzinfo`
- `datetime`, a combination of a `date` and a `time`
- `timedelta`
- `tzinfo`, an abstract base class for time zone information objects
- `timezone`, which implements `tzinfo`

However, there is only one time zone defined in `datetime`, `timezone.utc`. `pytz` solves this problem by providing every time zone definition you might need.

```python
>>> from datetime import datetime
>>> import pytz
>>> pdt = pytz.timezone('US/Pacific')
>>> edt = pytz.timezone('US/Eastern')
>>> pdt_now = datetime.now()  # local time in my time zone, PDT
>>> pdt_now
datetime.datetime(2017, 10, 4, 14, 36, 33, 786393)
>>> pdt_now = pdt.localize(pdt_now)  # add `tzinfo` to the naive `datetime` object
>>> pdt_now
datetime.datetime(2017, 10, 4, 14, 36, 33, 786393, tzinfo=<DstTzInfo 'US/Pacific' PDT-1 day, 17:00:00 DST>)
>>> edt_now = pdt_now.astimezone(edt)  # change time zone to EDT
>>> edt_now
datetime.datetime(2017, 10, 4, 17, 36, 33, 786393, tzinfo=<DstTzInfo 'US/Eastern' EDT-1 day, 20:00:00 DST>)
```