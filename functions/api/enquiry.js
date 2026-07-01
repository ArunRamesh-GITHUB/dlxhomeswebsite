// Cloudflare Pages Function — receives DLX ROI website form submissions and
// forwards them to the AI receptionist backend, which is the shared lead
// store/notifier for both DLX businesses. Runs server-side so the shared
// secret and DLX ROI's Twilio number never reach the browser.
//
// Requires these Pages environment variables (set in the Cloudflare dashboard,
// not in this repo):
//   AI_RECEPTIONIST_API_BASE  e.g. https://ai-receptionist.up.railway.app
//   WEBSITE_LEAD_SECRET       must match WEBSITE_LEAD_SECRET on the backend
//   DLX_ROI_TWILIO_NUMBER     e.g. +447863773125 (identifies the client row)

const ALLOWED_SOURCES = new Set(['website_contact_form', 'cooling_letter']);

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const source = typeof body.source === 'string' ? body.source : '';
  if (!ALLOWED_SOURCES.has(source)) {
    return Response.json({ error: 'Invalid or missing source' }, { status: 400 });
  }

  const upstream = await fetch(`${env.AI_RECEPTIONIST_API_BASE}/website-leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-website-secret': env.WEBSITE_LEAD_SECRET,
    },
    body: JSON.stringify({
      twilio_number: env.DLX_ROI_TWILIO_NUMBER,
      name: body.name,
      email: body.email,
      phone: body.phone,
      postcode: body.postcode,
      message: body.message,
      received_letter: body.received_letter,
      campaign_reference: body.campaign_reference,
      source,
    }),
  });

  if (!upstream.ok) {
    return Response.json({ error: 'Failed to submit enquiry' }, { status: 502 });
  }

  return Response.json({ status: 'ok' });
}
