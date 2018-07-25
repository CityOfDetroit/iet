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

We decided to use the popular front-end [React](https://reactjs.org/) library to build our application.

Our first goal was to simply replicate the schedule portion of the PDF in a small React app. Our GTFS-to-json Python scripts were already producing the data - we just needed to display it on a per-route basis.

Rolling back to this [commit](https://github.com/CityOfDetroit/route-explorer/commit/461f942e8817359205926c265c116c1d4cc70845) shows the very start of our app - you can search for a route, click a link, and see a poorly-formatted schedule table. Additionally, we're using [react-router]() to push information into the URL, which is important for bookmarking.

We then began to turn our attention to the rest of the PDF schedule, which also includes a route *map* and points of interest along the route. We also looked at the other OneBusAway endpoints to see what data we could nicely show on a screen that wouldn't be possible with a paper schedule. We decided to create a page for each bus route (https://ddot.info/route/49 shows the Vernor bus), and three subpages: the schedule table, a listing of stops, and then a display of the real-time data.

## Iteration two / experiments with libraries and frameworks

After some IRL testing on our commutes, we decided to build a new URL route for individual bus stops (https://ddot.info/stop/3032 for the stop on the SE corner of Hamilton and Puritan). This meant we could bookmark our stops in the morning and jump straight there to see what time we needed to catch the bus.

We also wanted to add transfer information. GTFS supports transfers with `transfers.txt`, but we had to manually create this list using PostGIS queries in Python, reduced down to an additional field in our `stops.js` JSON structure. In pseudocode:

```
for each stop X
  get transfer-routes (have a stop within walking distance of X)
    for each transfer-route Y
      find stop Z, serving route Y, which is closest to X
```

Since we were creating a number of different maps (a system map; a route map; a individual stop map), we decided to use the [react-map-gl]() library to reduce some boilerplate code.

We also wanted a bit more polished UI, so we decided to implement the [material-ui]() design framework and move away from [tachyons](), which is a great CSS framework but proved difficult to coordinate over such a large app. Along with material-ui, we started heavily relying on CSS Grid (and learning about CSS Grid with [Layout Land](https://www.youtube.com/channel/UC7TizprGknbDalbHplROtag)).

## Iteration three / "it looks good"

For this iteration, we began to think a bit more about the overall app with our partners at DDOT - how would users get important information? We decided on three main entry points:

- search by route
- search by stop
- show nearby routes and stops (using the HTML5 Geolocation API)

We also concentrated on making all our pages more intuitive. Broadly, we tried to:

- _present important information up front_ on the stop page, showing the scheduled times and real-time arrivals together instead of forcing the user to toggle between the two
- _de-emphasize rarely-used information_: on the stop page, delineating transfers as its own tab next to the routes instead of having its own dedicated space on the page
- _remove unnecessary information_: there used to be a map at [ddot.info/route/49/stops]; now there's just a list of stops in order. 

## Iteration four / "it looks really good"

After receiving from feedback from a couple of user testing sessions, our fourth iteration was meant to wrap up the project and start to unify the look and feel.

One slight hiccup we found was that the "sticky table header" function present in the material-ui Table component went away in the 1.0 release, which we had upgraded to. We really needed this functionality, especially for the longer schedule tables, so that you could always tell what the timepoint column headers were. Luckily for us, [other people were having the same issue](https://github.com/mui-org/material-ui/issues/6625) and we were able to use the solution in that thread.

DDOT provided us with text for each route that we could put on the main route landing page, and we picked some icons from the [Material Icons](https://material.io/tools/icons/?style=baseline) library to represent key concepts across the app:

- a bus stop
- a currently active bus trip
- whether that trip has a scheduled or live prediction

Finally, we deployed the site to Netlify, which is a great alternative to GitHub pages that lets us do [continuous integration] of our site! 
