---
title: "How to geocode Detroit addresses"
date: "2018-03-08"
tags: ["geocoding", "addresses"]
---

A very common operation in our open data processes is __geocoding__: the process which turns a text location description (`2 Woodward Avenue, Detroit, MI 48226`) into coordinates which can be plotted on a webmap (`42.329543, -83.043720`) . In this post, I'll explain how you can utilize the City of Detroit's geocoder in a couple of ways.

### What's in a geocoder?

There's two major parts to a geocoder: the __parsing algorithm__ and the __reference dataset__. 

The parsing algorithm turns the location description input into structured text. Here's a .gif showing the parsing output of [libpostal](https://github.com/openvenues/libpostal):

![](https://cloud.githubusercontent.com/assets/238455/24703087/acbe35d8-19cf-11e7-8850-77fb1c3446a7.gif)
