/* Visitas de la landing → Vista en tiempo real del panel.  (v4)
   Uso (una línea antes de </body>):
     <script src="zv-visitas.js?v=4" data-landing="landing_articumina" data-product="Articumina"
             data-endpoint="https://roruinqorwgolcrhhmpm.supabase.co/functions/v1/track-visitor" defer></script>
   Eventos automáticos: page_view, heartbeat (cada 15 s con la pestaña visible), scroll_depth (25/50/75/90/100),
   section_view (una vez por sección que la persona ve), click_cta (botones de compra), form_started,
   form_submitted y page_hide (con hasta dónde bajó, segundos en la página y la sección donde estaba).
   Secciones: los bloques principales de la página (hijos de <main> o <body>), con el nombre de su título o
   del texto alternativo de su imagen. Si la landing marca elementos con data-zv-section="Nombre", se usan esos.
   La landing avisa el resto con window.zvVisitas.track('begin_checkout') y
   window.zvVisitas.track('purchase', { orderId, revenue }).
   Se envía como text/plain para que el navegador no haga preflight CORS. Nunca rompe la página. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else if (root && root.document) api.start(root);
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const HEARTBEAT_MS = 15000;
  const CTA_TEXT = /compr|pedi|pedir|quiero|ordenar|reservar|confirmar/i;
  const DEPTH_MARKS = [25, 50, 75, 90, 100];
  // Una sección cuenta como "vista" si queda al menos 1 s cruzando la mitad de la pantalla.
  const SECTION_DWELL_MS = 1000;

  function randomId(prefix) {
    return prefix + Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
  }

  function stored(storage, key, prefix) {
    try {
      let value = storage.getItem(key);
      if (!value) { value = randomId(prefix); storage.setItem(key, value); }
      return value;
    } catch (_e) {
      return randomId(prefix);
    }
  }

  function cleanText(text, max) {
    return String(text || '').replace(/\s+/g, ' ').trim().slice(0, max || 60);
  }

  // Nombre legible de una sección: data-zv-section > primer título > id.
  function sectionName(el, index) {
    if (!el) return '';
    const own = el.getAttribute && el.getAttribute('data-zv-section');
    if (own) return cleanText(own, 60);
    const h = el.querySelector && el.querySelector('h1,h2,h3');
    const heading = h ? cleanText(h.textContent, 60) : '';
    if (heading) return heading;
    const id = el.id ? el.id.replace(/[-_]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2') : '';
    return cleanText(id, 60) || 'Sección ' + (index + 1);
  }

  function scrollDepth(win) {
    const h = win.document.documentElement;
    const total = Math.max(1, h.scrollHeight);
    return Math.min(100, Math.round(((h.scrollTop || win.pageYOffset || 0) + win.innerHeight) / total * 100));
  }

  function buildPayload(win, cfg, event, extra) {
    const params = new URLSearchParams(win.location.search || '');
    const scr = win.screen || {};
    return Object.assign({
      event,
      sessionId: cfg.sessionId,
      visitorId: cfg.visitorId,
      landingPage: cfg.landing,
      productName: cfg.product || undefined,
      pageUrl: win.location.href,
      pageTitle: win.document.title,
      referrer: win.document.referrer || '',
      userAgent: win.navigator.userAgent,
      language: win.navigator.language || '',
      screenResolution: scr.width && scr.height ? scr.width + 'x' + scr.height : '',
      viewport: win.innerWidth && win.innerHeight ? win.innerWidth + 'x' + win.innerHeight : '',
      utmSource: params.get('utm_source') || '',
      utmMedium: params.get('utm_medium') || '',
      utmCampaign: params.get('utm_campaign') || '',
      utmContent: params.get('utm_content') || '',
      utmTerm: params.get('utm_term') || '',
      fbclid: params.get('fbclid') || '',
      gclid: params.get('gclid') || ''
    }, extra || {});
  }

  function start(win) {
    if (win.zvVisitas) return win.zvVisitas;
    const doc = win.document;
    const script = doc.currentScript || doc.querySelector('script[data-landing][src*="zv-visitas"]');
    const data = (script && script.dataset) || {};
    const cfg = {
      landing: data.landing || '',
      product: data.product || '',
      endpoint: data.endpoint || '',
      // Todas las landings comparten zenvit.github.io: la sesión va por landing, el visitante es uno solo.
      sessionId: stored(win.sessionStorage, 'zv_session_id:' + (data.landing || ''), 'ses_'),
      visitorId: stored(win.localStorage, 'zv_visitor_id', 'vis_')
    };
    const sent = new Set();
    const state = { seen: [], maxDepth: 0, section: '', sectionIndex: -1, visibleMs: 0, visibleSince: doc.hidden ? 0 : Date.now() };

    function seconds() {
      const extra = state.visibleSince ? Date.now() - state.visibleSince : 0;
      return Math.round((state.visibleMs + extra) / 1000);
    }

    function send(event, extra) {
      if (!cfg.endpoint || !cfg.landing) return;
      try {
        const body = JSON.stringify(buildPayload(win, cfg, event, extra));
        const nav = win.navigator;
        if (event === 'page_hide' && nav.sendBeacon) {
          nav.sendBeacon(cfg.endpoint, new Blob([body], { type: 'text/plain' }));
          return;
        }
        win.fetch(cfg.endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body, keepalive: true }).catch(function () {});
      } catch (_e) { /* el seguimiento nunca rompe la landing */ }
    }
    function once(event, extra) {
      if (sent.has(event)) return;
      sent.add(event);
      send(event, extra);
    }
    // Salida: hasta dónde bajó, cuánto tiempo estuvo con la página a la vista y en qué sección estaba.
    let lastExit = 0;
    function exit() {
      if (Date.now() - lastExit < 2000) return;
      lastExit = Date.now();
      send('page_hide', { depth: state.maxDepth || undefined, seconds: seconds(), section: state.section || undefined, sectionIndex: state.sectionIndex >= 0 ? state.sectionIndex : undefined });
    }

    const api = { track: function (event, extra) { send(String(event || ''), extra); }, config: cfg, state: state };
    win.zvVisitas = api;

    send('page_view');
    let beat = win.setInterval(function () { if (!doc.hidden) send('heartbeat'); }, HEARTBEAT_MS);
    win.addEventListener('pagehide', function () { win.clearInterval(beat); beat = null; exit(); });
    doc.addEventListener('visibilitychange', function () {
      if (doc.hidden) {
        if (state.visibleSince) { state.visibleMs += Date.now() - state.visibleSince; state.visibleSince = 0; }
        // En celulares "pagehide" muchas veces no llega: al ocultar la pestaña ya se manda la salida.
        exit();
      } else {
        state.visibleSince = Date.now();
        if (!beat) {
          beat = win.setInterval(function () { if (!doc.hidden) send('heartbeat'); }, HEARTBEAT_MS);
          send('heartbeat');
        }
      }
    });

    // Secciones de la página, en orden: los bloques principales (hijos de <main> o <body>: <section>, banners…).
    // El nombre sale del título del bloque, si no del texto alternativo de su imagen. Si la landing marca
    // elementos con data-zv-section="Nombre", se usan esos.
    let sections = [];
    function shown(el) {
      if (!el || !el.getClientRects().length) return false;
      const st = win.getComputedStyle ? win.getComputedStyle(el) : null;
      return !st || (st.visibility !== 'hidden' && st.display !== 'none' && st.position !== 'fixed' && st.position !== 'sticky');
    }
    function blockName(el, i) {
      if (el.hasAttribute('data-zv-section')) return sectionName(el, i);
      const h = Array.prototype.slice.call(el.querySelectorAll('h1,h2,h3')).filter(function (x) { return x.getClientRects().length; })[0];
      const img = el.querySelector('img[alt]');
      const text = (h && h.textContent) || (img && img.getAttribute('alt')) || el.getAttribute('aria-label') || '';
      let name = cleanText(text, 70);
      if (name.length > 48) name = name.slice(0, 48).replace(/\s+\S*$/, '') + '…';
      return name || sectionName(el, i);
    }
    function collectSections() {
      const marked = doc.querySelectorAll('[data-zv-section]');
      let list;
      if (marked.length) list = Array.prototype.slice.call(marked).filter(shown);
      else {
        const skip = /^(HEADER|FOOTER|NAV|SCRIPT|STYLE|DIALOG|NOSCRIPT|TEMPLATE)$/;
        let parent = doc.querySelector('main') || doc.body;
        let kids = Array.prototype.slice.call(parent.children);
        // Si todo está dentro de un solo contenedor, se baja un nivel.
        const big = kids.filter(function (k) { return shown(k) && k.getBoundingClientRect().height > win.innerHeight * 2; });
        if (big.length === 1 && kids.filter(shown).length <= 3) kids = Array.prototype.slice.call(big[0].children);
        list = kids.filter(function (k) {
          return !skip.test(k.tagName) && !k.closest('dialog,[role="dialog"],[aria-modal="true"]') && shown(k) && k.getBoundingClientRect().height >= 120;
        });
      }
      list.sort(function (a, b) { return a.getBoundingClientRect().top - b.getBoundingClientRect().top; });
      sections = list.map(function (el, i) { return { el: el, index: i, name: blockName(el, i) }; });
    }
    let pending = null;
    function currentSection() {
      if (!sections.length) return null;
      const mid = win.innerHeight / 2;
      let found = null;
      for (let i = 0; i < sections.length; i++) {
        const r = sections[i].el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) return sections[i];
        if (r.top <= mid) found = sections[i];
      }
      return found || sections[0];
    }
    function onScroll() {
      const depth = scrollDepth(win);
      if (depth > state.maxDepth) state.maxDepth = depth;
      DEPTH_MARKS.forEach(function (m) { if (depth >= m && !sent.has('depth_' + m)) { sent.add('depth_' + m); send('scroll_depth', { depth: m }); } });
      const s = currentSection();
      if (!s) return;
      state.section = s.name; state.sectionIndex = s.index;
      const key = 'section_' + s.index;
      if (sent.has(key) || (pending && pending.index === s.index)) return;
      if (pending) win.clearTimeout(pending.timer);
      pending = { index: s.index, timer: win.setTimeout(function () {
        pending = null;
        const now = currentSection();
        if (now && now.index === s.index && !sent.has(key)) { sent.add(key); state.seen.push(s.index); send('section_view', { section: s.name, sectionIndex: s.index }); }
      }, SECTION_DWELL_MS) };
    }
    let ticking = false;
    win.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      win.setTimeout(function () { ticking = false; onScroll(); }, 250);
    }, { passive: true });
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', function () { collectSections(); onScroll(); });
    else { collectSections(); onScroll(); }
    // Las landings arman parte del contenido con JS: se vuelve a leer al terminar de cargar.
    win.addEventListener('load', function () { collectSections(); onScroll(); });

    doc.addEventListener('click', function (e) {
      const el = e.target && e.target.closest ? e.target.closest('a,button') : null;
      if (!el || el.type === 'submit') return;
      const label = cleanText(el.textContent, 80);
      if (CTA_TEXT.test(label)) once('click_cta', { label: label, section: state.section || undefined });
    }, true);
    doc.addEventListener('focusin', function (e) {
      if (e.target && e.target.closest && e.target.closest('form')) once('form_started');
    });
    doc.addEventListener('submit', function () { once('form_submitted'); }, true);
    return api;
  }

  return { start, buildPayload, sectionName, scrollDepth };
});
