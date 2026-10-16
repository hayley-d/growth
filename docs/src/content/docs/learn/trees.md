---
title: Trees covered
description: The trees in Rebalance and what makes each one tricky.
---

These are the trees students usually get stuck on. For each one, here's what it is and the part that tends to trip people up.

## Suggested order

Start at the top. Each tree builds on ideas from the ones before it.

1. Binary heap
2. Trie
3. AVL tree
4. 2-3 / 2-3-4 tree
5. Red-black tree
6. Splay tree
7. Treap
8. B-tree
9. B+ tree
10. Merkle tree

## Binary heap

A tree where every parent is smaller (or bigger) than its children, stored in a plain array. **Tricky bit:** seeing how the array and the tree are the same thing, and how values sift up and down.

## Trie

A tree for words, where each step down adds one letter. **Tricky bit:** understanding why lookups depend on the word's length, not on how many words are stored.

## AVL tree

A search tree that stays balanced by checking the height of each side. **Tricky bit:** knowing which of the four rotations to use and why.

## 2-3 / 2-3-4 tree

A tree whose nodes can hold more than one key, so it grows from the root up and is always perfectly balanced. **Tricky bit:** splitting full nodes. Once this clicks, red-black trees make much more sense.

## Red-black tree

A search tree that colours each node red or black to keep itself roughly balanced. **Tricky bit:** the colour rules, and deciding when to recolour and when to rotate. It's really a 2-3-4 tree in disguise, and Rebalance shows the two side by side.

## Splay tree

A search tree that moves whatever you just used to the root. **Tricky bit:** the zig, zig-zig and zig-zag steps, and why it's fast on average even though single steps can be slow.

## Treap

A mix of a search tree and a heap. Keys stay in search order, and random priorities keep it in heap order. **Tricky bit:** seeing how the random priorities keep it balanced.

## B-tree

A wide, shallow tree built for disks, with many keys per node. **Tricky bit:** deletes, which mean borrowing from a sibling or merging nodes.

## B+ tree

Like a B-tree, but all the data sits in the leaves and the leaves are linked together. It's how databases build indexes. **Tricky bit:** why keys get copied up instead of moved, and how range scans walk the leaves.

## Merkle tree

A tree of hashes, where every parent is the hash of its children. **Tricky bit:** how one changed leaf changes every hash up to the root, and how a short proof shows that an item is in the tree.
