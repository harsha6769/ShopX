import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 👋');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <Link to="/" style={{ 
            fontFamily: 'var(--font-display)', fontSize: '28px', 
            fontWeight: 800, color: 'var(--text)', textDecoration: 'none' 
          }}>
            SHOP<span style={{ color: 'var(--accent)' }}>X</span>
          </Link>
          <h1 className="auth-title" style={{ marginTop: '24px' }}>Welcome back</h1>
          <p className="auth-sub">Sign in to your ShopX account</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            className="btn btn-primary btn-lg btn-full"
            type="submit"
            disabled={loading}
            style={{ marginBottom: '20px' }}
          >
            {loading ? '⏳ Signing in...' : 'Sign In →'}
          </button>
        </form>

        {/* TEST CREDENTIALS */}
        <div className="auth-divider">or</div>

        <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '14px', marginTop: '20px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>
            Create one →
          </Link>
        </p>
      </div>
    </div>
  );
}