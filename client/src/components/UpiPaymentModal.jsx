import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, CheckCircle } from 'lucide-react';
import './UpiPaymentModal.css';

const UPI_ID   = 'sarkarneha775-1@oksbi';
const UPI_NAME = 'Lunave';

export default function UpiPaymentModal({ order, onPaid, onClose }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [paid, setPaid]           = useState(false);

  const orderRef = `ORD-${order._id.slice(-6).toUpperCase()}`;
  const amount   = order.totalPrice.toFixed(2);

  useEffect(() => {
    const upiLink =
      `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}` +
      `&am=${amount}&cu=INR&tn=${encodeURIComponent(orderRef)}`;

    QRCode.toDataURL(upiLink, {
      width: 200,
      margin: 1,
      color: { dark: '#111111', light: '#f5f0eb' },
    })
      .then(setQrDataUrl)
      .catch(console.error);
  }, [amount, orderRef]);

  function handlePaid() {
    setPaid(true);
    setTimeout(onPaid, 1800);
  }

  return (
    <div className="upi-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="upi-modal">
        {/* Header */}
        <div className="upi-head">
          <h2 className="upi-title">Pay via UPI</h2>
          {!paid && (
            <button className="upi-close" onClick={onClose} aria-label="Close">
              <X size={14} />
            </button>
          )}
        </div>

        {paid ? (
          /* ── Success state ── */
          <div className="upi-success">
            <div className="upi-success-icon">
              <CheckCircle size={32} strokeWidth={1.5} />
            </div>
            <h3 className="upi-success-title">Payment Received</h3>
            <p className="upi-success-sub">
              Thank you for your order. We'll verify your payment and begin
              processing shortly.
            </p>
            <span className="upi-success-ref">{orderRef}</span>
          </div>
        ) : (
          /* ── Payment state ── */
          <div className="upi-body">
            <p className="upi-order-ref">{orderRef}</p>

            <p className="upi-amount">
              <span>₹</span>{amount}
            </p>

            {/* QR code */}
            <div className="upi-qr-wrap">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="UPI QR Code" />
              ) : (
                <div className="upi-qr-loading">Generating…</div>
              )}
            </div>

            {/* UPI ID pill */}
            <div className="upi-id-pill">
              <span className="upi-id-label">UPI ID</span>
              <span className="upi-id-value">{UPI_ID}</span>
            </div>

            {/* Instructions */}
            <div className="upi-instructions">
              {[
                'Open any UPI app — GPay, PhonePe, Paytm, etc.',
                'Scan the QR code or search for the UPI ID above.',
                `Confirm the amount ₹${amount} and complete the payment.`,
                'Tap "I\'ve Paid" once the transaction is successful.',
              ].map((text, i) => (
                <div className="upi-step" key={i}>
                  <span className="upi-step-num">{i + 1}</span>
                  <span className="upi-step-text">{text}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button className="upi-paid-btn" onClick={handlePaid}>
              <CheckCircle size={16} />
              I've Paid
            </button>

            <p className="upi-note">
              Orders are confirmed after payment verification · 24–48 h
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
