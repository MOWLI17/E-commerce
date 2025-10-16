import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  CreditCard,
  Shield,
  Truck,
  Heart,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Features Bar */}
      <div className="features-bar">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon truck">
                <Truck size={24} />
              </div>
              <div>
                <h4>Free Shipping</h4>
                <p>On orders over $50</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon shield">
                <Shield size={24} />
              </div>
              <div>
                <h4>Secure Payment</h4>
                <p>100% secure payment</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon heart">
                <Heart size={24} />
              </div>
              <div>
                <h4>24/7 Support</h4>
                <p>Dedicated support</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon credit">
                <CreditCard size={24} />
              </div>
              <div>
                <h4>Easy Returns</h4>
                <p>30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main container">
        {/* Company Info */}
        <div className="footer-col">
          <h3>ShopHub</h3>
          <p>
            Your one-stop destination for quality products at unbeatable prices. Shop with confidence and style.
          </p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <Youtube size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/shop">Shop</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/faqs">FAQs</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="footer-col">
          <h4>Customer Service</h4>
          <ul>
            <li><a href="/account">My Account</a></li>
            <li><a href="/track-order">Track Order</a></li>
            <li><a href="/shipping-policy">Shipping Policy</a></li>
            <li><a href="/return-policy">Return Policy</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-col">
          <h4>Contact Us</h4>
          <ul className="contact-list">
            <li>
              <MapPin size={20} /> 123 Shopping Street, New York, NY 10001
            </li>
            <li>
              <Phone size={20} /> +1 (555) 123-4567
            </li>
            <li>
              <Mail size={20} /> support@shophub.com
            </li>
          </ul>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="newsletter">
        <div className="container newsletter-content">
          <div>
            <h4>Subscribe to our Newsletter</h4>
            <p>Get the latest updates on new products and offers</p>
          </div>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button type="button">Subscribe</button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bottom-bar container">
        <p>© 2025 ShopHub. All rights reserved.</p>
        <div className="payment-icons">
          <img src="https://placehold.co/50x30/1e293b/ffffff/png?text=VISA" alt="Visa" />
          <img src="https://placehold.co/50x30/1e293b/ffffff/png?text=MC" alt="Mastercard" />
          <img src="https://placehold.co/50x30/1e293b/ffffff/png?text=AMEX" alt="Amex" />
          <img src="https://placehold.co/50x30/1e293b/ffffff/png?text=PayPal" alt="PayPal" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
