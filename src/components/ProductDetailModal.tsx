import React, { useState } from 'react';
import { X, ShoppingBag, ShieldCheck } from 'lucide-react';
import type { Product } from '../data/catalog';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('M');

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize);
    onClose();
  };

  const formattedPrice = `Rs. ${product.price.toLocaleString()}`;
  const formattedOriginalPrice = product.originalPrice
    ? `Rs. ${product.originalPrice.toLocaleString()}`
    : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="product-detail-layout">
          <div className="product-detail-gallery">
            <img src={product.image} alt={product.title} />
          </div>

          <div className="product-detail-info">
            <div>
              <span className="product-card-category">{product.category}</span>
              <h2 className="text-serif" style={{ fontSize: '2rem', marginBottom: '12px', color: 'hsl(var(--color-charcoal))' }}>
                {product.title}
              </h2>
              
              <div className="product-card-price-wrap" style={{ marginBottom: '24px' }}>
                <span className="price-current" style={{ fontSize: '1.6rem' }}>
                  {formattedPrice}
                </span>
                {formattedOriginalPrice && (
                  <span className="price-original" style={{ fontSize: '1.2rem' }}>
                    {formattedOriginalPrice}
                  </span>
                )}
              </div>

              <p style={{ color: 'hsl(var(--color-stone))', fontSize: '0.98rem', marginBottom: '24px', lineHeight: '1.7' }}>
                {product.description}
              </p>

              <div className="size-selector-wrap">
                <p className="size-title">Select Size</p>
                <div className="size-chips">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-chip ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'hsl(var(--color-stone))', marginTop: '8px' }}>
                  *Standard Pakistani Length: 56 inches (custom lengths can be requested via notes).
                </p>
              </div>

              <div style={{ margin: '24px 0' }}>
                <h4 className="text-serif" style={{ fontSize: '1.1rem', marginBottom: '12px', color: 'hsl(var(--color-charcoal))' }}>
                  Fabric & Design Details
                </h4>
                <ul className="specs-list">
                  {product.specs.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ borderTop: '1px solid hsl(var(--color-cream))', paddingTop: '24px', marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'hsl(var(--color-stone))', marginBottom: '16px' }}>
                <ShieldCheck size={18} style={{ color: 'hsl(var(--color-completed))' }} />
                <span>100% Quality Guaranteed | Cash on Delivery Nationwide</span>
              </div>
              <button
                className="btn-primary"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <ShoppingBag size={18} /> Add To Shopping Bag
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
