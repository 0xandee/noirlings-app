---
id: traits2
title: traits2
category: traits
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: |-
      1. Implement Area trait for Circle
      ```
      impl Area for Circle {
          fn area(self) -> Field {
            3 * self.radius * self.radius
          }
      }
      ```
      2. Implement Perimeter trait for Circle
      ```
      impl Perimeter for Circle {
          fn perimeter(self) -> Field {
            2 * 3 * self.radius
          }
      }
      ```
    description: >-
      Multiple Trait Implementation: This exercise shows how to implement
      multiple traits for a type
    docLink: 'https://noir-lang.org/docs/dev/noir/concepts/traits'
---
```noir
trait Perimeter {
    fn perimeter(self) -> Field;
}

trait Area {
    fn area(self) -> Field;
}

struct Circle {
    radius: Field,
}

// TODO: Implement both Area and Perimeter traits for Circle
// Note: Use 3 as an approximation for PI
impl Area for Circle {
    // Add your implementation here
}

impl Perimeter for Circle {
    // Add your implementation here
}

#[test]
fn test_circle_calculations() {
    let circle = Circle { radius: 2 };
    assert(circle.area() == 12); // Using PI ~ 3
    assert(circle.perimeter() == 12); // Using PI ~ 3
}

```
