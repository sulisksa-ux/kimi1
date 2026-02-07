// ============================================
// FoodGroup Website - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initCountdownTimer();
    initScrollAnimations();
    initCartFunctions();
    initSearchFunction();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            const icon = this.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                nav.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// Countdown Timer
function initCountdownTimer() {
    const timerElements = document.querySelectorAll('.deal-timer');
    
    timerElements.forEach(timer => {
        updateTimer(timer);
        setInterval(() => updateTimer(timer), 1000);
    });
}

function updateTimer(timerElement) {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const diff = endOfDay - now;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    const hoursEl = timerElement.querySelector('.timer-value[data-unit="hours"]');
    const minutesEl = timerElement.querySelector('.timer-value[data-unit="minutes"]');
    const secondsEl = timerElement.querySelector('.timer-value[data-unit="seconds"]');
    
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.deal-card, .category-card, .feature-card, .step-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Cart Functions
function initCartFunctions() {
    // Add to cart buttons
    const addToCartBtns = document.querySelectorAll('.btn-add');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.dataset.productId || '1';
            addToCart(productId, this);
        });
    });

    // Update cart count on page load
    updateCartCount();
}

function addToCart(productId, btnElement) {
    // Get current cart
    let cart = JSON.parse(localStorage.getItem('foodgroup_cart')) || [];
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    // Save to localStorage
    localStorage.setItem('foodgroup_cart', JSON.stringify(cart));
    
    // Animate button
    if (btnElement) {
        btnElement.style.transform = 'scale(0.9)';
        setTimeout(() => {
            btnElement.style.transform = 'scale(1)';
        }, 150);
    }
    
    // Update cart count
    updateCartCount();
    
    // Show notification
    showNotification('تمت إضافة المنتج إلى السلة');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('foodgroup_cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
        el.style.animation = 'none';
        el.offsetHeight; // Trigger reflow
        el.style.animation = 'pulse 0.3s ease';
    });
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('foodgroup_cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('foodgroup_cart', JSON.stringify(cart));
    updateCartCount();
}

function updateQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('foodgroup_cart')) || [];
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) {
            removeFromCart(productId);
            return;
        }
        localStorage.setItem('foodgroup_cart', JSON.stringify(cart));
        updateCartCount();
    }
}

// Search Function
function initSearchFunction() {
    const searchInput = document.querySelector('.search-box input');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
                }
            }
        });
    }
}

// Notification System
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add type-specific styling
    if (type === 'error') {
        notification.style.background = 'var(--danger)';
    } else if (type === 'warning') {
        notification.style.background = 'var(--accent)';
    }
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Form Validation
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            input.style.borderColor = 'var(--danger)';
        } else {
            input.classList.remove('error');
            input.style.borderColor = '';
        }
    });
    
    return isValid;
}

// Smooth Scroll
function smoothScrollTo(target, offset = 80) {
    const element = document.querySelector(target);
    if (element) {
        const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    }
}

// Throttle Function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Format Currency
function formatCurrency(amount, currency = 'ريال') {
    return `${amount.toLocaleString('ar-SA')} ${currency}`;
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ar-SA', options);
}

// Copy to Clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('تم النسخ بنجاح');
        });
    } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('تم النسخ بنجاح');
    }
}

// Lazy Loading Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Export functions for global access
window.FoodGroup = {
    addToCart,
    removeFromCart,
    updateQuantity,
    showNotification,
    validateForm,
    formatCurrency,
    formatDate,
    copyToClipboard,
    smoothScrollTo
};
