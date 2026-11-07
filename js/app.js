/* ==========================================================================
   TRINAH'S SURPRISE — app.js (vanilla JS, no dependencies)
   Content (photos, videos, exam time) lives in assets/media.js — not here.
   Sections in this file:
     1. Helpers          5. Photo + video carousels
     2. Particles bg     6. Typewriter message
     3. Confetti / hearts 7. Survival kit, countdown, hug
     4. Gift opening      8. Start-up
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------ 1. Helpers ------------------------------ */
  var CFG = window.TRINAH_CONFIG || { photos: [], videos: [] };
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function el(tag, cls, attrs) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  /* ------------------------------ 2. Particles ------------------------------ */
  var Particles = (function () {
    var canvas = $('#particles'), ctx = canvas.getContext('2d');
    var W = 0, H = 0, dpr = 1, items = [], running = false;
    var COLORS = ['255,179,209', '245,196,81', '164,123,255', '255,255,255'];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = W < 640 ? 26 : 52;
      while (items.length < count) items.push(make(true));
      items.length = count;
    }
    function make(anywhere) {
      return {
        x: rand(0, W), y: anywhere ? rand(0, H) : H + 20,
        r: rand(1.2, 3.6), vy: rand(0.12, 0.5), vx: rand(-0.15, 0.15),
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
        a: rand(0.25, 0.8), t: rand(0, 6.28), heart: Math.random() < 0.12
      };
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < items.length; i++) {
        var p = items[i];
        p.y -= p.vy; p.x += p.vx + Math.sin(p.t) * 0.12; p.t += 0.02;
        if (p.y < -20) items[i] = make(false);
        var a = p.a * (0.6 + 0.4 * Math.sin(p.t * 2));
        if (p.heart) {
          ctx.globalAlpha = a * 0.7; ctx.font = (p.r * 5) + 'px serif'; ctx.fillText('❤', p.x, p.y);
        } else {
          ctx.globalAlpha = a * 0.25; ctx.fillStyle = 'rgb(' + p.c + ')';
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, 6.283); ctx.fill();
          ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }
    function loop() { if (!running) return; draw(); requestAnimationFrame(loop); }
    function start() { if (running || reduceMotion) return; running = true; requestAnimationFrame(loop); }
    function stop() { running = false; }

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    if (reduceMotion) draw(); else start();
    return {};
  })();

  /* ------------------------------ 3. Confetti & hearts ------------------------------ */
  var Fx = (function () {
    var canvas = $('#confetti'), ctx = canvas.getContext('2d');
    var W = 0, H = 0, parts = [], raf = null;
    var COLORS = ['#ffe29a', '#f5c451', '#ff6fa5', '#ffb3d1', '#a47bff', '#6d3fc9', '#ffffff'];
    var HEARTS = ['❤️', '💖', '💗', '💕', '💘'];
    var scale = reduceMotion ? 0.35 : 1;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function start() { if (!raf) raf = requestAnimationFrame(loop); }
    function loop() {
      ctx.clearRect(0, 0, W, H);
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.life++;
        p.vy += p.g; p.vx *= p.drag; p.x += p.vx + (p.sway ? Math.sin(p.life * 0.08 + p.ph) * p.sway : 0); p.y += p.vy;
        p.rot += p.vr;
        var fade = p.life > p.max - 30 ? Math.max(0, (p.max - p.life) / 30) : 1;
        if (p.life > p.max || p.y > H + 60 || p.y < -80) { parts.splice(i, 1); continue; }
        ctx.save(); ctx.globalAlpha = fade; ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        if (p.heart) { ctx.font = p.size + 'px serif'; ctx.textAlign = 'center'; ctx.fillText(p.heart, 0, 0); }
        else { ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); }
        ctx.restore();
      }
      if (parts.length) raf = requestAnimationFrame(loop);
      else { raf = null; ctx.clearRect(0, 0, W, H); }
    }
    function confetti(x, y, n, spread) {
      n = Math.round(n * scale);
      for (var i = 0; i < n; i++) {
        var ang = rand(0, 6.283), sp = rand(3, spread || 11);
        parts.push({ x: x, y: y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 4, g: 0.24, drag: 0.985, rot: rand(0, 6), vr: rand(-0.3, 0.3),
          w: rand(6, 12), h: rand(4, 8), color: COLORS[Math.floor(Math.random() * COLORS.length)], life: 0, max: rand(110, 200), sway: 0, ph: 0 });
      }
      start();
    }
    function rain(n) {
      n = Math.round(n * scale);
      for (var i = 0; i < n; i++) {
        parts.push({ x: rand(0, W), y: rand(-200, -10), vx: rand(-1, 1), vy: rand(1, 4), g: 0.02, drag: 1, rot: rand(0, 6), vr: rand(-0.2, 0.2),
          w: rand(6, 11), h: rand(4, 8), color: COLORS[Math.floor(Math.random() * COLORS.length)], life: 0, max: 260, sway: 0.6, ph: rand(0, 6) });
      }
      start();
    }
    function hearts(n) {
      n = Math.round(n * scale);
      for (var i = 0; i < n; i++) {
        parts.push({ x: rand(0, W), y: H + rand(10, 160), vx: 0, vy: -rand(2.2, 5.2), g: -0.005, drag: 1, rot: rand(-0.4, 0.4), vr: rand(-0.02, 0.02),
          heart: HEARTS[Math.floor(Math.random() * HEARTS.length)], size: rand(20, 44), life: 0, max: 320, sway: rand(0.5, 1.6), ph: rand(0, 6) });
      }
      start();
    }
    resize();
    window.addEventListener('resize', resize);
    return { confetti: confetti, rain: rain, hearts: hearts };
  })();

  /* ------------------------------ 4. Gift opening ------------------------------ */
  function initGift() {
    var btn = $('#open-btn'), gift = $('#gift'), welcome = $('#welcome'), main = $('#experience');
    var opened = false;
    btn.addEventListener('click', function () {
      if (opened) return; opened = true;
      btn.disabled = true; btn.style.opacity = '0.6';
      gift.classList.add('is-open');
      var r = gift.getBoundingClientRect();
      var cx = r.left + r.width / 2, cy = r.top + r.height * 0.3;
      setTimeout(function () { Fx.confetti(cx, cy, 160, 14); }, 350);
      setTimeout(function () { Fx.rain(120); Fx.confetti(window.innerWidth * 0.2, window.innerHeight * 0.5, 70); Fx.confetti(window.innerWidth * 0.8, window.innerHeight * 0.5, 70); }, 900);
      setTimeout(function () {
        main.hidden = false;
        document.body.classList.remove('is-locked');
        window.scrollTo(0, 0);
        welcome.classList.add('is-leaving');
        observeReveals();
        main.setAttribute('tabindex', '-1');
        main.focus({ preventScroll: true });
      }, 1700);
      setTimeout(function () { welcome.hidden = true; }, 2800);
    });
  }

  /* ------------------------------ Scroll reveal ------------------------------ */
  var revealObserver = null;
  function observeReveals() {
    var nodes = $$('.reveal');
    if (!('IntersectionObserver' in window)) { nodes.forEach(function (n) { n.classList.add('is-visible'); }); return; }
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-visible'); revealObserver.unobserve(e.target); } });
    }, { threshold: 0.12 });
    nodes.forEach(function (n) { revealObserver.observe(n); });
  }

  /* ------------------------------ 5. Carousels ------------------------------ */
  /* Generic carousel: slides in .carousel__track, arrows, dots, swipe, keyboard, autoplay. */
  function Carousel(root, opts) {
    opts = opts || {};
    var self = this;
    var viewport = $('.carousel__viewport', root), track = $('.carousel__track', root);
    var dotsBox = $('.carousel__dots', root), status = $('[data-status]', root);
    var slides = $$('.slide', track), n = slides.length, i = 0;
    var timer = null, inView = true, hovering = false, dragging = false;
    this.index = function () { return i; };

    // Dots
    slides.forEach(function (_, k) {
      var d = el('button', 'carousel__dot', { type: 'button', 'aria-label': 'Go to item ' + (k + 1) });
      d.addEventListener('click', function () { self.go(k, true); });
      dotsBox.appendChild(d);
    });
    var dots = $$('.carousel__dot', dotsBox);

    // Single-item carousels don't need controls
    if (n < 2) { $$('.carousel__arrow', root).forEach(function (a) { a.hidden = true; }); dotsBox.hidden = true; }

    this.go = function (target, byUser) {
      var prev = i;
      i = ((target % n) + n) % n;
      track.style.transform = 'translate3d(' + (-i * 100) + '%,0,0)';
      slides.forEach(function (s, k) {
        var on = k === i;
        s.classList.toggle('is-active', on);
        s.setAttribute('aria-hidden', on ? 'false' : 'true');
        if ('inert' in s) s.inert = !on;
      });
      dots.forEach(function (d, k) { if (k === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
      if (status) status.textContent = 'Item ' + (i + 1) + ' of ' + n;
      if (opts.onChange) opts.onChange(i, prev, n);
      if (byUser) restartAuto();
    };
    this.next = function (u) { self.go(i + 1, u); };
    this.prev = function (u) { self.go(i - 1, u); };

    $('.carousel__arrow--prev', root).addEventListener('click', function () { self.prev(true); });
    $('.carousel__arrow--next', root).addEventListener('click', function () { self.next(true); });

    // Keyboard: arrow keys when the carousel (or anything inside) has focus
    root.addEventListener('keydown', function (e) {
      if (e.target.matches('input')) return;
      if (e.key === 'ArrowLeft') { self.prev(true); e.preventDefault(); }
      else if (e.key === 'ArrowRight') { self.next(true); e.preventDefault(); }
    });

    // Swipe / drag (pointer events cover touch + mouse + pen)
    var sx = 0, sy = 0, dx = 0, tracking = false, pid = null, suppress = false;
    viewport.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.target.closest('input, .vcard__bar')) return;
      tracking = true; dragging = false; sx = e.clientX; sy = e.clientY; dx = 0; pid = e.pointerId;
    });
    viewport.addEventListener('pointermove', function (e) {
      if (!tracking) return;
      dx = e.clientX - sx;
      var dy = e.clientY - sy;
      if (!dragging) {
        if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
          dragging = true;
          try { viewport.setPointerCapture(pid); } catch (err) { /* ignore */ }
          track.classList.add('is-dragging'); viewport.classList.add('is-dragging');
        } else { return; }
      }
      track.style.transform = 'translate3d(calc(' + (-i * 100) + '% + ' + dx + 'px),0,0)';
    });
    function endDrag() {
      if (!tracking) return;
      tracking = false;
      if (dragging) {
        dragging = false;
        track.classList.remove('is-dragging'); viewport.classList.remove('is-dragging');
        var w = viewport.clientWidth || 300;
        if (Math.abs(dx) > w * 0.15) self.go(i + (dx < 0 ? 1 : -1), true); else self.go(i, true);
        suppress = true; setTimeout(function () { suppress = false; }, 60);
      }
    }
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    // A drag must not count as a tap on a button underneath
    viewport.addEventListener('click', function (e) { if (suppress) { e.stopPropagation(); e.preventDefault(); } }, true);
    viewport.addEventListener('dragstart', function (e) { e.preventDefault(); });

    // Autoplay (photos only): pauses on hover/focus/drag, when off-screen or tab hidden
    function restartAuto() {
      clearInterval(timer); timer = null;
      if (!opts.autoplay || reduceMotion || n < 2) return;
      timer = setInterval(function () {
        if (!inView || hovering || dragging || document.hidden) return;
        self.next(false);
      }, opts.autoplay);
    }
    root.addEventListener('mouseenter', function () { hovering = true; });
    root.addEventListener('mouseleave', function () { hovering = false; });
    root.addEventListener('focusin', function () { hovering = true; });
    root.addEventListener('focusout', function () { hovering = false; });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        var now = en[0].isIntersecting;
        if (now && !inView) restartAuto();   // full first interval each time it scrolls into view
        inView = now;
      }, { threshold: 0.3 }).observe(root);
    }

    this.go(0, false);
    restartAuto();
  }

  /* ---------- Photo carousel ---------- */
  function loadImg(img) {
    if (!img || !img.dataset.src) return;
    var src = img.dataset.src; delete img.dataset.src;
    img.addEventListener('load', function () { img.classList.add('is-loaded'); });
    img.addEventListener('error', function () { console.warn('[Trinah site] Could not load image:', src); img.classList.add('is-loaded'); });
    img.src = src;
  }
  function initPhotos() {
    var list = (CFG.photos || []).filter(function (p) { return p && p.src; });
    var section = $('#gallery');
    if (!list.length) { console.info('[Trinah site] No photos listed in assets/media.js — gallery hidden.'); return; }
    section.hidden = false;
    var root = $('#photo-carousel'), track = $('.carousel__track', root);
    list.forEach(function (p, k) {
      var slide = el('div', 'slide', { role: 'group', 'aria-roledescription': 'slide', 'aria-label': (k + 1) + ' of ' + list.length });
      var fig = el('figure', 'card');
      var media = el('div', 'card__media' + (p.fit === 'contain' ? ' is-contain' : ''));
      if (p.fit === 'contain') { var b = el('img', 'blur', { alt: '', 'aria-hidden': 'true', decoding: 'async' }); b.dataset.src = p.src; media.appendChild(b); }
      var img = el('img', 'main', { alt: p.alt || p.caption || 'Photo ' + (k + 1) + ' of Trinah', decoding: 'async', draggable: 'false' });
      img.dataset.src = p.src;
      if (p.focus) img.style.objectPosition = p.focus;
      media.appendChild(img); fig.appendChild(media);
      var cap = el('figcaption', 'card__caption'); cap.textContent = p.caption || '';
      fig.appendChild(cap); slide.appendChild(fig); track.appendChild(slide);
    });
    var slides = $$('.slide', track);
    function preload(idx) {
      [idx, idx + 1, idx - 1].forEach(function (k) {
        var s = slides[((k % slides.length) + slides.length) % slides.length];
        $$('img', s).forEach(loadImg);
      });
    }
    new Carousel(root, { autoplay: 4800, onChange: function (idx) { preload(idx); } });
  }

  /* ---------- Video carousel ---------- */
  function initVideos() {
    var list = (CFG.videos || []).filter(function (v) { return v && v.src; });
    var section = $('#videos');
    if (!list.length) { console.info('[Trinah site] No videos listed in assets/media.js — video section hidden.'); return; }
    section.hidden = false;
    var root = $('#video-carousel'), track = $('.carousel__track', root);
    var vids = [];

    function pauseAll(except) { vids.forEach(function (o) { if (o.video !== except && !o.video.paused) o.video.pause(); }); }

    list.forEach(function (v, k) {
      var slide = el('div', 'slide', { role: 'group', 'aria-roledescription': 'slide', 'aria-label': (k + 1) + ' of ' + list.length });
      var fig = el('figure', 'card vcard');
      var media = el('div', 'card__media');
      var label = v.caption || ('Video ' + (k + 1));

      var thumb = null;
      if (v.poster) { thumb = el('img', 'vcard__thumb', { alt: '', 'aria-hidden': 'true', decoding: 'async', loading: 'lazy' }); thumb.src = v.poster; media.appendChild(thumb); }

      var video = el('video', '', { playsinline: '', 'webkit-playsinline': '', preload: 'none', 'aria-label': label });
      if (v.poster) video.poster = v.poster;
      video.muted = false;
      media.appendChild(video);

      var tap = el('button', 'vcard__tap', { type: 'button', 'aria-label': 'Play or pause: ' + label });
      var big = el('button', 'vcard__play', { type: 'button', 'aria-label': 'Play ' + label }); big.textContent = '▶';
      var bar = el('div', 'vcard__bar');
      var pp = el('button', '', { type: 'button', 'aria-label': 'Play' }); pp.textContent = '▶';
      var seek = el('input', '', { type: 'range', min: '0', max: '1000', value: '0', 'aria-label': 'Seek' });
      var mute = el('button', '', { type: 'button', 'aria-label': 'Mute' }); mute.textContent = '🔊';
      bar.appendChild(pp); bar.appendChild(seek); bar.appendChild(mute);
      media.appendChild(tap); media.appendChild(big); media.appendChild(bar);
      fig.appendChild(media);
      var cap = el('figcaption', 'card__caption'); cap.textContent = v.caption || '';
      fig.appendChild(cap); slide.appendChild(fig); track.appendChild(slide);

      var o = { video: video, fig: fig, src: v.src, loaded: false, hasPoster: !!v.poster };
      vids.push(o);

      // Attach the video file only when it's needed (active slide / first play)
      o.ensure = function (full) {
        if (!o.loaded) {
          o.loaded = true;
          video.preload = full ? 'auto' : 'metadata';
          video.src = full ? o.src : o.src + '#t=0.1'; // #t shows a first-frame thumbnail
        } else if (full) { video.preload = 'auto'; }
      };
      function toggle() {
        if (video.paused) {
          pauseAll(video); o.ensure(true);
          var pr = video.play();
          if (pr && pr.catch) pr.catch(function () { showErr(); });
        } else { video.pause(); }
      }
      function showErr() {
        if ($('.vcard__err', media)) return;
        var e = el('div', 'vcard__err', { role: 'alert' }); e.textContent = 'This video could not be played on this device.';
        media.appendChild(e);
      }
      tap.addEventListener('click', toggle); big.addEventListener('click', toggle); pp.addEventListener('click', toggle);
      mute.addEventListener('click', function () { video.muted = !video.muted; mute.textContent = video.muted ? '🔇' : '🔊'; mute.setAttribute('aria-label', video.muted ? 'Unmute' : 'Mute'); });
      video.addEventListener('play', function () { fig.classList.add('is-playing', 'has-frame'); pp.textContent = '⏸'; pp.setAttribute('aria-label', 'Pause'); });
      function stopped() { fig.classList.remove('is-playing'); pp.textContent = '▶'; pp.setAttribute('aria-label', 'Play'); }
      video.addEventListener('pause', stopped); video.addEventListener('ended', stopped);
      video.addEventListener('loadeddata', function () { if (!o.hasPoster) fig.classList.add('has-frame'); });
      video.addEventListener('error', function () { if (o.loaded) showErr(); });
      video.addEventListener('timeupdate', function () { if (video.duration) seek.value = Math.round(video.currentTime / video.duration * 1000); });
      seek.addEventListener('input', function () { if (video.duration) video.currentTime = seek.value / 1000 * video.duration; });
    });

    document.addEventListener('visibilitychange', function () { if (document.hidden) pauseAll(null); });
    new Carousel(root, {
      autoplay: 0,
      onChange: function (idx, prev) {
        if (prev !== idx) pauseAll(null);   // never two videos at once; leaving a slide pauses it
        vids[idx].ensure(false);             // load only the visible video's metadata
      }
    });
  }

  /* ------------------------------ 6. Typewriter message ------------------------------ */
  var MESSAGE = [
    'Monday is another opportunity for you to show just how far you’ve come.',
    'I know those books have been keeping you busy, and those past papers have probably become your closest friends by now. 😂',
    'But remember, you’ve put in the effort, you’ve prepared, and you are capable of doing great things.',
    'Walk into that examination room with confidence. Take a deep breath, read every question carefully and give it your best.',
    'Don’t let fear convince you that you aren’t ready.',
    'I am wishing you the very best in your UACE examinations. May your hard work speak for you.',
    'You’ve got this, Trinah! ❤️'
  ];
  function initMessage() {
    var body = $('#msg-body'), card = $('#msg-card'), skipBtn = $('#msg-skip');
    var started = false, finished = false, timer = null;
    // Screen readers get the full text at once; the animated copy is hidden from them
    var sr = el('div', 'sr-only'); MESSAGE.forEach(function (t) { var p = el('p'); p.textContent = t; sr.appendChild(p); });
    var vis = el('div', '', { 'aria-hidden': 'true' });
    body.appendChild(sr); body.appendChild(vis);

    function showAll() {
      clearTimeout(timer); finished = true; vis.innerHTML = '';
      MESSAGE.forEach(function (t, k) { var p = el('p', k === MESSAGE.length - 1 ? 'is-last' : ''); p.textContent = t; vis.appendChild(p); });
      skipBtn.hidden = true;
    }
    function run() {
      if (started) return; started = true;
      if (reduceMotion) { showAll(); return; }
      var li = 0;
      (function nextLine() {
        if (finished) return;
        if (li >= MESSAGE.length) { finished = true; skipBtn.hidden = true; return; }
        var chars = Array.from(MESSAGE[li]), ci = 0;
        var p = el('p', (li === MESSAGE.length - 1 ? 'is-last ' : '') + 'is-typing'); vis.appendChild(p);
        (function tick() {
          if (finished) return;
          ci++; p.textContent = chars.slice(0, ci).join('');
          if (ci < chars.length) {
            var ch = chars[ci - 1];
            timer = setTimeout(tick, /[.,!?]/.test(ch) ? 170 : 24);
          } else {
            p.classList.remove('is-typing'); li++; timer = setTimeout(nextLine, 650);
          }
        })();
      })();
    }
    skipBtn.addEventListener('click', function (e) { e.stopPropagation(); started = true; showAll(); });
    card.addEventListener('click', function () { if (started && !finished) showAll(); });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { run(); io.disconnect(); } }, { threshold: 0.35 });
      io.observe(card);
    } else { run(); }
  }

  /* ------------------------------ 7a. Survival kit ------------------------------ */
  function initKit() {
    $$('.kit__card').forEach(function (card) {
      var front = $('.kit__front', card), back = $('.kit__back', card);
      card.addEventListener('click', function () {
        var on = card.classList.toggle('is-flipped');
        card.setAttribute('aria-pressed', on ? 'true' : 'false');
        front.setAttribute('aria-hidden', on ? 'true' : 'false');
        back.setAttribute('aria-hidden', on ? 'false' : 'true');
      });
    });
    var btn = $('#exam-btn'), msg = $('#exam-msg'), kit = $('#kit');
    btn.addEventListener('click', function () {
      kit.classList.add('exam-on');
      document.body.classList.remove('shake'); void document.body.offsetWidth; document.body.classList.add('shake');
      var flash = el('div', 'flash'); document.body.appendChild(flash); setTimeout(function () { flash.remove(); }, 1000);
      var r = btn.getBoundingClientRect();
      Fx.confetti(r.left + r.width / 2, r.top, 140, 15);
      setTimeout(function () { Fx.rain(80); }, 250);
      msg.classList.remove('is-on'); void msg.offsetWidth;
      msg.textContent = 'TRINAH MODE ACTIVATED. UACE, YOU HAVE BEEN WARNED! 😂';
      msg.classList.add('is-on');
      btn.textContent = 'EXAM MODE ON 🚀';
      msg.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    });
  }

  /* ------------------------------ 7b. Countdown ------------------------------ */
  function nextMondayEight() {
    // Fallback if examStart in media.js is missing/invalid: next Monday 08:00 Uganda time (UTC+3)
    var eat = new Date(Date.now() + 3 * 3600e3);              // UTC getters now read as Uganda wall-clock
    var add = (1 - eat.getUTCDay() + 7) % 7;
    if (add === 0 && eat.getUTCHours() >= 8) add = 7;
    return new Date(Date.UTC(eat.getUTCFullYear(), eat.getUTCMonth(), eat.getUTCDate() + add, 8, 0, 0) - 3 * 3600e3);
  }
  function initCountdown() {
    var target = new Date(CFG.examStart);
    if (isNaN(target.getTime())) { console.warn('[Trinah site] examStart invalid — using next Monday 08:00 EAT.'); target = nextMondayEight(); }
    var tz = { timeZone: 'Africa/Kampala' };
    var dayName = new Intl.DateTimeFormat('en-GB', Object.assign({ weekday: 'long' }, tz)).format(target);
    var when = new Intl.DateTimeFormat('en-GB', Object.assign({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }, tz)).format(target);
    $('#count-title-text').textContent = dayName.toUpperCase() + ' IS COMING';
    $('#count-note').textContent = 'Starts ' + when + ' (Uganda time)';
    var d = $('#cd-days'), h = $('#cd-hours'), m = $('#cd-mins'), s = $('#cd-secs'), timer = null;
    function pad(x) { return x < 10 ? '0' + x : '' + x; }
    function tick() {
      var diff = target.getTime() - Date.now();
      if (diff <= 0) {
        clearInterval(timer);
        $('#count-grid').hidden = true; $('#count-note').hidden = true; $('#count-done').hidden = false;
        $('#count-title-text').textContent = 'THE BIG DAY'; $('#count-title-emo').textContent = '🎓';
        return;
      }
      var t = Math.floor(diff / 1000);
      d.textContent = Math.floor(t / 86400); h.textContent = pad(Math.floor(t % 86400 / 3600));
      m.textContent = pad(Math.floor(t % 3600 / 60)); s.textContent = pad(t % 60);
    }
    tick(); timer = setInterval(tick, 1000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) tick(); });
  }

  /* ------------------------------ 7c. Virtual hug ------------------------------ */
  function initHug() {
    var btn = $('#hug-btn'), hug = $('#hug');
    btn.addEventListener('click', function () {
      hug.hidden = false;
      Fx.hearts(60);
      setTimeout(function () { Fx.hearts(40); }, 700);
      setTimeout(function () { Fx.confetti(window.innerWidth / 2, window.innerHeight * 0.6, 90); }, 400);
      btn.textContent = 'ANOTHER HUG 🤗';
      hug.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    });
  }

  /* ------------------------------ 8. Start-up ------------------------------ */
  function init() {
    initGift();
    initPhotos();
    initVideos();
    initMessage();
    initKit();
    initCountdown();
    initHug();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
