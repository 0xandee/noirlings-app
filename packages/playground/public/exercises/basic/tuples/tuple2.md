---
id: tuple2
title: tuple2
category: tuples
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: |-
      ```
      No hint this time
      ```
      
    description: |-
      No description here
      
---

No description here


```noir
fn create_coordinates(x: Field, y: Field, z: Field) -> (Field, Field, Field) {}

fn main() {
    let coords = create_coordinates(10, 20, 30);

    let x = coords.0;
    let y = coords.1;
    let z = coords.2;

    assert(x == 10);
    assert(y == 20);
    assert(z == 30);
}

#[test]
fn test_coordinates() {
    main();
}

```
