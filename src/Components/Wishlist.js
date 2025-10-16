import React from 'react';
import ProductCard from './ProductCard';

const Wishlist = ({wishlist, onAddToCart, onToggleWishlist, isWishlisted }) => {
  
  return (
    <div className="wishlist-container">
      <h1>❤️ My Wishlist ({wishlist.length})</h1>
      {wishlist.length === 0 ? (
        <div className="empty-wishlist">
          <p>Your wishlist is empty. Start adding your favorite items!</p>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map(product => (
            <div key={product.id} className="wishlist-item">
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={isWishlisted}
              />
              <button 
                className="remove-btn"
                onClick={() => onToggleWishlist(product)}
                aria-label="Remove from wishlist"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;