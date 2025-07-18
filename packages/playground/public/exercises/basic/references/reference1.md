---
id: reference1
title: reference1
category: references
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: |-
      ```
      let temp = *a;
      *a = *b;
      *b = temp;
      ```
    description: >-
      TODO: Complete the swap_values function that takes two mutable references
      to Field values and swaps their values
    docLink: 'https://noir-lang.org/docs/dev/noir/concepts/mutability'
---
```noir
fn swap_values(a: &mut Field, b: &mut Field) {
    // Your implementation here
    // Hint: You'll need a temporary variable and dereferencing
}

fn main() {
    let mut x = 5;
    let mut y = 10;

    println(f"Before swap: x = {x}, y = {y}");
    swap_values(&mut x, &mut y);
    println("After swap: x = {x}, y = {y}");
    assert(x == 10);
    assert(y == 5);
}

#[test]
fn test_swap() {
    main();
}

```
