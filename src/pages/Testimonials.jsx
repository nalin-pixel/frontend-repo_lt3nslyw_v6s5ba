import React from 'react'

const QUOTES = [
  {q:'Dependable and transparent. They handle consolidation and labelling so our team can focus on product.', a:'Independent UK Toy Reseller'},
  {q:'Strong communication and fair terms. Our seasonal lines moved quickly through their channels.', a:'Gifting Brand (UK)'},
  {q:'Compliance-first approach gave our retail partners confidence.', a:'Home & Kitchen Importer (UK/EU)'},
  {q:'Pick accuracy and on-time delivery have been excellent.', a:'Marketplace Seller (UK)'}
]

export default function Testimonials(){
  return (
    <div className="py-10">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">Testimonials</h1>
        <p className="text-slate-300 mt-2 max-w-3xl">What partners say about working with us.</p>
      </header>
      <div className="grid md:grid-cols-2 gap-6">
        {QUOTES.map((t,i)=> (
          <figure key={i} className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <blockquote className="text-slate-200">“{t.q}”</blockquote>
            <figcaption className="mt-3 text-sm text-slate-400">— {t.a}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
