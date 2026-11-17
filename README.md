# Izakaya Tsukiakari (Next.js)

A moody izakaya theme in sumi ink, indigo and lantern red for Japanese pubs, yakitori bars and small-plates restaurants: a wall of hanging wooden menu tags, yakitori drawn skewer by skewer, today's recommendations on paper strips, a sake list with a serving-temperature guide, counter seating, late hours, location and a [Jamstacks](https://jamstacks.net) contact component for group tables, omakase evenings and private hire.

The page is a walk through the door of a small izakaya at night: you push through an indigo noren with the shop name dyed across it, into a wooden room where the menu hangs on the wall as tall vertical tags, today's specials are pinned up on paper strips and the story, FAQs and directions are set on washi sheets. Light mode is "washi and indigo"; dark mode is "the alley after dark", with charred-cedar walls and a single red chōchin lantern glowing by the noren. Both follow the visitor's device unless they pick one with the header toggle.

It exports to plain static files, deploys to GitHub Pages (custom domain or `/repository/` path) and works with no backend.

**Izakaya Tsukiakari** (居酒屋 月明かり, "moonlight"), its owner and story, menu, sake list and contact details are fictitious placeholders, and the sake names are invented or generic. The sample address is a public landmark, Kobe Terrace Park in Seattle's Chinatown–International District, so the map has something real to show. Replace all of them with your own.

## Pages

| Route | What's there |
| --- | --- |
| `/` | The noren hero (panels part slightly to show the warm room, with a lantern beside it). Below it, on the wall: tonight's status ("Open · last order 11pm", "Open until 1am tonight", "Closed today · open Tuesday from 5pm"), "10 counter seats · walk-ins welcome", tonight's hours, the address, today's osusume and "See the menu" / "Find us". Then **Find us** (landmark, directions, transit and parking, hours with last order, a pinned map), **Today's recommendations** on paper strips, **From the grill** (featured skewers with their drawings), **The counter** (story, seating, how ordering works, the otōshi), **Sake tonight** (three sakes and a compact temperature scale), group tables & omakase evenings, and FAQs |
| `/menu/` | Tonight's status and the osusume strips, then one wooden rail of hanging tags per section, with split-noren tabs to jump between rails and filters (vegetarian, vegan, no raw, no shellfish). Sold-out tags hang face-down. The raw-food advisory and allergy notes are on a washi sheet at the foot |
| `/sake/` | The tokkuri thermometer (choose a temperature to highlight the sakes that suit it), the sake list grouped by type with prefecture, dryness, serving temperatures and glass/tokkuri/bottle prices, non-alcoholic drinks, beer, highballs and shochu, and "How to drink sake here" |
| `/contact/` | Group tables, omakase evenings & private hire: email and phone (always available) plus the hosted enquiry form when connected |
| any other URL | A friendly 404: "This tag has been taken down…" |

## Quick start

Requires Node.js 24 or newer.

```sh
npm ci            # install exact locked dependencies
npm run dev       # http://localhost:3000 with live reload
npm test          # configuration, content, hours and skewer checks
npm run typecheck
npm run build     # static export to out/
npm start         # serve out/ locally at http://localhost:3000/
npm run check     # test + typecheck + build in one go
```

No account, API key or network service is needed to run or build the website. Fonts are installed from npm and bundled at build time, so the build never fetches anything from a font service.

## Make it yours

Every page reads from three content files, so there are no duplicated strings to hunt down:

| File | What to change |
| --- | --- |
| [content/menu.ts](content/menu.ts) | **Today's recommendations** (`osusume`, at the top), menu sections and dishes, prices, skewer pieces and seasoning, badges, diet marks, raw flags, sold-out tags, the raw-food advisory and allergy notes, currency |
| [content/drinks.ts](content/drinks.ts) | The sake list (type, prefecture, dryness, serving temperatures, glass/tokkuri/bottle prices), other drinks, non-alcoholic drinks |
| [content/izakaya.ts](content/izakaya.ts) | Name (`name` and Japanese `nameJa`, dyed on the noren), tagline, introduction, story, how ordering works, email, phone, address (plus a landmark `note`), directions, parking, opening hours, last order, notice, seating, the otōshi, drinking age, amenities, FAQs, social links |
| [app/tailwind.input.css](app/tailwind.input.css) | Colours (wood, washi, indigo, vermilion, lantern and the skewer drawings), fonts and other customizations. Components are styled with Tailwind classes |
| `public/og.png` | 1200×630 social preview image |
| `app/icon.svg` | Browser tab icon |
| [site.config.json](site.config.json) | Site name/description, domain, your time zone and public deployment settings (see below) |

**Renaming the business** is a two-line change: `name` (and `nameJa`) in `content/izakaya.ts` and `name` in `site.config.json`. The noren hangs one panel per character of `nameJa`, so three to five characters work best.

### Today's recommendations (osusume)

The paper strips on the home and menu pages come from `osusume` at the top of `content/menu.ts`. Keep three to five entries. Point at a dish on the menu by its id, or write a special that isn't on the menu:

```ts
export const osusume: Osusume[] = [
  { item: 'tsukimi-tsukune' },
  {
    special: {
      id: 'sanma-shioyaki',
      name: 'Salt-grilled Pacific saury',
      nameJa: 'さんまの塩焼き',
      romaji: 'sanma no shioyaki',
      description: 'Whole autumn saury over charcoal, grated daikon and sudachi.',
      price: 16,
    },
  },
];
```

The tests check that every id exists and isn't sold out.

### Maintaining the menu

Each dish is one entry in its section, and becomes one wooden tag:

```ts
{
  id: 'negima',                       // unique; also the link /menu/#negima
  name: 'Chicken thigh and scallion', // plain English
  nameJa: 'ねぎま',                    // written down the tag
  romaji: 'negima',                   // Hepburn romaji, shown under the tag
  description: 'The classic: juicy thigh and sweet negi, turn and turn about.',
  price: 4.5,                         // per skewer for skewers
  skewer: { pieces: ['thigh', 'negi', 'thigh', 'negi', 'thigh'], seasoning: 'either', perOrder: 2 },
  diet: [],                           // 'vegetarian', 'vegan', 'gluten-free', 'contains-nuts', 'contains-shellfish'
  badge: 'osusume',                   // or 'seasonal' or 'new'; osusume adds a vermilion hanko
  featured: true,                     // show in "From the grill" on the home page (skewers)
}
```

Common tasks:

- **Sold out today:** add `soldOut: true`. The tag turns face-down (売り切れ, "Sold out today") but stays on the rail, as tags do in a real izakaya. Remove it tomorrow.
- **Change a price:** edit `price`. Prices are formatted in `menu.currency` (USD by default).
- **Seasonal or new dish:** add `badge: 'seasonal'` or `badge: 'new'`. Use `badge: 'osusume'` for a recommendation stamp.
- **A new skewer:** list its `pieces` in order from tip to handle (2–6 of `thigh`, `negi`, `tsukune`, `skin`, `heart`, `shiitake`, `shishito`, `pork-belly`, `asparagus-pork`, `quail-egg`) and its `seasoning` (`shio`, `tare` or `either`). The drawing is made from the pieces, so no image is needed. A new kind of piece needs a drawing in [lib/skewer.ts](lib/skewer.ts); the tests fail until it has one.
- **Raw dishes:** set `raw: true`. Any raw dish shows the consumer advisory (written once, in `menu.rawAdvisory`) on its rail and at the foot of the menu.
- **A new section:** add `{ id, title, titleJa, subtitle, description, items: [...] }` to `menu.sections`. It gets its own rail, a split-noren tab and a narrow noren with `titleJa` beside it.
- **The otōshi:** edit `otoshi` in `content/izakaya.ts`, or set it to `null` to remove it from the menu, home page and FAQs.

Write Japanese names in natural Japanese (kanji and kana) with Hepburn romaji. If you're unsure of a name, use the standard name for a common dish. Text is rendered as plain text, so there's no HTML to escape.

### The sake list and serving temperatures

Each sake in `content/drinks.ts` lists the temperatures it's best at, from the eight traditional steps: `yukibie` (雪冷え, ~5°C), `hanabie` (花冷え, ~10°C), `suzubie` (涼冷え, ~15°C), `joon` (常温, ~20°C), `hinatakan` (日向燗, ~30°C), `hitohadakan` (人肌燗, ~35°C), `nurukan` (ぬる燗, ~40°C) and `atsukan` (熱燗, ~50°C). The tokkuri thermometer and each sake's mini scale are drawn from these. Use invented or generic names for anything you don't actually pour, never a real brewery or brand. `tokkuri` and `bottle` prices are optional; set `featured: true` on exactly three sakes for the home page. The tests check every sake has a known type, prefecture, dryness and at least one temperature, and that every temperature step is used.

### Hours, last order and "tonight"

Opening hours are local times in `content/izakaya.ts`. A `closes` time earlier than `opens` means after midnight: Friday `opens: '17:00', closes: '01:00'` stays open until 1am Saturday. Days without `opens`/`closes` are closed. `lastOrderMinutes` (30) sets last order (ラストオーダー) before closing.

The status under the noren, on the menu and on the sake page is worked out **in the visitor's browser** from your time zone and refreshed every minute: "Open · last order 11pm", "Last order in 20 minutes", "Last order has passed · open until 11:30pm", "Open until 1am tonight" or "Closed today · open Tuesday from 5pm". Pages are never built with a time baked in. Without JavaScript, or without a time zone, they show the week's hours and make no claim about now. The seating line ("10 counter seats · walk-ins welcome") is a static reminder, never a live count. The logic is in [lib/hours.ts](lib/hours.ts) with unit tests.

Set your time zone as an [IANA name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) in `site.config.json`, e.g. `"timeZone": "America/Los_Angeles"`. Hours are labelled "Times shown in Pacific Time" (or your zone).

### Location and map

The address in `content/izakaya.ts` drives the Find us section, the "Get directions" and "Open in Google Maps" links, the map and the structured data. The optional `place` (a landmark or building) is included in map searches; `note` is shown under the heading.

The map is Google's keyless embed, lazy-loaded so visitors only contact Google when it scrolls into view, and darkened in dark mode by `--map-filter`. No API key is needed. For the officially supported Maps Embed API, create a browser key restricted to your domain and change `mapEmbedUrl` in [lib/maps.ts](lib/maps.ts).

## Appearance

The header uses `DarkModeToggle` from the published `jamstacks` React package. The root layout supplies `ThemeProvider` and the early `ThemeScript`, so a saved preference applies before the first paint.

Everything you see is drawn with inline SVG and CSS coloured by tokens: the noren (cloth weave, dyed hem and slits), the room behind it, the chōchin lantern, the wooden wall and rails, the hanging tags and their strings, the paper strips and washi sheets, hanko stamps, the skewers, the robata grill and its smoke, the tokkuri thermometer and ochoko cup, and the straw sake-barrel lid. There are no image files to swap. Motion is calm and stops for visitors who prefer reduced motion: the noren parts and sways once (under reduced motion it simply hangs, slightly apart), the lantern breathes after dark, grill smoke rises and tags swing a little on hover.

Styling uses [Tailwind CSS v4](https://tailwindcss.com). Components use utility classes such as `bg-paper text-ink`, built from the template's own colour tokens; Tailwind's default palette is switched off so the look stays consistent. To change a colour, edit its variable in `app/tailwind.input.css` (the light `:root` block and both identical dark blocks). To add one, add a variable in all three blocks and map it in `@theme inline` (`--color-highlight: var(--highlight)` gives `bg-highlight`, `text-highlight` and so on).

Fonts are self-hosted from npm:

| Font | Used for | Licence |
| --- | --- | --- |
| [Yuji Syuku](https://fonts.google.com/specimen/Yuji+Syuku) (`@fontsource/yuji-syuku`) | The shop name on the noren only | SIL Open Font License 1.1 |
| [Shippori Mincho](https://fonts.google.com/specimen/Shippori+Mincho) (`@fontsource/shippori-mincho`) | Headings, the vertical tags and paper strips | SIL Open Font License 1.1 |
| [Zen Kaku Gothic New](https://fonts.google.com/specimen/Zen+Kaku+Gothic+New) (`@fontsource/zen-kaku-gothic-new`) | Body text and UI | SIL Open Font License 1.1 |

Each Japanese font is split into `unicode-range` subsets, so a page downloads only the glyphs it uses (about 120 KB on a first visit to the home page). [app/fonts.css](app/fonts.css) is generated from the Fontsource packages by `npm run fonts` ([scripts/fonts.mjs](scripts/fonts.mjs)), keeping only the WOFF2 files; to change a font or weight, edit the list in that script and run it. Prices and times use tabular figures (the `tabular` utility).

## Footer credit

The footer ends with "with ❤️ [jamstacks.net](https://jamstacks.net)". It's an ordinary link in [components/site-footer.tsx](components/site-footer.tsx). This is your website, so you can keep, reword or remove it.

## Configuration

`site.config.json` holds public deployment settings only. Jamstacks may rewrite this file when it sets up a repository for you; it never touches `content/`.

```json
{
  "name": "Izakaya Tsukiakari",
  "description": "A neighbourhood izakaya in Seattle's Chinatown–International District: …",
  "domain": "next-japanese-izakaya.jamstacks.net",
  "timeZone": "America/Los_Angeles",
  "jamstacks": { "siteId": "", "cdnUrl": "https://cdn.jamstacks.net" }
}
```

`domain` is the template's live demo, `next-japanese-izakaya.jamstacks.net`. **Replace it with your own domain** (hostname only, e.g. `www.example.com`) or set it to `""` if you don't know it yet; it's used for canonical links, the social image and the sitemap. Jamstacks provisioning replaces it for you.

Build-time environment variables override the file (blank values keep the file's value). See [.env.example](.env.example).

| Purpose | Local/build variable | GitHub Actions repository variable |
| --- | --- | --- |
| Public Jamstacks website ID | `JAMSTACKS_SITE` | `JAMSTACKS_SITE` |
| Component CDN base | `NEXT_PUBLIC_JAMSTACKS_CDN_URL` | `JAMSTACKS_CDN_URL` |
| Display/canonical domain (hostname only) | `NEXT_PUBLIC_SITE_DOMAIN` | `SITE_DOMAIN` |
| Time zone for opening hours (IANA name) | `SITE_TIME_ZONE` | not needed; set `timeZone` in the file |
| Project-path prefix, e.g. `/my-izakaya` | `PAGES_BASE_PATH` | set automatically from `actions/configure-pages` |
| Absolute site URL for canonical links/sitemap | `PAGES_BASE_URL` | set automatically from `actions/configure-pages` |

Every value here is **public** and ends up in the built files. Never put GitHub tokens, publishing keys or private email addresses in config or `.env` files. The public site ID identifies your website; it grants no administrative access.

Validation happens at build time ([lib/config.mjs](lib/config.mjs)): the site ID must be a single path-safe segment, the CDN must be HTTPS (path prefixes like `https://example.org/_cdn` are fine), the domain must be a bare hostname, and the base path must be a plain URL path. A `localhost` CDN is rejected unless you opt in with `JAMSTACKS_ALLOW_LOCAL_CDN=1`, and is always rejected in GitHub Actions so a public site can never depend on your machine.

GitHub may report an HTTP `PAGES_BASE_URL` while a new custom domain's HTTPS certificate is provisioning. The build accepts that URL and emits HTTPS canonical, social and sitemap URLs. When neither `PAGES_BASE_URL` nor a domain is known, canonical links and social images are omitted and `sitemap.xml` is empty, rather than guessing an origin.

The home page includes schema.org `Restaurant` structured data (address, `servesCuisine` Japanese/Izakaya/Yakitori, phone, menu link, `acceptsReservations: false` because the counter is walk-in and groups are by enquiry, and opening hours) built from `content/izakaya.ts`. Late nights are published as, for example, Friday `opens 17:00` / `closes 01:00`, which search engines read as closing after midnight.

## Contact and Jamstacks

**Without Jamstacks** (default): the Contact page shows your email with a copy button, your phone number and a "useful to include" list (date and time, number of guests, counter or table, interest in an omakase evening, allergies). No Jamstacks script is requested anywhere.

**With Jamstacks**: create a website in the Jamstacks portal, configure the support form's copy (for example heading "Group tables, omakase & private hire", name/email/message labels, button text and a success message) and theme, and **publish** it. Then set `JAMSTACKS_SITE` (and `JAMSTACKS_CDN_URL` if you're not using `https://cdn.jamstacks.net`) and rebuild. The Contact page then renders:

```html
<jamstacks-support-form data-jamstacks-component="support-form" data-jamstacks-site="site_…"></jamstacks-support-form>
<!-- plus, after hydration, one script: {cdn}/sites/{siteId}/embed.js -->
```

How it behaves:

- The hosted component renders inside the tag (in its own shadow root) and owns validation, spam protection, submission and the success/error messages. This template never submits messages, never registers the element itself and never shows a success message of its own.
- Your email stays visible next to the form at all times. If the script can't load, a short message offers the email instead; if the form is slow to appear, a gentle note does the same. With JavaScript disabled, the page points to email.
- Form text and theme changes you publish in the portal appear after a reload (allow for the CDN cache interval), with no rebuild. Changing content or the site ID does need a rebuild.
- The form supports name, email and message. The page copy says the counter is walk-in and a message is an *enquiry*: nothing is booked until you reply to confirm. Don't promise booking slots, party-size fields or ordering.
- Only the Contact page loads the Jamstacks script.

**Why Contact uses full page loads:** the current shared runtime finds the form's host when its script runs and stops watching for new hosts after ten seconds; it has no public "remount" API. Links to and from Contact therefore do an ordinary full page load (all other links use fast client-side navigation), so the form appears reliably. This is handled by [components/site-link.tsx](components/site-link.tsx).

**Styling:** the page maps its design tokens to the shared `--jamstacks-*` CSS variables in [app/tailwind.input.css](app/tailwind.input.css). The form's primary colour stays the indigo in both modes, so its white button text stays readable. A theme you publish in the portal overrides these on the component itself. Don't style the component's internals; they're owned by the runtime.

**Content Security Policy:** none is set by this template. If you add one, allow scripts from your Jamstacks CDN origin, the spam-check provider used by the form (`https://challenges.cloudflare.com` for scripts and frames), `connect-src` to the API origin your published form uses, and `frame-src https://www.google.com` for the map. Inline structured data and the theme script also need a nonce or hash. Avoid wildcards and `unsafe-eval`.

## Deploy to GitHub Pages

The workflow at [.github/workflows/pages.yml](.github/workflows/pages.yml) tests, type-checks, builds and deploys on every push to `main`, validates pull requests without deploying, and can be run manually.

1. Push this repository to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Optional: **Settings → Secrets and variables → Actions → Variables**: add `JAMSTACKS_SITE`, `JAMSTACKS_CDN_URL`, `SITE_DOMAIN`. These are *variables*, not secrets: they're public.
4. Push to `main` or run the workflow from the Actions tab.

The site works at `https://<owner>.github.io/<repository>/`; the workflow reads the correct path prefix from GitHub. To preview a project-path build locally:

```sh
PAGES_BASE_PATH=/izakaya-preview npm run build
node scripts/serve.mjs --base /izakaya-preview   # http://localhost:3000/izakaya-preview/
```

**Custom domain:** set it in **Settings → Pages → Custom domain** and create the DNS records GitHub shows you, then put the same hostname in `site.config.json`'s `domain`. Don't add a `public/CNAME` file: deployments from GitHub Actions ignore it.

**Jamstacks provisioning:** if Jamstacks created this repository for you, it already enabled Pages, set the repository variables and started the first run. Its runs appear as `Jamstacks <operation id>` (the workflow's optional `provisioning_id` input). Keep the workflow's file path, inputs and run name if you edit it.

## Local Jamstacks development

For working against a locally running Jamstacks service (portal at `https://localhost:5001`, assets at `https://localhost:5001/_cdn`):

```sh
JAMSTACKS_SITE=site_… \
NEXT_PUBLIC_JAMSTACKS_CDN_URL=https://localhost:5001/_cdn \
JAMSTACKS_ALLOW_LOCAL_CDN=1 npm run dev
```

This website uses Next.js's default port 3000. Trust the local development certificate in your browser and register `http://localhost:3000` as an allowed origin for the website in the portal; the service refuses submissions from origins it doesn't know.

## Project structure

```
app/                    routes, metadata, sitemap/robots, global styles, tokens and generated fonts.css
components/             header and footer noren, noren hero, lantern, section dividers, menu tags and wall,
                        osusume strips, skewer drawings, robata, tokkuri scale and sake list, Jamstacks host/loader
content/                izakaya.ts, menu.ts and drinks.ts: your content
lib/config.mjs          build-time public config resolution and validation
lib/hours.ts            opening hours, late nights, last order and tonight's status
lib/skewer.ts           skewers drawn from their pieces
lib/menu-filter.ts      vegetarian, vegan, no raw and no shellfish filters
lib/paths.ts            base-path-aware links and asset URLs
lib/structured-data.ts  schema.org Restaurant data
lib/time-zone.ts        readable time zone names for the hours
lib/maps.ts             Google Maps embed, search and directions URLs
lib/embed-status.ts     observable states of the hosted form
types/                  typed JSX for <jamstacks-support-form>
public/                 social preview image
scripts/serve.mjs       static preview server (with base path support)
scripts/fonts.mjs       regenerates app/fonts.css from the Fontsource packages
tests/                  node:test suites
site.config.json        public deployment settings (provisioner-compatible)
jamstacks/              optional template publishing metadata and gallery captures
```

## Before publishing your website

- Replace Izakaya Tsukiakari (`name`, `nameJa` and `site.config.json`'s `name`), the story, address (and its `note`), directions, parking, email, phone, menu, osusume, prices, sake list, drinks, seating, otōshi, FAQs and social links with your own details.
- Set your real opening hours (late nights as `closes: '01:00'`), `lastOrderMinutes` and `timeZone` in `site.config.json`, and check the status line on the home page.
- Check the drinking age and the age policy in the FAQs match your licence and local law.
- Replace the demo `domain` in `site.config.json` with your own (or set the correct Pages URL), and update the site title/description, icon and social preview image.
- Run `npm run check` and a project-path build when using a repository URL.
- Check the pages on phone and desktop, in light and dark, with keyboard navigation and the Contact fallback.
- If you connect Jamstacks, publish the form in the portal and verify a real test message reaches the website inbox. A successful build does not verify message delivery.

`AGENTS.md` gives coding assistants the same architecture and editing guidance.

## Optional template publishing folder

`jamstacks/` is used only to publish this source template in the Jamstacks gallery:

```text
jamstacks/config.json       template metadata and screenshot paths
jamstacks/screenshots.json  capture viewport, hashes and sizes
jamstacks/home-light.jpg    light homepage preview
jamstacks/home-dark.jpg     dark homepage preview
jamstacks/config.test.mjs   source-template publishing checks
```

Run `node --test jamstacks/config.test.mjs` when maintaining the source template.
When creating a customer website, the whole `jamstacks/` folder can be removed.
Nothing in the website code, normal `npm test`, type checking, builds or the Pages workflow imports or reads it.
Keep `site.config.json`, the website's embed integration and `.github/workflows/pages.yml`;
these belong to the customer website and continue to work without gallery metadata.
