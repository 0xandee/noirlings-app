---
id: quiz1
title: quiz1
category: quizs
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Check if all three array elements are equal. Use logical AND (`&`) to
      combine equality comparisons.
    description: >-
      Combining basic concepts like arrays, loops, and conditionals is essential
      for building complex ZK applications


      #### Docs
    docLink: >-
      https://noir-lang.org/docs/noir/concepts/data_types/arrays#array-comparison
---
```noir
fn equality(inputs: [u32; 3]) -> bool {
    //TODO
}

#[test]
fn test_equality_true() {
    let result = equality([7, 7, 7]);
    assert(result == true, "Should be true")
}

#[test]
fn test_equality_false() {
    let result = equality([1, 1, 2]);
    println("h3llo");
    assert(result == false, "Should be false")
}

```
