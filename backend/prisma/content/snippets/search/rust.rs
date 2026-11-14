fn search(root: Option<&Node>, key: i32) -> Option<&Node> {
    let mut node = root;
    while let Some(current) = node { // @step search.check-empty
        if key == current.key { return Some(current); } // @step search.compare search.found
        if key < current.key { // @step search.check-smaller
            node = current.left.as_deref(); // @step search.go-left
        } else {
            node = current.right.as_deref(); // @step search.go-right
        }
    }
    None // @step search.not-found
}
