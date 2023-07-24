// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Noteable Platform",
  tagline: "Data Driven Documents for Developers",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://platform.noteable.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "noteable-io", // Usually your GitHub org/user name.
  projectName: "platform-site", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        // docs: {
        //   sidebarPath: require.resolve("./sidebars.js"),
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        // },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: "https://github.com/..."
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        googleTagManager: {
          containerId: "GTM-P7TZQLM",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      image: "img/noteable-platform-social-card.png",
      metadata: [
        {
          name: "keywords",
          content: "jupyter, python, llm, chatgpt, developer, blog",
        },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@noteable_io" },
        { name: "twitter:title", content: "Noteable Platform" },
        {
          name: "twitter:description",
          content:
            "Resources for developers working with Noteable notebook and LLM functionality",
        },
        { name: "twitter:image", content: "/img/docusaurus-social-card.jpg" },
        { name: "og:title", content: "Noteable Platform" },
        {
          name: "og:description",
          content:
            "Resources for developers working with Noteable notebook and LLM functionality",
        },
      ],
      navbar: {
        title: "Noteable Developer Platform",
        logo: {
          alt: "Noteable",
          src: "img/logo.svg",
        },
        items: [
          // {
          //   type: "docSidebar",
          //   sidebarId: "tutorialSidebar",
          //   position: "left",
          //   label: "Tutorial",
          // },
          { to: "/blog", label: "Blog", position: "left" },
          {
            href: "https://github.com/noteable-io",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          // {
          //   title: "Docs",
          //   items: [
          //     {
          //       label: "Tutorial",
          //       to: "/docs/intro",
          //     },
          //   ],
          // },
          {
            title: "Community",
            items: [
              {
                label: "Twitter",
                href: "https://twitter.com/noteable_io",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "App",
                href: "https://app.noteable.io",
              },
              {
                label: "Blog",
                to: "/blog",
              },
              {
                label: "GitHub",
                href: "https://github.com/noteable-io",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Noteable, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
