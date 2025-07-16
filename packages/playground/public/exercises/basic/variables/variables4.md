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
    hint: |-
      No hint this time
      
    description: |-
      This will not compile, can you fix it to compile successfully
      
---

This will not compile, can you fix it to compile successfully


```noir
fn main() {
    let x = 3;
    let str1 = f"x is {x}";
    println(str1);
    x = 5; // don't change this line
    println(f"x is now {x}");
}

```
