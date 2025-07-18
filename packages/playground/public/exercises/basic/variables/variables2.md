---
id: variables2
title: variables2
category: variables
difficulty: easy
tags: []
mode: compile
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Variables need a value when they're declared (or before they're used). Try
      assigning a value to `x` before the conditional.
    description: >-
      Variables must be initialized with a value before they can be used in
      comparisons or other operations


      #### Docs
    docLink: >-
      https://noir-lang.org/docs/noir/concepts/mutability#variable-initialization
---
```noir
fn main() {
    let x;
    if x == 10 {
       println("x is ten!");
    } else {
        println("x is not ten! ");
    }
}

```
