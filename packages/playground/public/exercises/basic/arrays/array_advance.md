---
id: array_advance
title: array_advance
category: arrays
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: No hint this time
    description: >-
      This exercise will help you understand array methods like map, fold, sort,
      and predicates
    docLink: 'https://noir-lang.org/docs/dev/noir/concepts/data_types'
---
```noir
fn find_even_numbers(arr: [u64; 6]) -> [u64; 6] {
    // TODO: Return an array where even numbers are kept and odd numbers are replaced with 0
    // Hint: Use the map method
}

fn get_even(num: u64) -> u64 {
    if num % 2 == 0 {
        num
    } else {
        0
    }
}

#[test]
fn test_find_even_numbers() {
    let arr = [1, 2, 3, 4, 5, 6];
    let result = find_even_numbers(arr);
    println(result);
    assert(result == [0, 2, 0, 4, 0, 6]);
}

```
