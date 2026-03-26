import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import '../styles/Profile.css'

const API_URL = 'http://localhost:5001'

export default function Profile() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  useEffect(() => {
    if (!token) return
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders/my`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) {
          setOrders(data.orders)
        } else {
          throw new Error(data.message)
        }
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

  // Compute stats from orders
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)
  const memberSince = user
    ? new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', {
        month: 'short',
        year: '2-digit',
      })
    : '—'

  if (!user) return null

  return (
    <div className="profile-page">
      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-avatar">
          {(user.name?.[0] ?? '?').toUpperCase()}
        </div>
        <div className="profile-info">
          <div className="profile-name">{user.name}</div>
          <div className="profile-email">{user.email}</div>
          <div className="profile-member-badge">Lunave Member</div>
        </div>
        <button className="profile-logout-btn" onClick={handleLogout}>
          Sign Out
        </button>
      </div>

      {/* Stats bar */}
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
          orders.map((order) => (
            <div className="profile-order-card" key={order._id}>
              <div className="order-id">
                #{order._id.slice(-6).toUpperCase()}
              </div>
              <div className="order-date">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
              <div className="order-total">
                ₹{order.totalPrice?.toFixed(2)}
              </div>
              <div
                className={`order-status-badge ${
                  order.orderStatus?.toLowerCase() === 'delivered'
                    ? 'delivered'
                    : 'other'
                }`}
              >
                {order.orderStatus}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  )
}
