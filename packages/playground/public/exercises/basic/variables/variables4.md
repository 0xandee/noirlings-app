---
id: variables4
title: variables4
category: variables
difficulty: easy
tags: []
mode: compile
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Think about where the variable is declared versus where it's being used.
      Variables have scope - they're only visible within their block.
    description: >-
      Variables have block scope - they're only accessible within the block
      (between `{}`) where they're declared


      #### Docs
    docLink: 'https://noir-lang.org/docs/noir/concepts/mutability#variable-scope'
---
```noir
fn main() {
    let x = 3;
    let str1 = f"x is {x}";
    println(str1);
    x = 5; // don't change this line
    println(f"x is now {x}");
}

```
