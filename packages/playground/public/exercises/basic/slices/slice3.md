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
    hint: |-
      1. First create a new slice of doubled elements using `map` method.
      ```
      let slice1 = input.map(|a| a * 2);
      ```
      2. Filter elements greater than 10 using `filter method`
      ```
      let slice2 = slice1.filter(|a| a as u64 <= 10);
      ```
      3. Return the slice `slice2`
      
    description: |-
      No description here
      
---

No description here


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
