// Everything listed on the site. See README.md for the fields each entry takes.
window.SITE = {
  experience: [
    { role: 'swe', org: 'garner health', href: 'https://garnerhealth.com', when: 'feb 2026 – present' },
    { role: 'swe', org: 'pupil', href: 'https://getpupil.com', when: 'oct 2023 – may 2024' },
    { role: 'it', org: 'nyu', href: 'https://as.nyu.edu/administrative-resources/office/cit.html', when: 'feb 2022 – may 2024' },
  ],

  // Newest first.
  projects: [
    {
      name: 'personal website',
      about: 'you are here',
      tags: ['html', 'css', 'javascript', 'canvas', 'claude', 'cursor'],
      links: { repo: 'https://github.com/wovensoul/personal-website' },
    },
    {
      name: 'sales insights agent',
      about: 'multi-agent for data analytics and forecasts',
      tags: ['python', 'google adk', 'vertex ai', 'bigquery', 'bqml'],
      links: { repo: 'https://github.com/wovensoul/sales-insights-agent' },
    },
    {
      name: 'sales analytics',
      about: 'rest api to manage and analyze sales',
      tags: ['java', 'spring boot', 'spring jpa', 'hibernate', 'maven'],
      links: { repo: 'https://github.com/wovensoul/sales-analytics' },
    },
    {
      name: 'matcha generator',
      about: 'an ai-powered web app that generates matcha recipes',
      tags: ['next.js', 'react', 'tsx', 'docker'],
      links: { demo: 'https://matcha-generator.vercel.app', repo: 'https://github.com/wovensoul/matcha-generator' },
    },
    {
      name: 'matchaluv',
      about: 'a matcha centric social media app',
      tags: ['flutter', 'firebase'],
      links: { repo: 'https://github.com/wovensoul/matchaluv' },
    },
    {
      name: 'personal blog',
      about: 'a blog implementing headless cms with automatic builds and deploys',
      tags: ['vue', 'strapi', 'render'],
    },
  ],

  // Geometrized pictures beside the name, per tab. A tab with more than one cycles through them.
  art: {
    home: [{
      label: 'A cat in a pink hat, drawn with triangles', src: 'art/happy_cat.png', cache: 'art/happy_cat.shapes.json',
      gif: 'art/happy_cat_once.gif', gifMs: 5600, endCache: 'art/happy_cat_end.shapes.json',
    }],
    about: [
      { label: 'A magnolia blossom, drawn with triangles', src: 'art/magnolia.webp', cache: 'art/magnolia.shapes.json', photo: 'art/magnolia.webp' },
      { label: 'Painted paper lanterns, drawn with triangles', src: 'art/lanterns.webp', cache: 'art/lanterns.shapes.json', photo: 'art/lanterns.webp' },
    ],
  },
};
