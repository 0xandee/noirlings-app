---
id: integer2
title: integer2
category: integers
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Temperature can be negative, so you'll need signed integer types. Consider
      what happens when converting between Celsius and Fahrenheit.
    description: >-
      Choose signed integers (i8, i16, i32, i64) when you need negative values,
      unsigned (u8, u16, u32, u64) for non-negative values


      #### Docs
    docLink: >-
      https://noir-lang.org/docs/noir/concepts/data_types/integers#signed-integers
---
```noir
fn celsius_to_fahrenheit(celsius: i8) -> i16 {
    // TODO: Convert Celsius to Fahrenheit
    // Formula: (celsius * 9/5) + 32
    // Handle both positive and negative temperatures
    // Return i16 as fahrenheit can exceed i8 range
    0
}

fn is_freezing(temps: [i8; 3]) -> [bool; 3] {
    // TODO: Return array of booleans indicating if each temperature is below freezing (0°C)
    [false; 3]
}

fn main() {
    // Test temperature conversion
    assert(celsius_to_fahrenheit(0) == 32);
    assert(celsius_to_fahrenheit(-40) == -40);
    assert(celsius_to_fahrenheit(100) == 212);
    
    // Test freezing temperatures
    let temps = [-5, 0, 20];
    let freezing = is_freezing(temps);
    assert(freezing == [true, false, false]);
}

#[test]
fn test_temperature() {
    main();
}

```
