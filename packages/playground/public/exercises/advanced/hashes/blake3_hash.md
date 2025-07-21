---
id: blake3_hash
title: blake3_hash
category: hashes
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Blake3 is a modern cryptographic hash function with tree structure and parallelization capabilities. Implement hashing functions and compare with Blake2s.

      1. Basic Blake3 Hash Implementation

      ```noir
      fn compute_blake3_hash<let N: u32>(input: [u8; N]) -> [u8; 32] {
          std::hash::blake3(input)
      }
      ```

      2. Blake Function Comparison

      ```noir
      fn compare_blake_functions<let N: u32>(input: [u8; N]) -> ([u8; 32], [u8; 32]) {
          let blake3_hash = std::hash::blake3(input);
          let blake2s_hash = std::hash::blake2s(input);
          (blake3_hash, blake2s_hash)
      }
      ```

      3. Scalability Testing

      ```noir
      fn test_blake3_scalability() -> bool {
          let small_input = [1, 2, 3];
          let medium_input = [1; 32];
          let large_input = [1; 128];
          
          let hash_small = compute_blake3_hash(small_input);
          let hash_medium = compute_blake3_hash(medium_input);
          let hash_large = compute_blake3_hash(large_input);
          
          (hash_small != hash_medium) &
          (hash_medium != hash_large) &
          (hash_small != hash_large)
      }
      ```

      4. Structured Data Hashing

      ```noir
      fn hash_structured_data(
          timestamp: u32,
          user_id: u32,
          message_length: u32,
          checksum: u32
      ) -> [u8; 32] {
          let data = [
              (timestamp >> 24) as u8, (timestamp >> 16) as u8,
              (timestamp >> 8) as u8, timestamp as u8,
              (user_id >> 24) as u8, (user_id >> 16) as u8,
              (user_id >> 8) as u8, user_id as u8,
              (message_length >> 24) as u8, (message_length >> 16) as u8,
              (message_length >> 8) as u8, message_length as u8,
              (checksum >> 24) as u8, (checksum >> 16) as u8,
              (checksum >> 8) as u8, checksum as u8
          ];
          
          compute_blake3_hash(data)
      }
      ```
    description: >-
      Blake3 is a modern cryptographic hash function with tree structure enabling parallelization and incremental updates. Learn to implement Blake3 and compare it with Blake2s performance.


      In this exercise, you will:

      1. Use Blake3 to hash various data types

      2. Compare Blake3 with Blake2s performance characteristics

      3. Understand tree hashing advantages

      4. Explore incremental hashing patterns

      #### Docs
    docLink: >-
      https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives/hashes#blake3
---

```noir
use std::hash::{blake3, blake2s};

// Compute Blake3 hash of a byte array
fn compute_blake3_hash<let N: u32>(input: [u8; N]) -> [u8; 32] {
    // TODO: Implement Blake3 hashing
    // HINT: Use std::hash::blake3(input)
    // Blake3 returns a 32-byte hash like Blake2s

    [0; 32] // Replace this with your implementation
}

// Compare Blake3 with Blake2s on the same input
fn compare_blake_functions<let N: u32>(input: [u8; N]) -> ([u8; 32], [u8; 32]) {
    // TODO: Hash the same input with both Blake3 and Blake2s
    // Return (blake3_hash, blake2s_hash)
    // This shows they produce different outputs for the same input

    ([0; 32], [0; 32]) // Replace this with your implementation
}

// Test Blake3's performance with different input sizes
fn test_blake3_scalability() -> bool {
    let small_input = [1, 2, 3];
    let medium_input = [1; 32];   // 32 bytes
    let large_input = [1; 128];   // 128 bytes

    let hash_small = compute_blake3_hash(small_input);
    let hash_medium = compute_blake3_hash(medium_input);
    let hash_large = compute_blake3_hash(large_input);

    // All should produce valid 32-byte hashes that are different
    (hash_small != hash_medium) &
    (hash_medium != hash_large) &
    (hash_small != hash_large)
}

// Simulate incremental hashing (Blake3's tree structure advantage)
fn incremental_hash_simulation(chunk1: [u8; 4], chunk2: [u8; 4]) -> [u8; 32] {
    // TODO: In real Blake3, you could hash chunks incrementally
    // For this exercise, we'll simulate by concatenating then hashing
    // This demonstrates the concept of incremental processing

    let combined = [
        chunk1[0], chunk1[1], chunk1[2], chunk1[3],
        chunk2[0], chunk2[1], chunk2[2], chunk2[3]
    ];

    compute_blake3_hash(combined)
}

// Test Blake3 with structured data (simulating real-world usage)
fn hash_structured_data(
    timestamp: u32,
    user_id: u32,
    message_length: u32,
    checksum: u32
) -> [u8; 32] {
    // TODO: Convert structured data to bytes and hash with Blake3
    // This simulates hashing protocol messages or data structures

    let data = [
        (timestamp >> 24) as u8, (timestamp >> 16) as u8,
        (timestamp >> 8) as u8, timestamp as u8,
        (user_id >> 24) as u8, (user_id >> 16) as u8,
        (user_id >> 8) as u8, user_id as u8,
        (message_length >> 24) as u8, (message_length >> 16) as u8,
        (message_length >> 8) as u8, message_length as u8,
        (checksum >> 24) as u8, (checksum >> 16) as u8,
        (checksum >> 8) as u8, checksum as u8
    ];

    compute_blake3_hash(data)
}

fn main(
    input: [u8; 8],
    expected_hash: [u8; 32],
    chunk1: [u8; 4],
    chunk2: [u8; 4]
) -> pub bool {
    // Test basic Blake3 functionality
    let computed_hash = compute_blake3_hash(input);
    let basic_test = computed_hash == expected_hash;

    // Test scalability
    let scalability_test = test_blake3_scalability();

    // Test incremental hashing simulation
    let incremental_hash = incremental_hash_simulation(chunk1, chunk2);
    let incremental_test = incremental_hash.len() == 32;

    // Test comparison with Blake2s
    let (blake3_result, blake2s_result) = compare_blake_functions(input);
    let comparison_test = blake3_result != blake2s_result;

    // Test structured data hashing
    let structured_hash = hash_structured_data(1234567890, 42, 256, 0xDEADBEEF);
    let structured_test = structured_hash.len() == 32;

    basic_test & scalability_test & incremental_test & comparison_test & structured_test
}

#[test]
fn test_blake3_basic() {
    let input = [1, 2, 3, 4, 5, 6, 7, 8];
    let expected = blake3(input);

    let chunk1 = [1, 2, 3, 4];
    let chunk2 = [5, 6, 7, 8];

    assert(main(input, expected, chunk1, chunk2));
}

#[test]
fn test_blake3_vs_blake2s() {
    let test_data = [42, 123, 200, 255, 0, 128, 64, 32];

    let blake3_hash = blake3(test_data);
    let blake2s_hash = blake2s(test_data);

    // Should produce different hashes
    assert(blake3_hash != blake2s_hash);

    // Both should be 32 bytes
    assert(blake3_hash.len() == 32);
    assert(blake2s_hash.len() == 32);

    // Both should be deterministic
    assert(blake3(test_data) == blake3_hash);
    assert(blake2s(test_data) == blake2s_hash);
}

#[test]
fn test_blake3_empty_input() {
    let empty: [u8; 0] = [];
    let hash_empty = blake3(empty);

    // Should handle empty input gracefully
    assert(hash_empty.len() == 32);

    // Should be deterministic for empty input
    assert(blake3(empty) == hash_empty);
}

#[test]
fn test_blake3_large_inputs() {
    // Test with progressively larger inputs
    let small = [1; 1];
    let medium = [2; 64];
    let large = [3; 256];

    let hash_small = blake3(small);
    let hash_medium = blake3(medium);
    let hash_large = blake3(large);

    // All should be different
    assert(hash_small != hash_medium);
    assert(hash_medium != hash_large);
    assert(hash_small != hash_large);

    // All should be 32 bytes
    assert(hash_small.len() == 32);
    assert(hash_medium.len() == 32);
    assert(hash_large.len() == 32);
}

#[test]
fn test_blake3_avalanche_effect() {
    // Test that small changes create large differences
    let input1 = [1, 2, 3, 4, 5, 6, 7, 8];
    let input2 = [1, 2, 3, 4, 5, 6, 7, 9]; // Only last byte changed

    let hash1 = blake3(input1);
    let hash2 = blake3(input2);

    // Hashes should be completely different
    assert(hash1 != hash2);

    // Count different bytes (should be roughly half for good avalanche)
    let mut different_bytes = 0;
    for i in 0..32 {
        if hash1[i] != hash2[i] {
            different_bytes += 1;
        }
    }

    // Should have significant differences (at least a few bytes different)
    assert(different_bytes > 5);
}

#[test]
fn test_blake3_consistency() {
    // Test that Blake3 is consistent across multiple calls
    let test_input = [0xDE, 0xAD, 0xBE, 0xEF, 0xCA, 0xFE, 0xBA, 0xBE];

    let hash1 = blake3(test_input);
    let hash2 = blake3(test_input);
    let hash3 = blake3(test_input);

    // All should be identical
    assert(hash1 == hash2);
    assert(hash2 == hash3);
    assert(hash1 == hash3);
}

#[test]
fn test_incremental_concept() {
    // Demonstrate the concept behind Blake3's incremental hashing
    let part1 = [1, 2, 3, 4];
    let part2 = [5, 6, 7, 8];

    // Hash parts separately then combine (conceptual)
    let incremental_result = incremental_hash_simulation(part1, part2);

    // Hash all at once
    let combined_input = [1, 2, 3, 4, 5, 6, 7, 8];
    let direct_result = blake3(combined_input);

    // In this simulation, they should be the same
    assert(incremental_result == direct_result);
}
```
