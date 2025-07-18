---
id: structs2
title: structs2
category: structs
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: No hint this time
    description: No description here
    docLink: 'https://noir-lang.org/docs/dev/noir/concepts/data_types'
---
```noir
struct Rectangle {
    width: Field,
    height: Field,
}

// TODO
// 1. Implement area() method - returns the area of the rectangle
// 2. Syntax will be similar to already implemented `perimeter()` method.

impl Rectangle {
    // Your implementation here

    fn perimeter(self) -> Field {
        2 * (self.width + self.height)
    }
}

fn main() {
    let rect = Rectangle { width: 5, height: 3 };

    assert(rect.area() == 15);
    assert(rect.perimeter() == 16);
}

#[test]
fn test_rectangle() {
    main();
}

```
