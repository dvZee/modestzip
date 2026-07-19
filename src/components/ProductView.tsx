import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, ShieldCheck } from 'lucide-react';
import type { Product } from '../data/catalog';
import { ProductCard } from './ProductCard';

interface ProductViewProps {
  products: Product[];
  onAddToCart: (product: Product, size: string) => void;
}

export const ProductView: React.FC<ProductViewProps> = ({ products, onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>('M');

  const product = products.find((p) => p.id === id);

  // Dynamic SEO Page Tags Update
  useEffect(() => {
    if (!product) return;

    // Cache original SEO tags
    const originalTitle = document.title;
    const originalDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';

    // Set new SEO tags
    document.title = product.seoTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', product.seoDescription);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'description';
      newMeta.content = product.seoDescription;
      document.head.appendChild(newMeta);
    }

    // Scroll to top of the page on render
    window.scrollTo(0, 0);

    // Restore tags on unmount
    return () => {
      document.title = originalTitle;
      if (metaDesc) {
        metaDesc.setAttribute('content', originalDescription);
      }
    };
  }, [product]);

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '140px 8%', minHeight: '60vh' }}>
        <h2 className="text-serif" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Exquisite Piece Not Found</h2>
        <p style={{ color: 'hsl(var(--color-stone))', marginBottom: '24px' }}>The item you are searching for might have been moved or is currently out of stock.</p>
        <Link to="/" className="btn-primary">
          <ArrowLeft size={16} /> Return to Collection
        </Link>
      </div>
    );
  }

  // Related products logic (items in same category excluding current product)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const formattedPrice = `Rs. ${product.price.toLocaleString()}`;
  const formattedOriginalPrice = product.originalPrice
    ? `Rs. ${product.originalPrice.toLocaleString()}`
    : null;

  return (
    <main style={{ marginTop: '80px', padding: '40px 8% 80px', minHeight: '100vh' }}>
      {/* Breadcrumbs Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          color: 'hsl(var(--color-stone))',
          marginBottom: '32px',
        }}
      >
        <Link to="/" className="breadcrumb-link" style={{ transition: 'color 0.3s' }}>Home</Link>
        <span>/</span>
        <span style={{ textTransform: 'capitalize' }}>{product.category.toLowerCase()}</span>
        <span>/</span>
        <span style={{ color: 'hsl(var(--color-charcoal))', fontWeight: '600' }}>{product.title}</span>
      </div>

      {/* Main product view split */}
      <div className="product-detail-layout" style={{ backgroundColor: 'hsl(var(--bg-card))', borderRadius: '12px', border: '1px solid hsl(var(--color-cream))', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', marginBottom: '80px' }}>
        <div className="product-detail-gallery" style={{ height: '650px' }}>
          <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div className="product-detail-info" style={{ padding: '48px' }}>
          <div>
            <span className="product-card-category">{product.category}</span>
            <h1 className="text-serif" style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'hsl(var(--color-charcoal))', lineHeight: '1.2' }}>
              {product.title}
            </h1>

            <div className="product-card-price-wrap" style={{ marginBottom: '28px' }}>
              <span className="price-current" style={{ fontSize: '1.8rem' }}>
                {formattedPrice}
              </span>
              {formattedOriginalPrice && (
                <span className="price-original" style={{ fontSize: '1.3rem' }}>
                  {formattedOriginalPrice}
                </span>
              )}
            </div>

            <p style={{ color: 'hsl(var(--color-stone))', fontSize: '1.02rem', marginBottom: '32px', lineHeight: '1.8' }}>
              {product.description}
            </p>

            <div className="size-selector-wrap" style={{ margin: '32px 0' }}>
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
              <p style={{ fontSize: '0.8rem', color: 'hsl(var(--color-stone))', marginTop: '10px' }}>
                *Standard Pakistani Length: 56 inches. Size changes or custom fitting can be instructed in the checkout address notes.
              </p>
            </div>

            <div style={{ margin: '32px 0' }}>
              <h4 className="text-serif" style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'hsl(var(--color-charcoal))' }}>
                Fabric & Design Specifications
              </h4>
              <ul className="specs-list" style={{ fontSize: '0.95rem' }}>
                {product.specs.map((spec, index) => (
                  <li key={index} style={{ marginBottom: '10px' }}>{spec}</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ borderTop: '1px solid hsl(var(--color-cream))', paddingTop: '32px', marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: 'hsl(var(--color-stone))', marginBottom: '20px' }}>
              <ShieldCheck size={20} style={{ color: 'hsl(var(--color-completed))' }} />
              <span>Free Nationwide Dispatch | Cash on Delivery Available</span>
            </div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                className="btn-primary"
                onClick={() => onAddToCart(product, selectedSize)}
                disabled={!product.inStock}
                style={{ flex: '1', justifyContent: 'center', padding: '18px' }}
              >
                <ShoppingBag size={20} /> Add To Shopping Bag
              </button>
              
              <button
                className="btn-secondary"
                onClick={() => navigate('/')}
                style={{ padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Back to Catalog"
              >
                <ArrowLeft size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related items section */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="section-title-wrap" style={{ padding: '40px 0 32px' }}>
            <span className="section-subtitle">Complete the Look</span>
            <h2 className="section-title text-serif" style={{ fontSize: '2rem' }}>You May Also Love</h2>
          </div>
          <div className="product-grid" style={{ padding: '0', gap: '32px' }}>
            {relatedProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onViewDetails={(p) => navigate(`/product/${p.id}`)}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};
