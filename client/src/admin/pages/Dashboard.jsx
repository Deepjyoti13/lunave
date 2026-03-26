import { useEffect, useRef, useState } from 'react'
import { useAdminFetch } from '../context/AdminAuthContext'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const STATUS_COLORS = {
  Placed:'#5b9bd5', Confirmed:'#ecd798', Processing:'#e8a94a',
  Shipped:'#5b9bd5', Delivered:'#4caf7d', Cancelled:'#e05c5c'
}

export default function Dashboard({ setPage }) {
  const apiFetch  = useAdminFetch()
  const [stats,   setStats]   = useState(null)
  const [orders,  setOrders]  = useState([])
  const [products,setProducts]= useState([])
  const [loading, setLoading] = useState(true)
  const revenueRef = useRef(null)
  const donutRef   = useRef(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, oRes, pRes] = await Promise.all([
          apiFetch('/orders/admin/stats'),
          apiFetch('/orders/admin/all?limit=8&sort=-createdAt'),
          apiFetch('/products/admin/all'),
        ])
        const [sData, oData, pData] = await Promise.all([
          sRes.json(), oRes.json(), pRes.json(),
        ])
        if (sData.success) setStats(sData.stats)
        if (oData.success) setOrders(oData.orders)
        if (pData.success) setProducts(pData.products)
      } catch(e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  // Draw revenue sparkline
  useEffect(() => {
    if (!revenueRef.current || !orders.length) return
    const canvas = revenueRef.current
    const ctx    = canvas.getContext('2d')
    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Aggregate orders by month
    const monthly = Array(12).fill(0)
    orders.forEach(o => {
      const m = new Date(o.createdAt).getMonth()
      monthly[m] += o.totalPrice || 0
    })
    const max  = Math.max(...monthly, 1)
    const W    = canvas.width
    const H    = canvas.height
    const pad  = 20
    const step = (W - pad*2) / 11

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, 'rgba(236,215,152,0.2)')
    grad.addColorStop(1, 'rgba(236,215,152,0)')

    ctx.beginPath()
    monthly.forEach((v, i) => {
      const x = pad + i * step
      const y = H - pad - ((v / max) * (H - pad*2))
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    // Close fill path
    ctx.lineTo(pad + 11*step, H - pad)
    ctx.lineTo(pad, H - pad)
    ctx.closePath()
    ctx.fillStyle = grad
    ctx.fill()

    // Line
    ctx.beginPath()
    monthly.forEach((v, i) => {
      const x = pad + i * step
      const y = H - pad - ((v / max) * (H - pad*2))
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.strokeStyle = '#ecd798'
    ctx.lineWidth   = 2
    ctx.stroke()

    // Month labels
    ctx.fillStyle = 'rgba(245,240,235,0.3)'
    ctx.font      = '9px Montserrat, sans-serif'
    ctx.textAlign = 'center'
    MONTHS.forEach((m, i) => {
      ctx.fillText(m, pad + i * step, H - 4)
    })
  }, [orders])

  // Draw donut chart
  useEffect(() => {
    if (!donutRef.current || !orders.length) return
    const canvas = donutRef.current
    const ctx    = canvas.getContext('2d')
    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const counts = {}
    orders.forEach(o => { counts[o.orderStatus] = (counts[o.orderStatus]||0)+1 })
    const total   = orders.length
    const entries = Object.entries(counts)
    const cx = canvas.width / 2
    const cy = canvas.height / 2 - 10
    const r  = Math.min(cx, cy) - 20
    const ir = r * 0.6

    let startAngle = -Math.PI / 2
    entries.forEach(([status, count]) => {
      const slice = (count / total) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, startAngle, startAngle + slice)
      ctx.closePath()
      ctx.fillStyle = STATUS_COLORS[status] || '#444'
      ctx.fill()
      startAngle += slice
    })

    // Inner circle (donut hole)
    ctx.beginPath()
    ctx.arc(cx, cy, ir, 0, Math.PI * 2)
    ctx.fillStyle = '#181818'
    ctx.fill()

    // Center text
    ctx.fillStyle = '#ecd798'
    ctx.font      = 'bold 22px Cormorant Garamond, serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(total, cx, cy - 4)
    ctx.font      = '9px Montserrat, sans-serif'
    ctx.fillStyle = 'rgba(245,240,235,0.4)'
    ctx.fillText('ORDERS', cx, cy + 14)

    // Legend
    let ly = cy + r + 12
    entries.forEach(([status]) => {
      ctx.fillStyle = STATUS_COLORS[status] || '#444'
      ctx.fillRect(cx - 60, ly, 8, 8)
      ctx.fillStyle = 'rgba(245,240,235,0.5)'
      ctx.font      = '9px Montserrat, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(status, cx - 48, ly + 7)
      ly += 16
    })
  }, [orders])

  const fmtCurrency = (n) => `$${(n||0).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}`

  if (loading) return (
    <div className="admin-loading">
      <div className="admin-spinner"/>
      Loading dashboard...
    </div>
  )

  // Top 5 products by stock sold
  const topProducts = [...products]
    .sort((a,b) => (b.numReviews||0) - (a.numReviews||0))
    .slice(0, 5)

  const statusBadge = (s) => <span className={`admin-badge ${s?.toLowerCase()}`}>{s}</span>

  return (
    <div className="admin-page">

      {/* ── Stat Cards ── */}
      <div className="admin-stats-grid">
        {[
          { label:'Total Revenue', value: fmtCurrency(stats?.totalRevenue), icon: <RevenueIcon/>, sub:'Paid orders only' },
          { label:'Total Orders',  value: stats?.totalOrders ?? 0,           icon: <OrderIcon/>,   sub:`${stats?.pendingOrders ?? 0} pending` },
          { label:'Products',      value: stats?.totalProducts ?? 0,         icon: <ProductIcon/>, sub:'Active listings' },
          { label:'Customers',     value: '—',                               icon: <UserIcon/>,    sub:'View customers tab' },
        ].map((s,i) => (
          <div className="admin-stat-card" key={i}>
            <div className="admin-stat-icon">{s.icon}</div>
            <div className="admin-stat-label">{s.label}</div>
            <div className="admin-stat-value">{s.value}</div>
            <div className="admin-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="admin-charts-grid">
        <div className="admin-chart-card">
          <div className="admin-chart-title">
            <em>Revenue Overview</em>
            <span>Monthly</span>
          </div>
          <canvas ref={revenueRef} style={{width:'100%', height:'200px', display:'block'}}/>
        </div>

        <div className="admin-chart-card">
          <div className="admin-chart-title"><em>Order Status</em></div>
          <canvas ref={donutRef} style={{width:'100%', height:'260px', display:'block'}}/>
        </div>
      </div>

      {/* ── Bottom row: Recent orders + Top products ── */}
      <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:'16px'}}>

        {/* Recent Orders */}
        <div className="admin-table-card">
          <div className="admin-table-header">
            <div className="admin-table-header-title"><em>Recent Orders</em></div>
            <button className="a-btn a-btn-outline a-btn-sm" onClick={() => setPage('orders')}>
              View All →
            </button>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0,6).map(o => (
                <tr key={o._id}>
                  <td style={{fontFamily:'monospace', fontSize:'11px', color:'var(--a-gold-dim)'}}>
                    #{o._id.slice(-6).toUpperCase()}
                  </td>
                  <td>{o.user?.name || '—'}</td>
                  <td style={{color:'var(--a-gold)'}}>{fmtCurrency(o.totalPrice)}</td>
                  <td>{statusBadge(o.orderStatus)}</td>
                </tr>
              ))}
              {!orders.length && (
                <tr><td colSpan="4" style={{textAlign:'center', padding:'24px', color:'rgba(245,240,235,0.25)'}}>No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Top Products */}
        <div className="admin-table-card">
          <div className="admin-table-header">
            <div className="admin-table-header-title"><em>Top Products</em></div>
            <button className="a-btn a-btn-outline a-btn-sm" onClick={() => setPage('products')}>
              Manage →
            </button>
          </div>
          <table className="admin-table">
            <thead>
              <tr><th>Product</th><th>Price</th><th>Stock</th></tr>
            </thead>
            <tbody>
              {topProducts.map(p => (
                <tr key={p._id}>
                  <td>
                    <div className="a-product-row">
                      {p.images?.[0]?.url
                        ? <img src={`http://localhost:5000${p.images[0].url}`} className="a-product-thumb" alt="" />
                        : <div className="a-product-thumb" style={{background:'#222', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'8px', color:'#555'}}>IMG</div>
                      }
                      <span style={{fontSize:'12px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:'120px'}}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{color:'var(--a-gold)'}}>${p.basePrice}</td>
                  <td>
                    <span style={{color: p.stock < 10 ? 'var(--a-danger)' : 'var(--a-white-dim)'}}>
                      {p.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function RevenueIcon()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> }
function OrderIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> }
function ProductIcon()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg> }
function UserIcon()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> }
