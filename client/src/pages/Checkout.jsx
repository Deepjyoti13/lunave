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

function ContactSection({ emailOffers, setEmailOffers }) {
  return (
    <div className="co-section">
      <div className="co-section-head">
        <div className="co-section-num">01</div>
        <h2 className="co-section-title">Contact Information</h2>
      </div>
      <div className="co-section-body">
        <div className="co-field-row">
          <div className="co-field">
            <label className="co-label">First Name</label>
            <input className="co-input" type="text" placeholder="Elena" autoComplete="given-name" />
          </div>
          <div className="co-field">
            <label className="co-label">Last Name</label>
            <input className="co-input" type="text" placeholder="Moreau" autoComplete="family-name" />
          </div>
        </div>
        <div className="co-field-row single">
          <div className="co-field">
            <label className="co-label">Email Address</label>
            <input className="co-input" type="email" placeholder="elena@example.com" autoComplete="email" />
          </div>
        </div>
        <div className="co-field-row single">
          <div className="co-field">
            <label className="co-label">Phone Number</label>
            <input className="co-input" type="tel" placeholder="+1 (000) 000-0000" autoComplete="tel" />
          </div>
        </div>
        <div className="co-check-row" onClick={() => setEmailOffers(v => !v)}>
          <Checkbox checked={emailOffers} />
          <span className="co-check-label">Email me with news and exclusive offers</span>
        </div>
      </div>
    </div>
  )
}

function ShippingAddressSection({ saveAddress, setSaveAddress }) {
  return (
    <div className="co-section">
      <div className="co-section-head">
        <div className="co-section-num">02</div>
        <h2 className="co-section-title">Shipping Address</h2>
      </div>
      <div className="co-section-body">
        <div className="co-field-row single">
          <div className="co-field">
            <label className="co-label">Address Line 1</label>
            <input className="co-input" type="text" placeholder="Street address" autoComplete="address-line1" />
          </div>
        </div>
        <div className="co-field-row single">
          <div className="co-field">
            <label className="co-label">
              Address Line 2 <span className="co-label-opt">(optional)</span>
            </label>
            <input className="co-input" type="text" placeholder="Apartment, suite, unit, etc." autoComplete="address-line2" />
          </div>
        </div>
        <div className="co-field-row">
          <div className="co-field">
            <label className="co-label">City</label>
            <input className="co-input" type="text" placeholder="Paris" autoComplete="address-level2" />
          </div>
          <div className="co-field">
            <label className="co-label">State / Province</label>
            <input className="co-input" type="text" placeholder="Île-de-France" autoComplete="address-level1" />
          </div>
        </div>
        <div className="co-field-row">
          <div className="co-field">
            <label className="co-label">ZIP / Postal Code</label>
            <input className="co-input" type="text" placeholder="75001" autoComplete="postal-code" />
          </div>
          <div className="co-field">
            <label className="co-label">Country</label>
            <select className="co-select" autoComplete="country-name">
              <option>France</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>UAE</option>
              <option>India</option>
              <option>Germany</option>
              <option>Italy</option>
              <option>Japan</option>
            </select>
          </div>
        </div>
        <div className="co-check-row" onClick={() => setSaveAddress(v => !v)}>
          <Checkbox checked={saveAddress} />
          <span className="co-check-label">Save this address for future orders</span>
        </div>
      </div>
    </div>
  )
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
