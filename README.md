⚡ SwiftCart — Hyperlocal Quick-Commerce & Micro-Warehouse SystemAn end-to-end full-stack 10-minute grocery delivery ecosystem inspired by Zepto, Blinkit & Swiggy Instamart. Built as an academic mini-project featuring atomic inventory locking, live rider telemetry, dark store order picking queues, and MySQL persistence.🌟 Key ModulesModuleInterfaceCore TechKey HighlightsStorefrontswiftcart_app.htmlHTML5, Tailwind CSS, JavaScriptSub-second catalog search, category filtering, responsive cart drawer, real-time MySQL stock tags.Core Engineserver.jsNode.js, Express.js, MySQL2Atomic stock deductions (FOR UPDATE), 4-digit handover OTP engine, resilient auto-failover buffer.Live Rider GPSrider_tracking.htmlHTML5 2D Canvas Context API60 FPS road waypoint interpolation, rider speed/battery HUD, doorstep OTP validation.Ops Adminadmin_analytics.htmlSVG Data Visualizer, CanvasIndore 4-Hub geofence heatmap, 90s packer SLA metrics, AI-driven stock-out warnings.User Hubprofile.htmlVanilla JS Tab ControllerSaved address manager, 1-click reorder trigger, SwiftPay wallet cards.🏛️ System Architecture[ Customer Browser ] (swiftcart_app.html)
        │
        │ 1. POST /api/orders/checkout (Items, Name, Address)
        ▼
[ Node.js + Express.js API ] (server.js:5000)
        │
        ├─► 2. SQL Transaction (SELECT ... FOR UPDATE) -> Atomic Stock Lock
        ├─► 3. Generate Unique Order ID (SC-XXXX) & Secret 4-Digit OTP
        ├─► 4. Commit to MySQL (`orders` & `order_items` tables)
        │
        ▼ 5. Return JSON payload to Frontend
[ Live Rider Telemetry HUD ] (rider_tracking.html)
        │
        ├─► Waypoint Linear Interpolation (60 FPS Canvas)
        └─► POST /api/orders/:id/verify-otp -> Doorstep Handover Handshake
🚀 Quick Setup & InstallationPrerequisitesNode.js (v18.x or later)MySQL Server (v8.0+ or XAMPP / MySQL Workbench)Modern Web Browser (Chrome, Edge, Firefox)1. Clone Repositorygit clone https://github.com/YOUR_USERNAME/swiftcart-quick-commerce.git
cd swiftcart-quick-commerce
2. Install Backend Dependenciesnpm install express cors mysql2
3. Setup MySQL DatabaseOpen MySQL Workbench or phpMyAdmin.Execute the script inside database.sql (Creates swiftcart_db, seeds dark stores & catalog products).Open server.js and set your MySQL password at line 24 (or configure environment variables):password: process.env.DB_PASSWORD || 'your_mysql_password',
4. Start the Application# Start backend server (Runs on http://localhost:5000)
node server.js
Now launch swiftcart_app.html using VS Code Live Server or double-click to open it in your browser.📊 Database Schema (swiftcart_db)dark_stores: Stores local micro-warehouse geofences, active rider counts, and current capacity load.products: SKU catalog, category mapping, aisle coordinates, and real-time inventory count.orders: Transaction records, total amount, delivery partner assignment, and 4-digit verification OTP.order_items: Itemized lines per order for financial and inventory audit trails.👥 4-Member Team Engineering RolesMemberAssigned DomainCore DeliverablesKey ResponsibilitiesMember 1Frontend Leadswiftcart_app.html, profile.htmlResponsive Tailwind layout, live inventory tags, sub-second search debouncing, and cart drawer state.Member 2Backend & Database Architectserver.js, database.sqlExpress.js REST API routes, MySQL transaction management (FOR UPDATE), atomic stock deduction, and error resilience.Member 3Warehouse & Operations Leadadmin_analytics.html, TelemetryDark store capacity heatmaps, 90-second packing queue telemetry, and predictive reorder alerts.Member 4Fleet & Dispatch Systems Leadrider_tracking.html, Canvas GPS60 FPS Canvas waypoint animation (linear interpolation), speedometer HUD, and 4-digit delivery OTP validation.🛡️ LicenseThis project is created for educational and academic demonstration purposes under the MIT License.
