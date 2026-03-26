import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import '../styles/Auth.css'

const API_URL = 'http://localhost:5001'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.success) {
        login(data)
        toast.success('Welcome back!')
        navigate('/')
      } else {
        throw new Error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="auth-page">
      {/* Brand panel */}
      <div className="auth-left">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">Lunave</Link>
          <div className="auth-tagline">Luxury Perfumery</div>
          <div className="auth-ornament">
            <div className="auth-ornament-line"></div>
            <div className="auth-ornament-diamond"></div>
            <div className="auth-ornament-line right"></div>
          </div>
          <p className="auth-quote">
            "A fragrance is the invisible part of your personality."
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="auth-right">
        <div className="auth-form-inner">
          <h1 className="auth-form-title">Welcome Back</h1>
          <p className="auth-form-sub">Sign in to your account</p>

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="auth-submit" type="submit">
              Sign In →
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{' '}
            <Link to="/register">Create one here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
