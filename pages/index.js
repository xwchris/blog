import Head from 'next/head'
import Layout from '../components/Layout'
import { getSortedPostsData } from '../lib/posts'
import List from '../components/List'

export default function Home({ allPostsData }) {
  return (
    <div className="bg-white dark:bg-slate-800 dark:text-white transition">
      <Layout>
        <Head>
          <title>overfronted</title>
        </Head>
        <List data={allPostsData} />
      </Layout>
    </div>
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
