import { defineConfig } from "astro/config";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  site: "https://xiaohao-trumpet.github.io",
  base: isProduction ? "/Theo.github.io" : undefined,
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex]
  }
});
