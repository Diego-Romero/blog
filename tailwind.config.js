// @ts-check
const { fontFamily } = require("tailwindcss/defaultTheme")
const colors = require("tailwindcss/colors")

/** @type {import("tailwindcss/types").Config } */
module.exports = {
  content: [
    "./node_modules/pliny/**/*.js",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.mdx",
  ],
  darkMode: "class",
  theme: {
    extend: {
      lineHeight: {
        11: "2.75rem",
        12: "3rem",
        13: "3.25rem",
        14: "3.5rem",
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", ...fontFamily.sans],
        mono: ["var(--font-space-mono)", "Space Mono", ...fontFamily.mono],
        serif: ["var(--font-lora)", "Lora", "Georgia", ...fontFamily.serif],
        code: ["var(--font-fira-code)", "Fira Code", ...fontFamily.mono],
      },
      colors: {
        primary: colors.pink,
        gray: colors.gray,
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": "var(--fg)",
            "--tw-prose-headings": "var(--fg)",
            "--tw-prose-lead": "var(--muted)",
            "--tw-prose-links": "var(--accent)",
            "--tw-prose-bold": "var(--fg)",
            "--tw-prose-counters": "var(--muted)",
            "--tw-prose-bullets": "var(--accent)",
            "--tw-prose-hr": "var(--border)",
            "--tw-prose-quotes": "var(--fg)",
            "--tw-prose-quote-borders": "var(--accent2)",
            "--tw-prose-captions": "var(--muted)",
            "--tw-prose-code": "var(--accent2)",
            "--tw-prose-pre-code": "var(--fg)",
            "--tw-prose-pre-bg": "var(--code-bg)",
            "--tw-prose-th-borders": "var(--border)",
            "--tw-prose-td-borders": "var(--border)",
            maxWidth: "none",
            fontFamily: "var(--font-lora), Lora, Georgia, serif",
            fontSize: "1.025rem",
            lineHeight: "1.82",
            a: {
              color: "var(--accent)",
              textDecoration: "none",
              "&:hover": {
                opacity: "0.75",
              },
            },
            "h1,h2,h3,h4,h5,h6": {
              fontFamily: "var(--font-space-mono), 'Space Mono', monospace",
              letterSpacing: "-0.02em",
            },
            h2: {
              color: "var(--accent)",
              "&::before": {
                content: '"## "',
                color: "var(--muted)",
                fontWeight: "400",
              },
            },
            h3: {
              color: "var(--accent2)",
              "&::before": {
                content: '"### "',
                color: "var(--muted)",
                fontWeight: "400",
              },
            },
            code: {
              fontFamily: "var(--font-fira-code), 'Fira Code', monospace",
              color: "var(--accent2)",
              backgroundColor: "var(--surface)",
              padding: "0.15em 0.4em",
              borderRadius: "2px",
              fontWeight: "500",
              "&::before": { content: "none" },
              "&::after": { content: "none" },
            },
            pre: {
              fontFamily: "var(--font-fira-code), 'Fira Code', monospace",
              backgroundColor: "var(--code-bg)",
              border: "1px solid var(--border)",
              borderRadius: "0",
              code: {
                backgroundColor: "transparent",
                color: "var(--fg)",
                padding: "0",
              },
            },
            blockquote: {
              borderLeftColor: "var(--accent2)",
              color: "var(--muted)",
              fontStyle: "italic",
            },
            hr: {
              borderColor: "var(--border)",
            },
            "thead th": {
              fontFamily: "var(--font-space-mono), 'Space Mono', monospace",
              color: "var(--accent)",
              borderBottomColor: "var(--border)",
            },
            "tbody td": {
              borderBottomColor: "var(--border)",
            },
          },
        },
        invert: {
          css: {
            a: {
              color: "var(--accent)",
            },
            "h1,h2,h3,h4,h5,h6": {
              color: "var(--fg)",
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
}
