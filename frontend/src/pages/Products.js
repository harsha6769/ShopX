import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  'Electronics', 'Clothing', 'Books', 
  'Home', 'Sports', 'Beauty', 'Toys', 'Other'
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (keyword) params.keyword = keyword;
      if (category) params.category = category;
      if (sort) params.sort = sort;

      const { data } = await axios.get('http://localhost:5000/api/products', { params });
      setProducts(data.products);
      setTotal(data.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [keyword, category, sort, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateFilter = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val);
    else p.delete(key);
    setSearchParams(p);
    setPage(1);
  };

  return (
    <div className="page">

      {/* HEADER */}
      <div style={{ marginBottom: '8px' }}>
        <h1 className="page-title" style={{ marginBottom: '8px' }}>
          {category || 'All Products'}
        </h1>
        <p style={{ color: 'var(--text2)' }}>
          {total} products found {keyword && `for "${keyword}"`}
        </p>
      </div>

      {/* FILTERS */}
      <div className="filters-bar">
        <span style={{ color: 'var(--text2)', fontSize: '14px', fontWeight: 500 }}>
          🔧 Filters:
        </span>

        <select
          className="filter-select"
          value={category}
          onChange={e => updateFilter('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={sort}
          onChange={e => updateFilter('sort', e.target.value)}
        >
          <option value="">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>

        <select
          className="filter-select"
          onChange={e => {
            const [min, max] = e.target.value.split('-');
            updateFilter('minPrice', min);
            updateFilter('maxPrice', max);
          }}
        >
          <option value="">All Prices</option>
          <option value="0-999">Under ₹1,000</option>
          <option value="1000-9999">₹1,000 - ₹9,999</option>
          <option value="10000-49999">₹10,000 - ₹49,999</option>
          <option value="50000-999999">Above ₹50,000</option>
        </select>

        {(keyword || category || sort) && (
          <button
            className="btn btn-outline btn-sm"
            onClick={() => { setSearchParams({}); setPage(1); }}
          >
            ✕ Clear Filters
          </button>
        )}
      </div>

      {/* PRODUCTS */}
      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <span>Loading products...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No products found</div>
          <div className="empty-text">
            Try a different search term or category
          </div>
          <button
            className="btn btn-primary"
            onClick={() => { setSearchParams({}); setPage(1); }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {products.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

          {/* PAGINATION */}
          {total > 12 && (
            <div style={{
              display: 'flex', justifyContent: 'center',
              alignItems: 'center', gap: '12px', marginTop: '48px'
            }}>
              <button
                className="btn btn-outline"
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
              >
                ← Prev
              </button>
              <span style={{ color: 'var(--text2)', padding: '0 16px' }}>
                Page {page} of {Math.ceil(total / 12)}
              </span>
              <button
                className="btn btn-outline"
                onClick={() => setPage(p => p + 1)}
                disabled={page * 12 >= total}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}