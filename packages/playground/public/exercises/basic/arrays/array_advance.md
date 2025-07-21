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
    hint: >-
      The `map()` method transforms each element. Think about how to apply a
      transformation function to filter even numbers.
    description: >-
      Functional array methods create more readable code and often compile to
      more efficient circuits than manual loops


      #### Docs
    docLink: 'https://noir-lang.org/docs/noir/concepts/data_types/arrays#array-methods'
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
