import { createContext, useContext, useEffect, useState } from 'react'

const AdminAuthContext = createContext(null)

const API = 'http://localhost:5001/api'

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin]     = useState(null)
  const [loading, setLoading] = useState(true)

  // Re-hydrate on refresh
  useEffect(() => {
    const token = localStorage.getItem('lunave_admin_token')
    const user  = localStorage.getItem('lunave_admin_user')
    if (token && user) {
      try {
        const parsed = JSON.parse(user)
        if (parsed.role === 'admin') {
          setAdmin({ ...parsed, token })
        }
      } catch {}
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res  = await fetch(`${API}/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    if (data.user.role !== 'admin') throw new Error('Access denied — admin only')

    localStorage.setItem('lunave_admin_token', data.token)
    localStorage.setItem('lunave_admin_user',  JSON.stringify(data.user))
    setAdmin({ ...data.user, token: data.token })
    return data
  }

  const logout = () => {
    localStorage.removeItem('lunave_admin_token')
    localStorage.removeItem('lunave_admin_user')
    setAdmin(null)
  }

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => useContext(AdminAuthContext)

// Convenience: pre-wired fetch with admin token
export function useAdminFetch() {
  const { admin, logout } = useAdminAuth()

  const apiFetch = async (path, options = {}) => {
    const res = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${admin?.token}`,
        ...(options.body && !(options.body instanceof FormData)
          ? { 'Content-Type': 'application/json' }
          : {}),
      },
    })
    if (res.status === 401) { logout(); return null }
    return res
  }

  return apiFetch
}
