// Спільне для бота (/api/telegram) і форми сайту (/api/submit)

export const SERVICES = {
    declaration: 'Підписання декларації',
    consultation: 'Огляд і консультація',
    checkup: 'Профогляд',
    ultrasound: 'УЗД-діагностика',
    lab: 'Лабораторна діагностика',
    vaccination: 'Вакцинація',
    massage: 'Дитячий реабілітаційний масаж',
};

export const CLINIC = {
    phoneHuman: '+38 (097) 699-53-84',
    phoneTel: '+380976995384',
    address: 'вул. Біласа і Данилишина 6/36, м. Калуш',
    lat: 49.0259119,
    lng: 24.3587611,
    mapsUrl: 'https://maps.app.goo.gl/ocdzkcVayW1JnQpW9',
    scheduleText: 'Пн–Пт: 08:30–19:00\nСб: 09:00–14:00\nНд: вихідний',
    freeText: 'Безкоштовно для пацієнтів з декларацією:\n• огляд і спостереження лікаря\n• загальний аналіз крові (без формули)\n• загальний аналіз сечі\n• глюкоза крові\n• холестерин\n• ЕКГ',
};

// Поточний час у Києві: день тижня (0=Нд) і хвилини від півночі
export function kyivNow(date = new Date()) {
    const parts = Object.fromEntries(
        new Intl.DateTimeFormat('en-US', {
            timeZone: 'Europe/Kyiv', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
        }).formatToParts(date).map((p) => [p.type, p.value])
    );
    const dows = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { dow: dows[parts.weekday], minutes: (Number(parts.hour) % 24) * 60 + Number(parts.minute) };
}

export function isOpenNow(date = new Date()) {
    const { dow, minutes } = kyivNow(date);
    if (dow >= 1 && dow <= 5) return minutes >= 8 * 60 + 30 && minutes < 19 * 60;
    if (dow === 6) return minutes >= 9 * 60 && minutes < 14 * 60;
    return false;
}

// +380XXXXXXXXX або null
export function normalizePhone(raw) {
    const digits = String(raw || '').replace(/\D/g, '');
    if (/^380\d{9}$/.test(digits)) return `+${digits}`;
    if (/^0\d{9}$/.test(digits)) return `+38${digits}`;
    return null;
}

export function escapeHtml(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Виклик Telegram Bot API. У DRY_RUN нічого не шле — складає виклики в env.__dry
export async function tg(env, method, payload) {
    if (env.DRY_RUN) {
        env.__dry = env.__dry || [];
        env.__dry.push({ method, payload });
        return { ok: true, result: { message_id: 100000 + env.__dry.length } };
    }
    const res = await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/${method}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return res.json();
}

// Текст заявки для групи
export function leadMessage({ source, name, phone, service, day, comment, email }) {
    const lines = [
        `🆕 <b>Заявка ${source === 'bot' ? 'з бота' : 'з сайту'}</b>`,
        `👤 ${escapeHtml(name)}`,
        `📞 ${escapeHtml(phone)}`,
    ];
    if (service) lines.push(`🩺 ${escapeHtml(service)}`);
    if (day) lines.push(`📅 ${escapeHtml(day)}`);
    if (email) lines.push(`✉️ ${escapeHtml(email)}`);
    if (comment) lines.push(`💬 ${escapeHtml(comment)}`);
    if (!isOpenNow()) lines.push('\n🌙 Заявка поза робочим часом');
    return lines.join('\n');
}

// Кнопка «Опрацьовано». uid=0 для заявок із сайту (нема кому відповідати в TG)
export function leadKeyboard(uid) {
    return { inline_keyboard: [[{ text: '✅ Опрацьовано', callback_data: `done:${uid || 0}` }]] };
}

// Надіслати заявку в групу
export async function sendLead(env, lead, uid) {
    return tg(env, 'sendMessage', {
        chat_id: env.TG_CHAT_ID,
        text: leadMessage(lead),
        parse_mode: 'HTML',
        reply_markup: leadKeyboard(uid),
    });
}
