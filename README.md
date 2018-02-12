# IET

A simple website & blog to share with the Internet what our team is up to. We write about open data and civic tech tools.

It's built with [Gatsby](https://www.gatsbyjs.org/), a static site generator for [React](https://reactjs.org/) & [GraphQL](http://graphql.org/).

We track our projects in [Airtable](https://airtable.com/), and use the `gatsby-source-airtable` plugin to query and populate them on the page.

# Install

You'll need [Node.js](https://nodejs.org/en/) with NPM or [Yarn](https://yarnpkg.com/en/) first.

Install Gatsby's command line tools globally:

`npm install --global gatsby-cli`

Then, clone this site and install dependencies.

# Usage

## Develop

`gatsby develop` starts the development server. 

Now your app is running and hot reloading at `localhost:8000`.

GraphiQL - a brower interface for writing & testing queries - is also running at `localhost:8000/___graphql`.

A sample GraphiQL query looks like this:
```
{
  site {
    siteMetadata {
      title
    }
  }
}
```
It queries the metadata you defined in `gatsby-config.js` and returns a data object like this:
```
{
  "data": {
    "site": {
      "siteMetadata": {
        "title": "IET"
      }
    }
  }
}
```

## Add a blog post

New posts are drafted on the `dev` branch and pull-requested over to `master` when they're ready to be reviewed & deployed.

We write blog posts in markdown and automatically generate pages from them using Gatsby's Node API.

To publish a new post, simply create a .md file in `/src/posts/`. The file name will become it's URL slug, so use hyphens.

Here's a basic template:

```
---
title: "Blog Post #1"
date: "2018-01-08"
tags: ["tag", "another-tag"]
---

Body text starts here.

Enter down to make a new paragraph.

```

## Deploy

Run `npm run deploy` or `yarn deploy` from the `master` branch.

Either will trigger `gatsby build` and then publish the site to `gh-pages`.

# Credits

The IET logo is designed by [Juan Carlos](https://github.com/juancatothe).

The icons are sourced from [Material Design Icons](https://materialdesignicons.com/).
