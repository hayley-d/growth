import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightSidebarTopics from "starlight-sidebar-topics";

export default defineConfig({
  site: "https://hayley-d.github.io",
  base: "/growth",
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
                { label: "Storyboard", slug: "id/storyboard" },
                { label: "Learning objectives", slug: "id/objectives" },
                { label: "Learning theories", slug: "id/theories" },
                { label: "Learning styles", slug: "id/learning-styles" },
                { label: "Content design", slug: "id/content" },
                { label: "Presentation design", slug: "id/presentation" },
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
