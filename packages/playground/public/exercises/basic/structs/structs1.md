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
    hint: No hint this time
    description: |-
      TODO: Define a struct called 'Point' with two fields:
      - x: Field
      - y: Field
    docLink: 'https://noir-lang.org/docs/dev/noir/concepts/data_types'
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
