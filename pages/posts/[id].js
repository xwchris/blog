import Layout from '../../components/Layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Head from 'next/head'
import Detail from '../../components/Detail'

export default function Post({ postData }) {
  return (
    <div className="bg-white dark:bg-slate-800 dark:text-white transition">
      <Layout>
        <Head>
          <title>{postData.title}</title>
        </Head>
        <Detail data={postData} />
      </Layout>
    </div>
  )
}

export async function getStaticPaths() {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id)
  return {
    props: {
      postData
    }
  }
}
