---
title: "Open data primer: What is it?"
date: "2018-04-13"
tags: ["open-data", "how to"]
---

Over the last year, our team has worked to open up Detroit's data. One of our team's values is to build tools using the same infrastructure that is available to the public. An example of that infrastructure is our open data portal. However, we (and many other civic technologists) recognize that there's a gap between making open data _available_ and making sure that residents have the knowledge to use that open data.

This is the first in a series of blog posts that aims to close that gap. It's a primer on the basics of open data and our open data portal.

### What is open data?

We use the term "open data" quite a bit. Here's how we define it:

- information about city services and operations
- available for use by anyone without restrictions

The City's commitment to open data is formalized in [Executive Order 2015-2](https://data.detroitmi.gov/about). The most important feature of the executive order is the commitment all city data should be open *by default* unless there is a good reason for not publishing it.

### What is a data portal?

An open data portal is a website where you can search for public records and download data files. Detroit's open data portal is located at [data.detroitmi.gov](https://data.detroitmi.gov) - click through and follow along.

The datasets on our portal come in a couple different flavors: as tables, maps, or visualizations. Anyone can access our data and use it in their own projects by downloading it for Excel or making an [API request](https://dev.socrata.com/?ref=Detroit).

In Detroit's portal, you'll find quantitative data, like the number of [building permits](https://data.detroitmi.gov/d/xw2a-a7tf) issued, and more qualitative information, like an [organization flow chart of the Mayor's cabinet](https://data.detroitmi.gov/d/bkt5-fjcc). Many of our data are organized by address or parcel number.

If you've ever looked up open data in other cities, you may have noticed similar web interfaces. Detroit's open data portal is built on a platform called [Socrata](https://socrata.com/), the same one used in [Chicago](https://data.cityofchicago.org/), [NYC](https://opendata.cityofnewyork.us/), [San Francisco](https://datasf.org/opendata/), and many other cities.

### Where do I start? 

From the homepage of [data.detroitmi.gov](https://data.detroitmi.gov/), you'll see a "Search" bar in the upper right, navigation links in the blue header, and a grid of data topics and featured tools. Here's an overview of what those mean:

- Links:
  - [About](https://data.detroitmi.gov/about): Read about the Executive Order that established Detroit's open data program
  - [Browse Datasets](https://data.detroitmi.gov/browse): See a list of all open datasets, sorted by "Most accessed" by default
  - [Nominate](https://data.detroitmi.gov/nominate): Suggest a new dataset and see past nominations
  - [Developer Docs](http://dev.socrata.com/?ref=Detroit): Read technical instructions for accessing data through the API
  - [Changelogs](https://cityofdetroit.github.io/iet/tags/open-data-changelog): See what's new month by month

![open data portal homepage](http://dataresources.theneighborhoods.org/sites/dataresources.theneighborhoods.org/files/2018-04/socrata-grid.PNG)

- Grid: The eight blue boxes represent categories used to organize datasets within the portal. Scroll over each to see an explanation; click to see a list of datasets in that category.

- Tools: The four images in the bottom row of the grid link to additional resources that live *outside* of the open data portal. These include web applications built by our team as well as a [Feedback Form](https://app.smartsheet.com/b/form?EQBCT=2cfb2a637f0f49e197ef78e397e76eb9) where you can ask open data questions.

### What's in a dataset?

From "Browse Datasets", select an item that is of type "[Dataset](https://data.detroitmi.gov/browse?limitTo=datasets)" (look for the block icon in the upper right). Try [Detroit Demolitions](https://data.detroitmi.gov/d/rv44-e9di) as an example.

All datasets on the portal have two key parts: metadata and a table view. Metadata is high-level information that describes the data. The table view is an Excel-like view of columns and rows formatted for the web.

![dataset metadata](http://dataresources.theneighborhoods.org/sites/dataresources.theneighborhoods.org/files/2018-04/det-demos-meta_0.PNG)

Let's start with metadata. It includes a description of the dataset, the date it was last updated, the update frequency, associated city agencies or departments, the number of rows, the names and data types of all columns, and contact information for the dataset owner. Further down there is a "Table Preview" and "Related Content Using this Data". Related content may include maps or a "[Data Lens](https://data.detroitmi.gov/browse?limitTo=new_view)" page, which is a collage of charts, graphs, filter functions and smaller maps specific to the Socrata platform.

To switch to the table view, click the blue "View Data" button at the top of the metadata page. Use the menu at the top of any column to sort values in ascending or descending order or filter a single value. If you're looking for a specific value like a name or address within the data, use the text search box in the upper right with the placeholder, "Find in this Dataset".

The colored buttons along the top right of the table offer more options, notably click "Export" to see all available formats for download.

### Stay tuned

We'll be posting more entries in this series: how to find open data, how to use it, and more. If you have suggestions or ideas, please send them our way at [iet@detroitmi.gov](mailto:iet@detroitmi.gov).
