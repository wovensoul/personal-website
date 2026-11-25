# personal website

[jeffreychen.work](https://jeffreychen.work)

v2: an animated delaunay triangle background, crystal panels, and geometrized art, in plain html, css and javascript with no framework and no build step.

v1, the vue + tailwind version, is on the [`v1`](https://github.com/wovensoul/personal-website/tree/v1) branch and tagged [`v1.0.0`](https://github.com/wovensoul/personal-website/releases/tag/v1.0.0).

## running it locally

from the repo root:

```sh
python -m http.server 8126
```

then open <http://localhost:8126/site/>. add `?debug` to the url to show the settings panel (background tuning) and the triangle count under the art. both are hidden from visitors.

## layout

| path | what it is |
| --- | --- |
| `site/index.html` | the page: markup, styles, the background mesh, and the art player |
| `site/content.js` | everything listed on the site: experience, projects, and art |
| `site/components.js` | the building blocks that turn `content.js` into markup |
| `site/art/` | pictures and their saved triangle runs |
| `site/resume.pdf` | linked from the nav |
| `tools/make-art.html` | turns a photo into a new art entry (not deployed) |

## adding things

most changes only touch `site/content.js`. entries show in the order they're listed, so put newer ones first.

### experience

```js
{ role: 'swe', org: 'garner health', href: 'https://garnerhealth.com', when: 'feb 2026 – present' },
```

shows as **swe** @ garner health, with the dates on the right. `href` is optional; without it the company name is plain text.

### projects

```js
{
  name: 'matcha generator',
  about: 'an ai-powered web app that generates matcha recipes',
  tags: ['next.js', 'react', 'tsx', 'docker'],
  links: { demo: 'https://matcha-generator.vercel.app', repo: 'https://github.com/wovensoul/matcha-generator' },
},
```

`about` is one short lowercase line in the same style as the others. `tags` are joined with ` · `. each key in `links` becomes a link labelled with that key, in the order given; leave out `links` for none.

### art

the pictures beside the name are listed per tab under `art`. a tab with more than one picture cycles through them on click and every 10 seconds.

1. run the local server and open <http://localhost:8126/tools/make-art.html>.
2. pick the photo, which part of it to keep (it's cropped to a square), and a short name like `lanterns`.
3. click make. it builds the triangles with the site's own settings and downloads `name.webp` and `name.shapes.json`.
4. put both files in `site/art/` and add an entry:

```js
{ label: 'Painted paper lanterns, drawn with triangles', src: 'art/lanterns.webp', cache: 'art/lanterns.shapes.json', photo: 'art/lanterns.webp' },
```

`label` is read out by screen readers. on desktop the triangles are rebuilt live from `src`; phones and reduced motion play back `cache`. hovering shows `photo`.

the cat on the home tab is a gif instead of a photo, so it uses `gif` (a copy of the gif with its loop marker removed, so it plays once), `gifMs` (how long it plays), and `endCache` (a triangle run of the frame it fades into) in place of `photo`.

### components

`components.js` has `h(tag, attrs, ...children)` for making elements, `ExternalLink(text, href)`, `ExperienceRow`, `ProjectRow`, and `renderList(selector, items, component)`. a new kind of list is a new component plus one `renderList` call. any row with the `hoverable` class lights up its crystal panel on hover.

the about text is prose, so it's written straight into `site/index.html` (`#about-view`) rather than kept in `content.js`.

## deploys

pushes to `main` deploy `site/` to cloudflare pages; pull requests get a preview deployment with its own url.
