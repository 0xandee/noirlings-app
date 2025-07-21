---
id: traits3
title: traits3
category: traits
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Generic traits use type parameters. The Convert trait should transform one
      temperature type into another using the conversion formula.
    description: >-
      Generic traits enable type-safe conversions and operations that work
      across different but related types


      #### Docs
    docLink: 'https://noir-lang.org/docs/noir/concepts/generics#generic-traits'
---
```noir
trait Convert<T> {
    fn convert(self) -> T;
}

struct Celsius {
    temp: Field,
}

struct Fahrenheit {
    temp: Field,
}

// TODO: Implement Convert trait to convert Celsius to Fahrenheit
// Formula: F = (C X 9/5) + 32
impl Convert<Fahrenheit> for Celsius {
    // Add your implementation here
}

#[test]
fn test_temperature_conversion() {
    let celsius = Celsius { temp: 0 };
    let fahrenheit = celsius.convert();
    assert(fahrenheit.temp == 32);

    let celsius = Celsius { temp: 100 };
    let fahrenheit = celsius.convert();
    assert(fahrenheit.temp == 212);
}

```
