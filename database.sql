-- SwiftCart Hyperlocal Quick-Commerce MySQL Database Setup
-- Run this in MySQL Workbench, phpMyAdmin (XAMPP), or MySQL CLI

CREATE DATABASE IF NOT EXISTS swiftcart_db;
USE swiftcart_db;

-- 1. Dark Stores Table
CREATE TABLE IF NOT EXISTS dark_stores (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    active_orders INT DEFAULT 0,
    active_riders INT DEFAULT 0,
    load_factor INT DEFAULT 50,
    status VARCHAR(50) DEFAULT 'NORMAL'
);

-- 2. Products / Inventory Table
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    weight VARCHAR(50) NOT NULL,
    price INT NOT NULL,
    stock INT NOT NULL DEFAULT 50,
    aisle VARCHAR(100) NOT NULL,
    image_url TEXT
);

-- 3. Customer Orders Table
CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(50) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_address TEXT NOT NULL,
    subtotal INT NOT NULL,
    handling_fee INT DEFAULT 5,
    total_amount INT NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'PAID_VIA_UPI',
    order_status VARCHAR(50) DEFAULT 'PACKED',
    delivery_otp VARCHAR(10) NOT NULL,
    rider_name VARCHAR(100) DEFAULT 'Ramesh Patidar',
    rider_phone VARCHAR(50) DEFAULT '+91 98XXX-XX120',
    rider_vehicle VARCHAR(100) DEFAULT 'EV Scooter (MP-09-EV-4821)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Order Line Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(50) NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    qty INT NOT NULL,
    price INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- 5. Seed Initial Dark Stores (Indore Hyperlocal Network)
INSERT INTO dark_stores (id, name, location, active_orders, active_riders, load_factor, status)
VALUES 
    ('ind-04', 'Vijay Nagar Hub #IND-04', 'Scheme 54, Indore', 46, 22, 91, 'SURGE'),
    ('ind-02', 'Palasia Hub #IND-02', 'Old Palasia, Indore', 28, 18, 62, 'NORMAL'),
    ('ind-07', 'Bhawarkua Hub #IND-07', 'Bhawarkua Square, Indore', 52, 19, 84, 'HEAVY'),
    ('ind-09', 'Super Corridor Hub #IND-09', 'TCS Square, Indore', 16, 9, 48, 'NORMAL')
ON DUPLICATE KEY UPDATE name=name;

-- 6. Seed Real-world Inventory
INSERT INTO products (id, name, category, weight, price, stock, aisle, image_url)
VALUES
    (1, 'Fresh Farm Onions (Pyaz)', 'produce', '1 kg', 35, 45, 'A1-Bin02', 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80'),
    (2, 'Ripe Red Local Tomatoes', 'produce', '500 g', 25, 60, 'A1-Bin03', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80'),
    (3, 'Amul Taaza Milk Carton', 'dairy', '500 ml', 27, 14, 'Cold-PU04', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80'),
    (4, 'Britannia Whole Wheat Bread', 'dairy', '400 g', 40, 18, 'A2-Bin01', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80'),
    (5, 'Amul Salted Table Butter', 'dairy', '100 g', 58, 22, 'Cold-PU01', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80'),
    (6, 'Brown Farm Fresh Eggs', 'meat', '6 Pack', 52, 11, 'A3-Bin08', 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80'),
    (7, "Lay's India's Magic Masala", 'snacks', '50 g', 20, 80, 'A4-Bin12', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80'),
    (8, 'Haldiram Ratlami Bhujia Sev', 'snacks', '200 g', 55, 35, 'A4-Bin14', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80'),
    (9, 'Coca Cola Chilled Bottle', 'drinks', '750 ml', 40, 25, 'Cold-DR02', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80'),
    (10, 'Fresh Curry Cut Chicken', 'meat', '500 g', 165, 9, 'Cold-MT01', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80')
ON DUPLICATE KEY UPDATE name=name;