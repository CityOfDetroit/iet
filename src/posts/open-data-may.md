---
title: "Open Data changelog"
date: "2018-06-04"
tags: ["open-data", "open-data-changelog"]
---

## May 2018

### New datasets

- Board Authorities: https://data.detroitmi.gov/d/wwzh-yfn6

### Existing datasets

- Right of Way permits now include all types of permits issued by BSEED for construction in the public right of way, instead of just road barricades: https://data.detroitmi.gov/d/rj7w-r8ts

- The parcel map was updated with new parcel shapes: https://data.detroitmi.gov/d/fxkw-udwf

### New tools built with open data

Have you ever searched for DDOT bus schedules on [detroitmi.gov](http://www.detroitmi.gov/)? If you have, you've probably found [this page](http://www.detroitmi.gov/How-Do-I/Locate-Transportation/Bus-Schedules), downloaded a ~1MB PDF, and spent too long rotating, zooming or pinching your phone screen until you could read it. 

For the last few months, we've been excitedly working with DDOT to build an alternative - a web application to find schedules as well as real-time arrival information for DDOT buses. You can preview it at this temporary URL - [ddot.fun](https://ddot.info/) - and share feedback using the green comment button in the upper right.

A few new features to look out for:
- __Bookmarkable pages__: Each route and bus stop has a unique URL like https://ddot.info/route/53 or https://ddot.fun/stop/1118
- __Time awareness__: We show [active buses on a map](https://ddot.info/route/17), [highlight current trips](https://ddot.fun/stop/420/), and default to the current service day when [viewing a fixed schedule](https://ddot.fun/route/22/schedule)
- __Location awareness__: From the homepage, you can find routes and bus stops within a 5-20 minute walk of your current location

This app is built on [GTFS](https://data.detroitmi.gov/d/y62d-bvsz) data and the [OneBusAway API](http://developer.onebusaway.org/modules/onebusaway-application-modules/1.1.14/api/where/index.html).

Check it out and let us know what you think!
