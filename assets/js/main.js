/* ==========================================================
   Portfolio Léa Javon — scripts communs + rendu des pages
   Les textes et les projets viennent de content/site.json
   et content/projets.json (modifiables avec Pages CMS).
   ========================================================== */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const store = {
  get: k => { try { return sessionStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { sessionStorage.setItem(k, v); } catch {} },
  del: k => { try { sessionStorage.removeItem(k); } catch {} },
};

const CATS = { logo: 'Logo', site: 'Site internet', contenu: 'Création de contenu' };
const FILTERS = [['tout', 'Tout'], ['logo', 'Logos'], ['site', 'Sites internet'], ['contenu', 'Création de contenu']];

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// *mot* devient <em>mot</em> (mis en rose)
const rich = s => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');
const paras = s => String(s ?? '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean).map(p => `<p>${rich(p)}</p>`).join('');
const pad2 = n => String(n).padStart(2, '0');

async function getJSON(path) {
  const r = await fetch(path, { cache: 'no-cache' });
  if (!r.ok) throw new Error(`${path} : ${r.status}`);
  return r.json();
}

/* ---------- Stickers ---------- */
const C = { bg: '#24150F', ink: '#F4E7DA', rose: '#F29BB5', sun: '#FFD23F', bg3: '#3D2619' };
const SVG = {
  mug: (bg, fg) => `<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="56" fill="${bg}"/><path d="M44 40c0-6 6-6 6-12M58 40c0-6 6-6 6-12M72 40c0-6 6-6 6-12" stroke="${fg}" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="34" y="48" width="44" height="40" rx="8" fill="${fg}"/><path d="M78 56h6a10 10 0 0 1 0 20h-6" stroke="${fg}" stroke-width="6" fill="none"/></svg>`,
  horseshoe: (bg, fg) => `<svg viewBox="0 0 120 120" aria-hidden="true"><rect x="6" y="6" width="108" height="108" rx="30" fill="${bg}"/><path d="M38 88V60a22 22 0 0 1 44 0v28" stroke="${fg}" stroke-width="14" fill="none" stroke-linecap="round"/><g fill="${bg}"><circle cx="38" cy="66" r="2.6"/><circle cx="38" cy="78" r="2.6"/><circle cx="82" cy="66" r="2.6"/><circle cx="82" cy="78" r="2.6"/><circle cx="44" cy="48" r="2.6"/><circle cx="76" cy="48" r="2.6"/></g></svg>`,
  eiffel: (bg, fg) => `<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="56" fill="${bg}"/><path d="M60 16l3 20h-6zM57 36h6l5 26H52zM48 62h24l14 36H72q-12-16-24 0H34z" fill="${fg}"/><rect x="45" y="60" width="30" height="4" fill="${fg}"/><rect x="51" y="34" width="18" height="3" fill="${fg}"/></svg>`,
  towers: (bg, fg) => `<svg viewBox="0 0 120 120" aria-hidden="true"><rect x="6" y="14" width="108" height="92" rx="20" fill="${bg}"/><path d="M24 84V46h4v-5h4v5h4v-5h4v5h4v38zM76 84V52h4v-5h4v5h4v-5h4v5h4v32z" fill="${fg}"/><rect x="48" y="70" width="28" height="4" fill="${fg}"/><path d="M14 92q8-6 16 0t16 0 16 0 16 0 16 0 16 0" stroke="${fg}" stroke-width="3.5" fill="none"/></svg>`,
  loupe: (bg, fg) => `<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="56" fill="${bg}"/><circle cx="52" cy="52" r="20" stroke="${fg}" stroke-width="7" fill="none"/><path d="M67 67l20 20" stroke="${fg}" stroke-width="10" stroke-linecap="round"/></svg>`,
  star: bg => `<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M60 4l12 40 44 16-44 16-12 40-12-40L4 60l44-16z" fill="${bg}"/></svg>`,
  cursor: (bg, fg) => `<svg viewBox="0 0 120 120" aria-hidden="true"><rect x="6" y="6" width="108" height="108" rx="26" fill="${bg}"/><path d="M40 30l44 30-20 4 12 22-8 4-12-22-16 14z" fill="${fg}"/></svg>`,
};
const pill = (t, bg, fg, fs) => `<span class="pill" style="--sb:${bg};--sf:${fg};${fs ? `--fs:${fs}px` : ''}">${t}</span>`;

// x, y : position sur ordinateur (%) · mx, my : position sur mobile · d : profondeur de l'effet souris
const HERO_STICKERS = [
  { h: SVG.star(C.sun), x: 18, y: 15, mx: 76, my: 14, w: 82, r: 0, d: 30 },
  { h: SVG.mug(C.rose, C.bg), x: 70, y: 17, mx: 73, my: 42, w: 112, r: 10, d: 20 },
  { h: SVG.horseshoe(C.ink, C.bg), x: 15, y: 58, mx: 3, my: 52, w: 104, r: -12, d: 24 },
  { h: SVG.cursor(C.sun, C.bg), x: 87, y: 38, mx: 77, my: 66, w: 92, r: 8, d: 16 },
  { h: pill('chocolat chaud &gt; café', C.ink, C.bg), x: 57, y: 35, mx: 2, my: 40, w: 'auto', r: 6, d: 34 },
  { h: pill('Paris ↔ La Rochelle', C.rose, C.bg), x: 21, y: 47, w: 'auto', r: -6, d: 12, mHide: true },
  { h: pill('pixel perfect', C.sun, C.bg, 14), x: 57, y: 79, mx: 52, my: 75, w: 'auto', r: -3, d: 28 },
];

function initStickers(stage, list) {
  if (!stage) return;
  list.forEach((s, i) => {
    const el = document.createElement('div');
    el.className = 'st' + (s.mHide ? ' m-hide' : '');
    el.dataset.depth = s.d;
    el.style.cssText = `--x:${s.x}%;--y:${s.y}%;${s.mx != null ? `--mx:${s.mx}%;--my:${s.my}%;` : ''}--r:${s.r}deg;--delay:${(0.5 + i * 0.09).toFixed(2)}s;--w:${s.w === 'auto' ? 'auto' : s.w + 'px'}`;
    el.innerHTML = `<div class="st-par"><div class="st-body">${s.h}</div></div>`;
    stage.appendChild(el);
  });

  // Effet de profondeur : les stickers glissent avec la souris
  if (fine && !reduce) {
    stage.addEventListener('pointermove', e => {
      const b = stage.getBoundingClientRect();
      const nx = (e.clientX - b.left) / b.width - .5, ny = (e.clientY - b.top) / b.height - .5;
      $$('.st', stage).forEach(st => {
        const d = +st.dataset.depth;
        st.firstElementChild.style.transform = `translate(${-nx * d}px, ${-ny * d}px)`;
      });
      const p = $('.portrait', stage);
      if (p) p.style.transform = `translate(${nx * 10}px, ${ny * 10}px)`;
    });
    stage.addEventListener('pointerleave', () => $$('.st-par', stage).forEach(p => (p.style.transform = '')));
  }
}

/* ---------- Défilement fluide ---------- */
let lenis = null;
function initSmooth() {
  if (reduce || !window.Lenis) return;
  lenis = new window.Lenis({ lerp: 0.1 });
  const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}
function scrollToHash(hash) {
  let el;
  try { el = document.querySelector(hash); } catch { return; }
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: 0 });
  else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
}

/* ---------- Ouverture & transitions entre pages ---------- */
let markReady;
const ready = new Promise(r => (markReady = r));
function setReady() {
  document.body.classList.add('is-ready');
  $('.hero')?.classList.add('is-in');
  markReady();
}

function initIntro() {
  const loader = $('#loader'), curtain = $('#curtain');
  if (store.get('lj-nav')) {
    // On arrive d'une autre page du site : le rideau rose se lève
    store.del('lj-nav');
    loader?.remove();
    if (!reduce && curtain) {
      curtain.classList.add('out');
      curtain.addEventListener('animationend', () => curtain.classList.remove('out'), { once: true });
    }
    setTimeout(setReady, reduce ? 0 : 280);
    return;
  }
  if (reduce || document.hidden || store.get('lj-seen') || !loader) {
    loader?.remove();
    setReady();
    return;
  }
  // Première visite : compteur 0 → 100 puis l'écran remonte
  store.set('lj-seen', '1');
  const count = $('#count', loader);
  const t0 = performance.now(), dur = 1800;
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    count.textContent = 100;
    loader.classList.add('done');
    setTimeout(setReady, 380);
    setTimeout(() => loader.remove(), 1300);
  };
  // Filet de sécurité : si l'onglet est en arrière-plan, l'animation ne tourne pas
  setTimeout(finish, dur + 1200);
  const tick = t => {
    if (finished) return;
    const p = Math.min(1, (t - t0) / dur);
    count.textContent = Math.round((1 - Math.pow(1 - p, 3)) * 100);
    if (p < 1) return requestAnimationFrame(tick);
    finish();
  };
  requestAnimationFrame(tick);
}

const samePage = url => url.pathname.replace(/index\.html$/, '') === location.pathname.replace(/index\.html$/, '') && url.search === location.search;

function initTransitions() {
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
    if (samePage(url)) {
      if (url.hash) { e.preventDefault(); closeMenu(); scrollToHash(url.hash); }
      return;
    }
    if (reduce) return;
    e.preventDefault();
    closeMenu();
    store.set('lj-nav', '1');
    $('#curtain')?.classList.add('in');
    setTimeout(() => (location.href = url.href), 620);
  });
  window.addEventListener('pageshow', e => {
    if (e.persisted) { $('#curtain')?.classList.remove('in', 'out'); store.del('lj-nav'); }
  });
}

/* ---------- En-tête & menu mobile ---------- */
function initHeader() {
  const h = $('.site-header');
  let last = scrollY;
  const onScroll = () => {
    const y = scrollY;
    h.classList.toggle('is-scrolled', y > 40);
    if (!document.body.classList.contains('menu-open')) h.classList.toggle('is-hidden', y > 320 && y > last);
    last = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const here = location.pathname.split('/').pop() || 'index.html';
  $$('.nav a, .menu .big').forEach(a => { if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page'); });
}

function closeMenu() {
  if (!document.body.classList.contains('menu-open')) return;
  document.body.classList.remove('menu-open');
  $('.burger')?.setAttribute('aria-expanded', 'false');
  const m = $('#menu');
  m?.setAttribute('aria-hidden', 'true');
  if (m) m.inert = true;
  lenis?.start();
}
function initMenu() {
  const b = $('.burger'), m = $('#menu');
  if (!b || !m) return;
  m.inert = true;
  b.addEventListener('click', () => {
    if (document.body.classList.contains('menu-open')) return closeMenu();
    document.body.classList.add('menu-open');
    b.setAttribute('aria-expanded', 'true');
    m.setAttribute('aria-hidden', 'false');
    m.inert = false;
    lenis?.stop();
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
}

/* ---------- Curseur personnalisé ---------- */
function initCursor() {
  if (!fine || reduce) return;
  const c = $('.cursor');
  if (!c) return;
  document.body.classList.add('has-cursor');
  const dot = $('.cursor-dot', c), ring = $('.cursor-ring', c), label = $('span', ring);
  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
  addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; c.classList.remove('is-out'); }, { passive: true });
  document.addEventListener('pointerleave', () => c.classList.add('is-out'));
  document.addEventListener('pointerover', e => {
    const lab = e.target.closest('[data-cursor]');
    const link = e.target.closest('a, button, .chip');
    c.classList.toggle('is-label', !!lab);
    c.classList.toggle('is-link', !lab && !!link);
    if (lab) label.textContent = lab.dataset.cursor;
  });
  const loop = () => {
    rx += (x - rx) * .18; ry += (y - ry) * .18;
    dot.style.transform = `translate(${x}px, ${y}px)`;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  };
  loop();
}

/* ---------- Apparitions au défilement ---------- */
function wrapWords(root, cls) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  let i = 0;
  nodes.forEach(n => {
    const frag = document.createDocumentFragment();
    n.textContent.split(/(\s+)/).forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) return frag.append(' ');
      const s = document.createElement('span');
      s.className = cls;
      s.style.setProperty('--i', i++);
      if (cls === 'wd') { const inner = document.createElement('span'); inner.textContent = part; s.append(inner); }
      else s.textContent = part;
      frag.append(s);
    });
    n.replaceWith(frag);
  });
  return i;
}
function initSplit() {
  $$('[data-split]:not(.is-split)').forEach(el => { wrapWords(el, 'wd'); el.classList.add('is-split'); });
}
let io;
function initReveals() {
  if (reduce || !('IntersectionObserver' in window)) {
    $$('.reveal, [data-split]').forEach(el => el.classList.add('is-in'));
    return;
  }
  io ??= new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal:not(.is-in), [data-split]:not(.is-in)').forEach(el => io.observe(el));
}

/* ---------- Infos communes (email, CV, LinkedIn…) ---------- */
function fillSite(site) {
  $$('[data-site]').forEach(el => { const v = site[el.dataset.site]; if (v) el.textContent = v; });
  $$('[data-mail]').forEach(a => { a.href = `mailto:${site.email}`; if (a.hasAttribute('data-mail-text')) a.textContent = site.email; });
  $$('[data-linkedin]').forEach(a => (a.href = site.linkedin));
  // Pas de CV renseigné : on masque les boutons plutôt que d'afficher un lien cassé
  $$('[data-cv]').forEach(a => { if (site.cv) a.href = site.cv; else a.style.display = 'none'; });
  $$('[data-year]').forEach(el => (el.textContent = new Date().getFullYear()));
}

const media = (src, alt, extra = '') => src
  ? `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async" ${extra}>`
  : '';

/* ========== Accueil ========== */
function renderHome(site, projets) {
  initStickers($('.hero'), HERO_STICKERS);

  // Manifeste : les mots s'allument au fil du défilement
  const man = $('#manifeste');
  if (man) {
    man.innerHTML = rich(site.manifeste);
    const n = wrapWords(man, 'w');
    const words = $$('.w', man);
    const update = () => {
      const r = man.getBoundingClientRect(), vh = innerHeight;
      const p = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .35)));
      const on = reduce ? n : Math.round(p * n);
      words.forEach((w, i) => w.classList.toggle('on', i < on));
    };
    addEventListener('scroll', update, { passive: true });
    update();
  }

  // Réalisations choisies
  const list = $('#featured');
  if (list) {
    const feat = (projets.filter(p => p.en_avant).length ? projets.filter(p => p.en_avant) : projets).slice(0, 4);
    list.innerHTML = feat.map((p, i) => `
      <li class="work-row reveal" style="--d:${i * 0.06}s">
        <a href="projet.html?p=${encodeURIComponent(p.slug)}" data-img="${esc(p.couverture)}" data-cursor="Voir">
          <span class="thumb">${media(p.couverture, p.titre)}</span>
          <span class="num">${pad2(i + 1)}</span>
          <span class="t">${esc(p.titre)}</span>
          <span class="cat">${CATS[p.categorie] || ''}</span>
          <span class="yr">${esc(p.annee)}</span>
        </a>
      </li>`).join('');
    const all = $('#count-all');
    if (all) all.textContent = `(${projets.length})`;

    // Image qui suit la souris au survol de la liste
    const fl = $('.float-img');
    if (fl && fine && !reduce) {
      let x = 0, y = 0, fx = 0, fy = 0, on = false;
      list.addEventListener('pointerover', e => {
        const a = e.target.closest('a[data-img]');
        if (!a) return;
        fl.style.backgroundImage = a.dataset.img ? `url("${a.dataset.img}")` : '';
        fl.classList.add('on'); on = true;
      });
      list.addEventListener('pointerleave', () => { fl.classList.remove('on'); on = false; });
      addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; }, { passive: true });
      const loop = () => {
        fx += (x - fx) * .12; fy += (y - fy) * .12;
        if (on) fl.style.transform = `translate(${fx + 28}px, ${fy - fl.offsetHeight / 2}px) rotate(${(x - fx) * .04}deg)`;
        requestAnimationFrame(loop);
      };
      loop();
    }
  }

  // Aperçu à propos
  const t = $('#teaser-text');
  if (t) t.innerHTML = rich(site.accroche_apropos);
  const sk = $('#teaser-skills');
  if (sk) sk.innerHTML = (site.competences || []).flatMap(g => g.items).slice(0, 9).map(s => `<span class="chip">${esc(s)}</span>`).join('');
}

/* ========== Réalisations ========== */
function renderWorks(site, projets) {
  const grid = $('#grid'), bar = $('#filters');
  const count = c => c === 'tout' ? projets.length : projets.filter(p => p.categorie === c).length;
  const total = $('#total');
  if (total) total.textContent = `(${projets.length})`;

  grid.innerHTML = projets.map(p => `
    <a class="card reveal" href="projet.html?p=${encodeURIComponent(p.slug)}" data-c="${esc(p.categorie)}" data-cursor="Voir">
      <div class="card-media">${media(p.couverture, p.titre)}</div>
      <div class="card-meta"><h2 class="card-title">${esc(p.titre)}</h2><span class="card-cat">${CATS[p.categorie] || ''} · ${esc(p.annee)}</span></div>
    </a>`).join('') + `<p class="empty" hidden>Aucun projet dans cette catégorie pour le moment.</p>`;

  bar.innerHTML = FILTERS.filter(([k]) => k === 'tout' || count(k)).map(([k, l]) =>
    `<button type="button" data-f="${k}" aria-pressed="false">${l}<sup>${count(k)}</sup></button>`).join('');

  const apply = (f, animate) => {
    $$('button', bar).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.f === f)));
    let i = 0;
    $$('.card', grid).forEach(c => {
      const show = f === 'tout' || c.dataset.c === f;
      c.classList.toggle('is-hidden', !show);
      c.classList.remove('pop');
      if (show && animate) { void c.offsetWidth; c.style.setProperty('--i', i++); c.classList.add('pop', 'is-in'); }
    });
    $('.empty', grid).hidden = $$('.card:not(.is-hidden)', grid).length > 0;
  };
  const start = new URLSearchParams(location.search).get('f');
  apply(FILTERS.some(([k]) => k === start) ? start : 'tout', false);
  bar.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    apply(b.dataset.f, !reduce);
    const u = new URL(location.href);
    b.dataset.f === 'tout' ? u.searchParams.delete('f') : u.searchParams.set('f', b.dataset.f);
    history.replaceState(null, '', u);
    lenis?.resize?.();
  });

  // Légère inclinaison 3D des cartes au survol
  if (fine && !reduce) {
    grid.addEventListener('pointermove', e => {
      const m = e.target.closest('.card-media');
      if (!m) return;
      const b = m.getBoundingClientRect();
      const nx = (e.clientX - b.left) / b.width - .5, ny = (e.clientY - b.top) / b.height - .5;
      m.style.transform = `rotateY(${nx * 8}deg) rotateX(${-ny * 8}deg)`;
    });
    grid.addEventListener('pointerout', e => {
      const m = e.target.closest('.card-media');
      if (m && !m.contains(e.relatedTarget)) m.style.transform = '';
    });
  }
}

/* ========== Page projet ========== */
function renderProject(site, projets) {
  const main = $('#main');
  const slug = new URLSearchParams(location.search).get('p');
  const idx = projets.findIndex(p => p.slug === slug);
  if (idx < 0) {
    main.innerHTML = `<section class="not-found"><p class="eyebrow">Oups</p><h1 class="page-title" data-split>Projet <em>introuvable</em></h1><a class="btn btn-sun" href="realisations.html">Voir toutes les réalisations →</a></section>`;
    return;
  }
  const p = projets[idx], next = projets[(idx + 1) % projets.length];
  document.title = `${p.titre} · Léa Javon`;
  const block = (title, text) => text ? `<div class="p-block reveal"><h2>${title}</h2>${paras(text)}</div>` : '';
  const metas = [['Client', p.client], ['Année', p.annee], ['Rôle', p.role], ['Catégorie', CATS[p.categorie]]].filter(([, v]) => v);

  main.innerHTML = `
    <section class="p-hero">
      <a class="p-back" href="realisations.html">← Toutes les réalisations</a><br>
      <span class="p-tag reveal">${CATS[p.categorie] || ''}</span>
      <h1 class="p-title" data-split>${esc(p.titre)}</h1>
      ${p.resume ? `<p class="p-intro reveal" style="--d:.15s">${rich(p.resume)}</p>` : ''}
      <dl class="p-meta reveal" style="--d:.25s">${metas.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    </section>
    ${p.couverture ? `<figure class="p-cover reveal">${media(p.couverture, p.titre, 'loading="eager"')}</figure>` : ''}
    <section class="p-body">
      ${block('Le <em>contexte</em>', p.contexte)}
      ${block('L\'<em>objectif</em>', p.objectif)}
      ${block('Ce que j\'ai <em>fait</em>', p.realisation)}
      ${block('Le <em>résultat</em>', p.resultat)}
      ${p.lien ? `<div class="p-link reveal"><a class="btn btn-sun" href="${esc(p.lien)}" target="_blank" rel="noopener">Voir le projet en ligne ↗</a></div>` : ''}
    </section>
    ${(p.galerie || []).length ? `<section class="p-gallery">${p.galerie.map(src => `<figure class="reveal">${media(src, p.titre)}</figure>`).join('')}</section>` : ''}
    ${next && next !== p ? `<a class="p-next" href="projet.html?p=${encodeURIComponent(next.slug)}" data-cursor="Suivant"><p class="eyebrow">Projet suivant</p><span class="display">${esc(next.titre)}</span></a>` : ''}`;

  // Parallaxe douce sur l'image principale
  const img = $('.p-cover img');
  if (img && !reduce) {
    const fig = img.parentElement;
    const upd = () => {
      const r = fig.getBoundingClientRect();
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      img.style.transform = `translateY(${-8 + p * -10}%)`;
    };
    addEventListener('scroll', upd, { passive: true });
    upd();
  }
}

/* ========== À propos ========== */
function renderAbout(site) {
  const bio = $('#bio');
  if (bio) bio.innerHTML = paras(site.bio);

  initStickers($('.ab-photo'), [
    { h: SVG.mug(C.rose, C.bg), x: -14, y: -6, mx: -12, my: -6, w: 96, r: -10, d: 18 },
    { h: pill('perfectionniste', C.sun, C.bg), x: 62, y: 86, mx: 40, my: 88, w: 'auto', r: -4, d: 12 },
  ]);
  $('.ab-photo')?.classList.add('is-in');

  const sk = $('#skills');
  if (sk) sk.innerHTML = (site.competences || []).map((g, i) => `
    <div class="reveal" style="--d:${i * 0.08}s"><h3>${esc(g.groupe)}</h3><div class="chips">${g.items.map(s => `<span class="chip">${esc(s)}</span>`).join('')}</div></div>`).join('');

  const row = x => `<li class="reveal"><span class="dates">${esc(x.dates)}</span><div><h3>${esc(x.poste || x.diplome)}</h3><p class="where">${esc(x.structure || x.ecole)}</p>${x.description ? `<p>${esc(x.description)}</p>` : ''}</div></li>`;
  const xp = $('#xp'); if (xp) xp.innerHTML = (site.experiences || []).map(row).join('');
  const fo = $('#formation'); if (fo) fo.innerHTML = (site.formation || []).map(row).join('');
  const chips = (id, list) => { const el = $(id); if (el) el.innerHTML = (list || []).map(s => `<span class="chip">${esc(s)}</span>`).join(''); };
  chips('#outils', site.outils);
  chips('#interets', site.interets);
  const certs = $('#certifications');
  if (certs) {
    certs.innerHTML = (site.certifications || []).map(c => `<li class="reveal"><span>${esc(c.annee)}</span>${esc(c.intitule)}</li>`).join('');
    certs.previousElementSibling.hidden = !certs.children.length;
  }
}

/* ---------- Démarrage ---------- */
initIntro();
initHeader();
initMenu();
initCursor();
initTransitions();
initSmooth();

const RENDER = { accueil: renderHome, realisations: renderWorks, projet: renderProject, apropos: renderAbout };
const data = Promise.all([getJSON('content/site.json'), getJSON('content/projets.json')])
  .then(([site, p]) => {
    fillSite(site);
    RENDER[document.body.dataset.page]?.(site, p.projets || []);
  })
  .catch(err => {
    console.error(err);
    $('#main')?.insertAdjacentHTML('beforeend', `<p class="load-error">Le contenu n'a pas pu être chargé. Rechargez la page.</p>`);
  })
  .finally(initSplit);

Promise.all([ready, data]).then(() => {
  initReveals();
  lenis?.resize?.();
  if (location.hash) setTimeout(() => scrollToHash(location.hash), 300);
});
