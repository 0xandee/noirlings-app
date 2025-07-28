# Merkle Tree Basics - Solution

## Exercise ID: merkle_basic

**Category:** merkle_trees  
**Difficulty:** easy  
**Prerequisites:** [pedersen_hash]

## Description

Merkle trees enable efficient verification of large data structures with tamper-evident properties. Learn to build trees from leaf data and understand how changes propagate to the root.

## Solution

```noir
use std::hash::pedersen_hash;

// Helper function to hash two values together
fn hash_pair(left: Field, right: Field) -> Field {
    pedersen_hash([left, right])
}

// Build a Merkle tree from an array of leaves and return the root
fn compute_merkle_root(leaves: [Field; 4]) -> Field {
    // Level 1: Hash adjacent pairs
    let level2_0 = hash_pair(leaves[0], leaves[1]);
    let level2_1 = hash_pair(leaves[2], leaves[3]);

    // Level 2: Hash the two level2 values to get root
    hash_pair(level2_0, level2_1)
}

// Verify that changing one leaf changes the root (avalanche property)
fn test_leaf_change_affects_root(original_leaves: [Field; 4], leaf_index: u32, new_value: Field) -> bool {
    let original_root = compute_merkle_root(original_leaves);

    let mut modified_leaves = original_leaves;
    modified_leaves[leaf_index] = new_value;
    let new_root = compute_merkle_root(modified_leaves);

    original_root != new_root
}

// Calculate tree depth for given number of leaves
fn calculate_tree_depth(num_leaves: u32) -> u32 {
    let mut depth = 0;
    let mut current = 1;

    while current < num_leaves {
        current = current * 2;
        depth = depth + 1;
    }

    depth
}

// Generic Merkle root computation for any power-of-2 sized array
fn compute_merkle_root_generic<let N: u32>(leaves: [Field; N]) -> Field {
    assert(N > 0, "Cannot compute root of empty tree");
    assert(N & (N - 1) == 0, "Number of leaves must be power of 2");

    if N == 1 {
        return leaves[0];
    }

    // Create next level by hashing pairs
    let mut current_level = leaves;
    let mut current_size = N;

    while current_size > 1 {
        let next_size = current_size / 2;
        let mut next_level = [0; N];

        for i in 0..next_size {
            next_level[i] = hash_pair(current_level[i * 2], current_level[i * 2 + 1]);
        }

        current_level = next_level;
        current_size = next_size;
    }

    current_level[0]
}

fn main(leaves: [Field; 4], expected_root: Field) -> pub bool {
    let computed_root = compute_merkle_root(leaves);

    // Test that our computation matches expected
    let correct_root = computed_root == expected_root;

    // Test avalanche property - changing leaf 0 should change root
    let avalanche_test = test_leaf_change_affects_root(leaves, 0, leaves[0] + 1);

    // Test deterministic property - same inputs should give same output
    let deterministic_test = compute_merkle_root(leaves) == computed_root;

    // Test depth calculation
    let depth_test = calculate_tree_depth(4) == 2;

    correct_root & avalanche_test & deterministic_test & depth_test
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

#[test]
fn test_single_change_propagates() {
    let original = [10, 20, 30, 40];
    let modified = [11, 20, 30, 40]; // Only first leaf changed

    let root1 = compute_merkle_root(original);
    let root2 = compute_merkle_root(modified);

    // Changing one leaf should change the root
    assert(root1 != root2);
}

#[test]
fn test_depth_calculation() {
    assert(calculate_tree_depth(1) == 0);
    assert(calculate_tree_depth(2) == 1);
    assert(calculate_tree_depth(4) == 2);
    assert(calculate_tree_depth(8) == 3);
    assert(calculate_tree_depth(16) == 4);
    assert(calculate_tree_depth(5) == 3); // Needs 8 leaves (next power of 2)
}

#[test]
fn test_generic_merkle_computation() {
    // Test with 2 leaves
    let leaves2 = [1, 2];
    let root2 = compute_merkle_root_generic(leaves2);
    let expected2 = hash_pair(1, 2);
    assert(root2 == expected2);

    // Test with 4 leaves (should match our specific implementation)
    let leaves4 = [1, 2, 3, 4];
    let root4_generic = compute_merkle_root_generic(leaves4);
    let root4_specific = compute_merkle_root(leaves4);
    assert(root4_generic == root4_specific);
}

#[test]
fn test_empty_vs_zero_leaves() {
    let zero_leaves = [0, 0, 0, 0];
    let small_leaves = [1, 0, 0, 0];

    let zero_root = compute_merkle_root(zero_leaves);
    let small_root = compute_merkle_root(small_leaves);

    // Even small changes should produce different roots
    assert(zero_root != small_root);
}
```

## Key Concepts

1. **Tree Construction**: Build trees bottom-up by hashing adjacent pairs
2. **Root Computation**: Final hash representing the entire tree
3. **Avalanche Effect**: Small changes in leaves cause different root
4. **Deterministic**: Same input always produces same root
5. **Tree Depth**: Logarithmic relationship between leaves and depth
6. **Order Sensitivity**: Changing leaf order changes the root

## Tree Structure for 4 Leaves

```
       Root
      /    \
   Hash01  Hash23
   /  \    /   \
  L0  L1  L2   L3
```

Where:

- L0, L1, L2, L3 are the leaf values
- Hash01 = hash(L0, L1)
- Hash23 = hash(L2, L3)
- Root = hash(Hash01, Hash23)

## Properties

1. **Tamper Evidence**: Any change to data is detectable through root change
2. **Efficient Verification**: Can verify inclusion with log(n) hashes
3. **Batch Verification**: Can verify multiple inclusions efficiently
4. **Incremental Updates**: Can update tree with new data efficiently

## Use Cases

- **Blockchain**: Bitcoin and other blockchains use Merkle trees for transaction batching
- **File Systems**: Git uses Merkle trees to track file changes
- **Databases**: Some databases use Merkle trees for data integrity
- **Zero-Knowledge Proofs**: Membership proofs without revealing other data

## Documentation

- [Noir Merkle Documentation](https://noir-lang.org/docs/noir/standard_library/merkle)
