---
id: variables6
title: variables6
category: variables
difficulty: easy
tags: []
mode: compile
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Constants are declared differently than variables and are evaluated at
      compile time. Look up the `const` keyword syntax.
    description: >-
      Constants are evaluated at compile time and cannot be changed - they're
      useful for fixed parameters in your ZK circuits


      #### Docs
    docLink: 'https://noir-lang.org/docs/noir/concepts/mutability#constants'
---
```noir
global NUMBER = 7;
global SMALL_NUMBER: u8 = 3;

fn main() {
    println(f"NUMBER is {NUMBER}");
    println(f"SMALL_NUMBER is {SMALL_NUMBER}");
}

```
