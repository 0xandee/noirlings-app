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
    hint: |-
      Define Person Struct like this
      ```
      struct Person {
          name: str<10>,
          age: Field,
          home_address: Address,
      }
      ```
      First create a home_address like
      ```
      let home_address = Address { street_number: street_num, zip_code: zip };
      ```
      Finally create and resturn Person instance
      ```
      Person { name, age, home_address }
      ```
      
    description: |-
      No description here
      
---

No description here


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
