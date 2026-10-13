# AGENTS.md — Avencode

> Interactive front-end course platform: learners build real projects in the
> browser. No videos. See `README.md` for the SvelteKit starter boilerplate.

## 1. Project overview

Avencode is a 100%-interactive front-end course platform. The shipped course
is Module 0 ("Quick Notes" notes app, 12 lessons, 4 phases).

Two code types — never confuse them:

1. **Platform code** (this repo's SvelteKit app): Svelte 5 runes, Better Auth,
   MongoDB, Google OAuth, Tailwind, CodeMirror editor.
2. **Learner code** (inside `src/lib/content/notas/curriculum/lesson-*.js`):
   vanilla JS (ES6+), HTML5, CSS3 only. No frameworks, no bundlers, no Canvas,
   no Svelte. Keep it that way when editing course content.

## 2. Stack and structure

- Package manager: **pnpm** (`pnpm-lock.yaml`). Node v22, SvelteKit 2,
  `adapter-vercel`. Styling: Tailwind v4 via `@tailwindcss/vite`; theme tokens
  live in `src/routes/layout.css` (`@theme`, `md-*`, `clip-*`, `lab-*`).
- Lint/format: ESLint (`eslint.config.js`, `eslint-plugin-svelte`) + Prettier
  (tabs, single quotes, no trailing comma, width 100). See those configs;
  not repeated here.
- Types: plain JS with JSDoc (`jsconfig.json`, `checkJs: false`). No
  `svelte-check`, no `tsc` script.

| Path | Purpose |
|---|---|
| `src/routes/` | `+page.svelte` (landing), `lesson/[id]/` (lab), `better-auth/`, `api/progress/` |
| `src/lib/content/notas/lessons.js` | Course index: metadata only (`id`, `title`, optional `type`) |
| `src/lib/content/notas/curriculum/` | Full lesson bodies (`lesson-01.js`…`lesson-12.js`) |
| `src/lib/playground/` | Sandboxed iframe preview (`buildSrcDoc.js`, `iframeProtocol.js`) |
| `src/lib/stores/` | `progress.svelte.js`, `progressMigrations.js`, `labLayout.js` |
| `src/lib/server/` | `auth.js` (Better Auth), `db.js` (MongoDB) |
| `src/lib/markdown.js` | Dependency-free lesson Markdown renderer |
| `src/lib/components/` | Lab UI (`Playground`, `CodeEditor`, `Preview`, `Console*`, …) |
| `tests/` | `node:test` suites, one per area above |
| `src/hooks.server.js` | Auth session wiring (`app.d.ts` declares `App.Locals`) |

## 3. Commands

All verified on Node v22 / pnpm 10 unless marked otherwise.

```sh
pnpm install --frozen-lockfile --prefer-offline  # verified: OK (9s)
node --test tests/*.test.js                      # verified: 42/42 pass
pnpm exec prettier --check .                     # verified: FAILS (5 files, see §11)
pnpm exec eslint .                               # verified: FAILS (10 errors, see §11)
pnpm run build                                   # verified: PARTIAL — Vite SSR+client OK,
                                                 # adapter-vercel fails, see §11
pnpm run dev                                     # not verified (never started here)
pnpm run preview                                 # not verified
```

Notes:

- `node --test tests/` (directory form) fails with `MODULE_NOT_FOUND`; always
  use the `tests/*.test.js` glob.
- There is no `test`, `check`, or `lint:fix` script in `package.json`. There
  is no CI (`.github/` does not exist) and no `.env.example`.
- `db:*` / `auth:schema` scripts exist but are **not verified and look stale**:
  `drizzle.config.js` requires `DATABASE_URL` and points at
  `src/lib/server/db/schema.js`, which does not exist. Do not run them without
  asking. No determinado whether drizzle is still in use.

## 4. Architecture notes

- **Routing:** `/` landing + module list; `/lesson/[id]` validates `id` in
  `+page.js` (redirects to `/` when out of range) and lazy-loads the lesson;
  `/better-auth` + `/better-auth/login` handle sign in/out; `PUT`/`GET`
  `/api/progress` mirrors progress for logged-in users (401 for anonymous;
  the client keeps working on localStorage).
- **Auth flow:** `src/hooks.server.js` calls `auth.api.getSession` per request
  and fills `event.locals.{user,session}`; `src/lib/server/auth.js` builds
  Better Auth with `mongodbAdapter`, `emailAndPassword`, Google social
  provider, and `sveltekitCookies` (must stay last). Login uses a
  `signInSocial` form action defaulting to `provider: 'google'`.
- **MongoDB access:** only via `getDb()` in `src/lib/server/db.js` (cached
  `MongoClient` promise on `globalThis`, database from `MONGODB_DATABASE`).
  Never open a second client; never query from client-side code.
- **Course content model:** `lessons.js` exports `modules` (id/label/project/
  stack/from/to), `phases`, `lessonList`, and lazy `loadLesson(id)` importers.
  Each `curriculum/lesson-NN.js` default-exports `{ id, title, description,
  task, concept, whyItMatters, starterCode: { html, css, javascript },
  type? }`. Only `type: 'challenge'` exists (lesson 11; its prose must contain
  "Integrative challenge"). `tests/lessons.test.js` enforces this contract —
  read it before adding or renumbering lessons.
- **Progress model:** localStorage key `avencode-progress` (versioned,
  currently v1) is the render source of truth: `{ currentLesson,
  completedLessons[], editorContents{lessonId: {html,css,javascript}},
  updatedAt }`. Logged-in learners mirror it to the MongoDB `progress`
  collection keyed by `userId` (upsert, 400 KB cap). Every read/write passes
  through `migrateToCurrent`/`sanitizeProgress` — corrupt fields fall back
  per-field, never wipe. Renumbering lessons requires a migration + version
  bump (see header comment in `progressMigrations.js`).
- **Lab layout is separate:** key `avencode-lab-layout`, never merged into
  progress, never sent to `/api/progress`.
- **Playground:** learner code runs in a sandboxed iframe built by
  `buildSrcDoc` (console/error bridge via `postMessage`, CSS/JS inlined,
  `</script>`/`</style>` sequences escaped). `LessonPanel` prose is rendered
  with the local Markdown subset and injected via `{@html}` — the renderer
  escapes everything first; keep it that way.

## 5. Conventions

Observed in the code actually present (Svelte 5 runes forced in
`vite.config.js`):

- `$state` / `$derived` / `$effect` / `$props` / `$bindable`; `{#key lesson.id}`
  remounts `Playground` per lesson instead of syncing effects.
- `#lib/*` import alias (see `package.json` `imports`); `$lib` also used.
- JSDoc `@type`/`@param` on functions and props; file-header comments explain
  invariants — update them when you change behavior.
- Class strings written in full so Tailwind can scan them; shared tokens stay
  in `layout.css`, never as component `<style>` (lesson starter CSS is the
  exception — it is course material, plain CSS on purpose).
- Sanitise-then-trust: `sanitizeProgress`, `parseLabLayout`, `parseIframeMessage`
  (returns `null` for foreign messages), Markdown escaping. Console list capped
  (`MAX_CONSOLE_MESSAGES = 500`).
- Language: English everywhere except `src/lib/server/db.js`
  (`crearConexion`, `cliente`) — leave as is.

## 6. Environment variables

Names only — never print or commit values. Local `.env` is gitignored.

| Name | Purpose (from code) |
|---|---|
| `ORIGIN` / `PROD_ORIGIN` | Better Auth `baseURL` (dev / prod) |
| `BETTER_AUTH_SECRET` | Better Auth signing secret |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth provider |
| `MONGODB_URI` / `MONGODB_DATABASE` | Mongo driver connection + database |
| `DATABASE_URL` | Only referenced by `drizzle.config.js` (stale?, see §3) |
| `GROQ_*`, `R2_*`, `STRIPE_*`, `WHATSAPP_*` | Present in local `.env` but **unused in `src/`** — do not wire up unasked |

## 7. Testing

- Runner: `node:test` + `node:assert/strict`, no framework. Suites:
  `lessons` (content contract), `markdown`, `playground`, `progress`,
  `labLayout`. Run: `node --test tests/*.test.js`.
- Adding a lesson? Update `lessonList` + `loaders` + new `curriculum` file +
  `modules`/`phases` ranges; `MAX_LESSON_ID` must still equal
  `lessonList.length` (asserted). Starter JS must parse via `new Function`;
  every DOM id queried must exist in the lesson HTML; every class used must be
  styled; `<title>` and the `//` header must carry
  `<project> — Lesson <id>`; challenge lessons need `type` in both index and
  body.
- Adding a store field? Extend the sanitiser + migration path and add a
  round-trip/corrupt-payload test in the matching suite.

## 8. Boundaries

- **Always:** read the file (and its test) before editing; run `node --test
  tests/*.test.js` plus Prettier/ESLint before finishing; keep learner code
  vanilla JS/HTML/CSS (no frameworks, no Canvas); keep secrets out of code,
  logs, and PR text.
- **Ask first:** auth flow or providers, Mongo schema/collections, new
  dependencies, deploy/adapter config, data migrations or backfills, running
  any `db:*` script, touching `drizzle.config.js`.
- **Never:** commit `.env` or paste secret values; push to `main`; delete user
  data; run destructive DB operations; connect to production; "fix" unrelated
  lint/format failures silently (report them instead).

## 9. Git workflow

- History is a single `first commit` — **No determinado** commit-message
  convention. Use short imperative subjects (`Add …`, `Fix …`).
- Never push to `main`. Work on `feat/<short-name>`, run local checks, commit,
  push the branch, open a PR with `gh`. PR description must list: analysis
  summary, verified vs. unverified commands, `No determinado` items, and
  problems found but not fixed.

## 10. Definition of done

- [ ] `node --test tests/*.test.js` green (42/42 or more)
- [ ] Prettier/ESLint status reported (or green); no new warnings
- [ ] No secrets, no `.env` changes, no learner-code framework leakage
- [ ] PR on a `feat/*` branch with summary, verification log, risks

## 11. Known pitfalls (found during verification, not fixed)

- `prettier --check .` fails in 5 files: `Footer`, `Glitch`, `Hero`,
  `Navbar`, `src/routes/+page.svelte`.
- `eslint .` reports 10 errors: unused vars + `resolve()`-less `href`s in
  `src/routes/+page.svelte`; `Map` instead of `SvelteMap` (×2) in
  `lesson/[id]/+page.svelte`.
- `pnpm run build` compiles (SSR + client) but `adapter-vercel` crashes with
  `EPERM … symlink` on Windows — needs elevated rights or a non-symlink
  setup; deploy config untouched per §8.
- `drizzle.config.js` points at a non-existent `src/lib/server/db/schema.js`
  and needs `DATABASE_URL`; the app itself uses the `mongodb` driver, not
  drizzle. Left as is — ask before touching.
