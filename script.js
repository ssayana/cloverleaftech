/* ==============================================
   Cloverleaf Technology — Main Script
   Canvas Particle Hero · Scroll Effects
   Counters · Contact Form · Navigation
   Service Modals
   ============================================== */

(function() {
  'use strict';

  /* ─────────────────────────────────────────────
     1. CANVAS PARTICLE ANIMATION
  ──────────────────────────────────────────────── */
  var canvas = document.getElementById('hero-canvas');
  var ctx    = canvas.getContext('2d');
  var W, H, particles = [], nodes = [];
  var NODE_COUNT     = 60;
  var PARTICLE_COUNT = 100;
  var MAX_LINK_DIST  = 160;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Node() { this.reset(); }
  Node.prototype.reset = function() {
    this.x     = Math.random() * W;
    this.y     = Math.random() * H;
    this.vx    = (Math.random() - 0.5) * 0.4;
    this.vy    = (Math.random() - 0.5) * 0.4;
    this.r     = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.3;
  };
  Node.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };
  Node.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,212,255,' + this.alpha + ')';
    ctx.fill();
  };

  function Particle() { this.reset(); }
  Particle.prototype.reset = function() {
    this.x       = Math.random() * W;
    this.y       = Math.random() * H;
    this.size    = Math.random() * 1.5 + 0.3;
    this.vy      = -(Math.random() * 0.6 + 0.1);
    this.vx      = (Math.random() - 0.5) * 0.2;
    this.life    = 0;
    this.maxLife = Math.random() * 200 + 100;
  };
  Particle.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    if (this.life >= this.maxLife) this.reset();
  };
  Particle.prototype.draw = function() {
    var p = this.life / this.maxLife;
    var a = p < 0.2 ? p / 0.2 : p > 0.8 ? (1 - p) / 0.2 : 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,255,136,' + (a * 0.3) + ')';
    ctx.fill();
  };

  function initBodies() {
    nodes     = [];
    particles = [];
    for (var i = 0; i < NODE_COUNT;     i++) nodes.push(new Node());
    for (var j = 0; j < PARTICLE_COUNT; j++) particles.push(new Particle());
  }

  function drawLinks() {
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx   = nodes[i].x - nodes[j].x;
        var dy   = nodes[i].y - nodes[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_LINK_DIST) {
          var a = (1 - dist / MAX_LINK_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = 'rgba(0,212,255,' + a + ')';
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function render() {
    ctx.clearRect(0, 0, W, H);
    nodes.forEach(function(n)     { n.update(); n.draw(); });
    drawLinks();
    particles.forEach(function(p) { p.update(); p.draw(); });
    requestAnimationFrame(render);
  }

  window.addEventListener('resize', function() { resize(); initBodies(); });
  resize();
  initBodies();
  render();


  /* ─────────────────────────────────────────────
     2. SCROLLED NAVBAR
  ──────────────────────────────────────────────── */
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else                      navbar.classList.remove('scrolled');
  }, { passive: true });


  /* ─────────────────────────────────────────────
     3. HAMBURGER MENU
  ──────────────────────────────────────────────── */
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  hamburger.addEventListener('click', function() {
    var open = mobileMenu.classList.toggle('hidden');
    hamburger.classList.toggle('open', !open);
  });
  document.querySelectorAll('.mobile-nav-link').forEach(function(link) {
    link.addEventListener('click', function() {
      mobileMenu.classList.add('hidden');
      hamburger.classList.remove('open');
    });
  });


  /* ─────────────────────────────────────────────
     4. SCROLL REVEAL
  ──────────────────────────────────────────────── */
  var revealObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el    = entry.target;
        var delay = parseFloat(el.style.animationDelay || '0') * 1000;
        setTimeout(function() { el.classList.add('revealed'); }, delay);
        revealObs.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-element').forEach(function(el, i) {
    if (!el.style.animationDelay) el.style.animationDelay = (i * 0.08) + 's';
    revealObs.observe(el);
  });


  /* ─────────────────────────────────────────────
     5. ANIMATED COUNTER
  ──────────────────────────────────────────────── */
  function animateCounter(el) {
    var target   = parseInt(el.dataset.count, 10);
    var suffix   = el.dataset.suffix || '';
    var duration = 1800;
    var start    = performance.now();
    function tick(now) {
      var elapsed  = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased    = 1 - Math.pow(1 - progress, 3);
      var value    = Math.round(eased * target);
      el.textContent = value + (progress >= 1 ? suffix : '');
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var counterObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(function(el) { counterObs.observe(el); });


  /* ─────────────────────────────────────────────
     6. CONTACT FORM
  ──────────────────────────────────────────────── */
  var form       = document.getElementById('contact-form');
  var submitBtn  = document.getElementById('submit-btn');
  var btnText    = document.getElementById('btn-text');
  var successMsg = document.getElementById('success-msg');

  function validate(frm) {
    var valid = true;
    var name     = frm.querySelector('#name');
    var nameErr  = name.nextElementSibling;
    if (!name.value.trim()) { nameErr.classList.remove('hidden'); name.classList.add('border-red-500'); valid = false; }
    else                     { nameErr.classList.add('hidden');    name.classList.remove('border-red-500'); }

    var email    = frm.querySelector('#email');
    var emailErr = email.nextElementSibling;
    var emailRe  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email.value.trim())) { emailErr.classList.remove('hidden'); email.classList.add('border-red-500'); valid = false; }
    else                                    { emailErr.classList.add('hidden');    email.classList.remove('border-red-500'); }

    var msg    = frm.querySelector('#message');
    var msgErr = msg.nextElementSibling;
    if (!msg.value.trim()) { msgErr.classList.remove('hidden'); msg.classList.add('border-red-500'); valid = false; }
    else                    { msgErr.classList.add('hidden');    msg.classList.remove('border-red-500'); }
    return valid;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validate(form)) return;
    submitBtn.classList.add('loading');
    btnText.innerHTML = '<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Sending...';
    setTimeout(function() {
      submitBtn.classList.remove('loading');
      btnText.innerHTML = 'Send Message <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>';
      successMsg.classList.remove('hidden');
      successMsg.classList.add('show');
      form.reset();
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1800);
  });

  form.querySelectorAll('.form-input').forEach(function(input) {
    input.addEventListener('input', function() {
      input.classList.remove('border-red-500');
      var err = input.nextElementSibling;
      if (err && err.classList.contains('form-error')) err.classList.add('hidden');
    });
  });


  /* ─────────────────────────────────────────────
     7. ACTIVE NAV LINK HIGHLIGHT
  ──────────────────────────────────────────────── */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  var activeObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        navLinks.forEach(function(link) {
          var isActive = link.getAttribute('href') === '#' + id;
          link.classList.toggle('text-cyber-cyan', isActive);
          link.classList.toggle('text-gray-400',  !isActive);
        });
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(function(s) { activeObs.observe(s); });


  /* ─────────────────────────────────────────────
     8. SERVICE MODALS
  ──────────────────────────────────────────────── */
  var modalDataEl  = document.getElementById('modal-data');
  var modalData    = modalDataEl ? JSON.parse(modalDataEl.textContent) : {};
  var modalOverlay = document.getElementById('modal-overlay');
  var modalBackdrop= document.getElementById('modal-backdrop');
  var modalPanel   = document.getElementById('modal-panel');
  var modalContent = document.getElementById('modal-content');
  var modalClose   = document.getElementById('modal-close');

  var colorMap = {
    cyan:   { text: 'text-cyber-cyan',         bg: 'bg-cyber-cyan/10',   border: 'border-cyber-cyan/30' },
    green:  { text: 'text-cyber-green',        bg: 'bg-cyber-green/10',  border: 'border-cyber-green/30' },
    purple: { text: 'text-cyber-purple-light', bg: 'bg-cyber-purple/20', border: 'border-cyber-purple/40' },
    amber:  { text: 'text-cyber-amber',        bg: 'bg-cyber-amber/10',  border: 'border-cyber-amber/30' }
  };

  function buildFeature(f, clr) {
    return '<div class="p-4 rounded-xl border border-cyber-border bg-cyber-bg hover:border-cyber-cyan/30 transition-colors duration-200">' +
      '<div class="flex items-start gap-3">' +
        '<span class="' + clr.text + ' text-base leading-none mt-0.5">\u2726</span>' +
        '<div>' +
          '<div class="text-white font-semibold text-sm mb-1">' + f.name + '</div>' +
          '<div class="text-gray-500 text-xs leading-relaxed">' + f.desc + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function buildStat(s, clr) {
    return '<div class="text-center p-4 rounded-xl border border-cyber-border bg-cyber-bg">' +
      '<div class="font-display text-2xl font-black ' + clr.text + ' mb-1">' + s.value + '</div>' +
      '<div class="text-xs text-gray-500 tracking-wider">' + s.label + '</div>' +
    '</div>';
  }

  function buildModalHTML(key) {
    var d = modalData[key];
    if (!d) return '';
    var c = colorMap[d.color] || colorMap.cyan;

    var feats = '';
    for (var i = 0; i < d.features.length; i++) feats += buildFeature(d.features[i], c);

    var stats = '';
    if (d.stats) {
      var statItems = '';
      for (var j = 0; j < d.stats.length; j++) statItems += buildStat(d.stats[j], c);
      stats = '<div class="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">' + statItems + '</div>';
    }

    var badge = d.badge ? '<span class="ml-2 px-2 py-0.5 text-xs font-bold rounded ' + c.bg + ' ' + c.text + ' border ' + c.border + '">' + d.badge + '</span>' : '';

    return (
      '<div class="flex items-center gap-4 mb-6 pb-6 border-b border-cyber-border">' +
        '<div class="w-12 h-12 rounded-xl flex items-center justify-center ' + c.bg + ' border ' + c.border + ' flex-shrink-0">' +
          '<svg class="w-6 h-6 ' + c.text + '" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="' + d.icon + '"/>' +
          '</svg>' +
        '</div>' +
        '<div class="flex items-center flex-wrap gap-2">' +
          '<h3 class="font-display text-xl font-black text-white">' + d.title + '</h3>' + badge +
        '</div>' +
      '</div>' +
      '<p class="text-gray-400 text-sm leading-relaxed mb-8">' + d.description + '</p>' +
      '<div class="mb-2">' +
        '<div class="text-xs text-gray-500 font-semibold tracking-widest uppercase mb-4">Key Benefits</div>' +
        '<div class="grid sm:grid-cols-2 gap-3">' + feats + '</div>' +
      '</div>' +
      stats +
      '<div class="mt-8 pt-6 border-t border-cyber-border flex flex-col sm:flex-row items-start sm:items-center gap-4">' +
        '<a href="#contact" id="modal-cta" class="inline-flex items-center gap-2 px-6 py-3 font-bold text-cyber-bg bg-cyber-cyan rounded hover:shadow-[0_0_25px_rgba(0,212,255,0.4)] transition-all duration-300 text-sm tracking-wider">' +
          'Get Started <span>\u2192</span>' +
        '</a>' +
        '<p class="text-gray-600 text-xs">Talk to our team about ' + d.title.toLowerCase() + '.</p>' +
      '</div>'
    );
  }

  function openModal(key) {
    if (!modalOverlay) return;
    modalContent.innerHTML = buildModalHTML(key);
    modalOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function() {
      modalBackdrop.style.opacity = '1';
      modalPanel.style.transform  = 'translateY(0)';
      modalPanel.style.opacity    = '1';
    });
    var cta = document.getElementById('modal-cta');
    if (cta) cta.addEventListener('click', closeModal);
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalBackdrop.style.opacity = '0';
    modalPanel.style.transform  = 'translateY(2rem)';
    modalPanel.style.opacity    = '0';
    setTimeout(function() {
      modalOverlay.classList.add('hidden');
      document.body.style.overflow = '';
      modalContent.innerHTML = '';
    }, 300);
  }

  document.querySelectorAll('.learn-more-btn').forEach(function(btn) {
    btn.addEventListener('click', function() { openModal(btn.dataset.modal); });
  });

  if (modalClose)    modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModal(); });

}());