---
id: traits1
title: traits1
category: traits
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Implement the trait using `impl TraitName for StructName { }`. The area of
      a rectangle is width × height.
    description: >-
      Traits define shared behavior that multiple types can implement, enabling
      polymorphism in your ZK programs


      #### Docs
    docLink: >-
      https://noir-lang.org/docs/noir/standard_library/traits#implementing-traits
---
```noir
// A trait for shapes that can calculate their area
trait Shape {
    fn area(self) -> Field;
}

struct Rectangle {
    width: Field,
    height: Field,
}

// The area should be calculated as width * height
impl Shape for Rectangle {
    //TODO: Complete `area` method implementation
}

#[test]
fn test_rectangle_area() {
    let rect = Rectangle { width: 5, height: 3 };
    assert(rect.area() == 15);
}

```
