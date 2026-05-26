import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">

          {/* BRAND */}
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800 }}>
              SHOP<span style={{ color: 'var(--accent)' }}>X</span>
            </div>
            <p className="footer-brand-desc">
              Your one-stop destination for premium products at unbeatable prices. 
              Secure payments powered by Razorpay.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              {['📘', '📸', '🐦', '▶️'].map((icon, i) => (
                <div key={i} style={{
                  width: '36px', height: '36px', background: 'var(--surface)',
                  borderRadius: '8px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', fontSize: '16px',
                  border: '1px solid var(--border)', transition: 'all 0.2s'
                }}>{icon}</div>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <div className="footer-heading">Shop</div>
            <ul className="footer-links">
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?category=Electronics">Electronics</Link></li>
              <li><Link to="/products?category=Clothing">Clothing</Link></li>
              <li><Link to="/products?category=Books">Books</Link></li>
              <li><Link to="/products?category=Sports">Sports</Link></li>
            </ul>
          </div>

          {/* ACCOUNT */}
          <div>
            <div className="footer-heading">Account</div>
            <ul className="footer-links">
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/orders">My Orders</Link></li>
              <li><Link to="/cart">My Cart</Link></li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <div className="footer-heading">Support</div>
            <ul className="footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Track Order</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
            <div style={{ marginTop: '20px', padding: '12px', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>🔒 Secured by</div>
              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '14px' }}>Razorpay</div>
            </div>
          </div>

        </div>

        {/* FOOTER BOTTOM */}
        <div className="footer-bottom">
          <p className="footer-copy">© {new Date().getFullYear()} ShopX. All rights reserved.</p>
          <p className="footer-copy">UPI • Cards • Net Banking • Wallets</p>
        </div>
      </div>
    </footer>
  );
}