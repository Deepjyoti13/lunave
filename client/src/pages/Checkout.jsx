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
        <div
          className="co-check-row"
          role="checkbox"
          aria-checked={emailOffers}
          tabIndex={0}
          onClick={() => setEmailOffers(v => !v)}
          onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setEmailOffers(v => !v) } }}
        >
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
        <div
          className="co-check-row"
          role="checkbox"
          aria-checked={saveAddress}
          tabIndex={0}
          onClick={() => setSaveAddress(v => !v)}
          onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setSaveAddress(v => !v) } }}
        >
          <Checkbox checked={saveAddress} />
          <span className="co-check-label">Save this address for future orders</span>
        </div>
      </div>
    </div>
  )
}

const SHIPPING_OPTIONS = [
  { id: 'standard',  label: 'Standard Delivery', days: '5 – 8 business days', price: 0 },
  { id: 'express',   label: 'Express Delivery',  days: '2 – 3 business days', price: 18 },
  { id: 'overnight', label: 'Overnight',          days: 'Next business day',   price: 38 },
]

function ShippingMethodSection({ selected, setSelected, isFreeShip }) {
  return (
    <div className="co-section">
      <div className="co-section-head">
        <div className="co-section-num">03</div>
        <h2 className="co-section-title">Shipping Method</h2>
      </div>
      <div className="co-section-body">
        <div className="co-ship-options">
          {SHIPPING_OPTIONS.map(opt => (
            <div
              key={opt.id}
              className={`co-ship-opt${selected === opt.id ? ' selected' : ''}`}
              onClick={() => setSelected(opt.id)}
            >
              <div className="co-ship-opt-left">
                <div className="co-radio" />
                <div>
                  <div className="co-ship-name">{opt.label}</div>
                  <div className="co-ship-days">{opt.days}</div>
                </div>
              </div>
              {opt.id === 'standard' && isFreeShip ? (
                <span className="co-ship-price free">Free</span>
              ) : opt.price === 0 ? (
                <span className="co-ship-price free">Free</span>
              ) : (
                <span className="co-ship-price">${opt.price}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PaymentSection({ saveCard, setSaveCard }) {
  return (
    <div className="co-section">
      <div className="co-section-head">
        <div className="co-section-num">04</div>
        <h2 className="co-section-title">Payment</h2>
      </div>
      <div className="co-section-body">

        {/* Static payment logos */}
        <div className="co-pay-logos">
          <div className="co-pay-logo visa">VISA</div>
          <div className="co-pay-logo mc">
            <span className="mc-left" />
            <span className="mc-right" />
          </div>
          <div className="co-pay-logo amex">AMEX</div>
          <div className="co-pay-logo paypal">
            <span className="pp-blue">Pay</span>
            <span className="pp-cyan">Pal</span>
          </div>
          <div className="co-pay-logo apple">&#63743; Pay</div>
          <div className="co-pay-logo gpay">
            <span className="g">G</span>
            <span className="o1">o</span>
            <span className="o2">o</span>
            <span className="g2">g</span>
            <span className="le">le</span>
            &nbsp;Pay
          </div>
        </div>

        {/* Divider */}
        <div className="co-divider">
          <div className="co-divider-line" />
          <span className="co-divider-text">Card Details</span>
          <div className="co-divider-line" />
        </div>

        <div className="co-field-row single">
          <div className="co-field">
            <label className="co-label">Name on Card</label>
            <input className="co-input" type="text" placeholder="Elena Moreau" autoComplete="cc-name" />
          </div>
        </div>
        <div className="co-field-row single">
          <div className="co-field">
            <label className="co-label">Card Number</label>
            <div className="co-card-input-wrap">
              <input
                className="co-input"
                type="text"
                placeholder="0000  0000  0000  0000"
                maxLength={19}
                autoComplete="cc-number"
              />
              <span className="co-card-icon">••••</span>
            </div>
          </div>
        </div>
        <div className="co-field-row triple">
          <div className="co-field">
            <label className="co-label">Month</label>
            <select className="co-select" autoComplete="cc-exp-month">
              <option value="">MM</option>
              {Array.from({ length: 12 }, (_, i) => {
                const m = String(i + 1).padStart(2, '0')
                return <option key={m} value={m}>{m}</option>
              })}
            </select>
          </div>
          <div className="co-field">
            <label className="co-label">Year</label>
            <select className="co-select" autoComplete="cc-exp-year">
              <option value="">YYYY</option>
              {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="co-field">
            <label className="co-label">CVV</label>
            <input
              className="co-input"
              type="text"
              placeholder="•••"
              maxLength={4}
              autoComplete="cc-csc"
            />
          </div>
        </div>

        <div
          className="co-check-row"
          role="checkbox"
          aria-checked={saveCard}
          tabIndex={0}
          onClick={() => setSaveCard(v => !v)}
          onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setSaveCard(v => !v) } }}
        >
          <Checkbox checked={saveCard} />
          <span className="co-check-label">Save card for future purchases</span>
        </div>

      </div>
    </div>
  )
}

function Checkbox({ checked }) {
  return (
    <div className={`co-checkbox${checked ? ' checked' : ''}`}>
      {checked && (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#c9975a" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </div>
  )
}

function SummaryItemList({ items }) {
  return (
    <div className="co-summary-items">
      {items.map(item => {
        const imgUrl = resolveUrl(item.image)
        return (
          <div key={item._id} className="co-sum-item">
            <div className="co-sum-thumb">
              {imgUrl
                ? <img src={imgUrl} alt={item.name} className="co-sum-thumb-img" onError={e => { e.currentTarget.style.display = 'none' }} />
                : null
              }
              <div className="co-sum-qty-badge">{item.quantity}</div>
            </div>
            <div className="co-sum-info">
              <div className="co-sum-name">{item.name}</div>
              {item.volume && <div className="co-sum-vol">{item.volume}ml · Eau de Parfum</div>}
            </div>
            <div className="co-sum-price">${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        )
      })}
    </div>
  )
}

function SummaryTotals({ totalPrice, grandTotal, shippingCost, isFreeShip }) {
  return (
    <div className="co-summary-totals">
      <div className="co-tot-row">
        <span>Subtotal</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>
      <div className={`co-tot-row${isFreeShip || shippingCost === 0 ? ' free' : ''}`}>
        <span>Shipping</span>
        <span>{isFreeShip || shippingCost === 0 ? 'Free' : `$${shippingCost}`}</span>
      </div>
      <div className="co-tot-row">
        <span>Tax</span>
        <span>Calculated at next step</span>
      </div>
      <div className="co-grand-total">
        <span className="co-grand-label">Total</span>
        <span className="co-grand-amount">${grandTotal.toFixed(2)}</span>
      </div>
    </div>
  )
}

function OrderSummary({ items, totalCount, totalPrice, grandTotal, shippingCost, isFreeShip, promoCode, setPromoCode }) {
  return (
    <div className="co-summary">
      <div className="co-summary-head">
        <span className="co-summary-title">Your Order</span>
        <span className="co-summary-count">{totalCount} {totalCount === 1 ? 'Item' : 'Items'}</span>
      </div>

      <SummaryItemList items={items} />

      <div className="co-summary-promo">
        <label className="co-label">Promo Code</label>
        <div className="co-promo-row">
          <input
            className="co-promo-input"
            type="text"
            placeholder="Enter code"
            value={promoCode}
            onChange={e => setPromoCode(e.target.value)}
          />
          <button type="button" className="co-promo-btn">Apply</button>
        </div>
      </div>

      <SummaryTotals
        totalPrice={totalPrice}
        grandTotal={grandTotal}
        shippingCost={shippingCost}
        isFreeShip={isFreeShip}
      />

      <div className="co-security">
        <div className="co-badge">
          <Shield size={10} />
          SSL Secured
        </div>
        <div className="co-badge">
          <Lock size={10} />
          256-bit Encryption
        </div>
        <div className="co-badge">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          PCI Compliant
        </div>
      </div>
    </div>
  )
}

function MobileAccordion({ items, totalPrice, grandTotal, shippingCost, isFreeShip, open, setOpen }) {
  return (
    <div className="co-mobile-summary">
      <button
        className={`co-accord-btn${open ? ' open' : ''}`}
        onClick={() => setOpen(v => !v)}
      >
        <span>Order Summary</span>
        <div className="co-accord-right">
          <span className="co-accord-total">${grandTotal.toFixed(2)}</span>
          <div className="co-accord-arrow">
            <ChevronDown size={10} />
          </div>
        </div>
      </button>
      <div className={`co-accord-panel${open ? ' open' : ''}`}>
        <SummaryItemList items={items} />
        <SummaryTotals
          totalPrice={totalPrice}
          grandTotal={grandTotal}
          shippingCost={shippingCost}
          isFreeShip={isFreeShip}
        />
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
