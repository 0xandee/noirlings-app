---
id: variables3
title: variables3
category: variables
difficulty: easy
tags: []
mode: compile
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Variables are immutable by default in Noir. If you want to change a
      variable's value, you need to make it mutable using a keyword.
    description: >-
      Variables are immutable by default - use `mut` keyword to make them
      mutable when you need to change their values


      #### Docs
    docLink: 'https://noir-lang.org/docs/noir/concepts/mutability#mutable-variables'
---
```noir
fn main() {
    let x: Field;
    println(f"x is {x}");
}

```
