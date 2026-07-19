import React, { useState, useRef, useEffect } from 'react';
import { DollarSign, ClipboardList, Package, CheckCircle, Upload, Trash2, ShieldCheck, TrendingUp } from 'lucide-react';
import type { Product, Order } from '../data/catalog';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  onAddProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  useEffect(() => {
    document.title = "ModestZip Admin Console";
    window.scrollTo(0, 0);
  }, []);
  
  // Product Upload Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Abayas');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [specsText, setSpecsText] = useState('');
  const sizes = ['S', 'M', 'L', 'XL'];
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Image Upload File Reader
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !description || !imagePreview) {
      alert('Please fill in Title, Price, Description, and select a product image.');
      return;
    }

    const specs = specsText
      ? specsText.split('\n').filter((line) => line.trim() !== '')
      : ['Fabric: Premium modest crepe', 'Includes matching chiffon hijab'];

    const newProductData = {
      title,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      category,
      image: imagePreview,
      description,
      specs,
      sizes,
      inStock: true,
      seoTitle: seoTitle || `${title} - Premium Modest Wear Pakistan | ModestZip`,
      seoDescription: seoDescription || `Shop ${title} online at ModestZip. Free delivery across Pakistan.`,
    };

    onAddProduct(newProductData);
    
    // Clear form
    setTitle('');
    setPrice('');
    setOriginalPrice('');
    setDescription('');
    setSpecsText('');
    setSeoTitle('');
    setSeoDescription('');
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    alert('Product uploaded successfully!');
  };

  // Metrics calculations
  const totalSales = orders
    .filter((o) => o.status === 'Completed' || o.status === 'Shipped')
    .reduce((sum, o) => sum + o.total, 0);

  const activeOrdersCount = orders.filter((o) => o.status === 'Pending' || o.status === 'Shipped').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'Completed').length;
  const totalProductsCount = products.length;

  // Simple SVG Sales Chart computation (Last 7 days or last 5 orders)
  const chartData = orders
    .filter((o) => o.status !== 'Cancelled')
    .slice(-5)
    .map((o) => ({ date: o.date.slice(5, 10), total: o.total }));

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title-wrap">
          <h1 className="text-serif" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={28} style={{ color: 'hsl(var(--color-plum))' }} /> ModestZip Admin Console
          </h1>
          <p>Manage your product catalog, monitor customer checkouts, and dispatch incoming orders.</p>
        </div>
      </div>

      {/* Metrics Summary cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrap plum">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="metric-label">Total Revenue</p>
            <p className="metric-value">Rs. {totalSales.toLocaleString()}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap gold">
            <ClipboardList size={24} />
          </div>
          <div>
            <p className="metric-label">Active Dispatches</p>
            <p className="metric-value">{activeOrdersCount}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap teal">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="metric-label">Completed Orders</p>
            <p className="metric-value">{completedOrdersCount}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap plum" style={{ backgroundColor: 'hsl(var(--color-gold) / 0.15)', color: 'hsl(var(--color-gold-dark))' }}>
            <Package size={24} />
          </div>
          <div>
            <p className="metric-label">Total Catalog</p>
            <p className="metric-value">{totalProductsCount}</p>
          </div>
        </div>
      </div>

      {/* SVG Sales Trend Chart */}
      {chartData.length > 0 && (
        <div className="analytics-chart-card">
          <div className="chart-header">
            <h3 className="chart-title text-serif" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} style={{ color: 'hsl(var(--color-plum))' }} /> Recent Order Revenue Trends
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'hsl(var(--color-stone))' }}>Real-time updates</span>
          </div>
          <div className="chart-canvas-wrap">
            <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#eee" strokeWidth="1" />
              <line x1="40" y1="80" x2="480" y2="80" stroke="#eee" strokeWidth="1" />
              <line x1="40" y1="140" x2="480" y2="140" stroke="#eee" strokeWidth="1" />
              <line x1="40" y1="180" x2="480" y2="180" stroke="#ccc" strokeWidth="1.5" />

              {/* Draw Line Plot */}
              {(() => {
                const maxVal = Math.max(...chartData.map((d) => d.total), 5000);
                const points = chartData.map((d, i) => {
                  const x = 40 + (i * 440) / Math.max(chartData.length - 1, 1);
                  const y = 180 - (d.total * 150) / maxVal;
                  return `${x},${y}`;
                });
                return (
                  <>
                    <polyline
                      fill="none"
                      stroke="hsl(var(--color-plum))"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={points.join(' ')}
                    />
                    {chartData.map((d, i) => {
                      const x = 40 + (i * 440) / Math.max(chartData.length - 1, 1);
                      const y = 180 - (d.total * 150) / maxVal;
                      return (
                        <g key={i}>
                          <circle cx={x} cy={y} r="5" fill="hsl(var(--color-gold-dark))" stroke="#fff" strokeWidth="1.5" />
                          <text x={x} y={y - 12} textAnchor="middle" fontSize="10" fontWeight="600" fill="hsl(var(--color-plum))">
                            Rs. {d.total.toLocaleString()}
                          </text>
                          <text x={x} y="194" textAnchor="middle" fontSize="9" fontWeight="500" fill="hsl(var(--color-stone))">
                            {d.date}
                          </text>
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="dashboard-tabs">
        <button
          className={`dashboard-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Incoming Orders ({orders.length})
        </button>
        <button
          className={`dashboard-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Product Management ({products.length})
        </button>
      </div>

      {/* Orders Tab View */}
      {activeTab === 'orders' && (
        <div className="dashboard-panel-card">
          <div className="panel-header">
            <h3 className="text-serif" style={{ fontSize: '1.25rem' }}>Customer Dispatches</h3>
          </div>
          <div className="table-responsive">
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'hsl(var(--color-stone))' }}>
                <p className="text-serif" style={{ fontSize: '1.1rem' }}>No orders placed yet.</p>
                <p style={{ fontSize: '0.85rem' }}>Submit checkouts on the homepage to see live order dispatches.</p>
              </div>
            ) : (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Details</th>
                    <th>Items Ordered</th>
                    <th>Delivery Address</th>
                    <th>Order Total</th>
                    <th>Status Badge</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: '700', color: 'hsl(var(--color-plum))' }}>#{order.id}</td>
                      <td>
                        <div style={{ fontWeight: '600' }}>{order.customerName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'hsl(var(--color-stone))' }}>{order.customerPhone}</div>
                        <div style={{ fontSize: '0.8rem', color: 'hsl(var(--color-stone))' }}>{order.customerEmail || 'No Email'}</div>
                      </td>
                      <td>
                        {order.items.map((item, index) => (
                          <div key={index} style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                            • {item.product.title} - <strong>{item.selectedSize}</strong> (x{item.quantity})
                          </div>
                        ))}
                        <div style={{ fontSize: '0.75rem', color: 'hsl(var(--color-stone))', marginTop: '4px' }}>Placed: {order.date}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: 'hsl(var(--color-gold-dark))' }}>{order.city}</div>
                        <div style={{ fontSize: '0.85rem', color: 'hsl(var(--color-stone))', maxWidth: '180px', textOverflow: 'ellipsis', overflow: 'hidden' }}>{order.address}</div>
                      </td>
                      <td style={{ fontWeight: '700' }}>Rs. {order.total.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${order.status.toLowerCase()}`}>{order.status}</span>
                      </td>
                      <td>
                        <select
                          className="status-select"
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Product Management Tab View */}
      {activeTab === 'products' && (
        <div className="dashboard-products-layout">
          {/* Add Product Form */}
          <div className="form-card">
            <h3 className="form-card-title text-serif">Upload New Product</h3>
            <form onSubmit={handleProductSubmit}>
              <div className="form-group">
                <label className="form-label">Product Title *</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Classic Silk Hijab"
                />
              </div>

              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Category *</label>
                  <select
                    className="form-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Abayas">Abayas</option>
                    <option value="Hijabs">Hijabs</option>
                    <option value="Kaftans">Kaftans</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Price (PKR) *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 1999"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Original Price (For Discount Display)</label>
                <input
                  type="number"
                  className="form-control"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="e.g. 2500"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image Upload *</label>
                <div
                  style={{
                    border: '2px dashed hsl(var(--color-gold) / 0.3)',
                    borderRadius: '6px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    backgroundColor: 'hsl(var(--bg-sand) / 0.3)',
                    transition: 'border-color 0.3s ease',
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <img src={imagePreview} alt="Preview" style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }} />
                      <span style={{ fontSize: '0.8rem', color: 'hsl(var(--color-plum))', fontWeight: '600' }}>Change Image</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'hsl(var(--color-stone))' }}>
                      <Upload size={24} />
                      <span style={{ fontSize: '0.85rem' }}>Select product image (PNG, JPG)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Product Description *</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell customers about the styling, cut, and fit..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Specifications (One per line)</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={specsText}
                  onChange={(e) => setSpecsText(e.target.value)}
                  placeholder="Fabric: Silk-Georgette&#10;Inclusions: Plain Hijab&#10;Length: Standard 56 inch"
                />
              </div>

              <div style={{ borderTop: '1px solid #eee', marginTop: '20px', paddingTop: '20px' }}>
                <h4 className="text-serif" style={{ fontSize: '1rem', marginBottom: '12px', color: 'hsl(var(--color-plum))' }}>SEO Configurations (Recommended)</h4>
                
                <div className="form-group">
                  <label className="form-label">SEO Title tag</label>
                  <input
                    type="text"
                    className="form-control"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="e.g. Classic Silk Hijab Pakistan | ModestZip"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">SEO Meta Description</label>
                  <input
                    type="text"
                    className="form-control"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Buy classic silk hijab online in Pakistan..."
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
                Upload to Store Catalog
              </button>
            </form>
          </div>

          {/* Active Products List */}
          <div className="admin-products-list">
            <h3 className="text-serif" style={{ fontSize: '1.5rem', marginBottom: '20px', borderBottom: '1px solid hsl(var(--color-cream))', paddingBottom: '12px' }}>
              Active Catalog ({products.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {products.map((prod) => (
                <div key={prod.id} className="admin-product-row">
                  <img src={prod.image} alt={prod.title} className="admin-product-thumb" />
                  <div className="admin-product-details">
                    <h4 className="admin-product-name">{prod.title}</h4>
                    <p className="admin-product-price">Rs. {prod.price.toLocaleString()}</p>
                    <span style={{ fontSize: '0.75rem', backgroundColor: 'hsl(var(--bg-sand))', padding: '2px 8px', borderRadius: '10px', color: 'hsl(var(--color-stone))', fontWeight: '500' }}>
                      {prod.category}
                    </span>
                  </div>
                  <div className="admin-product-actions">
                    <button
                      className="icon-btn"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${prod.title} from catalog?`)) {
                          onDeleteProduct(prod.id);
                        }
                      }}
                      style={{ color: 'hsl(var(--status-cancelled))', border: '1px solid hsl(var(--status-cancelled) / 0.2)' }}
                      title="Delete Product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
