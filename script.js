/* ==============================================
   Cloverleaf Technology — Main Script
   Canvas Particle Hero · Scroll Effects
   Counters · Contact Form · Navigation
   ============================================== */

(() => {
    'use strict';

    /* ─────────────────────────────────────────────
       1. CANVAS PARTICLE ANIMATION
    ──────────────────────────────────────────────── */
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');

    let W, H, particles = [], nodes = [], animId;
    const NODE_COUNT = 60;
    const PARTICLE_COUNT = 100;
    const MAX_LINK_DIST = 160;

    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    class Node {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.r = Math.random() * 1.5 + 0.5;
            this.alpha = Math.random() * 0.5 + 0.3;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > W) this.vx *= -1;
            if (this.y < 0 || this.y > H) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,212,255,${this.alpha})`;
            ctx.fill();
        }
    }

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.size = Math.random() * 1.5 + 0.3;
            this.vy = -(Math.random() * 0.6 + 0.1);
            this.vx = (Math.random() - 0.5) * 0.2;
            this.life = 0;
            this.maxLife = Math.random() * 200 + 100;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life++;
            if (this.life >= this.maxLife) this.reset();
        }
        draw() {
            const progress = this.life / this.maxLife;
            const alpha = progress < 0.2 ? progress / 0.2 : progress > 0.8 ? (1 - progress) / 0.2 : 1;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,255,136,${alpha * 0.3})`;
            ctx.fill();
        }
    }

    function initBodies() {
        nodes = Array.from({ length: NODE_COUNT }, () => new Node());
        particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    }

    function drawLinks() {
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.hypot(dx, dy);
                if (dist < MAX_LINK_DIST) {
                    const alpha = (1 - dist / MAX_LINK_DIST) * 0.25;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function render() {
        ctx.clearRect(0, 0, W, H);
        nodes.forEach(n => { n.update(); n.draw(); });
        drawLinks();
        particles.forEach(p => { p.update(); p.draw(); });
        animId = requestAnimationFrame(render);
    }

    window.addEventListener('resize', () => { resize(); initBodies(); });
    resize();
    initBodies();
    render();


    /* ─────────────────────────────────────────────
       2. SCROLLED NAVBAR
    ──────────────────────────────────────────────── */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    }, { passive: true });


    /* ─────────────────────────────────────────────
       3. HAMBURGER MENU
    ──────────────────────────────────────────────── */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    hamburger.addEventListener('click', () => {
        const open = mobileMenu.classList.toggle('hidden');
        hamburger.classList.toggle('open', !open);
    });
    // Close on link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            hamburger.classList.remove('open');
        });
    });


    /* ─────────────────────────────────────────────
       4. SCROLL REVEAL
    ──────────────────────────────────────────────── */
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = parseFloat(el.style.animationDelay || '0') * 1000;
                setTimeout(() => el.classList.add('revealed'), delay);
                revealObs.unobserve(el);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-element').forEach((el, i) => {
        if (!el.style.animationDelay) el.style.animationDelay = `${i * 0.08}s`;
        revealObs.observe(el);
    });


    /* ─────────────────────────────────────────────
       5. ANIMATED COUNTER
    ──────────────────────────────────────────────── */
    function animateCounter(el) {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '+';
        const duration = 1800;
        const start = performance.now();

        requestAnimationFrame(function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const value = Math.round(eased * target);
            el.textContent = value + (progress >= 1 ? suffix : '');
            if (progress < 1) requestAnimationFrame(tick);
        });
    }

    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));


    /* ─────────────────────────────────────────────
       6. CONTACT FORM
    ──────────────────────────────────────────────── */
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const successMsg = document.getElementById('success-msg');

    function validate(form) {
        let valid = true;
        // Name
        const name = form.querySelector('#name');
        const nameErr = name.nextElementSibling;
        if (!name.value.trim()) { nameErr.classList.remove('hidden'); name.classList.add('border-red-500'); valid = false; }
        else { nameErr.classList.add('hidden'); name.classList.remove('border-red-500'); }
        // Email
        const email = form.querySelector('#email');
        const emailErr = email.nextElementSibling;
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(email.value.trim())) { emailErr.classList.remove('hidden'); email.classList.add('border-red-500'); valid = false; }
        else { emailErr.classList.add('hidden'); email.classList.remove('border-red-500'); }
        // Message
        const msg = form.querySelector('#message');
        const msgErr = msg.nextElementSibling;
        if (!msg.value.trim()) { msgErr.classList.remove('hidden'); msg.classList.add('border-red-500'); valid = false; }
        else { msgErr.classList.add('hidden'); msg.classList.remove('border-red-500'); }
        return valid;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validate(form)) return;

        // Loading state
        submitBtn.classList.add('loading');
        btnText.innerHTML = `<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Sending...`;

        // Simulate async submission (replace with actual endpoint)
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            btnText.innerHTML = 'Send Message <svg class="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>';
            successMsg.classList.remove('hidden');
            successMsg.classList.add('show');
            form.reset();
            // Scroll to success
            successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 1800);
    });

    // Clear errors on input
    form.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('border-red-500');
            const err = input.nextElementSibling;
            if (err && err.classList.contains('form-error')) err.classList.add('hidden');
        });
    });


    /* ─────────────────────────────────────────────
       7. ACTIVE NAV LINK HIGHLIGHT
    ──────────────────────────────────────────────── */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const activeObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    const isActive = link.getAttribute('href') === `#${id}`;
                    link.classList.toggle('text-cyber-cyan', isActive);
                    link.classList.toggle('text-gray-400', !isActive);
                });
            }
        });
    }, { threshold: 0.45 });

    sections.forEach(s => activeObs.observe(s));

})();