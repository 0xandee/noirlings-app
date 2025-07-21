---
id: slice3
title: slice3
category: slices
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Chain operations: first `map()` to double elements, then `filter()` to
      keep only elements ≤ 10. Each method returns a new slice.
    description: >-
      Functional slice operations often compile to more efficient circuits than
      imperative approaches


      #### Docs
    docLink: >-
      https://noir-lang.org/docs/noir/concepts/data_types/slices#functional-methods
---
```noir
fn transform_slice(input: [Field]) -> [Field] {
    // TODO:
    // 1. Double each element in the slice using map
    // 2. Filter out all elements that are greater than 10
    // 3. Return the resulting slice

    // Your code here
}

fn main() {
    let input = &[2, 4, 6, 8];
    let result = transform_slice(input);

    assert(result.len() == 2);
    assert(result[0] == 4);
    assert(result[1] == 8);
}

#[test]
fn test_transformation() {
    main();
}

```
