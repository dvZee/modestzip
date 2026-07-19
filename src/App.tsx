import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminDashboard } from './components/AdminDashboard';
import type { Product, OrderItem, Order } from './data/catalog';
import {
  getDBProducts,
  saveDBProducts,
  getDBOrders,
  saveDBOrders,
} from './data/catalog';
import { ShoppingBag, Mail, MapPin, Phone } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
}

function App() {
  const [currentView, setView] = useState<'shop' | 'admin'>('shop');
  
  // Database States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Cart & Checkout States
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // Browsing States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // UI States
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load Initial Database Data
  useEffect(() => {
    setProducts(getDBProducts());
    setOrders(getDBOrders());
  }, []);

  // Sync Products and Orders to Storage when changed
  const updateProductsState = (newProducts: Product[]) => {
    setProducts(newProducts);
    saveDBProducts(newProducts);
  };

  const updateOrdersState = (newOrders: Order[]) => {
    setOrders(newOrders);
    saveDBOrders(newOrders);
  };

  // Toast Helper
  const showToast = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Cart Operations
  const handleAddToCart = (product: Product, size: string) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        showToast(`Updated ${product.title} (${size}) quantity in your bag.`);
        return updatedItems;
      } else {
        showToast(`Added ${product.title} (${size}) to your bag.`);
        return [...prevItems, { product, quantity: 1, selectedSize: size }];
      }
    });
  };

  const handleUpdateCartQuantity = (productId: string, size: string, delta: number) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.product.id === productId && item.selectedSize === size) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleRemoveCartItem = (productId: string, size: string) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((i) => i.product.id === productId && i.selectedSize === size);
      if (item) {
        showToast(`Removed ${item.product.title} from your bag.`);
      }
      return prevItems.filter((i) => !(i.product.id === productId && i.selectedSize === size));
    });
  };

  // Checkout Placing Order
  const handlePlaceOrder = (customerDetails: {
    name: string;
    phone: string;
    email: string;
    city: string;
    address: string;
  }) => {
    if (cartItems.length === 0) return null;

    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const orderId = `MZ-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: orderId,
      customerName: customerDetails.name,
      customerPhone: customerDetails.phone,
      customerEmail: customerDetails.email,
      city: customerDetails.city,
      address: customerDetails.address,
      items: [...cartItems],
      total,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const updatedOrders = [newOrder, ...orders];
    updateOrdersState(updatedOrders);
    showToast(`Order #${orderId} created successfully!`);
    return newOrder;
  };

  // Admin Actions
  const handleAddProduct = (newProductData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: `prod-${Date.now()}`,
    };
    const updatedProducts = [newProduct, ...products];
    updateProductsState(updatedProducts);
  };

  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = products.filter((p) => p.id !== productId);
    updateProductsState(updatedProducts);
    showToast('Product removed from catalog.');
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        showToast(`Order #${orderId} status changed to ${status}`);
        return { ...order, status };
      }
      return order;
    });
    updateOrdersState(updatedOrders);
  };

  // Filter and Sort Products
  const filteredProducts = products
    .filter((prod) => {
      const matchesSearch =
        prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.seoTitle.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === 'All' || prod.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      return 0; // 'featured' or default
    });

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Navbar
        currentView={currentView}
        setView={setView}
        cartCount={cartCount}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {currentView === 'shop' ? (
        <main style={{ minHeight: '100vh' }}>
          {/* Hero Lookbook */}
          <Hero onShopClick={() => {
            const el = document.getElementById('catalog-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }} />

          {/* Catalog Section */}
          <section id="catalog-section" style={{ scrollMarginTop: '80px' }}>
            <div className="section-title-wrap">
              <span className="section-subtitle">Luxurious Drapes</span>
              <h2 className="section-title text-serif">Explore The Debut Edit</h2>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
              <div className="category-filters">
                {['All', 'Abayas', 'Hijabs', 'Kaftans'].map((cat) => (
                  <button
                    key={cat}
                    className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: 'hsl(var(--color-stone))', fontWeight: '500' }}>Sort By:</span>
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured Edit</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>
            </div>

            {/* Catalog Grid */}
            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '100px 0', color: 'hsl(var(--color-stone))' }}>
                <h3 className="text-serif" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>No products found</h3>
                <p>Try refining your search terms or select another category filter.</p>
              </div>
            ) : (
              <div className="product-grid">
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onViewDetails={setSelectedProduct}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      ) : (
        /* Admin Console */
        <AdminDashboard
          products={products}
          orders={orders}
          onAddProduct={handleAddProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      )}

      {/* Brand Footer */}
      <footer className="footer-wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2>ModestZip</h2>
            <p>Premium, designer-crafted modest attire tailored to perfection for modern Pakistani women. Nationwide cash on delivery.</p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <span style={{ color: 'hsl(var(--color-gold))', fontWeight: 'bold' }}>✓ Cash on Delivery</span>
              <span style={{ color: 'hsl(var(--color-gold))', fontWeight: 'bold' }}>✓ Free Shipping</span>
            </div>
          </div>

          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setView('shop'); }}>Storefront Catalog</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setView('admin'); }}>Admin Console</a></li>
              <li><a href="#catalog-section">Shop Abayas</a></li>
              <li><a href="#catalog-section">Shop Hijabs</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Support</h3>
            <ul>
              <li><a href="#support">Contact Support</a></li>
              <li><a href="#shipping">Delivery Policies</a></li>
              <li><a href="#exchange">Exchange Guidelines</a></li>
              <li><a href="#sizing">Sizing Charts</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Let's Stay Connected</h3>
            <p style={{ color: 'hsl(var(--color-stone))', fontSize: '0.9rem' }}>Subscribe to get notifications on our upcoming satin & velvet seasonal drops.</p>
            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }}>
              <input type="email" placeholder="Your Email Address" className="newsletter-input" required />
              <button type="submit" className="newsletter-btn">Join</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ModestZip. All rights reserved. Premium Modesty Retailer Pakistan.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={16} /> Karachi, Pakistan</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Phone size={16} /> +92-300-1234567</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Mail size={16} /> care@modestzip.com</span>
          </div>
        </div>
      </footer>

      {/* Cart Drawer Sidebar */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Product Detail Popup Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Checkout Processing Overlay */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onPlaceOrder={handlePlaceOrder}
        onClearCart={() => setCartItems([])}
      />

      {/* Dynamic Toast Feedback Overlay */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            <ShoppingBag size={18} style={{ color: 'hsl(var(--color-gold))' }} />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
