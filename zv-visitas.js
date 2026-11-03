/* Visitas de la landing → Vista en tiempo real del panel.
   Uso (una línea antes de </body>):
     <script src="zv-visitas.js" data-landing="landing_articumina" data-product="Articumina"
             data-endpoint="https://roruinqorwgolcrhhmpm.supabase.co/functions/v1/track-visitor" defer></script>
   Eventos automáticos: page_view, heartbeat (cada 15 s con la pestaña visible), scroll_depth,
   click_cta (botones de compra), form_started, form_submitted y page_hide.
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
    const script = win.document.currentScript || win.document.querySelector('script[data-landing][src*="zv-visitas"]');
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

    const api = { track: function (event, extra) { send(String(event || ''), extra); }, config: cfg };
    win.zvVisitas = api;

    send('page_view');
    let beat = win.setInterval(function () { if (!win.document.hidden) send('heartbeat'); }, HEARTBEAT_MS);
    win.addEventListener('pagehide', function () { win.clearInterval(beat); beat = null; send('page_hide'); });
    win.document.addEventListener('visibilitychange', function () {
      if (!win.document.hidden && !beat) {
        beat = win.setInterval(function () { if (!win.document.hidden) send('heartbeat'); }, HEARTBEAT_MS);
        send('heartbeat');
      }
    });

    const marks = [50, 90];
    win.addEventListener('scroll', function () {
      const h = win.document.documentElement;
      const pct = ((h.scrollTop + win.innerHeight) / Math.max(1, h.scrollHeight)) * 100;
      marks.forEach(function (m) { if (pct >= m && !sent.has('depth_' + m)) { sent.add('depth_' + m); send('scroll_depth', { depth: m }); } });
    }, { passive: true });

    win.document.addEventListener('click', function (e) {
      const el = e.target && e.target.closest ? e.target.closest('a,button') : null;
      if (!el || el.type === 'submit') return;
      const label = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);
      if (CTA_TEXT.test(label)) once('click_cta', { label });
    }, true);
    win.document.addEventListener('focusin', function (e) {
      if (e.target && e.target.closest && e.target.closest('form')) once('form_started');
    });
    win.document.addEventListener('submit', function () { once('form_submitted'); }, true);
    return api;
  }

  return { start, buildPayload };
});
