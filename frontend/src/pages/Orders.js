import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authHeader } = useAuth();

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders/my', authHeader())
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="loading">
      <div className="loading-spinner"></div>
      <span>Loading orders...</span>
    </div>
  );

  return (
    <div className="page">
      <h1 className="page-title">My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <div className="empty-title">No orders yet!</div>
          <div className="empty-text">
            Start shopping to place your first order.
          </div>
          <Link to="/products" className="btn btn-primary btn-lg">
            Shop Now →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map(order => (
            <div key={order._id} style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '24px',
              transition: 'border-color 0.2s'
            }}>
              {/* ORDER HEADER */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px',
                marginBottom: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--text3)', marginBottom: '4px' }}>
                    Order ID
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--text2)' }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text3)', marginTop: '6px' }}>
                    📅 {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div className={`badge badge-${order.status}`} style={{ marginBottom: '8px', display: 'inline-block' }}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--accent2)', fontSize: '20px' }}>
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* ORDER ITEMS PREVIEW */}
              <div style={{
                display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap'
              }}>
                {order.items.slice(0, 4).map((item, i) => (
                  <div key={i} style={{
                    width: '52px', height: '52px', borderRadius: '8px',
                    background: 'var(--surface)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px', border: '1px solid var(--border)'
                  }}>
                    📦
                  </div>
                ))}
                {order.items.length > 4 && (
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '8px',
                    background: 'var(--surface)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', color: 'var(--text2)',
                    border: '1px solid var(--border)'
                  }}>
                    +{order.items.length - 4}
                  </div>
                )}
              </div>

              {/* ORDER FOOTER */}
              <div style={{
                borderTop: '1px solid var(--border)', paddingTop: '16px',
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', flexWrap: 'wrap', gap: '12px'
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text2)' }}>
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </span>
                  <span style={{ color: 'var(--text3)' }}>•</span>
                  <span style={{ fontSize: '14px' }}>
                    Payment: <span className={`badge badge-${order.payment.status}`}>
                      {order.payment.status}
                    </span>
                  </span>
                </div>
                <Link
                  to={`/orders/${order._id}`}
                  className="btn btn-outline btn-sm"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}