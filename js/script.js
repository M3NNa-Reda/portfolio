/**
 * Personal Portfolio Core Engine
 * Author: Menna Reda
 * Focus: High performance, zero dependencies, accessible interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollInteractions();
    initCertificateModal();
    initProjectModal();
    initBackToTop();
});
/**

/**
 * Handles Mobile Hamburger Menu and Sticky Header States
 */
function initNavigation() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('is-open');
            hamburgerBtn.setAttribute('aria-expanded', isOpen);
            
            // Toggle Hamburger Animation Lines
            const lines = hamburgerBtn.querySelectorAll('.hamburger-line');
            if (lines.length >= 3) {
                if (isOpen) {
                    lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    lines[1].style.opacity = '0';
                    lines[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
                } else {
                    lines[0].style.transform = 'none';
                    lines[1].style.opacity = '1';
                    lines[2].style.transform = 'none';
                }
            }
        });

        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('is-open')) {
                    hamburgerBtn.click();
                }
            });
        });
    }

    // Scroll Observer for Navbar Shadow
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }
}

/**
 * Handles Active Nav Link Highlighting via Intersection Observer
 */
function initScrollInteractions() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/**
 * Handles Certificate Image Modal Lightbox
 */
function initCertificateModal() {
    const modal = document.getElementById('certificate-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = document.getElementById('modal-overlay');
    const certCards = document.querySelectorAll('.certificate-card');

    if (!modal || !modalImg) return;

    function openModal(imgSrc, title) {
        modalImg.src = imgSrc;
        modalImg.alt = title || 'Certificate Preview';
        if (modalTitle) modalTitle.textContent = title || '';
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        modalImg.src = '';
    }

    certCards.forEach(card => {
        card.addEventListener('click', () => {
            const imgSrc = card.getAttribute('data-certificate-img') || card.querySelector('img')?.src;
            const title = card.getAttribute('data-certificate-title') || card.querySelector('.certificate-title')?.textContent;
            if (imgSrc) openModal(imgSrc, title);
        });

        // Keyboard accessibility (Enter/Space)
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const imgSrc = card.getAttribute('data-certificate-img') || card.querySelector('img')?.src;
                const title = card.getAttribute('data-certificate-title') || card.querySelector('.certificate-title')?.textContent;
                if (imgSrc) openModal(imgSrc, title);
            }
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/**
 * Handles Project Image Modal Lightbox
 */
function initProjectModal() {
    // يستهدف مشروع مودال الخاص به أو يتراجع لمودال الشهادات إذا لم يوجد مودال مخصص
    const modal = document.getElementById('project-modal') || document.getElementById('certificate-modal');
    const modalImg = document.getElementById('project-modal-img') || document.getElementById('modal-img');
    const modalTitle = document.getElementById('project-modal-title') || document.getElementById('modal-title');
    const modalClose = document.getElementById('project-modal-close') || document.getElementById('modal-close');
    const modalOverlay = document.getElementById('project-modal-overlay') || document.getElementById('modal-overlay');
    const projectWrappers = document.querySelectorAll('.project-image-wrapper');

    if (!modal || !modalImg) return;

    function openModal(imgSrc, title) {
        modalImg.src = imgSrc;
        modalImg.alt = title || 'Project Preview';
        if (modalTitle) modalTitle.textContent = title || '';
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        modalImg.src = '';
    }

    projectWrappers.forEach(wrapper => {
        const card = wrapper.closest('.project-card');
        const img = wrapper.querySelector('.project-image');
        if (!img) return;

        // Make project image wrapper focusable & interactive
        wrapper.setAttribute('tabindex', '0');
        wrapper.setAttribute('role', 'button');
        wrapper.setAttribute('aria-label', `View ${img.alt || 'project image'}`);

        const handleOpen = () => {
            const imgSrc = card?.getAttribute('data-project-img') || img.src;
            const title = card?.getAttribute('data-project-title') || img.alt;
            openModal(imgSrc, title);
        };

        wrapper.addEventListener('click', handleOpen);

        // Keyboard accessibility (Enter/Space)
        wrapper.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOpen();
            }
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/**
 * Handles Back to Top Button Behavior
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');

    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
}
// ==========================================
// Dark Mode Toggle Logic
// ==========================================
const themeToggleBtn = document.getElementById('theme-toggle');

// أيقونات SVG للوضع الداكن والفاتح
const moonIcon = `
  <svg class="theme-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
`;

const sunIcon = `
  <svg class="theme-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
`;

// 1. فحص الثيم المحفوظ مسبقاً (الوضع الفاتح هو الافتراضي دائمًا للزائر الجديد)
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
  document.body.setAttribute('data-theme', 'dark');
  themeToggleBtn.innerHTML = sunIcon;
} else {
  document.body.setAttribute('data-theme', 'light');
  themeToggleBtn.innerHTML = moonIcon;
}

// 2. حدث الضغط على الزر للتبديل بين الوضعين
themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.body.getAttribute('data-theme');
  
  if (currentTheme === 'dark') {
    document.body.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    themeToggleBtn.innerHTML = moonIcon;
  } else {
    document.body.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    themeToggleBtn.innerHTML = sunIcon;
  }
});