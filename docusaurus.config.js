// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

// process.env.VERCEL_URL

let siteURL = "https://platform.noteable.io";

if (process.env.VERCEL_URL) {
  siteURL = `https://${process.env.VERCEL_URL}`;
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Noteable Platform",
  tagline: "Data Driven Documents for Developers",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: siteURL,
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
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
        },
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
      metadata: [{ name: "twitter:site", content: "@noteable_io" }],
      navbar: {
        title: "Noteable Developer Platform",
        logo: {
          alt: "Noteable",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "docSidebar",
            position: "left",
            label: "Docs",
          },
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
          {
            title: "Docs",
            items: [
              {
                label: "Introduction",
                to: "/docs/intro",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Noteable Community",
                href: "https://community.noteable.io",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/noteable_io",
              },
            ],
          },
          {
            title: "Platform",
            items: [
              {
                label: "Noteable App",
                href: "https://app.noteable.io",
              },
              {
                label: "Developer Blog",
                to: "/blog",
              },
              {
                label: "GitHub",
                href: "https://github.com/noteable-io",
              },
            ],
          },
          {
            title: "Noteable",
            items: [
              {
                label: "Home",
                href: "https://noteable.io",
              },
              {
                label: "Product Blog",
                to: "https://noteable.io/blog",
              },
              {
                label: "Pricing",
                href: "https://noteable.io/pricing",
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
