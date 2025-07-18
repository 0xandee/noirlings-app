---
id: shopping_cart
title: shopping_cart
category: structs
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Methods can modify the struct if they take `&mut self`. Arrays in structs
      can be indexed and modified like regular arrays.
    description: >-
      Real-world ZK applications often need complex state management - structs
      with arrays help organize this efficiently


      #### Docs
    docLink: 'https://noir-lang.org/docs/noir/concepts/data_types/structs#methods'
---
```noir
struct Product {
    id: Field,
    price: Field,
    quantity: Field,
}

struct Cart {
    items: [Product; 3],
    total_items: Field,
}

impl Cart {
    // TODO: Implement the following methods for Cart:
    // 1. new() - creates an empty cart with zero items
    // 2. add_product(product: Product) -> bool - adds a product if total_items < 3
    fn calculate_total(self) -> Field {
        let mut total = 0;
        for i in 0..self.total_items as u64 {
            total = total + self.items[i].price * self.items[i].quantity;
        }
        total
    }
}

// DO NOT CHANGE ANY CODE BELOW
fn main() {
    let mut cart = Cart::new();

    let product1 = Product { id: 1, price: 10, quantity: 2 };

    let product2 = Product { id: 2, price: 15, quantity: 1 };

    assert(cart.add_product(product1));
    assert(cart.add_product(product2));
    print(cart.items);
    assert(cart.total_items == 2);
    assert(cart.calculate_total() == 35); // (10 * 2) + (15 * 1)
}

#[test]
fn test_cart() {
    main();
}

```
