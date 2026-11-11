import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Hovered = { keys: readonly number[]; term: string | null };

type TreeLinks = {
  litKeys: ReadonlySet<number>;
  litTerm: string | null;
  pinned: string | null;
  shownKeys: ReadonlySet<number>;
  hover: (hovered: Hovered | null) => void;
  togglePin: (term: string, keys: readonly number[]) => void;
  registerTree: (keys: readonly number[]) => () => void;
};

const noKeys: ReadonlySet<number> = new Set();

const TreeLinksContext = createContext<TreeLinks>({
  litKeys: noKeys,
  litTerm: null,
  pinned: null,
  shownKeys: noKeys,
  hover: () => {},
  togglePin: () => {},
  registerTree: () => () => {},
});

export function TreeLinksProvider({ children }: { children: ReactNode }) {
  const [hovered, setHovered] = useState<Hovered | null>(null);
  const [pinned, setPinned] = useState<{ term: string; keys: readonly number[] } | null>(null);
  const [trees, setTrees] = useState<readonly (readonly number[])[]>([]);

  const registerTree = useCallback((keys: readonly number[]) => {
    setTrees((current) => [...current, keys]);
    return () => setTrees((current) => current.filter((each) => each !== keys));
  }, []);

  const togglePin = useCallback((term: string, keys: readonly number[]) => {
    setPinned((current) => (current?.term === term ? null : { term, keys }));
  }, []);

  const value = useMemo<TreeLinks>(() => {
    const active = hovered ?? (pinned ? { keys: pinned.keys, term: pinned.term } : null);
    return {
      litKeys: new Set(active?.keys ?? []),
      litTerm: active?.term ?? null,
      pinned: pinned?.term ?? null,
      shownKeys: new Set(trees.flat()),
      hover: setHovered,
      togglePin,
      registerTree,
    };
  }, [hovered, pinned, trees, togglePin, registerTree]);

  return <TreeLinksContext.Provider value={value}>{children}</TreeLinksContext.Provider>;
}

export const useTreeLinks = () => useContext(TreeLinksContext);

export function useLinkedTree(keys: readonly number[]) {
  const links = useTreeLinks();
  const { registerTree } = links;
  useEffect(() => registerTree(keys), [registerTree, keys]);
  return links;
}

export const isTermLit = (
  links: Pick<TreeLinks, "litKeys" | "litTerm">,
  term: string,
  keys: readonly number[],
) => {
  if (links.litTerm !== null) return links.litTerm === term;
  return keys.some((key) => links.litKeys.has(key));
};
