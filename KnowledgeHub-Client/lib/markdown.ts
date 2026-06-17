import type { PluggableList } from "unified";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";

/**
 * Shared markdown pipeline config, used by every render (the `_index.md` body
 * and every sibling file) so output is always consistent.
 *
 * `rehype-pretty-code` is Shiki-based and async, so it can only run server-side
 * via react-markdown's <MarkdownAsync>. Dual themes emit CSS variables that we
 * switch between in globals.css based on the `.dark` class (see next-themes).
 */
const rehypePrettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark" },
  // We own the code-block background and switch token colors via CSS variables
  // (.dark) in globals.css, so disable Shiki's background and default color.
  keepBackground: false,
  defaultColor: false,
  defaultLang: "plaintext",
};

export const remarkPlugins: PluggableList = [remarkGfm];

export const rehypePlugins: PluggableList = [
  [rehypePrettyCode, rehypePrettyCodeOptions],
];
