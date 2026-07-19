import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onCartToggle: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSearch: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onCartToggle,
  searchQuery,
  setSearchQuery,
  showSearch,
}) => {
  return (
    <header className="navbar-glass">
      <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
        {/* Modern Minimalist SVG Logo combining 'M', 'Z', and infinity/crescent */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transition: 'transform 0.3s ease' }}
          className="logo-icon"
        >
          <path
            d="M6 24V8L12 16L18 8L24 24"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 24H20L12 28H20"
            stroke="hsl(var(--color-gold-dark))"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
        <span style={{ color: 'hsl(var(--color-plum))' }}>Modest</span>
        <span style={{ color: 'hsl(var(--color-gold-dark))', fontWeight: '300' }}>Zip</span>
      </Link>

      <nav className="nav-links">
        <Link to="/" className="nav-link active">
          Collection
        </Link>
      </nav>

      <div className="nav-actions">
        {showSearch && (
          <div className="search-input-wrapper" style={{ minWidth: '200px' }}>
            <input
              type="text"
              placeholder="Search elegance..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 12px 8px 36px' }}
            />
            <Search size={16} className="search-icon-inside" style={{ left: '12px' }} />
          </div>
        )}

        <button className="icon-btn" onClick={onCartToggle} aria-label="Open Shopping Cart">
          <ShoppingBag size={22} />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
      </div>
    </header>
  );
};
