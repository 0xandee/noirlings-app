---
id: quiz1
title: quiz1
category: quizs
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: |-
      ```
      fn equality(inputs: [u32;3]) -> bool {
        if (inputs[0] == inputs[1]) & (inputs[0] == inputs[2]) {
          true
        } else {
          false
        }
      }
      ```
      
    description: |-
      Input 3 values using 'a' (array of length 3) and check if they all are equal.
      Return using signal 'c'.
      
---

Input 3 values using 'a' (array of length 3) and check if they all are equal.
Return using signal 'c'.


```noir
fn equality(inputs: [u32; 3]) -> bool {
    //TODO
}

#[test]
fn test_equality_true() {
    let result = equality([7, 7, 7]);
    assert(result == true, "Should be true")
}

#[test]
fn test_equality_false() {
    let result = equality([1, 1, 2]);
    println("h3llo");
    assert(result == false, "Should be false")
}

```
