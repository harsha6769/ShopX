import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, authHeader } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    phone: user?.address?.phone || ''
  });

  const handleChange = e => setAddress({ ...address, [e.target.name]: e.target.value });

  const shipping = cartTotal >= 500 ? 0 : 49;
  const gst = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + gst;

  const loadRazorpay = () => new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handleCOD = async () => {
    const { street, city, state, pincode, phone } = address;
    if (!street || !city || !state || !pincode || !phone)
      return toast.error('Please fill all address fields!');

    setLoading(true);
    try {
      await axios.post('https://shopx-hpfw.onrender.com/api/orders/cod', {
        items: cart.map(i => ({ product: i._id, quantity: i.quantity })),
        shippingAddress: address,
        totalAmount: total
      }, authHeader());

      clearCart();
      toast.success('🎉 Order placed with Cash on Delivery!');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpay = async () => {
    const { street, city, state, pincode, phone } = address;
    if (!street || !city || !state || !pincode || !phone)
      return toast.error('Please fill all address fields!');

    setLoading(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) return toast.error('Razorpay failed to load!');

      const { data } = await axios.post('https://shopx-hpfw.onrender.com/api/payment/create-order', {
        items: cart.map(i => ({ product: i._id, quantity: i.quantity })),
        shippingAddress: address
      }, authHeader());

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'ShopX',
        description: `Order of ${cart.length} items`,
        order_id: data.razorpayOrderId,
        handler: async (response) => {
          try {
            await axios.post('https://shopx-hpfw.onrender.com/api/payment/verify', {
              orderId: data.orderId,
              ...response
            }, authHeader());
            clearCart();
            toast.success('🎉 Order placed successfully!');
            navigate('/orders');
          } catch {
            toast.error('Payment verification failed!');
          }
        },
        prefill: { name: user.name, email: user.email, contact: phone },
        theme: { color: '#ff6b35' },
        modal: { ondismiss: () => toast.error('Payment cancelled!') }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => toast.error('Payment failed!'));
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Checkout</h1>

      <div className="cart-layout">
        <div>

          {/* SHIPPING ADDRESS */}
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '28px', marginBottom: '24px'
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '24px', fontSize: '18px' }}>
              📍 Shipping Address
            </h3>
            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input className="form-input" name="street" value={address.street}
                onChange={handleChange} placeholder="123, MG Road, Apartment 4B" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-input" name="city" value={address.city}
                  onChange={handleChange} placeholder="Hyderabad" />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input className="form-input" name="state" value={address.state}
                  onChange={handleChange} placeholder="Telangana" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Pincode</label>
                <input className="form-input" name="pincode" value={address.pincode}
                  onChange={handleChange} placeholder="500001" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" name="phone" value={address.phone}
                  onChange={handleChange} placeholder="+91 98765 43210" />
              </div>
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '28px', marginBottom: '24px'
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '24px', fontSize: '18px' }}>
              💳 Payment Method
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {/* RAZORPAY */}
              <div
                onClick={() => setPaymentMethod('razorpay')}
                style={{
                  padding: '16px 20px', borderRadius: 'var(--radius)',
                  border: `2px solid ${paymentMethod === 'razorpay' ? 'var(--accent)' : 'var(--border)'}`,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px',
                  background: paymentMethod === 'razorpay' ? 'rgba(255,107,53,0.05)' : 'var(--surface)',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  border: `2px solid ${paymentMethod === 'razorpay' ? 'var(--accent)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {paymentMethod === 'razorpay' && (
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)' }} />
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>🔒 Pay Online</div>
                  <div style={{ fontSize: '13px', color: 'var(--text2)' }}>UPI • Cards • Net Banking • Wallets via Razorpay</div>
                </div>
              </div>

              {/* CASH ON DELIVERY */}
              <div
                onClick={() => setPaymentMethod('cod')}
                style={{
                  padding: '16px 20px', borderRadius: 'var(--radius)',
                  border: `2px solid ${paymentMethod === 'cod' ? 'var(--accent)' : 'var(--border)'}`,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px',
                  background: paymentMethod === 'cod' ? 'rgba(255,107,53,0.05)' : 'var(--surface)',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  border: `2px solid ${paymentMethod === 'cod' ? 'var(--accent)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {paymentMethod === 'cod' && (
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)' }} />
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>💵 Cash on Delivery</div>
                  <div style={{ fontSize: '13px', color: 'var(--text2)' }}>Pay when your order arrives at your door</div>
                </div>
              </div>

            </div>
          </div>

          {/* ORDER ITEMS */}
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '28px'
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '20px', fontSize: '18px' }}>
              🛍️ Order Items ({cart.length})
            </h3>
            {cart.map(item => (
              <div key={item._id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 0', borderBottom: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '8px',
                    background: 'var(--surface)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '24px'
                  }}>
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                    ) : '📦'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '14px' }}>{item.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text2)' }}>
                      Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--accent)' }}>
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="order-summary">
          <div className="summary-title">Payment Summary</div>
          <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
          <div className="summary-row"><span>GST (18%)</span><span>₹{gst.toLocaleString('en-IN')}</span></div>
          <div className="summary-row">
            <span>Shipping</span>
            <span style={{ color: shipping === 0 ? 'var(--success)' : undefined }}>
              {shipping === 0 ? '🎉 FREE' : `₹${shipping}`}
            </span>
          </div>
          <hr className="summary-divider" />
          <div className="summary-total">
            <span>Total</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>

          {paymentMethod === 'razorpay' ? (
            <button
              className="btn btn-primary btn-lg btn-full"
              onClick={handleRazorpay}
              disabled={loading || cart.length === 0}
            >
              {loading ? '⏳ Processing...' : `🔒 Pay ₹${total.toLocaleString('en-IN')}`}
            </button>
          ) : (
            <button
              className="btn btn-lg btn-full"
              onClick={handleCOD}
              disabled={loading || cart.length === 0}
              style={{ background: 'var(--success)', color: 'white' }}
            >
              {loading ? '⏳ Placing Order...' : '💵 Place COD Order'}
            </button>
          )}

          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: 'var(--text3)' }}>
            {paymentMethod === 'razorpay' ? '🔒 Secured by Razorpay' : '💵 Pay when delivered'}
          </div>
        </div>
      </div>
    </div>
  );
}