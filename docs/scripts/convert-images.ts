import { execFileSync } from "node:child_process";
import { readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const maximumWidth = 1600;
const nearLosslessLevel = 60;

const docsDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetsDirectory = join(docsDirectory, "src", "assets");
const pagesDirectory = join(docsDirectory, "src", "content", "docs");
const imageLinkPattern = /(["'(])([^"'()\s]+\.png)(?=["')\s])/g;

async function listFiles(directory: string, extensions: string[]): Promise<string[]> {
  const entries = await readdir(directory, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && extensions.includes(extname(entry.name).toLowerCase()))
    .map((entry) => join(entry.parentPath, entry.name));
}

function isInsideAssets(path: string): boolean {
  const pathFromAssets = relative(assetsDirectory, path);
  return !pathFromAssets.startsWith("..") && pathFromAssets !== path;
}

function toWebpPath(path: string): string {
  return `${path.slice(0, -extname(path).length)}.webp`;
}

function formatKilobytes(bytes: number): string {
  return `${Math.round(bytes / 1024)} KB`;
}

async function convertImage(pngPath: string): Promise<{ before: number; after: number }> {
  const webpPath = toWebpPath(pngPath);
  const before = (await stat(pngPath)).size;
  await sharp(pngPath)
    .resize({ width: maximumWidth, withoutEnlargement: true })
    .webp({ nearLossless: true, quality: nearLosslessLevel, effort: 6 })
    .toFile(webpPath);
  await rm(pngPath);
  const after = (await stat(webpPath)).size;
  return { before, after };
}

async function rewriteLinks(convertedPaths: Set<string>): Promise<string[]> {
  const pages = await listFiles(pagesDirectory, [".md", ".mdx"]);
  const changedPages: string[] = [];
  for (const page of pages) {
    const content = await readFile(page, "utf8");
    const rewritten = content.replace(imageLinkPattern, (match, opening: string, link: string) => {
      const target = resolve(dirname(page), link);
      return convertedPaths.has(target) ? `${opening}${toWebpPath(link)}` : match;
    });
    if (rewritten !== content) {
      await writeFile(page, rewritten);
      changedPages.push(page);
    }
  }
  return changedPages;
}

async function main(): Promise<void> {
  const parameters = process.argv.slice(2);
  const shouldStage = parameters.includes("--stage");
  const requestedPaths = parameters.filter((parameter) => parameter !== "--stage");
  const pngPaths =
    requestedPaths.length > 0
      ? requestedPaths
          .map((path) => resolve(path))
          .filter((path) => extname(path).toLowerCase() === ".png" && isInsideAssets(path))
      : await listFiles(assetsDirectory, [".png"]);

  if (pngPaths.length === 0) {
    return;
  }

  let totalBefore = 0;
  let totalAfter = 0;
  for (const pngPath of pngPaths) {
    const { before, after } = await convertImage(pngPath);
    totalBefore += before;
    totalAfter += after;
    console.log(
      `${relative(docsDirectory, pngPath)}: ${formatKilobytes(before)} -> ${formatKilobytes(after)} webp`,
    );
  }

  const changedPages = await rewriteLinks(new Set(pngPaths));
  for (const page of changedPages) {
    console.log(`updated links in ${relative(docsDirectory, page)}`);
  }
  console.log(
    `${pngPaths.length} images: ${formatKilobytes(totalBefore)} -> ${formatKilobytes(totalAfter)}`,
  );

  if (shouldStage) {
    const webpPaths = pngPaths.map(toWebpPath);
    execFileSync("git", ["add", "--all", "--", ...pngPaths, ...webpPaths, ...changedPages], {
      stdio: "inherit",
    });
  }
}

await main();
