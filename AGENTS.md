# AGENTS.md

## Контекст проекта
Это платформа для запуска одного или нескольких новостных сайтов (multi-site / multi-domain) с единой админкой и общим конвейером:
источники → сбор сырья → нормализация/дедуп → AI-трансформация (перевод/summary/варианты) → редакторское ревью → публикация → темы/тренды → маршрутизация по сайтам.

Мы используем Harper’s Bazaar (harpersbazaar.com) только как референс информационной архитектуры (sections/channels/series и паттерны страниц), без копирования контента/текста/дизайна.

## Цели (MVP)
1) Поднять рабочий skeleton: Next.js + Payload CMS (admin `/admin`) + публичные страницы.
2) Заложить multi-site с первого дня (entity `Site`, site-aware контент).
3) Реализовать минимальный ingestion (RSS adapter) → `RawItem`.
4) Реализовать минимальный AI-worker (перевод+summary) → `Article` со статусом `review`.
5) Подготовить основу для `Story/Topic` и trend score (можно сначала заглушки/простая реализация).
6) Сделать структуру проекта расширяемой: легко добавлять новые домены, правила маршрутизации, источники, языки, дизайн.

## Жёсткие ограничения
- WordPress запрещён.
- TypeScript везде.
- Никакого “хардкод-скрейпа” под конкретный донорный сайт. Ingest должен быть адаптерным и безопасным.
- По умолчанию автоматизация НЕ публикует сразу в прод: только `review`, публикация — через редактора/правила.
- Не копировать чужие тексты и большие фрагменты контента. Храним источники, ссылки и фактологические reference’ы.

## Рекомендуемая структура репозитория (монорепа)
- `apps/web/` — Next.js (App Router) + Payload CMS + публичная витрина + API routes
- `apps/ingest/` — ingestion service (адаптеры: rss/api/manual), пишет `RawItems` в CMS
- `apps/worker/` — AI worker (translation/summary + метаданные), создаёт `Articles` в `review`
- `packages/shared/` — общие типы, утилиты, нормализаторы, константы
- `packages/rules/` — rules engine: маршрутизация по сайтам/каналам, тренды, фильтры качества
- `infra/` — docker-compose локально (db + apps), env templates, минимальные инструкции деплоя
- `docs/` — архитектура, модель данных, политика источников, AI-политика
- `scripts/` — seed/backfill/reindex и т.п.

## Модель данных (Payload collections) — обязательный набор
Multi-site:
- `Sites`: `slug`, `name`, `domains[]`, `locales[]`, `defaultLocale`, `themeConfig`, `publishingPolicy`

Таксономия:
- `Sections`: `site`, `slug`, `title`, `order`
- `Channels`: `section`, `slug`, `title`, `order`, `aliases[]`
- `Tags`: `site`, `slug`, `title`
- `Series`: `site`, `slug`, `title`, `description`, `hero`

Источники и сырьё:
- `Sources`: `name`, `homepageUrl`, `type (rss/api/manual)`, `fetchConfig`, `trustTier`
- `RawItems`: `source`, `sourceUrl`, `publishedAt`, `fetchedAt`, `rawTitle`, `rawText`, `rawHtml?`, `language`, `fingerprint`, `status`, `debug`

Темы/публикации:
- `Stories`: `site`, `title`, `summary`, `entities`, `trendScore`, `firstSeenAt`, `lastSeenAt`, `sourcesAggregate`
- `Articles`: `site`, `story?`, `section`, `channels[]`, `tags[]`, `series[]`, `locale`,
  `title`, `dek`, `body`, `leadImage`, `gallery[]`,
  `sourceRefs[]` (источники/URL/время/издание),
  `aiMeta` (model, promptVersion, runId, confidence),
  `status (draft/review/published)`, `seo`, `publishedAt`

Управление автоматизацией:
- `PromptTemplates`: versioned prompts
- `RoutingRules`: `site`, `conditions`, `actions`, `enabled`
- `JobRuns` / `AuditLogs`: запуск jobs, счётчики, ошибки, ссылки на записи

## Публичные маршруты (web)
Обязательный минимум:
- `/` — главная (блоки конфигурируемые)
- `/{sectionSlug}` — лента раздела
- `/{sectionSlug}/{channelSlug}` — лента подраздела
- `/article/{slug}` — статья
- `/story/{slug}` — тема/сюжет: таймлайн, список источников
- `/series/{slug}` — спецпроект
- `/search` — поиск по локальному контенту
- `/sitemap.xml`, `/rss.xml`

## Конвейер (pipeline)
### Ingest
- Источник → адаптер → нормализация → `RawItem`
- Дедуп минимум: по `sourceUrl` + `fingerprint`
- Ретрай/логирование обязательно (иначе это “игрушка”)

### AI Worker
- `RawItem (new)` → AI transformation → `Article (review)` + `aiMeta` + ссылка на `RawItem`
- Никакой автопубликации по умолчанию.
- Промпты строго версионируются через `PromptTemplates`.

### Stories/Trends (итеративно)
- На MVP можно: простая кластеризация или ручная привязка `Article → Story`.
- Далее: embeddings/пороги/merge-split tools в админке.

## Правила качества (Quality Gates)
Перед тем как считать задачу выполненной:
- Репо собирается и запускается локально (одной командой из README).
- Есть seed-скрипт, который создаёт 1 `Site` и базовую таксономию (Harper’s Bazaar-like).
- В `apps/ingest` есть рабочий RSS пример, который создаёт `RawItems`.
- В `apps/worker` есть рабочий пример обработки, который создаёт `Articles` со статусом `review`.
- Связи видны в админке: `Article -> RawItem -> Source`, `Article -> Site/Section/Channel`.
- Минимальные страницы показывают контент.

## Стиль разработки
- Минимум магии, максимум ясности.
- Строгая изоляция слоёв: ingest не знает про UI, UI не знает про логику ingest.
- Конфиги и правила — декларативные, не “зашиты в коде”.
- Любая автоматизация должна оставлять “след”: job run id, ошибки, статистика.

## Как агенту работать (если ты — Codex/AI агент)
- Сначала создай/проверь структуру папок и сборку.
- Затем реализуй Payload collections.
- Затем страницы (routes).
- Затем ingestion RSS.
- Затем worker translation+summary.
- Затем seed + README.
- Не пытайся “допилить всё идеально”. Нужен надёжный скелет и расширяемые точки.

## Примечание по “донору”
Donor analysis используется только для:
- списка `Sections`/`Channels`/`Series` и паттернов страниц
- примеров URL-логики
Не используется для:
- копирования текста, картинок, дизайна, CSS
- “парсинга именно их сайта” как обязательного источника
