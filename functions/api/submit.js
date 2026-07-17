// Прийом заявок з форми сайту → заявка в Telegram-групу
import { SERVICES, normalizePhone, sendLead } from '../_lib/common.js';

const RATE_LIMIT = 5;      // заявок з однієї IP
const RATE_WINDOW = 600;   // за 10 хвилин

export async function onRequestPost({ request, env }) {
    let body;
    try { body = await request.json(); } catch {
        return Response.json({ ok: false, error: 'bad_json' }, { status: 400 });
    }

    // Honeypot: боти заповнюють приховане поле — вдаємо успіх
    if (body.website) return Response.json({ ok: true });

    const name = String(body.name || '').trim().slice(0, 100);
    const phone = normalizePhone(body.phone);
    const email = String(body.email || '').trim().slice(0, 100);
    const comment = String(body.comment || '').trim().slice(0, 500);
    const day = String(body.date || '').trim().slice(0, 50);
    const service = SERVICES[body.service] || '';

    if (name.length < 2 || !phone || body.consent !== true) {
        return Response.json({ ok: false, error: 'validation' }, { status: 400 });
    }

    // Простий rate-limit по IP через KV
    if (env.KV) {
        const ip = request.headers.get('cf-connecting-ip') || 'unknown';
        const key = `rate:${ip}`;
        const count = Number(await env.KV.get(key)) || 0;
        if (count >= RATE_LIMIT) {
            return Response.json({ ok: false, error: 'rate_limited' }, { status: 429 });
        }
        await env.KV.put(key, String(count + 1), { expirationTtl: RATE_WINDOW });
    }

    const res = await sendLead(env, { source: 'site', name, phone, service, day, comment, email }, 0);
    if (!res.ok) {
        console.error('sendLead failed:', JSON.stringify(res));
        return Response.json({ ok: false, error: 'telegram' }, { status: 502 });
    }
    return Response.json({ ok: true });
}
