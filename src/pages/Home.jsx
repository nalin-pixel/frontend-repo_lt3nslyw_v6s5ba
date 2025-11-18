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

function Hero3D() {
  const reduced = useReducedMotion()
  const hasWebGL = useHasWebGL()
  const debug = useQueryFlag('debug3d')
  const forceFallback = useQueryFlag('fallback')
  const force3D = useQueryFlag('force3d')

  const canRender3D = (force3D || (!reduced && hasWebGL)) && !forceFallback

  useEffect(() => {
    // Quick console diagnostics when needed
    if (debug) {
      // eslint-disable-next-line no-console
      console.log('[Hero3D debug]', { reduced, hasWebGL, forceFallback, force3D })
    }
  }, [debug, reduced, hasWebGL, forceFallback, force3D])

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900" aria-label="Decorative 3D hero" role="img">
      <div className="absolute inset-0">
        {canRender3D ? (
          <Suspense fallback={<div className="w-full h-full grid place-items-center text-slate-400">Loading scene…</div>}>
            <ErrorBoundary>
              <LazySpline scene="https://prod.spline.design/Gt5HUob8aGDxOUep/scene.splinecode" style={{ width: '100%', height: '100%' }} aria-hidden="true" />
            </ErrorBoundary>
          </Suspense>
        ) : (
          <img src="/hero-fallback.svg" alt="Warehouse pallets in cool lighting" className="w-full h-full object-cover"/>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30"/>
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-3">
        <Link to="/contact" className="pointer-events-auto inline-flex items-center rounded px-4 py-2 bg-amber-500 text-black font-medium hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500">Contact Sales</Link>
        <Link to="/suppliers" className="pointer-events-auto inline-flex items-center rounded px-4 py-2 bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500">Become a Supplier</Link>
      </div>
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
      <section className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">UK wholesale distribution for retail-ready brands</h1>
        <p className="mt-3 text-slate-300 max-w-3xl mx-auto">The Blacksmith Market sources, warehouses and distributes branded goods across the UK. Reliable fulfilment, compliant packaging, and partner-first service.</p>
      </section>
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
