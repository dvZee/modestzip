import React, { useState } from 'react';
import { X, CheckCircle, ArrowLeft } from 'lucide-react';
import type { OrderItem, Order } from '../data/catalog';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: OrderItem[];
  onPlaceOrder: (customerDetails: {
    name: string;
    phone: string;
    email: string;
    city: string;
    address: string;
  }) => Order | null;
  onClearCart: () => void;
}

const PAKISTANI_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Abbottabad',
  'Gujrat',
  'Jhelum',
  'Mirpur',
  'Sukkur',
  'Larkana'
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onPlaceOrder,
  onClearCart,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState(PAKISTANI_CITIES[0]);
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const validateForm = () => {
    const tempErrors: { [key: string]: string } = {};
    if (!name.trim()) tempErrors.name = 'Full Name is required';
    if (!phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else if (!/^(\+92|0|92)?[3][0-9]{9}$/.test(phone.trim().replace(/[-\s]/g, ''))) {
      tempErrors.phone = 'Please enter a valid Pakistani phone number (e.g. 03001234567)';
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
    }
    if (!address.trim()) tempErrors.address = 'Complete delivery address is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const order = onPlaceOrder({
        name,
        phone,
        email,
        city,
        address,
      });
      if (order) {
        setPlacedOrder(order);
        onClearCart();
      }
    }
  };

  const handleSuccessClose = () => {
    setPlacedOrder(null);
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={placedOrder ? handleSuccessClose : onClose}>
      <div className="modal-content checkout-modal-content" onClick={(e) => e.stopPropagation()}>
        {!placedOrder && (
          <button className="icon-btn modal-close-btn" onClick={onClose} aria-label="Close checkout">
            <X size={20} />
          </button>
        )}

        {placedOrder ? (
          <div className="success-screen">
            <div className="success-icon-wrap">
              <CheckCircle size={44} />
            </div>
            <h2 className="text-serif" style={{ fontSize: '2.2rem', marginBottom: '12px' }}>Order Placed Successfully!</h2>
            <p style={{ color: 'hsl(var(--color-stone))', fontSize: '1.05rem', marginBottom: '8px' }}>
              Thank you for shopping at **ModestZip**. Your order ID is:
            </p>
            <div
              style={{
                display: 'inline-block',
                backgroundColor: 'hsl(var(--color-plum-light))',
                color: 'hsl(var(--color-plum))',
                padding: '8px 24px',
                borderRadius: '4px',
                fontWeight: '700',
                fontSize: '1.2rem',
                letterSpacing: '1px',
                marginBottom: '24px',
              }}
            >
              #{placedOrder.id}
            </div>
            <p style={{ color: 'hsl(var(--color-stone))', fontSize: '0.95rem', maxWidth: '440px', margin: '0 auto 32px', lineHeight: '1.6' }}>
              We will call/SMS you on <strong>{placedOrder.customerPhone}</strong> shortly to confirm your dispatch details. COD amount due at delivery: <strong>Rs. {placedOrder.total.toLocaleString()}</strong>.
            </p>
            <button className="btn-primary" onClick={handleSuccessClose}>
              Continue Shopping <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="checkout-title text-serif">Checkout Details</h2>

            <div className="order-summary-box">
              <h3 className="text-serif" style={{ fontSize: '1.1rem', marginBottom: '12px', borderBottom: '1px solid hsl(var(--color-plum) / 0.1)', paddingBottom: '6px' }}>
                Your Order Summary
              </h3>
              {cartItems.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}`} className="summary-row" style={{ color: 'hsl(var(--color-stone))', fontSize: '0.9rem' }}>
                  <span>{item.product.title} (x{item.quantity}) - {item.selectedSize}</span>
                  <span>Rs. {(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="summary-row" style={{ color: 'hsl(var(--color-stone))', fontSize: '0.9rem', marginTop: '10px' }}>
                <span>Shipping Nationwide</span>
                <span style={{ color: 'hsl(var(--status-completed))', fontWeight: '600' }}>FREE</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount Due (COD)</span>
                <span>Rs. {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ayesha Khan"
              />
              {errors.name && <span style={{ color: 'hsl(var(--status-cancelled))', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="text"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03001234567"
              />
              {errors.phone && <span style={{ color: 'hsl(var(--status-cancelled))', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Optional)</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ayesha@example.com"
              />
              {errors.email && <span style={{ color: 'hsl(var(--status-cancelled))', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">City *</label>
              <select
                className="form-control"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{ cursor: 'pointer' }}
              >
                {PAKISTANI_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Complete Shipping Address *</label>
              <textarea
                className="form-control"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House No., Street Name, Area / Sector..."
              />
              {errors.address && <span style={{ color: 'hsl(var(--status-cancelled))', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{errors.address}</span>}
            </div>

            <div className="form-group" style={{ marginTop: '24px', borderTop: '1px solid hsl(var(--color-cream))', paddingTop: '20px' }}>
              <span className="form-label">Payment Method</span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: 'hsl(var(--bg-sand))',
                  padding: '16px',
                  borderRadius: '6px',
                  border: '1px solid hsl(var(--color-gold) / 0.3)',
                }}
              >
                <input type="radio" id="cod" checked readOnly style={{ accentColor: 'hsl(var(--color-plum))', scale: '1.2' }} />
                <label htmlFor="cod" style={{ fontWeight: '600', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                  <span>Cash on Delivery (COD)</span>
                  <span style={{ fontSize: '0.75rem', color: 'hsl(var(--color-stone))', fontWeight: '400' }}>
                    Pay with cash upon delivery at your doorstep anywhere in Pakistan.
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '20px', padding: '18px' }}
            >
              Place Order (COD)
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
