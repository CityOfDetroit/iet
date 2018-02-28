import React from 'react'
import Link from 'gatsby-link'
import PropTypes from 'prop-types'
import _ from 'lodash'

// Template component for tags pages
// Add tags to the frontmatter in markdown blog posts

const Tags = ({ pathContext }) => {
  const { posts, post, tag } = pathContext

  // Subpage for single tag
  if (tag) {
    return (
      <div>
        <h1>Tags</h1>
        <p>{post.length} blog post{post.length === 1 ? "" : "s"} tagged <span style={{ backgroundColor: '#dcbf5e', padding: '.5em'}}><strong>{tag}</strong></span>:</p>
        <ul>
          {post.map(({ i, id, frontmatter, fields }) => {
            return (
              <li key={i}>
                <h3>
                  <Link to={fields.slug}>
                    {frontmatter.title}{" "}<span style={{ color: '#a2a2a2' }}>— {frontmatter.date}</span>
                  </Link>
                </h3>
              </li>
            )
          })}
        </ul>
        <Link to="/blog">Back to all blog posts</Link>
      </div>
    )
  }

  // All tags page
  return (
    <div>
      <h1>Tags</h1>
      <ul>
        {Object.keys(posts).map((tagName, j) => {
          const tags = posts[tagName]
          return (
            <li key={j}>
              <Link to={`/tags/${tagName}`}>{tagName}</Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

Tags.propTypes = {
  pathContext: PropTypes.object,
}

export default Tags
