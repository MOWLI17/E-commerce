import './App.css';
import { useState, useMemo } from 'react';
import Home from './Components/Home';
import Header from './Components/Header';
import Cart from './Components/Cart';
import Wishlist from './Components/Wishlist';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Regester from './Components/Regester';
import Login from './Components/Login';
import LandingPage from './Components/LandingPage';
import ProductDetails from './Components/ProductDetails';
import ScrollToTop from './Components/ScrollToTop';

import Footer from './Components/Footer';
import Swal from 'sweetalert2';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 5000],
    rating: 0
  });

  // Calculate total items in cart (considering quantities)
  const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  const filteredProducts = useMemo(() => {
    return Products.filter(product => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        filters.category === 'all' ||
        product.category === filters.category;
      const matchesPrice =
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1];
      const matchesRating = product.rating >= filters.rating;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });
  }, [searchQuery, filters]);

  // Add to cart or increase quantity
  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);

      if (existingItem) {
        // Increase quantity
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        // Add new item
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    Swal.fire({
      title: 'Added to Cart!',
      text: `${product.name} has been added to your cart`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  // Increase quantity in cart
  const handleIncreaseQuantity = (productId) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  // Decrease quantity or remove if quantity is 1
  const handleDecreaseQuantity = (productId) => {
    setCart(prevCart => {
      const item = prevCart.find(i => i.id === productId);

      if (item && item.quantity > 1) {
        // Decrease quantity
        return prevCart.map(i =>
          item.id === productId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        );
      } else {
        // Remove item
        return prevCart.filter(i => i.id !== productId);
      }
    });
  };

  // Remove from cart completely
  const handleRemoveFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));

    Swal.fire({
      title: 'Removed from Cart',
      icon: 'info',
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  const handleToggleWishlist = (product) => {
    const isAlready = wishlist.some((item) => item.id === product.id);

    if (isAlready) {
      setWishlist(prevWishlist =>
        prevWishlist.filter((item) => item.id !== product.id)
      );

      Swal.fire({
        title: 'Removed from Wishlist!',
        text: `${product.name} has been removed from your wishlist.`,
        icon: 'info',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } else {
      setWishlist(prevWishlist => [...prevWishlist, product]);

      Swal.fire({
        title: 'Added to Wishlist!',
        text: `${product.name} has been added to your wishlist.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    }
  };

  const isWishlisted = (id) => wishlist.some((item) => item.id === id);

  const handleCheckout = () => {
    if (cart.length === 0) {
      Swal.fire({
        title: 'Cart is Empty!',
        text: 'Please add items to your cart before checking out.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (!currentUser) {
      Swal.fire({
        title: 'Please Login',
        text: 'You need to login to complete your purchase.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    Swal.fire({
      title: 'Order Placed Successfully!',
      text: 'Thank you for your purchase.',
      icon: 'success',
      confirmButtonText: 'Continue Shopping'
    }).then(() => {
      setCart([]);
      setShowCart(false);
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleRegisterSuccess = (user) => {
    setCurrentUser(user);
  };
  const handleClearCart = () => {
    setCart([]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };


  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app-container">
        <Header
          cartCount={cartCount}
          wishlistCount={wishlist.length}
          filters={filters}
          setFilters={setFilters}
          onViewCart={() => setShowCart(!showCart)}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {showCart && (
          <Cart
            cart={cart}
            onRemoveFromCart={handleRemoveFromCart}
            onIncreaseQuantity={handleIncreaseQuantity}
            onDecreaseQuantity={handleDecreaseQuantity}
            onCheckout={handleCheckout}
            onClearCart={handleClearCart}
            onClose={() => setShowCart(false)}
            currentUser={currentUser}
          />
        )}

        <div className="content-wrapper">
          <Routes>
            <Route
              path="/"
              element={
                <LandingPage
                  products={Products}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={isWishlisted}
                  setFilters={setFilters}
                />
              }
            />
            <Route
              path="/shop"
              element={
                <Home
                  products={filteredProducts}
                  filters={filters}
                  setFilters={setFilters}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={isWishlisted}
                />
              }
            />
            <Route
              path="/wishlist"
              element={
                <Wishlist
                  wishlist={wishlist}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={isWishlisted}
                />
              }
            />
            <Route
              path="/login"
              element={<Login onLoginSuccess={handleLoginSuccess} />}
            />
            <Route
              path="/register"
              element={<Regester onRegisterSuccess={handleRegisterSuccess} />}
            />
            <Route
              path="/product/:id"
              element={
                <ProductDetails
                  products={Products}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={isWishlisted}
                />
              }
            />

          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

const Products = [
  // Electronics
  { id: 'bw1', name: 'Sony WH-1000XM6', price: 449.99, rating: 4.9, reviews: 120, category: 'Wireless', badge: 'NEW', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop', description: 'Industry-leading ANC with Bluetooth 6.0 support.' },
  { id: 'bw2', name: 'JBL Charge 6', price: 147.99, rating: 4.8, reviews: 850, category: 'Wireless', badge: 'HOT', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop', description: 'IP68 waterproof speaker with Auracast audio sharing.' },
  { id: 'bw3', name: 'Apple AirPods Pro 3', price: 249.00, rating: 5.0, reviews: 2100, category: 'Wireless', badge: 'BEST', image: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=800&h=800&fit=crop', description: 'Spatial audio with advanced head tracking.' },
  { id: 'bw4', name: 'Logitech MX Master 4', price: 119.00, rating: 4.9, reviews: 340, category: 'Wireless', image: 'https://images.unsplash.com/photo-1527866959252-deab2594dcd4?w=800&h=800&fit=crop', description: 'Precision wireless mouse for productivity.' },
  { id: 'bw5', name: 'Bose QuietComfort Ultra', price: 299.00, rating: 4.7, reviews: 560, category: 'Wireless', image: 'https://images.unsplash.com/photo-1546435770-a3e426cd47e7?w=800&h=800&fit=crop', description: 'World-class noise cancellation and comfort.' },
  { id: 'bw6', name: 'Sonos Era 100', price: 249.00, rating: 4.8, reviews: 410, category: 'Wireless', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=800&fit=crop', description: 'Next-gen smart speaker with stereo sound.' },
  { id: 'bw7', name: 'Razer Pro Click V2', price: 99.99, rating: 4.6, reviews: 180, category: 'Wireless', image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&h=800&fit=crop', description: 'Ergonomic wireless mouse with RGB lighting.' },
  { id: 'bw8', name: 'Samsung Galaxy Buds3 Pro', price: 250.00, rating: 4.7, reviews: 630, category: 'Wireless', image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&h=800&fit=crop', description: 'Seamless connectivity for Samsung devices.' },
  { id: 'bw9', name: 'Amazon Echo Dot Max', price: 99.99, rating: 4.5, reviews: 1200, category: 'Wireless', badge: 'SALE', image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&h=800&fit=crop', description: 'Feature-packed smart speaker with Alexa+.' },
  { id: 'bw10', name: 'Sennheiser Momentum 4', price: 300.00, rating: 4.9, reviews: 290, category: 'Wireless', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop', description: 'Audiophile-grade sound quality wirelessly.' },
  { id: 'bw11', name: 'TP-Link Tapo 4K Camera', price: 159.00, rating: 4.4, reviews: 310, category: 'Wireless', image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=800&h=800&fit=crop', description: 'Battery-powered exterior security camera.' },
  { id: 'bw12', name: 'SteelSeries Arctis Nova', price: 329.99, rating: 4.8, reviews: 150, category: 'Wireless', image: 'https://images.unsplash.com/photo-1583339734023-cca5fa57caae?w=800&h=800&fit=crop', description: 'Premium multi-system gaming headset.' },
  { id: 'bw13', name: 'Marshall Emberton II', price: 119.00, rating: 4.7, reviews: 740, category: 'Wireless', image: 'https://images.unsplash.com/photo-1545016803-a67d02373350?w=800&h=800&fit=crop', description: 'Iconic design with 30+ hours of playtime.' },
  { id: 'bw14', name: 'Nothing Ear Wireless', price: 149.00, rating: 4.6, reviews: 420, category: 'Wireless', image: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=800&h=800&fit=crop', description: 'Unique transparent design and powerful sound.' },
  { id: 'bw15', name: 'Anker Soundcore Boom 3i', price: 89.99, rating: 4.5, reviews: 510, category: 'Wireless', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop', description: 'Outdoor speaker that shakes off dust/debris.' },
  { id: 'bw16', name: 'Keychron K2 Wireless', price: 89.00, rating: 4.7, reviews: 900, category: 'Wireless', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop', description: 'Compact mechanical Bluetooth keyboard.' },
  { id: 'bw17', name: 'Tile Mate (2026)', price: 24.99, rating: 4.3, reviews: 3000, category: 'Wireless', image: 'https://images.unsplash.com/photo-1627916607164-fa952466085e?w=800&h=800&fit=crop', description: 'Reliable Bluetooth tracker for keys.' },
  { id: 'bw18', name: 'Beats Fit Pro', price: 199.00, rating: 4.6, reviews: 820, category: 'Wireless', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop', description: 'Secure-fit earbuds for extreme workouts.' },
  { id: 'bw19', name: 'Belkin 3-in-1 Charger', price: 149.00, rating: 4.8, reviews: 250, category: 'Wireless', image: 'https://images.unsplash.com/photo-1610945699380-60b6b27d14cb?w=800&h=800&fit=crop', description: 'Wireless charging station for Apple gear.' },
  { id: 'bw20', name: 'Creative Pebble Pro', price: 59.99, rating: 4.4, reviews: 680, category: 'Wireless', image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&h=800&fit=crop', description: 'Compact Bluetooth desktop speakers.' },

  { id: 'lp1', name: 'Apple MacBook Air 13 (M4)', price: 999.00, rating: 5, reviews: 1540, category: 'Laptops', badge: 'BEST', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&h=800&fit=crop', description: 'Powerful M4 chip with 18+ hours of battery life.' },
  { id: 'lp2', name: 'ASUS Zenbook S 16', price: 1399.00, rating: 4.8, reviews: 210, category: 'Laptops', badge: 'NEW', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop', description: 'Premium Ceraluminum build with Ryzen AI 9 processor.' },
  { id: 'lp3', name: 'Dell XPS 14 (2026)', price: 1699.00, rating: 4.7, reviews: 145, category: 'Laptops', image: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=800&h=800&fit=crop', description: 'Intel Core Ultra 3 chip with a gorgeous OLED display.' },
  { id: 'lp4', name: 'Lenovo ThinkPad X1 Carbon Gen 14', price: 1849.99, rating: 4.9, reviews: 320, category: 'Laptops', badge: 'Aura', image: 'https://images.unsplash.com/photo-1588872657578-139a626e79a2?w=800&h=800&fit=crop', description: 'Aura Edition with modular serviceability features.' },
  { id: 'lp5', name: 'Razer Blade 18 (RTX 5090)', price: 4499.00, rating: 5, reviews: 88, category: 'Laptops', badge: 'HOT', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop', description: 'Dual-mode 440Hz screen with NVIDIA RTX 5090.' },
  { id: 'lp6', name: 'ASUS ROG Zephyrus G16', price: 2629.99, rating: 4.8, reviews: 412, category: 'Laptops', image: 'https://images.unsplash.com/photo-1544117518-3baf3525d848?w=800&h=800&fit=crop', description: 'Ultra-thin gaming powerhouse with RTX 5080.' },
  { id: 'lp7', name: 'Microsoft Surface Laptop 13', price: 999.00, rating: 4.6, reviews: 530, category: 'Laptops', image: 'https://images.unsplash.com/photo-1515248026477-422453e6f89b?w=800&h=800&fit=crop', description: 'Sleek Copilot+ PC with Snapdragon X2 Elite.' },
  { id: 'lp8', name: 'MSI Katana 15 HX', price: 949.99, rating: 4.4, reviews: 750, category: 'Laptops', badge: 'SALE', image: 'https://images.unsplash.com/photo-1624632823022-b2f666a9a2ec?w=800&h=800&fit=crop', description: 'Best budget gaming laptop with RTX 5050.' },
  { id: 'lp9', name: 'HP OmniBook X', price: 1149.00, rating: 4.5, reviews: 190, category: 'Laptops', image: 'https://images.unsplash.com/photo-1531297461136-82lw9adf32764?w=800&h=800&fit=crop', description: 'Productivity focused with 21+ hours playback.' },
  { id: 'lp10', name: 'Gigabyte Aorus 16X', price: 1599.00, rating: 4.7, reviews: 240, category: 'Laptops', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop', description: 'High-refresh 1600p screen with RTX 4070.' },
  { id: 'lp11', name: 'Acer Aspire Go 15', price: 349.99, rating: 4.2, reviews: 1100, category: 'Laptops', badge: 'BUDGET', image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&h=800&fit=crop', description: 'Reliable everyday performance for students.' },
  { id: 'lp12', name: 'ASUS Zenbook DUO (2026)', price: 1999.00, rating: 4.9, reviews: 65, category: 'Laptops', badge: 'DUAL', image: 'https://images.unsplash.com/photo-1591768793355-74d04bb6608f?w=800&h=800&fit=crop', description: 'Dual 3K OLED screens for ultimate multitasking.' },
  { id: 'lp13', name: 'Lenovo Yoga Slim 9i', price: 1499.00, rating: 4.8, reviews: 280, category: 'Laptops', image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop', description: 'Gorgeous slim design with AI-enhanced ChromeOS.' },
  { id: 'lp14', name: 'Acer Predator Triton 14 AI', price: 1799.00, rating: 4.7, reviews: 140, category: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop', description: 'Lightweight AI gaming laptop with RTX 5070.' },
  { id: 'lp15', name: 'Samsung Galaxy Book 4 Pro', price: 1449.00, rating: 4.8, reviews: 310, category: 'Laptops', image: 'https://images.unsplash.com/photo-1531297461136-82lw9adf32764?w=800&h=800&fit=crop', description: '3K AMOLED display with seamless ecosystem.' },
  { id: 'lp16', name: 'Alienware 16X Aurora', price: 1699.00, rating: 4.6, reviews: 480, category: 'Laptops', badge: 'HOT', image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop', description: 'Midrange gaming beast with RTX 5060.' },
  { id: 'lp17', name: 'HP EliteBoard G1a', price: 1299.00, rating: 4.5, reviews: 75, category: 'Laptops', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=800&fit=crop', description: 'Unique keyboard-integrated PC with Ryzen AI 300.' },
  { id: 'lp18', name: 'ASUS ProArt PX13', price: 1899.00, rating: 4.9, reviews: 120, category: 'Laptops', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop', description: 'Powerful 13-inch creator 2-in-1 with 128GB RAM.' },
  { id: 'lp19', name: 'Dell XPS 16 (2026)', price: 2199.00, rating: 4.7, reviews: 155, category: 'Laptops', image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=800&fit=crop', description: 'Max performance with the Core Ultra 300 Series.' },
  { id: 'lp20', name: 'Microsoft Surface Pro 11', price: 999.99, rating: 4.8, reviews: 890, category: 'Laptops', badge: 'HYBRID', image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&h=800&fit=crop', description: 'Best-in-class Windows hybrid experience.' },

  { id: 'tb1', name: 'Apple iPad (11th Gen)', price: 449.00, rating: 4.9, reviews: 3400, category: 'Tablets', badge: 'BEST', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop', description: 'Versatile performance with the A16 Bionic chip.' },
  { id: 'tb2', name: 'Samsung Galaxy Tab S10 Ultra', price: 1199.99, rating: 4.8, reviews: 620, category: 'Tablets', badge: 'PREMIUM', image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&h=800&fit=crop', description: 'Massive 14.6-inch screen with Android 14.' },
  { id: 'tb3', name: 'OnePlus Pad 3', price: 699.00, rating: 4.7, reviews: 290, category: 'Tablets', badge: 'HOT', image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&h=800&fit=crop', description: 'Snapdragon 8 Elite chip with 144Hz display.' },
  { id: 'tb4', name: 'Apple iPad Pro M5', price: 1099.00, rating: 4.9, reviews: 450, category: 'Tablets', badge: 'NEW', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop', description: 'M5 chip monster with ultra-sharp ProMotion.' },
  { id: 'tb5', name: 'Google Pixel Tablet 2', price: 499.00, rating: 4.6, reviews: 820, category: 'Tablets', image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&h=800&fit=crop', description: 'Best Android tablet for home automation.' },
  { id: 'tb6', name: 'Microsoft Surface Pro 11', price: 999.00, rating: 4.8, reviews: 410, category: 'Tablets', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop', description: '11th-Gen Windows tablet for productivity.' },
  { id: 'tb7', name: 'Amazon Fire Max 11', price: 189.99, rating: 4.3, reviews: 1200, category: 'Tablets', badge: 'BUDGET', image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&h=800&fit=crop', description: 'Solid large-screen choice for a budget.' },
  { id: 'tb8', name: 'Redmi Pad Pro 5G', price: 299.99, rating: 4.5, reviews: 540, category: 'Tablets', image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&h=800&fit=crop', description: '12.1-inch 5G entertainment beast.' },
  { id: 'tb9', name: 'OnePlus Pad Go 2', price: 349.99, rating: 4.6, reviews: 310, category: 'Tablets', image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&h=800&fit=crop', description: 'Sharp 2.8K display with OxygenOS 16.' },
  { id: 'tb10', name: 'Lenovo Idea Tab Pro', price: 549.00, rating: 4.7, reviews: 215, category: 'Tablets', image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&h=800&fit=crop', description: 'Mid-range monster with 144Hz screen.' },
  { id: 'tb11', name: 'Apple iPad Air M3', price: 599.00, rating: 4.8, reviews: 940, category: 'Tablets', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop', description: 'Powerful M3 performance in a slim body.' },
  { id: 'tb12', name: 'Samsung Galaxy Tab S11', price: 799.00, rating: 4.7, reviews: 150, category: 'Tablets', badge: 'NEW', image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&h=800&fit=crop', description: 'Vibrant colors with IP68 water resistance.' },
  { id: 'tb13', name: 'Amazon Kindle Scribe 2', price: 339.99, rating: 4.9, reviews: 680, category: 'Tablets', image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&h=800&fit=crop', description: 'Best E Ink tablet for reading and notes.' },
  { id: 'tb14', name: 'Poco Pad 5G', price: 249.00, rating: 4.4, reviews: 320, category: 'Tablets', image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&h=800&fit=crop', description: 'Snapdragon 7s Gen 2 affordable gaming.' },
  { id: 'tb15', name: 'Lenovo Yoga Tab Plus', price: 649.00, rating: 4.8, reviews: 120, category: 'Tablets', image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&h=800&fit=crop', description: '512GB storage with 144Hz LCD.' },
  { id: 'tb16', name: 'Huawei MatePad 11.5', price: 399.00, rating: 4.5, reviews: 290, category: 'Tablets', image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&h=800&fit=crop', description: 'Productivity first with PaperMatte screen.' },
  { id: 'tb17', name: 'Xiaomi Pad 7', price: 449.99, rating: 4.7, reviews: 410, category: 'Tablets', image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&h=800&fit=crop', description: 'Turbo charging with 144Hz display.' },
  { id: 'tb18', name: 'Apple iPad Mini (7th Gen)', price: 499.00, rating: 4.9, reviews: 850, category: 'Tablets', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop', description: 'Compact powerhouse for reading and games.' },
  { id: 'tb19', name: 'Realme Pad 3', price: 219.00, rating: 4.3, reviews: 320, category: 'Tablets', image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&h=800&fit=crop', description: '11.6-inch display with 12,200mAh battery.' },
  { id: 'tb20', name: 'Onyx Boox Page', price: 249.99, rating: 4.6, reviews: 180, category: 'Tablets', image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&h=800&fit=crop', description: 'Best E Ink alternative for heavy readers.' },

  { id: 'sam1', name: 'Galaxy S24 Ultra', price: 1299.99, rating: 5, reviews: 850, category: 'Samsung', badge: 'HOT', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop', description: 'Flagship with 200MP camera and AI features.' },
  { id: 'sam2', name: 'Galaxy Z Fold 5', price: 1799.99, rating: 4.8, reviews: 320, category: 'Samsung', image: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=800&h=800&fit=crop', description: 'Large foldable display for multitasking.' },
  { id: 'sam3', name: 'Galaxy Tab S9 Ultra', price: 1199.00, rating: 4.9, reviews: 215, category: 'Samsung', image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&h=800&fit=crop', description: 'Massive 14.6 inch AMOLED tablet.' },
  { id: 'sam4', name: 'Galaxy Watch 6 Classic', price: 399.99, rating: 4.7, reviews: 540, category: 'Samsung', badge: 'NEW', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop', description: 'Smartwatch with rotating bezel.' },
  { id: 'sam5', name: 'Galaxy Buds2 Pro', price: 229.99, rating: 4.6, reviews: 1100, category: 'Samsung', image: 'https://images.unsplash.com/photo-1588156979435-379b9a802b0a?w=800&h=800&fit=crop', description: 'Hi-Fi sound with active noise cancellation.' },
  { id: 'sam6', name: 'Galaxy Book 4 Pro', price: 1449.00, rating: 4.8, reviews: 150, category: 'Samsung', image: 'https://images.unsplash.com/photo-1588872657578-139a626e79a2?w=800&h=800&fit=crop', description: 'Ultra-thin laptop with 3K AMOLED.' },
  { id: 'sam7', name: 'Galaxy S23 FE', price: 599.99, rating: 4.5, reviews: 430, category: 'Samsung', badge: 'SALE', image: 'https://images.unsplash.com/photo-1610945415295-d9b4951932b2?w=800&h=800&fit=crop', description: 'Premium features at a fan-friendly price.' },
  { id: 'sam8', name: 'Galaxy SmartTag 2', price: 29.99, rating: 4.4, reviews: 900, category: 'Samsung', image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&h=800&fit=crop', description: 'Bluetooth tracker for your essentials.' },
  { id: 'sam9', name: 'Galaxy A54 5G', price: 449.00, rating: 4.6, reviews: 620, category: 'Samsung', image: 'https://images.unsplash.com/photo-1610945722353-8334466542a1?w=800&h=800&fit=crop', description: 'Awesome 5G speed for everyone.' },
  { id: 'sam10', name: 'T7 Shield SSD 2TB', price: 159.99, rating: 4.9, reviews: 2100, category: 'Samsung', image: 'https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?w=800&h=800&fit=crop', description: 'Rugged external storage.' },
  { id: 'sam11', name: 'Galaxy Tab A9+', price: 219.00, rating: 4.4, reviews: 300, category: 'Samsung', image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=800&fit=crop', description: 'Budget-friendly family tablet.' },
  { id: 'sam12', name: 'Odyssey G7 Monitor', price: 699.99, rating: 4.8, reviews: 120, category: 'Samsung', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&h=800&fit=crop', description: 'Curved QLED gaming monitor.' },
  { id: 'sam13', name: 'Galaxy S24 Plus', price: 999.00, rating: 4.7, reviews: 400, category: 'Samsung', image: 'https://images.unsplash.com/photo-1610945719189-e2d5363fb754?w=800&h=800&fit=crop', description: 'Large screen flagship performance.' },
  { id: 'sam14', name: 'Galaxy Watch 6 Pro', price: 449.00, rating: 4.6, reviews: 180, category: 'Samsung', image: 'https://images.unsplash.com/photo-1544117518-3baf3525d848?w=800&h=800&fit=crop', description: 'Durable outdoor fitness watch.' },
  { id: 'sam15', name: 'Wireless Charger Duo', price: 59.99, rating: 4.5, reviews: 1100, category: 'Samsung', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=800&fit=crop', description: 'Charge phone and watch together.' },
  { id: 'sam16', name: 'Galaxy Buds FE', price: 99.00, rating: 4.3, reviews: 500, category: 'Samsung', image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&h=800&fit=crop', description: 'Entry-level noise cancelling buds.' },
  { id: 'sam17', name: 'Galaxy Book 4 Ultra', price: 2399.00, rating: 4.9, reviews: 85, category: 'Samsung', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&h=800&fit=crop', description: 'Workstation power in a laptop.' },
  { id: 'sam18', name: '45W Fast Charger', price: 35.00, rating: 4.8, reviews: 2000, category: 'Samsung', image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&h=800&fit=crop', description: 'Super fast charging 2.0.' },
  { id: 'sam19', name: 'Galaxy Z Flip 5', price: 999.00, rating: 4.7, reviews: 600, category: 'Samsung', image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=800&fit=crop', description: 'Compact and stylish foldable.' },
  { id: 'sam20', name: 'Bespoke Jet Vacuum', price: 899.00, rating: 4.8, reviews: 200, category: 'Samsung', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=800&fit=crop', description: 'Cordless stick vacuum with clean station.' },

  { id: 'app1', name: 'iPhone 15 Pro Max', price: 1199.00, rating: 5, reviews: 1200, category: 'Apple', badge: 'HOT', image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&h=800&fit=crop', description: 'Titanium design with A17 Pro chip.' },
  { id: 'app2', name: 'MacBook Air M3', price: 1099.00, rating: 4.9, reviews: 450, category: 'Apple', badge: 'NEW', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&h=800&fit=crop', description: 'Thinnest, lightest Apple laptop.' },
  { id: 'app3', name: 'iPad Pro M2', price: 799.00, rating: 4.8, reviews: 680, category: 'Apple', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop', description: 'Ultimate iPad with Liquid Retina XDR.' },
  { id: 'app4', name: 'Apple Watch Ultra 2', price: 799.00, rating: 4.9, reviews: 310, category: 'Apple', image: 'https://images.unsplash.com/photo-1434493907317-a46b5bc78344?w=800&h=800&fit=crop', description: 'Rugged watch for elite athletes.' },
  { id: 'app5', name: 'AirPods Max', price: 549.00, rating: 4.7, reviews: 890, category: 'Apple', image: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=800&h=800&fit=crop', description: 'High-fidelity over-ear audio.' },
  { id: 'app6', name: 'iPhone 15', price: 799.00, rating: 4.7, reviews: 900, category: 'Apple', image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=800&fit=crop', description: 'Dynamic Island and 48MP camera.' },
  { id: 'app7', name: 'Apple TV 4K', price: 129.00, rating: 4.8, reviews: 520, category: 'Apple', image: 'https://images.unsplash.com/photo-1585732154382-7233267d36a9?w=800&h=800&fit=crop', description: 'Cinematic home theater experience.' },
  { id: 'app8', name: 'MacBook Pro 14"', price: 1599.00, rating: 4.9, reviews: 300, category: 'Apple', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&h=800&fit=crop', description: 'M3 Pro chip for creative pros.' },
  { id: 'app9', name: 'iPad Air 5', price: 599.00, rating: 4.7, reviews: 450, category: 'Apple', image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&h=800&fit=crop', description: 'Colorful tablet with M1 chip.' },
  { id: 'app10', name: 'Apple Pencil Gen 2', price: 129.00, rating: 4.8, reviews: 1500, category: 'Apple', image: 'https://images.unsplash.com/photo-1515248026477-422453e6f89b?w=800&h=800&fit=crop', description: 'Pixel-perfect precision for iPad.' },
  { id: 'app11', name: 'AirPods Pro 2', price: 249.00, rating: 4.9, reviews: 2000, category: 'Apple', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop', description: 'Active noise cancellation with USB-C.' },
  { id: 'app12', name: 'HomePod Gen 2', price: 299.00, rating: 4.6, reviews: 400, category: 'Apple', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=800&fit=crop', description: 'Immersive, high-fidelity room sound.' },
  { id: 'app13', name: 'Mac Mini M2', price: 599.00, rating: 4.8, reviews: 350, category: 'Apple', image: 'https://images.unsplash.com/photo-1544099858-75feeb57f0ce?w=800&h=800&fit=crop', description: 'The most versatile desktop.' },
  { id: 'app14', name: 'Magic Mouse', price: 79.00, rating: 4.1, reviews: 800, category: 'Apple', image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&h=800&fit=crop', description: 'Wireless and rechargeable mouse.' },
  { id: 'app15', name: 'Studio Display', price: 1599.00, rating: 4.7, reviews: 180, category: 'Apple', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&h=800&fit=crop', description: '27-inch 5K Retina display.' },
  { id: 'app16', name: 'Magic Keyboard', price: 99.00, rating: 4.6, reviews: 600, category: 'Apple', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&h=800&fit=crop', description: 'Comfortable and precise typing.' },
  { id: 'app17', name: 'MagSafe Battery Pack', price: 99.00, rating: 4.3, reviews: 400, category: 'Apple', image: 'https://images.unsplash.com/photo-1610945699380-60b6b27d14cb?w=800&h=800&fit=crop', description: 'On-the-go magnetic charging.' },
  { id: 'app18', name: 'iMac 24-inch M3', price: 1299.00, rating: 4.9, reviews: 200, category: 'Apple', image: 'https://images.unsplash.com/photo-1517331156700-3c2418bdb48d?w=800&h=800&fit=crop', description: 'The ultimate all-in-one desktop.' },
  { id: 'app19', name: 'AirTag 4-Pack', price: 99.00, rating: 4.9, reviews: 3000, category: 'Apple', image: 'https://images.unsplash.com/photo-1627916607164-fa952466085e?w=800&h=800&fit=crop', description: 'Keep track of all your items.' },
  { id: 'app20', name: 'Apple Watch Series 9', price: 399.00, rating: 4.8, reviews: 750, category: 'Apple', image: 'https://images.unsplash.com/photo-1434493907317-a46b5bc78344?w=800&h=800&fit=crop', description: 'The most advanced health tracking.' },

  { id: 'one1', name: 'OnePlus 12', price: 799.99, rating: 4.8, reviews: 420, category: 'OnePlus', badge: 'HOT', image: 'https://images.unsplash.com/photo-1610945699380-60b6b27d14cb?w=800&h=800&fit=crop', description: 'Smooth Beyond Belief flagship.' },
  { id: 'one2', name: 'OnePlus Open', price: 1499.00, rating: 4.9, reviews: 180, category: 'OnePlus', badge: 'NEW', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop', description: 'The first OnePlus foldable phone.' },
  { id: 'one3', name: 'OnePlus Pad', price: 479.00, rating: 4.7, reviews: 290, category: 'OnePlus', image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&h=800&fit=crop', description: 'Fast and smooth 144Hz tablet.' },
  { id: 'one4', name: 'OnePlus Buds Pro 2', price: 179.99, rating: 4.6, reviews: 600, category: 'OnePlus', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop', description: 'Audiophile-grade noise cancellation.' },
  { id: 'one5', name: 'OnePlus Nord 3 5G', price: 429.00, rating: 4.5, reviews: 850, category: 'OnePlus', badge: 'SALE', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff23?w=800&h=800&fit=crop', description: 'Everything you need in a mid-range.' },
  { id: 'one6', name: 'OnePlus Watch 2', price: 299.99, rating: 4.4, reviews: 150, category: 'OnePlus', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop', description: 'Wear OS with dual-engine architecture.' },
  { id: 'one7', name: '100W SuperVOOC Charger', price: 49.00, rating: 4.9, reviews: 1200, category: 'OnePlus', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=800&fit=crop', description: 'Ultra-fast charging for your device.' },
  { id: 'one8', name: 'Keyboard 81 Pro', price: 219.00, rating: 4.8, reviews: 90, category: 'OnePlus', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop', description: 'Mechanical keyboard with custom switches.' },
  { id: 'one9', name: 'Sandstone Bumper Case', price: 25.00, rating: 4.7, reviews: 2000, category: 'OnePlus', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop', description: 'Iconic textured protective case.' },
  { id: 'one10', name: 'Nord Buds 2', price: 59.99, rating: 4.5, reviews: 1400, category: 'OnePlus', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop', description: 'Bass-heavy wireless earbuds.' },
  { id: 'one11', name: 'OnePlus 12R', price: 499.00, rating: 4.7, reviews: 320, category: 'OnePlus', image: 'https://images.unsplash.com/photo-1610945722353-8334466542a1?w=800&h=800&fit=crop', description: 'Performance meet value flagship.' },
  { id: 'one12', name: 'Bullets Wireless Z2', price: 39.00, rating: 4.4, reviews: 4000, category: 'OnePlus', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop', description: '20 hours of music in 10 minutes.' },
  { id: 'one13', name: 'OnePlus TV 55 U1S', price: 649.00, rating: 4.6, reviews: 210, category: 'OnePlus', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop', description: 'Cinematic 4K bezel-less display.' },
  { id: 'one14', name: '80W Car Charger', price: 39.00, rating: 4.5, reviews: 500, category: 'OnePlus', image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&h=800&fit=crop', description: 'Charge while you drive at high speed.' },
  { id: 'one15', name: 'Karbon Bumper Case', price: 35.00, rating: 4.8, reviews: 600, category: 'OnePlus', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop', description: 'Kevlar-reinforced strong case.' },
  { id: 'one16', name: 'OnePlus Buds Z2', price: 79.00, rating: 4.4, reviews: 1100, category: 'OnePlus', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop', description: '40dB active noise cancellation.' },
  { id: 'one17', name: 'Nord CE 4 5G', price: 299.00, rating: 4.3, reviews: 400, category: 'OnePlus', image: 'https://images.unsplash.com/photo-1598327105854-c8c3c1e2f3d6?w=800&h=800&fit=crop', description: 'Powerful mid-range 5G phone.' },
  { id: 'one18', name: 'Type-C to 3.5mm Adapter', price: 12.00, rating: 4.5, reviews: 2000, category: 'OnePlus', image: 'https://images.unsplash.com/photo-1591461141916-578f89921abc?w=800&h=800&fit=crop', description: 'High-fidelity audio conversion.' },
  { id: 'one19', name: 'OnePlus Nord Watch', price: 69.00, rating: 4.1, reviews: 150, category: 'OnePlus', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop', description: 'Elegant AMOLED fitness tracker.' },
  { id: 'one20', name: 'OnePlus Power Bank', price: 45.00, rating: 4.7, reviews: 900, category: 'OnePlus', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=800&fit=crop', description: '10000mAh with fast charging.' },

  { id: 'iq1', name: 'iQOO 12 Pro', price: 849.00, rating: 4.9, reviews: 210, category: 'iQOO', badge: 'HOT', image: 'https://images.unsplash.com/photo-1597762470488-3877b1f538c6?w=800&h=800&fit=crop', description: 'Ultimate gaming performance flagship.' },
  { id: 'iq2', name: 'iQOO Neo 9 Pro', price: 499.00, rating: 4.7, reviews: 540, category: 'iQOO', badge: 'NEW', image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&h=800&fit=crop', description: 'Dual-chip flagship for gamers.' },
  { id: 'iq3', name: 'iQOO Z9 5G', price: 249.00, rating: 4.6, reviews: 820, category: 'iQOO', badge: 'SALE', image: 'https://images.unsplash.com/photo-1598327105854-c8c3c1e2f3d6?w=800&h=800&fit=crop', description: 'Performance meet style in mid-range.' },
  { id: 'iq4', name: 'Cooling Back Clip Pro', price: 35.00, rating: 4.8, reviews: 300, category: 'iQOO', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=800&fit=crop', description: 'Instant cooling for intense gaming.' },
  { id: 'iq5', name: 'iQOO TWS Earbuds', price: 69.00, rating: 4.5, reviews: 450, category: 'iQOO', image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&h=800&fit=crop', description: 'Low latency audio for gamers.' },
  { id: 'iq6', name: '120W Flash Charge', price: 45.00, rating: 4.9, reviews: 900, category: 'iQOO', image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&h=800&fit=crop', description: 'Recharge your phone in minutes.' },
  { id: 'iq7', name: 'iQOO Gamepad', price: 79.00, rating: 4.7, reviews: 150, category: 'iQOO', image: 'https://images.unsplash.com/photo-1600080972464-8e5f35802d1e?w=800&h=800&fit=crop', description: 'Physical controls for mobile games.' },
  { id: 'iq8', name: 'Tempered Glass Protector', price: 15.00, rating: 4.4, reviews: 1200, category: 'iQOO', image: 'https://images.unsplash.com/photo-1588702547919-26089e690eca?w=800&h=800&fit=crop', description: 'Ultra-clear high-strength glass.' },
  { id: 'iq9', name: 'iQOO Z7 Pro', price: 319.00, rating: 4.6, reviews: 740, category: 'iQOO', image: 'https://images.unsplash.com/photo-1598327104033-0c48e8984929?w=800&h=800&fit=crop', description: 'Curved display performance king.' },
  { id: 'iq10', name: 'Armor Protection Case', price: 20.00, rating: 4.7, reviews: 600, category: 'iQOO', image: 'https://images.unsplash.com/photo-1541140134513-85a161dc4a00?w=800&h=800&fit=crop', description: 'Rugged protection for iQOO phones.' },
  { id: 'iq11', name: 'iQOO 11 5G', price: 699.00, rating: 4.8, reviews: 300, category: 'iQOO', image: 'https://images.unsplash.com/photo-1597762470488-3877b1f538c6?w=800&h=800&fit=crop', description: 'Snapdragon 8 Gen 2 powerhouse.' },
  { id: 'iq12', name: 'iQOO Wireless Buds Z', price: 49.00, rating: 4.4, reviews: 800, category: 'iQOO', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop', description: 'Great sound at an entry level.' },
  { id: 'iq13', name: 'iQOO Neo 7', price: 399.00, rating: 4.6, reviews: 500, category: 'iQOO', image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&h=800&fit=crop', description: 'Affordable gaming flagship.' },
  { id: 'iq14', name: 'iQOO Power Bank 20K', price: 55.00, rating: 4.7, reviews: 600, category: 'iQOO', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=800&fit=crop', description: 'High capacity for long gaming.' },
  { id: 'iq15', name: 'Liquid Silicone Case', price: 15.00, rating: 4.5, reviews: 1000, category: 'iQOO', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop', description: 'Soft touch and protective.' },
  { id: 'iq16', name: 'iQOO 9 SE', price: 349.00, rating: 4.5, reviews: 400, category: 'iQOO', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff23?w=800&h=800&fit=crop', description: 'Balanced performance for daily use.' },
  { id: 'iq17', name: 'Bluetooth Game Controller', price: 59.00, rating: 4.6, reviews: 200, category: 'iQOO', image: 'https://images.unsplash.com/photo-1600080972464-8e5f35802d1e?w=800&h=800&fit=crop', description: 'Precision joysticks for mobile.' },
  { id: 'iq18', name: 'Type-C Fast Charge Cable', price: 10.00, rating: 4.8, reviews: 3000, category: 'iQOO', image: 'https://images.unsplash.com/photo-1591461141916-578f89921abc?w=800&h=800&fit=crop', description: 'Durable and high speed.' },
  { id: 'iq19', name: 'iQOO Neo 7 Pro', price: 449.00, rating: 4.7, reviews: 620, category: 'iQOO', image: 'https://images.unsplash.com/photo-1597525206380-48b965fc1869?w=800&h=800&fit=crop', description: 'The performance enthusiast choice.' },
  { id: 'iq20', name: 'Rugged Bumper Case', price: 18.00, rating: 4.6, reviews: 500, category: 'iQOO', image: 'https://images.unsplash.com/photo-1541140134513-85a161dc4a00?w=800&h=800&fit=crop', description: 'Extra drop protection.' },

  { id: 'e1', name: 'Gaming Laptop Pro', price: 1299.99, rating: 4.5, reviews: 248, category: 'Electronics', badge: 'SALE', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop', description: 'High-performance gaming laptop with RTX 4090.' },
  { id: 'e2', name: 'Smartphone 5G Ultra', price: 799.99, rating: 5, reviews: 562, category: 'Electronics', badge: 'HOT', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop', description: 'Latest 5G smartphone with advanced camera.' },
  { id: 'e3', name: 'Wireless Headphones Pro', price: 249.99, rating: 4, reviews: 189, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop', description: 'Premium noise-cancelling wireless headphones.' },
  { id: 'e4', name: 'Smart Watch Series X', price: 399.99, rating: 4.5, reviews: 421, category: 'Electronics', badge: 'NEW', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop', description: 'Advanced fitness tracking smartwatch.' },
  { id: 'e5', name: '4K Ultra HD TV', price: 1099.99, rating: 4.7, reviews: 130, category: 'Electronics', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop', description: '65-inch 4K smart TV with HDR.' },
  { id: 'e6', name: 'Bluetooth Speaker', price: 79.99, rating: 4.3, reviews: 89, category: 'Electronics', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop', description: 'Portable waterproof Bluetooth speaker.' },
  { id: 'e7', name: 'DSLR Camera', price: 599.99, rating: 4.6, reviews: 200, category: 'Electronics', badge: 'SALE', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop', description: 'Professional DSLR camera 24.2MP.' },
  { id: 'e8', name: 'Portable Charger', price: 39.99, rating: 4.4, reviews: 150, category: 'Electronics', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=800&fit=crop', description: '20000mAh portable power bank.' },
  { id: 'e9', name: 'Gaming Mouse', price: 59.99, rating: 4.5, reviews: 220, category: 'Electronics', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=800&fit=crop', description: 'RGB gaming mouse 16000 DPI.' },
  { id: 'e10', name: 'Wireless Keyboard', price: 89.99, rating: 4.1, reviews: 95, category: 'Electronics', image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop', description: 'Mechanical wireless keyboard.' },
  { id: 'e11', name: 'VR Headset', price: 499.99, rating: 4.8, reviews: 300, category: 'Electronics', badge: 'HOT', image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&h=800&fit=crop', description: 'Next-gen VR headset 4K.' },
  { id: 'e12', name: 'MacBook Pro', price: 1999.99, rating: 4.9, reviews: 620, category: 'Electronics', badge: 'HOT', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&h=800&fit=crop', description: 'Professional laptop for work.' },
  { id: 'e13', name: 'iPad Mini', price: 499.99, rating: 4.9, reviews: 580, category: 'Electronics', badge: 'NEW', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop', description: 'Compact tablet for notes.' },
  { id: 'e14', name: 'Action Camera', price: 199.99, rating: 4.5, reviews: 110, category: 'Electronics', image: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=800&h=800&fit=crop', description: '4K action camera with stabilization.' },
  { id: 'e15', name: 'Drone with 4K Camera', price: 399.99, rating: 4.6, reviews: 145, category: 'Electronics', badge: 'NEW', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=800&fit=crop', description: '4K drone, 30-min flight time.' },
  { id: 'e16', name: '4K Monitor', price: 399.99, rating: 4.5, reviews: 160, category: 'Electronics', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&h=800&fit=crop', description: '27-inch 4K UHD monitor.' },
  { id: 'e17', name: 'iPhone 13 Pro', price: 1099.99, rating: 4.9, reviews: 780, category: 'Electronics', badge: 'HOT', image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&h=800&fit=crop', description: 'Latest flagship smartphone.' },
  { id: 'e18', name: 'USB-C Hub', price: 49.99, rating: 4.1, reviews: 70, category: 'Electronics', image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&h=800&fit=crop', description: '7-in-1 multiport adapter.' },
  { id: 'e19', name: 'E-Reader', price: 129.99, rating: 4.4, reviews: 200, category: 'Electronics', image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&h=800&fit=crop', description: 'E-ink display 32GB storage.' },
  { id: 'e20', name: 'Smart Home Hub', price: 149.99, rating: 4.0, reviews: 75, category: 'Electronics', image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=800&h=800&fit=crop', description: 'Central home control system.' },


  // Fashion

  { id: 'f1', name: 'Leather Jacket', price: 349.99, rating: 5, reviews: 324, category: 'Fashion', badge: 'SALE', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop', description: 'Genuine Italian leather jacket.' },
  { id: 'f2', name: 'Running Shoes', price: 159.99, rating: 4.5, reviews: 456, category: 'Fashion', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop', description: 'Performance gel cushioning.' },
  { id: 'f3', name: 'Evening Gown', price: 199.99, rating: 5, reviews: 289, category: 'Fashion', badge: 'HOT', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&h=800&fit=crop', description: 'Elegant silk evening gown.' },
  { id: 'f4', name: 'Formal 3-Piece Suit', price: 449.99, rating: 4.5, reviews: 387, category: 'Fashion', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=800&fit=crop', description: 'Classic business formal suit.' },
  { id: 'f5', name: 'Denim Jacket', price: 89.99, rating: 4, reviews: 150, category: 'Fashion', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&h=800&fit=crop', description: 'Distressed classic denim.' },
  { id: 'f6', name: 'Slim Fit Chinos', price: 69.99, rating: 4.2, reviews: 220, category: 'Fashion', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=800&fit=crop', description: 'Modern cotton chinos.' },
  { id: 'f7', name: 'Oxford Shoes', price: 129.99, rating: 4.6, reviews: 180, category: 'Fashion', image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&h=800&fit=crop', description: 'Premium leather oxfords.' },
  { id: 'f8', name: 'Wool Overcoat', price: 199.99, rating: 4.8, reviews: 190, category: 'Fashion', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&h=800&fit=crop', description: 'Luxurious winter overcoat.' },
  { id: 'f9', name: 'Casual Sneakers', price: 79.99, rating: 4.4, reviews: 240, category: 'Fashion', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop', description: 'Everyday comfort sneakers.' },
  { id: 'f10', name: 'Linen Shirt', price: 49.99, rating: 4.3, reviews: 130, category: 'Fashion', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=800&fit=crop', description: 'Breathable summer linen.' },
  { id: 'f11', name: 'Silk Scarf', price: 39.99, rating: 4.7, reviews: 100, category: 'Fashion', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&h=800&fit=crop', description: 'Hand-printed silk scarf.' },
  { id: 'f12', name: 'Maxi Floral Dress', price: 89.99, rating: 4.9, reviews: 290, category: 'Fashion', badge: 'NEW', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=800&fit=crop', description: 'Elegant summer maxi dress.' },
  { id: 'f13', name: 'Polo T-Shirt', price: 29.99, rating: 4.2, reviews: 110, category: 'Fashion', image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&h=800&fit=crop', description: 'Premium cotton polo.' },
  { id: 'f14', name: 'Yoga Leggings', price: 59.99, rating: 4.5, reviews: 140, category: 'Fashion', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&h=800&fit=crop', description: 'High-waist stretch fabric.' },
  { id: 'f15', name: 'Turtleneck Sweater', price: 69.99, rating: 4.6, reviews: 135, category: 'Fashion', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=800&fit=crop', description: 'Cozy wool turtleneck.' },
  { id: 'f16', name: 'Leather Boots', price: 159.99, rating: 4.4, reviews: 200, category: 'Fashion', image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&h=800&fit=crop', description: 'Durable leather ankle boots.' },
  { id: 'f17', name: 'Bomber Jacket', price: 119.99, rating: 4.3, reviews: 170, category: 'Fashion', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=800&fit=crop', description: 'Urban style bomber jacket.' },
  { id: 'f18', name: 'Graphic Hoodie', price: 79.99, rating: 4.5, reviews: 210, category: 'Fashion', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=800&fit=crop', description: 'Heavyweight graphic hoodie.' },
  { id: 'f19', name: 'Cashmere Cardigan', price: 129.99, rating: 4.8, reviews: 95, category: 'Fashion', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=800&fit=crop', description: 'Ultra-soft pure cashmere.' },
  { id: 'f20', name: 'Summer Fedora', price: 34.99, rating: 4.1, reviews: 50, category: 'Fashion', image: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=800&h=800&fit=crop', description: 'Stylish straw fedora.' },

  { id: 'm1', name: 'Premium Cotton Tee', price: 29.99, rating: 4.8, reviews: 120, category: 'Men', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop', description: 'Breathable organic cotton t-shirt.' },
  { id: 'm2', name: 'Slim Fit Denim', price: 59.99, rating: 4.5, reviews: 85, category: 'Men', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop', description: 'Classic blue slim-fit jeans.' },
  { id: 'm3', name: 'Casual Linen Shirt', price: 45.00, rating: 4.6, reviews: 60, category: 'Men', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=800&fit=crop', description: 'Perfect for summer outings.' },
  { id: 'm4', name: 'Leather Chelsea Boots', price: 120.00, rating: 4.9, reviews: 210, category: 'Men', badge: 'HOT', image: 'https://images.unsplash.com/photo-1635397174426-ca110909622d?w=800&h=800&fit=crop', description: 'Genuine leather ankle boots.' },
  { id: 'm5', name: 'Quilted Puffer Jacket', price: 89.99, rating: 4.7, reviews: 140, category: 'Men', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=800&fit=crop', description: 'Lightweight and warm for winter.' },
  { id: 'm6', name: 'Chino Shorts', price: 34.99, rating: 4.4, reviews: 50, category: 'Men', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&h=800&fit=crop', description: 'Tailored fit summer shorts.' },
  { id: 'm7', name: 'Athletic Joggers', price: 39.99, rating: 4.5, reviews: 95, category: 'Men', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&h=800&fit=crop', description: 'Comfortable fleece joggers.' },
  { id: 'm8', name: 'Formal Oxford Shirt', price: 49.99, rating: 4.8, reviews: 110, category: 'Men', image: 'https://images.unsplash.com/photo-1620012253585-456c7bc7a9ad?w=800&h=800&fit=crop', description: 'Crisp white office shirt.' },
  { id: 'm9', name: 'V-Neck Cashmere', price: 110.00, rating: 4.9, reviews: 40, category: 'Men', image: 'https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?w=800&h=800&fit=crop', description: 'Ultra-soft cashmere sweater.' },
  { id: 'm10', name: 'Performance Windbreaker', price: 65.00, rating: 4.6, reviews: 75, category: 'Men', image: 'https://images.unsplash.com/photo-1544923246-77307dd654ca?w=800&h=800&fit=crop', description: 'Water-resistant outdoor jacket.' },
  { id: 'm11', name: 'Classic Polo', price: 25.00, rating: 4.3, reviews: 150, category: 'Men', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&h=800&fit=crop', description: 'Pique knit short sleeve polo.' },
  { id: 'm12', name: 'Corduroy Trousers', price: 69.00, rating: 4.5, reviews: 30, category: 'Men', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=800&fit=crop', description: 'Vintage style cord pants.' },
  { id: 'm13', name: 'Canvas Sneakers', price: 49.99, rating: 4.4, reviews: 300, category: 'Men', image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=800&fit=crop', description: 'Simple low-top canvas shoes.' },
  { id: 'm14', name: 'Cargo Pants', price: 54.99, rating: 4.6, reviews: 88, category: 'Men', image: 'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=800&h=800&fit=crop', description: 'Multi-pocket utility trousers.' },
  { id: 'm15', name: 'Wool Blend Blazer', price: 150.00, rating: 4.8, reviews: 55, category: 'Men', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=800&fit=crop', description: 'Tailored fit smart blazer.' },
  { id: 'm16', name: 'Striped Tank Top', price: 19.99, rating: 4.2, reviews: 45, category: 'Men', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&h=800&fit=crop', description: 'Cotton jersey summer tank.' },
  { id: 'm17', name: 'Leather Belt', price: 35.00, rating: 4.7, reviews: 180, category: 'Men', image: 'https://images.unsplash.com/photo-1624222247344-550fb8ec5522?w=800&h=800&fit=crop', description: 'Full grain leather accessory.' },
  { id: 'm18', name: 'Winter Parka', price: 199.00, rating: 4.9, reviews: 120, category: 'Men', badge: 'NEW', image: 'https://images.unsplash.com/photo-1545594861-3bef43ff2fc3?w=800&h=800&fit=crop', description: 'Heavy duty cold weather parka.' },
  { id: 'm19', name: 'Graphic Tee', price: 24.99, rating: 4.5, reviews: 200, category: 'Men', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=800&fit=crop', description: 'Urban print streetwear tee.' },
  { id: 'm20', name: 'Slip-on Loafers', price: 79.99, rating: 4.6, reviews: 65, category: 'Men', image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&h=800&fit=crop', description: 'Suede casual loafers.' },

  { id: 'w1', name: 'Floral Summer Dress', price: 49.99, rating: 4.8, reviews: 340, category: 'Women', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=800&fit=crop', description: 'Lightweight floral print.' },
  { id: 'w2', name: 'High-Waist Jeans', price: 65.00, rating: 4.6, reviews: 220, category: 'Women', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=800&fit=crop', description: 'Vintage wash skinny jeans.' },
  { id: 'w3', name: 'Leather Crossbody Bag', price: 120.00, rating: 4.9, reviews: 150, category: 'Women', badge: 'SALE', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop', description: 'Compact everyday carry bag.' },
  { id: 'w4', name: 'Silk Blouse', price: 75.00, rating: 4.7, reviews: 90, category: 'Women', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=800&fit=crop', description: '100% pure silk office wear.' },
  { id: 'w5', name: 'Knitted Cardigan', price: 45.00, rating: 4.4, reviews: 110, category: 'Women', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=800&fit=crop', description: 'Soft oversized knitwear.' },
  { id: 'w6', name: 'Suede Pointed Heels', price: 89.99, rating: 4.5, reviews: 75, category: 'Women', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop', description: 'Classic 4-inch stilettos.' },
  { id: 'w7', name: 'Denim Mini Skirt', price: 35.00, rating: 4.3, reviews: 50, category: 'Women', image: 'https://images.unsplash.com/photo-1582142306909-195724d33ffc?w=800&h=800&fit=crop', description: 'Distressed edge denim skirt.' },
  { id: 'w8', name: 'Evening Clutch', price: 55.00, rating: 4.8, reviews: 40, category: 'Women', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&h=800&fit=crop', description: 'Satin finish with gold strap.' },
  { id: 'w9', name: 'Active Leggings', price: 39.99, rating: 4.7, reviews: 400, category: 'Women', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&h=800&fit=crop', description: 'High-performance gym wear.' },
  { id: 'w10', name: 'Wool Overcoat', price: 180.00, rating: 4.9, reviews: 130, category: 'Women', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&h=800&fit=crop', description: 'Elegant tailored winter coat.' },
  { id: 'w11', name: 'Boho Maxi Skirt', price: 42.00, rating: 4.5, reviews: 65, category: 'Women', image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&h=800&fit=crop', description: 'Flowy bohemian style.' },
  { id: 'w12', name: 'Lace Cocktail Dress', price: 110.00, rating: 4.8, reviews: 88, category: 'Women', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&h=800&fit=crop', description: 'Intricate lace detailing.' },
  { id: 'w13', name: 'Straw Sun Hat', price: 29.99, rating: 4.2, reviews: 30, category: 'Women', image: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=800&h=800&fit=crop', description: 'Wide brim beach accessory.' },
  { id: 'w14', name: 'Ankle Strap Sandals', price: 49.00, rating: 4.6, reviews: 120, category: 'Women', image: 'https://images.unsplash.com/photo-1562273066-91d74b29d661?w=800&h=800&fit=crop', description: 'Vegan leather comfort sandals.' },
  { id: 'w15', name: 'Leather Tote Bag', price: 199.00, rating: 4.9, reviews: 250, category: 'Women', badge: 'HOT', image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&h=800&fit=crop', description: 'Spacious professional tote.' },
  { id: 'w16', name: 'Turtleneck Bodysuit', price: 28.00, rating: 4.4, reviews: 55, category: 'Women', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=800&fit=crop', description: 'Seamless ribbed knit.' },
  { id: 'w17', name: 'Velvet Blazer', price: 95.00, rating: 4.7, reviews: 45, category: 'Women', image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&h=800&fit=crop', description: 'Rich velvet evening wear.' },
  { id: 'w18', name: 'Pleated Midi Skirt', price: 52.00, rating: 4.5, reviews: 70, category: 'Women', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=800&fit=crop', description: 'Metallic finish pleats.' },
  { id: 'w19', name: 'Quilted Handbag', price: 79.99, rating: 4.6, reviews: 110, category: 'Women', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop', description: 'Classic quilted chain bag.' },
  { id: 'w20', name: 'Linen Trousers', price: 60.00, rating: 4.3, reviews: 40, category: 'Women', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop', description: 'Wide leg breathable linen.' },

  // Accessories
  { id: 'a1', name: 'Pearl Earrings', price: 499.99, rating: 4.8, reviews: 300, category: 'Accessories', badge: 'LUXURY', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop', description: 'Authentic freshwater pearls.' },
  { id: 'a2', name: 'Gold Chain', price: 999.99, rating: 4.7, reviews: 280, category: 'Accessories', badge: 'HOT', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop', description: '18K solid gold chain.' },
  { id: 'a3', name: 'Leather Watch Strap', price: 199.99, rating: 4.5, reviews: 112, category: 'Accessories', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop', description: 'Italian leather strap.' },
  { id: 'a4', name: 'Crystal Cufflinks', price: 299.99, rating: 4.3, reviews: 140, category: 'Accessories', badge: 'NEW', image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&h=800&fit=crop', description: 'Hand-cut crystal cufflinks.' },
  { id: 'a5', name: 'Leather Gloves', price: 89.99, rating: 4.2, reviews: 210, category: 'Accessories', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&h=800&fit=crop', description: 'Soft sheepskin gloves.' },
  { id: 'a6', name: 'Silver Pendant', price: 199.99, rating: 4.6, reviews: 85, category: 'Accessories', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop', description: 'Sterling silver minimalist pendant.' },
  { id: 'a7', name: 'Designer Hat', price: 249.99, rating: 4.1, reviews: 75, category: 'Accessories', image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&h=800&fit=crop', description: 'Wide brim luxury hat.' },
  { id: 'a8', name: 'Vintage Brooch', price: 149.99, rating: 4.4, reviews: 130, category: 'Accessories', image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&h=800&fit=crop', description: 'Art deco style brooch.' },
  { id: 'a9', name: 'Luxury Keychain', price: 49.99, rating: 4.0, reviews: 60, category: 'Accessories', image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&h=800&fit=crop', description: 'Braided leather keychain.' },
  { id: 'a10', name: 'Silk Pocket Square', price: 59.99, rating: 4.2, reviews: 40, category: 'Accessories', image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop', description: 'Pure silk vibrant print.' },
  { id: 'a11', name: 'Gemstone Ring', price: 799.99, rating: 4.7, reviews: 300, category: 'Accessories', badge: 'LUXURY', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop', description: 'Natural sapphire ring.' },
  { id: 'a12', name: 'Diamond Studs', price: 3499.99, rating: 5, reviews: 210, category: 'Accessories', badge: 'LUXURY', image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&h=800&fit=crop', description: '1-carat total weight diamonds.' },
  { id: 'a13', name: 'Leather Backpack', price: 499.99, rating: 4.6, reviews: 320, category: 'Accessories', badge: 'SALE', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop', description: 'Full-grain leather carryall.' },
  { id: 'a14', name: 'Luxury Watch Box', price: 249.99, rating: 4.8, reviews: 60, category: 'Accessories', image: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=800&h=800&fit=crop', description: 'Handcrafted wood display.' },
  { id: 'a15', name: 'Beaded Bracelet', price: 149.99, rating: 4.3, reviews: 95, category: 'Accessories', image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&h=800&fit=crop', description: 'Natural stone beads.' },
  { id: 'a16', name: 'Designer Wallet', price: 149.99, rating: 4.5, reviews: 390, category: 'Accessories', badge: 'NEW', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=800&fit=crop', description: 'Bifold designer wallet.' },
  { id: 'a17', name: 'Sunglasses', price: 189.99, rating: 4.5, reviews: 734, category: 'Accessories', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop', description: 'UV protected designer shades.' },
  { id: 'a18', name: 'Velvet Clutch', price: 129.99, rating: 4.4, reviews: 55, category: 'Accessories', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&h=800&fit=crop', description: 'Luxury evening clutch.' },
  { id: 'a19', name: 'Silk Tie', price: 79.99, rating: 4.6, reviews: 110, category: 'Accessories', image: 'https://images.unsplash.com/photo-1594938384824-022ef6295acc?w=800&h=800&fit=crop', description: 'Hand-sewn silk necktie.' },
  { id: 'a20', name: 'Aviator Frame', price: 219.99, rating: 4.7, reviews: 420, category: 'Accessories', image: 'https://images.unsplash.com/photo-1511499767390-91f19760b0ac?w=800&h=800&fit=crop', description: 'Classic metal aviators.' },
  // Beauty Products - 20 items with REAL beauty images
  { id: 'b1', name: 'Volumizing Mascara', price: 9.99, rating: 4.9, reviews: 450, category: 'Beauty', badge: 'HOT', image: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=800&h=800&fit=crop', description: 'Lengthening waterproof formula.' },
  { id: 'b2', name: 'Eyeshadow Palette', price: 19.99, rating: 4.8, reviews: 380, category: 'Beauty', badge: 'SALE', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=800&fit=crop', description: '12 highly pigmented shades.' },
  { id: 'b3', name: 'Matte Red Lipstick', price: 12.99, rating: 4.9, reviews: 580, category: 'Beauty', badge: 'HOT', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&h=800&fit=crop', description: 'Long-lasting bold red.' },
  { id: 'b4', name: 'Nail Polish Set', price: 24.99, rating: 4.5, reviews: 290, category: 'Beauty', image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&h=800&fit=crop', description: 'Toxin-free vibrant colors.' },
  { id: 'b5', name: 'Signature Fragrance', price: 89.99, rating: 4.8, reviews: 410, category: 'Beauty', badge: 'LUXURY', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=800&fit=crop', description: 'Floral and wood notes.' },
  { id: 'b6', name: 'Eau De Parfum', price: 129.99, rating: 4.9, reviews: 650, category: 'Beauty', badge: 'LUXURY', image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&h=800&fit=crop', description: 'Premium long-lasting scent.' },
  { id: 'b7', name: 'Hydrating Lotion', price: 18.99, rating: 4.8, reviews: 420, category: 'Beauty', badge: 'HOT', image: 'https://images.unsplash.com/photo-1608248596669-805179374492?w=800&h=800&fit=crop', description: 'Moisturizing face and body.' },
  { id: 'b8', name: 'Anti-Aging Cream', price: 79.99, rating: 4.6, reviews: 340, category: 'Beauty', image: 'https://images.unsplash.com/photo-1556228720-198755653b43?w=800&h=800&fit=crop', description: 'Reduces fine lines.' },
  { id: 'b9', name: 'Vitamin C Serum', price: 45.99, rating: 4.7, reviews: 410, category: 'Beauty', badge: 'NEW', image: 'https://images.unsplash.com/photo-1620916566398-39f1143f2978?w=800&h=800&fit=crop', description: 'Brightening skin serum.' },
  { id: 'b10', name: 'Makeup Brush Set', price: 59.99, rating: 4.8, reviews: 520, category: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?w=800&h=800&fit=crop', description: '10 professional brushes.' },
  { id: 'b11', name: 'Face Mask Pack', price: 24.99, rating: 4.6, reviews: 380, category: 'Beauty', image: 'https://images.unsplash.com/photo-1552046122-03184de85e08?w=800&h=800&fit=crop', description: 'Soothing sheet masks.' },
  { id: 'b12', name: 'Argan Hair Serum', price: 32.99, rating: 4.5, reviews: 290, category: 'Beauty', image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&h=800&fit=crop', description: 'Nourishing hair oil.' },
  { id: 'b13', name: 'BB Cream SPF 30', price: 38.99, rating: 4.7, reviews: 350, category: 'Beauty', badge: 'SALE', image: 'https://images.unsplash.com/photo-1590156221122-c748e7898b0a?w=800&h=800&fit=crop', description: 'Flawless coverage with sun protection.' },
  { id: 'b14', name: 'Cleansing Oil', price: 19.99, rating: 4.6, reviews: 410, category: 'Beauty', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop', description: 'Gentle makeup remover.' },
  { id: 'b15', name: 'Setting Powder', price: 14.99, rating: 4.4, reviews: 180, category: 'Beauty', image: 'https://images.unsplash.com/photo-1590156206657-9f798889980d?w=800&h=800&fit=crop', description: 'Translucent finish powder.' },
  { id: 'b16', name: 'Highlighter Stick', price: 22.99, rating: 4.5, reviews: 130, category: 'Beauty', image: 'https://images.unsplash.com/photo-1515688598190-829278833959?w=800&h=800&fit=crop', description: 'Shimmering cream highlighter.' },
  { id: 'b17', name: 'Floral Bath Salts', price: 15.99, rating: 4.7, reviews: 90, category: 'Beauty', image: 'https://images.unsplash.com/photo-1564277287253-934c868e54ea?w=800&h=800&fit=crop', description: 'Relaxing lavender salts.' },
  { id: 'b18', name: 'Brow Gel', price: 12.00, rating: 4.3, reviews: 200, category: 'Beauty', image: 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb1a?w=800&h=800&fit=crop', description: 'Clear brow shaping gel.' },
  { id: 'b19', name: 'Organic Body Wash', price: 14.50, rating: 4.6, reviews: 310, category: 'Beauty', image: 'https://images.unsplash.com/photo-1607006342411-925760888062?w=800&h=800&fit=crop', description: 'Aloe vera based cleanser.' },
  { id: 'b20', name: 'Facial Roller', price: 29.99, rating: 4.8, reviews: 450, category: 'Beauty', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&h=800&fit=crop', description: 'Authentic jade facial roller.' },

  // Sports Products - 20 items with REAL sports images
  { id: 's1', name: 'Cricket Helmet', price: 44.99, rating: 4.6, reviews: 320, category: 'Sports', badge: 'HOT', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=800&fit=crop', description: 'Impact-resistant shell.' },
  { id: 's2', name: 'Pro Football', price: 17.99, rating: 4.7, reviews: 580, category: 'Sports', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=800&fit=crop', description: 'Official size 5.' },
  { id: 's3', name: 'Golf Ball Pack', price: 9.99, rating: 4.5, reviews: 280, category: 'Sports', image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&h=800&fit=crop', description: 'Tournament grade.' },
  { id: 's4', name: 'Tennis Racquet', price: 49.99, rating: 4.8, reviews: 390, category: 'Sports', badge: 'SALE', image: 'https://images.unsplash.com/photo-1617083934555-ac7d4fee0142?w=800&h=800&fit=crop', description: 'Lightweight carbon frame.' },
  { id: 's5', name: 'Pro Volleyball', price: 19.99, rating: 4.6, reviews: 310, category: 'Sports', image: 'https://images.unsplash.com/photo-1592656094267-764a45160876?w=800&h=800&fit=crop', description: 'Soft-touch outdoor ball.' },
  { id: 's6', name: 'Nike Jordan 1', price: 149.99, rating: 4.9, reviews: 780, category: 'Sports', badge: 'HOT', image: 'https://images.unsplash.com/photo-1597248881519-db089d3744a5?w=800&h=800&fit=crop', description: 'Classic basketball sneakers.' },
  { id: 's7', name: 'Running Shoes', price: 129.99, rating: 4.8, reviews: 640, category: 'Sports', image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=800&fit=crop', description: 'Marathon distance shoes.' },
  { id: 's8', name: 'Sports Watch', price: 199.99, rating: 4.8, reviews: 420, category: 'Sports', badge: 'NEW', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop', description: 'Heart rate and GPS.' },
  { id: 's9', name: 'Diving Watch', price: 999.99, rating: 5.0, reviews: 150, category: 'Sports', badge: 'LUXURY', image: 'https://images.unsplash.com/photo-1526045431048-f857369baa09?w=800&h=800&fit=crop', description: 'Waterproof to 300m.' },
  { id: 's10', name: 'Duffle Gym Bag', price: 39.99, rating: 4.5, reviews: 290, category: 'Sports', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop', description: 'Ventilated shoe pocket.' },
  { id: 's11', name: 'Yoga Mat', price: 29.99, rating: 4.7, reviews: 400, category: 'Sports', image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800&h=800&fit=crop', description: 'Non-slip eco-friendly mat.' },
  { id: 's12', name: 'Adjustable Dumbbells', price: 149.99, rating: 4.8, reviews: 220, category: 'Sports', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=800&fit=crop', description: 'Space-saving weight set.' },
  { id: 's13', name: 'Cycle Helmet', price: 59.99, rating: 4.5, reviews: 180, category: 'Sports', image: 'https://images.unsplash.com/photo-1557161181-43229b109e2a?w=800&h=800&fit=crop', description: 'Aerodynamic design.' },
  { id: 's14', name: 'Swimming Goggles', price: 15.99, rating: 4.3, reviews: 300, category: 'Sports', image: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&h=800&fit=crop', description: 'Anti-fog racing goggles.' },
  { id: 's15', name: 'Hiking Backpack', price: 89.99, rating: 4.7, reviews: 210, category: 'Sports', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop', description: '40L ergonomic backpack.' },
  { id: 's16', name: 'Basketball', price: 25.99, rating: 4.8, reviews: 500, category: 'Sports', image: 'https://images.unsplash.com/photo-1519861155730-0b5fbf0dd889?w=800&h=800&fit=crop', description: 'Indoor/Outdoor grip.' },
  { id: 's17', name: 'Baseball Bat', price: 69.99, rating: 4.6, reviews: 140, category: 'Sports', image: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=800&h=800&fit=crop', description: 'Professional alloy bat.' },
  { id: 's18', name: 'Jump Rope', price: 12.99, rating: 4.4, reviews: 450, category: 'Sports', image: 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=800&h=800&fit=crop', description: 'High-speed fitness rope.' },
  { id: 's19', name: 'Punching Bag', price: 110.00, rating: 4.7, reviews: 90, category: 'Sports', image: 'https://images.unsplash.com/photo-1517438476312-10d79c67750d?w=800&h=800&fit=crop', description: 'Heavy leather bag.' },
  { id: 's20', name: 'Smart Treadmill', price: 899.00, rating: 4.8, reviews: 75, category: 'Sports', image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=800&fit=crop', description: 'Foldable with app sync.' },

  { id: 'st1', name: 'Notebook Set', price: 24.99, rating: 4.8, reviews: 320, category: 'Stationery', badge: 'NEW', image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&h=800&fit=crop', description: 'Hardcover, 3-pack.' },
  { id: 'st2', name: 'Gel Pen Collection', price: 12.99, rating: 4.7, reviews: 580, category: 'Stationery', badge: 'HOT', image: 'https://images.unsplash.com/photo-1586166762-e655a2d8c2eb?w=800&h=800&fit=crop', description: '10 vibrant colors.' },
  { id: 'st3', name: 'Leather Journal', price: 42.99, rating: 4.9, reviews: 680, category: 'Stationery', badge: 'SALE', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&h=800&fit=crop', description: 'Handcrafted leather.' },
  { id: 'st4', name: 'Fountain Pen', price: 45.99, rating: 4.7, reviews: 210, category: 'Stationery', image: 'https://images.unsplash.com/photo-1563127892-89e0c5ed3e18?w=800&h=800&fit=crop', description: 'Elegant chrome nib.' },
  { id: 'st5', name: 'Desk Organizer', price: 34.99, rating: 4.8, reviews: 410, category: 'Stationery', badge: 'SALE', image: 'https://images.unsplash.com/photo-1565011523534-747a8601f10a?w=800&h=800&fit=crop', description: 'Mesh metal set.' },
  { id: 'st6', name: 'Art Portfolio', price: 32.99, rating: 4.8, reviews: 220, category: 'Stationery', badge: 'NEW', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=800&fit=crop', description: 'A3 size professional case.' },
  { id: 'st7', name: 'Colored Pencils', price: 22.99, rating: 4.8, reviews: 510, category: 'Stationery', badge: 'HOT', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&h=800&fit=crop', description: '48 artist-grade colors.' },
  { id: 'st8', name: 'Calligraphy Kit', price: 38.99, rating: 4.6, reviews: 195, category: 'Stationery', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=800&fit=crop', description: 'Complete beginner kit.' },
  { id: 'st9', name: 'Sticky Notes', price: 8.99, rating: 4.6, reviews: 450, category: 'Stationery', image: 'https://images.unsplash.com/photo-1586166762-e655a2d8c2eb?w=800&h=800&fit=crop', description: 'Multi-color bundle.' },
  { id: 'st10', name: 'Mechanical Pencil', price: 15.99, rating: 4.5, reviews: 290, category: 'Stationery', image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&h=800&fit=crop', description: '0.5mm precision lead.' },
  { id: 'st11', name: 'Washi Tape Set', price: 13.99, rating: 4.8, reviews: 640, category: 'Stationery', badge: 'NEW', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop', description: '20 rolls floral prints.' },
  { id: 'st12', name: 'Sketchbook A4', price: 16.99, rating: 4.7, reviews: 380, category: 'Stationery', image: 'https://images.unsplash.com/photo-1523294587484-bae6cc870010?w=800&h=800&fit=crop', description: '150gsm paper for drawing.' },
  { id: 'st13', name: 'Acrylic Markers', price: 18.99, rating: 4.7, reviews: 420, category: 'Stationery', badge: 'NEW', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&h=800&fit=crop', description: 'Water-resistant colors.' },
  { id: 'st14', name: 'Label Maker', price: 49.99, rating: 4.9, reviews: 530, category: 'Stationery', badge: 'HOT', image: 'https://images.unsplash.com/photo-1591768793355-74d04bb6608f?w=800&h=800&fit=crop', description: 'Bluetooth portable printer.' },
  { id: 'st15', name: 'Canvas Tote', price: 19.99, rating: 4.6, reviews: 310, category: 'Stationery', badge: 'NEW', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=800&fit=crop', description: 'Supply carrying bag.' },
  { id: 'st16', name: 'Brush Pens', price: 24.99, rating: 4.8, reviews: 490, category: 'Stationery', badge: 'HOT', image: 'https://images.unsplash.com/photo-1461988625982-7e46a099bf4f?w=800&h=800&fit=crop', description: '24 dual-tip markers.' },
  { id: 'st17', name: 'Graph Notebook', price: 13.99, rating: 4.7, reviews: 320, category: 'Stationery', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=800&fit=crop', description: 'For math and science.' },
  { id: 'st18', name: 'Document Holder', price: 23.99, rating: 4.7, reviews: 310, category: 'Stationery', image: 'https://images.unsplash.com/photo-1578410992178-f4d5f8fa5362?w=800&h=800&fit=crop', description: 'Expandable file system.' },
  { id: 'st19', name: 'Pencil Case', price: 12.99, rating: 4.6, reviews: 380, category: 'Stationery', image: 'https://images.unsplash.com/photo-1580654712603-eb43273aff33?w=800&h=800&fit=crop', description: 'Double zipper canvas case.' },
  { id: 'st20', name: 'Rollerball Pens', price: 20.99, rating: 4.7, reviews: 350, category: 'Stationery', image: 'https://images.unsplash.com/photo-1595475207225-428b7cc97f3e?w=800&h=800&fit=crop', description: 'Smooth liquid ink flow.' },

  { id: 'h2', name: 'Ceramic Vase Set', price: 45.00, rating: 4.7, reviews: 80, category: 'Home', image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&h=800&fit=crop', description: 'Handcrafted ceramic decor.' },
  { id: 'h3', name: 'Non-Stick Cookware', price: 129.99, rating: 4.8, reviews: 300, category: 'Home', badge: 'SALE', image: 'https://images.unsplash.com/photo-1584990344119-a2cecbc7db21?w=800&h=800&fit=crop', description: '10-piece professional set.' },
  { id: 'h4', name: 'Abstract Wall Art', price: 75.00, rating: 4.6, reviews: 45, category: 'Home', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&h=800&fit=crop', description: 'Framed minimalist canvas.' },
  { id: 'h5', name: 'Smart Air Purifier', price: 199.00, rating: 4.9, reviews: 500, category: 'Home', image: 'https://images.unsplash.com/photo-1585771724684-2827dfff38f2?w=800&h=800&fit=crop', description: 'HEPA filter with app control.' },
  { id: 'h6', name: 'Bamboo Bed Sheets', price: 65.00, rating: 4.7, reviews: 210, category: 'Home', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=800&fit=crop', description: 'Cooling organic bamboo.' },
  { id: 'h7', name: 'Espresso Machine', price: 299.00, rating: 4.8, reviews: 180, category: 'Home', image: 'https://images.unsplash.com/photo-1520970014086-2208d157c9e2?w=800&h=800&fit=crop', description: 'Barista-quality coffee maker.' },
  { id: 'h8', name: 'Woven Floor Rug', price: 150.00, rating: 4.5, reviews: 60, category: 'Home', image: 'https://images.unsplash.com/photo-1531651008558-ed175874f331?w=800&h=800&fit=crop', description: 'Natural fiber jute rug.' },
  { id: 'h9', name: 'Standing Desk', price: 350.00, rating: 4.9, reviews: 95, category: 'Home', image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800&h=800&fit=crop', description: 'Electric height adjustable.' },
  { id: 'h10', name: 'Aromatic Diffuser', price: 35.00, rating: 4.4, reviews: 400, category: 'Home', image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=800&h=800&fit=crop', description: 'Ultrasonic essential oil diffuser.' },
  { id: 'h11', name: 'Cast Iron Skillet', price: 49.00, rating: 4.9, reviews: 700, category: 'Home', image: 'https://images.unsplash.com/photo-1590159357010-6bc14586940a?w=800&h=800&fit=crop', description: 'Pre-seasoned heavy duty.' },
  { id: 'h12', name: 'Velvet Throw Pillow', price: 24.00, rating: 4.6, reviews: 150, category: 'Home', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&h=800&fit=crop', description: 'Soft decorative cushion.' },
  { id: 'h13', name: 'Dining Chair Set', price: 180.00, rating: 4.5, reviews: 40, category: 'Home', image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=800&fit=crop', description: 'Set of 2 modern chairs.' },
  { id: 'h14', name: 'Kitchen Scale', price: 19.99, rating: 4.7, reviews: 850, category: 'Home', image: 'https://images.unsplash.com/photo-1591461141916-578f89921abc?w=800&h=800&fit=crop', description: 'Digital precision scale.' },
  { id: 'h15', name: 'Marble Coffee Table', price: 220.00, rating: 4.8, reviews: 30, category: 'Home', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&h=800&fit=crop', description: 'Faux marble with gold legs.' },
  { id: 'h16', name: 'Table Lamp', price: 55.00, rating: 4.6, reviews: 120, category: 'Home', image: 'https://images.unsplash.com/photo-1507473885765-e6ed657f782c?w=800&h=800&fit=crop', description: 'Warm LED accent lighting.' },
  { id: 'h17', name: 'Electric Kettle', price: 39.99, rating: 4.8, reviews: 600, category: 'Home', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&h=800&fit=crop', description: 'Fast boiling stainless steel.' },
  { id: 'h18', name: 'Bathroom Caddy', price: 29.00, rating: 4.3, reviews: 200, category: 'Home', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=800&fit=crop', description: 'Rust-proof shower storage.' },
  { id: 'h19', name: 'Wall Clock', price: 45.00, rating: 4.5, reviews: 110, category: 'Home', image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&h=800&fit=crop', description: 'Silent sweep wood clock.' },
  { id: 'h20', name: 'Air Fryer XL', price: 149.00, rating: 4.9, reviews: 1200, category: 'Home', badge: 'HOT', image: 'https://images.unsplash.com/photo-1626075153743-bc076044706c?w=800&h=800&fit=crop', description: 'Oil-free rapid air tech.' },

  { id: 'k1', name: 'Cast Iron Dutch Oven', price: 79.99, rating: 4.9, reviews: 1200, category: 'Kitchen', badge: 'HOT', image: 'https://images.unsplash.com/photo-1590159357010-6bc14586940a?w=800&h=800&fit=crop', description: 'Enamel coated heavy duty pot.' },
  { id: 'k2', name: 'Professional Knife Set', price: 149.99, rating: 4.8, reviews: 450, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&h=800&fit=crop', description: 'High-carbon stainless steel 8pc set.' },
  { id: 'k3', name: 'Digital Air Fryer', price: 110.00, rating: 4.7, reviews: 890, category: 'Kitchen', badge: 'SALE', image: 'https://images.unsplash.com/photo-1626075153743-bc076044706c?w=800&h=800&fit=crop', description: 'Oil-free rapid air technology.' },
  { id: 'k4', name: 'Glass Spice Jars', price: 24.99, rating: 4.5, reviews: 230, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=800&h=800&fit=crop', description: 'Set of 12 with bamboo lids.' },
  { id: 'k5', name: 'Electric Burr Grinder', price: 55.00, rating: 4.6, reviews: 310, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1585771724684-2827dfff38f2?w=800&h=800&fit=crop', description: 'Precision coffee bean grinder.' },
  { id: 'k6', name: 'Non-Stick Frying Pan', price: 39.99, rating: 4.4, reviews: 540, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1584990344119-a2cecbc7db21?w=800&h=800&fit=crop', description: 'PFOA-free granite coating.' },
  { id: 'k7', name: 'Silicone Utensil Set', price: 29.00, rating: 4.7, reviews: 180, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1594385208974-2e75f9d8a847?w=800&h=800&fit=crop', description: 'Heat resistant 10pc cooking tools.' },
  { id: 'k8', name: 'Electric Gooseneck Kettle', price: 69.99, rating: 4.8, reviews: 420, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&h=800&fit=crop', description: 'Precision pour for drip coffee.' },
  { id: 'k9', name: 'Bamboo Cutting Board', price: 19.99, rating: 4.5, reviews: 150, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=800&h=800&fit=crop', description: 'Extra large organic bamboo.' },
  { id: 'k10', name: 'Mixing Bowl Set', price: 34.00, rating: 4.6, reviews: 200, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1574633408018-8686d634241c?w=800&h=800&fit=crop', description: 'Stainless steel with non-slip base.' },
  { id: 'k11', name: 'High-Speed Blender', price: 199.00, rating: 4.9, reviews: 670, category: 'Kitchen', badge: 'HOT', image: 'https://images.unsplash.com/photo-1570275239925-4af0aa93a0dc?w=800&h=800&fit=crop', description: 'Professional 2000W motor.' },
  { id: 'k12', name: 'Ceramic Baking Dish', price: 45.00, rating: 4.7, reviews: 95, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1596453982736-6218153c9f28?w=800&h=800&fit=crop', description: 'Oven-to-table stoneware.' },
  { id: 'k13', name: 'Pasta Maker Machine', price: 59.99, rating: 4.4, reviews: 130, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1589733901241-5e554288044a?w=800&h=800&fit=crop', description: 'Manual stainless steel roller.' },
  { id: 'k14', name: 'Digital Food Scale', price: 15.99, rating: 4.8, reviews: 1000, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1591461141916-578f89921abc?w=800&h=800&fit=crop', description: 'Precision measuring in grams/oz.' },
  { id: 'k15', name: 'Herb Keeper', price: 22.00, rating: 4.3, reviews: 75, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1589112953284-82601705607b?w=800&h=800&fit=crop', description: 'Keep fresh herbs alive longer.' },
  { id: 'k16', name: 'Mandoline Slicer', price: 32.99, rating: 4.2, reviews: 310, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1594313360408-085002996911?w=800&h=800&fit=crop', description: 'Adjustable thickness fruit cutter.' },
  { id: 'k17', name: 'French Press', price: 28.00, rating: 4.7, reviews: 450, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1544191681-3510522f87a8?w=800&h=800&fit=crop', description: 'Heat-resistant borosilicate glass.' },
  { id: 'k18', name: 'Mortar and Pestle', price: 35.00, rating: 4.8, reviews: 120, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1596700812376-78e2289662f5?w=800&h=800&fit=crop', description: 'Solid granite stone grinder.' },
  { id: 'k19', name: 'Oil Dispenser Set', price: 18.00, rating: 4.5, reviews: 190, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&h=800&fit=crop', description: 'Drip-free glass bottles.' },
  { id: 'k20', name: 'Apron and Glove Set', price: 25.00, rating: 4.6, reviews: 60, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=800&fit=crop', description: 'Heavy canvas with heat gloves.' },

  { id: 'hd1', name: 'Ceramic Vase Set', price: 42.00, rating: 4.7, reviews: 150, category: 'Decor', image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&h=800&fit=crop', description: 'Minimalist matte finish.' },
  { id: 'hd2', name: 'Macrame Wall Hanging', price: 35.00, rating: 4.8, reviews: 80, category: 'Decor', badge: 'NEW', image: 'https://images.unsplash.com/photo-1522758939261-80802111d9b9?w=800&h=800&fit=crop', description: 'Bohemian hand-woven art.' },
  { id: 'hd3', name: 'Aromatic Candle Set', price: 28.99, rating: 4.5, reviews: 320, category: 'Decor', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&h=800&fit=crop', description: 'Soy wax with essential oils.' },
  { id: 'hd4', name: 'Sunburst Wall Mirror', price: 89.00, rating: 4.9, reviews: 65, category: 'Decor', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&h=800&fit=crop', description: 'Gold finish decorative mirror.' },
  { id: 'hd5', name: 'Throw Blanket', price: 39.99, rating: 4.6, reviews: 210, category: 'Decor', image: 'https://images.unsplash.com/photo-1580302200322-26277839626e?w=800&h=800&fit=crop', description: 'Ultra-soft chunky knit.' },
  { id: 'hd6', name: 'Abstract Table Lamp', price: 55.00, rating: 4.7, reviews: 45, category: 'Decor', image: 'https://images.unsplash.com/photo-1507473885765-e6ed657f782c?w=800&h=800&fit=crop', description: 'Warm LED accent light.' },
  { id: 'hd7', name: 'Velvet Pillow Covers', price: 19.99, rating: 4.4, reviews: 540, category: 'Decor', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&h=800&fit=crop', description: 'Set of 2 luxury covers.' },
  { id: 'hd8', name: 'Floating Shelves', price: 45.00, rating: 4.5, reviews: 130, category: 'Decor', image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800&h=800&fit=crop', description: 'Rustic wood wall storage.' },
  { id: 'hd9', name: 'Artificial Palm Plant', price: 75.00, rating: 4.6, reviews: 110, category: 'Decor', image: 'https://images.unsplash.com/photo-1501004318641-72e5453f443c?w=800&h=800&fit=crop', description: 'Lifelike 4ft silk tree.' },
  { id: 'hd10', name: 'Vintage Table Clock', price: 32.00, rating: 4.3, reviews: 75, category: 'Decor', image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&h=800&fit=crop', description: 'Silent analog desk clock.' },
  { id: 'hd11', name: 'Cotton Rope Basket', price: 24.00, rating: 4.7, reviews: 280, category: 'Decor', image: 'https://images.unsplash.com/photo-1590736704728-f4730bb3c570?w=800&h=800&fit=crop', description: 'Laundry and toy organizer.' },
  { id: 'hd12', name: 'Copper Photo Frames', price: 29.99, rating: 4.5, reviews: 90, category: 'Decor', image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&h=800&fit=crop', description: 'Minimalist metallic frames.' },
  { id: 'hd13', name: 'Geometric Bookends', price: 38.00, rating: 4.6, reviews: 40, category: 'Decor', image: 'https://images.unsplash.com/photo-1544648630-3e289751e890?w=800&h=800&fit=crop', description: 'Heavy marble and brass.' },
  { id: 'hd14', name: 'Indoor Water Fountain', price: 110.00, rating: 4.8, reviews: 55, category: 'Decor', badge: 'SALE', image: 'https://images.unsplash.com/photo-1594913785162-e678ac052429?w=800&h=800&fit=crop', description: 'Zen tabletop relaxation.' },
  { id: 'hd15', name: 'Linen Curtains', price: 59.99, rating: 4.7, reviews: 140, category: 'Decor', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&h=800&fit=crop', description: 'Semi-sheer light filtering.' },
  { id: 'hd16', name: 'Glass Terrarium', price: 25.00, rating: 4.4, reviews: 105, category: 'Decor', image: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&h=800&fit=crop', description: 'Geometric hanging planter.' },
  { id: 'hd17', name: 'Embroidered Table Runner', price: 34.00, rating: 4.6, reviews: 70, category: 'Decor', image: 'https://images.unsplash.com/photo-1544474373-c64673644f51?w=800&h=800&fit=crop', description: 'Hand-stitched dining decor.' },
  { id: 'hd18', name: 'Gold Candle Pillars', price: 49.99, rating: 4.5, reviews: 30, category: 'Decor', image: 'https://images.unsplash.com/photo-1602165147575-d816432a685e?w=800&h=800&fit=crop', description: 'Set of 3 luxury holders.' },
  { id: 'hd19', name: 'Fleece Throw Rug', price: 55.00, rating: 4.8, reviews: 190, category: 'Decor', image: 'https://images.unsplash.com/photo-1531651008558-ed175874f331?w=800&h=800&fit=crop', description: 'High-pile accent rug.' },
  { id: 'hd20', name: 'Wall Mounted Planter', price: 22.00, rating: 4.3, reviews: 50, category: 'Decor', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&h=800&fit=crop', description: 'Modern ceramic wall pot.' },

  { id: 'f1', name: 'Mid-Century Sofa', price: 799.00, rating: 4.9, reviews: 200, category: 'Furniture', badge: 'HOT', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop', description: '3-seater velvet sofa.' },
  { id: 'f2', name: 'Marble Coffee Table', price: 250.00, rating: 4.8, reviews: 90, category: 'Furniture', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&h=800&fit=crop', description: 'Real marble top with gold legs.' },
  { id: 'f3', name: 'Ergonomic Office Chair', price: 189.99, rating: 4.7, reviews: 450, category: 'Furniture', badge: 'SALE', image: 'https://images.unsplash.com/photo-1505797149-35ebcb05a6fd?w=800&h=800&fit=crop', description: 'Lumbar support mesh chair.' },
  { id: 'f4', name: 'Oak Wood Bookshelf', price: 150.00, rating: 4.6, reviews: 110, category: 'Furniture', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&h=800&fit=crop', description: '5-tier open shelf storage.' },
  { id: 'f5', name: 'Queen Size Bed Frame', price: 499.00, rating: 4.9, reviews: 150, category: 'Furniture', image: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?w=800&h=800&fit=crop', description: 'Upholstered platform bed.' },
  { id: 'f6', name: 'Dining Table Set', price: 599.00, rating: 4.8, reviews: 65, category: 'Furniture', image: 'https://images.unsplash.com/photo-1577113398331-d843d3341a63?w=800&h=800&fit=crop', description: 'Solid wood table with 4 chairs.' },
  { id: 'f7', name: 'Accent Armchair', price: 220.00, rating: 4.7, reviews: 88, category: 'Furniture', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=800&fit=crop', description: 'Linen wingback reading chair.' },
  { id: 'f8', name: 'Minimalist Sideboard', price: 350.00, rating: 4.5, reviews: 40, category: 'Furniture', image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800&h=800&fit=crop', description: 'Modern kitchen storage unit.' },
  { id: 'f9', name: 'Tufted Ottoman', price: 89.99, rating: 4.4, reviews: 120, category: 'Furniture', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&h=800&fit=crop', description: 'Storage ottoman footstool.' },
  { id: 'f10', name: 'Standing Desk', price: 299.00, rating: 4.9, reviews: 300, category: 'Furniture', badge: 'NEW', image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=800&fit=crop', description: 'Electric height adjustment.' },
  { id: 'f11', name: 'Nesting Side Tables', price: 110.00, rating: 4.6, reviews: 55, category: 'Furniture', image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=800&fit=crop', description: 'Set of 3 space savers.' },
  { id: 'f12', name: 'Patio Swing Chair', price: 210.00, rating: 4.8, reviews: 75, category: 'Furniture', image: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800&h=800&fit=crop', description: 'Rattan egg chair with stand.' },
  { id: 'f13', name: 'Bar Stool Set', price: 130.00, rating: 4.5, reviews: 140, category: 'Furniture', image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=800&fit=crop', description: 'Industrial metal bar chairs.' },
  { id: 'f14', name: 'Wardrobe Closet', price: 450.00, rating: 4.7, reviews: 30, category: 'Furniture', image: 'https://images.unsplash.com/photo-1558997519-83ec7c027440?w=800&h=800&fit=crop', description: 'Large wooden 3-door closet.' },
  { id: 'f15', name: 'TV Entertainment Stand', price: 199.00, rating: 4.6, reviews: 105, category: 'Furniture', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=800&fit=crop', description: 'Holds up to 65-inch TVs.' },
  { id: 'f16', name: 'Bench Seating', price: 95.00, rating: 4.3, reviews: 50, category: 'Furniture', image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800&h=800&fit=crop', description: 'Entryway wood bench.' },
  { id: 'f17', name: 'Chest of Drawers', price: 275.00, rating: 4.8, reviews: 60, category: 'Furniture', image: 'https://images.unsplash.com/photo-1538688547191-f8aa357c9349?w=800&h=800&fit=crop', description: '6-drawer bedroom storage.' },
  { id: 'f18', name: 'Console Table', price: 140.00, rating: 4.5, reviews: 35, category: 'Furniture', image: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?w=800&h=800&fit=crop', description: 'Slim hall table with metal legs.' },
  { id: 'f19', name: 'Folding Guest Bed', price: 120.00, rating: 4.4, reviews: 45, category: 'Furniture', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=800&fit=crop', description: 'Portable mattress on wheels.' },
  { id: 'f20', name: 'Nightstand Set', price: 160.00, rating: 4.7, reviews: 110, category: 'Furniture', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=800&fit=crop', description: 'Pair of bedside tables.' },

  { id: 'hi1', name: 'Smart Video Doorbell', price: 129.00, rating: 4.8, reviews: 850, category: 'Improvement', badge: 'HOT', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=800&fit=crop', description: '1080p HD with night vision.' },
  { id: 'hi2', name: 'Electric Power Drill', price: 89.99, rating: 4.9, reviews: 600, category: 'Improvement', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=800&fit=crop', description: '20V cordless with drill bit set.' },
  { id: 'hi3', name: 'Smart Thermostat', price: 199.00, rating: 4.8, reviews: 320, category: 'Improvement', badge: 'SALE', image: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800&h=800&fit=crop', description: 'Energy saving WiFi control.' },
  { id: 'hi4', name: 'LED Shower Head', price: 35.00, rating: 4.5, reviews: 210, category: 'Improvement', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=800&fit=crop', description: 'Color changing water pressure.' },
  { id: 'hi5', name: 'Keyless Smart Lock', price: 149.99, rating: 4.7, reviews: 400, category: 'Improvement', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=800&fit=crop', description: 'Touchscreen with fingerprint.' },
  { id: 'hi6', name: 'Cabinet Paint Kit', price: 45.00, rating: 4.6, reviews: 120, category: 'Improvement', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=800&fit=crop', description: 'Satin finish DIY renovation.' },
  { id: 'hi7', name: 'Motion Sensor Lights', price: 29.99, rating: 4.4, reviews: 500, category: 'Improvement', image: 'https://images.unsplash.com/photo-1554224155-aa0b1869a1a?w=800&h=800&fit=crop', description: 'Solar powered outdoor security.' },
  { id: 'hi8', name: 'Self-Adhesive Wall Tiles', price: 55.00, rating: 4.5, reviews: 95, category: 'Improvement', image: 'https://images.unsplash.com/photo-1585128719715-46776b56a0d1?w=800&h=800&fit=crop', description: 'Peel and stick kitchen backsplash.' },
  { id: 'hi9', name: 'Air Purifier System', price: 175.00, rating: 4.9, reviews: 280, category: 'Improvement', image: 'https://images.unsplash.com/photo-1585771724684-2827dfff38f2?w=800&h=800&fit=crop', description: 'HEPA filtration for large rooms.' },
  { id: 'hi10', name: 'Tool Organizer Box', price: 42.00, rating: 4.6, reviews: 150, category: 'Improvement', image: 'https://images.unsplash.com/photo-1530124560676-41bc128328de?w=800&h=800&fit=crop', description: 'Heavy duty stackable storage.' },
  { id: 'hi11', name: 'Modern Faucet', price: 85.00, rating: 4.8, reviews: 75, category: 'Improvement', image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800&h=800&fit=crop', description: 'Matte black pull-down sprayer.' },
  { id: 'hi12', name: 'Wallpaper Roll', price: 38.00, rating: 4.3, reviews: 60, category: 'Improvement', image: 'https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?w=800&h=800&fit=crop', description: 'Modern geometric pattern.' },
  { id: 'hi13', name: 'Step Ladder 3-Step', price: 49.99, rating: 4.7, reviews: 310, category: 'Improvement', image: 'https://images.unsplash.com/photo-1549464016-dfaf72ae4b04?w=800&h=800&fit=crop', description: 'Foldable aluminum lightweight.' },
  { id: 'hi14', name: 'Laser Level Tool', price: 32.00, rating: 4.6, reviews: 110, category: 'Improvement', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=800&fit=crop', description: '360 degree cross line laser.' },
  { id: 'hi15', name: 'Floor Transition Strips', price: 15.00, rating: 4.2, reviews: 40, category: 'Improvement', image: 'https://images.unsplash.com/photo-1581850518616-cee815377af3?w=800&h=800&fit=crop', description: 'Aluminum threshold cover.' },
  { id: 'hi16', name: 'Under Cabinet Lighting', price: 25.00, rating: 4.5, reviews: 180, category: 'Improvement', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=800&fit=crop', description: 'Wireless remote LED strips.' },
  { id: 'hi17', name: 'Programmable Timer', price: 18.00, rating: 4.6, reviews: 90, category: 'Improvement', image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&h=800&fit=crop', description: '7-day light outlet control.' },
  { id: 'hi18', name: 'Weather Stripping', price: 12.99, rating: 4.4, reviews: 130, category: 'Improvement', image: 'https://images.unsplash.com/photo-1585128719715-46776b56a0d1?w=800&h=800&fit=crop', description: 'Self-adhesive door seal tape.' },
  { id: 'hi19', name: 'Wall Mount Organizer', price: 29.00, rating: 4.5, reviews: 75, category: 'Improvement', image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800&h=800&fit=crop', description: 'Garden and mop tool rack.' },
  { id: 'hi20', name: 'Paint Roller Pro', price: 22.99, rating: 4.7, reviews: 55, category: 'Improvement', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=800&fit=crop', description: 'No-mess paint fill system.' },


];




export default App;
