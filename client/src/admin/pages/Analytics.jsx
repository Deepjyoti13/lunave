import { useEffect, useRef, useState } from 'react'
import { useAdminFetch } from '../context/AdminAuthContext'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const GOLD   = '#ecd798'
const GOLDS  = ['#ecd798','#d4b866','#bb9f40','#a38630','#8a6e22','#705814','#57420a']

export default function Analytics() {
  const apiFetch  = useAdminFetch()
  const [orders,   setOrders]   = useState([])
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const revenueRef  = useRef(null)
  const barRef      = useRef(null)
  const catRef      = useRef(null)
  const statusRef   = useRef(null)

  useEffect(() => {
    const load = async () => {
      const [oRes, pRes] = await Promise.all([
        apiFetch('/orders/admin/all?limit=500'),
        apiFetch('/products/admin/all'),
      ])
      const [oData, pData] = await Promise.all([oRes.json(), pRes.json()])
      if (oData.success) setOrders(oData.orders)
      if (pData.success) setProducts(pData.products)
      setLoading(false)
    }
    load()
  }, [])

  // Draw all charts after data loads
  useEffect(() => {
    if (loading) return
    drawRevenue(); drawTopProducts(); drawCategories(); drawStatuses()
  }, [loading, orders, products])

  const drawRevenue = () => {
    const canvas = revenueRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight
    const W = canvas.width, H = canvas.height, pad = { t:20, b:36, l:56, r:20 }
    const cW = W - pad.l - pad.r, cH = H - pad.t - pad.b

    // Monthly revenue
    const monthly = Array(12).fill(0)
    const mCount  = Array(12).fill(0)
    orders.forEach(o => {
      const m = new Date(o.createdAt).getMonth()
      monthly[m] += o.paymentStatus === 'Paid' ? (o.totalPrice||0) : 0
      mCount[m]++
    })
    const max = Math.max(...monthly, 1)

    // Grid lines
    ctx.strokeStyle = 'rgba(245,240,235,0.06)'; ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = pad.t + (cH * (1 - i/4))
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l+cW, y); ctx.stroke()
      ctx.fillStyle = 'rgba(245,240,235,0.3)'; ctx.font = '9px Montserrat,sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText('$'+(max*i/4).toFixed(0), pad.l-6, y+3)
    }

    // Gradient fill
    const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t+cH)
    grad.addColorStop(0, 'rgba(236,215,152,0.25)')
    grad.addColorStop(1, 'rgba(236,215,152,0)')
    const step = cW / 11

    ctx.beginPath()
    monthly.forEach((v,i) => {
      const x = pad.l + i*step
      const y = pad.t + cH - (v/max)*cH
      i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y)
    })
    ctx.lineTo(pad.l+11*step, pad.t+cH)
    ctx.lineTo(pad.l, pad.t+cH)
    ctx.closePath()
    ctx.fillStyle = grad; ctx.fill()

    // Line
    ctx.beginPath()
    monthly.forEach((v,i) => {
      const x = pad.l + i*step
      const y = pad.t + cH - (v/max)*cH
      i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y)
    })
    ctx.strokeStyle = GOLD; ctx.lineWidth = 2; ctx.stroke()

    // Dots
    monthly.forEach((v,i) => {
      const x = pad.l + i*step
      const y = pad.t + cH - (v/max)*cH
      ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2)
      ctx.fillStyle = GOLD; ctx.fill()
    })

    // Month labels
    ctx.fillStyle = 'rgba(245,240,235,0.35)'; ctx.font = '9px Montserrat,sans-serif'; ctx.textAlign = 'center'
    MONTHS.forEach((m,i) => ctx.fillText(m, pad.l+i*step, H-8))
  }

  const drawTopProducts = () => {
    const canvas = barRef.current
    if (!canvas || !products.length) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight
    const W = canvas.width, H = canvas.height

    // Rank by stock sold (numReviews as proxy, or stock diff)
    const top = [...products].sort((a,b)=>(b.numReviews||0)-(a.numReviews||0)).slice(0,6)
    const max = Math.max(...top.map(p=>p.numReviews||0), 1)
    const barH = 28, gap = 10, pad = { l: 130, r: 40, t: 16, b: 16 }
    const cW = W - pad.l - pad.r

    top.forEach((p, i) => {
      const y    = pad.t + i*(barH+gap)
      const bW   = (p.numReviews||0) / max * cW

      // Track
      ctx.fillStyle = 'rgba(245,240,235,0.05)'
      ctx.fillRect(pad.l, y, cW, barH)

      // Bar
      const grad = ctx.createLinearGradient(pad.l,0,pad.l+cW,0)
      grad.addColorStop(0, 'rgba(236,215,152,0.9)')
      grad.addColorStop(1, 'rgba(180,150,80,0.4)')
      ctx.fillStyle = grad
      ctx.fillRect(pad.l, y, Math.max(bW, 2), barH)

      // Label
      ctx.fillStyle = 'rgba(245,240,235,0.7)'; ctx.font = '11px Montserrat,sans-serif'; ctx.textAlign = 'right'
      const name = p.name.length > 16 ? p.name.slice(0,16)+'…' : p.name
      ctx.fillText(name, pad.l-8, y+barH/2+4)

      // Value
      ctx.fillStyle = GOLD; ctx.textAlign = 'left'; ctx.font = '10px Montserrat,sans-serif'
      ctx.fillText(p.numReviews||0, pad.l+bW+6, y+barH/2+4)
    })
  }

  const drawCategories = () => {
    const canvas = catRef.current
    if (!canvas || !products.length) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight

    const counts = {}
    products.forEach(p => { counts[p.category||'Other'] = (counts[p.category||'Other']||0)+1 })
    const entries = Object.entries(counts)
    const total   = products.length
    const cx = canvas.width/2, cy = canvas.height/2 - 10
    const r  = Math.min(cx, cy) - 24, ir = r*0.55

    let startAngle = -Math.PI/2
    entries.forEach(([cat, count], i) => {
      const slice = (count/total)*Math.PI*2
      ctx.beginPath(); ctx.moveTo(cx,cy)
      ctx.arc(cx,cy,r,startAngle,startAngle+slice)
      ctx.closePath()
      ctx.fillStyle = GOLDS[i % GOLDS.length]; ctx.fill()
      startAngle += slice
    })
    ctx.beginPath(); ctx.arc(cx,cy,ir,0,Math.PI*2)
    ctx.fillStyle = '#181818'; ctx.fill()

    ctx.fillStyle = GOLD; ctx.font = '500 18px Cormorant Garamond,serif'
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(total, cx, cy-4)
    ctx.font = '9px Montserrat,sans-serif'; ctx.fillStyle = 'rgba(245,240,235,0.4)'
    ctx.fillText('PRODUCTS', cx, cy+12)

    // Legend
    let ly = cy + r + 16
    entries.forEach(([cat], i) => {
      ctx.fillStyle = GOLDS[i % GOLDS.length]; ctx.fillRect(cx-70, ly, 8, 8)
      ctx.fillStyle = 'rgba(245,240,235,0.5)'; ctx.font = '9px Montserrat,sans-serif'
      ctx.textAlign = 'left'; ctx.fillText(cat, cx-58, ly+7)
      ly += 16
    })
  }

  const drawStatuses = () => {
    const canvas = statusRef.current
    if (!canvas || !orders.length) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight
    const W = canvas.width, H = canvas.height

    const STATUS_ORDER = ['Placed','Confirmed','Processing','Shipped','Delivered','Cancelled']
    const STATUS_COLS  = {'Placed':'#5b9bd5','Confirmed':'#ecd798','Processing':'#e8a94a','Shipped':'#5b9bd5','Delivered':'#4caf7d','Cancelled':'#e05c5c'}

    const counts = {}
    orders.forEach(o => { counts[o.orderStatus] = (counts[o.orderStatus]||0)+1 })
    const bars = STATUS_ORDER.filter(s => counts[s] > 0)
    const max  = Math.max(...bars.map(s=>counts[s]), 1)
    const barW = (W - 40) / bars.length - 16
    const maxH = H - 60

    bars.forEach((status, i) => {
      const x  = 20 + i*(barW+16)
      const bH = (counts[status]/max)*maxH
      const y  = H - 36 - bH
      ctx.fillStyle = STATUS_COLS[status]||GOLD
      ctx.fillRect(x, y, barW, bH)
      ctx.fillStyle = 'rgba(245,240,235,0.6)'; ctx.font = '9px Montserrat,sans-serif'; ctx.textAlign = 'center'
      ctx.fillText(counts[status], x+barW/2, y-6)
      ctx.fillStyle = 'rgba(245,240,235,0.4)'
      ctx.fillText(status.slice(0,5), x+barW/2, H-10)
    })
  }

  const totalRevenue = orders.filter(o=>o.paymentStatus==='Paid').reduce((s,o)=>s+(o.totalPrice||0),0)
  const avgOrder     = orders.length ? totalRevenue / orders.filter(o=>o.paymentStatus==='Paid').length : 0
  const convRate     = orders.length ? (orders.filter(o=>o.paymentStatus==='Paid').length / orders.length * 100) : 0

  if (loading) return <div className="admin-loading"><div className="admin-spinner"/>Loading analytics...</div>

  return (
    <div className="admin-page">
      {/* KPI strip */}
      <div className="admin-stats-grid" style={{marginBottom:'20px'}}>
        {[
          { label:'Total Revenue',    value:`$${totalRevenue.toLocaleString('en',{minimumFractionDigits:2})}` },
          { label:'Total Orders',     value: orders.length },
          { label:'Avg Order Value',  value:`$${avgOrder.toFixed(2)}` },
          { label:'Conversion Rate',  value:`${convRate.toFixed(1)}%` },
        ].map((s,i) => (
          <div className="admin-stat-card" key={i}>
            <div className="admin-stat-label">{s.label}</div>
            <div className="admin-stat-value" style={{fontSize:'26px'}}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Revenue line */}
      <div className="admin-chart-card" style={{marginBottom:'16px'}}>
        <div className="admin-chart-title"><em>Monthly Revenue</em><span>Paid orders only</span></div>
        <canvas ref={revenueRef} style={{width:'100%',height:'220px',display:'block'}}/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr 1fr',gap:'16px'}}>
        <div className="admin-chart-card">
          <div className="admin-chart-title"><em>Top Products</em><span>By reviews</span></div>
          <canvas ref={barRef} style={{width:'100%',height:'230px',display:'block'}}/>
        </div>
        <div className="admin-chart-card">
          <div className="admin-chart-title"><em>By Category</em></div>
          <canvas ref={catRef} style={{width:'100%',height:'280px',display:'block'}}/>
        </div>
        <div className="admin-chart-card">
          <div className="admin-chart-title"><em>Order Status</em></div>
          <canvas ref={statusRef} style={{width:'100%',height:'280px',display:'block'}}/>
        </div>
      </div>
    </div>
  )
}
