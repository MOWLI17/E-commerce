import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Truck, ShieldCheck, HeartHandshake, CreditCard, ShoppingCart, Heart, ArrowLeft } from 'lucide-react';

const ProductDetails = ({ products, onAddToCart, onToggleWishlist, isWishlisted }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const foundProduct = products.find(p => p.id === id);
        if (foundProduct) {
            setProduct(foundProduct);
        } else {
            navigate('/shop');
        }
    }, [id, products, navigate]);

    if (!product) return <div className="loading-spinner">Loading...</div>;

    const isLiked = isWishlisted(product.id);

    return (
        <div className="product-page">
            <div className="product-details-container">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={16} /> Back
                </button>
                
                <div className="product-details-content">
                    {/* Image Section */}
                    <div className="product-image-wrapper">
                        <img src={product.image} alt={product.name} className="main-product-image" />
                    </div>

                    {/* Info Section */}
                    <div className="product-info-wrapper">
                        <h1 className="detail-title">{product.name}</h1>
                        
                        <div className="detail-meta">
                            <div className="detail-rating">
                                <span className="stars">{'★'.repeat(Math.round(product.rating))}</span>
                                <span className="review-count">({product.reviews} reviews)</span>
                            </div>
                            <span className="detail-category">{product.category.toUpperCase()}</span>
                        </div>

                        <div className="detail-price">
                            ${product.price.toFixed(2)}
                        </div>

                        <p className="detail-description">{product.description}</p>

                        <div className="detail-actions">
                            <button 
                                className="action-btn cart-btn"
                                onClick={() => onAddToCart(product)}
                            >
                                <ShoppingCart size={16} /> Add to Cart
                            </button>
                            <button 
                                className={`action-btn wishlist-btn ${isLiked ? 'active' : ''}`}
                                onClick={() => onToggleWishlist(product)}
                            >
                                <Heart size={16} fill={isLiked ? "currentColor" : "none"} /> 
                                {isLiked ? 'In Wishlist' : 'In Wishlist'}
                            </button>
                        </div>

                        <div className="detail-benefits">
                            <div className="benefit-item">
                                <Truck size={16} className="benefit-icon" /> <span>Free Delivery</span>
                            </div>
                            <div className="benefit-item">
                                <ShieldCheck size={16} className="benefit-icon" /> <span>1 Year Warranty</span>
                            </div>
                            <div className="benefit-item">
                                <HeartHandshake size={16} className="benefit-icon" /> <span>30 Days Return</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Service/Features Banner */}
            <div className="service-features-banner">
                <div className="feature-item">
                    <div className="feature-icon-box"><Truck size={24} /></div>
                    <div className="feature-text">
                        <h3>Free Shipping</h3>
                        <p>On orders over $50</p>
                    </div>
                </div>
                <div className="feature-item">
                    <div className="feature-icon-box"><ShieldCheck size={24} /></div>
                    <div className="feature-text">
                        <h3>Secure Payment</h3>
                        <p>100% secure payment</p>
                    </div>
                </div>
                <div className="feature-item">
                    <div className="feature-icon-box"><HeartHandshake size={24} /></div>
                    <div className="feature-text">
                        <h3>24/7 Support</h3>
                        <p>Dedicated support</p>
                    </div>
                </div>
                <div className="feature-item">
                    <div className="feature-icon-box"><CreditCard size={24} /></div>
                    <div className="feature-text">
                        <h3>Easy Returns</h3>
                        <p>30 day return policy</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
