// ===== French Silly Goose Wedding - Main Script =====

document.addEventListener('DOMContentLoaded', () => {
    initFeathers();
    initNavigation();
    initScrollAnimations();
    initAmountSelectors();
    initForms();
    initModal();
});

// ===== Floating Feathers Background =====
function initFeathers() {
    const container = document.getElementById('feathersContainer');
    const featherEmojis = ['🪶', '🪿', '✨', '🌸', '🤍'];

    function createFeather() {
        const feather = document.createElement('span');
        feather.classList.add('feather');
        feather.textContent = featherEmojis[Math.floor(Math.random() * featherEmojis.length)];
        feather.style.left = Math.random() * 100 + '%';
        feather.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
        feather.style.animationDuration = (8 + Math.random() * 12) + 's';
        feather.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(feather);

        // Remove after animation
        setTimeout(() => {
            feather.remove();
        }, 22000);
    }

    // Create initial feathers
    for (let i = 0; i < 5; i++) {
        setTimeout(createFeather, i * 800);
    }

    // Keep creating feathers
    setInterval(createFeather, 3000);
}

// ===== Navigation =====
function initNavigation() {
    const nav = document.getElementById('mainNav');
    const toggle = document.getElementById('navToggle');
    const mobile = document.getElementById('navMobile');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // Mobile toggle
    toggle.addEventListener('click', () => {
        mobile.classList.toggle('open');
        const spans = toggle.querySelectorAll('span');
        if (mobile.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // Close mobile menu on link click
    mobile.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobile.classList.remove('open');
            const spans = toggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => observer.observe(el));
}

// ===== Amount Selectors (Gift Cards) =====
function initAmountSelectors() {
    document.querySelectorAll('.gift-card').forEach(card => {
        const buttons = card.querySelectorAll('.amount-btn');
        const customInput = card.querySelector('.custom-amount-input');
        const donateLink = card.querySelector('.btn-donate');

        // Update PayPal link based on selected amount
        function updatePayPalLink() {
            if (donateLink && donateLink.href.includes('paypal.me')) {
                const amount = getSelectedAmount(card);
                donateLink.href = `https://paypal.me/JoelWeston237/${amount}`;
            }
        }

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Deactivate all buttons in this card
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                // Clear custom input
                if (customInput) customInput.value = '';
                // Update PayPal link
                updatePayPalLink();
            });
        });

        if (customInput) {
            customInput.addEventListener('focus', () => {
                buttons.forEach(b => b.classList.remove('active'));
            });

            customInput.addEventListener('input', () => {
                buttons.forEach(b => b.classList.remove('active'));
                // Update PayPal link with custom amount
                updatePayPalLink();
            });
        }

        // Set initial PayPal link
        updatePayPalLink();
    });
}

// ===== Get Selected Amount for a Gift Card =====
function getSelectedAmount(cardElement) {
    const activeBtn = cardElement.querySelector('.amount-btn.active');
    const customInput = cardElement.querySelector('.custom-amount-input');

    if (customInput && customInput.value) {
        return parseInt(customInput.value, 10);
    }
    if (activeBtn) {
        return parseInt(activeBtn.dataset.amount, 10);
    }
    return 50; // default
}

// ===== PayPal Donation =====
function donatePayPal(fundName, buttonElement) {
    const card = buttonElement.closest('.gift-card');
    const amount = getSelectedAmount(card);

    // Show modal
    const modal = document.getElementById('donationModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalAmount = document.getElementById('modalAmount');
    const paypalLink = document.getElementById('paypalLink');

    modalTitle.textContent = `Contributing to ${fundName}`;
    modalAmount.textContent = `£${amount}`;

    // Build PayPal donation link
    // Replace YOUR_PAYPAL_EMAIL with actual PayPal email
    const paypalEmail = 'your-paypal@email.com';
    const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=${encodeURIComponent(paypalEmail)}&item_name=${encodeURIComponent(fundName)}&amount=${amount}&currency_code=GBP&return=${encodeURIComponent(window.location.href)}&cancel_return=${encodeURIComponent(window.location.href)}`;

    paypalLink.href = paypalUrl;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ===== Modal =====
function initModal() {
    const modal = document.getElementById('donationModal');
    const closeBtn = document.getElementById('modalClose');

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// ===== Form Handling =====
function initForms() {
    // RSVP Form
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSuccess = document.getElementById('rsvpSuccess');

    rsvpForm.addEventListener('submit', (e) => {
        // Let Formspree handle the submission, just show success
        const submitBtn = document.getElementById('rsvpSubmit');
        submitBtn.innerHTML = '<span class="btn-text">Sending...</span> <span class="btn-icon">🪿</span>';
        submitBtn.disabled = true;

        setTimeout(() => {
            rsvpForm.style.display = 'none';
            rsvpSuccess.style.display = 'block';

            // Confetti burst!
            createConfetti();
        }, 800);
    });

    // Guest Book Form - REMOVED
    // The guestbook section has been removed from the website
}

// ===== Confetti Effect =====
function createConfetti() {
    const colors = ['#c8727e', '#c9a96e', '#8fa88b', '#e8c4b8', '#e8d5a8', '#d4a090'];
    const emojis = ['🪿', '✨', '💛', '🤍', '🎉', '🥂'];

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            const isEmoji = Math.random() > 0.6;

            confetti.style.cssText = `
                position: fixed;
                top: -10px;
                left: ${Math.random() * 100}%;
                font-size: ${isEmoji ? '1.5rem' : '0'};
                width: ${isEmoji ? 'auto' : (6 + Math.random() * 8) + 'px'};
                height: ${isEmoji ? 'auto' : (6 + Math.random() * 8) + 'px'};
                background: ${isEmoji ? 'none' : colors[Math.floor(Math.random() * colors.length)]};
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                z-index: 3000;
                pointer-events: none;
                animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
            `;

            if (isEmoji) {
                confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            }

            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 5000);
        }, i * 60);
    }

    // Add confetti keyframes if not already added
    if (!document.getElementById('confettiStyles')) {
        const style = document.createElement('style');
        style.id = 'confettiStyles';
        style.textContent = `
            @keyframes confettiFall {
                0% {
                    transform: translateY(0) rotate(0deg) scale(1);
                    opacity: 1;
                }
                70% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(${360 + Math.random() * 720}deg) scale(0.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== Parallax on scroll (subtle) =====
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const hero = document.querySelector('.hero-content');
    if (hero && scrollY < window.innerHeight) {
        hero.style.transform = `translateY(${scrollY * 0.15}px)`;
        hero.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
    }
});
