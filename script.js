/* ============================================================
   ESANI DEY — PREMIUM GRUNGE PORTFOLIO
   script.js — Mobile/Tablet Optimized & Smooth (Vanilla JS)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    // Helper: Check if device is primarily touch based
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    // ── 1. CUSTOM CURSOR (GPU Accelerated) ─────────────────────
    const cursorDot  = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    // ONLY initialize cursor logic if NOT a touch device. Massive performance boost for mobile.
    if (cursorDot && cursorRing && !isTouchDevice && window.innerWidth > 768) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX  = mouseX, ringY  = mouseY;
        let raf;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`;
        }, { passive: true });

        const animateRing = () => {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            cursorRing.style.transform = `translate3d(calc(${ringX}px - 50%), calc(${ringY}px - 50%), 0)`;
            raf = requestAnimationFrame(animateRing);
        };
        animateRing();

        const hoverTargets = 'a, button, .card, .reel-card, .music-card, .chip, .press-card, .social-stat';
        document.querySelectorAll(hoverTargets).forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity  = '0';
            cursorRing.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursorDot.style.opacity  = '1';
            cursorRing.style.opacity = '0.7';
        });
    }

    // ── 2. NAVBAR SCROLL EFFECT + SCROLL PROGRESS BAR ────────
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    
    let ticking = false;
    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                if (scrollY > 60) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                if (scrollProgress) {
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
                    scrollProgress.style.width = pct + '%';
                }
                ticking = false;
            });
            ticking = true;
        }
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
            if (mobileMenu.classList.contains('open')) {
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
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-fade');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(el => revealObserver.observe(el));

    // ── 5. HERO INITIAL ANIMATIONS ────────────────────────────
    const heroAnimatables = document.querySelectorAll('.title-line, .hero-eyebrow, .tagline, .cta-group, .hero-stat');
    setTimeout(() => {
        heroAnimatables.forEach(el => el.classList.add('active'));
    }, 150);

    // ── 6. PARALLAX HERO BACKGROUND ───────────────────────────
    const hero = document.querySelector('.hero');
    if (hero) {
        let heroTicking = false;
        window.addEventListener('scroll', () => {
            if (!heroTicking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    if (scrollY < window.innerHeight) {
                        hero.style.backgroundPositionY = `calc(50% + ${scrollY * 0.35}px)`;
                    }
                    heroTicking = false;
                });
                heroTicking = true;
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
    document.querySelectorAll('.stat-num[data-target], .counter[data-target]').forEach(el => {
        counterObserver.observe(el);
    });

    // ── 8. DRAGGABLE AUTO-SCROLL MARQUEES ─────────────────────
    const tracks = document.querySelectorAll('.marquee-track');
    tracks.forEach(track => {
        const original = track.innerHTML;
        track.innerHTML = original + original + original;

        track.querySelectorAll('img').forEach(img => {
            img.setAttribute('draggable', 'false');
            img.addEventListener('dragstart', e => e.preventDefault());
            img.addEventListener('mousedown', e => e.preventDefault());
        });

        let isDragging = false;
        let startX, scrollLeft, rafId, velocity = 0, lastX, lastTime, exactScrollLeft = 0; 
        const speed = parseFloat(track.getAttribute('data-speed')) || 1;
        const direction = parseInt(track.getAttribute('data-direction'), 10) || 1;
        const BASE_SPEED = 1; 

        const clampScroll = () => {
            const third = track.scrollWidth / 3;
            if (exactScrollLeft >= third * 2) exactScrollLeft -= third;
            else if (exactScrollLeft <= 0) exactScrollLeft += third;
            track.scrollLeft = exactScrollLeft; 
        };

        const autoScroll = () => {
            if (!isDragging) { exactScrollLeft += BASE_SPEED * speed * direction; clampScroll(); }
            rafId = requestAnimationFrame(autoScroll);
        };

        setTimeout(() => {
            const third = track.scrollWidth / 3;
            exactScrollLeft = third; 
            track.scrollLeft = exactScrollLeft; 
            autoScroll();
        }, 600);

        const onDragStart = (x) => {
            isDragging = true; startX = x - track.offsetLeft; scrollLeft = exactScrollLeft; 
            lastX = x; lastTime = performance.now(); velocity = 0; track.style.cursor = 'grabbing';
            cancelAnimationFrame(rafId);
        };

        const onDragMove = (x) => {
            if (!isDragging) return;
            const now = performance.now(); 
            exactScrollLeft = scrollLeft - ((x - track.offsetLeft - startX) * 1.8); clampScroll();
            velocity = (x - lastX) / (now - lastTime + 1); lastX = x; lastTime = now;
        };

        const endDrag = () => {
            if (!isDragging) return; 
            isDragging = false; track.style.cursor = 'grab';
            let momentum = velocity * 8;
            const decelerate = () => {
                if (Math.abs(momentum) < 0.5) { autoScroll(); return; }
                exactScrollLeft -= momentum; clampScroll(); momentum *= 0.92; requestAnimationFrame(decelerate);
            };
            decelerate();
        };

        track.addEventListener('mousedown', (e) => { if(!e.target.closest('a')) { onDragStart(e.pageX); e.preventDefault(); } });
        track.addEventListener('mousemove', (e) => onDragMove(e.pageX));
        track.addEventListener('mouseup', endDrag); track.addEventListener('mouseleave', endDrag);
        
        track.addEventListener('touchstart', (e) => onDragStart(e.touches[0].pageX), { passive: true });
        track.addEventListener('touchmove', (e) => onDragMove(e.touches[0].pageX), { passive: true });
        track.addEventListener('touchend', endDrag);
    });

    // ── 9. CARD 3D TILT EFFECT ────────────────────────────────
    if (!isTouchDevice) {
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left, y = e.clientY - rect.top;
                const cx = rect.width / 2, cy = rect.height / 2;
                const rotX = ((y - cy) / cy) * -5, rotY = ((x - cx) / cx) * 5;
                card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translate3d(0, -8px, 0)`;
            });
            card.addEventListener('mouseleave', () => card.style.transform = '');
        });
    }

    // ── 10. CONTACT FORM ──────────────────────────────────────
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const btnText = btn.querySelector('.btn-text');
            const btnArrow = btn.querySelector('.btn-arrow');
            const original = btnText.textContent;

            btn.disabled = true; btnText.textContent = 'Sent!';
            if (btnArrow) btnArrow.textContent = '✓';
            btn.style.background = 'var(--cyan)'; btn.style.color = 'var(--bg)';
            btn.style.boxShadow = '0 4px 25px var(--cyan-glow)';

            setTimeout(() => {
                btnText.textContent = original; if (btnArrow) btnArrow.textContent = '→';
                btn.disabled = false; btn.style.background = ''; btn.style.color = '';
                btn.style.boxShadow = ''; form.reset();
            }, 3500);
        });

        form.querySelectorAll('.form-field input, .form-field textarea').forEach(input => {
            input.addEventListener('focus', () => input.closest('.form-field').classList.add('focused'));
            input.addEventListener('blur', () => input.closest('.form-field').classList.remove('focused'));
        });
    }

    // ── 11. SMOOTH ACTIVE NAV LINKS ───────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--cream)' : '';
                });
            }
        });
    }, { threshold: 0.4 });
    sections.forEach(sec => sectionObserver.observe(sec));

    // ── 12. PARALLAX LABEL AND HERO BG TEXT ───────────────────
    const sectionLabels = document.querySelectorAll('.section-label');
    const heroBgText = document.querySelector('.hero-bg-text');
    let labelTicking = false;
    window.addEventListener('scroll', () => {
        if (!labelTicking) {
            window.requestAnimationFrame(() => {
                const sy = window.scrollY;
                sectionLabels.forEach(label => {
                    const rect = label.getBoundingClientRect();
                    const offset = ((rect.top + rect.height / 2) - window.innerHeight / 2) * 0.04;
                    label.style.transform = `translate3d(${offset}px, 0, 0)`;
                });
                if (heroBgText && sy < window.innerHeight) {
                    heroBgText.style.transform = `translate3d(-50%, ${sy * -0.18}px, 0)`;
                    heroBgText.style.opacity = 1 - (sy / window.innerHeight) * 2;
                }
                labelTicking = false;
            });
            labelTicking = true;
        }
    }, { passive: true });
    
    // ── 13. VIDEO / REEL CLICK LOGIC ──────────────────────────
    const modalOverlay = document.getElementById('video-modal');
    const modalIframe  = document.getElementById('modal-iframe');
    const closeModalBtn = document.getElementById('close-modal');
    const customThumbs  = document.querySelectorAll('.reel-card.custom-thumb');

    const isInstagramReel = (url) => /instagram\.com\/(reel|reels)\//i.test(url);
    const toInstagramPostUrl = (embedUrl) => embedUrl.replace(/\/embed\/?$/, '/');

    if (customThumbs.length > 0) {
        customThumbs.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const videoUrl = card.getAttribute('data-video');
                if (!videoUrl) return;

                if (isInstagramReel(videoUrl)) {
                    window.open(toInstagramPostUrl(videoUrl), '_blank', 'noopener,noreferrer');
                } else if (modalOverlay && modalIframe) {
                    modalIframe.src = videoUrl;
                    modalOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                } else {
                    window.open(toInstagramPostUrl(videoUrl), '_blank', 'noopener,noreferrer');
                }
            });
        });

        if (modalOverlay && closeModalBtn) {
            const closeModal = () => {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = '';
                setTimeout(() => { modalIframe.src = ''; }, 400);
            };
            closeModalBtn.addEventListener('click', closeModal);
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) closeModal();
            });
        }
    }

    // ── FILMS CINEMATIC CAROUSEL ─────────────────────────────
    function initFilmsCarousel(stageId, prevBtnSelector, nextBtnSelector, titleId, dotsId) {
        const stage = document.getElementById(stageId);
        if (!stage) return;

        const cards = Array.from(stage.querySelectorAll('.fc-card'));
        const titleDisplay = document.getElementById(titleId);
        const dotsContainer = document.getElementById(dotsId);
        let current = 0;
        const total = cards.length;

        if (dotsContainer) {
            cards.forEach((_, i) => {
                const dot = document.createElement('span');
                dot.className = 'fc-dot' + (i === 0 ? ' active' : '');
                dot.addEventListener('click', () => goTo(i));
                dotsContainer.appendChild(dot);
            });
        }

        function updatePositions() {
            cards.forEach((card, i) => {
                let pos = i - current;
                if (pos > total / 2) pos -= total;
                if (pos < -total / 2) pos += total;
                card.setAttribute('data-pos', pos);
            });
            if (titleDisplay) {
                titleDisplay.textContent = cards[current].querySelector('.fc-card-title').textContent;
            }
            if (dotsContainer) {
                dotsContainer.querySelectorAll('.fc-dot').forEach((d, i) => {
                    d.classList.toggle('active', i === current);
                });
            }
        }

        function goTo(idx) {
            current = ((idx % total) + total) % total;
            updatePositions();
        }

        const section = stage.closest('.films-carousel-section');
        if (section) {
            section.querySelector('.fc-btn-prev').addEventListener('click', () => goTo(current - 1));
            section.querySelector('.fc-btn-next').addEventListener('click', () => goTo(current + 1));
        }

        cards.forEach((card, i) => {
            card.addEventListener('click', () => { if (i !== current) goTo(i); });
        });

        let touchStartX = 0;
        stage.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        stage.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
        });

        section && section.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') goTo(current - 1);
            if (e.key === 'ArrowRight') goTo(current + 1);
        });

        updatePositions();
    }

    initFilmsCarousel('filmsCarousel', '.fc-btn-prev', '.fc-btn-next', 'fcTitleDisplay', 'fcDots');
    initFilmsCarousel('webSeriesCarousel', '.fc-btn-prev', '.fc-btn-next', 'wsTitleDisplay', 'wsDots');

    // ── 14. IMAGE EXPANSION MODAL (PRESS SECTION) ─────────────
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const pressCards = document.querySelectorAll('.press-card:not(.press-link-card)');

    if (imageModal && modalImage) {
        pressCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const imgElement = card.querySelector('.press-img');
                if (imgElement && imgElement.src) {
                    modalImage.src = imgElement.src;
                    imageModal.classList.add('active');
                    document.body.style.overflow = 'hidden'; 
                }
            });
        });

        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal || e.target.closest('#close-image-modal')) {
                imageModal.classList.remove('active');
                document.body.style.overflow = '';
                setTimeout(() => { modalImage.src = ''; }, 400); 
            }
        });
    }

    // ── 15. REEL CAROUSELS — INFINITE AUTO-SCROLL (GPU) ───────
    function initReelCarousel(trackId, dotsId) {
        const track = document.getElementById(trackId);
        if (!track) return;

        const originalCards = Array.from(track.querySelectorAll('.reel-card'));
        if (originalCards.length === 0) return;

        const clone1 = originalCards.map(c => c.cloneNode(true));
        const clone2 = originalCards.map(c => c.cloneNode(true));
        clone1.forEach(c => track.appendChild(c));
        clone2.forEach(c => track.appendChild(c));

        track.querySelectorAll('.reel-card.custom-thumb').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const videoUrl = card.getAttribute('data-video');
                if (!videoUrl) return;
                const modalOverlay = document.getElementById('video-modal');
                const modalIframe  = document.getElementById('modal-iframe');
                const isReel = /instagram\.com\/(reel|reels)\//i.test(videoUrl);
                if (isReel) {
                    window.open(videoUrl.replace(/\/embed\/?$/, '/'), '_blank', 'noopener,noreferrer');
                } else if (modalOverlay && modalIframe) {
                    modalIframe.src = videoUrl;
                    modalOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                } else {
                    window.open(videoUrl.replace(/\/embed\/?$/, '/'), '_blank', 'noopener,noreferrer');
                }
            });
        });

        const GAP = 24; 
        const cardW = () => originalCards[0].offsetWidth + GAP;
        const loopLen = () => originalCards.length * cardW();

        let pos = 0;
        let speed = 0.6;
        let isDragging = false;
        let dragStartX = 0, dragStartPos = 0, lastDragX = 0, velocity = 0;
        let rafId;
        let paused = false;

        const setInitial = () => {
            pos = loopLen();
            track.style.transform = `translate3d(${-pos}px, 0, 0)`;
        };
        setInitial();

        const clamp = () => {
            const len = loopLen();
            if (pos >= len * 2) pos -= len;
            if (pos < 0)        pos += len;
        };

        const tick = () => {
            if (!isDragging && !paused) {
                pos += speed;
                clamp();
                track.style.transform = `translate3d(${-pos}px, 0, 0)`;
            }
            rafId = requestAnimationFrame(tick);
        };
        tick();

        track.style.display = 'flex';
        track.style.willChange = 'transform';
        track.style.gap = `${GAP}px`;

        document.querySelectorAll(`.reel-btn[data-track="${trackId}"]`).forEach(btn => {
            btn.addEventListener('click', () => {
                const dir = parseInt(btn.getAttribute('data-dir'), 10);
                pos += dir * cardW() * 3;
                clamp();
            });
        });

        const onDown = (x) => {
            isDragging = true;
            dragStartX = x; dragStartPos = pos; lastDragX = x; velocity = 0;
            track.style.cursor = 'grabbing';
        };
        const onMove = (x) => {
            if (!isDragging) return;
            const delta = dragStartX - x;
            pos = dragStartPos + delta;
            velocity = x - lastDragX; lastDragX = x;
            clamp();
            track.style.transform = `translate3d(${-pos}px, 0, 0)`;
        };
        const onUp = () => {
            if (!isDragging) return;
            isDragging = false;
            track.style.cursor = 'grab';
            let v = -velocity * 1.5;
            const decel = () => {
                if (Math.abs(v) < 0.3) return;
                pos += v; v *= 0.93; clamp();
                track.style.transform = `translate3d(${-pos}px, 0, 0)`;
                requestAnimationFrame(decel);
            };
            decel();
        };

        track.addEventListener('mousedown', e => { if (!e.target.closest('a')) { onDown(e.clientX); e.preventDefault(); } });
        window.addEventListener('mousemove', e => onMove(e.clientX));
        window.addEventListener('mouseup', onUp);

        track.addEventListener('touchstart', e => onDown(e.touches[0].clientX), { passive: true });
        track.addEventListener('touchmove',  e => onMove(e.touches[0].clientX), { passive: true });
        track.addEventListener('touchend',   onUp);

        track.addEventListener('mouseenter', () => { paused = true; });
        track.addEventListener('mouseleave', () => { paused = false; });

        window.addEventListener('resize', () => {
            pos = loopLen();
            track.style.transform = `translate3d(${-pos}px, 0, 0)`;
        });
    }

    initReelCarousel('liveTrack',     'liveDots');
    initReelCarousel('tvTrack',       'tvDots');
    initReelCarousel('actingTrack',   'actingDots');
    initReelCarousel('trendingTrack', 'trendingDots');

    // ── 16. CARD MAGNETIC GLOW ───────────────────────────────
    if (!isTouchDevice) {
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', ((e.clientX - rect.left) / rect.width * 100) + '%');
                card.style.setProperty('--mouse-y', ((e.clientY - rect.top) / rect.height * 100) + '%');
            });
        });
    }
});