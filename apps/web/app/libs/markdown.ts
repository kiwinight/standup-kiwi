import { gfmStrikethroughHtml } from "micromark-extension-gfm-strikethrough";

import { gfmAutolinkLiteralHtml } from "micromark-extension-gfm-autolink-literal";

import { gfmTaskListItemHtml } from "micromark-extension-gfm-task-list-item";

import { micromark } from "micromark";
import { gfmAutolinkLiteral } from "micromark-extension-gfm-autolink-literal";
import { gfmStrikethrough } from "micromark-extension-gfm-strikethrough";
import { gfmTaskListItem } from "micromark-extension-gfm-task-list-item";

/**
 * Process HTML to convert heading elements back to paragraph elements with # prefix.
 * @param html The HTML string from micromark
 * @returns Modified HTML with headings converted to paragraphs containing # syntax
 */
function restoreMarkdownHeadingSyntax(html: string): string {
  // Replace <h1>text</h1> with <p># text</p>
  let result = html.replace(/<h1>(.*?)<\/h1>/g, "<p># $1</p>");

  // Replace <h2>text</h2> with <p>## text</p>
  result = result.replace(/<h2>(.*?)<\/h2>/g, "<p>## $1</p>");

  // Replace <h3>text</h3> with <p>### text</p>
  result = result.replace(/<h3>(.*?)<\/h3>/g, "<p>### $1</p>");

  // Replace <h4>text</h4> with <p>#### text</p>
  result = result.replace(/<h4>(.*?)<\/h4>/g, "<p>#### $1</p>");

  // Replace <h5>text</h5> with <p>##### text</p>
  result = result.replace(/<h5>(.*?)<\/h5>/g, "<p>##### $1</p>");

  // Replace <h6>text</h6> with <p>###### text</p>
  result = result.replace(/<h6>(.*?)<\/h6>/g, "<p>###### $1</p>");

  return result;
}

export function parseMarkdownToHtml(text: string) {
  // Convert single newlines to hard breaks (better UX for non-markdown users)
  const processedText = text.replace(/\n/g, '  \n');

  return restoreMarkdownHeadingSyntax(
    micromark(processedText, {
      extensions: [gfmTaskListItem(), gfmAutolinkLiteral(), gfmStrikethrough()],
      htmlExtensions: [
        gfmTaskListItemHtml(),
        gfmAutolinkLiteralHtml(),
        gfmStrikethroughHtml(),
      ],
    })
  );
}
