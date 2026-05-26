import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const API = 'http://localhost:5000';

const EMPTY_PRODUCT = {
  name: '', description: '', price: '', originalPrice: '',
  category: 'Electronics', stock: '', featured: false,
  images: [''], tags: ''
};

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys', 'Other'];

const ORDER_STATUSES = [
  { value: 'pending', label: '🛒 Pending' },
  { value: 'confirmed', label: '✅ Confirmed' },
  { value: 'packed', label: '📦 Packed' },
  { value: 'shipped', label: '🚚 Shipped' },
  { value: 'out_for_delivery', label: '🏍️ Out for Delivery' },
  { value: 'delivered', label: '🎉 Delivered' },
  { value: 'cancelled', label: '❌ Cancelled' },
];

export default function AdminPanel() {
  const { user, authHeader } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('products');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Admin access only!');
      navigate('/');
    }
  }, [user]);

  useEffect(() => { fetchProducts(); fetchOrders(); }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API}/api/products?limit=100`);
      setProducts(data.products);
    } catch (e) { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API}/api/orders`, authHeader());
      setOrders(data);
    } catch (e) {}
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.stock)
      return toast.error('Name, price and stock are required!');

    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice) || undefined,
        stock: Number(form.stock),
        images: form.images.filter(i => i.trim()),
        tags: typeof form.tags === 'string'
          ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
          : form.tags
      };

      if (editing) {
        await axios.put(`${API}/api/products/${editing}`, payload, authHeader());
        toast.success('Product updated! ✅');
      } else {
        await axios.post(`${API}/api/products`, payload, authHeader());
        toast.success('Product added! ✅');
      }

      setShowForm(false);
      setEditing(null);
      setForm(EMPTY_PRODUCT);
      fetchProducts();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleEdit = (product) => {
    setForm({
      ...product,
      tags: product.tags?.join(', ') || '',
      images: product.images?.length ? product.images : ['']
    });
    setEditing(product._id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API}/api/products/${id}`, authHeader());
      toast.success('Product deleted!');
      fetchProducts();
    } catch (e) { toast.error('Failed to delete'); }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await axios.put(`${API}/api/orders/${orderId}/status`, { status }, authHeader());
      toast.success('Order status updated!');
      fetchOrders();
    } catch (e) { toast.error('Failed to update'); }
  };

  if (loading) return (
    <div className="loading">
      <div className="loading-spinner"></div>
      <span>Loading admin panel...</span>
    </div>
  );

  return (
    <div className="page">

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '4px' }}>👑 Admin Panel</h1>
          <p style={{ color: 'var(--text2)' }}>Manage your ShopX store</p>
        </div>
        {tab === 'products' && (
          <button className="btn btn-primary" onClick={() => {
            setShowForm(!showForm);
            setEditing(null);
            setForm(EMPTY_PRODUCT);
          }}>
            {showForm ? '✕ Cancel' : '+ Add Product'}
          </button>
        )}
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Products', value: products.length, icon: '📦' },
          { label: 'Total Orders', value: orders.length, icon: '🛒' },
          { label: 'Revenue', value: `₹${orders.filter(o => o.payment?.status === 'paid').reduce((s, o) => s + o.totalAmount, 0).toLocaleString('en-IN')}`, icon: '💰' },
          { label: 'Pending Orders', value: orders.filter(o => o.status === 'pending').length, icon: '⏳' },
          { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, icon: '🎉' },
          { label: 'Out for Delivery', value: orders.filter(o => o.status === 'out_for_delivery').length, icon: '🏍️' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '20px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.icon}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700 }}>{stat.value}</div>
            <div style={{ fontSize: '13px', color: 'var(--text2)', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {['products', 'orders'].map(t => (
          <button key={t} className={`btn ${tab === t ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setTab(t)}>
            {t === 'products' ? '📦 Products' : '🛒 Orders'}
          </button>
        ))}
      </div>

      {/* ADD/EDIT FORM */}
      {showForm && tab === 'products' && (
        <div style={{
          background: 'var(--bg2)', border: '2px solid var(--accent)',
          borderRadius: 'var(--radius-lg)', padding: '28px', marginBottom: '32px'
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '24px', fontSize: '20px' }}>
            {editing ? '✏️ Edit Product' : '➕ Add New Product'}
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input className="form-input" placeholder="iPhone 15 Pro"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-input" value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea className="form-input" placeholder="Product description..."
              rows={3} value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              style={{ resize: 'vertical' }} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input className="form-input" type="number" placeholder="29999"
                value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Original Price (₹)</label>
              <input className="form-input" type="number" placeholder="39999"
                value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Stock *</label>
              <input className="form-input" type="number" placeholder="100"
                value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Tags (comma separated)</label>
              <input className="form-input" placeholder="apple, smartphone, 5G"
                value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input className="form-input" placeholder="https://images.unsplash.com/..."
              value={form.images[0]} onChange={e => setForm({ ...form, images: [e.target.value] })} />
            {form.images[0] && (
              <img src={form.images[0]} alt="preview"
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px', border: '1px solid var(--border)' }} />
            )}
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.featured}
                onChange={e => setForm({ ...form, featured: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }} />
              <span style={{ fontWeight: 500 }}>⭐ Featured Product (shows on homepage)</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={saving}>
              {saving ? '⏳ Saving...' : editing ? '✅ Update Product' : '➕ Add Product'}
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => {
              setShowForm(false);
              setEditing(null);
              setForm(EMPTY_PRODUCT);
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {tab === 'products' && (
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                {['Image', 'Product', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text2)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--bg3)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                      {product.images?.[0]
                        ? <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : '📦'}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{product.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px' }}>{product._id.slice(-8).toUpperCase()}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: 'rgba(255,107,53,0.1)', color: 'var(--accent)', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                      {product.category}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--accent)' }}>₹{product.price.toLocaleString('en-IN')}</div>
                    {product.originalPrice && <div style={{ fontSize: '12px', color: 'var(--text3)', textDecoration: 'line-through' }}>₹{product.originalPrice.toLocaleString('en-IN')}</div>}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ color: product.stock <= 5 ? 'var(--error)' : product.stock <= 20 ? '#eab308' : 'var(--success)', fontWeight: 600 }}>
                      {product.stock}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {product.featured ? '⭐' : '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(product)}>✏️ Edit</button>
                      <button className="btn btn-sm" onClick={() => handleDelete(product._id)}
                        style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--error)', border: '1px solid var(--error)' }}>
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ORDERS TAB */}
      {tab === 'orders' && (
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                {['Order ID', 'Customer', 'Items', 'Amount', 'Payment', 'Current Status', 'Update Status'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text2)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--text2)' }}>
                      #{order._id.slice(-8).toUpperCase()}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 500 }}>{order.user?.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{order.user?.email}</div>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text2)', fontSize: '14px' }}>
                    {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--accent)' }}>
                    ₹{order.totalAmount?.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge badge-${order.payment?.status}`}>
                      {order.payment?.status === 'pending' ? '💵 COD' : '💳 Paid'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge badge-${order.status}`}>
                      {ORDER_STATUSES.find(s => s.value === order.status)?.label || order.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <select
                      className="filter-select"
                      style={{ fontSize: '13px', padding: '6px 12px' }}
                      value={order.status}
                      onChange={e => handleStatusUpdate(order._id, e.target.value)}
                    >
                      {ORDER_STATUSES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🛒</div>
              <div className="empty-title">No orders yet</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}