import React from 'react';
import StarRating from './StarRating';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart, onToggleWishlist, isWishlisted }) => {
  const wishlisted = isWishlisted(product.id);
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (

    <div className="product-card">
      <div className="product-image-container">
        {product.badge && (
          <span
            className={`product-badge ${product.badge === 'SALE'
                ? 'sale'
                : product.badge === 'HOT'
                  ? 'hot'
                  : 'new'
              }`}
          >
            {product.badge}
          </span>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
          className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
        >
          {wishlisted ? '❤️' : '🤍'}
        </button>

        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          onClick={handleDetailsClick}
          style={{ cursor: 'pointer' }}
        />
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3
          className="product-name"
          onClick={handleDetailsClick}
          style={{ cursor: 'pointer' }}
        >
          {product.name}
        </h3>

        <div className="product-rating">
          <StarRating rating={product.rating} />
          <span className="review-count">({product.reviews})</span>
        </div>

        <div className="product-price">${product.price}</div>

        <button
          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          className="add-to-cart-btn"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};


export default ProductCard;
