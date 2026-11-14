import { satteri } from "@astrojs/markdown-satteri";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightOpenAPI, { openAPISidebarGroups } from "starlight-openapi";
import starlightSidebarTopics from "starlight-sidebar-topics";

import { pdfIntegration } from "./pdf/documents.mjs";
import { citationLinks } from "./src/plugins/citation-links";

export default defineConfig({
  site: "https://hayley-d.github.io",
  base: "/growth",
  ...(process.env.PDF ? { outDir: `./.pdf-build/${process.env.PDF}` } : {}),
  markdown: {
    processor: satteri({ mdastPlugins: [citationLinks] }),
  },
  vite: {
    ssr: {
      external: ["satteri"],
    },
  },
  integrations: [
    starlight({
      title: "Growth",
      plugins: [
        starlightOpenAPI([
          {
            base: "se/api",
            schema: "./public/openapi.json",
            sidebar: {
              label: "API reference",
              collapsed: true,
              operations: { badges: true },
            },
          },
        ]),
        starlightSidebarTopics(
          [
            {
              id: "se",
              label: "SE document",
              link: "/se/introduction/",
              icon: "document",
              items: [
                { label: "Introduction", slug: "se/introduction" },
                { label: "Approach", slug: "se/approach" },
                { label: "Requirements", slug: "se/requirements" },
                { label: "Architecture", slug: "se/architecture" },
                { label: "Detailed design", slug: "se/design" },
                { label: "UI design", slug: "se/ui" },
                { label: "Quality and testing", slug: "se/testing" },
                ...openAPISidebarGroups,
                { label: "Deployment and running", slug: "se/deployment" },
                { label: "Risks and limitations", slug: "se/risks" },
              ],
            },
            {
              label: "ID document",
              link: "/id/introduction/",
              icon: "pencil",
              items: [
                { label: "Introduction", slug: "id/introduction" },
                { label: "Analysis", slug: "id/learners" },
                { label: "Approach", slug: "id/approach" },
                { label: "Learning objectives", slug: "id/objectives" },
                { label: "Learning theories", slug: "id/theories" },
                { label: "Learning styles", slug: "id/learning-styles" },
                { label: "Content design", slug: "id/content" },
                { label: "Presentation design", slug: "id/presentation" },
                {
                  label: "Storyboards",
                  items: [
                    {
                      label: "Lessons",
                      items: [
                        {
                          label: "What is a binary tree",
                          slug: "id/storyboards/lessons/binary-tree",
                        },
                        { label: "Traversals", slug: "id/storyboards/lessons/traversals" },
                        { label: "Rotations", slug: "id/storyboards/lessons/rotations" },
                      ],
                    },
                    {
                      label: "Assessment",
                      items: [
                        {
                          label: "Question types",
                          slug: "id/storyboards/assessment/question-types",
                        },
                      ],
                    },
                    {
                      label: "Playground",
                      items: [
                        { label: "Playground page", slug: "id/storyboards/playground/playground" },
                        { label: "Code trace", slug: "id/storyboards/playground/code-trace" },
                        { label: "Step player", slug: "id/storyboards/playground/step-player" },
                      ],
                    },
                  ],
                },
                { label: "Motivation", slug: "id/motivation" },
                { label: "Assessment", slug: "id/assessment" },
                { label: "Scaffolding", slug: "id/scaffolding" },
                { label: "Alpha and beta", slug: "id/development" },
                { label: "Evaluation", slug: "id/evaluation" },
                { label: "GenAI acknowledgment", slug: "id/genai" },
              ],
            },
          ],
          { exclude: ["/index"], topics: { se: ["/se/api", "/se/api/**/*"] } },
        ),
      ],
    }),
    pdfIntegration(),
  ],
});
