import { useState } from 'react'
import { useAdminAuth } from '../context/AdminAuthContext'

export default function AdminLogin() {
  const { login } = useAdminAuth()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">Lunave</div>
        <div className="admin-login-sub">Admin Access</div>

        {error && <div className="admin-error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="a-form-group">
            <label className="a-label">Email Address</label>
            <input
              className="a-input"
              type="email"
              placeholder="admin@lunave.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="a-form-group" style={{marginBottom: '24px'}}>
            <label className="a-label">Password</label>
            <input
              className="a-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="a-btn a-btn-gold"
            style={{width: '100%', justifyContent: 'center', padding: '13px'}}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{textAlign:'center', marginTop:'20px', fontSize:'11px', color:'rgba(245,240,235,0.25)', letterSpacing:'0.05em'}}>
          This panel is restricted to administrators only.
        </p>
      </div>
    </div>
  )
}
