import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cart.length === 0) return (
    <div className="page">
      <div className="empty-state">
        <div className="empty-icon">🛒</div>
        <div className="empty-title">Your cart is empty!</div>
        <div className="empty-text">
          Looks like you haven't added anything yet.
        </div>
        <Link to="/products" className="btn btn-primary btn-lg">
          Start Shopping →
        </Link>
      </div>
    </div>
  );

  const shipping = cartTotal >= 500 ? 0 : 49;
  const gst = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + gst;

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>
          Shopping Cart
          <span style={{ fontSize: '18px', fontWeight: 400, color: 'var(--text2)', marginLeft: '12px' }}>
            ({cart.length} {cart.length === 1 ? 'item' : 'items'})
          </span>
        </h1>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => { clearCart(); toast.success('Cart cleared!'); }}
          style={{ color: 'var(--error)', borderColor: 'var(--error)' }}
        >
          🗑️ Clear Cart
        </button>
      </div>

      <div className="cart-layout">

        {/* CART ITEMS */}
        <div>
          {cart.map(item => (
            <div key={item._id} className="cart-item">

              {/* IMAGE */}
              <div className="cart-item-img">
                {item.images?.[0] ? (
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                  />
                ) : '📦'}
              </div>

              {/* INFO */}
              <div className="cart-item-info">
                <div className="cart-item-category">{item.category}</div>
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">
                  ₹{item.price.toLocaleString('en-IN')}
                </div>

                {/* QTY CONTROL */}
                <div className="qty-control">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  >−</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >+</button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      removeFromCart(item._id);
                      toast.success('Item removed!');
                    }}
                    style={{ color: 'var(--error)', borderColor: 'var(--error)', marginLeft: '8px' }}
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* ITEM TOTAL */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 700, color: 'var(--accent2)', fontSize: '18px' }}>
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
                {item.originalPrice && (
                  <div style={{ fontSize: '12px', color: 'var(--text3)', textDecoration: 'line-through' }}>
                    ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* CONTINUE SHOPPING */}
          <Link
            to="/products"
            className="btn btn-outline"
            style={{ marginTop: '16px' }}
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* ORDER SUMMARY */}
        <div className="order-summary">
          <div className="summary-title">Order Summary</div>

          <div className="summary-row">
            <span>Subtotal ({cart.length} items)</span>
            <span>₹{cartTotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="summary-row">
            <span>GST (18%)</span>
            <span>₹{gst.toLocaleString('en-IN')}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span style={{ color: shipping === 0 ? 'var(--success)' : undefined }}>
              {shipping === 0 ? '🎉 FREE' : `₹${shipping}`}
            </span>
          </div>

          {shipping > 0 && (
            <div style={{
              background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)',
              borderRadius: '8px', padding: '10px 12px',
              fontSize: '13px', color: 'var(--accent)', marginBottom: '12px'
            }}>
              Add ₹{(500 - cartTotal).toLocaleString('en-IN')} more for FREE shipping!
            </div>
          )}

          <hr className="summary-divider" />

          <div className="summary-total">
            <span>Total</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>

          <button
            className="btn btn-primary btn-lg btn-full"
            onClick={() => user ? navigate('/checkout') : navigate('/login')}
          >
            {user ? '🔒 Proceed to Checkout' : '🔑 Login to Checkout'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--text3)' }}>
            🔒 Secured by Razorpay
          </div>

          {/* ACCEPTED PAYMENTS */}
          <div style={{
            marginTop: '16px', padding: '12px',
            background: 'var(--bg3)', borderRadius: 'var(--radius)',
            border: '1px solid var(--border)', textAlign: 'center'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '8px' }}>
              We Accept
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '12px', color: 'var(--text2)' }}>
              {['💳 Cards', '📱 UPI', '🏦 Net Banking', '👛 Wallets'].map(p => (
                <span key={p} style={{
                  background: 'var(--surface)', padding: '4px 8px',
                  borderRadius: '4px', border: '1px solid var(--border)'
                }}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}