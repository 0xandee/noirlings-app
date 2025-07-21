---
id: trie_basics
title: trie_basics
category: ethereum
difficulty: easy
tags: []
mode: test
prerequisites: ["keccak_hash"]
version: 1.0.0
locales:
  en:
    hint: >-
      Merkle Patricia Tries combine the efficiency of Patricia tries with Merkle tree security. Implement trie node types and basic operations for Ethereum state management.

      1. Trie Node Types

      ```noir
      enum TrieNode {
          Leaf([u8], [u8]),           // (key_end, value)
          Extension([u8], [u8; 32]),  // (shared_path, next_hash)
          Branch([[u8; 32]; 16], [u8]), // (children[16], value)
      }
      ```

      2. Key Path Conversion

      ```noir
      fn bytes_to_nibbles(bytes: [u8; 32]) -> [u8; 64] {
          let mut nibbles = [0; 64];
          for i in 0..32 {
              nibbles[i * 2] = (bytes[i] >> 4) & 0x0F;
              nibbles[i * 2 + 1] = bytes[i] & 0x0F;
          }
          nibbles
      }
      ```

      3. Node Hashing

      ```noir
      fn hash(self) -> [u8; 32] {
          let rlp_data = self.encode_rlp();
          keccak256(rlp_data)
      }
      ```

      4. Address to Key Path

      ```noir
      fn address_to_key_path(address: [u8; 20]) -> [u8; 64] {
          let hash = keccak256(address);
          bytes_to_nibbles(hash)
      }
      ```
    description: >-
      Merkle Patricia Tries are the fundamental data structure for Ethereum state storage. Learn to implement trie node types, key path conversion, and basic trie operations for blockchain state management.

      In this exercise, you will:
      1. Understand different trie node types (leaf, extension, branch)
      2. Convert addresses and keys to trie paths using nibbles
      3. Implement node hashing with keccak256
      4. Handle RLP encoding for trie data structures

      #### Docs
    docLink: "https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/"
---

```noir
use std::hash::keccak256;

// Merkle-Patricia trie node types in Ethereum
enum TrieNode {
    Leaf([u8], [u8]),           // (key_end, value) - stores final key-value pair
    Extension([u8], [u8; 32]),  // (shared_path, next_hash) - compresses common path
    Branch([[u8; 32]; 16], [u8]), // (children[16], value) - branches on nibble values
}

impl TrieNode {
    // TODO: Encode trie node using RLP for hashing
    fn encode_rlp(self) -> [u8] {
        // Hint: Different encoding based on node type
        // Leaf: [encoded_path, value]
        // Extension: [encoded_path, next_hash]
        // Branch: [child0, child1, ..., child15, value]
        todo!()
    }

    // TODO: Get the keccak256 hash of this node
    fn hash(self) -> [u8; 32] {
        // Hint: Hash the RLP-encoded node data
        todo!()
    }

    // TODO: Check if this is a leaf node
    fn is_leaf(self) -> bool {
        // Hint: Check the node type
        todo!()
    }

    // TODO: Check if this is an extension node
    fn is_extension(self) -> bool {
        todo!()
    }

    // TODO: Check if this is a branch node
    fn is_branch(self) -> bool {
        todo!()
    }

    // TODO: Get the value stored in this node (if any)
    fn get_value(self) -> [u8] {
        // Hint: Only leaf and branch nodes can store values
        todo!()
    }
}

// Key path utilities for trie traversal
struct KeyPath {
    nibbles: [u8; 64],  // Path as array of 4-bit nibbles
    length: u32,        // Actual length of the path
}

impl KeyPath {
    // TODO: Create new key path from nibbles
    fn new(nibbles: [u8; 64], length: u32) -> Self {
        // Hint: Validate that nibbles are 0-15 and length <= 64
        todo!()
    }

    // TODO: Get nibble at specific position
    fn get_nibble(self, index: u32) -> u8 {
        // Hint: Return nibble at index, or 0 if out of bounds
        todo!()
    }

    // TODO: Get remaining path after consuming some nibbles
    fn skip(self, count: u32) -> KeyPath {
        // Hint: Create new path starting from position 'count'
        todo!()
    }

    // TODO: Check if path is empty
    fn is_empty(self) -> bool {
        // Hint: Check if length is 0
        todo!()
    }

    // TODO: Compare two paths for equality
    fn equals(self, other: KeyPath) -> bool {
        // Hint: Compare length and nibbles
        todo!()
    }
}

// TODO: Convert bytes to nibbles for trie traversal
fn bytes_to_nibbles(bytes: [u8; 32]) -> [u8; 64] {
    // Hint: Each byte becomes two 4-bit nibbles
    // High nibble: (byte >> 4) & 0x0F
    // Low nibble: byte & 0x0F
    todo!()
}

// TODO: Convert nibbles back to bytes
fn nibbles_to_bytes(nibbles: [u8; 64]) -> [u8; 32] {
    // Hint: Combine pairs of nibbles into bytes
    // byte = (high_nibble << 4) | low_nibble
    todo!()
}

// TODO: Convert Ethereum address to trie key path
fn address_to_key_path(address: [u8; 20]) -> [u8; 64] {
    // Hint:
    // 1. Hash the address with keccak256
    // 2. Convert the hash to nibbles
    todo!()
}

// TODO: Convert storage key to trie key path
fn storage_key_to_path(key: [u8; 32]) -> [u8; 64] {
    // Hint: Similar to address_to_key_path but for storage keys
    todo!()
}

// TODO: Encode trie path for RLP (with terminator flag)
fn encode_path(path: [u8], is_leaf: bool) -> [u8] {
    // Hint: Ethereum uses HP (Hex-Prefix) encoding
    // - First nibble encodes odd/even length and leaf/extension flag
    // - Remaining nibbles are the actual path
    todo!()
}

// TODO: Decode trie path from RLP
fn decode_path(encoded: [u8]) -> ([u8], bool) {
    // Returns: (path, is_leaf)
    // Hint: Reverse of encode_path
    todo!()
}

// Simple trie utilities
struct TrieUtils {
    empty_root: [u8; 32],
}

impl TrieUtils {
    // TODO: Create new trie utilities
    fn new() -> Self {
        // Hint: Empty trie has a specific root hash
        todo!()
    }

    // TODO: Get empty trie root hash
    fn empty_trie_root() -> [u8; 32] {
        // Hint: Hash of empty RLP list
        todo!()
    }

    // TODO: Calculate depth of a trie path
    fn calculate_depth(path: KeyPath) -> u32 {
        // Hint: Return the length of the path
        todo!()
    }

    // TODO: Validate trie node structure
    fn validate_node(node: TrieNode) -> bool {
        // Hint: Check node follows Ethereum trie rules
        todo!()
    }
}

fn main(
    address: [u8; 20],
    storage_key: [u8; 32]
) -> pub bool {
    // Test address to key path conversion
    let addr_path = address_to_key_path(address);
    let addr_path_valid = addr_path.len() == 64;

    // Test storage key to path conversion
    let storage_path = storage_key_to_path(storage_key);
    let storage_path_valid = storage_path.len() == 64;

    // Test nibble conversion
    let nibbles = bytes_to_nibbles(storage_key);
    let reconstructed = nibbles_to_bytes(nibbles);
    let nibble_conversion_correct = reconstructed == storage_key;

    addr_path_valid & storage_path_valid & nibble_conversion_correct
}

#[test]
fn test_bytes_to_nibbles() {
    let bytes = [
        0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0,
        0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88,
        0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff, 0x00,
        0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef
    ];

    let nibbles = bytes_to_nibbles(bytes);

    assert(nibbles.len() == 64);

    // Check first few nibbles
    assert(nibbles[0] == 1);  // 0x12 -> 1, 2
    assert(nibbles[1] == 2);
    assert(nibbles[2] == 3);  // 0x34 -> 3, 4
    assert(nibbles[3] == 4);
    assert(nibbles[4] == 5);  // 0x56 -> 5, 6
    assert(nibbles[5] == 6);

    // Check reconstruction
    let reconstructed = nibbles_to_bytes(nibbles);
    assert(reconstructed == bytes);
}

#[test]
fn test_address_to_key_path() {
    let address = [
        0xd1, 0x22, 0x0a, 0x0c, 0xf4, 0x75, 0xa9, 0x66,
        0xe5, 0x4d, 0x11, 0xe9, 0xf3, 0x55, 0x4e, 0x4e,
        0xba, 0x6f, 0xa5, 0x7a
    ];

    let key_path = address_to_key_path(address);

    // Should produce 64 nibbles
    assert(key_path.len() == 64);

    // Each nibble should be 0-15
    for i in 0..64 {
        assert(key_path[i] <= 15);
    }

    // Path should be deterministic
    let key_path2 = address_to_key_path(address);
    assert(key_path == key_path2);
}

#[test]
fn test_key_path_operations() {
    let nibbles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0,
                   1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0,
                   1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0,
                   1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];

    let path = KeyPath::new(nibbles, 16);

    // Test basic operations
    assert(!path.is_empty());
    assert(path.get_nibble(0) == 1);
    assert(path.get_nibble(1) == 2);

    // Test skipping
    let skipped = path.skip(4);
    assert(skipped.get_nibble(0) == 5);

    // Test equality
    let path2 = KeyPath::new(nibbles, 16);
    assert(path.equals(path2));
}

#[test]
fn test_trie_node_types() {
    // Test leaf node
    let leaf_key = [1, 2, 3, 4];
    let leaf_value = [0x42, 0x24];
    let leaf = TrieNode::Leaf(leaf_key, leaf_value);

    assert(leaf.is_leaf());
    assert(!leaf.is_extension());
    assert(!leaf.is_branch());

    let leaf_val = leaf.get_value();
    assert(leaf_val == leaf_value);

    // Test extension node
    let ext_path = [5, 6, 7];
    let ext_hash = [1; 32];
    let extension = TrieNode::Extension(ext_path, ext_hash);

    assert(!extension.is_leaf());
    assert(extension.is_extension());
    assert(!extension.is_branch());

    // Test branch node
    let children = [[0; 32]; 16];
    let branch_value = [0x99];
    let branch = TrieNode::Branch(children, branch_value);

    assert(!branch.is_leaf());
    assert(!branch.is_extension());
    assert(branch.is_branch());

    let branch_val = branch.get_value();
    assert(branch_val == branch_value);
}

#[test]
fn test_path_encoding() {
    let path = [1, 2, 3, 4, 5];

    // Test leaf encoding (terminating)
    let encoded_leaf = encode_path(path, true);
    let (decoded_path, is_leaf) = decode_path(encoded_leaf);

    assert(is_leaf);
    assert(decoded_path == path);

    // Test extension encoding (non-terminating)
    let encoded_ext = encode_path(path, false);
    let (decoded_path2, is_leaf2) = decode_path(encoded_ext);

    assert(!is_leaf2);
    assert(decoded_path2 == path);
}

#[test]
fn test_node_hashing() {
    let leaf = TrieNode::Leaf([1, 2, 3], [0x42]);
    let hash1 = leaf.hash();
    let hash2 = leaf.hash();

    // Hash should be deterministic
    assert(hash1 == hash2);

    // Hash should be 32 bytes
    assert(hash1.len() == 32);

    // Different nodes should have different hashes
    let different_leaf = TrieNode::Leaf([1, 2, 4], [0x42]);
    let hash3 = different_leaf.hash();
    assert(hash1 != hash3);
}

#[test]
fn test_trie_utils() {
    let utils = TrieUtils::new();

    // Test empty trie root
    let empty_root = TrieUtils::empty_trie_root();
    assert(empty_root.len() == 32);

    // Test path depth calculation
    let nibbles = [1; 64];
    let path = KeyPath::new(nibbles, 10);
    let depth = TrieUtils::calculate_depth(path);
    assert(depth == 10);

    // Test node validation
    let valid_leaf = TrieNode::Leaf([1, 2, 3], [0x42]);
    assert(TrieUtils::validate_node(valid_leaf));
}

#[test]
fn test_storage_key_conversion() {
    let storage_key = [
        0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff, 0x00, 0x11,
        0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99,
        0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff, 0x00, 0x11,
        0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99
    ];

    let path = storage_key_to_path(storage_key);

    // Should produce 64 nibbles
    assert(path.len() == 64);

    // Each nibble should be valid
    for i in 0..64 {
        assert(path[i] <= 15);
    }

    // Should be deterministic
    let path2 = storage_key_to_path(storage_key);
    assert(path == path2);
}

#[test]
fn test_edge_cases() {
    // Test empty path
    let empty_nibbles = [0; 64];
    let empty_path = KeyPath::new(empty_nibbles, 0);
    assert(empty_path.is_empty());

    // Test full length path
    let full_nibbles = [15; 64];
    let full_path = KeyPath::new(full_nibbles, 64);
    assert(!full_path.is_empty());

    // Test path skipping beyond length
    let skipped_too_far = full_path.skip(70);
    assert(skipped_too_far.is_empty());
}
```
