import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


const ProductDetails = ({ products, onAddToCart, onToggleWishlist, isWishlisted }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const foundProduct = products.find(p => p.id === id);
        if (foundProduct) {
            setProduct(foundProduct);
        } else {
            // Product not found, redirect to shop
            navigate('/shop');
        }
    }, [id, products, navigate]);

    if (!product) return <div className="loading">Loading...</div>;

    const isLiked = isWishlisted(product.id);

    return (
        <div className="product-details-container">
            <button className="back-btn" onClick={() => navigate(-1)}>
                ← Back
            </button>
            <div className="product-details-content">
                {/* Image Section */}
                <div className="product-details-image">
                    <img src={product.image} alt={product.name} />
                    {product.badge && <span className="product-badge">{product.badge}</span>}
                </div>

                {/* Info Section */}
                <div className="product-details-info">
                    <h1 className="product-title">{product.name}</h1>
                    <div className="product-meta">
                        <div className="rating">
                            {'★'.repeat(Math.round(product.rating))}
                            <span className="rating-count">({product.reviews} reviews)</span>
                        </div>
                        <span className="product-category">{product.category}</span>
                    </div>

                    <div className="product-price-section">
                        <span className="price">${product.price}</span>
                    </div>

                    <p className="product-description">{product.description}</p>

                    <div className="product-actions">
                        <button
                            className="add-to-cart-btn-large"
                            onClick={() => onAddToCart(product)}
                        >
                            Add to Cart
                        </button>
                        <button
                            className={`wishlist-btn-large ${isLiked ? 'active' : ''}`}
                            onClick={() => onToggleWishlist(product)}
                        >
                            {isLiked ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
                        </button>
                    </div>

                    <div className="product-promise">
                        <div className="promise-item">
                            <span>🚚</span> Free Delivery
                        </div>
                        <div className="promise-item">
                            <span>🛡️</span> 1 Year Warranty
                        </div>
                        <div className="promise-item">
                            <span>↩️</span> 30 Days Return
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
