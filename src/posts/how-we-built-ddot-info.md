---
title: "How we built ddot.info"
date: "2018-07-12"
tags: ["web-app", "gtfs", "onebusaway", "buses"]
---

Earlier this week, a bus schedule tool we built in partnership with Detroit's Department of Transportation (DDOT) was [announced on social media](https://www.facebook.com/RideDDOT/videos/vb.419710504742021/1841950199184704/?type=3&theater). We designed this tool to help bus riders find schedules and realtime arrival predictions for all DDOT routes and bus stops. You can check it out at [ddot.info](https://ddot.info/). 

It's in "beta" mode leading up to big September service changes, and we're gathering and incorporating feedback through this [web form](https://app.smartsheet.com/b/form/28665a43770d48b5bbdfe35f3b7b45ac) in the meantime - so let us know what you think!

In this post, rather than talk about features of the app (which you can find at [ddot.info/about](https://ddot.info/about) if you're interested), we'll dive deep into our tools, methods, and lessons learned while developing the last few months.

## Our underlying data

We were able to take advantage of previous work to get started quickly - in _2010?_, _LocalData/CfA?_ built the "Text My Bus" tool, which meant we could utilize the same *OneBusAway* REST API for real-time data. We also get regular GTFS updates from DDOT, which we then post to the city's open data portal [here](https://data.detroitmi.gov/Transportation/DDOT-GTFS-file/y62d-bvsz).

We wanted to create nicely formatted schedules that mimicked the printed schedules as closely as possible. In order to do that, we needed to do some semi-manual editing of the GTFS data, including populate the `timepoint` field in `stop_times.txt` - this field "specifies which stop_times the operator will attempt to strictly adhere to (timepoint=1), and that other stop times are estimates (timepoint=0)" (via the [GTFS best practices](http://gtfs.org/best-practices/#stop_times_3) 

We spent a couple hours recording the `stop_id` for each timepoint in each direction for each route. After loading the GTFS data into a PostgreSQL database using this handy [GTFS SQL importer](https://github.com/fitnr/gtfs-sql-importer), we used Python to loop through each route and direction and set the `timepoint` field. The next step was to use Python to create the schedule table structure as JSON, which our application could consume. 

This was a brute-force method to get the application working quickly, but it has a few drawbacks:
- We have to run a few Python scripts every time our GTFS changes - thankfully, this is limited to a few times per year
- We package a few large JSON data structures into our bundle, which increases load time before the app runs

We're currently exploring a couple avenues for replacing this pattern. We're pretty excited about GraphQL and particularly Postgraphile, which is a project that turns a Postgres database schema into an instant GraphQL backend. Since we get the schema "for free" through `gtfs-sql-importer`, we can go from GTFS to GraphQL in a matter of minutes. However, we also need to be mindful of a major technology overhaul happening at DDOT which should improve AVL coverage to 100% and give us a GTFS-RT feed, so we want to stay fairly flexible.

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
