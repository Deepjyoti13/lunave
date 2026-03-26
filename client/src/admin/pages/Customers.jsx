import { useEffect, useState } from 'react'
import { useAdminFetch } from '../context/AdminAuthContext'

// We fetch all orders and derive customer data from them
// since there's no dedicated /users admin endpoint yet
export default function Customers() {
  const apiFetch = useAdminFetch()
  const [customers, setCustomers] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [selected,  setSelected]  = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res  = await apiFetch('/orders/admin/all?limit=200&sort=-createdAt')
        const data = await res.json()
        if (!data.success) return

        // Build customer map from orders
        const map = {}
        data.orders.forEach(o => {
          if (!o.user) return
          const id = o.user._id || o.user
          if (!map[id]) {
            map[id] = {
              _id:        id,
              name:       o.user.name  || '—',
              email:      o.user.email || '—',
              orders:     [],
              totalSpent: 0,
            }
          }
          map[id].orders.push(o)
          if (o.paymentStatus === 'Paid') map[id].totalSpent += o.totalPrice || 0
        })

        const list = Object.values(map).sort((a,b) => b.totalSpent - a.totalSpent)
        setCustomers(list)
      } catch(e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const fmt = (n) => `$${(n||0).toFixed(2)}`
  const badge = (s) => <span className={`admin-badge ${s?.toLowerCase()}`}>{s}</span>

  return (
    <div className="admin-page">
      <div className="admin-table-card">
        <div className="admin-table-header">
          <div className="admin-table-header-title">
            <em>Customers</em>
          </div>
          <div className="admin-filters">
            <div className="admin-search-wrap">
              <SearchIcon/>
              <input
                className="a-input admin-search-input"
                placeholder="Search name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading"><div className="admin-spinner"/>Loading customers...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Last Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c._id}>
                  <td>
                    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                      <div style={{
                        width:'32px', height:'32px', borderRadius:'50%',
                        background:'var(--a-gold-faint)',
                        border:'1px solid rgba(236,215,152,0.15)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:'11px', fontWeight:'600', color:'var(--a-gold)',
                        flexShrink: 0,
                      }}>
                        {c.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
                      </div>
                      <span style={{fontSize:'13px', color:'var(--a-white)', fontWeight:'400'}}>
                        {c.name}
                      </span>
                    </div>
                  </td>
                  <td style={{fontSize:'12px', color:'var(--a-white-dim)'}}>{c.email}</td>
                  <td style={{fontSize:'13px'}}>{c.orders.length}</td>
                  <td style={{color:'var(--a-gold)', fontWeight:'500'}}>{fmt(c.totalSpent)}</td>
                  <td style={{fontSize:'12px', color:'var(--a-white-dim)'}}>
                    {c.orders[0] ? new Date(c.orders[0].createdAt).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '—'}
                  </td>
                  <td>
                    <button className="a-btn a-btn-outline a-btn-sm" onClick={() => setSelected(c)}>
                      View Orders
                    </button>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan="6" style={{textAlign:'center', padding:'32px', color:'rgba(245,240,235,0.25)'}}>
                    {search ? 'No customers match your search' : 'No customer data yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Customer Order History Modal ── */}
      {selected && (
        <div className="admin-modal-backdrop" onClick={e => e.target===e.currentTarget && setSelected(null)}>
          <div className="admin-modal" style={{maxWidth:'620px'}}>
            <div className="admin-modal-header">
              <div>
                <div className="admin-modal-title">{selected.name}</div>
                <div style={{fontSize:'12px', color:'var(--a-white-dim)', marginTop:'3px'}}>
                  {selected.email} · {selected.orders.length} orders · {fmt(selected.totalSpent)} spent
                </div>
              </div>
              <button className="admin-icon-btn" onClick={() => setSelected(null)}><CloseIcon/></button>
            </div>
            <div className="admin-modal-body">
              {/* Customer summary cards */}
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px', marginBottom:'20px'}}>
                {[
                  { label:'Total Orders',    value: selected.orders.length },
                  { label:'Total Spent',     value: fmt(selected.totalSpent) },
                  { label:'Avg Order Value', value: selected.orders.length
                    ? fmt(selected.totalSpent / selected.orders.length) : '$0.00'
                  },
                ].map((s,i) => (
                  <div key={i} style={{background:'var(--a-surface)', border:'1px solid var(--a-border)', padding:'14px 16px'}}>
                    <div style={{fontSize:'9px', fontWeight:'600', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--a-white-dim)', marginBottom:'6px'}}>
                      {s.label}
                    </div>
                    <div style={{fontFamily:'var(--a-font-display)', fontSize:'22px', fontWeight:'300', color:'var(--a-gold)'}}>
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order list */}
              <div style={{fontSize:'10px', fontWeight:'600', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--a-white-dim)', marginBottom:'10px'}}>
                Order History
              </div>
              <table className="admin-table">
                <thead>
                  <tr><th>Order</th><th>Date</th><th>Total</th><th>Payment</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {selected.orders.map(o => (
                    <tr key={o._id}>
                      <td style={{fontFamily:'monospace', fontSize:'11px', color:'var(--a-gold-dim)'}}>
                        #{o._id.slice(-8).toUpperCase()}
                      </td>
                      <td style={{fontSize:'11px'}}>
                        {new Date(o.createdAt).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}
                      </td>
                      <td style={{color:'var(--a-gold)'}}>{fmt(o.totalPrice)}</td>
                      <td>{badge(o.paymentStatus)}</td>
                      <td>{badge(o.orderStatus)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="admin-modal-footer">
              <button className="a-btn a-btn-outline" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SearchIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }
function CloseIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }
