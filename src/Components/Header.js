import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({
  cartCount = 0,
  wishlistCount = 0,
  filters = { category: 'all', priceRange: [0, 5000], rating: 0 },
  setFilters = () => {},
  onViewCart = () => {},
  onSearch = () => {},
  searchQuery = '',
  currentUser = null,
  onLogout = () => {}
  
}) => {
  const navigate = useNavigate();
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  // Sync tempFilters with filters prop whenever it changes
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const toggleAccountDropdown = () =>
    setIsAccountDropdownOpen(!isAccountDropdownOpen);

  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
    if (!isFilterDropdownOpen) {
      setTempFilters(filters);
    }
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsAccountDropdownOpen(false);
  };

  const closeAllDropdowns = () => {
    setIsAccountDropdownOpen(false);
    setIsFilterDropdownOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const filterDropdown = document.querySelector('.filter-dropdown');
      const accountDropdown = document.querySelector('.account-dropdown');
      
      if (filterDropdown && !filterDropdown.contains(event.target)) {
        setIsFilterDropdownOpen(false);
      }
      
      if (accountDropdown && !accountDropdown.contains(event.target)) {
        setIsAccountDropdownOpen(false);
      }
    };

    if (isFilterDropdownOpen || isAccountDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterDropdownOpen, isAccountDropdownOpen]);

  const handleApplyFilters = () => {
    console.log('Applying filters:', tempFilters);
    setFilters(tempFilters);
    setIsFilterDropdownOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters = { category: 'all', priceRange: [0, 5000], rating: 0 };
    setTempFilters(resetFilters);
    setFilters(resetFilters);
    setIsFilterDropdownOpen(false);
  };

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

  return (
    <div>
      <header className="header">
        <div className="header-container">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            💎 Luxury Store
          </div>

          {/* Search Bar */}
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          <div className="header-actions">
            {/* Filter Dropdown */}
            <div className="filter-dropdown">
              <button onClick={toggleFilterDropdown} className="filter-button">
                <span className="filter-icon">🧩</span>
                <span className="filter-text">Filters</span>
                <span
                  className={`dropdown-arrow ${
                    isFilterDropdownOpen ? 'open' : ''
                  }`}
                >
                  ▼
                </span>
              </button>

              {isFilterDropdownOpen && (
                <div
                  className="dropdown-menu filter-menu"
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div className="filter-group">
                    <label>Category</label>
                    <select
                      value={tempFilters.category}
                      onChange={(e) => {
                        console.log('Category changed to:', e.target.value);
                        setTempFilters({
                          ...tempFilters,
                          category: e.target.value
                        });
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="all">All Categories</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Beauty">Beauty</option>
                      <option value="Sports">Sports</option>
                      <option value="Stationery">Stationery</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Price Range</label>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      value={tempFilters.priceRange[1]}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value);
                        console.log('Price range changed to:', newValue);
                        setTempFilters({
                          ...tempFilters,
                          priceRange: [0, newValue]
                        });
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    />
                    <div className="price-label">
                      ${tempFilters.priceRange[0]} - ${tempFilters.priceRange[1]}
                    </div>
                  </div>

                  <div className="filter-group">
                    <label>Rating</label>
                    <select
                      value={tempFilters.rating}
                      onChange={(e) => {
                        const newRating = parseFloat(e.target.value);
                        console.log('Rating changed to:', newRating);
                        setTempFilters({
                          ...tempFilters,
                          rating: newRating
                        });
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="0">All Ratings</option>
                      <option value="3">3+ Stars</option>
                      <option value="4">4+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="5">5 Stars</option>
                    </select>
                  </div>

                  <div className="filter-buttons">
                    <button
                      type="button"
                      className="apply-btn"
                      onClick={handleApplyFilters}
                    >
                      Apply
                    </button>
                    <button
                      type="button"
                      className="reset-btn"
                      onClick={handleResetFilters}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <div className="wishlist-link" onClick={handleWishlist} style={{ cursor: 'pointer' }}>
              <div className="wishlist-icon">
                <span className="wishlist-emoji">❤️</span>
                <span className="wishlist-count">{wishlistCount}</span>
              </div>
            </div>

            {/* Account Dropdown */}
            <div className="account-dropdown">
              <button
                onClick={toggleAccountDropdown}
                className="account-button"
              >
                <span className="account-icon">👤</span>
                <span className="account-text">
                  {currentUser ? currentUser.name : 'Account'}
                </span>
                <span
                  className={`dropdown-arrow ${
                    isAccountDropdownOpen ? 'open' : ''
                  }`}
                >
                  ▼
                </span>
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

            {/* Cart */}
            <div className="cart-icon" onClick={onViewCart} style={{ cursor: 'pointer' }}>
              <span className="cart-emoji">🛒</span>
              <span className="cart-count">{cartCount}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {(isAccountDropdownOpen || isFilterDropdownOpen) && (
        <div className="overlay" onClick={closeAllDropdowns} />
      )}
    </div>
  );
};

export default Header;