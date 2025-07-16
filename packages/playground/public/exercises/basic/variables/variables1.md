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
    hint: |-
      No hint this time

    description: |-
      This will not compile, can you fix it to compile successfully
    docLink: "https://noir-lang.org/docs/dev/noir/concepts/mutability"
---

This will not compile, can you fix it to compile successfully

```noir
fn main(x: Field, y: Field) {
    z = x + y;
    println(f"{x} + {y} = {z}");
}

```
