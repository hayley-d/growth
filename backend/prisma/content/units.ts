import type { UnitContent } from "@/infrastructure/course-content/content/content-schema";

export default [
  { key: "binary-trees", position: 1, title: "Binary trees and traversals", treeMode: "bst" },
  { key: "avl-trees", position: 2, title: "AVL trees" },
] satisfies UnitContent[];
