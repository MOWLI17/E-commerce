import React from 'react';
import ProductCard from './ProductCard';

const Home = ({ products, onAddToCart, onToggleWishlist, isWishlisted }) => {
  return (
    <div className="home-container">
      <div className="home-layout">

        {/* Product Grid */}
        <div className="product-section">
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={isWishlisted}
              />
            ))}
          </div>
          {products.length === 0 && <p className="no-products">No products found</p>}
        </div>
      </div>
    </div>
  );
};
export default Home;
