import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const STEPS = [
  { key: 'pending', label: 'Order Placed', icon: '🛒', desc: 'Your order has been placed' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅', desc: 'Order confirmed by seller' },
  { key: 'packed', label: 'Packed', icon: '📦', desc: 'Your order has been packed' },
  { key: 'shipped', label: 'Shipped', icon: '🚚', desc: 'Order is on the way' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🏍️', desc: 'Nearest to your location' },
  { key: 'delivered', label: 'Delivered', icon: '🎉', desc: 'Order delivered successfully' },
];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authHeader } = useAuth();

  useEffect(() => {
    axios.get(`https://shopx-hpfw.onrender.com/api/orders/${id}`, authHeader())
      .then(r => setOrder(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="loading">
      <div className="loading-spinner"></div>
      <span>Loading order...</span>
    </div>
  );

  if (!order) return (
    <div className="empty-state">
      <div className="empty-icon">😕</div>
      <div className="empty-title">Order not found</div>
      <Link to="/orders" className="btn btn-primary">Back to Orders</Link>
    </div>
  );

  const currentStep = STEPS.findIndex(s => s.key === order.status);

  return (
    <div className="page">

      {/* BACK */}
      <Link to="/orders" style={{
        color: 'var(--text2)', textDecoration: 'none',
        fontSize: '14px', display: 'inline-flex',
        alignItems: 'center', gap: '6px', marginBottom: '28px'
      }}>
        ← Back to Orders
      </Link>

      {/* HEADER */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px',
        marginBottom: '36px'
      }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Order Details</h1>
          <div style={{ fontFamily: 'monospace', color: 'var(--text2)', fontSize: '14px' }}>
            #{order._id.slice(-8).toUpperCase()}
          </div>
          <div style={{ color: 'var(--text3)', fontSize: '14px', marginTop: '4px' }}>
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit'
            })}
          </div>
        </div>
        <div className={`badge badge-${order.status}`} style={{ fontSize: '15px', padding: '8px 20px' }}>
          {STEPS.find(s => s.key === order.status)?.label || order.status}
        </div>
      </div>

      {/* ORDER TRACKER */}
      {order.status !== 'cancelled' && (
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '32px', marginBottom: '24px'
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '32px', fontSize: '18px' }}>
            📍 Live Order Tracking
          </h3>

          {/* TRACKER STEPS */}
          <div style={{ position: 'relative' }}>

            {/* PROGRESS LINE */}
            <div style={{
              position: 'absolute', top: '20px', left: '20px', right: '20px', height: '3px',
              background: 'var(--border)', borderRadius: '2px', zIndex: 0
            }}>
              <div style={{
                height: '100%', borderRadius: '2px',
                background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
                width: currentStep < 0 ? '0%' : `${(currentStep / (STEPS.length - 1)) * 100}%`,
                transition: 'width 0.5s ease'
              }} />
            </div>

            {/* STEPS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
              {STEPS.map((step, i) => {
                const isCompleted = i <= currentStep;
                const isCurrent = i === currentStep;
                return (
                  <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', flex: 1 }}>
                    {/* CIRCLE */}
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '50%',
                      background: isCompleted ? 'var(--accent)' : 'var(--surface)',
                      border: `3px solid ${isCompleted ? 'var(--accent)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px', transition: 'all 0.3s',
                      boxShadow: isCurrent ? '0 0 0 4px rgba(255,107,53,0.2)' : 'none'
                    }}>
                      {isCompleted ? step.icon : '○'}
                    </div>

                    {/* LABEL */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '12px', fontWeight: isCurrent ? 700 : 500,
                        color: isCompleted ? 'var(--text)' : 'var(--text3)',
                        marginBottom: '4px'
                      }}>
                        {step.label}
                      </div>
                      {isCurrent && (
                        <div style={{
                          fontSize: '11px', color: 'var(--accent)',
                          fontWeight: 600, animation: 'pulse 2s infinite'
                        }}>
                          ● {step.desc}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CURRENT STATUS MESSAGE */}
          <div style={{
            marginTop: '32px', padding: '16px 20px',
            background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)',
            borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <span style={{ fontSize: '24px' }}>{STEPS[currentStep]?.icon || '📦'}</span>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '2px' }}>
                {STEPS[currentStep]?.label || 'Processing'}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text2)' }}>
                {STEPS[currentStep]?.desc || 'Your order is being processed'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CANCELLED */}
      {order.status === 'cancelled' && (
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '24px',
          display: 'flex', alignItems: 'center', gap: '16px'
        }}>
          <span style={{ fontSize: '36px' }}>❌</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '18px', color: 'var(--error)', marginBottom: '4px' }}>Order Cancelled</div>
            <div style={{ color: 'var(--text2)', fontSize: '14px' }}>This order has been cancelled.</div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
        <div>

          {/* ORDER ITEMS */}
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '28px', marginBottom: '24px'
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '20px' }}>
              🛍️ Items Ordered
            </h3>
            {order.items.map((item, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 0',
                borderBottom: i < order.items.length - 1 ? '1px solid var(--border)' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '10px',
                    background: 'var(--surface)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '28px',
                    border: '1px solid var(--border)', overflow: 'hidden'
                  }}>
                    {item.image ? (
                      <img src={item.image} alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : '📦'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, marginBottom: '4px' }}>{item.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text2)' }}>
                      Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '16px' }}>
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          {/* SHIPPING ADDRESS */}
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '28px'
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '16px' }}>
              📍 Delivery Address
            </h3>
            <p style={{ color: 'var(--text2)', lineHeight: 2.2, fontSize: '15px' }}>
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state}<br />
              Pincode: {order.shippingAddress.pincode}<br />
              📞 {order.shippingAddress.phone}
            </p>
          </div>
        </div>

        {/* PAYMENT SUMMARY */}
        <div>
          <div className="order-summary">
            <div className="summary-title">Payment Info</div>
            <div className="summary-row">
              <span>Total Amount</span>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="summary-row">
              <span>Payment Method</span>
              <span>{order.payment?.razorpay_payment_id ? '💳 Online' : '💵 COD'}</span>
            </div>
            <div className="summary-row">
              <span>Payment Status</span>
              <span className={`badge badge-${order.payment?.status}`}>
                {order.payment?.status}
              </span>
            </div>

            {order.payment?.razorpay_payment_id && (
              <div style={{
                marginTop: '16px', padding: '14px',
                background: 'var(--bg3)', borderRadius: 'var(--radius)',
                border: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '6px' }}>
                  Razorpay Payment ID
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--text2)', wordBreak: 'break-all' }}>
                  {order.payment.razorpay_payment_id}
                </div>
              </div>
            )}

            <div style={{
              marginTop: '20px', padding: '14px',
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 'var(--radius)',
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '13px', color: 'var(--success)'
            }}>
              🔒 Payment secured by Razorpay
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}