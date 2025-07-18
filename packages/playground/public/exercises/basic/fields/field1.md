---
id: field1
title: field1
category: fields
difficulty: easy
tags: []
mode: compile
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      In finite field arithmetic, what happens when you add 1 to the largest
      possible value (p-1)? Think about modular arithmetic.
    description: >-
      All arithmetic in Noir happens in a finite field modulo a large prime p.
      When you exceed p-1, values wrap around to 0


      #### Docs
    docLink: >-
      https://noir-lang.org/docs/noir/concepts/data_types/fields#field-arithmetic
---
```noir
fn main() {
  let p: Field = 21888242871839275222246405745257275088548364400416034343698204186575808495616;

  let p1: Field = p + 1;

  // TODO: replace ? with correct p1 value
  assert(p1 == 0, "incorrect p1 value");

  let p2: Field = p * p;
  // TODO: replace ? with correct p1 value
  assert(p2 == ?, "incorrect p2 value");
}



```
