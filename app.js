// NextGen Cyber Mobile Store Application Logic

// Default Store Configuration Data
const defaultData = {
    settings: {
        storeName: "CYBER MOBILE",
        adminPassword: "admin123",
        logoUrl: "https://cdn-icons-png.flaticon.com/512/3616/3616856.png",
        announcement: "🔥 HOT DEAL: ඕනෑම ස්මාර්ට්ෆෝන් සහ උපාංග සඳහා දිවයින පුරා සුරක්ෂිත ඛෙදාහැරීම!",
        banners: [
            {
                title: "NEXT-GEN SMARTPHONES 2026",
                subtitle: "නවතම iPhone 15 Pro Max, Galaxy S24 Ultra විශේෂ වට්ටම් සහිතව!",
                image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80"
            },
            {
                title: "ORIGINAL MOBILE ACCESSORIES",
                subtitle: "Fast Chargers, Tempered Glass, Covers සඳහා 20% Discount!",
                image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=80"
            },
            {
                title: "PREMIUM AUDIO & SMARTWATCHES",
                subtitle: "AirPods Pro & Ultra Smartwatches දිවයින පුරා ඛෙදාහැරීම නොමිලේ",
                image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80"
            }
        ]
    },
    categories: ["Smartphones", "Accessories", "Smart Watches", "Audio"],
    products: [
        {
            id: 201,
            title: "iPhone 15 Pro Max 256GB",
            category: "Smartphones",
            price: 415000,
            desc: "Titanium Frame, A17 Pro Chip, 5X Telephoto Camera.",
            image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 202,
            title: "Samsung Galaxy S24 Ultra",
            category: "Smartphones",
            price: 395000,
            desc: "200MP AI Camera, Built-in S-Pen, Snapdragon 8 Gen 3.",
            image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 203,
            title: "Anker 65W GaN Fast Charger",
            category: "Accessories",
            price: 8500,
            desc: "Multi-device ultra fast charging for Laptops & Phones.",
            image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 204,
            title: "Apple AirPods Pro (2nd Gen USB-C)",
            category: "Audio",
            price: 72000,
            desc: "Noise Cancellation, Adaptive Audio, MagSafe Case.",
            image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 205,
            title: "Apple Watch Ultra 2 Titanium",
            category: "Smart Watches",
            price: 245000,
            desc: "49mm Titanium Case, Precision Dual-Frequency GPS.",
            image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80"
        }
    ],
    orders: []
};

// Global State
let cart = [];
let activeCategory = 'ALL';
let currentSlideIndex = 0;
let slideInterval = null;

// Initialize Persistent Data
function initData() {
    if (!localStorage.getItem('cyber_settings')) {
        localStorage.setItem('cyber_settings', JSON.stringify(defaultData.settings));
    }
    if (!localStorage.getItem('cyber_categories')) {
        localStorage.setItem('cyber_categories', JSON.stringify(defaultData.categories));
    }
    if (!localStorage.getItem('cyber_products')) {
        localStorage.setItem('cyber_products', JSON.stringify(defaultData.products));
    }
    if (!localStorage.getItem('cyber_orders')) {
        localStorage.setItem('cyber_orders', JSON.stringify(defaultData.orders));
    }

    // Load Persistent Cart
    const savedCart = localStorage.getItem('cyber_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }

    // Track Daily Visitors Counter
    trackDailyVisitors();
}

initData();

// Daily Visitors Analytics Counter Logic
function trackDailyVisitors() {
    const todayStr = new Date().toISOString().split('T')[0];
    const visitorKey = `cyber_visits_${todayStr}`;
    let todayVisits = parseInt(localStorage.getItem(visitorKey) || '0');

    // Track unique session
    if (!sessionStorage.getItem('visited_today')) {
        todayVisits += 1;
        localStorage.setItem(visitorKey, todayVisits);
        sessionStorage.setItem('visited_today', 'true');
    }

    // Track total all-time pageviews
    let totalPageviews = parseInt(localStorage.getItem('cyber_total_pageviews') || '0');
    totalPageviews += 1;
    localStorage.setItem('cyber_total_pageviews', totalPageviews);
}

// On Document Load
document.addEventListener('DOMContentLoaded', () => {
    loadHeaderUI();
    
    if (document.getElementById('productGrid')) {
        renderBanners();
        renderCategoryButtons();
        renderProducts();
        updateCartUI();
        loadAuthUserUI();
    }

    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});

// Load Store UI (Name & Logo)
function loadHeaderUI() {
    const settings = JSON.parse(localStorage.getItem('cyber_settings'));
    
    const logoImg = document.getElementById('shopLogo');
    if (logoImg && settings.logoUrl) logoImg.src = settings.logoUrl;

    const storeNameEl = document.getElementById('storeName');
    if (storeNameEl) storeNameEl.textContent = settings.storeName;

    const footerNameEl = document.getElementById('footerStoreName');
    if (footerNameEl) footerNameEl.textContent = settings.storeName;

    const announceEl = document.getElementById('announcementText');
    if (announceEl) announceEl.textContent = settings.announcement;
}

// MULTI-BANNER SLIDER CAROUSEL LOGIC
function renderBanners() {
    const slider = document.getElementById('bannerSlider');
    const dotsContainer = document.getElementById('sliderDots');
    if (!slider) return;

    const settings = JSON.parse(localStorage.getItem('cyber_settings'));
    const banners = settings.banners || [];

    slider.innerHTML = '';
    dotsContainer.innerHTML = '';

    banners.forEach((b, index) => {
        const slide = document.createElement('div');
        slide.className = 'banner-slide';
        slide.style.backgroundImage = `url('${b.image}')`;
        slide.innerHTML = `
            <div class="banner-overlay">
                <h2>${b.title}</h2>
                <p>${b.subtitle}</p>
                <a href="#products" class="btn btn-accent"><i class="fa-solid fa-bolt"></i> දැන්ම මිලදී ගන්න</a>
            </div>
        `;
        slider.appendChild(slide);

        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });

    startAutoSlide();
}

function startAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        nextSlide();
    }, 4500);
}

function updateSliderPosition() {
    const slider = document.getElementById('bannerSlider');
    const dots = document.querySelectorAll('.dot');
    if (!slider) return;

    slider.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlideIndex);
    });
}

function nextSlide() {
    const settings = JSON.parse(localStorage.getItem('cyber_settings'));
    const count = settings.banners.length;
    currentSlideIndex = (currentSlideIndex + 1) % count;
    updateSliderPosition();
}

function prevSlide() {
    const settings = JSON.parse(localStorage.getItem('cyber_settings'));
    const count = settings.banners.length;
    currentSlideIndex = (currentSlideIndex - 1 + count) % count;
    updateSliderPosition();
}

function goToSlide(idx) {
    currentSlideIndex = idx;
    updateSliderPosition();
    startAutoSlide();
}

// CATEGORIES & PRODUCTS
function renderCategoryButtons() {
    const container = document.getElementById('categoryContainer');
    if (!container) return;

    const categories = JSON.parse(localStorage.getItem('cyber_categories')) || [];
    container.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.className = `cat-btn ${activeCategory === 'ALL' ? 'active' : ''}`;
    allBtn.innerHTML = '<i class="fa-solid fa-border-all"></i> සියල්ල (All)';
    allBtn.onclick = () => filterCategory('ALL');
    container.appendChild(allBtn);

    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `cat-btn ${activeCategory === cat ? 'active' : ''}`;
        btn.textContent = cat;
        btn.onclick = () => filterCategory(cat);
        container.appendChild(btn);
    });
}

function filterCategory(catName) {
    activeCategory = catName;
    renderCategoryButtons();
    renderProducts();
}

function renderProducts() {
    const grid = document.getElementById('productGrid');
    const products = JSON.parse(localStorage.getItem('cyber_products')) || [];

    if (!grid) return;
    grid.innerHTML = '';

    let filtered = products;
    if (activeCategory !== 'ALL') {
        filtered = products.filter(p => p.category === activeCategory);
    }

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 40px; color: var(--text-muted);">මෙම කාණ්ඩයේ නිෂ්පාදන නොමැත.</p>';
        return;
    }

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <span class="category-badge">${p.category}</span>
            <img src="${p.image}" alt="${p.title}" class="product-img" onerror="this.src='https://via.placeholder.com/300x200?text=Mobile+Store'">
            <div class="product-info">
                <div class="product-title">${p.title}</div>
                <div class="product-desc">${p.desc || ''}</div>
                <div class="product-bottom">
                    <div class="product-price">Rs. ${p.price.toLocaleString()}</div>
                    <button class="btn btn-primary btn-sm" onclick="addToCart(${p.id})">
                        <i class="fa-solid fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function handleSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const products = JSON.parse(localStorage.getItem('cyber_products')) || [];
    const grid = document.getElementById('productGrid');

    grid.innerHTML = '';
    const filtered = products.filter(p => p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <span class="category-badge">${p.category}</span>
            <img src="${p.image}" class="product-img">
            <div class="product-info">
                <div class="product-title">${p.title}</div>
                <div class="product-bottom">
                    <div class="product-price">Rs. ${p.price.toLocaleString()}</div>
                    <button class="btn btn-primary btn-sm" onclick="addToCart(${p.id})">Add to Cart</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// PERSISTENT CART LOGIC (Saved in LocalStorage)
function addToCart(productId) {
    const products = JSON.parse(localStorage.getItem('cyber_products')) || [];
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
    } else {
        cart.push({ id: prod.id, title: prod.title, price: prod.price, qty: 1 });
    }

    saveCart();
    updateCartUI();
    openCart();
}

function saveCart() {
    localStorage.setItem('cyber_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const countSpan = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (countSpan) countSpan.textContent = totalItems;

    const cartItemsDiv = document.getElementById('cartItems');
    const totalSpan = document.getElementById('cartTotal');
    
    let grandTotal = 0;

    if (cartItemsDiv) {
        cartItemsDiv.innerHTML = '';
        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 15px;">Cart එක හිස්ව පවතී.</p>';
        } else {
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.qty;
                grandTotal += itemTotal;

                const row = document.createElement('div');
                row.className = 'cart-item';
                row.innerHTML = `
                    <div>
                        <strong>${item.title}</strong>
                        <div style="font-size: 0.82rem; color: var(--text-muted);">Rs. ${item.price.toLocaleString()} x ${item.qty}</div>
                    </div>
                    <div>
                        <span style="font-weight: bold; margin-right: 10px; color: var(--neon-red);">Rs. ${itemTotal.toLocaleString()}</span>
                        <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">&times;</button>
                    </div>
                `;
                cartItemsDiv.appendChild(row);
            });
        }
    } else {
        grandTotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    }

    if (totalSpan) totalSpan.textContent = grandTotal.toLocaleString();

    // Persistent Bottom Floating Cart Bar
    const pCartBar = document.getElementById('persistentCartBar');
    if (pCartBar) {
        if (cart.length > 0) {
            pCartBar.classList.remove('hidden');
            document.getElementById('pCartItemCount').textContent = totalItems;
            document.getElementById('pCartTotal').textContent = grandTotal.toLocaleString();
        } else {
            pCartBar.classList.add('hidden');
        }
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function openCart() {
    const modal = document.getElementById('cartModal');
    if (modal) modal.classList.add('active');
}

function closeCart() {
    const modal = document.getElementById('cartModal');
    if (modal) modal.classList.remove('active');
}

// CHECKOUT DIRECT ORDER
function handleCheckout(e) {
    e.preventDefault();

    if (cart.length === 0) {
        alert("කරුණාකර පළමුව භාණ්ඩයක් Cart එකට එකතු කරගන්න!");
        return;
    }

    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    const city = document.getElementById('custCity').value.trim();
    const notes = document.getElementById('orderNotes').value.trim();

    let grandTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    const newOrder = {
        id: orderId,
        date: new Date().toLocaleString(),
        customer: { name, phone, address, city, notes },
        items: [...cart],
        total: grandTotal,
        status: 'Pending'
    };

    const ordersLog = JSON.parse(localStorage.getItem('cyber_orders')) || [];
    ordersLog.unshift(newOrder);
    localStorage.setItem('cyber_orders', JSON.stringify(ordersLog));

    // Reset
    document.getElementById('checkoutForm').reset();
    cart = [];
    saveCart();
    updateCartUI();
    closeCart();

    // Show Success Modal
    document.getElementById('successOrderId').textContent = `Order ID: ${orderId}`;
    document.getElementById('successMsg').textContent = `ස්තූතියි ${name}! ඔබගේ ඇණවුම සාර්ථකව Admin Panel එකට යොමු කෙරිණි.`;
    document.getElementById('successModal').classList.add('active');
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
}

// SOCIAL LOGIN & AUTH MODAL (Google, FB, VK)
function openAuthModal() {
    document.getElementById('authModal').classList.add('active');
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
}

function mockSocialLogin(provider) {
    const mockUser = {
        name: `User (${provider})`,
        email: `user_${Math.floor(Math.random()*1000)}@${provider.toLowerCase()}.com`,
        provider: provider
    };
    localStorage.setItem('cyber_user', JSON.stringify(mockUser));
    loadAuthUserUI();
    closeAuthModal();
    alert(`${provider} හරහා සාර්ථකව Logged In විය!`);
}

function handleEmailAuth(e) {
    e.preventDefault();
    const email = document.getElementById('authEmail').value.trim();
    const mockUser = { name: email.split('@')[0], email: email, provider: 'Email' };
    localStorage.setItem('cyber_user', JSON.stringify(mockUser));
    loadAuthUserUI();
    closeAuthModal();
    alert("සාර්ථකව Account එකට Logged In විය!");
}

function loadAuthUserUI() {
    const user = JSON.parse(localStorage.getItem('cyber_user'));
    const navText = document.getElementById('navAuthText');
    if (navText && user) {
        navText.textContent = user.name;
    }
}

// SUPPORT WIDGET & AI ASSISTANT CHATBOT
function toggleSupportMenu() {
    document.getElementById('supportMenu').classList.toggle('hidden');
}

function toggleAIChat() {
    document.getElementById('aiChatWindow').classList.toggle('hidden');
}

function handleAIPress(e) {
    if (e.key === 'Enter') sendAIMessage();
}

function sendAIMessage() {
    const input = document.getElementById('aiInput');
    const msg = input.value.trim();
    if (!msg) return;

    const msgContainer = document.getElementById('aiChatMessages');

    // Append User Msg
    const userDiv = document.createElement('div');
    userDiv.className = 'ai-msg user';
    userDiv.textContent = msg;
    msgContainer.appendChild(userDiv);

    input.value = '';

    // Bot Response logic
    setTimeout(() => {
        const botDiv = document.createElement('div');
        botDiv.className = 'ai-msg bot';

        const text = msg.toLowerCase();
        if (text.includes('hi') || text.includes('hello') || text.includes('හලෝ')) {
            botDiv.textContent = '👋 ආයුබෝවන්! Cyber Mobile වෙතින් ඔබට උදව් කරන්නේ කෙසේද?';
        } else if (text.includes('phone') || text.includes('iphone') || text.includes('samsung')) {
            botDiv.textContent = '📱 අප සතුව iPhone 15 Pro, S24 Ultra ඇතුළු සියලුම නවතම ෆෝන් Warranty සහිතව ඇත. Category එකෙන් තෝරන්න!';
        } else if (text.includes('price') || text.includes('මිල')) {
            botDiv.textContent = '💰 සියලුම භාණ්ඩවල නිවැරදිම මිල ගණන් Store එකෙහි දක්වා ඇත. Cart එකට එකතු කර පහසුවෙන්ම Order කරන්න!';
        } else if (text.includes('support') || text.includes('call') || text.includes('number')) {
            botDiv.textContent = '📞 අපගේ Customer Support Hotline එක 0729713164 වේ. ඕනෑම වෙලාවක ඇමතුමක් ලබාදෙන්න.';
        } else {
            botDiv.textContent = '🤖 ස්තූතියි පණිවිඩයට! වැඩිදුර තොරතුරු සඳහා 0729713164 අංකයට ඇමතුමක් ලබාගන්න.';
        }

        msgContainer.appendChild(botDiv);
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }, 600);
}

// ADMIN DASHBOARD CONTROLLER FUNCTIONS
function initAdminPage() {
    // Check if password lock active
    const isUnlocked = sessionStorage.getItem('admin_unlocked');
    if (!isUnlocked) {
        document.getElementById('adminAuthLock').classList.remove('hidden');
    } else {
        document.getElementById('adminAuthLock').classList.add('hidden');
    }

    loadAdminData();
}

function unlockAdmin(e) {
    e.preventDefault();
    const inputPass = document.getElementById('adminPassInput').value;
    const settings = JSON.parse(localStorage.getItem('cyber_settings'));
    const adminPass = settings.adminPassword || 'admin123';

    if (inputPass === adminPass) {
        sessionStorage.setItem('admin_unlocked', 'true');
        document.getElementById('adminAuthLock').classList.add('hidden');
        loadAdminData();
    } else {
        document.getElementById('lockError').classList.remove('hidden');
    }
}

function lockAdminDashboard() {
    sessionStorage.removeItem('admin_unlocked');
    document.getElementById('adminAuthLock').classList.remove('hidden');
}

function loadAdminData() {
    const settings = JSON.parse(localStorage.getItem('cyber_settings'));

    if (document.getElementById('adminStoreName')) {
        document.getElementById('adminStoreName').value = settings.storeName || '';
        document.getElementById('adminPasswordSetting').value = settings.adminPassword || 'admin123';
        document.getElementById('adminStoreLogoUrl').value = settings.logoUrl || '';
        document.getElementById('adminAnnouncement').value = settings.announcement || '';
    }

    renderAdminAnalytics();
    renderOrdersLog();
    renderAdminCategoryChips();
    renderCategorySelectOptions();
    renderAdminBannerList();
    renderAdminProductList();
}

function renderAdminAnalytics() {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayVisits = localStorage.getItem(`cyber_visits_${todayStr}`) || '0';
    const totalPageviews = localStorage.getItem('cyber_total_pageviews') || '0';

    const orders = JSON.parse(localStorage.getItem('cyber_orders')) || [];
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    if (document.getElementById('statTodayVisitors')) {
        document.getElementById('statTodayVisitors').textContent = todayVisits;
        document.getElementById('statTotalPageviews').textContent = totalPageviews;
        document.getElementById('statTotalOrders').textContent = orders.length;
        document.getElementById('statTotalRevenue').textContent = `Rs. ${totalRevenue.toLocaleString()}`;
    }
}

// RENDER ADMIN ORDERS LOG
function renderOrdersLog() {
    const logDiv = document.getElementById('ordersLog');
    if (!logDiv) return;

    const orders = JSON.parse(localStorage.getItem('cyber_orders')) || [];
    logDiv.innerHTML = '';

    if (orders.length === 0) {
        logDiv.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 25px; background: var(--bg-card-inner); border-radius: 10px;">ලැබුණු Orders කිසිවක් නොමැත.</p>';
        return;
    }

    orders.forEach((o, index) => {
        const card = document.createElement('div');
        card.className = 'order-card-admin';

        let statusClass = 'status-pending';
        if (o.status === 'Confirmed') statusClass = 'status-confirmed';
        if (o.status === 'Delivered') statusClass = 'status-completed';

        let itemsHtml = '';
        o.items.forEach(item => {
            itemsHtml += `<div style="display:flex; justify-content:space-between; font-size:0.88rem; margin-bottom:4px;">
                <span>${item.title} (x${item.qty})</span>
                <strong>Rs. ${(item.price * item.qty).toLocaleString()}</strong>
            </div>`;
        });

        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:8px; margin-bottom:10px;">
                <div>
                    <strong style="color:var(--neon-red); font-size:1.1rem;">${o.id}</strong>
                    <span style="color:var(--text-muted); font-size:0.85rem; margin-left:10px;">${o.date}</span>
                </div>
                <div class="order-badge-status ${statusClass}">Status: ${o.status}</div>
            </div>
            <div class="form-row">
                <div>
                    <p style="font-size:0.9rem;"><strong>නම:</strong> ${o.customer.name}</p>
                    <p style="font-size:0.9rem;"><strong>Phone:</strong> <a href="tel:${o.customer.phone}" style="color:var(--c084fc, #c084fc);">${o.customer.phone}</a></p>
                    <p style="font-size:0.9rem;"><strong>ලිපිනය:</strong> ${o.customer.address}, ${o.customer.city}</p>
                    ${o.customer.notes ? `<p style="font-size:0.85rem; color:var(--text-muted);"><strong>සටහන්:</strong> ${o.customer.notes}</p>` : ''}
                </div>
                <div>
                    <strong style="font-size:0.85rem; color:var(--text-muted);">Ordered Items:</strong>
                    ${itemsHtml}
                    <div style="text-align:right; margin-top:8px; font-weight:bold; color:var(--neon-red);">Total: Rs. ${o.total.toLocaleString()}</div>
                </div>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:12px; border-top:1px solid var(--border-color); padding-top:10px;">
                <select onchange="changeOrderStatus(${index}, this.value)" class="form-control" style="padding:4px 8px; font-size:0.85rem;">
                    <option value="Pending" ${o.status==='Pending'?'selected':''}>Pending</option>
                    <option value="Confirmed" ${o.status==='Confirmed'?'selected':''}>Confirmed</option>
                    <option value="Delivered" ${o.status==='Delivered'?'selected':''}>Delivered</option>
                </select>
                <button onclick="deleteSingleOrder(${index})" class="btn btn-danger btn-sm"><i class="fa-solid fa-trash"></i> Delete</button>
            </div>
        `;

        logDiv.appendChild(card);
    });
}

function changeOrderStatus(idx, status) {
    const orders = JSON.parse(localStorage.getItem('cyber_orders')) || [];
    orders[idx].status = status;
    localStorage.setItem('cyber_orders', JSON.stringify(orders));
    renderOrdersLog();
    renderAdminAnalytics();
}

function deleteSingleOrder(idx) {
    if (confirm("මෙම Order එක ඉවත් කිරීමට අවශ්‍යද?")) {
        const orders = JSON.parse(localStorage.getItem('cyber_orders')) || [];
        orders.splice(idx, 1);
        localStorage.setItem('cyber_orders', JSON.stringify(orders));
        renderOrdersLog();
        renderAdminAnalytics();
    }
}

function clearOrdersLog() {
    if (confirm("සියලුම Orders ඉවත් කිරීමට අවශ්‍යද?")) {
        localStorage.setItem('cyber_orders', JSON.stringify([]));
        renderOrdersLog();
        renderAdminAnalytics();
    }
}

// BANNERS MANAGER
function renderAdminBannerList() {
    const container = document.getElementById('adminBannerList');
    if (!container) return;

    const settings = JSON.parse(localStorage.getItem('cyber_settings'));
    const banners = settings.banners || [];

    container.innerHTML = '';
    banners.forEach((b, idx) => {
        const card = document.createElement('div');
        card.className = 'admin-banner-card';
        card.innerHTML = `
            <img src="${b.image}">
            <p><strong>${b.title}</strong><br><span style="color:var(--text-muted);">${b.subtitle}</span></p>
            <button onclick="deleteBanner(${idx})" class="btn btn-danger btn-sm btn-block"><i class="fa-solid fa-trash"></i> Delete Banner</button>
        `;
        container.appendChild(card);
    });
}

function handleAddBanner(e) {
    e.preventDefault();
    const title = document.getElementById('bannerTitle').value;
    const subtitle = document.getElementById('bannerSubtitle').value;
    const image = document.getElementById('bannerImgUrl').value;

    const settings = JSON.parse(localStorage.getItem('cyber_settings'));
    settings.banners = settings.banners || [];
    settings.banners.push({ title, subtitle, image });

    localStorage.setItem('cyber_settings', JSON.stringify(settings));
    renderAdminBannerList();
    alert("නව Slide Banner එකක් සාර්ථකව එකතු විය!");
}

function deleteBanner(idx) {
    const settings = JSON.parse(localStorage.getItem('cyber_settings'));
    settings.banners.splice(idx, 1);
    localStorage.setItem('cyber_settings', JSON.stringify(settings));
    renderAdminBannerList();
}

// CATEGORIES & PRODUCTS MANAGER
function renderCategorySelectOptions() {
    const select = document.getElementById('prodCategory');
    if (!select) return;

    const categories = JSON.parse(localStorage.getItem('cyber_categories')) || [];
    select.innerHTML = '';

    categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        select.appendChild(opt);
    });
}

function renderAdminCategoryChips() {
    const container = document.getElementById('categoryChips');
    if (!container) return;

    const categories = JSON.parse(localStorage.getItem('cyber_categories')) || [];
    container.innerHTML = '';

    categories.forEach((cat, index) => {
        const chip = document.createElement('div');
        chip.className = 'cat-chip';
        chip.innerHTML = `
            <span>${cat}</span>
            <button onclick="deleteCategory(${index})">&times;</button>
        `;
        container.appendChild(chip);
    });
}

function addNewCategory() {
    const input = document.getElementById('newCatInput');
    const val = input.value.trim();
    if (!val) return;

    const categories = JSON.parse(localStorage.getItem('cyber_categories')) || [];
    if (!categories.includes(val)) {
        categories.push(val);
        localStorage.setItem('cyber_categories', JSON.stringify(categories));
        input.value = '';
        renderCategorySelectOptions();
        renderAdminCategoryChips();
    }
}

function deleteCategory(idx) {
    const categories = JSON.parse(localStorage.getItem('cyber_categories')) || [];
    categories.splice(idx, 1);
    localStorage.setItem('cyber_categories', JSON.stringify(categories));
    renderCategorySelectOptions();
    renderAdminCategoryChips();
}

function handleAddProduct(e) {
    e.preventDefault();
    const title = document.getElementById('prodTitle').value;
    const category = document.getElementById('prodCategory').value;
    const price = parseFloat(document.getElementById('prodPrice').value);
    const desc = document.getElementById('prodDesc').value;
    const image = document.getElementById('prodImageUrl').value || 'https://via.placeholder.com/300x200?text=Mobile+Store';

    const products = JSON.parse(localStorage.getItem('cyber_products')) || [];
    products.unshift({ id: Date.now(), title, category, price, desc, image });
    localStorage.setItem('cyber_products', JSON.stringify(products));

    document.getElementById('addProductForm').reset();
    renderAdminProductList();
    alert("නව Product එක සාර්ථකව Store එකට එකතු විය!");
}

function renderAdminProductList() {
    const container = document.getElementById('adminProductList');
    if (!container) return;

    const products = JSON.parse(localStorage.getItem('cyber_products')) || [];
    container.innerHTML = '';

    products.forEach(p => {
        const item = document.createElement('div');
        item.style.cssText = 'display:flex; justify-content:space-between; align-items:center; background:var(--bg-card-inner); padding:10px 15px; border-radius:8px; margin-bottom:8px; border:1px solid var(--border-color);';
        item.innerHTML = `
            <div style="display:flex; align-items:center; gap:12px;">
                <img src="${p.image}" style="width:40px; height:40px; object-fit:cover; border-radius:6px;">
                <div>
                    <strong>${p.title}</strong>
                    <div style="font-size:0.8rem; color:var(--text-muted);">${p.category} | Rs. ${p.price.toLocaleString()}</div>
                </div>
            </div>
            <button onclick="deleteProduct(${p.id})" class="btn btn-danger btn-sm"><i class="fa-solid fa-trash"></i></button>
        `;
        container.appendChild(item);
    });
}

function deleteProduct(id) {
    let products = JSON.parse(localStorage.getItem('cyber_products')) || [];
    products = products.filter(p => p.id !== id);
    localStorage.setItem('cyber_products', JSON.stringify(products));
    renderAdminProductList();
}

function saveSettings(e) {
    e.preventDefault();
    const settings = JSON.parse(localStorage.getItem('cyber_settings'));

    settings.storeName = document.getElementById('adminStoreName').value;
    settings.adminPassword = document.getElementById('adminPasswordSetting').value;
    settings.logoUrl = document.getElementById('adminStoreLogoUrl').value;
    settings.announcement = document.getElementById('adminAnnouncement').value;

    localStorage.setItem('cyber_settings', JSON.stringify(settings));
    loadHeaderUI();
    alert("Settings සාර්ථකව Save විය!");
}

function handleImageUpload(e, targetId) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            document.getElementById(targetId).value = evt.target.result;
        };
        reader.readAsDataURL(file);
    }
}
