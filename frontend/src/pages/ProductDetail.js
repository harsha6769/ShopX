import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const CATEGORY_EMOJI = {
  Electronics: '📱', Clothing: '👕', Books: '📚', Home: '🏠',
  Sports: '⚽', Beauty: '💄', Toys: '🧸', Other: '📦'
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="loading">
      <div className="loading-spinner"></div>
      <span>Loading product...</span>
    </div>
  );

  if (!product) return (
    <div className="empty-state">
      <div className="empty-icon">😕</div>
      <div className="empty-title">Product not found</div>
      <Link to="/products" className="btn btn-primary">
        Back to Products
      </Link>
    </div>
  );

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const stars = Math.round(product.ratings?.average || 0);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${qty}x ${product.name} added to cart! 🛒`);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  return (
    <div className="page">

      {/* BREADCRUMB */}
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: '8px',
        marginBottom: '32px', fontSize: '14px', color: 'var(--text2)'
      }}>
        <Link to="/" style={{ color: 'var(--text2)', textDecoration: 'none' }}>Home</Link>
        <span>›</span>
        <Link to="/products" style={{ color: 'var(--text2)', textDecoration: 'none' }}>Products</Link>
        <span>›</span>
        <Link to={`/products?category=${product.category}`} 
          style={{ color: 'var(--text2)', textDecoration: 'none' }}>
          {product.category}
        </Link>
        <span>›</span>
        <span style={{ color: 'var(--text)' }}>{product.name}</span>
      </div>

      <div className="product-detail">

        {/* IMAGE */}
        <div className="product-detail-img">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            CATEGORY_EMOJI[product.category] || '📦'
          )}
          {discount > 0 && (
            <div className="discount-badge" style={{ position: 'absolute', top: '16px', left: '16px', fontSize: '14px', padding: '6px 12px' }}>
              {discount}% OFF
            </div>
          )}
        </div>

        {/* INFO */}
        <div>
          <div className="product-detail-category">{product.category}</div>
          <h1 className="product-detail-name">{product.name}</h1>

          {/* RATING */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ color: 'var(--accent2)', fontSize: '20px', letterSpacing: '-1px' }}>
              {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
            </div>
            <span style={{ color: 'var(--text2)', fontSize: '14px' }}>
              {product.ratings?.average?.toFixed(1) || '0'} ({product.ratings?.count || 0} reviews)
            </span>
          </div>

          {/* PRICE */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px' }}>
            <span className="product-detail-price">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <>
                <span style={{ color: 'var(--text3)', textDecoration: 'line-through', fontSize: '20px' }}>
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '18px' }}>
                  {discount}% off
                </span>
              </>
            )}
          </div>

          {/* DESCRIPTION */}
          <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: '24px', fontSize: '15px' }}>
            {product.description}
          </p>

          {/* STOCK */}
          <div style={{ marginBottom: '24px' }}>
            {product.stock > 0 ? (
              <span className="badge badge-confirmed">
                ✓ In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="badge badge-cancelled">✗ Out of Stock</span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <span style={{ marginLeft: '8px', color: 'var(--error)', fontSize: '13px', fontWeight: 500 }}>
                ⚠️ Hurry! Only {product.stock} left
              </span>
            )}
          </div>

          {/* QUANTITY */}
          {product.stock > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Quantity
              </div>
              <div className="qty-control">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span className="qty-value">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
                <span style={{ color: 'var(--text3)', fontSize: '13px', marginLeft: '8px' }}>
                  Max {product.stock}
                </span>
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="product-detail-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              style={{ flex: 1 }}
            >
              🛒 Add to Cart
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              style={{ flex: 1 }}
            >
              ⚡ Buy Now
            </button>
            <button
              className="btn btn-outline btn-lg"
              onClick={() => {
                setWishlisted(!wishlisted);
                toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
              }}
            >
              {wishlisted ? '❤️' : '🤍'}
            </button>
          </div>

          {/* RAZORPAY BADGE */}
          <div className="razorpay-info">
            🔒 Secure checkout powered by Razorpay &nbsp;|&nbsp; UPI • Cards • Net Banking • Wallets
          </div>

          {/* DELIVERY INFO */}
          <div style={{ 
            marginTop: '16px', padding: '16px', 
            background: 'var(--bg3)', borderRadius: 'var(--radius)',
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {[
                { icon: '🚚', text: 'Free delivery above ₹500' },
                { icon: '↩️', text: '30-day easy returns' },
                { icon: '✅', text: '100% authentic product' },
              ].map(item => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text2)' }}>
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TAGS */}
          {product.tags?.length > 0 && (
            <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {product.tags.map(t => (
                <span key={t} style={{
                  background: 'var(--surface)', padding: '4px 14px',
                  borderRadius: '20px', fontSize: '13px', color: 'var(--text2)',
                  border: '1px solid var(--border)'
                }}>
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}