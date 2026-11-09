---
position: 7
transcript: "Why calls wait. Look at the stack when 10 is visited. preorder(20) has visited 20 and called preorder(10). It isn't finished. It's paused at line 4, waiting for preorder(10) to return. When preorder(10) is done, preorder(20) carries on at line 5 and goes right."
---

## Why calls wait

Look at the stack when 10 is visited. `preorder(20)` has visited 20 and called `preorder(10)`. It isn't finished. It's paused at line 4, waiting for `preorder(10)` to return.

When `preorder(10)` is done, `preorder(20)` carries on at line 5 and goes right.
