/* Kuisin — landing page behaviour
   No dependencies. Everything below runs client-side on authored demo data. */
(function () {
  'use strict';

  var D = window.QUIZ_DATA || { questions: [], results: [], duels: [] };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------- Toast ---------------- */
  var toastEl = $('#toast'), toastT;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2400);
  }

  /* ---------------- Copy to clipboard ---------------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-1000px';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); resolve(); }
      catch (e) { reject(e); }
      finally { document.body.removeChild(ta); }
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-copy]');
    if (!btn) return;
    var target = $(btn.getAttribute('data-copy'));
    if (!target) return;
    copyText(target.textContent.trim())
      .then(function () { toast('Tautan disalin'); })
      .catch(function () { toast('Tidak bisa menyalin — salin manual ya'); });
  });

  /* ---------------- Nav ---------------- */
  var nav = $('#nav');
  function onScroll() { if (nav) nav.classList.toggle('is-stuck', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var navToggle = $('#navtoggle'), navLinks = $('#navlinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------------- Reveal on scroll ---------------- */
  var revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------- Hero duel board ---------------- */
  var board = $('#duelboard');
  var el = {
    q: $('#duelq'), a: $('#duelA'), an: $('#duelAn'), b: $('#duelB'), bn: $('#duelBn'),
    abar: $('#duelAbar'), bbar: $('#duelBbar'), af: $('#duelAf'), bf: $('#duelBf'),
    step: $('#duelstep'), pips: $('#duelpips'), more: $('#duelmore')
  };
  var MAX = 9, duelIdx = 0, rotateT, countRaf, locked = false;

  function countTo(node, to) {
    if (reduce || !node) { node && (node.textContent = to); return; }
    var from = parseInt(node.textContent, 10) || 0, t0 = performance.now(), dur = 620;
    cancelAnimationFrame(countRaf);
    (function tick(now) {
      var p = Math.min(1, (now - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      node.textContent = Math.round(from + (to - from) * e);
      if (p < 1) countRaf = requestAnimationFrame(tick);
    })(t0);
  }

  function pips(n) {
    if (!el.pips) return;
    el.pips.innerHTML = '';
    for (var i = 0; i < 7; i++) {
      var s = document.createElement('i');
      if (i < n) s.className = 'on';
      else if (i === n) s.className = 'cur';
      el.pips.appendChild(s);
    }
  }

  function paint(d, animate) {
    if (!el.q) return;
    var set = function () {
      el.q.textContent = d.q;
      el.a.textContent = d.a.n; el.b.textContent = d.b.n;
      el.abar.textContent = d.a.n; el.bbar.textContent = d.b.n;
      el.more.textContent = d.more;
      el.af.style.width = Math.min(100, (d.a.s / MAX) * 100) + '%';
      el.bf.style.width = Math.min(100, (d.b.s / MAX) * 100) + '%';
      $$('.duel__side').forEach(function (side, i) {
        side.classList.toggle('duel__side--lead', (i === 0 ? d.a.s : d.b.s) >= (i === 0 ? d.b.s : d.a.s));
      });
      var step = Math.min(7, Math.max(1, Math.round((d.a.s + d.b.s) / 2)));
      el.step.textContent = step;
      pips(step);
      if (animate) { countTo(el.an, d.a.s); countTo(el.bn, d.b.s); }
      else { el.an.textContent = d.a.s; el.bn.textContent = d.b.s; }
    };
    if (!animate || reduce || !board) { set(); return; }
    board.classList.add('is-swap');
    setTimeout(function () { set(); board.classList.remove('is-swap'); }, 280);
  }

  function rotate() {
    if (locked || !D.duels || D.duels.length < 2) return;
    duelIdx = (duelIdx + 1) % D.duels.length;
    paint(D.duels[duelIdx], true);
  }

  if (D.duels && D.duels.length) {
    paint(D.duels[0], true);
    rotateT = setInterval(rotate, 5200);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) clearInterval(rotateT);
      else rotateT = setInterval(rotate, 5200);
    });
  }

  /* ---------------- Challenge forms ---------------- */
  var NAMES = ['Rani', 'Bagas', 'Nadia', 'Sari', 'Dewi', 'Yoga', 'Tika', 'Fajar', 'Intan', 'Rio'];

  function mintCode() {
    var s = '', chars = 'abcdefghjkmnpqrstuvwxyz23456789';
    for (var i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  }

  function wireForm(formId, errId, readyId, linkId, onSuccess) {
    var form = $('#' + formId);
    if (!form) return;
    var err = $('#' + errId), ready = $('#' + readyId), link = $('#' + linkId);
    var input = $('input', form);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (input.value || '').trim().replace(/\s+/g, ' ');
      if (name.length < 2) {
        err.textContent = 'Nama minimal 2 huruf.';
        input.focus();
        return;
      }
      if (name.length > 18) { err.textContent = 'Nama maksimal 18 huruf.'; return; }
      err.textContent = '';
      var url = 'kuisin.id/t/' + mintCode();
      link.textContent = url;
      form.hidden = true;
      ready.hidden = false;
      if (onSuccess) onSuccess(name, url);
    });

    input.addEventListener('input', function () { if (err.textContent) err.textContent = ''; });
  }

  function claimBoard(name) {
    locked = true;
    clearInterval(rotateT);
    var opp = NAMES[Math.floor(Math.random() * NAMES.length)];
    var a = 5 + Math.floor(Math.random() * 3);
    var b = 3 + Math.floor(Math.random() * 4);
    var d = {
      q: 'Seberapa receh kamu vs ' + opp + '?',
      a: { n: name, s: a }, b: { n: opp, s: b },
      more: '1 orang lagi main'
    };
    paint(d, true);
    toast('Tantanganmu sudah tampil di papan');
  }

  wireForm('heroform', 'heroerr', 'heroready', 'herolink', claimBoard);
  wireForm('footform', 'footerr', 'footready', 'footlink', null);

  /* ---------------- Quiz engine ---------------- */
  var quiz = $('#quiz'), stage = $('#quizstage'), prog = $('#quizprog'), count = $('#quizcount');
  if (quiz && stage) {
    var idx = 0, score = 0, keys = ['A', 'B', 'C', 'D', 'E', 'F'];

    function buildProg() {
      prog.innerHTML = '';
      D.questions.forEach(function () { prog.appendChild(document.createElement('i')); });
      markProg();
    }
    function markProg() {
      $$('i', prog).forEach(function (b, i) {
        b.className = i < idx ? 'done' : (i === idx ? 'cur' : '');
      });
    }

    function renderQuestion() {
      var q = D.questions[idx];
      count.textContent = 'Pertanyaan ' + (idx + 1) + ' dari ' + D.questions.length;
      markProg();

      var wrap = document.createElement('div');
      var h = document.createElement('h3');
      h.className = 'quiz__q';
      h.textContent = q.q;
      wrap.appendChild(h);

      var list = document.createElement('div');
      list.className = 'quiz__opts';
      q.opts.forEach(function (o, i) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'opt';
        btn.innerHTML = '<span class="opt__key" aria-hidden="true">' + keys[i] + '</span><span>' + o.t + '</span>';
        btn.addEventListener('click', function () { choose(btn, o, list); });
        list.appendChild(btn);
      });
      wrap.appendChild(list);

      stage.innerHTML = '';
      stage.appendChild(wrap);
      stage.classList.remove('is-swap');
    }

    function choose(btn, opt, list) {
      if (list.dataset.done) return;
      list.dataset.done = '1';
      btn.classList.add('is-chosen');
      $$('button', list).forEach(function (b) { b.disabled = true; });
      score += opt.s;
      setTimeout(function () {
        idx++;
        if (idx >= D.questions.length) return showResult();
        stage.classList.add('is-swap');
        setTimeout(renderQuestion, 240);
      }, reduce ? 0 : 300);
    }

    function band() {
      for (var i = 0; i < D.results.length; i++) if (score >= D.results[i].min) return D.results[i];
      return D.results[D.results.length - 1];
    }

    function showResult() {
      var r = band();
      count.textContent = 'Selesai';
      prog.innerHTML = '';
      $$('i', prog);

      var art = 'halftone';
      if (r.art === 'ember') art = 'card__art--ember';
      else if (r.art === 'plasma') art = 'card__art--plasma';

      var d = document.createElement('div');
      d.className = 'result';
      d.innerHTML =
        '<div class="result__art ' + (art === 'halftone' ? 'halftone' : '') + '" ' +
          (art === 'halftone' ? '' : 'style="background:var(--color-' + (r.art === 'ember' ? 'ember' : 'plasma-violet') + ')"') +
        '></div>' +
        '<p class="mono-meta">Skor kamu ' + score + ' dari ' + (D.questions.length * 2) + '</p>' +
        '<h3 class="result__title">' + r.title + '</h3>' +
        '<p class="result__desc">' + r.desc + '</p>' +
        '<div class="result__share">' +
          '<button class="btn" type="button" id="sharebtn">Bagikan hasil</button>' +
          '<button class="btn btn--ghost" type="button" id="againbtn">Ulangi</button>' +
        '</div>';
      stage.innerHTML = '';
      stage.appendChild(d);

      $('#againbtn').addEventListener('click', function () {
        idx = 0; score = 0;
        stage.classList.add('is-swap');
        setTimeout(function () { renderQuestion(); buildProg(); }, 220);
      });
      $('#sharebtn').addEventListener('click', function () {
        var text = 'Aku dapat "' + r.title + '" di kuis ' + D.title + ' (skor ' + score + '). Coba kalahin aku: kuisin.id/t/' + mintCode();
        if (navigator.share) {
          navigator.share({ title: 'Kuisin', text: text }).catch(function () {});
        } else {
          copyText(text).then(function () { toast('Hasil disalin, tinggal tempel'); })
            .catch(function () { toast('Salin manual ya'); });
        }
      });
    }

    if (D.questions.length) { renderQuestion(); buildProg(); }
  }
})();
