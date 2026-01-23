import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductRow from './ProductRow';

const LandingPage = ({ products, setFilters }) => {
    const navigate = useNavigate();

    const handleShop = () => {
        navigate('/shop');
    };

    const categories = [...new Set(products.map(product => product.category))];

    const handleCategoryClick = (category) => {
        setFilters(prev => ({ ...prev, category: category }));
        navigate('/shop');
    };

    // Filter products for specific rows
    const electronicsProducts = products.filter(p => p.category === 'Electronics').slice(0, 10);
    const beautyProducts = products.filter(p => p.category === 'Beauty').slice(0, 10);
    const sportsProducts = products.filter(p => p.category === 'Sports').slice(0, 10);
    const fashionProducts = products.filter(p => p.category === 'Fashion').slice(0, 10);

    return (
        <div className="landing-container">
            {/* Hero Section / Deals Banner */}
            <div className="landing-hero-carousel" onClick={handleShop}>
                <div className="hero-text-overlay">
                    <h2>Great Festival Sale</h2>
                    <p>Up to 80% Off on Top Brands</p>
                </div>
            </div>

            {/* Dynamic Category Navigation Section */}
            <div className="home-card-grid">
                <div className="home-card full-width-card">
                    <h3>Shop by Category | Best Deals & Discounts</h3>
                    <div className="category-scroll-container">
                        {categories.map((category) => {
                            // Find a representative image for the category (first product with an image)
                            const categoryImage = products.find(p => p.category === category)?.image;

                            return (
                                <div key={category} className="category-card-item" onClick={() => handleCategoryClick(category)}>
                                    <div className="category-img-wrapper">
                                        <img src={categoryImage} alt={category} />
                                    </div>
                                    <span className="category-name">{category}</span>
                                </div>
                            );
                        })}
                        <div className="category-card-item" onClick={() => handleCategoryClick('all')}>
                            <div className="category-img-wrapper">
                                <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&h=200&fit=crop" alt="All" />
                            </div>
                            <span className="category-name">All Products</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Horizontal Product Rows (Amazon Style) */}
            <ProductRow title="Best Sellers in Electronics" products={electronicsProducts} onCategoryClick={handleCategoryClick} />
            <ProductRow title="Top Beauty Picks" products={beautyProducts} onCategoryClick={handleCategoryClick} />

            {/* Main Card Grid */}
            <div className="home-card-grid">

                {/* Card 1: Shop by brand (Quad) */}
                <div className="home-card">
                    <h3>Mobile Phones & Accessories</h3>
                    <div className="quad-grid">
                        <div className="quad-item" onClick={() => handleCategoryClick('Samsung')}>
                            <img src="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=150&h=150&fit=crop" alt="Samsung" />
                            <span>Samsung</span>
                        </div>
                        <div className="quad-item" onClick={() => handleCategoryClick('Apple')}>
                            <img src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=150&h=150&fit=crop" alt="Apple" />
                            <span>Apple</span>
                        </div>
                        <div className="quad-item" onClick={() => handleCategoryClick('OnePlus')}>
                            <img src="https://images.unsplash.com/photo-1621330381970-4b93d8d4b293?w=150&h=150&fit=crop" alt="OnePlus" />
                            <span>OnePlus</span>
                        </div>
                        <div className="quad-item" onClick={() => handleCategoryClick('iQOO')}>
                            <img src="https://images.unsplash.com/photo-1598327105666-5b89351aff23?w=150&h=150&fit=crop" alt="iQOO" />
                            <span>iQOO</span>
                        </div>
                    </div>
                    <p className="card-link" onClick={handleShop}>See all offers</p>
                </div>

                {/* Card 2: Home, kitchen (Quad) */}
                <div className="home-card">
                    <h3>Revamp your Home</h3>
                    <div className="quad-grid">
                        <div className="quad-item" onClick={() => handleCategoryClick('Kitchen')}>
                            <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=150&h=150&fit=crop" alt="Kitchen" />
                            <span>Kitchen essentials</span>
                        </div>
                        <div className="quad-item" onClick={() => handleCategoryClick('Decor')}>
                            <img src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=150&h=150&fit=crop" alt="Decor" />
                            <span>Home decor</span>
                        </div>
                        <div className="quad-item" onClick={() => handleCategoryClick('Furniture')}>
                            <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=150&h=150&fit=crop" alt="Furniture" />
                            <span>Furniture</span>
                        </div>
                        <div className="quad-item" onClick={() => handleCategoryClick('Improvement')}>
                            <img src="https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=150&h=150&fit=crop" alt="Improvement" />
                            <span>Home improvement</span>
                        </div>
                    </div>
                    <p className="card-link" onClick={handleShop}>See all deals</p>
                </div>

                {/* Card 3: Earbuds (Single) */}
                <div className="home-card">
                    <h3>Bluetooth & Wireless</h3>
                    <div className="single-card-viewport" onClick={() => handleCategoryClick('Wireless')}>
                        <img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop" alt="Earbuds" className="single-img" />
                    </div>
                    <p className="card-link" onClick={handleShop}>See all offers</p>
                </div>

                {/* Card 4: Electronics (Single) */}
                <div className="home-card">
                    <h3>Laptops & Tablets</h3>
                    <div className="single-card-viewport" onClick={() => handleCategoryClick('Laptops')}>
                        <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop" alt="Electronics" className="single-img" />
                    </div>
                    <p className="card-link" onClick={handleShop}>See all offers</p>
                </div>

            </div>

            {/* More Product Rows */}
            <ProductRow title="Latest Styles in Fashion" products={fashionProducts} onCategoryClick={handleCategoryClick} />
            <ProductRow title="Get Fit with Sports Gear" products={sportsProducts} onCategoryClick={handleCategoryClick} />

            {/* Additional Grid Row for more density if needed */}
            <div className="home-card-grid">
                {/* Card 5: Fashion (Quad) */}
                <div className="home-card">
                    <h3>Fashion for Him</h3>
                    <div className="quad-grid">
                        <div className="quad-item" onClick={() => handleCategoryClick('Men')}>
                            <img src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=150&h=150&fit=crop" alt="Clothing" />
                            <span>Clothing</span>
                        </div>
                        <div className="quad-item" onClick={() => handleCategoryClick('Men')}>
                            <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=150&h=150&fit=crop" alt="Footwear" />
                            <span>Footwear</span>
                        </div>
                        <div className="quad-item" onClick={() => handleCategoryClick('Men')}>
                            <img src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=150&h=150&fit=crop" alt="Watches" />
                            <span>Watches</span>
                        </div>
                        <div className="quad-item" onClick={() => handleCategoryClick('Men')}>
                            <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&h=150&fit=crop" alt="Bags" />
                            <span>Bags & Luggage</span>
                        </div>
                    </div>
                    <p className="card-link" onClick={handleShop}>See all offers</p>
                </div>

                {/* Card 6: Women's Fashion (Quad) */}
                <div className="home-card">
                    <h3>Fashion for Her</h3>
                    <div className="quad-grid">
                        <div className="quad-item" onClick={() => handleCategoryClick('Women')}>
                            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=150&h=150&fit=crop" alt="Clothing" />
                            <span>Clothing</span>
                        </div>
                        <div className="quad-item" onClick={() => handleCategoryClick('Women')}>
                            <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=150&h=150&fit=crop" alt="Footwear" />
                            <span>Footwear</span>
                        </div>
                        <div className="quad-item" onClick={() => handleCategoryClick('Women')}>
                            <img src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=150&h=150&fit=crop" alt="Jewelry" />
                            <span>Jewelry</span>
                        </div>
                        <div className="quad-item" onClick={() => handleCategoryClick('Women')}>
                            <img src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=150&h=150&fit=crop" alt="Bags" />
                            <span>Handbags</span>
                        </div>
                    </div>
                    <p className="card-link" onClick={handleShop}>See all offers</p>
                </div>

                {/* Card 7: Beauty (Single) */}
                <div className="home-card">
                    <h3>Beauty & Makeup</h3>
                    <div className="single-card-viewport" onClick={() => handleCategoryClick('Beauty')}>
                        <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop" alt="Beauty" className="single-img" />
                    </div>
                    <p className="card-link" onClick={handleShop}>See all offers</p>
                </div>
                {/* Card 8: Sign in */}
                <div className="home-card sign-in-card">
                    <h3>Sign in for your best experience</h3>
                    <button className="tile-sign-in-btn" onClick={() => navigate('/login')}>Sign in securely</button>
                    <div className="signin-promo-img">
                        <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&h=150&fit=crop" alt="Promo" />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LandingPage;
