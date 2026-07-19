import React from 'react';
import { X, Trash2, ArrowRight } from 'lucide-react';
import type { OrderItem } from '../data/catalog';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: OrderItem[];
  onUpdateQuantity: (productId: string, size: string, delta: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="cart-drawer">
        <div className="cart-header">
          <h3 className="text-serif" style={{ fontSize: '1.5rem' }}>Shopping Bag ({cartItems.length})</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        <div className="cart-items-container">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '60px', color: 'hsl(var(--color-stone))' }}>
              <p className="text-serif" style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Your bag is empty</p>
              <p style={{ fontSize: '0.9rem' }}>Browse our collections to add premium modest wear.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.product.id}-${item.selectedSize}`} className="cart-item">
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="cart-item-img"
                />
                <div className="cart-item-details">
                  <div>
                    <h4 className="cart-item-title">{item.product.title}</h4>
                    <p className="cart-item-meta">Size: {item.selectedSize}</p>
                    <p className="cart-item-price">Rs. {item.product.price.toLocaleString()}</p>
                  </div>
                  <div className="cart-item-quantity">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, -1)}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="icon-btn"
                      onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                      style={{ color: 'hsl(var(--status-cancelled))', padding: '6px' }}
                      title="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-totals">
              <span>Subtotal</span>
              <span>Rs. {totalAmount.toLocaleString()}</span>
            </div>
            <div className="cart-footer-actions">
              <button
                className="btn-primary"
                onClick={onCheckout}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
              <button
                className="btn-secondary"
                onClick={onClose}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
