const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
    const fileNode = getNode(node.parent)
    createNodeField({
      node,
      name: `birthTime`,
      value: fileNode.birthTime,
    })
    createNodeField({
      node,
      name: `changeTime`,
      value: fileNode.changeTime,
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
        allMarkdownRemark(sort: { fields: [fields___birthTime], order: DESC }) {
        group(field: frontmatter___tags) {
          fieldValue
        }
        edges {
          node {
            fields {
              slug
              birthTime(formatString: "YYYY/MM/DD/")
              changeTime(formatString: "YYYY/MM/DD/")
            }
            frontmatter {
              tags
              title
            }
          }
        }
      }
    }
  `)

  result.data.allMarkdownRemark.edges.forEach(({ node }, index) => {
    const prev =
      index === 0 ? null : result.data.allMarkdownRemark.edges[index - 1].node
    const next =
      index === result.data.allMarkdownRemark.edges.length - 1
        ? null
        : result.data.allMarkdownRemark.edges[index + 1].node
    const tags = result.data.allMarkdownRemark.group

    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/post.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.fields.slug,
        changeTime: node.fields.changeTime,
        birthTime: node.fields.birthTime,
        next,
        prev,
        tags,
      },
    })
  })

  const _ = require("lodash")
  const tagTemplate = path.resolve("src/templates/tags.js")
  // Extract tag data from query
  const tags = result.data.allMarkdownRemark.group

  // Make tag pages
  tags.forEach(tag => {
    createPage({
      path: `/tags/${_.kebabCase(tag.fieldValue)}/`,
      component: tagTemplate,
      context: {
        tag: tag.fieldValue,
        tags,
      },
    })
  })
}
