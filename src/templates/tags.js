import React from "react"
import PropTypes from "prop-types"
import Layout from "../components/layout"
import kebabCase from "lodash/kebabCase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fas } from "@fortawesome/free-solid-svg-icons"

// Components
import { Link, graphql } from "gatsby"

const Tags = ({ pageContext, data }) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? "" : "s"
  } tagged with "${tag}"`

  library.add(fas) // FontAwesomeのライブラリ読み込み

  return (
    <Layout tags={pageContext.tags}>
      <div class="content-sidebar-wrap">
        <div class="content">
          <h2>{tagHeader}</h2>
          {edges.map(({ node }) => (
            <div class="entry">
              <div class="entry-title">
                <h2>
                  <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
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

Tags.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
            }),
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
            }),
          }),
        }).isRequired
      ),
    }),
  }),
}

export default Tags

export const pageQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [fields___birthTime], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
            birthTime(formatString: "YYYY/MM/DD/")
            changeTime(formatString: "YYYY/MM/DD/")
          }
          frontmatter {
            title
            tags
          }
          excerpt
        }
      }
    }
  }
`
