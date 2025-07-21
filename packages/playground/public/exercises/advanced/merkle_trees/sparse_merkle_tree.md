---
id: sparse_merkle_tree
title: sparse_merkle_tree
category: merkle_trees
difficulty: hard
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Sparse Merkle trees efficiently store mostly empty data by only maintaining non-default nodes. Implement key-value storage with membership proofs using default hashes.

      1. Tree Initialization with Default Hashes

      ```noir

      fn new() -> Self {
          let mut default_hashes = [0; TREE_DEPTH + 1];
          default_hashes[0] = EMPTY_LEAF;
          
          // Precompute default hashes for each level
          for i in 1..=TREE_DEPTH {
              default_hashes[i] = pedersen_hash([default_hashes[i-1], default_hashes[i-1]]);
          }
          
          SparseMerkleTree {
              nodes: std::collections::BTreeMap::new(),
              root: default_hashes[TREE_DEPTH],
              default_hashes: default_hashes
          }
      }

      ```

      2. Key-Value Update

      ```noir

      fn update(&mut self, key: Field, value: Field) {
          let path = self.key_to_path(key, TREE_DEPTH);
          
          // Set leaf value
          let leaf_key = self.node_key(0, key);
          if value == EMPTY_LEAF {
              self.nodes.remove(leaf_key);
          } else {
              self.nodes.insert(leaf_key, value);
          }
          
          // Update path to root
          let mut current_hash = value;
          let mut position = key;
          
          for level in 1..=TREE_DEPTH {
              let sibling_position = position ^ 1; // Flip last bit for sibling
              let sibling_key = self.node_key(level - 1, sibling_position);
              let sibling_hash = self.nodes.get(sibling_key).unwrap_or(self.default_hashes[level - 1]);
              
              if path[(TREE_DEPTH - level) as Field] { // Right child
                  current_hash = self.hash_children(sibling_hash, current_hash);
              } else { // Left child
                  current_hash = self.hash_children(current_hash, sibling_hash);
              }
              
              let node_key = self.node_key(level, position / 2);
              if current_hash == self.default_hashes[level] {
                  self.nodes.remove(node_key);
              } else {
                  self.nodes.insert(node_key, current_hash);
              }
              
              position = position / 2;
          }
          
          self.root = current_hash;
      }

      ```

      3. Value Retrieval

      ```noir

      fn get(&self, key: Field) -> Field {
          let leaf_key = self.node_key(0, key);
          self.nodes.get(leaf_key).unwrap_or(EMPTY_LEAF)
      }

      ```

      4. Proof Generation

      ```noir

      fn generate_proof(&self, key: Field) -> ([Field; TREE_DEPTH], Field) {
          let mut sibling_path = [0; TREE_DEPTH];
          let path = self.key_to_path(key, TREE_DEPTH);
          let value = self.get(key);
          
          let mut position = key;
          
          for level in 0..TREE_DEPTH {
              let sibling_position = position ^ 1;
              let sibling_key = self.node_key(level, sibling_position);
              sibling_path[level] = self.nodes.get(sibling_key).unwrap_or(self.default_hashes[level]);
              position = position / 2;
          }
          
          (sibling_path, value)
      }

      ```

      5. Proof Verification

      ```noir

      fn verify_proof(
          root: Field,
          key: Field,
          value: Field,
          sibling_path: [Field; TREE_DEPTH]
      ) -> bool {
          let path = SparseMerkleTree::key_to_path(key, TREE_DEPTH);
          let mut current_hash = value;
          
          for i in 0..TREE_DEPTH {
              let sibling = sibling_path[i];
              
              if path[(TREE_DEPTH - 1 - i) as Field] { // Right child
                  current_hash = pedersen_hash([sibling, current_hash]);
              } else { // Left child
                  current_hash = pedersen_hash([current_hash, sibling]);
              }
          }
          
          current_hash == root
      }

      ```
    description: >-
      Sparse Merkle trees are optimized data structures for large, mostly empty sets. Learn to implement efficient sparse trees that store only non-default values, enabling scalable membership proofs and state management in blockchain applications.

      #### Docs
    docLink: "https://noir-lang.org/docs/noir/standard_library/merkle_trees"
---

```noir
use std::hash::pedersen_hash;

global TREE_DEPTH: u32 = 32; // Support 2^32 possible leaves (can be extended)
global EMPTY_LEAF: Field = 0; // Default value for empty leaves

struct SparseMerkleTree {
    // Only store non-empty nodes (key -> value mapping)
    // Key format: level_position (e.g., "5_123" for level 5, position 123)
    nodes: std::collections::BTreeMap<Field, Field>,
    // Root hash
    root: Field,
    // Default hashes for each level (precomputed for efficiency)
    default_hashes: [Field; TREE_DEPTH + 1],
}

impl SparseMerkleTree {
    // TODO: Create a new sparse Merkle tree with precomputed default hashes
    fn new() -> Self {
        // Hint: Precompute default hashes for each level
        // default_hashes[0] = EMPTY_LEAF
        // default_hashes[i] = hash(default_hashes[i-1], default_hashes[i-1])
        todo!()
    }

    // TODO: Insert or update a key-value pair
    fn update(&mut self, key: Field, value: Field) {
        // Hint:
        // 1. Convert key to binary representation for tree path
        // 2. Update the leaf value
        // 3. Recalculate all affected intermediate nodes up to root
        // 4. Use default hashes for missing siblings
        todo!()
    }

    // TODO: Get the value for a key (returns EMPTY_LEAF if not found)
    fn get(&self, key: Field) -> Field {
        // Hint:
        // 1. Convert key to leaf position
        // 2. Look up in nodes map
        // 3. Return EMPTY_LEAF if not found
        todo!()
    }

    // TODO: Generate an inclusion proof for a key-value pair
    fn generate_proof(&self, key: Field) -> ([Field; TREE_DEPTH], Field) {
        // Returns: (sibling_path, value)
        // Hint:
        // 1. Convert key to binary path
        // 2. For each level, find the sibling hash
        // 3. Use default hashes for missing siblings
        // 4. Return the path and the value
        todo!()
    }

    // TODO: Verify an inclusion proof
    fn verify_proof(
        root: Field,
        key: Field,
        value: Field,
        sibling_path: [Field; TREE_DEPTH]
    ) -> bool {
        // Hint: Reconstruct root by hashing up the tree using the sibling path
        todo!()
    }

    // TODO: Delete a key (set its value to EMPTY_LEAF)
    fn delete(&mut self, key: Field) {
        // Hint: Update with EMPTY_LEAF value and clean up unnecessary nodes
        todo!()
    }

    // TODO: Get the current root hash
    fn get_root(&self) -> Field {
        todo!()
    }

    // Helper: Convert a key to its binary representation for tree traversal
    fn key_to_path(key: Field, depth: u32) -> [bool; TREE_DEPTH] {
        // Hint: Convert key to binary and pad/truncate to TREE_DEPTH bits
        todo!()
    }

    // Helper: Generate a unique node identifier for storage
    fn node_key(level: u32, position: Field) -> Field {
        // Hint: Combine level and position into a unique identifier
        // Could use: level * 2^256 + position (or similar encoding)
        todo!()
    }

    // Helper: Calculate hash of two children, using defaults for empty nodes
    fn hash_children(left: Field, right: Field) -> Field {
        pedersen_hash([left, right])
    }
}

#[test]
fn test_sparse_tree_basic_operations() {
    let mut tree = SparseMerkleTree::new();

    // Test insertion
    let key1 = 123;
    let value1 = 456;
    tree.update(key1, value1);

    assert(tree.get(key1) == value1);
    assert(tree.get(999) == EMPTY_LEAF); // Non-existent key

    // Test update
    let new_value1 = 789;
    tree.update(key1, new_value1);
    assert(tree.get(key1) == new_value1);
}

#[test]
fn test_sparse_tree_proofs() {
    let mut tree = SparseMerkleTree::new();

    let key = 42;
    let value = 100;
    tree.update(key, value);

    // Generate and verify inclusion proof
    let (sibling_path, proven_value) = tree.generate_proof(key);
    assert(proven_value == value);

    let is_valid = SparseMerkleTree::verify_proof(
        tree.get_root(),
        key,
        value,
        sibling_path
    );
    assert(is_valid);
}

#[test]
fn test_sparse_tree_non_existence_proof() {
    let mut tree = SparseMerkleTree::new();

    // Add some values
    tree.update(100, 200);
    tree.update(300, 400);

    // Prove non-existence of a key
    let non_existent_key = 999;
    let (sibling_path, proven_value) = tree.generate_proof(non_existent_key);

    // Non-existent keys should have EMPTY_LEAF value
    assert(proven_value == EMPTY_LEAF);

    // Proof should still be valid
    let is_valid = SparseMerkleTree::verify_proof(
        tree.get_root(),
        non_existent_key,
        EMPTY_LEAF,
        sibling_path
    );
    assert(is_valid);
}

#[test]
fn test_sparse_tree_deletion() {
    let mut tree = SparseMerkleTree::new();

    let key = 123;
    let value = 456;

    // Insert and verify
    tree.update(key, value);
    assert(tree.get(key) == value);

    // Delete and verify
    tree.delete(key);
    assert(tree.get(key) == EMPTY_LEAF);

    // Verify proof after deletion
    let (sibling_path, proven_value) = tree.generate_proof(key);
    assert(proven_value == EMPTY_LEAF);

    let is_valid = SparseMerkleTree::verify_proof(
        tree.get_root(),
        key,
        EMPTY_LEAF,
        sibling_path
    );
    assert(is_valid);
}

#[test]
fn test_sparse_tree_multiple_operations() {
    let mut tree = SparseMerkleTree::new();

    // Insert multiple key-value pairs
    let keys = [10, 20, 30, 40, 50];
    let values = [100, 200, 300, 400, 500];

    for i in 0..keys.len() {
        tree.update(keys[i], values[i]);
    }

    // Verify all insertions
    for i in 0..keys.len() {
        assert(tree.get(keys[i]) == values[i]);

        let (sibling_path, proven_value) = tree.generate_proof(keys[i]);
        assert(proven_value == values[i]);

        let is_valid = SparseMerkleTree::verify_proof(
            tree.get_root(),
            keys[i],
            values[i],
            sibling_path
        );
        assert(is_valid);
    }
}

#[test]
fn test_default_hash_properties() {
    let tree = SparseMerkleTree::new();

    // Empty tree should have predictable root
    let empty_root = tree.get_root();
    assert(empty_root == tree.default_hashes[TREE_DEPTH]);

    // Default hashes should follow the pattern
    // default_hashes[i] = hash(default_hashes[i-1], default_hashes[i-1])
    for i in 1..tree.default_hashes.len() {
        let expected = SparseMerkleTree::hash_children(
            tree.default_hashes[i-1],
            tree.default_hashes[i-1]
        );
        assert(tree.default_hashes[i] == expected);
    }
}

#[test]
fn test_large_key_space() {
    let mut tree = SparseMerkleTree::new();

    // Test with large, sparse keys
    let large_key1 = 0x1000000000000000; // Very large key
    let large_key2 = 0x8000000000000000; // Another large key

    tree.update(large_key1, 111);
    tree.update(large_key2, 222);

    assert(tree.get(large_key1) == 111);
    assert(tree.get(large_key2) == 222);

    // Verify proofs work for large keys
    let (sibling_path1, value1) = tree.generate_proof(large_key1);
    assert(value1 == 111);

    let is_valid1 = SparseMerkleTree::verify_proof(
        tree.get_root(),
        large_key1,
        111,
        sibling_path1
    );
    assert(is_valid1);
}
```
