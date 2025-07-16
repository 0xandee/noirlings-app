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
    hint: |-
      No hint this time
      
    description: |-
      This will not compile, can you fix it to compile successfully
      
---

This will not compile, can you fix it to compile successfully


```noir
global NUMBER = 7;
global SMALL_NUMBER: u8 = 3;

fn main() {
    println(f"NUMBER is {NUMBER}");
    println(f"SMALL_NUMBER is {SMALL_NUMBER}");
}

```
