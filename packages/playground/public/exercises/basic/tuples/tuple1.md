---
id: tuple1
title: tuple1
category: tuples
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Tuples group values of different types using parentheses: `(value1,
      value2, value3)`. Order matters!
    description: >-
      Tuples group different types together temporarily - useful for functions
      that need to return multiple values


      #### Docs
    docLink: 'https://noir-lang.org/docs/noir/concepts/data_types/tuples#tuple-creation'
---
```noir
fn create_person(name: str<10>, age: Field, zip: Field) -> (str<10>, Field, Field) {
    // TODO: Create and return a tuple with the given parameters
}

fn main() {
    let person = create_person("JohhnDOOEE", 30, 12345);

    let (name, age, zip_code) = person;

    assert(age == 30);
    assert(zip_code == 12345);
}

#[test]
fn test_person() {
    main();
}

```
