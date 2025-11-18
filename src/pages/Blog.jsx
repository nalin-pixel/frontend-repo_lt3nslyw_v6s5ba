import React from 'react'
import { Link } from 'react-router-dom'

const POSTS = [
  { slug: 'uk-wholesale-basics', title: 'UK Wholesale: The Essentials', tag: 'Industry Insights', excerpt: 'How the UK wholesale landscape works, from VAT to retailer expectations.' },
  { slug: 'brand-partnerships-that-scale', title: 'Brand Partnerships that Scale', tag: 'Brand Partnerships', excerpt: 'Structuring agreements that align incentives and safeguard brand value.' },
  { slug: 'fulfilment-tips-for-brands', title: 'Fulfilment Tips for Brands', tag: 'Fulfilment Tips', excerpt: 'From palletisation to barcodes: set up your catalogue for success.' },
  { slug: 'pallet-consolidation-benefits', title: 'The Benefits of Pallet Consolidation', tag: 'Fulfilment Tips', excerpt: 'Reduce handling costs and lead times with smarter consolidation.' },
  { slug: 'selling-to-uk-resellers', title: 'Selling to UK Resellers 101', tag: 'Industry Insights', excerpt: 'What UK resellers look for and how to serve them well.' },
]

export default function Blog(){
  const tags = ['Industry Insights','Brand Partnerships','Fulfilment Tips']
  return (
    <div className="py-10">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">Blog</h1>
        <p className="text-slate-300 mt-2">Perspectives on UK wholesale, fulfilment and brand partnerships.</p>
      </header>
      <div className="grid lg:grid-cols-[1fr_280px] gap-8">
        <div className="grid gap-4">
          {POSTS.map(p => (
            <article key={p.slug} className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold"><Link to={`/blog/${p.slug}`} className="hover:text-blue-300">{p.title}</Link></h2>
              <p className="text-xs text-blue-300 mt-1">{p.tag}</p>
              <p className="text-slate-300 text-sm mt-2">{p.excerpt}</p>
              <Link to={`/blog/${p.slug}`} className="mt-3 inline-block text-sm text-blue-300 hover:underline">Read more</Link>
            </article>
          ))}
        </div>
        <aside className="space-y-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h3 className="font-medium mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map(t => <span key={t} className="text-xs px-2 py-1 rounded bg-slate-800 border border-slate-700 text-blue-300">{t}</span>)}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
