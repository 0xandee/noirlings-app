---
id: variables5
title: variables5
category: variables
difficulty: easy
tags: []
mode: compile
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Variable shadowing lets you declare a new variable with the same name. The
      new declaration 'shadows' (hides) the previous one.
    description: >-
      Variable shadowing allows you to reuse variable names in the same scope,
      with the new declaration hiding the previous one


      #### Docs
    docLink: 'https://noir-lang.org/docs/noir/concepts/shadowing'
---
```noir
fn main() {
    let number = 1; // don't change this line
    println(f"number is {number}");
    number = 3; // don't rename this variable
    println(f"number is {number}");
}

```
