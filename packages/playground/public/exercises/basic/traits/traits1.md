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
    hint: |-
      ```
      fn area(self) -> Field {
            self.width * self.height
      }
      ```
      
    description: |-
      Basic Trait Implementation. This exercise introduces basic trait definition and implementation.
      
---

Basic Trait Implementation. This exercise introduces basic trait definition and implementation.


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
