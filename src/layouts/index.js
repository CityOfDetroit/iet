import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'

import Header from '../components/Header'
import Footer from '../components/Footer'

const body = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
}

const main = {
  flex: '1 0 auto',
  margin: '2.5em',
}

const TemplateWrapper = ({ children }) => (
  <div style={body}>
    <Helmet
      title="IET | City of Detroit"
      meta={[
        { name: 'description', content: 'Sample' },
        { name: 'keywords', content: 'sample, something' },
      ]}
    />
    <Header />
    <div style={main}>
      {children()}
    </div>
    <Footer />
  </div>
)

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper
