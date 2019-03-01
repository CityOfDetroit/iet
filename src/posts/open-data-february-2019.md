---
title: "Open Data changelog"
date: "2019-03-01"
tags: ["open-data", "open-data-changelog"]
---

## January & February 2019

### New datasets

Restaurant inspections! This release includes 3 key datasets:

- [Establishments](https://data.detroitmi.gov/d/gr7r-43jt) is a master list of restaurants, bars, school cafeterias, stadium concessions and more that have been inspected by the Detroit Health Department since August 1, 2016
- [All Inspections](https://data.detroitmi.gov/d/kpnp-cx36) conducted is a meaty entrypoint and includes: 
    - Inspection date
    - Inspection type (common values are "Routine inspection", "Complaint" or "Plan Review") 
    - Number of violations cited and corrected by category ("Priority" is most serious, "Priority Foundation" is serious and "Core" is least serious)
    - Overall inspection outcome ("Compliant" or "Not compliant")
- [Violations by Inspection](https://data.detroitmi.gov/d/6kry-5abc) offers the (sometimes queasy) details about individual violations that were cited during inspections, like:
    - Michigan Food Code definition and category ("Priority", "Priority Foundation" or "Core") of the violation
    - Where the violation occured (for example, "Kitchen" or "Storage Room")
    - A summary of the problem and items cited (like "Hair restraint not worn on head/hair")
    - If and when the violation was corrected, and a description of the action required to correct it

### Existing datasets

The Buildings & Safety Department has been migrating away from its' legacy licensing and permitting system to an online platform; we're actively working to gain access to that new system and rebuild our open data connections to update [BSEED datasets](https://data.detroitmi.gov/browse?q=bseed) that have been static since December 2018. There's an interim [Building Permits](https://data.detroitmi.gov/d/e9rn-b5ws) report available here in the meantime.
