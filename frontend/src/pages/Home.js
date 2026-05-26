import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { name: 'Electronics', emoji: '📱' },
  { name: 'Clothing', emoji: '👕' },
  { name: 'Books', emoji: '📚' },
  { name: 'Home', emoji: '🏠' },
  { name: 'Sports', emoji: '⚽' },
  { name: 'Beauty', emoji: '💄' },
  { name: 'Toys', emoji: '🧸' },
  { name: 'Other', emoji: '📦' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://shopx-hpfw.onrender.com/api/products/featured')
      .then(r => setFeatured(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-tag">
            🔥 New Arrivals Every Week
          </div>
          <h1 className="hero-title">
            Shop Smarter,<br />Live <em>Better</em>
          </h1>
          <p className="hero-sub">
            Discover thousands of premium products with secure Razorpay payments, 
            fast delivery, and easy 30-day returns.
          </p>
          <div className="hero-ctas">
            <Link to="/products" className="btn btn-primary btn-lg">
              Shop Now →
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg">
              Join for Free
            </Link>
          </div>

          {/* STATS */}
          <div className="hero-stats">
            {[
              { number: '10K+', label: 'Products' },
              { number: '50K+', label: 'Happy Customers' },
              { number: '100%', label: 'Secure Payments' },
              { number: '30 Days', label: 'Easy Returns' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="hero-stat-number">{stat.number}</div>
                <div className="hero-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle">Find exactly what you're looking for</p>
            </div>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <div
                key={cat.name}
                className="category-card"
                onClick={() => navigate(`/products?category=${cat.name}`)}
              >
                <div className="category-card-icon">{cat.emoji}</div>
                <div className="category-card-name">{cat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Handpicked deals just for you</p>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <span>Loading products...</span>
            </div>
          ) : featured.length > 0 ? (
            <div className="products-grid">
              {featured.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🛍️</div>
              <div className="empty-title">No featured products yet</div>
              <div className="empty-text">Check back soon!</div>
              <Link to="/products" className="btn btn-primary">
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div className="trust-badges">
            {[
              { icon: '🔒', title: 'Secure Payments', text: 'Powered by Razorpay — India\'s most trusted payment gateway. UPI, Cards, Net Banking.' },
              { icon: '🚚', title: 'Fast Delivery', text: 'Get your orders delivered in 2-5 business days across India.' },
              { icon: '↩️', title: 'Easy Returns', text: '30-day hassle-free return policy on all products.' },
              { icon: '🎧', title: '24/7 Support', text: 'Our dedicated support team is always here to help you.' },
            ].map(b => (
              <div key={b.title} className="trust-badge">
                <div className="trust-badge-icon">{b.icon}</div>
                <div className="trust-badge-title">{b.title}</div>
                <div className="trust-badge-text">{b.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BANNER */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div style={{
            background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%)',
            borderRadius: 'var(--radius-lg)', padding: '48px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '24px'
          }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
                Free Delivery on Orders Above ₹500! 🚀
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px' }}>
                Shop more, save more. No code needed!
              </p>
            </div>
            <Link to="/products" className="btn btn-lg" style={{ background: 'white', color: '#ff6b35', fontWeight: 700 }}>
              Shop Now →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}