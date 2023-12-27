import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

export default ({ data }) => {

  return (
    <Layout>
      <div class="content-sidebar-wrap">
        <div class="content">
            <h2>about</h2>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [fields___birthTime], order: DESC }) {
      totalCount
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
      edges {
        node {
          id
          frontmatter {
            title
            tags
          }
          fields {
            slug
            birthTime(formatString: "YYYY/MM/DD/")
            changeTime(formatString: "YYYY/MM/DD/")
          }
          excerpt
        }
      }
    }
  }
`
