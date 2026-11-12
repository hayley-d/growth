import type { Link, Nodes, Text } from "mdast";
import { defineMdastPlugin, type MdastVisitorContext } from "satteri";

const referencesHeading = "references";
const citationPattern =
  /([A-Z][\w.'’&-]*(?: [A-Z][\w.'’&-]*)*)(?:,? (?:and|&) [A-Z][\w'’-]*| et al\.)?, (\d{4}[a-z]?|n\.d\.?)/g;
const entryPattern = /^(.+?) \((\d{4}[a-z]?|n\.d\.?)\)/;
const skippedTypes = new Set(["link", "linkReference", "inlineCode", "code", "heading", "html"]);

function referenceKey(firstAuthor: string, year: string): string {
  const slug = `${firstAuthor}-${year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `reference-${slug}`;
}

function firstAuthorOfEntry(authors: string): string {
  return authors.split(",")[0].split(" and ")[0].trim();
}

function citationNodes(text: string, keys: Set<string>): (Text | Link)[] | undefined {
  const nodes: (Text | Link)[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(citationPattern)) {
    const key = referenceKey(match[1], match[2]);
    if (!keys.has(key)) {
      continue;
    }
    if (match.index > lastIndex) {
      nodes.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    nodes.push({ type: "link", url: `#${key}`, children: [{ type: "text", value: match[0] }] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex === 0) {
    return undefined;
  }
  if (lastIndex < text.length) {
    nodes.push({ type: "text", value: text.slice(lastIndex) });
  }
  return nodes;
}

function linkCitations(
  node: Readonly<Nodes>,
  keys: Set<string>,
  context: MdastVisitorContext,
): void {
  if (skippedTypes.has(node.type)) {
    return;
  }
  if (node.type === "text") {
    const replacement = citationNodes(node.value, keys);
    if (replacement) {
      context.replaceNode(node, replacement);
    }
    return;
  }
  if ("children" in node) {
    for (const child of node.children) {
      linkCitations(child, keys, context);
    }
  }
}

export const citationLinks = defineMdastPlugin({
  name: "citation-links",
  before(root, context) {
    const nodes = root.children;
    const headingIndex = nodes.findIndex(
      (node) =>
        node.type === "heading" &&
        node.depth === 2 &&
        context.textContent(node).trim().toLowerCase() === referencesHeading,
    );
    if (headingIndex === -1) {
      return;
    }
    const keys = new Set<string>();
    for (const node of nodes.slice(headingIndex + 1)) {
      if (node.type === "heading") {
        break;
      }
      if (node.type !== "paragraph") {
        continue;
      }
      const match = context.textContent(node).match(entryPattern);
      if (!match) {
        continue;
      }
      const key = referenceKey(firstAuthorOfEntry(match[1]), match[2]);
      if (keys.has(key)) {
        continue;
      }
      keys.add(key);
      context.setProperty(node, "data", { hProperties: { id: key } });
    }
    for (const node of nodes.slice(0, headingIndex)) {
      linkCitations(node, keys, context);
    }
  },
});
