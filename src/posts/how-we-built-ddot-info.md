---
title: "How we built ddot.info"
date: "2018-07-12"
tags: ["web-app", "gtfs", "onebusaway", "buses"]
---

Earlier this week, a bus schedule tool we built in partnership with Detroit's Department of Transportation (DDOT) was [announced on social media](https://www.facebook.com/RideDDOT/videos/vb.419710504742021/1841950199184704/?type=3&theater). We designed this tool to help bus riders find schedules and realtime arrival predictions for all DDOT routes and bus stops. You can check it out at [ddot.info](https://ddot.info/). 

It's in "beta" mode leading up to big September service changes, and we're gathering and incorporating feedback through this [web form](https://app.smartsheet.com/b/form/28665a43770d48b5bbdfe35f3b7b45ac) in the meantime - so let us know what you think!

In this post, rather than talk about features of the app (which you can find at [ddot.info/about](https://ddot.info/about) if you're interested), we'll dive deep into our tools, methods, and lessons learned while developing the last few months.

## Our underlying data

- two key sources: GTFS and OneBusAway
- companion repo with scripts to preprocess GTFS into friendly json
- future ideas to improve performance: redux data store?, serve gtfs via graphql?
- big tech overhaul is coming (including realtime GTFS and 100% AVL coverage), so staying flexible

## Iteration one / first commits

- let's use react -- declarative data management, separate stateful components from stateless/UI components
- making a schedule table was really satisfying, no more PDFs!
- but wait there's so much other data!
- by route approach: realtime, stops, schedule

## Iteration two / experiments with libraries and frameworks

- by stop approach: routes that stop here, transfers
- we have a lot of maps -- moving from vanilla mapbox to uber's react-map-gl
- first pass at material-ui components, realizing we need something more sophisticated than tachyons
- start using css grid instead of flexbox
- we're sharing a lot internally and with our transit-minded friends for feedback

## Iteration three / "it looks good"

- upgrade to material-ui@next, things are looking sleek and consistent
- introduce three entry points to the app: search routes, search stops, see nearby
- stop page is especially being refined -- predictions list, all scheduled times, transfers, unified map, etc
- fewer, smarter maps overall (eg route overview map, drop map from route/#/stops)
- ddot invites folks to a preview session, we demo the app

## Iteration four / "it looks really good"

- refining content and route descriptions with ddot
- making a sticky header on a material-ui@next table is really tricky!
- so many icons, everything is linked from everywhere
- deploying via netlify to ddot.info with continuous integration
