---
title: "A better way to catch your bus: how we built ddot.info"
date: "2018-07-12"
tags: ["web-app", "gtfs", "onebusaway", "buses"]
---

Earlier this month, a bus schedule tool we built in partnership with Detroit's Department of Transportation (DDOT) was [announced on social media](https://www.facebook.com/RideDDOT/videos/vb.419710504742021/1841950199184704/?type=3&theater). We designed this tool to help bus riders find schedules and realtime arrival predictions for all DDOT routes and bus stops. Find it at [ddot.info](https://ddot.info/).

It's in "beta" mode leading up to big September service changes, and we're gathering feedback through this [web form](https://app.smartsheet.com/b/form/28665a43770d48b5bbdfe35f3b7b45ac) in the meantime - so let us know what you think!

In this post, rather than talk about what the app does (which you can find at [ddot.info/about](https://ddot.info/about) if you're curious), we'll explain our tools, methods, and lessons learned while developing it the last few months.

## Motivation

Like a lot of municipal websites, ours has a tendency to tuck away valuable information in PDFs. One of the most visited pages on detroitmi.gov is [this one](https://www.detroitmi.gov/How-Do-I/Locate-Transportation/Bus-Schedules), where people (used to) come to download ~1Mb PDFs of fixed bus schedules usually onto their phones.

![alt text](http://dataresources.theneighborhoods.org/sites/dataresources.theneighborhoods.org/files/2018-07/old-bus-schedules.PNG "Old detroitmi.gov")

So, our first development goal was to simply replicate the schedule portion of the PDF as searchable web content. As bus riders ourselves, we really just never want to see someone pinching their phone screen and squinting at a time table again.

## Our underlying data

We were able to take advantage of previous work to get started quickly - in 2012 Detroit's Code for America fellows built the [TextMyBus](https://www.codeforamerica.org/past-projects/textmybus) SMS application and configured a [OneBusAway REST API](http://developer.onebusaway.org/modules/onebusaway-application-modules/1.1.14/api/where/index.html) endpoint for realtime data that we can share. We also get regular [GTFS (General Transit Feed Specification)](https://developers.google.com/transit/gtfs/) updates from DDOT which reflect the fixed route schedules; you can find it on the city's open data portal [here](https://data.detroitmi.gov/Transportation/DDOT-GTFS-file/y62d-bvsz).

We wanted to create nicely formatted schedules that mimicked the printed schedules as closely as possible. In order to do that, we needed to do some semi-manual editing of the GTFS data, including populate the `timepoint` field in `stop_times.txt` - this field "specifies which stop_times the operator will attempt to strictly adhere to (timepoint=1), and that other stop times are estimates (timepoint=0)" (via the [GTFS best practices](http://gtfs.org/best-practices/#stop_times_3) 

We spent a couple hours recording the `stop_id` for each timepoint in each direction for each route. After loading the GTFS data into a [PostgreSQL](https://www.postgresql.org) database using this handy [GTFS SQL importer](https://github.com/fitnr/gtfs-sql-importer), we used Python to loop through each route and direction and set the `timepoint` field. The next step was to use Python to create the schedule table structure as JSON, which our application could consume. 

Basically, we wanted to go from this (simplified) `stop_times.txt` structure:

| trip_id | arrival_time | stop_id              | timepoint |
|---------|--------------|----------------------|-----------|
| 1174891 | 09:00:00     | Vernor & Grand Blvd. | 1         |
| 1174891 | 09:03:00     | Vernor & Scotten     | 0         |
| 1174891 | 09:04:00     | Vernor & Clark       | 0         |
| 1174891 | 09:05:00     | Vernor & Junction    | 0         |
| 1174891 | 09:07:00     | Vernor & Livernois   | 1         |
| 1174892 | 10:00:00     | Vernor & Grand Blvd. | 1         |
| 1174892 | 10:03:00     | Vernor & Scotten     | 0         |
| 1174892 | 10:04:00     | Vernor & Clark       | 0         |
| 1174892 | 10:05:00     | Vernor & Junction    | 0         |
| 1174892 | 10:07:00     | Vernor & Livernois   | 1         |

to this JSON structure:

```
{
        "rt_name": "Vernor",
        "schedules": {
            "weekday": {
                "eastbound": {
                    "timepoints": ["Vernor & Grand Blvd", "Vernor & Livernois"...],
                    "trips": [{
                        "trip_id": "1174891",
                        "timepoints": ["9:00am", "9:07am"...]
                    },
                    {
                        "trip_id": "1174892",
                        "timepoints": ["10:00am", "10:07am"...]
                    },
                    ...
```

and eventually displayed like this to the end user:

| Vernor & Grand Blvd | Vernor & Livernois | ... |
|---------------------|--------------------|-----|
| 9:00am              | 9:07am             | ... |
| 10:00am             | 10:07am            | ... |

This was a brute-force method to get the application working quickly, but it has a few drawbacks:
- We have to run a few Python scripts every time our GTFS data changes - thankfully, this is limited to a few times per year
- We package a few large [JSON](https://www.json.org/) data structures into our bundle, which increases load time before the app runs

We're currently exploring a couple avenues for replacing this pattern. We're pretty excited about [GraphQL](https://graphql.org/) and [Postgraphile](https://www.graphile.org/postgraphile/), a project that turns a Postgres database schema into an instant GraphQL backend. Since we get the schema "for free" through `gtfs-sql-importer`, we can go from GTFS to GraphQL in a matter of minutes. We want to stay fairly flexible, though; a major technology overhaul is happening at DDOT to equip *all* buses with Automatic Vehicle Location (AVL) technology to collect realtime data (about 75% are equipped today) and produce a [GTFS-RT (realtime)](https://developers.google.com/transit/gtfs-realtime/) feed.

## Iteration one / first commits

Our GTFS-to-json Python scripts were already producing the data - we just needed to display it on a per-route basis. We picked the popular front-end [React](https://reactjs.org/) library, specifically the Create React App boilerplate, to start building. We chose React because it encourages packaging actions (as Javascript) and UI components (as HTML and CSS) together; for instance, a component which would display the next buses at a stop can contain the logic to fetch and process the realtime data along with the HTML and CSS we need to display that data. This makes for quick iterations; since components of the app are encapsulated, it's easy to add, remove, or change component's behaviors and presentation.

Rolling back to this [commit](https://github.com/CityOfDetroit/route-explorer/commit/461f942e8817359205926c265c116c1d4cc70845) shows the very start of our app - you can search for a route, click a link, and see a poorly-formatted schedule table. Additionally, we're using [react-router](https://reacttraining.com/react-router/) to push information into the URL, which is important for bookmarking.

We then began to turn our attention to the rest of the PDF schedule, which also includes a route *map* and points of interest along the route. We also looked at the other OneBusAway endpoints to see what data we could nicely show on a screen that wouldn't be possible with a paper schedule. We created a page for each bus route (https://ddot.info/route/49 shows the Vernor bus), and three subpages: the schedule table, a listing of stops on that route, and then a display of the real-time data.

## Iteration two / experiments with libraries and frameworks

After some IRL testing on our commutes, we decided to build a new URL route for individual bus stops (https://ddot.info/stop/3032 for the stop on the SE corner of Hamilton and Puritan). This meant we could bookmark our stops and jump straight there to see what time we needed to catch the bus.

![alt text](http://dataresources.theneighborhoods.org/sites/dataresources.theneighborhoods.org/files/2018-07/ddotStopPage.PNG "Stop page")

We also wanted to add transfer information. GTFS supports transfers with `transfers.txt`, but we had to manually create this list using PostGIS queries in Python, reduced down to an additional field in our `stops.js` JSON structure. In pseudocode:

```
for each stop X
  get transfer-routes (have a stop within walking distance of X)
    for each transfer-route Y
      find stop Z, serving route Y, which is closest to X
```

Since we were creating a number of different maps (a system map; a route map; an individual stop map), we decided to use the [react-map-gl](https://uber.github.io/react-map-gl/#/) library to reduce boilerplate code.

We also wanted a more familiar UI, so we decided to implement the [material-ui](https://material-ui.com/) React component library and move away from [tachyons](https://tachyons.io/), which is a great CSS toolkit for quickly creating a working prototype, but caused collisions with the built-in styling options provided by material-ui.

To create a page layout that transitioned well between desktop and mobile, as well as some components such as the homepage route grid, we started using the relatively new [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout) feature; we found the [Layout Land](https://www.youtube.com/channel/UC7TizprGknbDalbHplROtag) YouTube channel very helpful.

## Iteration three / "it looks good"

At this point we were comfortable with our data and proof-of-concept features, so we took a step back and thought more deeply about the overall purpose of this app with our partners at DDOT, who posed some hard questions for us:

- how would users get the _important_ information? 
- how would we explain DDOT service in ways that are unique and complimentary to other existing tools like Transit app and TextMyBus?
- how could we address common points of confusion among riders heard by DDOT customer service, like "what are the stops on my route between the print schedule timepoints?" 

From this discussion, we decided on three main entry points from the homepage:

- search by route
- search by stop
- show nearby routes and stops (using the HTML5 Geolocation API)

![alt text](http://dataresources.theneighborhoods.org/sites/dataresources.theneighborhoods.org/files/2018-07/ddotHome.PNG "Homepage")

We also concentrated on making all of our pages more intuitive. Broadly, we tried to:

- _present important information up front_ on the stop page, showing the scheduled times and real-time arrivals together instead of forcing the user to toggle between the two
- _de-emphasize rarely-used information_ on the stop page, delineating transfers as its own tab next to the routes instead of having its own dedicated space on the page
- _remove unnecessary information_: for example there used to be a map at [ddot.info/route/49/stops]; now there's just a list of stops in order

## Iteration four / "it looks really good"

After receiving feedback from a couple of user testing sessions, our fourth iteration aimed to unify the overall look and feel and wrap up the project. We cleaned out no longer used dependencies and components, and brought others up to date and did some light refactoring.

We found one hiccup when upgrading to material-ui's 1.0 release; the "sticky table header" function was no longer available. Being able to anchor our top row of formatted timepoints was crucial for the readability of long schedule tables. Luckily for us, [other people were having the same issue](https://github.com/mui-org/material-ui/issues/6625) and we were able to use the solution in that thread.

DDOT provided us with text for each route that we could put on the main route landing page, and we picked some icons from the [Material Icons](https://material.io/tools/icons/?style=baseline) library to represent key concepts across the app:

- a currently active bus trip
- whether that trip has a scheduled or live prediction
- a bus stop (a custom, squared-off take on `nature_people`)

Finally, we deployed the site to [Netlify](https://www.netlify.com), which is a great alternative to GitHub pages that lets us do [continuous deployment](https://www.netlify.com/docs/continuous-deployment/) of our site!

## After thoughts

- It's really gratifying to build the tool that you want to use everyday. It also creates a lot of incentive to have a working development site each day, even if it doesn't look good yet or some feature might work totally different tomorrow
- We're still learning what it means to establish ourselves as a "prototype" team. At about six months long, this project felt bulky and sluggish at points; it can feel hard to hear new feature requests after all of your initially scoped proof-of-concept ideas are proven. But in the end, we deployed a collaborative product that we're proud of and DDOT is confident in to serve their riders
- There's always a next project. Something that ddot.info doesn't currently support is trip-planning, or the ability to ask "I'm here and I want to go there, what bus(es) can I take?" We're excited to learn more about [Open Trip Planner's](http://www.opentripplanner.org/) suite of tools and start working more with regional transit data sources in the future

Thanks for reading. Check out [ddot.info](https://ddot.info/) for bus schedules and find [our code](https://github.com/CityOfDetroit/route-explorer) on Github.
