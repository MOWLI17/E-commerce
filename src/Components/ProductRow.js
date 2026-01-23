import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductRow = ({ title, products, onAddToCart, onCategoryClick }) => {
    const navigate = useNavigate();

    const handleProductClick = (product) => {
        navigate(`/product/${product.id}`);
    };

    return (
        <div className="product-row-container">
            <h3 className="row-title">{title}</h3>
            <div className="product-row">
                {products.map(product => (
                    <div key={product.id} className="row-product-card">
                        <div className="row-img-container" onClick={() => handleProductClick(product)}>
                            <img src={product.image} alt={product.name} />
                        </div>
                        <div className="row-product-info">
                            <p className="row-product-name" onClick={() => handleProductClick(product)}>{product.name}</p>
                            <div className="row-product-rating">
                                {'★'.repeat(Math.round(product.rating))}
                                <span className="row-review-count">({product.reviews})</span>
                            </div>
                            <p className="row-product-price">
                                <span className="currency-symbol">$</span>
                                {product.price}
                            </p>
                            {/* Optional: Add to cart button directly in row, or keep it clean like Amazon */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductRow;
