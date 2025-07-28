---
id: slice5
title: slice5
category: slices
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      ```

      let valid_transactions = transactions.filter(|txn: Transaction| txn.valid
      == true);

      let amounts = valid_transactions.map(|txn: Transaction| txn.amount);

      let sum = amounts.reduce(|acc: Field,x: Field| acc + x);

      ```
    description: >-
      Functional programming pipelines combine filter, map, and reduce
      operations to process data efficiently, making complex transformations
      readable and composable


      #### Docs
    docLink: >-
      https://noir-lang.org/docs/noir/concepts/data_types/slices#slice-manipulation
---

```noir
struct Transaction {
    amount: Field,
    valid: bool,
}

fn process_transactions(transactions: [Transaction]) -> Field {
    // TODO:
    // 1. Filter out invalid transactions
    // 2. Extract only the amounts using map
    // 3. Calculate the total using reduce
    // 4. Return the final sum

    // Your code here

    sum
}

fn main() {
    let transactions = &[
        Transaction { amount: 100, valid: true },
        Transaction { amount: 50, valid: false },
        Transaction { amount: 75, valid: true },
        Transaction { amount: 200, valid: true },
    ];

    let total = process_transactions(transactions);
    assert(total == 375); // Sum of valid transactions
}

#[test]
fn test_advanced_operations() {
    main();
}

```
