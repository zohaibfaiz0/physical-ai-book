// @ts-check
// `@ts-check` enables ts-error checking for the config file

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Physical AI and Humanoid Robotics',
  tagline: 'From Embodiment to Real-World Intelligence',
  url: 'https://zohaibfaiz0.github.io',
  baseUrl: '/physical-ai-book/',
  onBrokenLinks: 'warn', // Changed to 'warn' for GitHub Pages deployment
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.svg',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/zohaibfaiz0/physical-ai-book',
        },
        blog: false, // Disable blog if not needed
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Physical AI & Humanoid Robotics',
        logo: {
          alt: 'Physical AI and Humanoid Robotics Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            to: 'https://github.com/zohaibfaiz0/physical-ai-book',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'html',
            position: 'right',
            value: '<div class="navbar__item--rag-status"><span class="rag-status-indicator"></span>RAG Active</div>',
          },
          {
            type: 'html',
            position: 'right',
            value: '<div id="navbar-chat-container"></div>',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Introduction',
                to: '/docs/intro',
              },
              {
                label: 'Week 1-2: Foundations',
                to: '/docs/chapters/01-weeks-1-2-foundations/',
              },
              {
                label: 'Week 3-5: ROS2',
                to: '/docs/chapters/02-weeks-3-5-ros2/',
              },
            ],
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'GitHub Repository',
                href: 'https://github.com/zohaibfaiz0/physical-ai-book',
              },
              {
                label: 'Docusaurus',
                href: 'https://docusaurus.io',
              },
            ],
          },
          {
            title: 'Built with AI',
            items: [
              {
                label: 'Gemini 2.5 Flash',
                href: 'https://deepmind.google/technologies/gemini/',
              },
              {
                label: 'Qdrant Vector DB',
                href: 'https://qdrant.tech',
              },
              {
                label: 'Neon Postgres',
                href: 'https://neon.tech',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Physical AI and Humanoid Robotics Book. Built with Docusaurus. <div class="footer__rag-stats">RAG Queries Served: <span id="rag-queries-count">∞</span> | Live Status: <span class="rag-status-indicator"></span> Active</div>`,
      },
      prism: {
        theme: require('prism-react-renderer/themes/github'),
        darkTheme: require('prism-react-renderer/themes/dracula'),
      },
    }),

  scripts: [
    {
      src: '/js/navbar-chat.js',
      async: true,
    },
  ],
  plugins: [
    // Enable global MDX components
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 80,
        max: 1030, // max resized image's size.
        min: 640, // min resized image's size. if original is lower, use that size.
        steps: 2, // the max number of images generated between min and max (inclusive)
        disableInDev: false,
      },
    ],
  ],

  themes: [
    // Local search plugin configuration
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        language: ["en"],
        docsDir: "docs",
        docsRouteBasePath: "/",
        blogDir: "blog",
        blogRouteBasePath: "/blog/",
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        searchBarPosition: "navbar",
        searchBarShortcut: true,
      },
    ],
  ],

};

module.exports = config;