---
id: slice1
title: slice1
category: slices
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: |-
      ```
      let mut slice = &[1, 2, 3];
      slice = slice.push_back(4);
      slice = slice.push_front(0);
      ```
      
      
    description: |-
      No description here
      
---

No description here


```noir
fn main() {
    // TODO:
    // 1. Create a slice with initial values [1, 2, 3]
    // 2. Add element 4 to the end of the slice (hint: use `push_back` method)
    // 3. Add element 0 to the beginning of the slice
    // Your code here
    // Tests

    assert(slice.len() == 5);
    assert(slice[0] == 0);
    assert(slice[4] == 4);
}

#[test]
fn test_basic_operations() {
    main();
}

```
