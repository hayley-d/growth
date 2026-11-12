import { satteri } from "@astrojs/markdown-satteri";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightSidebarTopics from "starlight-sidebar-topics";

import { citationLinks } from "./src/plugins/citation-links";

export default defineConfig({
  site: "https://hayley-d.github.io",
  base: "/growth",
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
        starlightSidebarTopics(
          [
            {
              label: "Learn the trees",
              link: "/learn/trees/",
              icon: "open-book",
              items: [{ label: "Trees covered", slug: "learn/trees" }],
            },
            {
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
                { label: "Learners", slug: "id/learners" },
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
                        {
                          label: "Lesson 7: Height and balance factor",
                          slug: "id/storyboards/lessons/height-and-balance",
                        },
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
                { label: "Evaluation", slug: "id/evaluation" },
                { label: "GenAI acknowledgment", slug: "id/genai" },
              ],
            },
            {
              label: "Work on the code",
              link: "/dev/getting-started/",
              icon: "seti:config",
              items: [
                { label: "Getting started", slug: "dev/getting-started" },
                {
                  label: "Architecture",
                  items: [
                    { label: "Backend", slug: "dev/architecture/backend" },
                    { label: "Frontend", slug: "dev/architecture/frontend" },
                    { label: "Shared", slug: "dev/architecture/shared" },
                  ],
                },
                {
                  label: "Reference",
                  items: [
                    { label: "API reference", slug: "dev/reference/api" },
                    { label: "Scripts and tooling", slug: "dev/reference/scripts" },
                    { label: "Branches and commits", slug: "dev/reference/git-workflow" },
                  ],
                },
              ],
            },
          ],
          { exclude: ["/index"] },
        ),
      ],
    }),
  ],
});
