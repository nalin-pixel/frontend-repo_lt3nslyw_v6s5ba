import React, { Suspense, useEffect, useMemo, useState, lazy } from 'react'
import { Link, useLocation } from 'react-router-dom'

// Lazy-load Spline to improve TTI and avoid loading when unsupported/reduced motion
const LazySpline = lazy(() => import('@splinetool/react-spline'))

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    // Safari <14 fallback
    mq.addListener?.(update)
    return () => {
      mq.removeEventListener?.('change', update)
      mq.removeListener?.(update)
    }
  }, [])
  return reduced
}

function useHasWebGL() {
  const [has, setHas] = useState(true)
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const supported = !!(
        (window && ('WebGLRenderingContext' in window)) &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      )
      setHas(!!supported)
    } catch {
      setHas(false)
    }
  }, [])
  return has
}

function useQueryFlag(key) {
  const { search } = useLocation()
  return useMemo(() => {
    const params = new URLSearchParams(search)
    return params.get(key) !== null
  }, [search, key])
}

class ErrorBoundary extends React.Component {
  constructor(props){
    super(props)
    this.state = { hasError: false, errorMsg: '' }
  }
  static getDerivedStateFromError(err){
    return { hasError: true, errorMsg: err?.message || 'Unknown error' }
  }
  componentDidCatch(err){
    // eslint-disable-next-line no-console
    console.error('Spline render error:', err)
  }
  render(){
    if(this.state.hasError){
      return (
        <div className="w-full h-full grid place-items-center text-slate-400">
          3D failed to load. Showing fallback.
        </div>
      )
    }
    return this.props.children
  }
}

function HUDOverlay({ reduced }){
  // Futuristic HUD overlay with pulse ring, leader line, and card
  const [active, setActive] = useState(false)
  useEffect(() => {
    if (reduced) return
    let t
    const cycle = () => {
      setActive(true)
      t = setTimeout(() => setActive(false), 1600)
    }
    const id = setInterval(cycle, 3200)
    cycle()
    return () => { clearInterval(id); clearTimeout(t) }
  }, [reduced])

  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Ring position approximated to front face area */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        aria-hidden="true"
      >
        {/* Pulsing torus-like glow using layered circles */}
        <div className={`relative w-24 h-24 ${reduced ? '' : 'animate-none'}`}>
          <span className={`absolute inset-0 rounded-full ring-2 ring-cyan-400/80 blur-[0.5px] shadow-[0_0_24px_4px_rgba(34,211,238,0.35)] ${active && !reduced ? 'scale-110 opacity-100 transition-transform' : 'opacity-90'}`}></span>
          {!reduced && (
            <span className={`absolute inset-0 rounded-full ring-2 ring-cyan-300/50 ${active ? 'animate-ping' : ''}`}></span>
          )}
          <span className="absolute inset-[22%] rounded-full bg-cyan-400/20 blur-md"></span>
        </div>
      </div>

      {/* Leader line + Card (appears when active) */}
      <div className={`absolute ${active ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`} style={{ left: '58%', top: '50%' }}>
        {/* Leader line as SVG */}
        <svg width="220" height="2" viewBox="0 0 220 2" fill="none" className="translate-y-[-2px]">
          <path d="M0 1 H210" stroke="rgba(34,211,238,0.8)" strokeWidth="2" strokeLinecap="round">
          </path>
          <circle cx="210" cy="1" r="1.5" fill="rgba(34,211,238,0.9)" />
        </svg>
        {/* Info card */}
        <div className="mt-3 w-72 rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-4 shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
          <div className="text-white font-medium">UK-Wide Fulfilment</div>
          <p className="mt-1 text-sm text-slate-300/90">Next-day pallet distribution and e‑commerce ready pick & pack across the United Kingdom.</p>
          <p className="text-sm text-slate-400/80">Seamless ASN, barcode, and retailer routing compliance.</p>
        </div>
      </div>
    </div>
  )
}

function Hero3D() {
  const reduced = useReducedMotion()
  const hasWebGL = useHasWebGL()
  const debug = useQueryFlag('debug3d')
  const forceFallback = useQueryFlag('fallback')
  const force3D = useQueryFlag('force3d')

  const canRender3D = (force3D || (!reduced && hasWebGL)) && !forceFallback

  useEffect(() => {
    if (debug) {
      // eslint-disable-next-line no-console
      console.log('[Hero3D debug]', { reduced, hasWebGL, forceFallback, force3D })
    }
  }, [debug, reduced, hasWebGL, forceFallback, force3D])

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-b from-[#0a0f16] to-[#06080c]" aria-label="Decorative 3D hero" role="img">
      {/* Subtle spotlight */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.18),rgba(0,0,0,0)_60%)] blur-2xl" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />
        {/* Polished floor sheen */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-24 w-[70%] rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.7),rgba(0,0,0,0)_60%)] blur-xl opacity-70" />
      </div>

      <div className="absolute inset-0">
        {canRender3D ? (
          <Suspense fallback={<div className="w-full h-full grid place-items-center text-slate-400">Loading scene…</div>}>
            <ErrorBoundary>
              {/* NOTE: Ideally this references a cyber-crate scene. Keeping current scene as placeholder while overlay supplies the high-tech aesthetic. */}
              <LazySpline scene="https://prod.spline.design/Gt5HUob8aGDxOUep/scene.splinecode" style={{ width: '100%', height: '100%' }} aria-hidden="true" />
            </ErrorBoundary>
          </Suspense>
        ) : (
          <img src="/hero-fallback.svg" alt="Warehouse pallets in cool lighting" className="w-full h-full object-cover"/>
        )}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-100">Your Trusted Partner in UK Wholesale Distribution</h1>
            <p className="mt-3 text-lg md:text-xl font-medium text-cyan-300">Connecting Quality Brands with UK Retailers</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link to="/contact" className="pointer-events-auto inline-flex items-center rounded-md px-5 py-2.5 bg-amber-400 text-black font-semibold shadow-sm hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 transition-colors">Contact Sales</Link>
              <Link to="/suppliers" className="pointer-events-auto inline-flex items-center rounded-md px-5 py-2.5 border border-cyan-400/70 text-white hover:bg-cyan-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 transition-colors">Become a Supplier</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay gradient for text legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20"/>

      {/* Futuristic HUD overlay */}
      <HUDOverlay reduced={reduced} />

      {!canRender3D && (
        <div className="sr-only" aria-live="polite">3D scene disabled due to reduced motion preference or unsupported WebGL. Showing static image.</div>
      )}
      {debug && (
        <div className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-slate-800/80 text-slate-200 border border-slate-700">
          reduced: {String(reduced)} | webgl: {String(hasWebGL)} | force3D: {String(force3D)} | fallback: {String(forceFallback)}
        </div>
      )}
    </div>
  )
}

export default function Home(){
  return (
    <div className="py-10">
      <Hero3D/>

      <section className="mt-12 grid md:grid-cols-3 gap-6">
        {[{
          title:'Trusted Brands', desc:'We work with vetted, compliant brands across home, beauty, toys and more.'
        },{
          title:'UK-wide Fulfilment', desc:'Next-day shipments to major retailers and e-commerce hubs.'
        },{
          title:'Retail-ready', desc:'EAN/UPC barcodes, shelf-pack formats and clear labelling.'
        }].map((p) => (
          <div key={p.title} className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="font-semibold text-blue-300">{p.title}</h3>
            <p className="text-slate-300 mt-2 text-sm">{p.desc}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">How we work</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {step:'1', title:'Onboard', desc:'We align on catalogue, pricing and compliance docs.'},
            {step:'2', title:'Stock & Store', desc:'We receive palletised stock into our UK warehouse.'},
            {step:'3', title:'Distribute', desc:'Consolidated shipments to retailers and resellers.'},
          ].map((s) => (
            <div key={s.step} className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <div className="w-8 h-8 rounded bg-blue-600/20 text-blue-300 grid place-items-center font-semibold">{s.step}</div>
              <h3 className="mt-3 font-medium">{s.title}</h3>
              <p className="text-slate-300 text-sm mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
