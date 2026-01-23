import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({
  cartCount = 0,
  wishlistCount = 0,
  filters = { category: 'all', priceRange: [0, 5000], rating: 0 },
  setFilters = () => { },
  onViewCart = () => { },
  onSearch = () => { },
  searchQuery = '',
  currentUser = null,
  onLogout = () => { }
}) => {
  const navigate = useNavigate();
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState('all');

  const toggleAccountDropdown = () =>
    setIsAccountDropdownOpen(!isAccountDropdownOpen);

  const handleLogoutClick = () => {
    onLogout();
    setIsAccountDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const accountDropdown = document.querySelector('.account-dropdown');
      const mobileMenu = document.querySelector('.mobile-menu-panel');
      const mobileMenuIcon = document.querySelector('.mobile-menu-icon');

      if (accountDropdown && !accountDropdown.contains(event.target)) {
        setIsAccountDropdownOpen(false);
      }

      if (mobileMenu && !mobileMenu.contains(event.target) && mobileMenuIcon && !mobileMenuIcon.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isAccountDropdownOpen || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAccountDropdownOpen, isMobileMenuOpen]);

  const handleLogin = () => {
    navigate('/login');
    setIsAccountDropdownOpen(false);
  };

  const handleRegister = () => {
    navigate('/register');
    setIsAccountDropdownOpen(false);
  };

  const handleWishlist = () => {
    navigate('/wishlist');
  };

  const handleCategoryClick = (category) => {
    setFilters({ ...filters, category });
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSearchCategory(category);
    setFilters({ ...filters, category });
  };

  return (
    <div>
      <header className="header">
        <div className="header-container">
          {/* Logo */}
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="logo-text">💎 Luxury Store</span>
          </div>

          {/* Delivery Location */}
          <div className="delivery-location">
            <span className="deliver-to">Deliver to</span>
            <div className="location-info">
              <span className="location-icon">📍</span>
              <span className="location-text">India</span>
            </div>
          </div>

          {/* Search Bar with Category Dropdown */}
          <div className="search-container">
            <select className="search-category" value={searchCategory} onChange={handleCategoryChange}>
              <option value="all">All</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Accessories">Accessories</option>
              <option value="Beauty">Beauty</option>
              <option value="Sports">Sports</option>
              <option value="Stationery">Stationery</option>
              <option value="Stationery">Home</option>

            </select>
            <input
              type="text"
              className="search-input"
              placeholder="Search luxury store"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
            />
            <button className="search-button">
              <span className="search-icon">🔍</span>
            </button>
          </div>

          {/* Header Actions */}
          <div className="header-actions">
            {/* Account Dropdown */}
            <div className="account-dropdown">
              <button
                onClick={toggleAccountDropdown}
                className="account-button"
              >
                <div className="account-info">
                  <span className="hello-text">Hello, {currentUser ? currentUser.name : 'sign in'} <br></br></span>
                  <div className="account-orders">
                    <span className="account-label"> <span>👤</span>Account & Lists</span>
                    <span className={`dropdown-arrow ${isAccountDropdownOpen ? 'open' : ''}`}>▼</span>
                  </div>
                </div>
              </button>

              {isAccountDropdownOpen && (
                <div className="dropdown-menu account-menu">
                  {currentUser ? (
                    <>
                      <div className="dropdown-item user-info">
                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                          <span>👤</span> {currentUser.name}
                        </div>
                      </div>
                      <button
                        className="dropdown-item border-top logout-btn"
                        onClick={handleLogoutClick}
                      >
                        <span>🚪</span> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="dropdown-item" onClick={handleLogin} style={{ cursor: 'pointer' }}>
                        <span>🔑</span> Login
                      </div>
                      <div
                        className="dropdown-item border-top"
                        onClick={handleRegister}
                        style={{ cursor: 'pointer' }}
                      >
                        <span>📝</span> Register
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <div className="returns-orders" onClick={handleWishlist} style={{ cursor: 'pointer' }}>
              <span className="returns-text">Wishlist</span>
              <div className="orders-text">
                ❤️ {wishlistCount > 0 && <span>({wishlistCount})</span>}
              </div>
            </div>

            {/* Cart */}
            <div className="cart-section" onClick={onViewCart} style={{ cursor: 'pointer' }}>
              <div className="cart-icon-wrapper">
                <span className="cart-emoji">🛒</span>
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </div>
              <span className="cart-text">Cart</span>
            </div>


          </div>
          {/* Mobile Menu Icon - Moved out of header-actions for layout control */}
          <button className="mobile-menu-icon" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu Dropdown - Slide down below header */}
        <div className={`mobile-menu-panel ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            <div className="mobile-menu-item" onClick={() => { handleWishlist(); closeMobileMenu(); }}>
              <span>❤️</span> Wishlist ({wishlistCount})
            </div>

            {currentUser ? (
              <>
                <div className="mobile-menu-item">
                  <span>👤</span> {currentUser.name}
                </div>
                <div className="mobile-menu-item" onClick={() => { handleLogoutClick(); closeMobileMenu(); }}>
                  <span>🚪</span> Logout
                </div>
              </>
            ) : (
              <>
                <div className="mobile-menu-item" onClick={() => { handleLogin(); closeMobileMenu(); }}>
                  <span>🔑</span> Login
                </div>
                <div className="mobile-menu-item" onClick={() => { handleRegister(); closeMobileMenu(); }}>
                  <span>📝</span> Register
                </div>
              </>
            )}

            <div className="mobile-menu-item" onClick={() => { onViewCart(); closeMobileMenu(); }}>
              <span>🛒</span> Cart ({cartCount})
            </div>
          </div>
        </div>
      </header>

      {/* Category Bar */}
      <div className="category-bar">
        <div className="category-container">
          <div
            className={`category-item ${filters.category === 'all' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('all')}
          >
            <span className="category-emoji">🏠</span>
            All
          </div>
          <div
            className={`category-item ${filters.category === 'Electronics' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('Electronics')}
          >
            <span className="category-emoji">📱</span>
            Electronics
          </div>
          <div
            className={`category-item ${filters.category === 'Fashion' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('Fashion')}
          >
            <span className="category-emoji">�</span>
            Fashion
          </div>
          <div
            className={`category-item ${filters.category === 'Accessories' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('Accessories')}
          >
            <span className="category-emoji">⌚</span>
            Accessories
          </div>
          <div
            className={`category-item ${filters.category === 'Beauty' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('Beauty')}
          >
            <span className="category-emoji">�</span>
            Beauty
          </div>
          <div
            className={`category-item ${filters.category === 'Sports' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('Sports')}
          >
            <span className="category-emoji">⚽</span>
            Sports
          </div>
          <div
            className={`category-item ${filters.category === 'Stationery' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('Stationery')}
          >
            <span className="category-emoji">�</span>
            Stationery
          </div>
          <div
            className={`category-item ${filters.category === 'Home' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('Home')}
          >
            <span className="category-emoji">🏠</span>
            Home
          </div>
        </div>
      </div>


    </div>
  );
};
export default Header;