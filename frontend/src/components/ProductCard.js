import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const CATEGORY_EMOJI = {
  Electronics: '📱', Clothing: '👕', Books: '📚', Home: '🏠',
  Sports: '⚽', Beauty: '💄', Toys: '🧸', Other: '📦'
};

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.stock === 0) return toast.error('Out of stock!');
    addToCart(product);
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setWishlisted(!wishlisted);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
  };

  const stars = Math.round(product.ratings?.average || 0);

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/products/${product._id}`)}
    >
      {/* DISCOUNT BADGE */}
      {discount > 0 && (
        <div className="discount-badge">{discount}% OFF</div>
      )}

      {/* WISHLIST BUTTON */}
      <button className="wishlist-btn" onClick={handleWishlist}>
        {wishlisted ? '❤️' : '🤍'}
      </button>

      {/* IMAGE */}
      <div className="product-card-img">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          CATEGORY_EMOJI[product.category] || '📦'
        )}
      </div>

      {/* BODY */}
      <div className="product-card-body">
        <div className="product-card-category">{product.category}</div>
        <div className="product-card-name">{product.name}</div>

        {/* RATING */}
        <div className="product-card-rating">
          <span className="stars">
            {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
          </span>
          <span>({product.ratings?.count || 0})</span>
        </div>

        {/* PRICE & ADD TO CART */}
        <div className="product-card-footer">
          <div>
            <div className="product-card-price">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
            {product.originalPrice && (
              <div className="product-card-original">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </div>
            )}
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out' : '+ Add'}
          </button>
        </div>

        {/* STOCK WARNING */}
        {product.stock > 0 && product.stock <= 5 && (
          <div style={{ 
            marginTop: '8px', fontSize: '12px', 
            color: 'var(--error)', fontWeight: 500 
          }}>
            ⚠️ Only {product.stock} left!
          </div>
        )}
      </div>
    </div>
  );
}