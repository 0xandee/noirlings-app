---
id: variables1
title: variables1
category: variables
difficulty: easy
tags: []
mode: compile
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Every variable in Noir needs to be declared before use. What keyword is
      used to declare variables in Noir?
    description: >-
      Variables in Noir must be explicitly declared with `let` before they can
      be used - this helps prevent errors in your ZK circuits


      #### Docs
    docLink: 'https://noir-lang.org/docs/noir/concepts/mutability#let-bindings'
---
```noir
fn main(x: Field, y: Field) {
    z = x + y;
    println(f"{x} + {y} = {z}");
}

```
