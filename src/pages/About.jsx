import React from 'react'

export default function About(){
  return (
    <div className="py-10">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">About Us</h1>
        <p className="text-slate-300 mt-2 max-w-3xl">Based in the UK and VAT-registered, The Blacksmith Market focuses on long-term partnerships with brands and retailers. We prioritise compliance, dependable logistics, and sustainable growth for our partners.</p>
      </header>

      <section className="grid md:grid-cols-3 gap-6">
        {[{title:'UK Base',desc:'Headquartered in the UK with nationwide carrier networks.'},{title:'VAT-Registered',desc:'Full VAT compliance and documentation.'},{title:'Partner-first',desc:'We optimise for mutual, long-term value.'}].map((i)=>(
          <div key={i.title} className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="font-semibold text-blue-300">{i.title}</h3>
            <p className="text-slate-300 text-sm mt-2">{i.desc}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Timeline</h2>
        <ol className="space-y-3">
          <li className="rounded border border-slate-800 bg-slate-900 p-4"><strong>2019</strong> — Founding and initial category focus</li>
          <li className="rounded border border-slate-800 bg-slate-900 p-4"><strong>2021</strong> — Expanded 3PL and consolidation services</li>
          <li className="rounded border border-slate-800 bg-slate-900 p-4"><strong>2023</strong> — Broadened into seasonal and gifting lines</li>
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Team</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {['Operations Lead','Partnerships Manager','Compliance & QA'].map((role)=> (
            <div key={role} className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <div className="w-16 h-16 rounded-full bg-slate-800"/>
              <h3 className="mt-3 font-medium">{role}</h3>
              <p className="text-slate-300 text-sm">Placeholder profile</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
