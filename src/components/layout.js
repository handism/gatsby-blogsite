import { graphql, Link, useStaticQuery } from "gatsby"
import React from "react"
import kebabCase from "lodash/kebabCase"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fas } from "@fortawesome/free-solid-svg-icons"

export default ({ children, props }) => {
  // ページコンポーネントではないのでスタティッククエリ
  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
        allMarkdownRemark(sort: { fields: [fields___birthTime], order: DESC }) {
          group(field: frontmatter___tags) {
            fieldValue
            totalCount
          }
        }
      }
    `
  )

  // pagesから呼ばれた場合とcomponetsから呼ばれた場合でソースが違う
  const tags =
    typeof data.allMarkdownRemark.group === "undefined"
      ? props.tags
      : data.allMarkdownRemark.group

  library.add(fas) // FontAwesomeのライブラリ読み込み

  return (
    <div class="site-container">
      <header>
        <div class="title-area">
          <h1>
            <Link ClassName="site-title" to="/">
              {data.site.siteMetadata.title}
            </Link>
          </h1>
        </div>
      </header>

      <div class="content-sidebar-wrap">{children}</div>

      <footer>
        <div class="f-container">
          <div class="f-item">
            {" "}
            <div class="item-title">プロフィール</div>
            <div class="profile">エンジニアです！よろしく！</div>
          </div>
          <div class="f-item">
            <div class="item-title">固定ページ一覧</div>
            <ul>
              <li>
                <Link to="/about">about</Link>
              </li>
              <li>
                <Link to="/contact">問い合わせ</Link>
              </li>
            </ul>
          </div>
          <div class="f-item">
            <div class="item-title">タグ一覧</div>
            <ul>
              {tags.map(tag => (
                <li>
                  <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
                    {tag.fieldValue} ({tag.totalCount})
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <small>
          (c) 2020 <Link to="/">{data.site.siteMetadata.title}</Link>
        </small>
      </footer>
    </div>
  )
}
