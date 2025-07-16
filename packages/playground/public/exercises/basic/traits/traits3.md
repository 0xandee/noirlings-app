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
    hint: |-
      1. Convert trait implementation
      ```
      impl Convert<Fahrenheit> for Celsius {
          fn convert(self) -> Fahrenheit {
          let f_temp = self.temp * 9/5 + 32;
          Fahrenheit {
              temp: f_temp
          }
          }
      }
      ```
      
    description: |-
      Generic Traits: This exercise demonstrates how to work with generic traits
      
---

Generic Traits: This exercise demonstrates how to work with generic traits


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
