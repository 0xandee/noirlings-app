---
id: structs3
title: structs3
category: structs
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Nested structs are defined separately, then used as field types in other
      structs. Create the inner struct first, then the outer one.
    description: >-
      Nested structs help model complex real-world data while keeping your ZK
      circuit organized and efficient


      #### Docs
    docLink: 'https://noir-lang.org/docs/noir/concepts/data_types/structs#nested-structs'
---
```noir
struct Address {
    street_number: Field,
    zip_code: Field,
}

// TODO: Define a struct called 'Person' with these fields:
// - name: str<10>
// - age: Field
// - home_address: Address

fn create_person(name: str<10>, age: Field, street_num: Field, zip: Field) -> Person {
    // TODO: Create and return a Person instance with the given parameters
}

fn main() {
    let person = create_person("JohhnDOOEE", 30, 123, 12345);

    assert(person.age == 30);
    assert(person.home_address.street_number == 123);
    assert(person.home_address.zip_code == 12345);
}

#[test]
fn test_person() {
    main();
}

```
