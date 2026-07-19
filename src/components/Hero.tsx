import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick }) => {
  return (
    <section className="hero-container">
      <div className="hero-content">
        <h2 className="hero-subtitle">ModestZip Launch Collection</h2>
        <h1 className="hero-title text-serif">
          Where Elegance Meets <span style={{ color: 'hsl(var(--color-plum))' }}>Modesty</span>
        </h1>
        <p className="hero-description">
          Discover our debut edit of premium Abayas, crafted in rich seasonal tones and lightweight, breathable fabrics. Designed with precision for the modern Pakistani woman.
        </p>
        <button className="btn-primary" onClick={onShopClick}>
          Shop the Edit <ArrowRight size={18} />
        </button>
      </div>

      <div className="hero-bg-overlay" />

      <div className="hero-images">
        <div className="hero-img-card" style={{ cursor: 'pointer' }} onClick={onShopClick}>
          <img src="/assets/product-plum.jpg" alt="Aura Pleated Plum Abaya" />
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              padding: '20px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
              color: '#fff',
            }}
          >
            <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>01 / Plum</p>
            <p className="text-serif" style={{ fontSize: '1.1rem' }}>Aura Pleated</p>
          </div>
        </div>
        <div className="hero-img-card" style={{ cursor: 'pointer' }} onClick={onShopClick}>
          <img src="/assets/product-black.jpg" alt="Silk-Satin Midnight Black Abaya" />
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              padding: '20px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
              color: '#fff',
            }}
          >
            <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>02 / Black</p>
            <p className="text-serif" style={{ fontSize: '1.1rem' }}>Midnight Silk-Satin</p>
          </div>
        </div>
        <div className="hero-img-card" style={{ cursor: 'pointer' }} onClick={onShopClick}>
          <img src="/assets/product-teal.jpg" alt="Zephyr Teal Pleated Abaya" />
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              padding: '20px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
              color: '#fff',
            }}
          >
            <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>03 / Teal</p>
            <p className="text-serif" style={{ fontSize: '1.1rem' }}>Zephyr Pleated</p>
          </div>
        </div>
      </div>
    </section>
  );
};
