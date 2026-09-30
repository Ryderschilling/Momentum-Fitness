/* ============================================================
   TRACKING: Google Tag Manager (loads GA4 and anything else inside it)
   Paste the container ID below, e.g. 'GTM-ABC1234'. One line, that's it.
   While it's empty nothing loads and nothing breaks.

   Every button on the site already pushes events into dataLayer, so once the
   container is live you only need GA4 tags that listen for these names:
     checkout_open   { plan, price }       a Join / Drop-in / Trial button opened PushPress
     trial_click     { location }          any free trial button
     generate_lead   { topic }             contact form sent successfully
     phone_click     { method: call|text } a tel: or sms: link
     email_click                           a mailto: link
   ============================================================ */
window.MF_GTM_ID = '';

window.dataLayer = window.dataLayer || [];
window.mfTrack = function (event, params) {
  try { window.dataLayer.push(Object.assign({ event: event }, params || {})); } catch (e) {}
};

(function (id) {
  if (!id) return;
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(id);
  document.head.appendChild(s);
})(window.MF_GTM_ID);
