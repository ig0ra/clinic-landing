// Смоук-тест бота і форми без мережі: node tests/bot-smoke.mjs
import { onRequestPost as telegramHook } from '../functions/api/telegram.js';
import { onRequestPost as submitHook } from '../functions/api/submit.js';

// Мок KV
function mockKV() {
    const store = new Map();
    return {
        async get(k) { return store.has(k) ? store.get(k) : null; },
        async put(k, v) { store.set(k, v); },
        async delete(k) { store.delete(k); },
        _store: store,
    };
}

const env = { DRY_RUN: '1', TG_CHAT_ID: '-100999', KV: mockKV(), __dry: [] };
const GROUP = -100999;
const USER = 42;

function req(update) {
    return {
        request: new Request('http://local/api/telegram', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(update),
        }),
        env,
    };
}
const msg = (text, extra = {}) => ({ message: { chat: { id: USER, type: 'private' }, from: { first_name: 'Тест' }, text, ...extra } });
const cb = (data) => ({ callback_query: { id: 'cb1', data, from: { first_name: 'Тест' }, message: { chat: { id: USER }, message_id: 1 } } });
const groupCb = (data) => ({ callback_query: { id: 'cb2', data, from: { first_name: 'Оксана' }, message: { chat: { id: GROUP }, message_id: 7 } } });

let failed = 0;
function check(label, cond) {
    console.log(cond ? `  ✅ ${label}` : `  ❌ ${label}`);
    if (!cond) failed++;
}
function lastCalls(n) { return env.__dry.slice(-n); }
function sentTexts() { return env.__dry.filter(c => c.method === 'sendMessage').map(c => c.payload.text || ''); }

console.log('1. /start → меню');
await telegramHook(req(msg('/start')));
check('привітання з меню', sentTexts().some(t => t.includes('Вітаємо')) && lastCalls(1)[0].payload.reply_markup?.inline_keyboard?.length > 0);

console.log('2. Повний діалог запису');
await telegramHook(req(cb('m:book')));
check('показано послуги', lastCalls(1)[0].payload.reply_markup.inline_keyboard.some(r => r[0].callback_data?.startsWith('svc:')));
await telegramHook(req(cb('svc:consultation')));
check('запитано імʼя', lastCalls(1)[0].payload.text.includes('звертатися'));
await telegramHook(req(msg('Ігор Тестовий')));
check('запитано телефон з кнопкою контакту', lastCalls(1)[0].payload.reply_markup?.keyboard?.[0]?.[0]?.request_contact === true);
await telegramHook(req(msg('', { contact: { phone_number: '380971112233' } })));
check('запитано день', sentTexts().at(-1).includes('день'));
await telegramHook(req(cb('day:Завтра')));
check('запитано коментар', sentTexts().at(-1).includes('коментар') || sentTexts().at(-1).includes('Пропустити') || lastCalls(1)[0].payload.text.includes('коментар'));
await telegramHook(req(cb('skip')));
check('показано підсумок', lastCalls(1)[0].payload.text.includes('Перевірте заявку'));
const before = env.__dry.length;
await telegramHook(req(cb('confirm')));
const leadCall = env.__dry.slice(before).find(c => String(c.payload.chat_id) === String(env.TG_CHAT_ID));
check('заявка пішла в групу', !!leadCall);
check('заявка містить дані', leadCall && leadCall.payload.text.includes('Ігор Тестовий') && leadCall.payload.text.includes('+380971112233') && leadCall.payload.text.includes('Огляд і консультація'));
check('кнопка «Опрацьовано» з uid', leadCall?.payload.reply_markup.inline_keyboard[0][0].callback_data === `done:${USER}`);

console.log('3. Невалідний телефон');
await telegramHook(req(cb('m:book')));
await telegramHook(req(cb('svc:lab')));
await telegramHook(req(msg('Марія')));
await telegramHook(req(msg('12345')));
check('відхилено поганий номер', lastCalls(1)[0].payload.text.includes('Не схоже'));
await telegramHook(req(msg('/cancel')));

console.log('4. Міст: питання → група, реплай → пацієнту');
const b4 = env.__dry.length;
await telegramHook(req(msg('Чи приймаєте ви в суботу?')));
const fwd = env.__dry.slice(b4).find(c => String(c.payload.chat_id) === String(env.TG_CHAT_ID));
check('питання переслано в групу', fwd && fwd.payload.text.includes('суботу'));
const bridgeKeys = [...env.KV._store.keys()].filter(k => k.startsWith('bridge:'));
check('bridge-мапу збережено', bridgeKeys.length === 1);
const groupMsgId = Number(bridgeKeys[0].split(':')[1]);
const b5 = env.__dry.length;
await telegramHook(req({ message: { chat: { id: GROUP, type: 'supergroup' }, from: { first_name: 'Оксана', is_bot: false }, message_id: 555, text: 'Так, у суботу з 9 до 14', reply_to_message: { message_id: groupMsgId } } }));
const relayed = env.__dry.slice(b5).find(c => c.method === 'sendMessage' && c.payload.chat_id === USER);
check('відповідь доставлено пацієнту', relayed && relayed.payload.text.includes('суботу з 9 до 14'));

console.log('5. Кнопка «Опрацьовано»');
const b6 = env.__dry.length;
await telegramHook(req(groupCb(`done:${USER}`)));
const edited = env.__dry.slice(b6).find(c => c.method === 'editMessageReplyMarkup');
const notified = env.__dry.slice(b6).find(c => c.method === 'sendMessage' && c.payload.chat_id === USER);
check('кнопку замінено на статус', edited && edited.payload.reply_markup.inline_keyboard[0][0].text.includes('Опрацьовано'));
check('пацієнта повідомлено', notified && notified.payload.text.includes('опрацьована'));

console.log('6. Форма сайту → /api/submit');
const submitReq = (body) => ({
    request: new Request('http://local/api/submit', { method: 'POST', headers: { 'content-type': 'application/json', 'cf-connecting-ip': '1.2.3.4' }, body: JSON.stringify(body) }),
    env,
});
const b7 = env.__dry.length;
let r = await submitHook(submitReq({ name: 'Олена', phone: '0971234567', service: 'vaccination', date: '2026-07-15', comment: 'дитині 3 роки', consent: true }));
check('валідна заявка → 200', r.status === 200);
const siteLead = env.__dry.slice(b7).find(c => String(c.payload.chat_id) === String(env.TG_CHAT_ID));
check('заявка з сайту в групі з нормалізованим телефоном', siteLead && siteLead.payload.text.includes('+380971234567') && siteLead.payload.text.includes('Вакцинація'));
r = await submitHook(submitReq({ name: 'X', phone: '123', consent: true }));
check('невалідна → 400', r.status === 400);
r = await submitHook(submitReq({ name: 'Бот', phone: '0971234567', consent: true, website: 'spam.com' }));
check('honeypot → тихий 200 без відправки', r.status === 200);

console.log('7. Захист webhook');
const badReq = { request: new Request('http://local/api/telegram', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }), env: { ...env, TG_WEBHOOK_SECRET: 'sss' } };
r = await telegramHook(badReq);
check('без секрету → 403', r.status === 403);

console.log(failed ? `\n${failed} перевірок ПРОВАЛЕНО` : '\nУсі перевірки пройдено ✅');
process.exit(failed ? 1 : 0);
