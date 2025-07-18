---
id: string1
title: string1
category: strings
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      String literals use double quotes. String comparison in Noir works with
      the `==` operator.
    description: >-
      Strings in Noir have fixed sizes specified in their type, ensuring
      predictable memory usage in ZK circuits


      #### Docs
    docLink: >-
      https://noir-lang.org/docs/noir/concepts/data_types/strings#string-literals
---
```noir
fn check_password(password: str<12>) -> bool {
    // TODO: Return true if the password:
    // 1. Is exactly equal to "SuperSecret!"
}

fn main() {
    let password1 = "SuperSecret!";

    assert(check_password(password1) == true);

    // TODO: Create a string with escape characters that prints:
    // Hello
    //     World!
    // (with one tab space before World)
    let formatted_text = "Hello\n\tWorld!";
    assert(formatted_text == "Hello\n\tWorld!");
}

#[test]
fn test_passwords() {
    main();
}

```
