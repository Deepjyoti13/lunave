import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const API_URL = 'http://localhost:5000'

export default function Profile() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  // Guard: redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  // Fetch order history
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
      } catch (err) {
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

  if (!user) return null

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">{user.name[0].toUpperCase()}</div>
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>

      <section className="profile-orders">
        <h3>Order History</h3>

        {loadingOrders ? (
          <p>Loading orders…</p>
        ) : orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6).toUpperCase()}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>₹{order.totalPrice?.toFixed(2)}</td>
                  <td>{order.orderStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
