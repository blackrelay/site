/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        void: "#000000",
        frontier: {
          orange: "#fe4700",
          danger: "#ff2a00",
        },
        panel: {
          black: "#050505",
          alt: "#0a0a0a",
        },
        border: {
          dim: "rgba(254, 71, 0, 0.24)",
          strong: "rgba(254, 71, 0, 0.72)",
        },
        text: {
          primary: "#f4f1ec",
          muted: "#9b928a",
          dim: "#625a54",
        },
        signal: {
          success: "#86efac",
          warning: "#facc15",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      boxShadow: {
        signal: "0 0 24px rgba(254, 71, 0, 0.18)",
        insetSignal: "inset 0 0 18px rgba(254, 71, 0, 0.08)",
      },
    },
  },
  plugins: [],
};
