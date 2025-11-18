import React from 'react'

const CATEGORIES = [
  {title:'Home & Kitchen', items:['Cookware sets','Storage containers','Kettles & toasters','Cleaning accessories']},
  {title:'Beauty & Personal Care', items:['Shower gels','Hair accessories','Electrical grooming','Fragrance gift sets']},
  {title:'Toys & Games', items:['STEM kits','Board games','Plush & figures','Outdoor play']},
  {title:'Seasonal & Gifting', items:['Festive decor','Wrap & ribbons','Gift bundles','Candles & diffusers']},
  {title:'Other Branded Lines', items:['Stationery','Pet accessories','Sports & leisure','Automotive care']},
]

export default function Categories(){
  return (
    <div className="py-10">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">Product Categories</h1>
        <p className="text-slate-300 mt-2 max-w-3xl">Indicative range of categories we distribute. Example product types only; no trademarks listed.</p>
      </header>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((c)=>(
          <div key={c.title} className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="font-semibold text-blue-300">{c.title}</h3>
            <ul className="mt-3 grid gap-2 text-sm text-slate-300 list-disc list-inside">
              {c.items.map(i=> <li key={i}>{i}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
