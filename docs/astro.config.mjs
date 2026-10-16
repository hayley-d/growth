import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightSidebarTopics from "starlight-sidebar-topics";

export default defineConfig({
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
