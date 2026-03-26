import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import '../styles/Auth.css'

const API_URL = 'http://localhost:5001'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Account created! Please log in.')
        navigate('/login')
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
            "Wear your story. Let your scent speak first."
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="auth-right">
        <div className="auth-form-inner">
          <h1 className="auth-form-title">Create Account</h1>
          <p className="auth-form-sub">Join the House of Lunave</p>

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="register-name">Full Name</label>
              <input
                id="register-name"
                className="auth-input"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="register-email">Email Address</label>
              <input
                id="register-email"
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="register-password">Password</label>
              <input
                id="register-password"
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="auth-submit" type="submit">
              Create Account →
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
