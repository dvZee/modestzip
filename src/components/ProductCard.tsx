import React from 'react';
import { Eye, Plus } from 'lucide-react';
import type { Product } from '../data/catalog';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product, size: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onAddToCart,
}) => {
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Default to 'M' size for quick add
    onAddToCart(product, 'M');
  };

  const formattedPrice = `Rs. ${product.price.toLocaleString()}`;
  const formattedOriginalPrice = product.originalPrice
    ? `Rs. ${product.originalPrice.toLocaleString()}`
    : null;

  return (
    <article className="product-card" style={{ cursor: 'pointer' }} onClick={() => onViewDetails(product)}>
      <span className="product-badge">Exclusive Launch</span>
      
      <div className="product-image-container">
        <img src={product.image} alt={product.title} loading="lazy" />
      </div>

      <div className="product-card-info">
        <span className="product-card-category">{product.category}</span>
        <h3 className="product-card-title text-serif">{product.title}</h3>
        
        <div className="product-card-price-wrap">
          <span className="price-current">{formattedPrice}</span>
          {formattedOriginalPrice && <span className="price-original">{formattedOriginalPrice}</span>}
        </div>

        <div className="product-card-actions">
          <button
            className="btn-secondary"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            style={{ padding: '8px 12px', display: 'flex', justifyContent: 'center' }}
            title="View Details"
          >
            <Eye size={18} />
          </button>
          <button
            className="btn-primary"
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem' }}
          >
            <Plus size={16} /> Quick Add (M)
          </button>
        </div>
      </div>
    </article>
  );
};
