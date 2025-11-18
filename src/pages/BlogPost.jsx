import React from 'react'
import { useParams, Link } from 'react-router-dom'

const CONTENT = {
  'uk-wholesale-basics': {
    title: 'UK Wholesale: The Essentials',
    body: `Understand VAT, EORI, and retailer compliance. Build reliable replenishment, keep product data accurate, and use clear pack sizes.`,
    tag: 'Industry Insights'
  },
  'brand-partnerships-that-scale': {
    title: 'Brand Partnerships that Scale',
    body: `Partnerships work when incentives align. Protect brand pricing, agree on channels, and set transparent logistics SLAs.`,
    tag: 'Brand Partnerships'
  },
  'fulfilment-tips-for-brands': {
    title: 'Fulfilment Tips for Brands',
    body: `Prepare cartons, standardise barcodes and ensure MSDS where needed. Palletise for quick cross-docking.`,
    tag: 'Fulfilment Tips'
  },
  'pallet-consolidation-benefits': {
    title: 'The Benefits of Pallet Consolidation',
    body: `Consolidation reduces touches and lead times. Bundle multi-SKU pallets with clear labelling for destination.`,
    tag: 'Fulfilment Tips'
  },
  'selling-to-uk-resellers': {
    title: 'Selling to UK Resellers 101',
    body: `Resellers look for compliant goods, stable supply and fair terms. Provide data sheets and fast support.`,
    tag: 'Industry Insights'
  }
}

export default function BlogPost(){
  const { slug } = useParams()
  const post = CONTENT[slug]
  if(!post){
    return (
      <div className="py-10">
        <p>Post not found.</p>
        <Link to="/blog" className="text-blue-300">Back to blog</Link>
      </div>
    )
  }
  return (
    <article className="py-10 max-w-3xl">
      <p className="text-xs text-blue-300">{post.tag}</p>
      <h1 className="text-3xl md:text-4xl font-bold mt-2">{post.title}</h1>
      <p className="text-slate-300 mt-4 leading-7">{post.body}</p>
      <div className="mt-8"><Link to="/blog" className="text-blue-300 hover:underline">Back to blog</Link></div>
    </article>
  )
}
