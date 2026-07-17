// Webhook Telegram-бота: меню, діалог запису, міст «питання лікарю», кнопка «Опрацьовано»
import {
    SERVICES, CLINIC, isOpenNow, normalizePhone, escapeHtml, tg, sendLead,
} from '../_lib/common.js';

const SESS_TTL = 3600;        // сесія діалогу — 1 година
const BRIDGE_TTL = 7 * 86400; // мапа «повідомлення в групі → пацієнт» — 7 днів

const T = {
    welcome: 'Вітаємо у Сімейній клініці Св. Пантелеймона! 👋\nМедицина, яка дбає про Вас.\n\nОберіть, що вас цікавить:',
    menu: 'Оберіть, що вас цікавить:',
    askService: 'Оберіть послугу:',
    askName: 'Як до вас звертатися? Напишіть імʼя та прізвище.',
    askPhone: 'Надішліть номер телефону — найзручніше кнопкою нижче 👇',
    badPhone: 'Не схоже на український номер. Напишіть у форматі +380 XX XXX XX XX або натисніть кнопку нижче.',
    askDay: 'На який день бажаєте записатися?',
    askDayOther: 'Напишіть бажаний день і час (наприклад, «понеділок після 16:00» або «15 липня зранку»).',
    askComment: 'Додати коментар? (симптоми, побажання) Або натисніть «Пропустити».',
    confirmed: 'Дякуємо! 🎉 Вашу заявку передано. Ми зателефонуємо для підтвердження запису.',
    confirmedClosed: 'Дякуємо! 🎉 Вашу заявку передано. Зараз клініка зачинена — ми зателефонуємо в робочий час.',
    cancelled: 'Запис скасовано. Повертаємось у меню 👇',
    askQuestion: 'Напишіть ваше питання одним повідомленням — ми передамо його лікарю і відповімо тут.',
    questionSent: 'Питання передано! Відповімо вам у цьому чаті. 🙌',
    doneNotify: 'Ваша заявка опрацьована — очікуйте дзвінка від клініки найближчим часом. 📞',
    fallback: 'Я вас не зрозумів. Скористайтеся меню 👇',
};

const mainMenu = {
    inline_keyboard: [
        [{ text: '📅 Записатися на прийом', callback_data: 'm:book' }],
        [{ text: '📝 Підписати декларацію', callback_data: 'svc:declaration' }],
        [{ text: '🕐 Графік роботи', callback_data: 'm:hours' }, { text: '📍 Як нас знайти', callback_data: 'm:addr' }],
        [{ text: '🩺 Послуги', callback_data: 'm:services' }, { text: '💙 Безкоштовне', callback_data: 'm:free' }],
        [{ text: '💬 Питання лікарю', callback_data: 'm:ask' }, { text: '⭐ Відгуки', callback_data: 'm:reviews' }],
    ],
};

const servicesMenu = {
    inline_keyboard: [
        ...Object.entries(SERVICES).map(([key, label]) => [{ text: label, callback_data: `svc:${key}` }]),
        [{ text: '✖️ Скасувати', callback_data: 'cancel' }],
    ],
};

const cancelRow = [{ text: '✖️ Скасувати', callback_data: 'cancel' }];

async function getSess(env, chatId) {
    const raw = await env.KV.get(`sess:${chatId}`);
    return raw ? JSON.parse(raw) : null;
}
async function setSess(env, chatId, sess) {
    await env.KV.put(`sess:${chatId}`, JSON.stringify(sess), { expirationTtl: SESS_TTL });
}
async function clearSess(env, chatId) {
    await env.KV.delete(`sess:${chatId}`);
}

function summary(d) {
    return [
        '<b>Перевірте заявку:</b>',
        `🩺 ${escapeHtml(d.service)}`,
        `👤 ${escapeHtml(d.name)}`,
        `📞 ${escapeHtml(d.phone)}`,
        `📅 ${escapeHtml(d.day)}`,
        d.comment ? `💬 ${escapeHtml(d.comment)}` : null,
    ].filter(Boolean).join('\n');
}

async function showMenu(env, chatId, text) {
    await tg(env, 'sendMessage', { chat_id: chatId, text, reply_markup: mainMenu });
}

async function startBooking(env, chatId, serviceKey) {
    const sess = { state: 'name', data: { service: SERVICES[serviceKey] } };
    await setSess(env, chatId, sess);
    await tg(env, 'sendMessage', {
        chat_id: chatId,
        text: `Записуємо: <b>${escapeHtml(SERVICES[serviceKey])}</b>\n\n${T.askName}`,
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: [cancelRow] },
    });
}

async function askPhone(env, chatId) {
    await tg(env, 'sendMessage', {
        chat_id: chatId,
        text: T.askPhone,
        reply_markup: {
            keyboard: [[{ text: '📱 Поділитися номером', request_contact: true }]],
            resize_keyboard: true,
            one_time_keyboard: true,
        },
    });
}

async function askDay(env, chatId) {
    await tg(env, 'sendMessage', {
        chat_id: chatId,
        text: T.askDay,
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Сьогодні', callback_data: 'day:Сьогодні' }, { text: 'Завтра', callback_data: 'day:Завтра' }],
                [{ text: 'Інший день', callback_data: 'day:other' }],
                cancelRow,
            ],
        },
    });
}

async function askComment(env, chatId) {
    await tg(env, 'sendMessage', {
        chat_id: chatId,
        text: T.askComment,
        reply_markup: { inline_keyboard: [[{ text: '⏭ Пропустити', callback_data: 'skip' }], cancelRow] },
    });
}

async function askConfirm(env, chatId, data) {
    await tg(env, 'sendMessage', {
        chat_id: chatId,
        text: summary(data),
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [{ text: '✅ Підтвердити', callback_data: 'confirm' }, { text: '✖️ Скасувати', callback_data: 'cancel' }],
            ],
        },
    });
}

async function finishBooking(env, chatId, data, user) {
    await sendLead(env, {
        source: 'bot',
        name: data.name,
        phone: data.phone,
        service: data.service,
        day: data.day,
        comment: data.comment,
    }, chatId);
    await clearSess(env, chatId);
    await tg(env, 'sendMessage', {
        chat_id: chatId,
        text: isOpenNow() ? T.confirmed : T.confirmedClosed,
        reply_markup: { remove_keyboard: true },
    });
    await showMenu(env, chatId, T.menu);
}

// Вільний текст поза діалогом → у групу (міст)
async function forwardQuestion(env, msg) {
    const from = msg.from || {};
    const who = [from.first_name, from.last_name].filter(Boolean).join(' ') || 'Пацієнт';
    const uname = from.username ? ` (@${from.username})` : '';
    const res = await tg(env, 'sendMessage', {
        chat_id: env.TG_CHAT_ID,
        text: `💬 <b>Питання від ${escapeHtml(who)}${escapeHtml(uname)}</b>\n\n${escapeHtml(msg.text)}\n\n<i>Відповісти — реплаєм на це повідомлення</i>`,
        parse_mode: 'HTML',
    });
    if (res.ok) {
        await env.KV.put(`bridge:${res.result.message_id}`, String(msg.chat.id), { expirationTtl: BRIDGE_TTL });
    }
    await tg(env, 'sendMessage', { chat_id: msg.chat.id, text: T.questionSent });
}

// Реплай у групі → пацієнту
async function relayReply(env, msg) {
    const repliedId = msg.reply_to_message?.message_id;
    if (!repliedId) return;
    const uid = await env.KV.get(`bridge:${repliedId}`);
    if (!uid) return;
    await tg(env, 'sendMessage', {
        chat_id: Number(uid),
        text: `💬 <b>Відповідь клініки:</b>\n\n${escapeHtml(msg.text || '')}`,
        parse_mode: 'HTML',
    });
    await tg(env, 'setMessageReaction', {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
        reaction: [{ type: 'emoji', emoji: '👍' }],
    });
}

async function handleCallback(env, cb) {
    const chatId = cb.message.chat.id;
    const data = cb.data || '';
    await tg(env, 'answerCallbackQuery', { callback_query_id: cb.id });

    // «Опрацьовано» в групі
    if (data.startsWith('done:')) {
        const uid = Number(data.slice(5));
        const by = cb.from.first_name || 'адмін';
        await tg(env, 'editMessageReplyMarkup', {
            chat_id: chatId,
            message_id: cb.message.message_id,
            reply_markup: { inline_keyboard: [[{ text: `✅ Опрацьовано • ${by}`, callback_data: 'noop' }]] },
        });
        if (uid) await tg(env, 'sendMessage', { chat_id: uid, text: T.doneNotify });
        return;
    }
    if (data === 'noop') return;

    if (data === 'm:book') {
        await tg(env, 'sendMessage', { chat_id: chatId, text: T.askService, reply_markup: servicesMenu });
        return;
    }
    if (data.startsWith('svc:')) {
        await startBooking(env, chatId, data.slice(4));
        return;
    }
    if (data === 'cancel') {
        await clearSess(env, chatId);
        await tg(env, 'sendMessage', { chat_id: chatId, text: T.cancelled, reply_markup: { remove_keyboard: true } });
        await showMenu(env, chatId, T.menu);
        return;
    }
    if (data === 'm:hours') {
        const status = isOpenNow() ? '🟢 Зараз відчинено' : '🔴 Зараз зачинено';
        await tg(env, 'sendMessage', { chat_id: chatId, text: `${status}\n\n${CLINIC.scheduleText}` });
        return;
    }
    if (data === 'm:addr') {
        await tg(env, 'sendMessage', {
            chat_id: chatId,
            text: `📍 ${CLINIC.address}\n☎️ ${CLINIC.phoneHuman}\n\n${CLINIC.mapsUrl}`,
        });
        await tg(env, 'sendLocation', { chat_id: chatId, latitude: CLINIC.lat, longitude: CLINIC.lng });
        return;
    }
    if (data === 'm:services') {
        const list = Object.values(SERVICES).map((s) => `• ${s}`).join('\n');
        await tg(env, 'sendMessage', { chat_id: chatId, text: `🩺 Наші послуги:\n\n${list}\n\nЩоб записатися — натисніть «📅 Записатися» в меню.` });
        return;
    }
    if (data === 'm:free') {
        await tg(env, 'sendMessage', { chat_id: chatId, text: `💙 ${CLINIC.freeText}\n\nДекларацію можна підписати прямо в клініці — це займе 10 хвилин.` });
        return;
    }
    if (data === 'm:reviews') {
        await tg(env, 'sendMessage', { chat_id: chatId, text: `⭐ Наш рейтинг у Google — 4,9\n\nПочитати або залишити відгук:\n${CLINIC.mapsUrl}` });
        return;
    }
    if (data === 'm:ask') {
        await tg(env, 'sendMessage', { chat_id: chatId, text: T.askQuestion });
        return;
    }

    // Кроки діалогу запису
    const sess = await getSess(env, chatId);
    if (data.startsWith('day:')) {
        if (!sess || sess.state !== 'day') return;
        const val = data.slice(4);
        if (val === 'other') {
            sess.state = 'day_other';
            await setSess(env, chatId, sess);
            await tg(env, 'sendMessage', { chat_id: chatId, text: T.askDayOther, reply_markup: { inline_keyboard: [cancelRow] } });
        } else {
            sess.data.day = val;
            sess.state = 'comment';
            await setSess(env, chatId, sess);
            await askComment(env, chatId);
        }
        return;
    }
    if (data === 'skip') {
        if (!sess || sess.state !== 'comment') return;
        sess.state = 'confirm';
        await setSess(env, chatId, sess);
        await askConfirm(env, chatId, sess.data);
        return;
    }
    if (data === 'confirm') {
        if (!sess || sess.state !== 'confirm') return;
        await finishBooking(env, chatId, sess.data, cb.from);
        return;
    }
}

async function handlePrivateMessage(env, msg) {
    const chatId = msg.chat.id;
    const text = (msg.text || '').trim();

    if (text === '/start') {
        await clearSess(env, chatId);
        await showMenu(env, chatId, T.welcome);
        return;
    }
    if (text === '/cancel') {
        await clearSess(env, chatId);
        await tg(env, 'sendMessage', { chat_id: chatId, text: T.cancelled, reply_markup: { remove_keyboard: true } });
        await showMenu(env, chatId, T.menu);
        return;
    }

    const sess = await getSess(env, chatId);

    if (sess?.state === 'name' && text) {
        sess.data.name = text.slice(0, 100);
        sess.state = 'phone';
        await setSess(env, chatId, sess);
        await askPhone(env, chatId);
        return;
    }

    if (sess?.state === 'phone') {
        const phone = normalizePhone(msg.contact?.phone_number || text);
        if (!phone) {
            await tg(env, 'sendMessage', { chat_id: chatId, text: T.badPhone });
            return;
        }
        sess.data.phone = phone;
        sess.state = 'day';
        await setSess(env, chatId, sess);
        await tg(env, 'sendMessage', { chat_id: chatId, text: '👍', reply_markup: { remove_keyboard: true } });
        await askDay(env, chatId);
        return;
    }

    if (sess?.state === 'day_other' && text) {
        sess.data.day = text.slice(0, 200);
        sess.state = 'comment';
        await setSess(env, chatId, sess);
        await askComment(env, chatId);
        return;
    }

    if (sess?.state === 'comment' && text) {
        sess.data.comment = text.slice(0, 500);
        sess.state = 'confirm';
        await setSess(env, chatId, sess);
        await askConfirm(env, chatId, sess.data);
        return;
    }

    // Поза діалогом: текст → міст «питання лікарю»
    if (text) {
        await forwardQuestion(env, msg);
        return;
    }
    await showMenu(env, chatId, T.fallback);
}

export async function onRequestPost({ request, env }) {
    if (env.TG_WEBHOOK_SECRET
        && request.headers.get('x-telegram-bot-api-secret-token') !== env.TG_WEBHOOK_SECRET) {
        return new Response('forbidden', { status: 403 });
    }
    let update;
    try { update = await request.json(); } catch { return new Response('bad request', { status: 400 }); }

    try {
        if (update.callback_query) {
            await handleCallback(env, update.callback_query);
        } else if (update.message) {
            const msg = update.message;
            const isGroup = String(msg.chat.id) === String(env.TG_CHAT_ID);
            if (isGroup) {
                if (msg.reply_to_message && !msg.from?.is_bot) await relayReply(env, msg);
            } else if (msg.chat.type === 'private') {
                await handlePrivateMessage(env, msg);
            }
        }
    } catch (e) {
        console.error('telegram webhook error:', e);
    }
    // Завжди 200, щоб Telegram не ретраїв нескінченно
    return Response.json({ ok: true, dry: env.DRY_RUN ? env.__dry : undefined });
}
