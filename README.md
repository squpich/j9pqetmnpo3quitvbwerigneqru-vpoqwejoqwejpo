# Guest Experience Audit — Stage 1

This package contains the first development stage of the website:

- complete project structure;
- complete `index.html`;
- complete translation files for English, Ukrainian and European Portuguese;
- foundational CSS architecture;
- base JavaScript for navigation, reveal animations, form validation and language switching.

## Run locally

Because translations are loaded with `fetch()`, open the project through a local web server instead of double-clicking `index.html`.

### Python

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Replace before launch

Search the project for these placeholders:

- `+351000000000`
- `hello@example.com`
- `Founder photo placeholder`

## Form

The form currently validates in the browser and shows a success state. It does not yet send data anywhere.

In a later stage, connect it to one of:

- Formspree
- Netlify Forms
- Supabase
- a custom backend endpoint

## Languages

Translation files:

- `lang/en.json`
- `lang/uk.json`
- `lang/pt-PT.json`

All user-facing content is connected through:

- `data-i18n`
- `data-i18n-placeholder`
- `data-i18n-aria`
- `data-i18n-content`

## Next stage

- final polish of the visual system;
- real image assets;
- advanced responsive refinements;
- final motion tuning;
- form integration;
- SEO files and production metadata.

## Stage 2 additions

- refined interaction and hover states;
- active navigation highlighting;
- accessible mobile menu body locking;
- exclusive FAQ accordion behaviour;
- stronger form error states;
- staggered reveal animation;
- custom guest-journey and immediate-fixes SVG visuals;
- additional mobile and tablet refinements.

## Stage 3 additions

- separated JavaScript into configuration, language, interface and form modules;
- robust asynchronous form submission architecture;
- demo mode and live endpoint mode;
- loading, success and failure states;
- abort timeout for slow form requests;
- improved keyboard and Escape behaviour for mobile navigation;
- analytics-ready custom browser events;
- centralised phone, email and WhatsApp configuration;
- translation caching and fallback behaviour;
- smooth anchor navigation with reduced-motion support;
- form integration documentation.

## Stage 4 additions

- final SEO and social metadata;
- structured data for LocalBusiness and ProfessionalService;
- canonical and hreflang placeholders;
- robots.txt and sitemap.xml;
- web manifest and favicon;
- final logo asset;
- custom 404 page;
- Netlify deployment configuration;
- security headers;
- print styles;
- production launch checklist.

This is the final packaged MVP codebase.
