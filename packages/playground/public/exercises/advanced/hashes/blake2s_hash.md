---
id: blake2s_hash
title: blake2s_hash
category: hashes
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Blake2s is a fast cryptographic hash function that produces 32-byte outputs. Implement hashing functions and test hash properties like determinism and avalanche effect.

      1. Basic Blake2s Hash Implementation

      ```noir
      fn compute_blake2s_hash<let N: u32>(input: [u8; N]) -> [u8; 32] {
          std::hash::blake2s(input)
      }
      ```

      2. Avalanche Effect Test

      ```noir
      fn test_avalanche_effect() -> bool {
          let input1 = [1, 2, 3, 4];
          let input2 = [1, 2, 3, 5]; // Only last byte different
          
          let hash1 = compute_blake2s_hash(input1);
          let hash2 = compute_blake2s_hash(input2);
          
          hash1 != hash2
      }
      ```

      3. Deterministic Hashing Test

      ```noir
      fn test_deterministic_hashing() -> bool {
          let input = [42, 123, 255, 0, 100];
          let hash1 = compute_blake2s_hash(input);
          let hash2 = compute_blake2s_hash(input);
          
          hash1 == hash2
      }
      ```

      4. Variable Input Size Handling

      ```noir
      fn test_variable_input_sizes() -> bool {
          let small_input = [1];
          let medium_input = [1, 2, 3, 4, 5, 6, 7, 8];
          let large_input = [1; 64];
          
          let hash_small = compute_blake2s_hash(small_input);
          let hash_medium = compute_blake2s_hash(medium_input);
          let hash_large = compute_blake2s_hash(large_input);
          
          (hash_small != hash_medium) &
          (hash_medium != hash_large) &
          (hash_small != hash_large)
      }
      ```
    description: >-
      Blake2s is a fast cryptographic hash function that outperforms SHA-2 while maintaining high security. Learn to implement Blake2s hashing and explore its deterministic and avalanche properties.


      In this exercise, you will:

      1. Use Blake2s to hash byte arrays

      2. Compare Blake2s performance characteristics 

      3. Understand when to use Blake2s vs other hash functions

      4. Explore the deterministic and avalanche properties

      #### Docs
    docLink: >-
      https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives/hashes#blake2s
---

```noir
use std::hash::blake2s;

// Compute Blake2s hash of a byte array
fn compute_blake2s_hash<let N: u32>(input: [u8; N]) -> [u8; 32] {
    // TODO: Implement Blake2s hashing
    // HINT: Use std::hash::blake2s(input)
    // Blake2s returns a 32-byte hash

    [0; 32] // Replace this with your implementation
}

// Test the avalanche effect - small input change should drastically change output
fn test_avalanche_effect() -> bool {
    let input1 = [1, 2, 3, 4];
    let input2 = [1, 2, 3, 5]; // Only last byte different

    let hash1 = compute_blake2s_hash(input1);
    let hash2 = compute_blake2s_hash(input2);

    // Hashes should be completely different
    hash1 != hash2
}

// Test deterministic property
fn test_deterministic_hashing() -> bool {
    let input = [42, 123, 255, 0, 100];
    let hash1 = compute_blake2s_hash(input);
    let hash2 = compute_blake2s_hash(input);

    // Same input should always produce same hash
    hash1 == hash2
}

// Compare Blake2s with different input sizes
fn test_variable_input_sizes() -> bool {
    let small_input = [1];
    let medium_input = [1, 2, 3, 4, 5, 6, 7, 8];
    let large_input = [1; 64]; // 64 bytes of 1s

    let hash_small = compute_blake2s_hash(small_input);
    let hash_medium = compute_blake2s_hash(medium_input);
    let hash_large = compute_blake2s_hash(large_input);

    // All hashes should be different and 32 bytes long
    (hash_small != hash_medium) &
    (hash_medium != hash_large) &
    (hash_small != hash_large)
}

// Test empty input handling
fn test_empty_input_hash() -> [u8; 32] {
    let empty_input: [u8; 0] = [];
    compute_blake2s_hash(empty_input)
}

fn main(input: [u8; 4], expected_hash: [u8; 32]) -> pub bool {
    let computed_hash = compute_blake2s_hash(input);

    // Test that our computation matches expected
    let correct_hash = computed_hash == expected_hash;

    // Test deterministic property
    let deterministic_test = test_deterministic_hashing();

    // Test avalanche effect
    let avalanche_test = test_avalanche_effect();

    // Test variable input sizes
    let variable_size_test = test_variable_input_sizes();

    correct_hash & deterministic_test & avalanche_test & variable_size_test
}

#[test]
fn test_blake2s_basic() {
    let input = [1, 2, 3, 4];
    let expected = blake2s(input);
    assert(main(input, expected));
}

#[test]
fn test_blake2s_string() {
    let message = "Hello Noir!";
    let input = message.as_bytes();
    let hash = blake2s(input);

    // Test that we get a 32-byte output
    assert(hash.len() == 32);

    // Test deterministic property
    let hash2 = blake2s(input);
    assert(hash == hash2);
}

#[test]
fn test_blake2s_vs_other_hashes() {
    let input = [42, 123, 200];

    // Get Blake2s hash
    let blake2s_hash = blake2s(input);

    // Compare with Pedersen hash (convert to Field array first)
    let field_input = input.map(|x| x as Field);
    let pedersen_hash = std::hash::pedersen_hash(field_input);

    // They should be different types/formats
    // Blake2s produces [u8; 32], Pedersen produces Field
    assert(blake2s_hash.len() == 32);

    // Test that Blake2s is deterministic
    let blake2s_hash2 = blake2s(input);
    assert(blake2s_hash == blake2s_hash2);
}

#[test]
fn test_blake2s_edge_cases() {
    // Test with all zeros
    let zeros = [0; 8];
    let hash_zeros = blake2s(zeros);

    // Test with all ones
    let ones = [255; 8];
    let hash_ones = blake2s(ones);

    // Should produce different hashes
    assert(hash_zeros != hash_ones);

    // Test with single byte
    let single = [42];
    let hash_single = blake2s(single);
    assert(hash_single.len() == 32);
}
```
