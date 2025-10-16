import './App.css';
import { useState,useMemo } from 'react';
import Home from './Components/Home';
import Header from './Components/Header';
import Cart from './Components/Cart';
import Wishlist from './Components/Wishlist';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Regester from './Components/Regester';
import Login from './Components/Login';
import Footer from './Components/Footer';
import Swal from 'sweetalert2';

const Products = [
  // Electronics
  { id: 'e1', name: 'Gaming Laptop Pro', price: 1299.99, rating: 4.5, reviews: 248, category: 'Electronics', badge: 'SALE', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop', description: 'High-performance gaming laptop with RTX 4090, 32GB RAM, and 1TB SSD' },
  { id: 'e2', name: 'Smartphone 5G Ultra', price: 799.99, rating: 5, reviews: 562, category: 'Electronics', badge: 'HOT', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', description: 'Latest 5G smartphone with advanced camera system' },
  { id: 'e3', name: 'Wireless Headphones Pro', price: 249.99, rating: 4, reviews: 189, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', description: 'Premium noise-cancelling wireless headphones' },
  { id: 'e4', name: 'Smart Watch Series X', price: 399.99, rating: 4.5, reviews: 421, category: 'Electronics', badge: 'NEW', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', description: 'Advanced fitness tracking smartwatch with heart rate monitor' },
  { id: 'e5', name: '4K Ultra HD TV', price: 1099.99, rating: 4.7, reviews: 130, category: 'Electronics', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop', description: '65-inch 4K smart TV with HDR support' },
  { id: 'e6', name: 'Bluetooth Speaker', price: 79.99, rating: 4.3, reviews: 89, category: 'Electronics', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', description: 'Portable waterproof Bluetooth speaker' },
  { id: 'e7', name: 'DSLR Camera', price: 599.99, rating: 4.6, reviews: 200, category: 'Electronics', badge: 'SALE', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop', description: 'Professional DSLR camera with 24.2MP sensor' },
  { id: 'e8', name: 'Portable Charger', price: 39.99, rating: 4.4, reviews: 150, category: 'Electronics', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop', description: '20000mAh portable power bank' },
  { id: 'e9', name: 'Gaming Mouse', price: 59.99, rating: 4.5, reviews: 220, category: 'Electronics', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop', description: 'RGB gaming mouse with 16000 DPI' },
  { id: 'e10', name: 'Wireless Keyboard', price: 89.99, rating: 4.1, reviews: 95, category: 'Electronics', image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop', description: 'Mechanical wireless keyboard' },
  { id: 'e11', name: 'VR Headset', price: 499.99, rating: 4.8, reviews: 300, category: 'Electronics', badge: 'HOT', image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&h=400&fit=crop', description: 'Next-generation VR headset with 4K resolution' },
  { id: 'e12', name: 'Smart Home Hub', price: 149.99, rating: 4.0, reviews: 75, category: 'Electronics', image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400&h=400&fit=crop', description: 'Central smart home control system' },
  { id: 'e13', name: 'Noise Cancelling Earbuds', price: 129.99, rating: 4.3, reviews: 180, category: 'Electronics', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop', description: 'True wireless earbuds with active noise cancellation' },
  { id: 'e14', name: 'Action Camera', price: 199.99, rating: 4.5, reviews: 110, category: 'Electronics', image: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=400&h=400&fit=crop', description: '4K action camera with stabilization' },
  { id: 'e15', name: 'Smart Thermostat', price: 249.99, rating: 4.2, reviews: 90, category: 'Electronics', image: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=400&h=400&fit=crop', description: 'Learning thermostat for energy efficiency' },
  { id: 'e16', name: 'Drone with Camera', price: 399.99, rating: 4.6, reviews: 145, category: 'Electronics', badge: 'NEW', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop', description: '4K drone with 30-minute flight time' },
  { id: 'e17', name: 'E-Reader', price: 129.99, rating: 4.4, reviews: 200, category: 'Electronics', image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=400&fit=crop', description: 'E-ink display e-reader with 32GB storage' },
  { id: 'e18', name: 'USB-C Hub', price: 49.99, rating: 4.1, reviews: 70, category: 'Electronics', image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop', description: '7-in-1 USB-C multiport adapter' },
  { id: 'e19', name: 'Mechanical Keyboard', price: 139.99, rating: 4.7, reviews: 180, category: 'Electronics', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop', description: 'Premium mechanical keyboard with custom switches' },
  { id: 'e20', name: '4K Monitor', price: 399.99, rating: 4.5, reviews: 160, category: 'Electronics', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop', description: '27-inch 4K UHD monitor' },
  { id: 'e20', name: 'Apple iPad Mini', price: 499.99, rating: 4.9, reviews: 580, category: 'Electronics', badge: 'NEW', image: 'https://cdn.dummyjson.com/products/images/tablets/iPad%20Mini%202021%20Starlight/1.png', description: 'Compact tablet for notes' },
  { id: 'e21', name: 'Samsung Galaxy Tab S8', price: 399.99, rating: 4.6, reviews: 380, category: 'Electronics', image: 'https://cdn.dummyjson.com/products/images/tablets/Samsung%20Galaxy%20Tab%20S8%20Plus%20Grey/1.png', description: 'Android tablet for productivity' },
  { id: 'e22', name: 'Samsung Galaxy Tab White', price: 449.99, rating: 4.7, reviews: 420, category: 'Electronics', badge: 'HOT', image: 'https://cdn.dummyjson.com/products/images/tablets/Samsung%20Galaxy%20Tab%20White/1.png', description: 'Sleek white tablet' },
  { id: 'e23', name: 'MacBook Pro', price: 1999.99, rating: 4.9, reviews: 620, category: 'Electronics', badge: 'HOT', image: 'https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/1.png', description: 'Professional laptop for work' },
  { id: 'e24', name: 'Asus Zenbook', price: 699.99, rating: 4.5, reviews: 290, category: 'Electronics', image: 'https://cdn.dummyjson.com/products/images/laptops/Asus%20Zenbook%20Pro%20Dual%20Screen%20Laptop/1.png', description: 'Affordable student laptop' },
  { id: 'e25', name: 'Dell Inspiron 15', price: 899.99, rating: 4.6, reviews: 340, category: 'Electronics', image: 'https://cdn.dummyjson.com/products/images/laptops/Dell%20Inspiron%2015/1.png', description: 'Reliable laptop for students' },
  { id: 'e26', name: 'HP Pavilion 15', price: 799.99, rating: 4.5, reviews: 310, category: 'Electronics', badge: 'SALE', image: 'https://cdn.dummyjson.com/products/images/laptops/HP%20Pavilion%2015-DK1056WM/1.png', description: 'Versatile home laptop' },
  { id: 'e27', name: 'Huawei Matebook X Pro', price: 1199.99, rating: 4.7, reviews: 260, category: 'Electronics', image: 'https://cdn.dummyjson.com/products/images/laptops/Huawei%20Matebook%20X%20Pro/1.png', description: 'Premium ultrabook' },
  { id: 'e28', name: 'Lenovo Yoga 920', price: 1499.99, rating: 4.8, reviews: 420, category: 'Electronics', image: 'https://cdn.dummyjson.com/products/images/laptops/Lenovo%20Yoga%20920/1.png', description: '2-in-1 laptop for versatility' },
  { id: 'e29', name: 'New Microsoft Surface', price: 1299.99, rating: 4.7, reviews: 380, category: 'Electronics', image: 'https://cdn.dummyjson.com/products/images/laptops/New%20Microsoft%20Surface%20Laptop/1.png', description: 'Modern Surface laptop' },
  { id: 'e30', name: 'iPhone 13 Pro', price: 1099.99, rating: 4.9, reviews: 780, category: 'Electronics', badge: 'HOT', image: 'https://cdn.dummyjson.com/products/images/smartphones/iPhone%2013%20Pro/1.png', description: 'Latest iPhone for professionals' },
  { id: 'e31', name: 'iPhone X', price: 899.99, rating: 4.6, reviews: 520, category: 'Electronics', image: 'https://cdn.dummyjson.com/products/images/smartphones/iPhone%20X/1.png', description: 'Powerful smartphone' },
  { id: 'e32', name: 'Oppo F19 Pro Plus', price: 299.99, rating: 4.5, reviews: 380, category: 'Electronics', image: 'https://cdn.dummyjson.com/products/images/smartphones/Oppo%20F19%20Pro%20Plus/1.png', description: 'Mid-range smartphone' },
  { id: 'e33', name: 'Oppo K1', price: 249.99, rating: 4.4, reviews: 290, category: 'Electronics', image: 'https://cdn.dummyjson.com/products/images/smartphones/Oppo%20K1/1.png', description: 'Budget-friendly phone' },
  { id: 'e34', name: 'Realme C35', price: 199.99, rating: 4.3, reviews: 240, category: 'Electronics', image: 'https://cdn.dummyjson.com/products/images/smartphones/Realme%20C35/1.png', description: 'Affordable smartphone' },
  { id: 'e35', name: 'Samsung Galaxy S7', price: 299.99, rating: 4.5, reviews: 410, category: 'Electronics', image: 'https://cdn.dummyjson.com/products/images/smartphones/Samsung%20Galaxy%20S7/1.png', description: 'Reliable Samsung phone' },
  { id: 'e36', name: 'Samsung Galaxy S10', price: 499.99, rating: 4.7, reviews: 520, category: 'Electronics', badge: 'SALE', image: 'https://cdn.dummyjson.com/products/images/smartphones/Samsung%20Galaxy%20S10/1.png', description: 'Premium Samsung flagship' },
  { id: 'e37', name: 'Vivo V9', price: 279.99, rating: 4.4, reviews: 310, category: 'Electronics', image: 'https://cdn.dummyjson.com/products/images/smartphones/Vivo%20V9/1.png', description: 'Stylish Vivo smartphone' },
  { id: 'e38', name: 'Xiaomi Redmi Note 7', price: 189.99, rating: 4.5, reviews: 450, category: 'Electronics', image: 'https://cdn.dummyjson.com/products/images/smartphones/Xiaomi%20Redmi%20Note%207/1.png', description: 'Value for money smartphone' },
  { id: 'e39', name: 'Xiaomi Redmi Note 8', price: 219.99, rating: 4.6, reviews: 480, category: 'Electronics', image: 'https://cdn.dummyjson.com/products/images/smartphones/Xiaomi%20Redmi%20Note%208/1.png', description: 'Feature-packed smartphone' },
  { id: 'e40', name: 'Xiaomi Redmi Note 9', price: 249.99, rating: 4.7, reviews: 500, category: 'Electronics', image: 'https://cdn.dummyjson.com/products/images/smartphones/Xiaomi%20Redmi%20Note%209/1.png', description: 'Next-gen smartphone from Xiaomi' },

  // Fashion
  { id: 'f1', name: 'Designer Leather Jacket', price: 349.99, rating: 5, reviews: 324, category: 'Fashion', badge: 'SALE', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop', description: 'Genuine leather jacket with Italian craftsmanship' },
  { id: 'f2', name: 'Premium Running Shoes', price: 159.99, rating: 4.5, reviews: 456, category: 'Fashion', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', description: 'Performance running shoes with gel cushioning' },
  { id: 'f3', name: 'Evening Gown Dress', price: 199.99, rating: 5, reviews: 289, category: 'Fashion', badge: 'HOT', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=400&fit=crop', description: 'Elegant evening gown dress' },
  { id: 'f4', name: 'Formal Suit 3-Piece', price: 449.99, rating: 4.5, reviews: 387, category: 'Fashion', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop', description: 'Classic 3-piece formal business suit' },
  { id: 'f5', name: 'Casual Denim Jacket', price: 89.99, rating: 4, reviews: 150, category: 'Fashion', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop', description: 'Classic denim jacket with distressed details' },
  { id: 'f6', name: 'Slim Fit Chinos', price: 69.99, rating: 4.2, reviews: 220, category: 'Fashion', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop', description: 'Modern slim-fit chino pants' },
  { id: 'f7', name: 'Formal Oxford Shoes', price: 129.99, rating: 4.6, reviews: 180, category: 'Fashion', image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop', description: 'Premium leather oxford shoes' },
  { id: 'f8', name: 'Wool Overcoat', price: 199.99, rating: 4.8, reviews: 190, category: 'Fashion', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=400&fit=crop', description: 'Luxurious wool overcoat' },
  { id: 'f9', name: 'Casual Sneakers', price: 79.99, rating: 4.4, reviews: 240, category: 'Fashion', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', description: 'Comfortable casual sneakers' },
  { id: 'f10', name: 'Linen Shirt', price: 49.99, rating: 4.3, reviews: 130, category: 'Fashion', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop', description: 'Breathable linen casual shirt' },
  { id: 'f11', name: 'Silk Scarf', price: 39.99, rating: 4.7, reviews: 100, category: 'Fashion', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=400&fit=crop', description: 'Premium silk scarves' },
  { id: 'f12', name: 'Maxi Dress', price: 89.99, rating: 4.9, reviews: 290, category: 'Fashion', badge: 'NEW', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop', description: 'Elegant maxi dress' },
  { id: 'f13', name: 'Polo T-Shirt', price: 29.99, rating: 4.2, reviews: 110, category: 'Fashion', image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&h=400&fit=crop', description: 'Classic polo t-shirt' },
  { id: 'f14', name: 'Yoga Leggings', price: 59.99, rating: 4.5, reviews: 140, category: 'Fashion', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=400&fit=crop', description: 'High-waist yoga leggings' },
  { id: 'f15', name: 'Faux Fur Coat', price: 149.99, rating: 4.7, reviews: 170, category: 'Fashion', image: 'https://placehold.co/400x400/F5DEB3/333333?text=Fur+Coat', description: 'Luxurious faux fur coat' },
  { id: 'f16', name: 'Turtleneck Sweater', price: 69.99, rating: 4.6, reviews: 135, category: 'Fashion', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop', description: 'Cozy turtleneck sweater' },
  { id: 'f17', name: 'Leather Boots', price: 159.99, rating: 4.4, reviews: 200, category: 'Fashion', image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=400&fit=crop', description: 'Premium leather boots' },
  { id: 'f18', name: 'Beanie Hat', price: 19.99, rating: 4.1, reviews: 80, category: 'Fashion', image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400&h=400&fit=crop', description: 'Warm wool beanie' },
  { id: 'f19', name: 'Bomber Jacket', price: 119.99, rating: 4.3, reviews: 170, category: 'Fashion', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop', description: 'Stylish bomber jacket' },
  { id: 'f20', name: 'Graphic Hoodie', price: 79.99, rating: 4.5, reviews: 210, category: 'Fashion', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop', description: 'Trendy graphic hoodie' },

  // Accessories
  { id: 'a1', name: 'Pearl Earrings', price: 499.99, rating: 4.8, reviews: 300, category: 'Accessories', badge: 'LUXURY', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop', description: 'Authentic pearl earrings' },
  { id: 'a2', name: 'Gold Chain Necklace', price: 999.99, rating: 4.7, reviews: 280, category: 'Accessories', badge: 'HOT', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop', description: '18K gold chain necklace' },
  { id: 'a3', name: 'Luxury Watch Strap', price: 199.99, rating: 4.5, reviews: 112, category: 'Accessories', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop', description: 'Premium leather watch strap' },
  { id: 'a4', name: 'Crystal Cufflinks', price: 299.99, rating: 4.3, reviews: 140, category: 'Accessories', badge: 'NEW', image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&h=400&fit=crop', description: 'Crystal and silver cufflinks' },
  { id: 'a5', name: 'Leather Gloves', price: 89.99, rating: 4.2, reviews: 210, category: 'Accessories', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=400&h=400&fit=crop', description: 'Genuine leather gloves' },
  { id: 'a6', name: 'Silver Pendant', price: 199.99, rating: 4.6, reviews: 85, category: 'Accessories', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop', description: 'Sterling silver pendant' },
  { id: 'a7', name: 'Luxury Hat', price: 249.99, rating: 4.1, reviews: 75, category: 'Accessories', image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&h=400&fit=crop', description: 'Designer luxury hat' },
  { id: 'a8', name: 'Designer Brooch', price: 149.99, rating: 4.4, reviews: 130, category: 'Accessories', image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&h=400&fit=crop', description: 'Vintage designer brooch' },
  { id: 'a9', name: 'Luxury Keychain', price: 49.99, rating: 4.0, reviews: 60, category: 'Accessories', image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&h=400&fit=crop', description: 'Leather luxury keychain' },
  { id: 'a10', name: 'Fashion Hairband', price: 29.99, rating: 4.1, reviews: 90, category: 'Accessories', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop', description: 'Fashionable hairband' },
  { id: 'a11', name: 'Gemstone Ring', price: 799.99, rating: 4.7, reviews: 300, category: 'Accessories', badge: 'LUXURY', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop', description: 'Gemstone engagement ring' },
  { id: 'a12', name: 'Silk Pocket Square', price: 59.99, rating: 4.2, reviews: 40, category: 'Accessories', image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop', description: 'Silk pocket square' },
  { id: 'a13', name: 'Diamond Stud Earrings', price: 3499.99, rating: 5, reviews: 210, category: 'Accessories', badge: 'LUXURY', image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&h=400&fit=crop', description: 'Certified diamond earrings' },
  { id: 'a14', name: 'Leather Backpack', price: 499.99, rating: 4.6, reviews: 320, category: 'Accessories', badge: 'SALE', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', description: 'Premium leather backpack' },
  { id: 'a15', name: 'Luxury Travel Case', price: 399.99, rating: 4.5, reviews: 115, category: 'Accessories', image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400&h=400&fit=crop', description: 'Durable travel luggage' },
  { id: 'a16', name: 'Fashion Tie', price: 79.99, rating: 4.1, reviews: 140, category: 'Accessories', image: 'https://placehold.co/400x400/191970/FFFFFF?text=Fashion+Tie', description: 'Silk designer tie' },
  { id: 'a17', name: 'Luxury Watch Box', price: 249.99, rating: 4.8, reviews: 60, category: 'Accessories', image: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=400&h=400&fit=crop', description: 'Luxury watch storage box' },
  { id: 'a18', name: 'Beaded Bracelet', price: 149.99, rating: 4.3, reviews: 95, category: 'Accessories', image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=400&h=400&fit=crop', description: 'Beaded bracelet' },
  { id: 'a19', name: 'Designer Wallet', price: 149.99, rating: 4.5, reviews: 390, category: 'Accessories', badge: 'NEW', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop', description: 'Premium designer wallet' },
  { id: 'a20', name: 'Designer Sunglasses', price: 189.99, rating: 4.5, reviews: 734, category: 'Accessories', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop', description: 'Designer sunglasses' },


  // Beauty Products - 20 items with REAL beauty images
  { id: 'b1', name: 'Essence Mascara Lash Princess', price: 9.99, rating: 4.9, reviews: 450, category: 'Beauty', badge: 'HOT', image: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png', description: 'Volumizing and lengthening mascara' },
  { id: 'b2', name: 'Eyeshadow Palette with Mirror', price: 19.99, rating: 4.8, reviews: 380, category: 'Beauty', badge: 'SALE', image: 'https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/1.png', description: 'Versatile eyeshadow palette with mirror' },
  { id: 'b3', name: 'Powder Canister', price: 14.99, rating: 4.6, reviews: 320, category: 'Beauty', image: 'https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/1.png', description: 'Loose setting powder canister' },
  { id: 'b4', name: 'Red Lipstick', price: 12.99, rating: 4.9, reviews: 580, category: 'Beauty', badge: 'HOT', image: 'https://cdn.dummyjson.com/products/images/beauty/Red%20Lipstick/1.png', description: 'Classic bold red lipstick' },
  { id: 'b5', name: 'Red Nail Polish', price: 8.99, rating: 4.5, reviews: 290, category: 'Beauty', image: 'https://cdn.dummyjson.com/products/images/beauty/Red%20Nail%20Polish/1.png', description: 'Vibrant red nail polish' },
  { id: 'b6', name: 'Calvin Klein CK One', price: 49.99, rating: 4.8, reviews: 410, category: 'Beauty', badge: 'LUXURY', image: 'https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/1.png', description: 'Iconic unisex fragrance' },
  { id: 'b7', name: 'Chanel Coco Noir Eau De', price: 129.99, rating: 4.9, reviews: 650, category: 'Beauty', badge: 'LUXURY', image: 'https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Noir%20Eau%20De/1.png', description: 'Elegant and mysterious fragrance' },
  { id: 'b8', name: 'Dior J\'adore', price: 89.99, rating: 4.7, reviews: 520, category: 'Beauty', image: 'https://cdn.dummyjson.com/products/images/fragrances/Dior%20J\'adore/1.png', description: 'Luxurious floral fragrance' },
  { id: 'b9', name: 'Dolce Shine Eau de', price: 69.99, rating: 4.6, reviews: 380, category: 'Beauty', image: 'https://cdn.dummyjson.com/products/images/fragrances/Dolce%20Shine%20Eau%20de/1.png', description: 'Fresh and radiant perfume' },
  { id: 'b10', name: 'Gucci Bloom Eau de', price: 79.99, rating: 4.8, reviews: 490, category: 'Beauty', badge: 'NEW', image: 'https://cdn.dummyjson.com/products/images/fragrances/Gucci%20Bloom%20Eau%20de/1.png', description: 'Rich white floral scent' },
  { id: 'b11', name: 'Attitude Hand Soap', price: 15.99, rating: 4.7, reviews: 280, category: 'Beauty', image: 'https://cdn.dummyjson.com/products/images/skin-care/Attitude%20Super%20Leaves%20Hand%20Soap/1.png', description: 'Natural hand soap with essential oils' },
  { id: 'b12', name: 'Vaseline Body Lotion', price: 18.99, rating: 4.8, reviews: 420, category: 'Beauty', badge: 'HOT', image: 'https://cdn.dummyjson.com/products/images/skin-care/Vaseline%20Men%20Body%20and%20Face%20Lotion/1.png', description: 'Moisturizing body and face lotion' },
  { id: 'b13', name: 'Anti-Aging Cream', price: 79.99, rating: 4.6, reviews: 340, category: 'Beauty', image: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png', description: 'Advanced anti-aging face cream' },
  { id: 'b14', name: 'Vitamin C Serum', price: 45.99, rating: 4.7, reviews: 410, category: 'Beauty', badge: 'NEW', image: 'https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/1.png', description: 'Brightening vitamin C serum' },
  { id: 'b15', name: 'Makeup Brush Set', price: 59.99, rating: 4.8, reviews: 520, category: 'Beauty', image: 'https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/1.png', description: 'Professional makeup brush collection' },
  { id: 'b16', name: 'Face Mask Sheet Pack', price: 24.99, rating: 4.6, reviews: 380, category: 'Beauty', image: 'https://cdn.dummyjson.com/products/images/beauty/Red%20Lipstick/1.png', description: 'Korean sheet face masks 10-pack' },
  { id: 'b17', name: 'Hair Serum', price: 32.99, rating: 4.5, reviews: 290, category: 'Beauty', image: 'https://cdn.dummyjson.com/products/images/beauty/Red%20Nail%20Polish/1.png', description: 'Nourishing hair serum with argan oil' },
  { id: 'b18', name: 'BB Cream SPF', price: 38.99, rating: 4.7, reviews: 350, category: 'Beauty', badge: 'SALE', image: 'https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/1.png', description: 'Multi-purpose BB cream with sun protection' },
  { id: 'b19', name: 'Eyelash Curler', price: 14.99, rating: 4.4, reviews: 220, category: 'Beauty', image: 'https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/1.png', description: 'Professional eyelash curler' },
  { id: 'b20', name: 'Makeup Remover', price: 19.99, rating: 4.6, reviews: 410, category: 'Beauty', image: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png', description: 'Gentle makeup remover cleanser' },

  // Sports Products - 20 items with REAL sports images
  { id: 's1', name: 'Cricket Helmet', price: 44.99, rating: 4.6, reviews: 320, category: 'Sports', badge: 'HOT', image: 'https://cdn.dummyjson.com/products/images/sports-accessories/Cricket%20Helmet/1.png', description: 'Protective cricket helmet' },
  { id: 's2', name: 'Football', price: 17.99, rating: 4.7, reviews: 580, category: 'Sports', image: 'https://cdn.dummyjson.com/products/images/sports-accessories/Football/1.png', description: 'Official size 5 football' },
  { id: 's3', name: 'Golf Ball', price: 9.99, rating: 4.5, reviews: 280, category: 'Sports', image: 'https://cdn.dummyjson.com/products/images/sports-accessories/Golf%20Ball/1.png', description: 'Professional golf balls pack' },
  { id: 's4', name: 'Tennis Ball', price: 5.99, rating: 4.4, reviews: 240, category: 'Sports', image: 'https://cdn.dummyjson.com/products/images/sports-accessories/Tennis%20Ball/1.png', description: 'High-quality tennis balls' },
  { id: 's5', name: 'Tennis Racquet', price: 49.99, rating: 4.8, reviews: 390, category: 'Sports', badge: 'SALE', image: 'https://cdn.dummyjson.com/products/images/sports-accessories/Tennis%20Racquet/1.png', description: 'Professional tennis racquet' },
  { id: 's6', name: 'Volleyball', price: 19.99, rating: 4.6, reviews: 310, category: 'Sports', image: 'https://cdn.dummyjson.com/products/images/sports-accessories/Volleyball/1.png', description: 'Official size volleyball' },
  { id: 's7', name: 'Sports Sneakers Off White Red', price: 89.99, rating: 4.7, reviews: 520, category: 'Sports', badge: 'HOT', image: 'https://cdn.dummyjson.com/products/images/mens-shoes/Sports%20Sneakers%20Off%20White%20Red/1.png', description: 'Comfortable sports sneakers' },
  { id: 's8', name: 'Nike Air Jordan 1', price: 149.99, rating: 4.9, reviews: 780, category: 'Sports', badge: 'HOT', image: 'https://cdn.dummyjson.com/products/images/mens-shoes/Nike%20Air%20Jordan%201%20Red%20And%20Black/1.png', description: 'Iconic Nike Air Jordan sneakers' },
  { id: 's9', name: 'Nike Shoes', price: 129.99, rating: 4.8, reviews: 640, category: 'Sports', image: 'https://cdn.dummyjson.com/products/images/mens-shoes/Nike%20Shoes/1.png', description: 'Premium Nike athletic shoes' },
  { id: 's10', name: 'Puma Future Rider', price: 89.99, rating: 4.6, reviews: 340, category: 'Sports', image: 'https://cdn.dummyjson.com/products/images/mens-shoes/Puma%20Future%20Rider%20Trainers/1.png', description: 'Stylish Puma trainers' },
  { id: 's11', name: 'Brown Leather Watch', price: 199.99, rating: 4.8, reviews: 420, category: 'Sports', badge: 'NEW', image: 'https://cdn.dummyjson.com/products/images/mens-watches/Brown%20Leather%20Belt%20Watch/1.png', description: 'Sports fitness watch' },
  { id: 's12', name: 'Longines Master Watch', price: 799.99, rating: 4.7, reviews: 280, category: 'Sports', badge: 'LUXURY', image: 'https://cdn.dummyjson.com/products/images/mens-watches/Longines%20Master%20Collection/1.png', description: 'Luxury sports watch' },
  { id: 's13', name: 'Rolex Submariner', price: 12999.99, rating: 5.0, reviews: 150, category: 'Sports', badge: 'LUXURY', image: 'https://cdn.dummyjson.com/products/images/mens-watches/Rolex%20Submariner%20Watch/1.png', description: 'Iconic diving watch' },
  { id: 's14', name: 'Heshe Women Leather Bag', price: 39.99, rating: 4.5, reviews: 290, category: 'Sports', image: 'https://cdn.dummyjson.com/products/images/womens-bags/Heshe%20Women\'s%20Leather%20Bag/1.png', description: 'Spacious gym duffle bag' },
  { id: 's15', name: 'Prada Women Bag', price: 49.99, rating: 4.6, reviews: 380, category: 'Sports', image: 'https://cdn.dummyjson.com/products/images/womens-bags/Prada%20Women%20Bag/1.png', description: 'Durable sports backpack' },
  { id: 's16', name: 'Women Handbag', price: 59.99, rating: 4.7, reviews: 340, category: 'Sports', image: 'https://cdn.dummyjson.com/products/images/womens-bags/Women%20Handbag%20Black/1.png', description: 'Elegant sports handbag' },
  { id: 's17', name: 'Blue Women Denim Jacket', price: 79.99, rating: 4.5, reviews: 260, category: 'Sports', image: 'https://cdn.dummyjson.com/products/images/womens-dresses/Blue%20Women\'s%20Denim%20Jacket/1.png', description: 'Casual sports jacket' },
  { id: 's18', name: 'Fancy Dress', price: 89.99, rating: 4.6, reviews: 310, category: 'Sports', image: 'https://cdn.dummyjson.com/products/images/womens-dresses/Fancy%20Dress/1.png', description: 'Athletic dress for yoga' },
  { id: 's19', name: 'Girl Summer Dress', price: 49.99, rating: 4.4, reviews: 220, category: 'Sports', image: 'https://cdn.dummyjson.com/products/images/womens-dresses/Girl%20Summer%20Dress/1.png', description: 'Light summer sports dress' },
  { id: 's20', name: 'Women Shoes', price: 69.99, rating: 4.7, reviews: 480, category: 'Sports', image: 'https://cdn.dummyjson.com/products/images/womens-shoes/Women%20Shoes/1.png', description: 'Comfortable athletic shoes' },

  { id: 'st1', name: 'Premium Notebook Set', price: 24.99, rating: 4.8, reviews: 320, category: 'Stationery', badge: 'NEW', image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400', description: 'Hardcover notebooks, 3-pack' },
  { id: 'st2', name: 'Gel Pen Collection', price: 12.99, rating: 4.7, reviews: 580, category: 'Stationery', badge: 'HOT', image: 'https://images.unsplash.com/photo-1586166762-e655a2d8c2eb?w=400', description: 'Smooth writing, 10 colors' },
  { id: 'st3', name: 'Sticky Notes Bundle', price: 8.99, rating: 4.6, reviews: 450, category: 'Stationery', image: 'https://images.unsplash.com/photo-1586166762-e655a2d8c2eb?w=400', description: 'Assorted sizes and colors' },
  { id: 'st4', name: 'Professional Planner', price: 29.99, rating: 4.9, reviews: 720, category: 'Stationery', badge: 'HOT', image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400', description: 'Daily planner with extras' },
  { id: 'st5', name: 'Mechanical Pencils', price: 15.99, rating: 4.5, reviews: 290, category: 'Stationery', image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400', description: '0.5mm, pack of 6' },
  { id: 'st6', name: 'Desk Organizer Set', price: 34.99, rating: 4.8, reviews: 410, category: 'Stationery', badge: 'SALE', image: 'https://images.unsplash.com/photo-1565011523534-747a8601f10a?w=400', description: 'Complete desk organization' },
  { id: 'st7', name: 'Highlighter Set', price: 9.99, rating: 4.6, reviews: 380, category: 'Stationery', image: 'https://images.unsplash.com/photo-1600493572929-eb725234f9b5?w=400', description: 'Pastel colors, 8-pack' },
  { id: 'st8', name: 'Bullet Journal', price: 19.99, rating: 4.9, reviews: 890, category: 'Stationery', badge: 'HOT', image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400', description: 'Dotted pages, premium paper' },
  { id: 'st9', name: 'Fountain Pen', price: 45.99, rating: 4.7, reviews: 210, category: 'Stationery', image: 'https://images.unsplash.com/photo-1563127892-89e0c5ed3e18?w=400', description: 'Elegant writing instrument' },
  { id: 'st10', name: 'Paper Clips & Binders', price: 6.99, rating: 4.4, reviews: 520, category: 'Stationery', image: 'https://images.unsplash.com/photo-1609107345012-e8e5edff7d73?w=400', description: 'Essential office supplies' },
  { id: 'st11', name: 'Washi Tape Set', price: 13.99, rating: 4.8, reviews: 640, category: 'Stationery', badge: 'NEW', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400', description: 'Decorative tape, 20 rolls' },
  { id: 'st12', name: 'Sketchbook A4', price: 16.99, rating: 4.7, reviews: 380, category: 'Stationery', image: 'https://images.unsplash.com/photo-1523294587484-bae6cc870010?w=400', description: 'Thick paper for drawing' },
  { id: 'st13', name: 'Erasable Pens', price: 11.99, rating: 4.5, reviews: 425, category: 'Stationery', badge: 'NEW', image: 'https://images.unsplash.com/photo-1565735513788-17c5c7c1f8b3?w=400', description: 'Frixion erasable, 6-pack' },
  { id: 'st14', name: 'Colored Pencil Set', price: 22.99, rating: 4.8, reviews: 510, category: 'Stationery', badge: 'HOT', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400', description: 'Professional grade, 48 colors' },
  { id: 'st15', name: 'Index Dividers', price: 7.99, rating: 4.3, reviews: 280, category: 'Stationery', image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400', description: 'Tabbed dividers, 12-pack' },
  { id: 'st16', name: 'Calligraphy Set', price: 38.99, rating: 4.6, reviews: 195, category: 'Stationery', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400', description: 'Complete calligraphy kit' },
  { id: 'st17', name: 'Correction Tape', price: 5.99, rating: 4.4, reviews: 340, category: 'Stationery', image: 'https://images.unsplash.com/photo-1596496356848-3091bbfc5d60?w=400', description: 'White out tape, 3-pack' },
  { id: 'st18', name: 'Leather Journal', price: 42.99, rating: 4.9, reviews: 680, category: 'Stationery', badge: 'SALE', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400', description: 'Handcrafted leather cover' },
  { id: 'st19', name: 'Acrylic Paint Markers', price: 18.99, rating: 4.7, reviews: 420, category: 'Stationery', badge: 'NEW', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400', description: 'Water-resistant, 12 colors' },
  { id: 'st20', name: 'Stapler & Staples', price: 14.99, rating: 4.5, reviews: 390, category: 'Stationery', image: 'https://images.unsplash.com/photo-1589395937920-9c0cddc1e0c4?w=400', description: 'Heavy duty stapler set' },
  { id: 'st21', name: 'Drawing Pens', price: 16.99, rating: 4.8, reviews: 540, category: 'Stationery', image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400', description: 'Fine liner set, various sizes' },
  { id: 'st22', name: 'Canvas Tote Bag', price: 19.99, rating: 4.6, reviews: 310, category: 'Stationery', badge: 'NEW', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400', description: 'For carrying supplies' },
  { id: 'st23', name: 'Watercolor Notebook', price: 21.99, rating: 4.7, reviews: 270, category: 'Stationery', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', description: 'Cold press watercolor paper' },
  { id: 'st24', name: 'Brush Pens', price: 24.99, rating: 4.8, reviews: 490, category: 'Stationery', badge: 'HOT', image: 'https://images.unsplash.com/photo-1461988625982-7e46a099bf4f?w=400', description: 'Calligraphy brush pens, 24pk' },
  { id: 'st25', name: 'Ruler Set', price: 9.99, rating: 4.4, reviews: 260, category: 'Stationery', image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=400', description: 'Metal and plastic rulers' },
  { id: 'st26', name: 'Dotted Journal', price: 17.99, rating: 4.9, reviews: 820, category: 'Stationery', badge: 'HOT', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400', description: 'Bullet journal style' },
  { id: 'st27', name: 'Permanent Markers', price: 10.99, rating: 4.5, reviews: 460, category: 'Stationery', image: 'https://images.unsplash.com/photo-1607454697996-dc629b8f3a25?w=400', description: 'Quick-dry, 12 colors' },
  { id: 'st28', name: 'Pencil Case', price: 12.99, rating: 4.6, reviews: 380, category: 'Stationery', image: 'https://images.unsplash.com/photo-1580654712603-eb43273aff33?w=400', description: 'Large capacity zipper case' },
  { id: 'st29', name: 'Graph Paper Notebook', price: 13.99, rating: 4.7, reviews: 320, category: 'Stationery', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', description: 'Engineering graph paper' },
  { id: 'st30', name: 'Ballpoint Pens', price: 8.99, rating: 4.5, reviews: 620, category: 'Stationery', image: 'https://images.unsplash.com/photo-1586723797358-4b4d939e7a15?w=400', description: 'Classic ballpoint, 20-pack' },
  { id: 'st31', name: 'Scissors Set', price: 15.99, rating: 4.6, reviews: 290, category: 'Stationery', image: 'https://images.unsplash.com/photo-1589395937920-9c0cddc1e0c4?w=400', description: 'Precision cutting, 3 sizes' },
  { id: 'st32', name: 'Ring Binder', price: 11.99, rating: 4.4, reviews: 410, category: 'Stationery', image: 'https://images.unsplash.com/photo-1553447859-4f5c48c17edd?w=400', description: '3-ring binder, 2-inch' },
  { id: 'st33', name: 'Charcoal Pencils', price: 19.99, rating: 4.8, reviews: 240, category: 'Stationery', badge: 'NEW', image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400', description: 'Artist grade charcoal set' },
  { id: 'st34', name: 'Document Holder', price: 23.99, rating: 4.7, reviews: 310, category: 'Stationery', image: 'https://images.unsplash.com/photo-1578410992178-f4d5f8fa5362?w=400', description: 'Expandable file organizer' },
  { id: 'st35', name: 'Spiral Notebook', price: 6.99, rating: 4.5, reviews: 580, category: 'Stationery', image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400', description: 'College ruled, 5-pack' },
  { id: 'st36', name: 'White Board Markers', price: 13.99, rating: 4.6, reviews: 440, category: 'Stationery', badge: 'SALE', image: 'https://images.unsplash.com/photo-1560173209-86a79e936acc?w=400', description: 'Dry erase markers, 8-pack' },
  { id: 'st37', name: 'Pencil Sharpener', price: 7.99, rating: 4.4, reviews: 370, category: 'Stationery', image: 'https://images.unsplash.com/photo-1595239244990-c37f98e8c4d8?w=400', description: 'Electric and manual combo' },
  { id: 'st38', name: 'Art Portfolio', price: 32.99, rating: 4.8, reviews: 220, category: 'Stationery', badge: 'NEW', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400', description: 'A3 size art case' },
  { id: 'st39', name: 'Rollerball Pens', price: 20.99, rating: 4.7, reviews: 350, category: 'Stationery', image: 'https://images.unsplash.com/photo-1595475207225-428b7cc97f3e?w=400', description: 'Smooth ink flow, luxury' },
  { id: 'st40', name: 'Label Maker', price: 49.99, rating: 4.9, reviews: 530, category: 'Stationery', badge: 'HOT', image: 'https://images.unsplash.com/photo-1591768793355-74d04bb6608f?w=400', description: 'Portable label printer' }

];



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
          i.id === productId
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
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
export default App;