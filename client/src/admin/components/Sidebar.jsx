import { useAdminAuth } from '../context/AdminAuthContext'

const NAV = [
  {
    section: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <GridIcon /> },
      { id: 'analytics', label: 'Analytics',  icon: <ChartIcon /> },
    ],
  },
  {
    section: 'Catalogue',
    items: [
      { id: 'products', label: 'Products', icon: <BoxIcon /> },
    ],
  },
  {
    section: 'Commerce',
    items: [
      { id: 'orders',    label: 'Orders',    icon: <BagIcon />,   badge: 'pending' },
      { id: 'customers', label: 'Customers', icon: <UsersIcon /> },
    ],
  },
  {
    section: 'Account',
    items: [
      { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
    ],
  },
]

export default function AdminSidebar({ page, setPage, pendingCount, sidebarOpen }) {
  const { admin, logout } = useAdminAuth()
  const initials = admin?.name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || 'AD'

  return (
    <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
      <div className="admin-sidebar-logo">
        <div>
          <span>Lunave</span>
          <small>Admin Panel</small>
        </div>
      </div>

      <nav className="admin-nav">
        {NAV.map(group => (
          <div key={group.section}>
            <div className="admin-nav-section">{group.section}</div>
            {group.items.map(item => (
              <button
                key={item.id}
                className={`admin-nav-item${page === item.id ? ' active' : ''}`}
                onClick={() => setPage(item.id)}
              >
                {item.icon}
                {item.label}
                {item.badge === 'pending' && pendingCount > 0 && (
                  <span className="admin-nav-badge">{pendingCount}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-user-avatar">{initials}</div>
        <div className="admin-user-info">
          <div className="admin-user-name">{admin?.name}</div>
          <div className="admin-user-role">Admin</div>
        </div>
        <button className="admin-icon-btn" onClick={logout} title="Logout" style={{flexShrink:0}}>
          <LogoutIcon />
        </button>
      </div>
    </aside>
  )
}

/* ── Inline SVG icons (no dependency) ── */
function GridIcon()     { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> }
function ChartIcon()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }
function BoxIcon()      { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> }
function BagIcon()      { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> }
function UsersIcon()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> }
function SettingsIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> }
function LogoutIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
