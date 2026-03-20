# Ulyana Goykhman Landing

Премиальный лендинг на `Next.js 16` для персонального менторинга и консультаций Ульяны Гойхман.

## Что внутри

- главная страница с двумя сценариями: менторинг и консультация;
- многошаговая анкета `/apply`;
- Telegram-уведомления о новых заявках;
- mini-CRM в `/admin`;
- юридические страницы `/privacy` и `/consent`;
- SQL-схема для Supabase в [`supabase/schema.sql`](./supabase/schema.sql).

## Запуск

```bash
npm install
cp .env.example .env.local
npm run dev
```

Открыть: `http://localhost:3000`

## Переменные окружения

Заполнить в `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

## Настройка Supabase

1. Создать новый проект в Supabase.
2. Выполнить SQL из [`supabase/schema.sql`](./supabase/schema.sql).
3. Включить email magic link в Supabase Auth.
4. Добавить redirect URL:

```text
http://localhost:3000/auth/callback
https://your-domain.com/auth/callback
```

5. Пригласить email-адрес администратора в Auth.

## Что проверить перед продом

- заполнены все env-переменные;
- Telegram бот может писать в нужный чат;
- юридические тексты финализированы под фактического оператора;
- `NEXT_PUBLIC_SITE_URL` указывает на реальный домен;
- фотографии и тексты утверждены.
