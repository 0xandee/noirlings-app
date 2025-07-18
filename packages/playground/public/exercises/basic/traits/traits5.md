---
id: traits5
title: traits5
category: traits
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Trait bounds limit which types can be used with generics. Use `where T:
      TraitName` to specify that T must implement the trait.
    description: >-
      Trait bounds ensure generic functions only work with types that have the
      required capabilities


      #### Docs
    docLink: 'https://noir-lang.org/docs/noir/concepts/generics#trait-bounds'
---
```noir
trait Maximum {
    fn max(self, other: Self) -> Self;
}

// TODO: Implement a generic function find_maximum that takes an array of any type T
// that implements Maximum and returns the maximum value
fn find_maximum<T>(values: [T; 5]) -> T
where
    T: Maximum,
{
    // Add your implementation here
}

// Here's an implementation of Maximum for Field to help test your function
impl Maximum for Field {
    fn max(self, other: Self) -> Self {
        if self.lt(other) {
            other
        } else {
            self
        }
    }
}

#[test]
fn test_find_maximum() {
    let numbers = [1, 5, 3, 8, 2];
    let max = find_maximum(numbers);
    assert(max == 8);
}

```
