import { openApiDocument } from "@shared/openapi";

const target = new URL("../../docs/public/openapi.json", import.meta.url);

await Bun.write(target, `${JSON.stringify(openApiDocument, null, 2)}\n`);
