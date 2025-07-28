---
id: indexed_merkle_tree
title: indexed_merkle_tree
category: merkle_trees
difficulty: hard
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Indexed Merkle trees combine tree structure with value-to-position mapping for efficient lookups. Implement insertion, membership checks, and proof generation.

      1. Tree Initialization

      ```noir

      fn new() -> Self {
          IndexedMerkleTree {
              nodes: [0; 511],
              index: [0; MAX_LEAVES],
              leaf_count: 0,
              root: 0
          }
      }

      ```

      2. Value Insertion

      ```noir

      fn insert(&mut self, value: Field) -> u32 {
          // Check if already exists
          let existing_index = self.get_index(value);
          if existing_index != 0 {
              return existing_index;
          }
          
          // Insert at next available position
          let leaf_index = self.leaf_count;
          self.index[leaf_index] = value;
          self.update_tree_nodes(leaf_index, value);
          self.leaf_count += 1;
          
          leaf_index
      }

      ```

      3. Membership Check

      ```noir

      fn contains(&self, value: Field) -> bool {
          self.get_index(value) != 0
      }

      fn get_index(&self, value: Field) -> u32 {
          for i in 0..self.leaf_count {
              if self.index[i] == value {
                  return i;
              }
          }
          0
      }

      ```

      4. Membership Proof Generation

      ```noir

      fn generate_membership_proof(&self, value: Field) -> (bool, [Field; TREE_DEPTH], u32) {
          let leaf_index = self.get_index(value);
          
          if leaf_index == 0 {
              return (false, [0; TREE_DEPTH], 0);
          }
          
          let mut sibling_path = [0; TREE_DEPTH];
          let mut current_index = leaf_index;
          
          for level in 0..TREE_DEPTH {
              let sibling_index = if current_index % 2 == 0 { current_index + 1 } else { current_index - 1 };
              sibling_path[level] = self.nodes[get_node_index(level, sibling_index)];
              current_index = current_index / 2;
          }
          
          (true, sibling_path, leaf_index)
      }

      ```

      5. Tree Node Updates

      ```noir

      fn update_tree_nodes(&mut self, leaf_index: u32, leaf_value: Field) {
          // Set leaf value
          let leaf_node_index = get_node_index(0, leaf_index);
          self.nodes[leaf_node_index] = leaf_value;
          
          // Update parent nodes
          let mut current_index = leaf_index;
          for level in 1..=TREE_DEPTH {
              let parent_index = current_index / 2;
              let left_child = current_index - (current_index % 2);
              let right_child = left_child + 1;
              
              let left_value = self.nodes[get_node_index(level - 1, left_child)];
              let right_value = self.nodes[get_node_index(level - 1, right_child)];
              
              self.nodes[get_node_index(level, parent_index)] = pedersen_hash([left_value, right_value]);
              current_index = parent_index;
          }
          
          self.root = self.nodes[get_node_index(TREE_DEPTH, 0)];
      }

      ```
    docLink: "https://noir-lang.org/docs/noir/standard_library/merkle_trees"
    description: >-
      Indexed Merkle trees extend basic Merkle trees by adding an index that maps values to their positions. Learn to implement indexed trees for efficient membership proofs, non-membership proofs, and dynamic tree updates in privacy-preserving systems.

      #### Docs
---

```noir
use std::hash::pedersen_hash;

global TREE_DEPTH: u32 = 8;
global MAX_LEAVES: u32 = 256; // 2^TREE_DEPTH

struct IndexedMerkleTree {
    // The tree structure (internal nodes and leaves)
    nodes: [Field; 511], // 2^(DEPTH+1) - 1 nodes total
    // Index mapping: value -> leaf_index (0 means not present)
    index: [Field; MAX_LEAVES],
    // Current number of leaves in the tree
    leaf_count: u32,
    // Root hash of the tree
    root: Field,
}

impl IndexedMerkleTree {
    // TODO: Create a new empty indexed Merkle tree
    fn new() -> Self {
        todo!()
    }

    // TODO: Insert a new value into the tree and update the index
    fn insert(&mut self, value: Field) -> u32 {
        // Hint:
        // 1. Check if value already exists using the index
        // 2. If not, add to next available leaf position
        // 3. Update the index mapping
        // 4. Recalculate affected tree nodes up to root
        // 5. Return the leaf index where value was inserted
        todo!()
    }

    // TODO: Check if a value exists in the tree
    fn contains(&self, value: Field) -> bool {
        // Hint: Use the index to quickly check membership
        todo!()
    }

    // TODO: Get the leaf index of a value (returns 0 if not found)
    fn get_index(&self, value: Field) -> u32 {
        // Hint: Look up the value in the index mapping
        todo!()
    }

    // TODO: Generate a membership proof for a value
    fn generate_membership_proof(&self, value: Field) -> (bool, [Field; TREE_DEPTH], u32) {
        // Returns: (is_member, sibling_path, leaf_index)
        // Hint:
        // 1. Check if value exists using index
        // 2. If exists, generate the sibling path from leaf to root
        // 3. Return the proof components
        todo!()
    }

    // TODO: Generate a non-membership proof
    fn generate_non_membership_proof(&self, value: Field) -> (bool, Field, [Field; TREE_DEPTH], u32) {
        // Returns: (is_non_member, closest_value, sibling_path, closest_index)
        // Hint:
        // 1. Check that value is not in index
        // 2. Find the closest existing value (for ordered sets)
        // 3. Generate proof for the closest value
        // 4. This proves the queried value would be in a different position
        todo!()
    }

    // TODO: Verify a membership proof
    fn verify_membership_proof(
        root: Field,
        value: Field,
        sibling_path: [Field; TREE_DEPTH],
        leaf_index: u32
    ) -> bool {
        // Hint: Reconstruct the root using the sibling path and verify
        todo!()
    }

    // TODO: Update the tree after inserting at a specific leaf index
    fn update_tree_nodes(&mut self, leaf_index: u32, leaf_value: Field) {
        // Hint:
        // 1. Set the leaf value
        // 2. Recalculate parent nodes up to the root
        // 3. Update the root field
        todo!()
    }
}

// Helper function to compute tree node index from level and position
fn get_node_index(level: u32, position: u32) -> u32 {
    // Hint: In a complete binary tree stored as array,
    // level 0 (leaves) starts at index 2^TREE_DEPTH - 1
    // level 1 starts at index 2^(TREE_DEPTH-1) - 1, etc.
    todo!()
}

#[test]
fn test_indexed_tree_basic_operations() {
    let mut tree = IndexedMerkleTree::new();

    // Insert some values
    let value1 = 100;
    let value2 = 200;
    let value3 = 300;

    let index1 = tree.insert(value1);
    let index2 = tree.insert(value2);
    let index3 = tree.insert(value3);

    // Check membership
    assert(tree.contains(value1));
    assert(tree.contains(value2));
    assert(tree.contains(value3));
    assert(!tree.contains(999));

    // Check indices
    assert(tree.get_index(value1) == index1);
    assert(tree.get_index(value2) == index2);
    assert(tree.get_index(value3) == index3);
    assert(tree.get_index(999) == 0);
}

#[test]
fn test_membership_proofs() {
    let mut tree = IndexedMerkleTree::new();

    let value = 42;
    tree.insert(value);
    tree.insert(100);
    tree.insert(200);

    // Generate membership proof
    let (is_member, sibling_path, leaf_index) = tree.generate_membership_proof(value);

    assert(is_member);

    // Verify the proof
    let is_valid = IndexedMerkleTree::verify_membership_proof(
        tree.root,
        value,
        sibling_path,
        leaf_index
    );

    assert(is_valid);
}

#[test]
fn test_non_membership_proofs() {
    let mut tree = IndexedMerkleTree::new();

    tree.insert(100);
    tree.insert(200);
    tree.insert(300);

    // Test non-membership for a value not in tree
    let non_member_value = 150;
    let (is_non_member, closest_value, sibling_path, closest_index) =
        tree.generate_non_membership_proof(non_member_value);

    assert(is_non_member);
    assert(!tree.contains(non_member_value));

    // The closest value should be one that's actually in the tree
    assert(tree.contains(closest_value));
}

#[test]
fn test_duplicate_insertion() {
    let mut tree = IndexedMerkleTree::new();

    let value = 42;
    let index1 = tree.insert(value);
    let index2 = tree.insert(value); // Try to insert again

    // Should return the same index (no duplicates)
    assert(index1 == index2);
    assert(tree.leaf_count == 1); // Count shouldn't increase
}

#[test]
fn test_tree_properties() {
    let mut tree = IndexedMerkleTree::new();

    // Insert values and check tree properties
    let values = [10, 20, 30, 40, 50];

    for value in values {
        tree.insert(value);
    }

    // All values should be findable
    for value in values {
        assert(tree.contains(value));

        let (is_member, sibling_path, leaf_index) = tree.generate_membership_proof(value);
        assert(is_member);

        let is_valid = IndexedMerkleTree::verify_membership_proof(
            tree.root,
            value,
            sibling_path,
            leaf_index
        );
        assert(is_valid);
    }

    assert(tree.leaf_count == values.len());
}
```
