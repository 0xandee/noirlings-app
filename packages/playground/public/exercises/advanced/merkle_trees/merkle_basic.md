---
id: merkle_basic
title: merkle_basic
category: merkle_trees
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      A Merkle tree builds from leaves to root by hashing pairs. Implement the tree construction and understand how changes propagate to the root.

      1. Merkle Root Computation

      ```noir
      fn compute_merkle_root(leaves: [Field; 4]) -> Field {
          // Level 1: Hash adjacent pairs
          let level2_0 = hash_pair(leaves[0], leaves[1]);
          let level2_1 = hash_pair(leaves[2], leaves[3]);
          
          // Level 2: Hash the two level2 values to get root
          hash_pair(level2_0, level2_1)
      }
      ```

      2. Leaf Change Testing

      ```noir
      fn test_leaf_change_affects_root(original_leaves: [Field; 4], leaf_index: u32, new_value: Field) -> bool {
          let original_root = compute_merkle_root(original_leaves);
          
          let mut modified_leaves = original_leaves;
          modified_leaves[leaf_index] = new_value;
          let new_root = compute_merkle_root(modified_leaves);
          
          original_root != new_root
      }
      ```

      3. Tree Depth Calculation

      ```noir
      fn calculate_tree_depth(num_leaves: u32) -> u32 {
          let mut depth = 0;
          let mut current = 1;
          
          while current < num_leaves {
              current = current * 2;
              depth = depth + 1;
          }
          
          depth
      }
      ```
    description: >-
      Merkle trees enable efficient verification of large data structures with tamper-evident properties. Learn to build trees from leaf data and understand how changes propagate to the root.


      In this exercise, you will:

      1. Build a Merkle tree from leaf data

      2. Calculate the Merkle root

      3. Understand how tree structure affects the root

      #### Docs
    docLink: >-
      https://noir-lang.org/docs/noir/standard_library/merkle
---

```noir
use std::hash::pedersen_hash;

// Helper function to hash two values together
fn hash_pair(left: Field, right: Field) -> Field {
    pedersen_hash([left, right])
}

// Build a Merkle tree from an array of leaves and return the root
fn compute_merkle_root(leaves: [Field; 4]) -> Field {
    // TODO: Implement the Merkle tree construction
    // 1. Start with the leaf values
    // 2. Hash adjacent pairs to create the next level
    // 3. Repeat until you have a single root hash

    // HINT: For 4 leaves, you need:
    // Level 1 (leaves): [leaf0, leaf1, leaf2, leaf3]
    // Level 2: [hash(leaf0,leaf1), hash(leaf2,leaf3)]
    // Level 3 (root): hash(level2[0], level2[1])

    0 // Replace this with your implementation
}

// Verify that changing one leaf changes the root (avalanche property)
fn test_leaf_change_affects_root(original_leaves: [Field; 4], leaf_index: u32, new_value: Field) -> bool {
    let original_root = compute_merkle_root(original_leaves);

    let mut modified_leaves = original_leaves;
    modified_leaves[leaf_index] = new_value;
    let new_root = compute_merkle_root(modified_leaves);

    original_root != new_root
}

fn main(leaves: [Field; 4], expected_root: Field) -> pub bool {
    let computed_root = compute_merkle_root(leaves);

    // Test that our computation matches expected
    let correct_root = computed_root == expected_root;

    // Test avalanche property - changing leaf 0 should change root
    let avalanche_test = test_leaf_change_affects_root(leaves, 0, leaves[0] + 1);

    // Test deterministic property - same inputs should give same output
    let deterministic_test = compute_merkle_root(leaves) == computed_root;

    correct_root & avalanche_test & deterministic_test
}

#[test]
fn test_merkle_basic_1() {
    let leaves = [1, 2, 3, 4];

    // Calculate expected root manually
    let level1_0 = pedersen_hash([1, 2]);
    let level1_1 = pedersen_hash([3, 4]);
    let expected_root = pedersen_hash([level1_0, level1_1]);

    assert(main(leaves, expected_root));
}

#[test]
fn test_merkle_basic_2() {
    let leaves = [100, 200, 300, 400];

    // Calculate expected root manually
    let level1_0 = pedersen_hash([100, 200]);
    let level1_1 = pedersen_hash([300, 400]);
    let expected_root = pedersen_hash([level1_0, level1_1]);

    assert(main(leaves, expected_root));
}

#[test]
fn test_order_matters() {
    let leaves1 = [1, 2, 3, 4];
    let leaves2 = [2, 1, 3, 4]; // Different order

    let root1 = compute_merkle_root(leaves1);
    let root2 = compute_merkle_root(leaves2);

    // Different leaf order should produce different roots
    assert(root1 != root2);
}
```
