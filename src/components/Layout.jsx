import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Menu, Phone, Mail } from 'lucide-react'

function SkipLink() {
  return (
    <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-amber-500 text-black px-3 py-2 rounded">
      Skip to content
    </a>
  )
}

function Header() {
  const location = useLocation()
  const nav = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/categories', label: 'Categories' },
    { to: '/suppliers', label: 'Suppliers' },
    { to: '/testimonials', label: 'Testimonials' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' },
  ]
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-slate-900/70 bg-slate-900 text-slate-100 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded">
          <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-600 rounded grid place-items-center font-bold text-blue-300">B</div>
          <span className="font-semibold tracking-tight">The Blacksmith Market</span>
        </Link>
        <nav aria-label="Primary" className="hidden md:flex items-center gap-6">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className={`text-sm hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded px-1 ${location.pathname===n.to?'text-blue-300':'text-slate-300'}`}>{n.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/contact" className="hidden sm:inline-flex items-center rounded px-4 py-2 bg-amber-500 text-black font-medium hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500">Contact Sales</Link>
          <button className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500" aria-label="Open menu"><Menu size={18}/></button>
        </div>
      </div>
    </header>
  )
}

function Footer(){
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-10 grid gap-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-gradient-to-br from-slate-700 to-slate-600 rounded grid place-items-center font-bold text-blue-300">B</div>
            <span className="font-semibold">The Blacksmith Market</span>
          </div>
          <p className="text-sm text-slate-400">UK wholesale distributor for home, beauty, toys and more. VAT-registered. Partner-first.</p>
        </div>
        <div>
          <h3 className="text-slate-200 font-medium mb-2">Company</h3>
          <ul className="space-y-1 text-sm">
            <li><Link to="/about" className="hover:text-blue-300">About</Link></li>
            <li><Link to="/suppliers" className="hover:text-blue-300">Suppliers</Link></li>
            <li><Link to="/testimonials" className="hover:text-blue-300">Testimonials</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-slate-200 font-medium mb-2">Resources</h3>
          <ul className="space-y-1 text-sm">
            <li><Link to="/categories" className="hover:text-blue-300">Categories</Link></li>
            <li><Link to="/blog" className="hover:text-blue-300">Blog</Link></li>
            <li><a href="#" className="hover:text-blue-300">UK VAT Info</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-slate-200 font-medium mb-2">Contact</h3>
          <p className="text-sm text-slate-400">Mon–Fri 09:00–17:30 UK</p>
          <div className="mt-2 flex flex-col gap-2">
            <a href="mailto:hello@blacksmith.market" className="inline-flex items-center gap-2 text-sm hover:text-blue-300"><Mail size={16}/> hello@blacksmith.market</a>
            <a href="tel:+441234567890" className="inline-flex items-center gap-2 text-sm hover:text-blue-300"><Phone size={16}/> +44 1234 567890</a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 px-4 py-4 text-center text-xs text-slate-500">Concept demo for The Blacksmith Market — not affiliated.</div>
    </footer>
  )
}

export default function Layout(){
  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100">
      <SkipLink/>
      <Header/>
      <main id="main" className="max-w-7xl mx-auto px-4">
        <Outlet/>
      </main>
      <Footer/>
    </div>
  )
}
