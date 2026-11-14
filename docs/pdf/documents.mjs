import { copyFile, mkdir } from "node:fs/promises";
import astroPdf from "astro-pdf";

import { combineDocument } from "./combine-document.mjs";

export const base = "/growth";

const documents = {
  se: {
    start: "/se/introduction/",
    include: `${base}/se/`,
    exclude: `${base}/se/api/`,
    output: "/growth-se.pdf",
    title: "Growth: Software Engineering document",
  },
  id: {
    start: "/id/introduction/",
    include: `${base}/id/`,
    exclude: null,
    output: "/growth-id.pdf",
    title: "Growth: Instructional Design document",
  },
  api: {
    start: "/se/api/",
    include: `${base}/se/api/`,
    exclude: null,
    output: "/growth-api.pdf",
    title: "Growth: API reference",
  },
};

export const pdfDocumentName = process.env.PDF;

export function pdfIntegration() {
  if (!pdfDocumentName) return undefined;
  const document = documents[pdfDocumentName];
  if (!document) {
    throw new Error(
      `PDF must be one of ${Object.keys(documents).join(", ")}, not ${pdfDocumentName}`,
    );
  }
  const date = new Date().toISOString().slice(0, 10);
  return astroPdf({
    runAfter: async (directory) => {
      const target = new URL("../dist-pdf/", import.meta.url);
      await mkdir(target, { recursive: true });
      await copyFile(
        new URL(document.output.slice(1), directory),
        new URL(document.output.slice(1), target),
      );
    },
    launch: process.env.PDF_NO_SANDBOX ? { args: ["--no-sandbox"] } : {},
    pages: {
      [`${base}${document.start}`]: {
        path: document.output,
        waitUntil: "networkidle0",
        navTimeout: 120_000,
        throwOnFail: true,
        callback: async (page) => {
          await page.evaluate(combineDocument, {
            include: document.include,
            exclude: document.exclude,
            title: document.title,
            subtitle: `COS750 · built from the docs site on ${date}`,
          });
        },
        pdf: {
          format: "A4",
          printBackground: true,
          outline: true,
          tagged: true,
          timeout: 300_000,
          displayHeaderFooter: true,
          headerTemplate: "<div></div>",
          footerTemplate:
            '<div style="width:100%;font-size:8px;text-align:center;color:#666"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
          margin: { top: "18mm", bottom: "18mm", left: "14mm", right: "14mm" },
        },
      },
    },
  });
}
