import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm)
      return toast.error('Passwords do not match!');
    if (form.password.length < 6)
      return toast.error('Password must be at least 6 characters!');

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created successfully! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
          <h1 className="auth-title" style={{ marginTop: '24px' }}>Create account</h1>
          <p className="auth-sub">Join ShopX — it's completely free!</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

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

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Repeat password"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                required
              />
            </div>
          </div>

          {/* PASSWORD STRENGTH */}
          {form.password && (
            <div style={{ marginTop: '-12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{
                    height: '3px', flex: 1, borderRadius: '2px',
                    background: form.password.length >= i * 2
                      ? i <= 1 ? 'var(--error)'
                      : i <= 2 ? '#eab308'
                      : i <= 3 ? '#3b82f6'
                      : 'var(--success)'
                      : 'var(--border)'
                  }} />
                ))}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text3)' }}>
                {form.password.length < 4 ? 'Weak' : form.password.length < 6 ? 'Fair' : form.password.length < 8 ? 'Good' : 'Strong'} password
              </div>
            </div>
          )}

          <button
            className="btn btn-primary btn-lg btn-full"
            type="submit"
            disabled={loading}
            style={{ marginBottom: '20px' }}
          >
            {loading ? '⏳ Creating account...' : 'Create Account →'}
          </button>

          <p style={{ fontSize: '12px', color: 'var(--text3)', textAlign: 'center', marginBottom: '20px' }}>
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>

        <div className="auth-divider">or</div>

        <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '14px', marginTop: '20px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}