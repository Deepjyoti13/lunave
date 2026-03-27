import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const API_URL = 'http://localhost:5001'
const CartCtx = createContext(null)

export function CartProvider({ children }) {
  const { token } = useAuth()

  const [items, setItems]     = useState([])
  const [open, setOpen]       = useState(false)
  const [loading, setLoading] = useState(false)

  // ── derived values ─────────────────────────────────────
  const totalCount = items.reduce((s, i) => s + i.quantity, 0)
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0)

  // ── fetch cart (ONLY if logged in) ─────────────────────
  const fetchCart = useCallback(async () => {
    if (!token) {
      setItems([])
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (data.success) {
        setItems(data.cart.items)
      } else {
        throw new Error(data.message)
      }

    } catch (err) {
      toast.error('Failed to load cart')
    } finally {
      setLoading(false)
    }

  }, [token])

  // auto-fetch when token changes
  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  // ── ADD ITEM ───────────────────────────────────────────
  const addItem = useCallback(async (product, volume) => {

    if (!token) {
      toast.error('Please login to continue')
      return
    }

    setOpen(true)

    try {
      const res = await fetch(`${API_URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
          volume,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setItems(data.cart.items)
        toast.success('Added to cart ✨')
      } else {
        throw new Error(data.message)
      }

    } catch (err) {
      toast.error(err.message || 'Failed to add item')
    }

  }, [token])

  // ── UPDATE QUANTITY ────────────────────────────────────
  const updateQty = useCallback(async (itemId, quantity) => {

    if (!token) {
      toast.error('Please login')
      return
    }

    if (quantity < 1) {
      return removeItem(itemId)
    }

    try {
      const res = await fetch(`${API_URL}/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      })

      const data = await res.json()

      if (data.success) {
        setItems(data.cart.items)
      } else {
        throw new Error(data.message)
      }

    } catch (err) {
      toast.error('Failed to update quantity')
    }

  }, [token])

  // ── REMOVE ITEM ────────────────────────────────────────
  const removeItem = useCallback(async (itemId) => {

    if (!token) {
      toast.error('Please login')
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (data.success) {
        setItems(data.cart.items)
        toast.success('Item removed')
      } else {
        throw new Error(data.message)
      }

    } catch (err) {
      toast.error('Failed to remove item')
    }

  }, [token])

  // ── CLEAR CART ─────────────────────────────────────────
  const clearCart = useCallback(async () => {

    if (!token) {
      toast.error('Please login')
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/cart`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (data.success) {
        setItems([])
        toast.success('Cart cleared')
      } else {
        throw new Error(data.message)
      }

    } catch (err) {
      toast.error('Failed to clear cart')
    }

  }, [token])

  return (
    <CartCtx.Provider value={{
      items,
      totalCount,
      totalPrice,
      open,
      setOpen,
      loading,
      addItem,
      updateQty,
      removeItem,
      clearCart,
    }}>
      {children}
    </CartCtx.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartCtx)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}