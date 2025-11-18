import React from 'react'
import { Link } from 'react-router-dom'

export default function Suppliers(){
  return (
    <div className="py-10">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">Supplier Partnership</h1>
        <p className="text-slate-300 mt-2 max-w-3xl">We partner with brands and authorised distributors to bring retail-ready goods to UK resellers. Our model aligns incentives and makes operations simple.</p>
      </header>

      <section className="grid md:grid-cols-3 gap-6">
        {[{title:'Motivation',desc:'Access to consolidated UK retail channels and reliable cash flow.'},{title:'Ability',desc:'Our warehousing, compliance checks and nationwide carrier network.'},{title:'Prompt',desc:'A clear onboarding flow and regular demand signals from buyers.'}].map((i)=>(
          <div key={i.title} className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="font-semibold text-blue-300">{i.title}</h3>
            <p className="text-slate-300 text-sm mt-2">{i.desc}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Onboarding steps</h2>
        <ol className="space-y-3">
          <li className="rounded border border-slate-800 bg-slate-900 p-4">Share catalogue, price list and MOQ details</li>
          <li className="rounded border border-slate-800 bg-slate-900 p-4">Provide compliance docs (MSDS where relevant), barcodes, pack sizes</li>
          <li className="rounded border border-slate-800 bg-slate-900 p-4">Agree inbound terms and replenishment cadence</li>
        </ol>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/contact" className="inline-flex items-center rounded px-4 py-2 bg-amber-500 text-black font-medium hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500">Become a Supplier</Link>
        <a href="mailto:hello@blacksmith.market" className="inline-flex items-center rounded px-4 py-2 bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500">Email Us</a>
      </div>
    </div>
  )
}
