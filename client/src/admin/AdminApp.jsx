import { useState, useEffect } from 'react'
import './admin.css'
import { AdminAuthProvider, useAdminAuth, useAdminFetch } from './context/AdminAuthContext'
import AdminLogin   from './pages/AdminLogin'
import Dashboard    from './pages/Dashboard'
import Products     from './pages/Products'
import Orders       from './pages/Orders'
import Customers    from './pages/Customers'
import Analytics    from './pages/Analytics'
import Settings     from './pages/Settings'
import AdminSidebar from './components/Sidebar'

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  analytics: 'Analytics',
  products:  'Products',
  orders:    'Orders',
  customers: 'Customers',
  settings:  'Settings',
}

function AdminShell() {
  const { admin, loading } = useAdminAuth()
  const apiFetch = useAdminFetch()
  const [page,         setPage]         = useState('dashboard')
  const [sidebarOpen,  setSidebarOpen]  = useState(false)
  const [pendingCount, setPendingCount] = useState(0)

  // Fetch pending order count for sidebar badge
  useEffect(() => {
    if (!admin) return
    const load = async () => {
      try {
        const res  = await apiFetch('/orders/admin/stats')
        const data = await res?.json()
        if (data?.success) setPendingCount(data.stats.pendingOrders || 0)
      } catch {}
    }
    load()
  }, [admin, page])

  if (loading) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0a0a0a'}}>
        <div className="admin-spinner"/>
      </div>
    )
  }

  if (!admin) return <AdminLogin/>

  const renderPage = () => {
    switch(page) {
      case 'dashboard':  return <Dashboard setPage={setPage}/>
      case 'analytics':  return <Analytics/>
      case 'products':   return <Products/>
      case 'orders':     return <Orders/>
      case 'customers':  return <Customers/>
      case 'settings':   return <Settings/>
      default:           return <Dashboard setPage={setPage}/>
    }
  }

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <AdminSidebar
        page={page}
        setPage={(p) => { setPage(p); setSidebarOpen(false) }}
        pendingCount={pendingCount}
        sidebarOpen={sidebarOpen}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:99,display:'block'}}
        />
      )}

      {/* Main */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          {/* Hamburger for mobile */}
          <button
            className="admin-icon-btn"
            style={{display:'none'}}
            id="sidebar-toggle"
            onClick={() => setSidebarOpen(o => !o)}
          >
            <HamburgerIcon/>
          </button>

          <div className="admin-topbar-title">
            <em>{PAGE_TITLES[page]}</em>
          </div>

          <div className="admin-topbar-actions">
            {pendingCount > 0 && (
              <button
                className="admin-icon-btn"
                onClick={() => setPage('orders')}
                title={`${pendingCount} pending orders`}
                style={{position:'relative'}}
              >
                <BellIcon/>
                <span style={{
                  position:'absolute', top:'-4px', right:'-4px',
                  width:'16px', height:'16px', borderRadius:'50%',
                  background:'var(--a-gold)', color:'var(--a-black)',
                  fontSize:'9px', fontWeight:'700',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  {pendingCount > 9 ? '9+' : pendingCount}
                </span>
              </button>
            )}
            <button className="admin-icon-btn" onClick={() => setPage('settings')} title="Settings">
              <SettingsIcon/>
            </button>
          </div>
        </header>

        {/* Page content */}
        {renderPage()}
      </div>
    </div>
  )
}

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <AdminShell/>
    </AdminAuthProvider>
  )
}

function HamburgerIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg> }
function BellIcon()      { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg> }
function SettingsIcon()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> }
