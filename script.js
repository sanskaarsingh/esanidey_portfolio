/* ============================================================
   ESANI DEY — PREMIUM GRUNGE PORTFOLIO
   script.js — Vanilla JS, no dependencies
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    // ── 1. CUSTOM CURSOR ──────────────────────────────────────
    const cursorDot  = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    if (cursorDot && cursorRing && window.innerWidth > 768) {
        let mouseX = 0, mouseY = 0;
        let ringX  = 0, ringY  = 0;
        let raf;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top  = mouseY + 'px';
        });

        const animateRing = () => {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top  = ringY + 'px';
            raf = requestAnimationFrame(animateRing);
        };
        animateRing();

        // Hover effect on interactive elements
        const hoverTargets = 'a, button, .card, .video-card, .music-card, .chip, .gallery-item, .social-stat';
        document.querySelectorAll(hoverTargets).forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity  = '0';
            cursorRing.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursorDot.style.opacity  = '1';
            cursorRing.style.opacity = '0.7';
        });
    }


    // ── 2. NAVBAR SCROLL EFFECT ───────────────────────────────
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    const onScroll = () => {
        const scrollY = window.scrollY;
        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });


    // ── 3. MOBILE HAMBURGER MENU ──────────────────────────────
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const closeMenu = () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    };

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('open');
            if (isOpen) {
                closeMenu();
            } else {
                hamburger.classList.add('active');
                mobileMenu.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
        mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
    }


    // ── 4. SCROLL-REVEAL (Intersection Observer) ──────────────
    const revealEls = document.querySelectorAll(
        '.reveal-up, .reveal-left, .reveal-right, .reveal-fade'
    );

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });

    revealEls.forEach(el => revealObserver.observe(el));


    // ── 5. HERO INITIAL ANIMATIONS (trigger immediately) ──────
    // Title lines and hero elements fire on load, not scroll
    const heroAnimatables = document.querySelectorAll(
        '.title-line, .hero-eyebrow, .tagline, .cta-group, .hero-stat'
    );
    // Small delay to ensure font has loaded
    setTimeout(() => {
        heroAnimatables.forEach(el => el.classList.add('active'));
    }, 150);


    // ── 6. PARALLAX HERO BACKGROUND ───────────────────────────
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                hero.style.backgroundPositionY = `calc(50% + ${scrollY * 0.35}px)`;
            }
        }, { passive: true });
    }


    // ── 7. ANIMATED COUNTERS ──────────────────────────────────
    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1800;
        const start = performance.now();
        const startVal = 0;

        const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(startVal + (target - startVal) * eased);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
        };
        requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // Hero stat numbers
    document.querySelectorAll('.stat-num[data-target]').forEach(el => {
        counterObserver.observe(el);
    });

    // Social counters
    document.querySelectorAll('.counter[data-target]').forEach(el => {
        counterObserver.observe(el);
    });


// ── 8. DRAGGABLE AUTO-SCROLL MARQUEES (FIXED FLOAT SCROLL) ─
    const tracks = document.querySelectorAll('.marquee-track');

    tracks.forEach(track => {
        const original = track.innerHTML;
        track.innerHTML = original + original + original;

        let isDragging = false;
        let startX, scrollLeft;
        let rafId;
        let velocity = 0;
        let lastX;
        let lastTime;

        // YEH NAYI LINE ADD HUI HAI (Decimal store karne ke liye)
        let exactScrollLeft = 0; 

        const speed     = parseFloat(track.getAttribute('data-speed'))     || 1;
        const direction = parseInt(track.getAttribute('data-direction'), 10) || 1;
        const BASE_SPEED = 1; 

        const clampScroll = () => {
            const third = track.scrollWidth / 3;
            if (exactScrollLeft >= third * 2) {
                exactScrollLeft -= third;
            } else if (exactScrollLeft <= 0) {
                exactScrollLeft += third;
            }
            track.scrollLeft = exactScrollLeft; // NAYA: DOM ko exact value pass ki
        };

        const autoScroll = () => {
            if (!isDragging) {
                exactScrollLeft += BASE_SPEED * speed * direction; // NAYA
                clampScroll();
            }
            rafId = requestAnimationFrame(autoScroll);
        };

        setTimeout(() => {
            const third = track.scrollWidth / 3;
            exactScrollLeft = third; // NAYA
            track.scrollLeft = exactScrollLeft; 
            autoScroll();
        }, 600);

        track.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX     = e.pageX - track.offsetLeft;
            scrollLeft = exactScrollLeft; // NAYA
            lastX      = e.pageX;
            lastTime   = performance.now();
            velocity   = 0;
            track.style.cursor = 'grabbing';
            cancelAnimationFrame(rafId);
        });

        track.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const now  = performance.now();
            const x    = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 1.8;
            exactScrollLeft = scrollLeft - walk; // NAYA
            clampScroll();

            velocity = (e.pageX - lastX) / (now - lastTime + 1);
            lastX    = e.pageX;
            lastTime = now;
        });

        const endDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            track.style.cursor = 'grab';
            let momentum = velocity * 8;
            const decelerate = () => {
                if (Math.abs(momentum) < 0.5) {
                    autoScroll();
                    return;
                }
                exactScrollLeft -= momentum; // NAYA
                clampScroll();
                momentum *= 0.92;
                requestAnimationFrame(decelerate);
            };
            decelerate();
        };

        track.addEventListener('mouseup',    endDrag);
        track.addEventListener('mouseleave', endDrag);

        track.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX     = e.touches[0].pageX - track.offsetLeft;
            scrollLeft = exactScrollLeft; // NAYA
            velocity   = 0;
            lastX      = e.touches[0].pageX;
            lastTime   = performance.now();
            cancelAnimationFrame(rafId);
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const now  = performance.now();
            const x    = e.touches[0].pageX - track.offsetLeft;
            const walk = (x - startX) * 1.6;
            exactScrollLeft = scrollLeft - walk; // NAYA
            clampScroll();
            velocity = (e.touches[0].pageX - lastX) / (now - lastTime + 1);
            lastX    = e.touches[0].pageX;
            lastTime = now;
        }, { passive: true });

        track.addEventListener('touchend', endDrag);
    });


    // ── 9. CARD 3D TILT EFFECT ────────────────────────────────
    const tiltCards = document.querySelectorAll('.card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect   = card.getBoundingClientRect();
            const x      = e.clientX - rect.left;
            const y      = e.clientY - rect.top;
            const cx     = rect.width  / 2;
            const cy     = rect.height / 2;
            const rotX   = ((y - cy) / cy) * -5;
            const rotY   = ((x - cx) / cx) *  5;
            card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });


    // ── 10. GALLERY LIGHTBOX ──────────────────────────────────
    const lightbox    = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightboxClose');
    const galleryItems  = document.querySelectorAll('.gallery-item');

    const openLightbox = (src, alt) => {
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.style.display = 'block';
        lightboxImg.animate([
            { opacity: 0, transform: 'scale(0.92)' },
            { opacity: 1, transform: 'scale(1)' }
        ], { duration: 320, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' });
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightboxImg.animate([
            { opacity: 1, transform: 'scale(1)' },
            { opacity: 0, transform: 'scale(0.92)' }
        ], { duration: 220, easing: 'ease-in', fill: 'forwards' }).onfinish = () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        };
    };

    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            item.addEventListener('click', () => openLightbox(img.src, img.alt));
        }
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // ESC key to close lightbox
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.style.display === 'block') {
            closeLightbox();
        }
    });


    // ── 11. CONTACT FORM ──────────────────────────────────────
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn      = form.querySelector('button[type="submit"]');
            const btnText  = btn.querySelector('.btn-text');
            const btnArrow = btn.querySelector('.btn-arrow');
            const original = btnText.textContent;

            // Animate success state
            btn.disabled = true;
            btnText.textContent = 'Sent!';
            if (btnArrow) btnArrow.textContent = '✓';
            btn.style.background   = 'var(--cyan)';
            btn.style.color        = 'var(--bg)';
            btn.style.boxShadow    = '0 4px 25px var(--cyan-glow)';

            setTimeout(() => {
                btnText.textContent    = original;
                if (btnArrow) btnArrow.textContent = '→';
                btn.disabled           = false;
                btn.style.background   = '';
                btn.style.color        = '';
                btn.style.boxShadow    = '';
                form.reset();
            }, 3500);
        });
    }


    // ── 12. SMOOTH ACTIVE NAV LINKS ───────────────────────────
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-links a');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.style.color = link.getAttribute('href') === `#${id}`
                        ? 'var(--cream)'
                        : '';
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(sec => sectionObserver.observe(sec));


    // ── 13. SECTION LABEL PARALLAX ────────────────────────────
    // Subtle counter-scroll on section labels for depth
    const sectionLabels = document.querySelectorAll('.section-label');
    window.addEventListener('scroll', () => {
        const sy = window.scrollY;
        sectionLabels.forEach(label => {
            const rect   = label.getBoundingClientRect();
            const center = rect.top + rect.height / 2;
            const offset = (center - window.innerHeight / 2) * 0.04;
            label.style.transform = `translateX(${offset}px)`;
        });
    }, { passive: true });


    // ── 14. HERO BG-TEXT PARALLAX ─────────────────────────────
    const heroBgText = document.querySelector('.hero-bg-text');
    if (heroBgText) {
        window.addEventListener('scroll', () => {
            const sy = window.scrollY;
            if (sy < window.innerHeight) {
                heroBgText.style.transform = `translateX(-50%) translateY(${sy * -0.18}px)`;
                heroBgText.style.opacity   = 1 - (sy / window.innerHeight) * 2;
            }
        }, { passive: true });
    }


    // ── 15. VIDEO CARD RIPPLE ─────────────────────────────────
    document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect   = this.getBoundingClientRect();
            const size   = Math.max(rect.width, rect.height) * 2;
            ripple.style.cssText = `
                position:absolute; border-radius:50%;
                width:${size}px; height:${size}px;
                left:${e.clientX - rect.left - size/2}px;
                top:${e.clientY - rect.top - size/2}px;
                background: rgba(255,69,0,0.15);
                transform: scale(0); animation: ripple-out 0.6s ease-out forwards;
                pointer-events:none;
            `;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 700);
        });
    });

    // Inject ripple keyframes
    const styleTag = document.createElement('style');
    styleTag.textContent = `
        @keyframes ripple-out {
            to { transform: scale(1); opacity: 0; }
        }
    `;
    document.head.appendChild(styleTag);

}); // end DOMContentLoaded