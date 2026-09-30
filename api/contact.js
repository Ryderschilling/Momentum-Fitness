/* Momentum Fitness, contact form endpoint.
   Vercel Node serverless function. Zero dependencies: Resend is called over
   its REST API with plain fetch, so there is no package.json and no build.
   CommonJS on purpose (no "type":"module" without a package.json).

   ENV (Vercel > Project > Settings > Environment Variables):
     RESEND_API_KEY   required. Your Resend key.
     CONTACT_TO       optional. Where messages go. Default info@momentum.fit
     CONTACT_FROM     optional. Must be on a domain verified in Resend.
                      Default "Momentum Fitness Website <leads@ryderschilling.com>".
                      Switch to an @momentum.fit address once that domain is verified.

   Nothing is stored and the message body is never logged.
   Reply-to is the sender, so the gym can just hit reply. */

const ENDPOINT = "https://api.resend.com/emails";
const MAX = 4000;
const TOPICS = ["Free trial", "Drop-in", "Membership", "Private coaching", "Something else"];

const clean = (v) => String(v == null ? "" : v).slice(0, MAX).replace(/\r\n?/g, "\n").trim();
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const oneLine = (s) => clean(s).replace(/[\r\n]+/g, " ").slice(0, 200);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }
  const KEY = process.env.RESEND_API_KEY;
  const TO = process.env.CONTACT_TO || "info@momentum.fit";
  const FROM = process.env.CONTACT_FROM || "Momentum Fitness Website <leads@ryderschilling.com>";
  if (!KEY) {
    console.error("contact: RESEND_API_KEY missing");
    return res.status(500).json({ ok: false, error: "not_configured" });
  }

  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch (e) { return res.status(400).json({ ok: false, error: "bad_json" }); } }
  if (!b || typeof b !== "object") return res.status(400).json({ ok: false, error: "bad_body" });

  // honeypot: people never fill a field they cannot see
  if (clean(b.company)) return res.status(200).json({ ok: true });

  const name = oneLine(b.name);
  const email = oneLine(b.email);
  const phone = oneLine(b.phone);
  const message = clean(b.message);
  const topic = TOPICS.includes(b.topic) ? b.topic : "Something else";
  const page = oneLine(b.page);
  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  if (!name || !message || (!emailOk && phone.replace(/\D/g, "").length < 10)) {
    return res.status(400).json({ ok: false, error: "missing_fields" });
  }

  const rows = [["Name", name], ["Email", email], ["Phone", phone], ["About", topic], ["Message", message], ["Sent from", page ? "30acrossfit.com" + page : ""]].filter((r) => r[1]);
  const text = rows.map((r) => r[0] + ": " + r[1]).join("\n\n");
  const html =
    '<div style="font:15px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#15161B;max-width:560px">' +
    '<div style="height:5px;background:linear-gradient(90deg,#F7941D,#F03C57,#B23BA6,#4551B5);border-radius:3px"></div>' +
    '<p style="font:700 12px/1 sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#D62440;margin:20px 0 6px">New website message &middot; ' + esc(topic) + "</p>" +
    rows.map((r) => '<p style="margin:0 0 14px"><strong>' + esc(r[0]) + "</strong><br>" + esc(r[1]).replace(/\n/g, "<br>") + "</p>").join("") +
    (phone ? '<p><a href="sms:' + esc(phone.replace(/[^\d+]/g, "")) + '" style="display:inline-block;background:#D62440;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:700">Text ' + esc(name.split(" ")[0]) + " back</a></p>" : "") +
    '<p style="color:#6B6D75;font-size:13px">Hit reply to answer ' + (emailOk ? esc(email) : "them") + ".</p></div>";

  const payload = { from: FROM, to: [TO], subject: topic + " from " + name + " (website)", text, html };
  if (emailOk) payload.reply_to = email;

  try {
    const r = await fetch(ENDPOINT, {
      method: "POST",
      headers: { Authorization: "Bearer " + KEY, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      console.error("contact: resend responded " + r.status);
      return res.status(502).json({ ok: false, error: "send_failed" });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("contact: network error reaching resend");
    return res.status(502).json({ ok: false, error: "send_failed" });
  }
};
