import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import kebabCase from "lodash/kebabCase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fas } from "@fortawesome/free-solid-svg-icons"

export default ({ data }) => {
  library.add(fas) // FontAwesomeのライブラリ読み込み

  return (
    <Layout>
      <div class="content-sidebar-wrap">
        <div class="content">
          {data.allMarkdownRemark.edges.map(({ node }) => (
            <div class="entry">
              <div class="entry-title">
                <h2>
                  <Link to={node.fields.slug}>{node.frontmatter.title} </Link>
                </h2>
              </div>
              <div class="entry-meta">
                <span class="time">
                  <FontAwesomeIcon icon={["fas", "clock"]} />
                  <time class="entry-time">{node.fields.birthTime}</time>
                </span>
                <span class="time">
                  <FontAwesomeIcon icon={["fas", "history"]} />
                  <time class="entry-modified-time">
                    {node.fields.changeTime}
                  </time>
                </span>

                <div class="tags">
                  {node.frontmatter.tags.map(tag => (
                    <span class="tag">
                      <FontAwesomeIcon icon={["fas", "tag"]} />
                      <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
                    </span>
                  ))}
                </div>
              </div>

              <div class="entry-content">
                <p>{node.excerpt}</p>
              </div>
            </div>
          ))}
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
