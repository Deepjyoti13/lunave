// client/src/context/WishlistContext.jsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const API_URL = 'http://localhost:5001'
const WishlistCtx = createContext(null)

export function WishlistProvider({ children }) {
  const { token } = useAuth()

  const [items, setItems]     = useState([])
  const [open, setOpen]       = useState(false)
  const [loading, setLoading] = useState(false)

  const totalCount = items.length

  // ── fetch wishlist ──────────────────────────────────────────────────────
  const fetchWishlist = useCallback(async () => {
    if (!token) {
      setItems([])
      return
    }
    setLoading(true)
    try {
      const res  = await fetch(`${API_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) setItems(data.wishlist.items)
      else throw new Error(data.message)
    } catch (err) {
      toast.error('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetchWishlist() }, [fetchWishlist])

  // ── isWished ────────────────────────────────────────────────────────────
  const isWished = useCallback(
    (productId) => items.some(item => item.product === productId || item.product?._id === productId),
    [items]
  )

  // ── addItem ─────────────────────────────────────────────────────────────
  const addItem = useCallback(async (product) => {
    if (!token) {
      toast.error('Please login to continue')
      return
    }
    try {
      const res  = await fetch(`${API_URL}/api/wishlist`, {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id }),
      })
      const data = await res.json()
      if (data.success) {
        setItems(data.wishlist.items)
        toast.success('Added to wishlist ♡')
      } else {
        throw new Error(data.message)
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add to wishlist')
    }
  }, [token])

  // ── removeItem ──────────────────────────────────────────────────────────
  const removeItem = useCallback(async (productId) => {
    if (!token) {
      toast.error('Please login to continue')
      return
    }
    try {
      const res  = await fetch(`${API_URL}/api/wishlist/${productId}`, {
        method:  'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setItems(data.wishlist.items)
        toast.success('Removed from wishlist')
      } else {
        throw new Error(data.message)
      }
    } catch (err) {
      toast.error(err.message || 'Failed to remove from wishlist')
    }
  }, [token])

  // ── clearWishlist ───────────────────────────────────────────────────────
  const clearWishlist = useCallback(async () => {
    if (!token) return
    try {
      const res  = await fetch(`${API_URL}/api/wishlist`, {
        method:  'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setItems([])
      } else {
        throw new Error(data.message)
      }
    } catch (err) {
      toast.error('Failed to clear wishlist')
    }
  }, [token])

  return (
    <WishlistCtx.Provider value={{
      items,
      totalCount,
      open,
      setOpen,
      loading,
      addItem,
      removeItem,
      clearWishlist,
      isWished,
    }}>
      {children}
    </WishlistCtx.Provider>
  )
}

export const useWishlist = () => {
  const ctx = useContext(WishlistCtx)
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider')
  return ctx
}
