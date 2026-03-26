import { useEffect, useState } from 'react'
import { useAdminFetch } from '../context/AdminAuthContext'

const STATUSES = ['All','Placed','Confirmed','Processing','Shipped','Delivered','Cancelled','Returned']
const NEXT_STATUS = {
  Placed:'Confirmed', Confirmed:'Processing', Processing:'Shipped', Shipped:'Delivered'
}
const API = 'http://localhost:5000'

export default function Orders() {
  const apiFetch = useAdminFetch()
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('All')
  const [search,  setSearch]  = useState('')
  const [detail,  setDetail]  = useState(null)
  const [page,    setPage]    = useState(1)
  const [total,   setTotal]   = useState(0)
  const LIMIT = 15

  const load = async (pg=1) => {
    setLoading(true)
    const params = new URLSearchParams({ page: pg, limit: LIMIT, sort:'-createdAt' })
    if (filter !== 'All') params.set('status', filter)
    const res  = await apiFetch(`/orders/admin/all?${params}`)
    const data = await res.json()
    if (data.success) { setOrders(data.orders); setTotal(data.total || 0) }
    setLoading(false)
  }

  useEffect(() => { load(1); setPage(1) }, [filter])

  const advance = async (order) => {
    const next = NEXT_STATUS[order.orderStatus]
    if (!next) return
    await apiFetch(`/orders/admin/${order._id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: next }),
    })
    await load(page)
    if (detail?._id === order._id) setDetail(prev => ({...prev, orderStatus: next}))
  }

  const markPaid = async (id) => {
    await apiFetch(`/orders/admin/${id}/payment`, {
      method: 'PUT',
      body: JSON.stringify({ paymentResult:{ status:'Paid' } }),
    })
    await load(page)
  }

  const deleteOrder = async (id) => {
    if (!confirm('Permanently delete this order?')) return
    await apiFetch(`/orders/admin/${id}`, { method:'DELETE' })
    setDetail(null)
    await load(page)
  }

  const filtered = orders.filter(o =>
    o._id?.includes(search) ||
    o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.email?.toLowerCase().includes(search.toLowerCase())
  )

  const badge = (s) => <span className={`admin-badge ${s?.toLowerCase()}`}>{s}</span>
  const fmt   = (n) => `$${(n||0).toFixed(2)}`
  const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})

  const pages = Math.ceil(total / LIMIT)

  return (
    <div className="admin-page">
      <div className="admin-table-card">
        <div className="admin-table-header">
          <div className="admin-table-header-title"><em>Orders</em>
            <span style={{fontSize:'11px',fontFamily:'var(--a-font-body)',color:'var(--a-white-dim)',fontStyle:'normal',textTransform:'uppercase',letterSpacing:'0.1em'}}> — {total} total</span>
          </div>
          <div className="admin-filters">
            <div className="admin-search-wrap">
              <SearchIcon/>
              <input className="a-input admin-search-input" placeholder="Search ID or customer..." value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <select className="a-select" style={{width:'130px'}} value={filter} onChange={e=>setFilter(e.target.value)}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading"><div className="admin-spinner"/>Loading orders...</div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o._id}>
                    <td>
                      <button
                        style={{background:'none',border:'none',cursor:'pointer',fontFamily:'monospace',fontSize:'12px',color:'var(--a-gold-dim)',padding:0}}
                        onClick={() => setDetail(o)}
                      >
                        #{o._id.slice(-8).toUpperCase()}
                      </button>
                    </td>
                    <td>
                      <div style={{fontSize:'13px',color:'var(--a-white)'}}>{o.user?.name || 'Guest'}</div>
                      <div style={{fontSize:'10px',color:'var(--a-white-dim)'}}>{o.user?.email}</div>
                    </td>
                    <td style={{fontSize:'12px'}}>{fmtDate(o.createdAt)}</td>
                    <td style={{fontSize:'12px'}}>{o.items?.length ?? '—'}</td>
                    <td style={{color:'var(--a-gold)',fontWeight:'500'}}>{fmt(o.totalPrice)}</td>
                    <td>{badge(o.paymentStatus)}</td>
                    <td>{badge(o.orderStatus)}</td>
                    <td>
                      <div style={{display:'flex',gap:'5px'}}>
                        <button className="a-btn a-btn-outline a-btn-sm" onClick={() => setDetail(o)}>View</button>
                        {NEXT_STATUS[o.orderStatus] && (
                          <button className="a-btn a-btn-gold a-btn-sm" onClick={() => advance(o)}>
                            → {NEXT_STATUS[o.orderStatus]}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr><td colSpan="8" style={{textAlign:'center',padding:'32px',color:'rgba(245,240,235,0.25)'}}>No orders found</td></tr>
                )}
              </tbody>
            </table>

            {pages > 1 && (
              <div className="admin-pagination">
                <button className="admin-page-btn" disabled={page===1} onClick={() => { setPage(p=>p-1); load(page-1) }}>‹</button>
                {Array.from({length: Math.min(pages,7)}, (_,i) => i+1).map(n => (
                  <button key={n} className={`admin-page-btn${page===n?' active':''}`} onClick={() => { setPage(n); load(n) }}>{n}</button>
                ))}
                <button className="admin-page-btn" disabled={page===pages} onClick={() => { setPage(p=>p+1); load(page+1) }}>›</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Order Detail Modal ── */}
      {detail && (
        <div className="admin-modal-backdrop" onClick={e => e.target===e.currentTarget && setDetail(null)}>
          <div className="admin-modal" style={{maxWidth:'680px'}}>
            <div className="admin-modal-header">
              <div>
                <div className="admin-modal-title">Order #{detail._id.slice(-8).toUpperCase()}</div>
                <div style={{fontSize:'11px',color:'var(--a-white-dim)',marginTop:'3px'}}>{fmtDate(detail.createdAt)}</div>
              </div>
              <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                {badge(detail.orderStatus)}
                <button className="admin-icon-btn" onClick={() => setDetail(null)}><CloseIcon/></button>
              </div>
            </div>
            <div className="admin-modal-body">
              <div className="admin-detail-grid">
                {/* Customer */}
                <div className="admin-info-card">
                  <div className="admin-info-card-title">Customer</div>
                  <div className="admin-info-row"><label>Name</label><span>{detail.user?.name || '—'}</span></div>
                  <div className="admin-info-row"><label>Email</label><span>{detail.user?.email || '—'}</span></div>
                  <div className="admin-info-row"><label>Payment</label><span>{badge(detail.paymentStatus)}</span></div>
                  <div className="admin-info-row"><label>Method</label><span>{detail.paymentMethod}</span></div>
                </div>
                {/* Shipping */}
                <div className="admin-info-card">
                  <div className="admin-info-card-title">Shipping Address</div>
                  {detail.shippingAddress ? <>
                    <div className="admin-info-row"><label>Name</label><span>{detail.shippingAddress.fullName}</span></div>
                    <div className="admin-info-row"><label>Phone</label><span>{detail.shippingAddress.phone}</span></div>
                    <div className="admin-info-row"><label>Address</label><span>{detail.shippingAddress.line1}{detail.shippingAddress.line2 ? ', '+detail.shippingAddress.line2 : ''}</span></div>
                    <div className="admin-info-row"><label>City</label><span>{detail.shippingAddress.city}, {detail.shippingAddress.state}</span></div>
                    <div className="admin-info-row"><label>Pincode</label><span>{detail.shippingAddress.pincode}</span></div>
                  </> : <div style={{color:'var(--a-white-dim)',fontSize:'12px'}}>No address</div>}
                </div>
              </div>

              {/* Items */}
              <div className="admin-info-card" style={{marginBottom:'14px'}}>
                <div className="admin-info-card-title">Items</div>
                <table className="admin-table" style={{marginTop:'8px'}}>
                  <thead><tr><th>Product</th><th>Vol</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
                  <tbody>
                    {(detail.items||[]).map((item,i) => (
                      <tr key={i}>
                        <td>
                          <div className="a-product-row">
                            {item.image && <img src={`${API}${item.image}`} className="a-product-thumb" alt=""/>}
                            <span style={{fontSize:'12px'}}>{item.name}</span>
                          </div>
                        </td>
                        <td style={{fontSize:'11px'}}>{item.volume ? `${item.volume}ml` : '—'}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price}</td>
                        <td style={{color:'var(--a-gold)'}}>${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="admin-info-card">
                <div className="admin-info-card-title">Order Summary</div>
                <div className="admin-info-row"><label>Items Total</label><span>{fmt(detail.itemsTotal)}</span></div>
                <div className="admin-info-row"><label>Shipping</label><span>{detail.shippingPrice===0?'Free':fmt(detail.shippingPrice)}</span></div>
                <div className="admin-info-row"><label>Tax (18% GST)</label><span>{fmt(detail.taxPrice)}</span></div>
                {detail.discount > 0 && <div className="admin-info-row"><label>Discount</label><span style={{color:'var(--a-success)'}}>-{fmt(detail.discount)}</span></div>}
                <div className="admin-info-row" style={{borderTop:'1px solid var(--a-border)',marginTop:'4px',paddingTop:'4px'}}>
                  <label style={{fontWeight:'600',color:'var(--a-white)'}}>Total</label>
                  <span style={{color:'var(--a-gold)',fontSize:'16px',fontFamily:'var(--a-font-display)'}}>{fmt(detail.totalPrice)}</span>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="a-btn a-btn-danger a-btn-sm" onClick={() => deleteOrder(detail._id)}>Delete Order</button>
              {detail.paymentStatus !== 'Paid' && (
                <button className="a-btn a-btn-outline" onClick={() => markPaid(detail._id)}>Mark Paid</button>
              )}
              {NEXT_STATUS[detail.orderStatus] && (
                <button className="a-btn a-btn-gold" onClick={() => advance(detail)}>
                  Move to {NEXT_STATUS[detail.orderStatus]}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SearchIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }
function CloseIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }
