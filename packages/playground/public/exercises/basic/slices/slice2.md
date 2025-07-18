---
id: slice2
title: slice2
category: slices
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Slice methods like `insert()` and `pop_front()` return new slices. Always
      assign the result back to your slice variable.
    description: >-
      Slice methods return new slices rather than modifying existing ones,
      following functional programming principles


      #### Docs
    docLink: 'https://noir-lang.org/docs/noir/concepts/data_types/slices#slice-methods'
---
```noir
fn process_slice(mut slice: [Field]) -> Field {
    // TODO:
    // 1. Insert value 42 at index 2
    // 2. Remove the element at index 0
    // 3. Return the length of the final slice

    // Your code here
}

fn main() {
    let mut initial_slice: [Field] = &[1, 2, 3, 4];
    let result = process_slice(initial_slice);

    assert(result == 4); // Length should be 4 after operations
}

#[test]
fn test_slice_methods() {
    main();
}

```
