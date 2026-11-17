# Working on this website

This is a customer-owned Next.js website for a Japanese izakaya. Read [README.md](README.md) for setup,
content editing, deployment and the optional Jamstacks contact form.

## Working preferences

- Work in this repository on its current branch unless asked otherwise.
- Preserve existing changes. Leave edits uncommitted; push or deploy only when requested.
- Adapt the website to its owner's requested content and features. Replace the sample izakaya, menu, osusume,
  sake list, address and contact details with the owner's real details; the fictional examples are starting content.

## Structure and content

- `content/menu.ts` owns the food. Most owner requests are edits here only:
  - `osusume` (top of the file): today's 3–5 recommendations, as `{ item: 'menu-id' }` or a free-standing
    `{ special: { id, name, nameJa, romaji, description, price } }`. The owner's most frequent edit.
  - `sections`: each with `id`, `title` (romaji), `titleJa`, English `subtitle`, `description` and `items`.
  - Items: `id`, `name` (English), `nameJa`, `romaji`, `description`, `price` (per skewer for skewers), `skewer`
    (`pieces` in order, 2–6, `seasoning` `shio` | `tare` | `either`, `perOrder`), `diet`, `raw`, `badge`
    (`osusume` | `seasonal` | `new`), `featured` and `soldOut` (the tag turns face-down but stays on the rail).
  - `rawAdvisory` (written once; shown whenever any item is `raw`) and `notes`.
- `content/drinks.ts` owns the sake list (`type`, real `prefecture`, `dryness`, `temperatures` from the eight
  `TEMPERATURES` steps, `glass`/`tokkuri`/`bottle` prices, three `featured`), `others` and `nonAlcoholic`.
  Sake names are invented or generic: never use a real brewery or brand the owner doesn't pour.
- `content/izakaya.ts` owns the name (`name`, `nameJa` dyed on the noren, one panel per character), tagline,
  introduction, story, how ordering works, contact details, address (with `place` and a landmark `note`),
  directions, parking, opening hours (local times), `lastOrderMinutes`, notice, `seating`, `otoshi` (`null` removes
  it), `drinkingAge`, amenities, FAQs and social links. Renaming the business: `name`/`nameJa` here plus `name` in
  `site.config.json`.
- Opening hours: a `closes` time earlier than `opens` means after midnight (Friday `17:00`–`01:00`). The
  open/last-order/status logic lives in `lib/hours.ts` and is unit tested.
- Skewer drawings are generated from `pieces` by `lib/skewer.ts`. A new kind of piece needs a `Piece` type entry and a
  drawing in `PIECES`; the tests fail until it has one.
- Ids are unique, lowercase and hyphenated; they are page anchors (`/menu/#negima`, `/sake/#house-junmai`).
- Japanese text must be correct, natural Japanese (kanji and kana) with Hepburn romaji and plain English. Never
  invent characters or use machine-garbled text; prefer standard names of common dishes. Avoid stereotyped imagery
  (geisha, samurai, ninja, rising-sun motifs, brush-stroke novelty Latin fonts, mock-Japanese).
- Drinks copy says "21+ with ID" plainly, gives non-alcoholic drinks real billing and never encourages heavy drinking.
- Use the existing illustrations (noren, lantern, tags, strips, hanko, skewers, robata, tokkuri, komodaru) and colour
  tokens instead of adding image files.
- Content never goes in `site.config.json` (Jamstacks rewrites it); the time zone does (`timeZone`).
- Text is rendered as plain text. Don't invent reviews, awards or claims for a real business.

## Styling (Tailwind CSS v4)

- Style components with Tailwind utility classes in the TSX. Don't add global CSS for one-off styles.
- `app/tailwind.input.css` holds what utilities can't express: the colour tokens (`:root` for light, plus two dark
  blocks that must stay identical), the `@theme` built from them, base element styles, shared building blocks
  (`.button`, `.text-link`, `.eyebrow`, `.wall`, `.washi`, `.cloth`, `.noren-rod`, `.hanko`, `.mark`, `.chip`),
  the noren, lantern, tags, strips, skewers, robata and tokkuri art, animation and data-attribute states.
- Only this template's palette exists (`bg`, `paper`, `ink`, `muted`, `line`, `wall`, `tag`, `indigo`, `noren-dye`,
  `accent`, `accent-text`, `shu`, `cold`, `hot` and their variants). Tailwind's default colours are switched off. To
  add a colour, add a variable to `:root` and both dark blocks, then map it in `@theme inline` as
  `--color-name: var(--variable)` to get `bg-name`, `text-name` and so on.
- Colours switch with the theme through the tokens, so prefer them to `dark:` variants (`dark:` follows `html.dark`).
  Vermilion (`shu`) is for hanko stamps, osusume marks and the lantern only.
- Reuse the components (`SectionHead`/`NorenDivider`, `PageHead`, `MenuTag`, `OsusumeStrips`, `SkewerArt`, `Hanko`,
  `TemperatureScale`, `HoursList`, `TonightStatus`) instead of restyling each instance. Menus are always rows of
  vertical tags on a rail, never horizontal cards; text sections sit on `.washi` sheets.
- Fonts come from `app/fonts.css`, generated by `npm run fonts` (`scripts/fonts.mjs`) from the Fontsource packages.
  Yuji Syuku is for the noren name only.
- Keep the `--jamstacks-*` component variables mapped to the tokens, with `--jamstacks-color-primary` a dark indigo in
  both modes. Preserve readable contrast in both themes, responsive layouts from 360px, visible keyboard focus,
  semantic headings, a skip link and reduced-motion support (the noren parting, lantern glow, smoke and tag swing all
  stop under `prefers-reduced-motion`).

## Static architecture

- Production is a static export in `out/`. Preserve static-export compatibility; no request-time rendering,
  API routes, Server Actions, middleware, database or production Next.js server.
- Use local content for pages and ordinary client code only for browser-only interactions (tonight's status, menu
  filters, the sake temperature selection, the copy button, the form host). Time-dependent text is computed in the
  browser (`components/izakaya-clock.tsx`), never at build time: the static HTML shows the week's hours.
- Preserve both custom-domain root URLs and arbitrary GitHub Pages repository paths. Use the shared path helpers
  (`lib/paths.ts`) and `SiteLink` for links and metadata.
- Read the relevant installed Next.js guides in `node_modules/next/dist/docs/` before changing framework behaviour.
  Keep dependencies modest and the npm lockfile reproducible.

## Optional Jamstacks form

- Keep the integration documented in README.md. The host is `<jamstacks-support-form>` with
  `data-jamstacks-component="support-form"` and `data-jamstacks-site` attributes.
- `JAMSTACKS_SITE` is a public website ID. Load one configured CDN bootstrap at `/sites/{publicSiteId}/embed.js`,
  on the Contact page only; no ID means no script request and a useful email fallback. The email stays visible beside
  the form at all times.
- The shared runtime owns form rendering, validation, spam protection, submission and success messages. Do not copy
  it, register a replacement element, render a substitute form, intercept submission or simulate success.
- Preserve the full-document Contact navigation (`SiteLink`) until a supported remount contract is available.
- The form supports name, email and message. Page copy says the counter is walk-in and a message is an enquiry:
  nothing is booked until the izakaya replies. Don't promise bookings, ordering, attachments or extra fields.
- Style through supported `--jamstacks-*` CSS variables; do not reach into shadow-root internals.
- Configuration and build-time environment values are public. Never put credentials, publishing keys or private
  notification recipients in them. Remote builds must not depend on localhost.
- Preserve `.github/workflows/pages.yml`, its optional `provisioning_id` input and correlated run name when changing
  the workflow. Pull requests validate without deploying.

## Commands and checks

```sh
npm ci
npm run dev       # http://localhost:3000
npm test          # content, hours, skewer, config and embed checks
npm run typecheck
npm run build     # static export
npm run check     # all three
PAGES_BASE_PATH=/izakaya-preview npm run build
```

Run `npm run check` after every content or code change; test failures name the item, sake, section or day to fix.
`npm start` previews the export on port 3000; stop the dev server first, or use `npm start -- --port 3200`.
Browser-check affected routes in light and dark at phone and desktop widths, and root/project-path links when
changing layout, navigation or deployment behaviour. Report local checks separately from any actual GitHub
deployment or accepted contact submission.

## Template publishing assets

- `jamstacks/` contains optional source-template metadata, gallery captures and their checks.
- Read `jamstacks/config.json`; capture evidence is `jamstacks/screenshots.json` and JPEGs stay directly inside `jamstacks/`.
- Run `node --test jamstacks/config.test.mjs` only when maintaining a source template.
- Customer websites can remove this entire folder. Website code, normal tests, builds and the Pages workflow must not
  import or read it.
- Keep `site.config.json`, the embed integration and the Pages workflow outside the optional folder.
