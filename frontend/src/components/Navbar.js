import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?keyword=${search}`);
      setSearch('');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* LOGO */}
        <Link to="/" className="logo">SHOP<span>X</span></Link>

        {/* SEARCH */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <span className="navbar-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search products, brands and more..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </form>

        {/* NAV LINKS */}
        <div className="nav-links">
          <Link to="/" className="nav-link">🏠 Home</Link>
          <Link to="/products" className="nav-link">Products</Link>

          {user ? (
            <>
              <Link to="/orders" className="nav-link">Orders</Link>

              {/* ADMIN LINK — only visible to admin */}
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="nav-link"
                  style={{
                    color: 'var(--accent2)',
                    fontWeight: 700,
                    border: '1px solid var(--accent2)',
                    borderRadius: '8px',
                    padding: '6px 12px'
                  }}
                >
                  👑 Admin
                </Link>
              )}

              {user.role !== 'admin' && (
  <span className="nav-link" style={{ cursor: 'default', color: 'var(--text2)' }}>
    👋 {user.name.split(' ')[0]}
  </span>
)}
              <button
                className="btn btn-outline btn-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}

          {/* CART */}
          <Link to="/cart" className="nav-cart">
            🛒
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>

          {/* THEME TOGGLE */}
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

      </div>
    </nav>
  );
}