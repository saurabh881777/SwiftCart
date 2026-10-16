/**
 * SwiftCart - Hyperlocal Quick-Commerce Backend API Engine
 * Tech Stack: Node.js, Express.js, CORS
 * Designed for College Mini Project & Viva Demonstration
 */

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors());
app.use(express.json());

// 1. In-Memory Mock Database
let inventoryDB = [
    { id: 1, name: 'Fresh Farm Onions (Pyaz)', category: 'produce', weight: '1 kg', price: 35, stock: 45, aisle: 'A1-Bin02' },
    { id: 2, name: 'Ripe Red Local Tomatoes', category: 'produce', weight: '500 g', price: 25, stock: 60, aisle: 'A1-Bin03' },
    { id: 3, name: 'Amul Taaza Milk Carton', category: 'dairy', weight: '500 ml', price: 27, stock: 14, aisle: 'Cold-PU04' },
    { id: 4, name: 'Britannia Whole Wheat Bread', category: 'dairy', weight: '400 g', price: 40, stock: 18, aisle: 'A2-Bin01' },
    { id: 5, name: 'Amul Salted Table Butter', category: 'dairy', weight: '100 g', price: 58, stock: 22, aisle: 'Cold-PU01' },
    { id: 6, name: 'Brown Farm Fresh Eggs', category: 'meat', weight: '6 Pack', price: 52, stock: 11, aisle: 'A3-Bin08' },
    { id: 7, name: "Lay's India's Magic Masala", category: 'snacks', weight: '50 g', price: 20, stock: 80, aisle: 'A4-Bin12' },
    { id: 8, name: 'Haldiram Ratlami Bhujia Sev', category: 'snacks', weight: '200 g', price: 55, stock: 35, aisle: 'A4-Bin14' },
    { id: 9, name: 'Coca Cola Chilled Bottle', category: 'drinks', weight: '750 ml', price: 40, stock: 25, aisle: 'Cold-DR02' },
    { id: 10, name: 'Fresh Curry Cut Chicken', category: 'meat', weight: '500 g', price: 165, stock: 9, aisle: 'Cold-MT01' }
];

let ordersDB = [
    {
        orderId: 'SC-9042',
        customerName: 'Rohit Sharma',
        customerAddress: 'Flat 402, Royal Palms, Scheme 54, PU-4, Indore',
        items: [
            { id: 3, name: 'Amul Taaza Milk Carton', qty: 1, price: 27 },
            { id: 6, name: 'Brown Farm Fresh Eggs', qty: 1, price: 52 },
            { id: 4, name: 'Britannia Whole Wheat Bread', qty: 1, price: 40 },
            { id: 7, name: "Lay's India's Magic Masala", qty: 2, price: 40 }
        ],
        subtotal: 159,
        deliveryFee: 0,
        handlingFee: 5,
        totalAmount: 164,
        paymentStatus: 'PAID_VIA_UPI',
        orderStatus: 'OUT_FOR_DELIVERY',
        deliveryOTP: '8419',
        assignedRider: {
            name: 'Ramesh Patidar',
            phone: '+91 98XXX-XX120',
            vehicle: 'EV Scooter (MP-09-EV-4821)',
            rating: 4.94,
            currentCoords: { lat: 22.7533, lng: 75.8937 }
        },
        createdAt: new Date().toISOString()
    }
];

let darkStoresDB = [
    { id: 'ind-04', name: 'Vijay Nagar Hub #IND-04', location: 'Scheme 54, Indore', activeOrders: 46, activeRiders: 22, loadFactor: 91, status: 'SURGE' },
    { id: 'ind-02', name: 'Palasia Hub #IND-02', location: 'Old Palasia, Indore', activeOrders: 28, activeRiders: 18, loadFactor: 62, status: 'NORMAL' },
    { id: 'ind-07', name: 'Bhawarkua Hub #IND-07', location: 'Bhawarkua Square, Indore', activeOrders: 52, activeRiders: 19, loadFactor: 84, status: 'HEAVY' },
    { id: 'ind-09', name: 'Super Corridor Hub #IND-09', location: 'TCS Square, Indore', activeOrders: 16, activeRiders: 9, loadFactor: 48, status: 'NORMAL' }
];

// API 0: Health Check Route
app.get('/', (req, res) => {
    res.json({
        status: 'ONLINE',
        system: 'SwiftCart Hyperlocal Dark Store Engine',
        version: 'v3.2',
        city: 'Indore, MP',
        activeDarkStores: darkStoresDB.length
    });
});

// API 1: Get Catalog / Search Inventory
app.get('/api/products', (req, res) => {
    const { category, search } = req.query;
    let results = [...inventoryDB];

    if (category && category !== 'all') {
        results = results.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
        const query = search.toLowerCase();
        results = results.filter(item => item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query));
    }

    res.json({
        success: true,
        count: results.length,
        data: results
    });
});

// API 2: Create New Order & Soft-Lock Stock
app.post('/api/orders/checkout', (req, res) => {
    try {
        const { items, customerName, customerAddress, paymentMode } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart cannot be empty' });
        }

        let calculatedSubtotal = 0;
        let lineItems = [];

        // Inventory verification & deduction check
        for (const cartItem of items) {
            const product = inventoryDB.find(p => p.id === cartItem.id);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product ID ${cartItem.id} not found` });
            }
            if (product.stock < cartItem.qty) {
                return res.status(400).json({ success: false, message: `Stock unavailable for ${product.name}. Only ${product.stock} units remaining.` });
            }

            // Deduct stock
            product.stock -= cartItem.qty;

            const itemCost = product.price * cartItem.qty;
            calculatedSubtotal += itemCost;
            lineItems.push({
                id: product.id,
                name: product.name,
                qty: cartItem.qty,
                price: product.price
            });
        }

        const handlingFee = 5;
        const totalPayable = calculatedSubtotal + handlingFee;
        const newOrderId = `SC-${Math.floor(1000 + Math.random() * 9000)}`;
        const secretOTP = Math.floor(1000 + Math.random() * 9000).toString();

        const newOrder = {
            orderId: newOrderId,
            customerName: customerName || 'Rohit Sharma',
            customerAddress: customerAddress || 'Flat 402, Royal Palms, Scheme 54, Indore',
            items: lineItems,
            subtotal: calculatedSubtotal,
            handlingFee: handlingFee,
            deliveryFee: 0,
            totalAmount: totalPayable,
            paymentStatus: paymentMode || 'PAID_ONLINE',
            orderStatus: 'PACKED',
            deliveryOTP: secretOTP,
            assignedRider: {
                name: 'Ramesh Patidar',
                phone: '+91 98XXX-XX120',
                vehicle: 'EV Scooter (MP-09-EV-4821)',
                rating: 4.94,
                currentCoords: { lat: 22.7533, lng: 75.8937 }
            },
            createdAt: new Date().toISOString()
        };

        ordersDB.unshift(newOrder);

        res.status(201).json({
            success: true,
            message: 'Order accepted by Vijay Nagar Dark Store #04. Picking initiated.',
            order: newOrder
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// API 3: Get Live Order Status & GPS Location
app.get('/api/orders/:orderId/track', (req, res) => {
    const { orderId } = req.params;
    const order = ordersDB.find(o => o.orderId === orderId);

    if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
        success: true,
        orderId: order.orderId,
        orderStatus: order.orderStatus,
        deliveryOTP: order.deliveryOTP,
        rider: order.assignedRider,
        slaRemainingSeconds: 462,
        estimatedDeliveryTime: '8 Mins'
    });
});

// API 4: Doorstep Delivery Handover with OTP Verification
app.post('/api/orders/:orderId/verify-otp', (req, res) => {
    const { orderId } = req.params;
    const { inputOTP } = req.body;

    const order = ordersDB.find(o => o.orderId === orderId);

    if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.deliveryOTP !== inputOTP) {
        return res.status(400).json({ success: false, message: 'Invalid 4-digit Delivery OTP. Handover rejected!' });
    }

    order.orderStatus = 'DELIVERED';
    order.deliveredAt = new Date().toISOString();

    res.json({
        success: true,
        message: 'OTP verified successfully! Order marked as DELIVERED.',
        orderStatus: order.orderStatus
    });
});

// API 5: Admin Operations & Telemetry
app.get('/api/admin/telemetry', (req, res) => {
    const criticalSKUs = inventoryDB.filter(item => item.stock < 15);
    const totalOrdersCount = ordersDB.length + 1412;
    const totalGMV = (ordersDB.reduce((acc, curr) => acc + curr.totalAmount, 0) + 348290);

    res.json({
        success: true,
        hubsOnline: darkStoresDB,
        metrics: {
            avgSLA: '08:14',
            activeInTransit: 142,
            fleetUtilization: '86%',
            todayGMV: `₹${totalGMV.toLocaleString('en-IN')}`,
            basketAOV: '₹246',
            criticalStockAlerts: criticalSKUs.length
        },
        lowStockItems: criticalSKUs
    });
});

app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 SwiftCart Backend Core API Engine is running!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🛒 Products: GET http://localhost:${PORT}/api/products`);
    console.log(`📊 Telemetry: GET http://localhost:${PORT}/api/admin/telemetry`);
    console.log(`🛵 Live Order Track: GET http://localhost:${PORT}/api/orders/SC-9042/track`);
    console.log(`=================================================`);
});