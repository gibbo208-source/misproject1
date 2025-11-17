/**
 * Main JavaScript file for personal website functionality and interactivity
 * Handles navigation, footer, animations, and interactive elements
 */

(function() {
    'use strict';

    // ===== INITIALIZATION =====
    document.addEventListener('DOMContentLoaded', function() {
        initializeFooter();
        initializeNavigation();
        initializeSmoothScrolling();
        initializeLazyLoading();
        initializeScrollAnimations();
        initializeMobileMenu();
        initializeImageZoom();
    });

    // ===== FOOTER YEAR UPDATE =====
    function initializeFooter() {
        const yearElements = document.querySelectorAll('#year');
        const currentYear = new Date().getFullYear();
        
        yearElements.forEach(function(element) {
            if (element) {
                element.textContent = currentYear;
            }
        });
    }

    // ===== NAVIGATION ACTIVE STATE =====
    function initializeNavigation() {
        const navLinks = document.querySelectorAll('.nav-links a');
        let currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Handle root/index cases
        if (currentPage === '' || currentPage === '/' || currentPage === 'my-website/' || currentPage === 'my-website') {
            currentPage = 'index.html';
        }
        
        // Normalize the current page path
        currentPage = currentPage.toLowerCase();
        
        navLinks.forEach(function(link) {
            let linkHref = link.getAttribute('href');
            
            // Remove existing active class
            link.classList.remove('active');
            link.removeAttribute('aria-current');
            
            // Normalize link href
            linkHref = linkHref.toLowerCase();
            
            // Extract just the filename from href
            const linkPage = linkHref.split('/').pop();
            
            // Check if this link matches the current page
            if (linkPage === currentPage || 
                (currentPage === 'index.html' && (linkPage === 'index.html' || linkHref === './' || linkHref === '/')) ||
                (linkPage === '' && currentPage === 'index.html')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    // ===== SMOOTH SCROLLING =====
    function initializeSmoothScrolling() {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!prefersReducedMotion) {
            // Add smooth scroll behavior to anchor links
            document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
                anchor.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    
                    // Only handle if it's a valid hash link
                    if (href !== '#' && href.length > 1) {
                        const target = document.querySelector(href);
                        
                        if (target) {
                            e.preventDefault();
                            
                            const headerOffset = 80;
                            const elementPosition = target.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                            
                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }
                });
            });
        }
    }

    // ===== LAZY LOADING IMAGES =====
    function initializeLazyLoading() {
        // Check if IntersectionObserver is supported
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Load the image
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        
                        // Add fade-in animation
                        img.style.opacity = '0';
                        img.style.transition = 'opacity 0.3s ease-in';
                        
                        img.onload = function() {
                            img.style.opacity = '1';
                        };
                        
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            // Observe all images with data-src attribute
            document.querySelectorAll('img[data-src]').forEach(function(img) {
                imageObserver.observe(img);
            });
        }
    }

    // ===== SCROLL ANIMATIONS =====
    function initializeScrollAnimations() {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            return; // Skip animations if user prefers reduced motion
        }
        
        // Check if IntersectionObserver is supported
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            // Observe sections for animation
            const sections = document.querySelectorAll('section:not(.intro)');
            sections.forEach(function(section) {
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                animationObserver.observe(section);
            });
            
            // Add CSS class for fade-in animation
            if (!document.querySelector('#scroll-animation-styles')) {
                const style = document.createElement('style');
                style.id = 'scroll-animation-styles';
                style.textContent = `
                    .fade-in {
                        opacity: 1 !important;
                        transform: translateY(0) !important;
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }

    // ===== MOBILE MENU =====
    function initializeMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const topNav = document.querySelector('.top-nav');
        
        if (!navLinks || !topNav) return;
        
        // Create mobile menu button if it doesn't exist
        let mobileMenuButton = document.querySelector('.mobile-menu-button');
        
        if (!mobileMenuButton && window.innerWidth <= 768) {
            mobileMenuButton = document.createElement('button');
            mobileMenuButton.className = 'mobile-menu-button';
            mobileMenuButton.setAttribute('aria-label', 'Toggle navigation menu');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            mobileMenuButton.innerHTML = '<span></span><span></span><span></span>';
            
            // Add styles for mobile menu button
            const buttonStyle = document.createElement('style');
            buttonStyle.textContent = `
                .mobile-menu-button {
                    display: none;
                    flex-direction: column;
                    gap: 5px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 8px;
                    z-index: 101;
                }
                
                .mobile-menu-button span {
                    width: 25px;
                    height: 3px;
                    background: var(--text-color);
                    border-radius: 2px;
                    transition: all 0.3s ease;
                }
                
                @media screen and (max-width: 768px) {
                    .mobile-menu-button {
                        display: flex;
                    }
                    
                    .nav-links {
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: rgba(247, 241, 232, 0.98);
                        backdrop-filter: blur(12px);
                        flex-direction: column;
                        padding: 1rem;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                        transform: translateY(-100%);
                        opacity: 0;
                        visibility: hidden;
                        transition: all 0.3s ease;
                    }
                    
                    .nav-links.active {
                        transform: translateY(0);
                        opacity: 1;
                        visibility: visible;
                    }
                    
                    .top-nav {
                        position: relative;
                    }
                }
            `;
            document.head.appendChild(buttonStyle);
            
            // Insert button before nav links
            topNav.insertBefore(mobileMenuButton, navLinks);
            
            // Toggle menu on button click
            mobileMenuButton.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !isExpanded);
                navLinks.classList.toggle('active');
                
                // Animate hamburger icon
                this.classList.toggle('active');
            });
            
            // Close menu when clicking on a link
            navLinks.querySelectorAll('a').forEach(function(link) {
                link.addEventListener('click', function() {
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    navLinks.classList.remove('active');
                    mobileMenuButton.classList.remove('active');
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!topNav.contains(e.target) && navLinks.classList.contains('active')) {
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    navLinks.classList.remove('active');
                    mobileMenuButton.classList.remove('active');
                }
            });
        }
    }

    // ===== IMAGE ZOOM ON CLICK =====
    function initializeImageZoom() {
        const images = document.querySelectorAll('img:not(.brand-emblem)');
        
        images.forEach(function(img) {
            img.style.cursor = 'pointer';
            
            img.addEventListener('click', function() {
                // Create overlay
                const overlay = document.createElement('div');
                overlay.className = 'image-overlay';
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                    cursor: pointer;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `;
                
                // Create zoomed image
                const zoomedImg = document.createElement('img');
                zoomedImg.src = this.src;
                zoomedImg.alt = this.alt || 'Zoomed image';
                zoomedImg.style.cssText = `
                    max-width: 90%;
                    max-height: 90%;
                    border-radius: 8px;
                    box-shadow: 0 8px 32px rgba(255, 255, 255, 0.1);
                `;
                
                overlay.appendChild(zoomedImg);
                document.body.appendChild(overlay);
                
                // Fade in
                requestAnimationFrame(function() {
                    overlay.style.opacity = '1';
                });
                
                // Close on click
                overlay.addEventListener('click', function() {
                    overlay.style.opacity = '0';
                    setTimeout(function() {
                        document.body.removeChild(overlay);
                    }, 300);
                });
                
                // Close on Escape key
                const closeOnEscape = function(e) {
                    if (e.key === 'Escape') {
                        overlay.style.opacity = '0';
                        setTimeout(function() {
                            document.body.removeChild(overlay);
                            document.removeEventListener('keydown', closeOnEscape);
                        }, 300);
                    }
                };
                document.addEventListener('keydown', closeOnEscape);
            });
        });
    }

    // ===== HANDLE WINDOW RESIZE =====
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            initializeMobileMenu();
        }, 250);
    });

    // ===== ADD KEYBOARD NAVIGATION ENHANCEMENTS =====
    document.addEventListener('keydown', function(e) {
        // Skip link navigation with arrow keys (if needed in future)
        // This is a placeholder for keyboard navigation enhancements
    });

    // ===== PERFORMANCE: DEBOUNCE SCROLL EVENTS =====
    let scrollTimer = null;
    window.addEventListener('scroll', function() {
        if (scrollTimer !== null) {
            clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(function() {
            // Placeholder for scroll-based functionality
            // Could add scroll-to-top button, parallax effects, etc.
        }, 150);
    }, false);

})();

