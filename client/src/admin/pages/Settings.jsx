import { useState } from 'react'
import { useAdminAuth, useAdminFetch } from '../context/AdminAuthContext'

export default function Settings() {
  const { admin }  = useAdminAuth()
  const apiFetch   = useAdminFetch()

  const [name,     setName]     = useState(admin?.name || '')
  const [phone,    setPhone]    = useState('')
  const [curPw,    setCurPw]    = useState('')
  const [newPw,    setNewPw]    = useState('')
  const [confPw,   setConfPw]   = useState('')
  const [profMsg,  setProfMsg]  = useState('')
  const [pwMsg,    setPwMsg]    = useState('')
  const [profErr,  setProfErr]  = useState('')
  const [pwErr,    setPwErr]    = useState('')

  const saveProfile = async (e) => {
    e.preventDefault(); setProfErr(''); setProfMsg('')
    try {
      const res  = await apiFetch('/auth/me', {
        method: 'PUT',
        body: JSON.stringify({ name, phone }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setProfMsg('Profile updated successfully')
    } catch(err) { setProfErr(err.message) }
  }

  const savePassword = async (e) => {
    e.preventDefault(); setPwErr(''); setPwMsg('')
    if (newPw !== confPw) { setPwErr('New passwords do not match'); return }
    if (newPw.length < 6) { setPwErr('Password must be at least 6 characters'); return }
    try {
      const res  = await apiFetch('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword: curPw, newPassword: newPw }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setPwMsg('Password changed successfully')
      setCurPw(''); setNewPw(''); setConfPw('')
    } catch(err) { setPwErr(err.message) }
  }

  const initials = admin?.name?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() || 'AD'

  return (
    <div className="admin-page" style={{maxWidth:'680px'}}>
      {/* Profile card */}
      <div className="admin-info-card" style={{marginBottom:'16px'}}>
        <div style={{display:'flex', alignItems:'center', gap:'16px', marginBottom:'20px'}}>
          <div style={{
            width:'56px', height:'56px', borderRadius:'50%',
            background:'var(--a-gold-faint)',
            border:'1px solid rgba(236,215,152,0.2)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'18px', fontWeight:'500', color:'var(--a-gold)',
            fontFamily:'var(--a-font-display)',
          }}>
            {initials}
          </div>
          <div>
            <div style={{fontSize:'18px', fontFamily:'var(--a-font-display)', fontWeight:'300', color:'var(--a-white)'}}>{admin?.name}</div>
            <div style={{fontSize:'11px', color:'var(--a-gold-dim)', letterSpacing:'0.1em', textTransform:'uppercase', marginTop:'2px'}}>Administrator</div>
            <div style={{fontSize:'12px', color:'var(--a-white-dim)', marginTop:'2px'}}>{admin?.email}</div>
          </div>
        </div>

        <div style={{fontSize:'10px', fontWeight:'600', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(245,240,235,0.3)', marginBottom:'16px'}}>
          Edit Profile
        </div>

        {profErr && <div className="admin-error-msg" style={{marginBottom:'14px'}}>{profErr}</div>}
        {profMsg && <div style={{background:'rgba(76,175,125,0.08)',border:'1px solid rgba(76,175,125,0.2)',color:'var(--a-success)',padding:'10px 14px',fontSize:'12px',marginBottom:'14px'}}>{profMsg}</div>}

        <form onSubmit={saveProfile}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
            <div className="a-form-group">
              <label className="a-label">Full Name</label>
              <input className="a-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/>
            </div>
            <div className="a-form-group">
              <label className="a-label">Phone</label>
              <input className="a-input" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+91 98765 43210"/>
            </div>
            <div className="a-form-group">
              <label className="a-label">Email</label>
              <input className="a-input" value={admin?.email || ''} disabled style={{opacity:0.5, cursor:'not-allowed'}}/>
            </div>
            <div className="a-form-group">
              <label className="a-label">Role</label>
              <input className="a-input" value="Administrator" disabled style={{opacity:0.5, cursor:'not-allowed'}}/>
            </div>
          </div>
          <button type="submit" className="a-btn a-btn-gold" style={{marginTop:'8px'}}>
            Save Profile
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="admin-info-card">
        <div style={{fontSize:'10px', fontWeight:'600', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(245,240,235,0.3)', marginBottom:'16px'}}>
          Change Password
        </div>

        {pwErr  && <div className="admin-error-msg" style={{marginBottom:'14px'}}>{pwErr}</div>}
        {pwMsg  && <div style={{background:'rgba(76,175,125,0.08)',border:'1px solid rgba(76,175,125,0.2)',color:'var(--a-success)',padding:'10px 14px',fontSize:'12px',marginBottom:'14px'}}>{pwMsg}</div>}

        <form onSubmit={savePassword}>
          <div className="a-form-group">
            <label className="a-label">Current Password</label>
            <input className="a-input" type="password" value={curPw} onChange={e=>setCurPw(e.target.value)} placeholder="••••••••" required/>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
            <div className="a-form-group">
              <label className="a-label">New Password</label>
              <input className="a-input" type="password" value={newPw} onChange={e=>setNewPw(e.target.value)} placeholder="Min 6 characters" required/>
            </div>
            <div className="a-form-group">
              <label className="a-label">Confirm New Password</label>
              <input className="a-input" type="password" value={confPw} onChange={e=>setConfPw(e.target.value)} placeholder="Repeat new password" required/>
            </div>
          </div>
          <button type="submit" className="a-btn a-btn-gold" style={{marginTop:'8px'}}>
            Update Password
          </button>
        </form>
      </div>
    </div>
  )
}
