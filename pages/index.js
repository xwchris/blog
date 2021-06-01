import Head from 'next/head'
import Layout from '../components/Layout'
import { getSortedPostsData } from '../lib/posts'
import List from '../components/List'

export default function Home({ allPostsData }) {
  return (
    <Layout>
      <Head>
        <title>title</title>
      </Head>
      <List data={allPostsData} />
    </Layout>
  )
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}
