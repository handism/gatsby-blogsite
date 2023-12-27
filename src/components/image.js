import React from "react"
import { StaticQuery, graphql } from "gatsby"
// import Img from "gatsby-image"
import { GatsbyImage } from "gatsby-plugin-image"

// 画像ファイルパスをプロパティに取るようなコンポーネントを定義
export default ({ filename }) => (
  // ページじゃないコンポーネントでもGraphQLが使えるように
  // StaticQueryタグを使う
  <StaticQuery
    // GraphQLのクエリ引数には何も指定しない！
    query = {graphql`
      query {
        images: allFile {
          edges {
            node {
              relativePath
              name
              childImageSharp {
                gatsbyImageData(layout: FULL_WIDTH)
              }
            }
          }
        }
      }
    `}
    // 全画像情報がdataに代入されている
    render = {data => {
      // 指定した画像ファイルパス（コンポーネントのプロパティ）と
      // 一致するgatsby-plugin-image用の情報を取得
      const image = data.images.edges.find(n => {
        return n.node.relativePath.includes(filename)
      })

      if (!image) return

      // GatsbyImageタグでgatsby-plugin-imageで最適化された画像を表示する
      // const fluid = image.node.childImageSharp.fluid
      // return <GatsbyImage image={fluid} />
      return <GatsbyImage image={image.node.childImageSharp.gatsbyImageData} />
    }}
  />
)
