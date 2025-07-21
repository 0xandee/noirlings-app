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
    hint: >-
      You can implement multiple traits for the same type with separate `impl`
      blocks. Circle area uses π × r², perimeter uses 2 × π × r.
    description: >-
      Types can implement multiple traits, allowing them to have diverse
      capabilities while maintaining type safety


      #### Docs
    docLink: >-
      https://noir-lang.org/docs/noir/standard_library/traits#multiple-trait-implementations
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
