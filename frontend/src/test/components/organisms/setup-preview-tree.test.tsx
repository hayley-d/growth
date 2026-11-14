import { expect, it } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";

import { SetupPreviewTree } from "@/components/organisms/setup-preview-tree";
import "@/index.css";

it.each(["small", "large"] as const)(
  "keeps every %s random traversal tree inside its frame",
  async (start) => {
    await page.viewport(1280, 900);
    for (let seed = 1; seed <= 40; seed += 1) {
      const screen = await render(
        <div className="w-[46rem]">
          <SetupPreviewTree
            answers={{ topic: "traversal", traversal: "inorder", explore: "watch", start, seed }}
          />
        </div>,
      );
      const frame = screen.container.querySelector("figure > div") as HTMLElement;
      const tree = screen.container.querySelector("svg") as SVGSVGElement;
      const frameBox = frame.getBoundingClientRect();
      const treeBox = tree.getBoundingClientRect();
      expect(treeBox.bottom, `seed ${seed}`).toBeLessThanOrEqual(frameBox.bottom + 1);
      expect(treeBox.top, `seed ${seed}`).toBeGreaterThanOrEqual(frameBox.top - 1);
      await screen.unmount();
    }
  },
);
