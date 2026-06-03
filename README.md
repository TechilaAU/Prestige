# Prestige Concreting Whitsundays — Website

Production-ready static website for **Prestige Concreting Whitsundays** (Brad).
Plain HTML/CSS/JS — no build step, no framework, no dependencies to install.
Built from the Claude Design prototype and productionised: clean URLs, full SEO,
working contact form, generated favicons + social image.

---

## 1. What's in here

```
/                       Home
/services/              Services + FAQ
/about/                 About Brad
/contact/               Contact + quote form
/brand/                 Internal brand guide (noindex — not in sitemap)
404.html                Custom not-found page
robots.txt              Crawler rules → points to sitemap, blocks /brand/
sitemap.xml             4 public pages
site.webmanifest        PWA / install metadata
netlify.toml            Netlify config (404 + security + cache headers)
assets/
  css/tokens.css        Design tokens (colours, type, spacing)
  css/prestige.css      Site styles
  js/site.js            Menu, scroll reveal, quote form  ← EDIT FORM CONFIG HERE
  img/                  Logo, favicons, OG image, truck photo, gallery tiles
    work/               Gallery placeholders (work-1.svg … work-5.svg)
```

Pages use **relative links**, so the site works at a domain root *or* in a
subfolder without changes.

---

## 2. Before you go live — 3 quick edits

### a) Set the real domain (for SEO tags)
The canonical URLs, Open Graph tags, `sitemap.xml`, `robots.txt` and JSON-LD
currently use `https://prestigeconcretingwhitsundays.com.au`. Find & replace
that string across all files with the real domain:

```bash
grep -rl "prestigeconcretingwhitsundays.com.au" . \
  | xargs sed -i 's#https://prestigeconcretingwhitsundays.com.au#https://YOURDOMAIN#g'
```

### b) Make the contact form send (open `assets/js/site.js`)
Two options at the top of the file:

- **Recommended — works on any host (GitHub Pages, Netlify, anything):**
  Get a free access key at <https://web3forms.com> and paste it:
  ```js
  var WEB3FORMS_KEY = "your-access-key-here";
  ```
- **Fallback (no key):** leave the key blank and set Brad's email:
  ```js
  var BUSINESS_EMAIL = "brad@example.com";
  ```
  Submitting then opens the visitor's email app with the details pre-filled.

> Alternative: if you host on **Netlify** you can use Netlify Forms instead —
> add `name="quote" data-netlify="true"` to the `<form>` and a hidden
> `<input type="hidden" name="form-name" value="quote">`. (Web3Forms is simpler
> and host-agnostic, so it's the default.)

### c) Add real job photos (optional but recommended)
The home gallery ships with branded "photo coming soon" placeholders. Replace
the five files in `assets/img/work/` with real photos — **keep the same
filenames** and it just works:
`work-1` driveway · `work-2` exposed aggregate · `work-3` slab ·
`work-4` patio · `work-5` coloured. (JPG/PNG/WebP fine — update the `src`
extension in `index.html` if you don't use `.svg`.)
The About page already uses the real truck photo (`assets/img/truck.jpg`).

---

## 3. Deploying

### Netlify (easiest)
Drag the folder onto <https://app.netlify.com/drop>, or connect the repo.
`netlify.toml` handles the 404, caching and security headers automatically.
Add your domain under **Domain settings**.

### GitHub Pages
1. Push these files to a repo.
2. **Settings → Pages →** deploy from branch (root).
3. **Use a custom domain** (Settings → Pages → Custom domain). A custom domain
   serves the site at the root so all links resolve cleanly. Add a file named
   `CNAME` containing just your domain, e.g. `www.prestigeconcretingwhitsundays.com.au`.
   GitHub serves `404.html` automatically.

> Note: at a project URL like `username.github.io/repo/` the site still works
> (links are relative), but `sitemap.xml`/canonicals expect a real domain —
> use a custom domain for production.

### Any other host
Upload the folder as-is to any static host / web server. Folder URLs
(`/services/`) resolve to their `index.html` on Apache, Nginx, Netlify, etc.

---

## 4. SEO included out of the box

- Unique `<title>` + meta description per page; canonical URLs.
- Open Graph + Twitter Card tags with a generated 1200×630 share image.
- JSON-LD structured data: `GeneralContractor` (LocalBusiness) on every page,
  `BreadcrumbList` on inner pages, and `FAQPage` on Services (eligible for
  Google rich results).
- `sitemap.xml`, `robots.txt`, favicons, `apple-touch-icon`, web manifest.
- Semantic headings, image `alt` text, `lang="en-AU"`, skip-link, keyboard
  focus styles, and a no-JS-safe layout (content shows even if JS is blocked).

After launch: submit the sitemap in **Google Search Console** and create/claim
a **Google Business Profile** (the single biggest lever for local trades SEO).

---

## 5. Editing content

- **Phone / licence number / hours:** these repeat in the header & footer of
  every page (and in `site.js`/JSON-LD). Find & replace `0455 205 548`,
  `0455205548`, `15008969` / `15 008 969` if anything changes.
- **Services, FAQs, copy:** plain HTML in each page file — edit directly.
- **Colours & fonts:** all in `assets/css/tokens.css` (CSS variables).
