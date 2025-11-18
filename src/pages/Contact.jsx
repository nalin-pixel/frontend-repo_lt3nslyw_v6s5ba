import React, { useState } from 'react'

const initial = {company_name:'',contact_name:'',email:'',phone:'',website:'',company_type:'',product_categories:'',estimated_monthly_volume:'',message:''}

export default function Contact(){
  const [data,setData] = useState(initial)
  const [errors,setErrors] = useState({})
  const [status,setStatus] = useState('idle')

  const validate = () => {
    const e = {}
    if(!data.company_name) e.company_name = 'Enter your company name'
    if(!data.contact_name) e.contact_name = 'Enter a contact name'
    if(!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Enter a valid email'
    if(!data.company_type) e.company_type = 'Select a company type'
    if(!data.product_categories) e.product_categories = 'Provide product categories'
    if(!data.estimated_monthly_volume) e.estimated_monthly_volume = 'Enter estimated monthly volume'
    setErrors(e)
    return Object.keys(e).length===0
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    if(!validate()) return
    setStatus('submitting')
    try{
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/supplier-inquiry`,{
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)
      })
      if(!res.ok) throw new Error('Request failed')
      setStatus('success')
      setData(initial)
    }catch(err){
      setStatus('error')
    }
  }

  return (
    <div className="py-10">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
        <p className="text-slate-300 mt-2 max-w-3xl">We usually respond within one working day. Share details about your company and catalogue so we can direct you to the right team.</p>
      </header>

      <form onSubmit={onSubmit} noValidate className="grid gap-4 max-w-3xl">
        {[
          {name:'company_name', label:'Company Name', type:'text', required:true},
          {name:'contact_name', label:'Contact Name', type:'text', required:true},
          {name:'email', label:'Email', type:'email', required:true},
          {name:'phone', label:'Phone', type:'tel'},
          {name:'website', label:'Website', type:'url'},
          {name:'company_type', label:'Company Type', type:'text', required:true},
          {name:'product_categories', label:'Product Categories', type:'text', required:true},
          {name:'estimated_monthly_volume', label:'Estimated Monthly Volume', type:'text', required:true},
        ].map(f => (
          <div key={f.name}>
            <label htmlFor={f.name} className="block text-sm mb-1">{f.label}{f.required && ' *'}</label>
            <input id={f.name} name={f.name} type={f.type} value={data[f.name]} onChange={e=>setData(d=>({...d,[f.name]: e.target.value}))} className={`w-full rounded bg-slate-900 border ${errors[f.name]? 'border-rose-500':'border-slate-800'} px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500`} aria-invalid={!!errors[f.name]} aria-describedby={errors[f.name]? `${f.name}-error`: undefined} />
            {errors[f.name] && <p id={`${f.name}-error`} className="mt-1 text-sm text-rose-400">{errors[f.name]}</p>}
          </div>
        ))}
        <div>
          <label htmlFor="message" className="block text-sm mb-1">Message</label>
          <textarea id="message" name="message" rows={5} value={data.message} onChange={e=>setData(d=>({...d,message:e.target.value}))} className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"/>
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" className="inline-flex items-center rounded px-4 py-2 bg-amber-500 text-black font-medium hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500">Send inquiry</button>
          {status==='submitting' && <span className="text-slate-400 text-sm">Sending…</span>}
          {status==='success' && <span className="text-green-400 text-sm" role="status">Thanks — we\'ll be in touch.</span>}
          {status==='error' && <span className="text-rose-400 text-sm" role="status">Something went wrong. Please try again.</span>}
        </div>
      </form>
    </div>
  )
}
