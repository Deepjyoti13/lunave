import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './context/Cartcontext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import CartDrawer from './components/Cartdrawer.jsx'
import WishlistDrawer from './components/WishlistDrawer.jsx'
import HomePage from './pages/HomePage.jsx'
import AdminApp from './admin/AdminApp.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Toaster position="top-right" />
          <CartDrawer />
          <WishlistDrawer />

          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin/*" element={<AdminApp />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}