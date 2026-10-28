import type { AvlNode } from "@shared/avl/src/avl-tree";

const emptyMarker = "#";
const separator = ",";

const encodeTokens = (node: AvlNode | null, tokens: string[]): string[] => {
  if (!node) {
    tokens.push(emptyMarker);
    return tokens;
  }
  tokens.push(String(node.key));
  encodeTokens(node.left, tokens);
  encodeTokens(node.right, tokens);
  return tokens;
};

export const encodeTree = (root: AvlNode | null): string => encodeTokens(root, []).join(separator);

export class TreeEncodingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TreeEncodingError";
  }
}

export const maxTreeNodes = 1000;

export const decodeTree = (text: string): AvlNode | null => {
  const tokens = text.split(separator);
  if (tokens.length > maxTreeNodes * 2 + 1) {
    throw new TreeEncodingError(`Encoded tree has more than ${maxTreeNodes} nodes`);
  }
  let index = 0;
  const read = (): AvlNode | null => {
    const token = tokens[index];
    if (token === undefined) throw new TreeEncodingError(`Encoded tree "${text}" ends too early`);
    index += 1;
    if (token === emptyMarker) return null;
    const key = Number(token);
    if (!Number.isFinite(key) || String(key) !== token) {
      throw new TreeEncodingError(`Encoded tree "${text}" has an invalid key "${token}"`);
    }
    const left = read();
    const right = read();
    return { key, left, right, height: 1 + Math.max(left?.height ?? 0, right?.height ?? 0) };
  };
  const root = read();
  if (index !== tokens.length) {
    throw new TreeEncodingError(`Encoded tree "${text}" has extra values`);
  }
  return root;
};
