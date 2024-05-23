import 'css/prism.css'

import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { coreContent } from 'pliny/utils/contentlayer'
import { allDocs } from 'contentlayer/generated'
import type { Doc } from 'contentlayer/generated'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import DocLayout from '@/layouts/DocLayout'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'

const defaultLayout = 'DocLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
  DocLayout,
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] }
}): Promise<Metadata | undefined> {
  const slug = decodeURI(params.slug.join('/'))
  const post = allDocs.find((p) => p.slug === slug)

  return {
    title: post?.title,
    description: post?.summary,
    openGraph: {
      title: post?.title,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      url: './',
    },
    twitter: {
      card: 'summary_large_image',
      title: post?.title,
    },
  }
}

export const generateStaticParams = async () => {
  const paths = allDocs.map((p) => ({ slug: p.slug?.split('/') }))

  return paths
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  const slug = decodeURI(params.slug.join('/'))
  const post = allDocs.find((p) => p.slug === slug) as Doc
  const mainContent = coreContent(post)

  const Layout = DocLayout

  return (
    <>
      <Layout content={mainContent} toc={post?.toc || []}>
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc || []} />
      </Layout>
    </>
  )
}