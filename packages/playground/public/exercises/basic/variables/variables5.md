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
    hint: |-
      No hint this time
      
    description: |-
      This will not compile, can you fix it to compile successfully
      
---

This will not compile, can you fix it to compile successfully


```noir
fn main() {
    let number = 1; // don't change this line
    println(f"number is {number}");
    number = 3; // don't rename this variable
    println(f"number is {number}");
}

```
