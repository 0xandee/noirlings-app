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
    hint: >-
      Convert strings to bytes with `.as_bytes()`. Then iterate over the byte
      array to sum the ASCII values.
    description: >-
      String-to-bytes conversion allows you to work with character data at a low
      level, useful for cryptographic operations


      #### Docs
    docLink: 'https://noir-lang.org/docs/noir/concepts/data_types/strings#string-methods'
---
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
