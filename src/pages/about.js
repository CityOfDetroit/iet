import React from 'react'
import PropTypes from 'prop-types'

import TeamMember from '../components/TeamMember'

const About = ({ data }) => {
  const us = [
    {
      name: 'Kat Hartman',
      title: 'Director of Emerging Technology',
      github: '',
      blurb: 'Prior to starting this position in July 2018, Kat contributed directly to the design of data heavy products and interactions at both bespoke and enterprise scales. In addition to visualizing data, she enjoys thinking in systems and translating complexity into accessible metaphors and stories.',
      color: '#d4af37',
    },
    { 
      name: 'Jimmy McBroom', 
      title: 'GIS Analyst', 
      github: 'https://github.com/jmcbroom',
      blurb: "Jimmy started working with spatial data while studying planning & was hooked on programming when he made his first interactive web map. Before joining IET in November 2016, he created GTFS data and performed transit accessibility analyses, scraped and coalesced nationwide parcel data, and enumerated residents for the 2010 U.S. Census.",
      color: '#ff9955',
    },
    {
      name: 'Jessica McInchak', 
      title: 'Backend Web Developer', 
      github: 'https://github.com/jessicamcinchak', 
      blurb: "Jessica has been building things on the web and doing open data research projects in Detroit for five years and counting. Before joining IET in January 2017, she built news apps for public radio, developed strategies for equitable open data with the Detroit Community Technology Project, and cofounded the Detroit Ledger, a grant data collection effort to illustrate Detroit's philanthropic landscape.", 
      color: '#3bd7ab',
    },
    {
      name: 'Juan Carlos Angeles', 
      title: 'Front-end Web Developer', 
      github: '', 
      blurb: 'Juan Carlos worked on developing web-based apps for national brands prior to joining IET in January 2017. His goal is to use his experience to deliver attractive and accessible web interfaces to the citizens of Detroit.',
      color: '#278b7e',
    },
    {
      name: 'Mike Evans', 
      title: 'Internet of Things Developer',
      github: '',
      blurb: '',
      color: '#8c56bb',
    },
  ]

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1>About {data.site.siteMetadata.title}</h1>
      <p>The Office of Innovation & Emerging Technology (IET) is a team of programmers at the <a href="http://www.detroitmi.gov/">City of Detroit</a>.</p>
      <p>We partner with City departments to build digital tools that solve civic problems and information challenges. Our projects can take a few forms:
        <ul style={{margin: '1em'}}>
          <li> sunlighting a new type of City data and making it accessible & understandable</li>
          <li> building web applications that help people communicate with the City in a new way</li>
        </ul>
        In any case, our projects aim to simplify internal work flows and make data more accessible to residents.</p>
      <p>We value working iteratively and openly. We approach projects by identifying a problem, developing prototypes, testing 
        with users first-hand, and evaluating the utility (or uselessness) of a solution. We bring a fresh toolkit of open-source libraries and softwares 
        to interact with the larger ecosystem of enterprise systems traditionally used throughout the City. All of our code is on <a href="https://github.com/cityofdetroit">Github</a>.</p>
      <p>Have an idea, project pitch, or just want to say hello?
        Email us at <a href="mailto:iet@detroitmi.gov">iet@detroitmi.gov</a>.</p>
      <h3>Our team</h3>
      <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', marginBottom: '1em', }}>
        {us.map((you, i) => (
          <TeamMember person={you} key={i} />
        ))}
      </div>
      <h3>History</h3>
      <p>The Office of Innovation & Emerging Technology (IET) was established in 2015 under the Department of Innovation & Technology's restructuring plan.
        Around the same time, the mayor of the City of Detroit signed into law Detroit's first open data policy: <a href="https://data.detroitmi.gov/about"> Government Open Data Access To 
        All (GO DATA) or Executive Order 2015-2</a>. This policy deemed all City information open by default. That commitment to transparency shaped 
        how IET would prioritize working in the open and sharing our code, methods, and ideas along the way.</p>
      <p>Our current team came together in 2017. Detroit's Chief Innovation Officer (CIO) Beth Niblock acts as our 
        interim director. We appreciate these past team members:</p>
      <ul>
        <li>Garlin Gilchrist was the first Director of Innovation & Emerging Technology and helped us establish our footing and articulate a vision. 
          He left to run for local office in spring 2017</li>
        <li>Joel Howrani Heeres was Director of Open Data and activated our open data program. He became Detroit's Director of Sustainability in spring 2017</li> 
      </ul>
    </div>
  )
}

About.propTypes = {
  data: PropTypes.object,
}

export default About

export const query = graphql`
query AboutQuery {
  site {
    siteMetadata {
      title
    }
  }
}
`
