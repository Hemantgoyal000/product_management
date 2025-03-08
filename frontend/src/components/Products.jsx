import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { fetchProducts } from '../../services/api';

const products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts(token);
        setProducts(data);
        setError('');
      } catch (err) {
        setError('Failed to load products. ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [token]);

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="products-container">
      <h2>Products</h2>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p className="price">${product.price}</p>
              <button className="buy-button">Add to Cart</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default products;