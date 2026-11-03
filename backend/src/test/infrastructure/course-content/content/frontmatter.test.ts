import { describe, expect, it } from "vitest";

import {
  FrontmatterError,
  parseFrontmatter,
} from "@/infrastructure/course-content/content/frontmatter";

describe("parseFrontmatter", () => {
  it("splits the YAML from the markdown body", () => {
    const parsed = parseFrontmatter("---\nposition: 2\nstyle: visual\n---\n\n# Title\n\nText.\n");
    expect(parsed).toEqual({ data: { position: 2, style: "visual" }, body: "# Title\n\nText." });
  });

  it("reads a multi-line transcript", () => {
    const parsed = parseFrontmatter("---\ntranscript: |\n  Line one\n  Line two\n---\nBody");
    expect(parsed.data).toEqual({ transcript: "Line one\nLine two\n" });
  });

  it("allows an empty body", () => {
    expect(parseFrontmatter("---\nposition: 1\n---").body).toBe("");
  });

  it("rejects a file with no frontmatter", () => {
    expect(() => parseFrontmatter("# Just markdown")).toThrow(FrontmatterError);
  });

  it("rejects frontmatter that isn't valid YAML", () => {
    expect(() => parseFrontmatter("---\nposition: [1\n---\nBody")).toThrow(/not valid YAML/);
  });
});
