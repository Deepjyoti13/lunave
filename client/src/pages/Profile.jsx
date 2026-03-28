import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import '../styles/Profile.css'

const API_URL = 'http://localhost:5001'

function resolveImg(url) {
  if (!url) return null
  return url.startsWith('http') ? url : `${API_URL}${url}`
}

const STATUS_META = {
  Placed:     { label: 'Placed',     color: 'gold',  step: 0 },
  Confirmed:  { label: 'Confirmed',  color: 'gold',  step: 1 },
  Processing: { label: 'Processing', color: 'gold',  step: 2 },
  Shipped:    { label: 'Shipped',    color: 'blue',  step: 3 },
  Delivered:  { label: 'Delivered',  color: 'green', step: 4 },
  Cancelled:  { label: 'Cancelled',  color: 'red',   step: -1 },
  Returned:   { label: 'Returned',   color: 'red',   step: -1 },
}

const STEPS = ['Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered']

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false)
  const meta    = STATUS_META[order.orderStatus] ?? { label: order.orderStatus, color: 'gold', step: 0 }
  const isPaid  = order.paymentStatus === 'Paid'
  const isBad   = meta.step === -1

  return (
    <div className={`poc${isPaid ? ' poc--approved' : ''}${isBad ? ' poc--bad' : ''}`}>

      {/* ── Header ── */}
      <div className="poc-head">
        <div className="poc-head-left">
          <span className="poc-id">#{order._id.slice(-6).toUpperCase()}</span>
          <span className="poc-date">
            {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </span>
        </div>
        <div className="poc-head-right">
          <span className={`poc-status poc-status--${meta.color}`}>{meta.label}</span>
          <button
            className={`poc-toggle${expanded ? ' open' : ''}`}
            onClick={() => setExpanded(v => !v)}
            aria-label="Toggle order details"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Product strip (always visible) ── */}
      <div className="poc-items-strip">
        {order.items?.map((item, i) => {
          const img = resolveImg(item.image)
          return (
            <div className="poc-item-thumb" key={i} title={`${item.name} × ${item.quantity}`}>
              <div className="poc-thumb-img-wrap">
                {img
                  ? <img src={img} alt={item.name} onError={e => { e.currentTarget.style.display = 'none' }} />
                  : <span className="poc-thumb-placeholder">L</span>
                }
                <span className="poc-thumb-qty">×{item.quantity}</span>
              </div>
              <span className="poc-thumb-name">{item.name}</span>
            </div>
          )
        })}
      </div>

      {/* ── Expandable detail ── */}
      {expanded && (
        <div className="poc-detail">
          <div className="poc-detail-items">
            {order.items?.map((item, i) => {
              const img = resolveImg(item.image)
              return (
                <div className="poc-detail-row" key={i}>
                  <div className="poc-detail-img-wrap">
                    {img
                      ? <img src={img} alt={item.name} onError={e => { e.currentTarget.style.display = 'none' }} />
                      : <span className="poc-thumb-placeholder">L</span>
                    }
                  </div>
                  <div className="poc-detail-info">
                    <div className="poc-detail-name">{item.name}</div>
                    {item.volume && <div className="poc-detail-vol">{item.volume}ml · Eau de Parfum</div>}
                    <div className="poc-detail-qty">Qty: {item.quantity}</div>
                  </div>
                  <div className="poc-detail-price">₹{(item.price * item.quantity).toFixed(2)}</div>
                </div>
              )
            })}
          </div>

          {/* Progress tracker */}
          {!isBad && (
            <div className="poc-progress">
              {STEPS.map((s, i) => {
                const done    = meta.step > i
                const current = meta.step === i
                return (
                  <div className={`poc-prog-step${done ? ' done' : current ? ' current' : ''}`} key={s}>
                    <div className="poc-prog-dot">
                      {done && (
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    {i < STEPS.length - 1 && <div className="poc-prog-line" />}
                    <span className="poc-prog-label">{s}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Footer ── */}
      <div className="poc-foot">
        <div className="poc-foot-left">
          <span className="poc-pay-method">{order.paymentMethod}</span>
          <span className={`poc-pay-status${isPaid ? ' paid' : ''}`}>
            {isPaid ? '✓ Payment Verified' : 'Payment Pending'}
          </span>
        </div>
        <div className="poc-total">₹{order.totalPrice?.toFixed(2)}</div>
      </div>

      {/* ── Approved banner ── */}
      {isPaid && (
        <div className="poc-approved-banner">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Your order has been approved by us — we're getting it ready for you.
        </div>
      )}
    </div>
  )
}

export default function Profile() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders]               = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  useEffect(() => {
    if (!token) return
    const fetchOrders = async () => {
      try {
        const res  = await fetch(`${API_URL}/api/orders/my`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) setOrders(data.orders)
        else throw new Error(data.message)
      } catch {
        toast.error('Failed to load orders')
      } finally {
        setLoadingOrders(false)
      }
    }
    fetchOrders()
  }, [token])

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/')
  }

  const totalSpent  = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)
  const memberSince = user
    ? new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
    : '—'

  if (!user) return null

  return (
    <div className="profile-page">

      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-avatar">{(user.name?.[0] ?? '?').toUpperCase()}</div>
        <div className="profile-info">
          <div className="profile-name">{user.name}</div>
          <div className="profile-email">{user.email}</div>
          <div className="profile-member-badge">Lunave Member</div>
        </div>
        <button className="profile-logout-btn" onClick={handleLogout}>Sign Out</button>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="profile-stat">
          <span className="profile-stat-value">{orders.length}</span>
          <span className="profile-stat-label">Orders</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-value">
            ₹{totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
          <span className="profile-stat-label">Total Spent</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-value">{memberSince}</span>
          <span className="profile-stat-label">Member Since</span>
        </div>
      </div>

      {/* Order history */}
      <section className="profile-orders">
        <div className="profile-orders-heading">Order History</div>

        {loadingOrders ? (
          <p className="profile-loading">Loading orders…</p>
        ) : orders.length === 0 ? (
          <p className="profile-empty">No orders placed yet.</p>
        ) : (
          orders.map(order => <OrderCard key={order._id} order={order} />)
        )}
      </section>
    </div>
  )
}
