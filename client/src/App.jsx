import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './context/Cartcontext.jsx'
import CartDrawer from './components/Cartdrawer.jsx'
import HomePage from './pages/HomePage.jsx'
import AdminApp from './admin/AdminApp.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster position="top-right" />   {/* 🔥 toast UI */}
        <CartDrawer />

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>

      </CartProvider>
    </AuthProvider>
  )
}