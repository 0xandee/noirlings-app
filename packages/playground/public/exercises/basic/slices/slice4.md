---
id: slice4
title: slice4
category: slices
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      1. We are going to use `Stats` struct to store sum and count. define
      initial value for accumulator

      ```

      let acc = Stats { sum: 0, count: 0 };

      ```

      2. Use `fold` method to fold values. Here we are passing closure function
      that will process each element of slice. 

      3. Remember to define explicit type in closure for `acc` and `x` as type
      must be known by this point.

      ```

      let stats = numbers.fold(acc, |acc: Stats, x: Field| Stats { sum: acc.sum
      + x, count: acc.count + 1 });

      ```

      4. Return the average

      ```

      stats.sum / stats.count

      ```
    description: No description here
    docLink: 'https://noir-lang.org/docs/dev/noir/concepts/data_types'
---
```noir
struct Stats {
    sum: Field,
    count: Field,
}

fn calculate_average(numbers: [Field]) -> Field {
    // TODO:
    // 1. Use fold to accumulate both sum and count of elements
    // 2. Calculate and return the average
    // Hint: Create a Stats struct to hold intermediate values
    // Your code here
}

fn main() {
    let numbers = &[2, 4, 6, 8, 10];
    let average = calculate_average(numbers);

    assert(average == 6);
}

#[test]
fn test_reduction() {
    main();
}

//PS: This is though one. don't hesitate using hint😄

```
