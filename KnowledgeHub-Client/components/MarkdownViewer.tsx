import { MarkdownAsync } from "react-markdown";
import { remarkPlugins, rehypePlugins } from "@/lib/markdown";

/**
 * Server-only markdown renderer. Uses react-markdown's <MarkdownAsync> so the
 * async, Shiki-based rehype-pretty-code plugin can run at build time. Shiki
 * never reaches the client bundle, and there is no dangerouslySetInnerHTML.
 */
export default function MarkdownViewer({ children }: { children: string }) {
  return (
    <MarkdownAsync remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
      {children}
    </MarkdownAsync>
  );
}
