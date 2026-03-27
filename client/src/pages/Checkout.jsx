import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, ArrowRight, Shield, ChevronDown } from 'lucide-react'
import { useCart } from '../context/Cartcontext'
import './Checkout.css'

const API_URL = 'http://localhost:5001'

function resolveUrl(url) {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${API_URL}${url}`
}

export default function Checkout() {
  const { items, totalPrice, totalCount } = useCart()

  const [shippingMethod, setShippingMethod] = useState('standard')
  const [accordionOpen, setAccordionOpen]   = useState(false)
  const [emailOffers, setEmailOffers]       = useState(true)
  const [saveAddress, setSaveAddress]       = useState(false)
  const [saveCard, setSaveCard]             = useState(false)
  const [promoCode, setPromoCode]           = useState('')

  const shippingCost = shippingMethod === 'express' ? 18 : shippingMethod === 'overnight' ? 38 : 0
  const grandTotal   = totalPrice + shippingCost
  const isFreeShip   = totalPrice >= 500

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="co-nav">
        <Link to="/" className="co-nav-brand">LUNAVE</Link>
        <div className="co-nav-secure">
          <Lock size={12} />
          Secure Checkout
        </div>
      </nav>

      {/* ── Step breadcrumb ── */}
      <div className="co-breadcrumb">
        <div className="co-step active">
          <div className="co-step-num">1</div>
          <span className="co-step-label">Information</span>
        </div>
        <div className="co-step-line" />
        <div className="co-step inactive">
          <div className="co-step-num">2</div>
          <span className="co-step-label">Shipping</span>
        </div>
        <div className="co-step-line" />
        <div className="co-step inactive">
          <div className="co-step-num">3</div>
          <span className="co-step-label">Payment</span>
        </div>
      </div>

      <div className="co-page">

        {/* ── Mobile accordion (hidden on desktop) ── */}
        <MobileAccordion
          items={items}
          totalPrice={totalPrice}
          grandTotal={grandTotal}
          shippingCost={shippingCost}
          isFreeShip={isFreeShip}
          open={accordionOpen}
          setOpen={setAccordionOpen}
        />

        <div className="co-grid">

          {/* ── Left: forms ── */}
          <div className="co-forms">
            <h1 className="co-page-title">Checkout</h1>
            <p className="co-page-sub">Complete your order</p>

            <ContactSection
              emailOffers={emailOffers}
              setEmailOffers={setEmailOffers}
            />

            <ShippingAddressSection
              saveAddress={saveAddress}
              setSaveAddress={setSaveAddress}
            />

            <ShippingMethodSection
              selected={shippingMethod}
              setSelected={setShippingMethod}
              isFreeShip={isFreeShip}
            />

            <PaymentSection
              saveCard={saveCard}
              setSaveCard={setSaveCard}
            />

            <button className="co-place-btn">
              <Lock size={14} />
              Place Order
              <ArrowRight size={14} />
            </button>
            <p className="co-place-note">
              Your personal data will be used to process your order
            </p>
          </div>

          {/* ── Right: sticky sidebar ── */}
          <div className="co-sidebar">
            <OrderSummary
              items={items}
              totalCount={totalCount}
              totalPrice={totalPrice}
              grandTotal={grandTotal}
              shippingCost={shippingCost}
              isFreeShip={isFreeShip}
              promoCode={promoCode}
              setPromoCode={setPromoCode}
            />
          </div>

        </div>
      </div>
    </>
  )
}
