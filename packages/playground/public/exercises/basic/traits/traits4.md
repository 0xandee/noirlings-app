---
id: traits4
title: traits4
category: traits
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Default methods can be overridden in your implementation. Focus on
      implementing the required methods first.
    description: >-
      Default methods reduce code duplication by providing common functionality
      that types can use or override


      #### Docs
    docLink: >-
      https://noir-lang.org/docs/noir/standard_library/traits#default-implementations
---
```noir
trait Counter {
    fn increment(self) -> Self;

    // This is a default implementation that calls increment twice
    fn increment_twice(self) -> Self {
        self.increment().increment()
    }
}

struct Number {
    value: Field,
}

// TODO: Implement the Counter trait for Number
// increment should add 1 to value
// You don't need to implement increment_twice as it has a default implementation
impl Counter for Number {
    // Add your implementation here
    fn increment(self) -> Self {}
}

#[test]
fn test_counter() {
    let num = Number { value: 0 };
    assert(num.increment().value == 1);
    assert(num.increment_twice().value == 2);
}

```
