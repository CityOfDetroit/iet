---
title: "How we built ddot.info"
date: "2018-07-12"
tags: ["web-app", "gtfs", "onebusaway", "buses"]
---

Earlier this month, a bus schedule tool we built in partnership with Detroit's Department of Transportation (DDOT) was [announced on social media](https://www.facebook.com/RideDDOT/videos/vb.419710504742021/1841950199184704/?type=3&theater). We designed this tool to help bus riders find schedules and realtime arrival predictions for all DDOT routes and bus stops. You can check it out at [ddot.info](https://ddot.info/). 

It's in "beta" mode leading up to big September service changes, and we're gathering and incorporating feedback through this [web form](https://app.smartsheet.com/b/form/28665a43770d48b5bbdfe35f3b7b45ac) in the meantime - so let us know what you think!

In this post, rather than talk about what the app does (which you can find at [ddot.info/about](https://ddot.info/about) if you're interested), we'll explain our tools, methods, and lessons learned while developing it the last few months.

## Motivation

Like a lot of municipal websites, ours has a tendency to tuck away valuable information in PDFs. One of the most visited pages on detroitmi.gov is [this one](https://www.detroitmi.gov/How-Do-I/Locate-Transportation/Bus-Schedules), where people (used to) come to download ~1Mb PDFs of fixed bus schedules usually onto their phones.

(add old detroitmi.gov screenshot)

So, our first development goal was to simply replicate the schedule portion of the PDF as searchable web content. As bus riders ourselves, we really just never want to see someone pinching their phone screen and squinting at a time table again.

## Our underlying data

We were able to take advantage of previous work to get started quickly - in _2010?_, _LocalData/CfA?_ built the "Text My Bus" tool, which meant we could utilize the same *OneBusAway* REST API for real-time data. We also get regular GTFS updates from DDOT, which we then post to the city's open data portal [here](https://data.detroitmi.gov/Transportation/DDOT-GTFS-file/y62d-bvsz).

We wanted to create nicely formatted schedules that mimicked the printed schedules as closely as possible. In order to do that, we needed to do some semi-manual editing of the GTFS data, including populate the `timepoint` field in `stop_times.txt` - this field "specifies which stop_times the operator will attempt to strictly adhere to (timepoint=1), and that other stop times are estimates (timepoint=0)" (via the [GTFS best practices](http://gtfs.org/best-practices/#stop_times_3) 

We spent a couple hours recording the `stop_id` for each timepoint in each direction for each route. After loading the GTFS data into a PostgreSQL database using this handy [GTFS SQL importer](https://github.com/fitnr/gtfs-sql-importer), we used Python to loop through each route and direction and set the `timepoint` field. The next step was to use Python to create the schedule table structure as JSON, which our application could consume. 

This was a brute-force method to get the application working quickly, but it has a few drawbacks:
- We have to run a few Python scripts every time our GTFS changes - thankfully, this is limited to a few times per year
- We package a few large JSON data structures into our bundle, which increases load time before the app runs

We're currently exploring a couple avenues for replacing this pattern. We're pretty excited about GraphQL and particularly Postgraphile, which is a project that turns a Postgres database schema into an instant GraphQL backend. Since we get the schema "for free" through `gtfs-sql-importer`, we can go from GTFS to GraphQL in a matter of minutes. However, we also need to be mindful of a major technology overhaul happening at DDOT which should improve AVL coverage to 100% and give us a GTFS-RT feed, so we want to stay fairly flexible.

## Iteration one / first commits

Our GTFS-to-json Python scripts were already producing the data - we just needed to display it on a per-route basis. We picked the popular front-end [React](https://reactjs.org/) library, specifically the Create React App boilerplate, to start building. React was a good choice for us because we could clearly map our UI components, like a schedule time table to start, to our application's state; this declarative style would scale well as we tested how to present various slices of transit data in different ways.

Rolling back to this [commit](https://github.com/CityOfDetroit/route-explorer/commit/461f942e8817359205926c265c116c1d4cc70845) shows the very start of our app - you can search for a route, click a link, and see a poorly-formatted schedule table. Additionally, we're using [react-router]() to push information into the URL, which is important for bookmarking.

We then began to turn our attention to the rest of the PDF schedule, which also includes a route *map* and points of interest along the route. We also looked at the other OneBusAway endpoints to see what data we could nicely show on a screen that wouldn't be possible with a paper schedule. We created a page for each bus route (https://ddot.info/route/49 shows the Vernor bus), and three subpages: the schedule table, a listing of stops on that route, and then a display of the real-time data.

## Iteration two / experiments with libraries and frameworks

After some IRL testing on our commutes, we decided to build a new URL route for individual bus stops (https://ddot.info/stop/3032 for the stop on the SE corner of Hamilton and Puritan). This meant we could bookmark our stops in the morning and jump straight there to see what time we needed to catch the bus.

We also wanted to add transfer information. GTFS supports transfers with `transfers.txt`, but we had to manually create this list using PostGIS queries in Python, reduced down to an additional field in our `stops.js` JSON structure. In pseudocode:

```
for each stop X
  get transfer-routes (have a stop within walking distance of X)
    for each transfer-route Y
      find stop Z, serving route Y, which is closest to X
```

Since we were creating a number of different maps (a system map; a route map; an individual stop map), we decided to use the [react-map-gl]() library to reduce some boilerplate code.

We also wanted a bit more polished UI, so we decided to implement the [material-ui]() design framework and move away from [tachyons](), which is a great CSS toolkit but proved difficult to coordinate over a growing app. Along with material-ui, we started heavily relying on CSS Grid (and learning about CSS Grid with [Layout Land](https://www.youtube.com/channel/UC7TizprGknbDalbHplROtag)).

## Iteration three / "it looks good"

At this point we were comfortable with our data and proof-of-concept features, so be backed up a bit and began to think a bit more deeply about the overall purpose of this app with our partners at DDOT - how would users get the _important_ information? How would we explain DDOT service in ways that are unique and complimentary to other existing tools like Transit app and TextMyBus? How could we address common points of confusion among riders heard by DDOT customer service, like "what are the stops on my route between the print schedule timepoints?" 

We decided on three main entry points from the homepage:

- search by route
- search by stop
- show nearby routes and stops (using the HTML5 Geolocation API)

(add a ddot.info screenshot here)

We also concentrated on making all of our pages more intuitive. Broadly, we tried to:

- _present important information up front_ on the stop page, showing the scheduled times and real-time arrivals together instead of forcing the user to toggle between the two
- _de-emphasize rarely-used information_ on the stop page, delineating transfers as its own tab next to the routes instead of having its own dedicated space on the page
- _remove unnecessary information_: for example there used to be a map at [ddot.info/route/49/stops]; now there's just a list of stops in order

## Iteration four / "it looks really good"

After receiving feedback from a couple of user testing sessions, our fourth iteration meant to unify the overall look and feel and wrap up the project. We cleaned out no longer used dependencies and components, and brought others up to date and did some light refactoring.

We found one hiccup when upgrading to material-ui's 1.0 release; the "sticky table header" function was no longer available. Being able to anchor our top row of formatted timepoints was crucial for the readability of long schedule tables. Luckily for us, [other people were having the same issue](https://github.com/mui-org/material-ui/issues/6625) and we were able to use the solution in that thread.

DDOT provided us with text for each route that we could put on the main route landing page, and we picked some icons from the [Material Icons](https://material.io/tools/icons/?style=baseline) library to represent key concepts across the app:

- a currently active bus trip
- whether that trip has a scheduled or live prediction
- a bus stop (a custom, squared-off take on nature_people)

Finally, we deployed the site to Netlify, which is a great alternative to GitHub pages that lets us do [continuous integration] of our site!

## After thoughts

(very draft-y, but feels like we need some way to share like three final take aways and conclude it?)

- It's really gratifying to build an app that you want to use everyday yourself (and it creates a lot of incentive to have a working dev deployment each day, even if it doesn't look good yet or some feature will work totally differently tomorrow)
- We're still learning what it means to establish ourselves as a "prototype" team, and at about six months long this project definitely felt sluggish and quite big at times. but in the end we were able to deploy a product that both us and our partners were strong advocates of thanks to a lot of collaboration, feedback-gathering, and iteration
