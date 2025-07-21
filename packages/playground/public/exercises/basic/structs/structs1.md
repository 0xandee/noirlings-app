---
id: structs1
title: structs1
category: structs
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Struct definition uses the `struct` keyword followed by field names and
      types. Each field needs a type annotation.
    description: >-
      Structs group related data together, making your zero-knowledge programs
      more organized and easier to understand


      #### Docs
    docLink: >-
      https://noir-lang.org/docs/noir/concepts/data_types/structs#struct-definition
---
```noir
// structs1.nr
// use the `hint` watch subcommand for a hint.

// TODO: Define a struct called 'Point' with two fields:
// - x: Field
// - y: Field

fn main() {
    let point = Point { x: 5, y: 10 };

    assert(point.x == 5);
    assert(point.y == 10);
}

#[test]
fn test_point() {
    main();
}

```
