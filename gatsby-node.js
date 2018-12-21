/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 * Also this: https://www.gatsbyjs.org/tutorial/part-four/#programmatically-creating-pages-from-data
 */

exports.modifyBabelrc = ({ babelrc }) => ({
  ...babelrc,
  plugins: babelrc.plugins.concat(
    ['transform-regenerator'],
    ['transform-runtime']
  ),
})

const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

const createTagPages = (createPage, edges) => {
  // Loop through all nodes (our markdown posts) and add the tags to posts object
  const posts = {}
  edges.forEach(({ node }) => {
    if (node.frontmatter.tags) {
      node.frontmatter.tags.forEach(tag => {
        if (!posts[tag]) {
          posts[tag] = []
        }
        posts[tag].push(node)
      })
    }
  })

  // Create the tags page with the list of tags from our posts object
  createPage({
    path: "/tags",
    component: path.resolve(`src/components/Tags.js`),
    context: {
      posts,
    },
  })

  // For each of the tags in the post object, create a tag page
  Object.keys(posts).forEach(tagName => {
    const post = posts[tagName]
    createPage({
      path: `/tags/${tagName}`,
      component: path.resolve(`src/components/Tags.js`),
      context: {
        posts,
        post,
        tag: tagName,
      },
    })
  })
}

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators

  // Look for markdown files in the /posts dir and make a slug for each
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `posts` })
    createNodeField({
      node,
      name: `slug`,
      value: '/blog' + slug,
    })
  }
}

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators

  // Now slugs are accessible when querying markdown so we can make a page for each node
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                date(formatString: "MMMM DD, YYYY")
                tags
              }
            }
          }
        }
      }
    `).then(result => {
      // console.log(result)

      // Make tag pages
      const posts = result.data.allMarkdownRemark.edges
      createTagPages(createPage, posts)

      // Make blog post pages
      result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        createPage({
          path: node.fields.slug,
          component: path.resolve(`./src/components/BlogPost.js`),
          context: {
            slug: node.fields.slug,
          },
        })
      })
      resolve()
    })
  })
}
