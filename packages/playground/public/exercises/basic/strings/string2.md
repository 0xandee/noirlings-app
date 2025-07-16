---
id: string2
title: string2
category: strings
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: |-
      1. First convert string into byte array by calling `as_bytes()`
      ```
          let char_bytes = text.as_bytes();
      ```
      2. Run a loop on byte array to sum the values
      ```
          let mut sum: Field = 0;
          for i in 0..5 {
              sum = sum + char_bytes[i] as Field;
          }
      ```
      3. Return the sum
      ```
          sum as Field
      ```
      
    description: |-
      No description here
      
---

No description here


```noir
fn get_ascii_sum(text: str<5>) -> Field {
    // TODO: Return the sum of ASCII values of all characters
    // Hint: Convert string to bytes and sum them

}

fn main() {
    assert(get_ascii_sum("Hello") == 500); // Sum of ASCII values of "Hello"
}

#[test]
fn test_hex_and_ascii() {
    main();
}

```
