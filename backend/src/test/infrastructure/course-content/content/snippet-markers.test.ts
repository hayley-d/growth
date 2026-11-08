import { describe, expect, it } from "vitest";

import { parseSnippet } from "@/infrastructure/course-content/content/snippet-markers";

describe("parseSnippet", () => {
  it("turns each marker into a line and strips it from the source", () => {
    const parsed = parseSnippet("void visit() {\n  print(node); // @step preorder.visit\n}");
    expect(parsed.lines).toEqual([{ stepKey: "preorder.visit", lineNumber: 2 }]);
    expect(parsed.source).toBe("void visit() {\n  print(node);\n}");
  });

  it("reads several keys on one line", () => {
    const parsed = parseSnippet("x = 1 // @step insert.compare-left insert.go-left");
    expect(parsed.lines).toEqual([
      { stepKey: "insert.compare-left", lineNumber: 1 },
      { stepKey: "insert.go-left", lineNumber: 1 },
    ]);
  });

  it("keeps the first line for a key marked twice and reports it", () => {
    const parsed = parseSnippet("a // @step search.found\nb // @step search.found");
    expect(parsed.lines).toEqual([{ stepKey: "search.found", lineNumber: 1 }]);
    expect(parsed.duplicates).toEqual(["search.found"]);
  });

  it("leaves ordinary comments alone", () => {
    const text = "x = 1 // a normal comment\n// @steps is not a marker";
    expect(parseSnippet(text)).toEqual({
      source: text,
      lines: [],
      duplicates: [],
      emptyMarkers: [],
    });
  });

  it("reads a marker with no space or a tab after the slashes", () => {
    const parsed = parseSnippet("a //@step search.found\nb //\t@step search.missing");
    expect(parsed.lines).toEqual([
      { stepKey: "search.found", lineNumber: 1 },
      { stepKey: "search.missing", lineNumber: 2 },
    ]);
    expect(parsed.source).toBe("a\nb");
  });

  it("strips a marker with no key and reports its line", () => {
    const parsed = parseSnippet("a\nb // @step   ");
    expect(parsed.lines).toEqual([]);
    expect(parsed.emptyMarkers).toEqual([2]);
    expect(parsed.source).toBe("a\nb");
  });

  it("keeps line numbers when Windows line endings are used", () => {
    const parsed = parseSnippet("first\r\nsecond // @step search.found\r\n");
    expect(parsed.lines).toEqual([{ stepKey: "search.found", lineNumber: 2 }]);
    expect(parsed.source).toBe("first\nsecond\n");
  });
});
