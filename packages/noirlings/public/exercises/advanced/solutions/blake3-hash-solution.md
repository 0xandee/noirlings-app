# Blake3 Hash - Solution

## Exercise ID: blake3_hash

**Category:** hashes  
**Difficulty:** easy  
**Prerequisites:** []

## Description

Blake3 is a modern cryptographic hash function with tree structure enabling parallelization and incremental updates. Learn to implement Blake3 and compare it with Blake2s performance.

## Solution

```noir
use std::hash::{blake3, blake2s};

// Basic Blake3 Hash Implementation
fn compute_blake3_hash<let N: u32>(input: [u8; N]) -> [u8; 32] {
    std::hash::blake3(input)
}

// Blake Function Comparison
fn compare_blake_functions<let N: u32>(input: [u8; N]) -> ([u8; 32], [u8; 32]) {
    let blake3_hash = std::hash::blake3(input);
    let blake2s_hash = std::hash::blake2s(input);
    (blake3_hash, blake2s_hash)
}

// Scalability Testing
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

// Structured Data Hashing
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

fn main(input: [u8; 4], expected_hash: [u8; 32]) -> pub bool {
    let computed_hash = compute_blake3_hash(input);
    let correct_hash = computed_hash == expected_hash;

    // Test scalability
    let scalability_ok = test_blake3_scalability();

    // Test structured data hashing
    let structured_hash = hash_structured_data(12345, 67890, 1024, 999);
    let structured_ok = structured_hash.len() == 32;

    // Compare with Blake2s
    let (blake3_result, blake2s_result) = compare_blake_functions(input);
    let comparison_ok = blake3_result != blake2s_result; // Should be different

    correct_hash & scalability_ok & structured_ok & comparison_ok
}

#[test]
fn test_blake3_basic() {
    let input = [1, 2, 3, 4];
    let expected = std::hash::blake3(input);
    assert(main(input, expected));
}

#[test]
fn test_blake3_vs_blake2s() {
    let input = [100, 200, 50, 75];
    let blake3_hash = compute_blake3_hash(input);
    let blake2s_hash = std::hash::blake2s(input);

    // Different algorithms should produce different results
    assert(blake3_hash != blake2s_hash);
    // Both should produce 32-byte outputs
    assert(blake3_hash.len() == 32);
    assert(blake2s_hash.len() == 32);
}

#[test]
fn test_blake3_deterministic() {
    let input = [42, 84, 126, 168];
    let hash1 = compute_blake3_hash(input);
    let hash2 = compute_blake3_hash(input);
    let hash3 = compute_blake3_hash(input);

    // All hashes should be identical
    assert(hash1 == hash2);
    assert(hash2 == hash3);
}

#[test]
fn test_structured_data() {
    let timestamp = 1234567890;
    let user_id = 42;
    let message_length = 256;
    let checksum = 0xDEADBEEF;

    let hash1 = hash_structured_data(timestamp, user_id, message_length, checksum);
    let hash2 = hash_structured_data(timestamp, user_id, message_length, checksum);

    // Should be deterministic
    assert(hash1 == hash2);

    // Different timestamp should produce different hash
    let hash3 = hash_structured_data(timestamp + 1, user_id, message_length, checksum);
    assert(hash1 != hash3);
}

#[test]
fn test_blake3_large_data() {
    let large_data = [255; 256];
    let hash = compute_blake3_hash(large_data);

    // Should handle large inputs efficiently
    assert(hash.len() == 32);
}
```

## Key Concepts

1. **Tree Structure**: Blake3 uses a tree structure that enables parallelization
2. **Performance**: Often faster than Blake2s, especially for large inputs
3. **Incremental Updates**: Supports incremental hashing (though not shown in basic API)
4. **Deterministic**: Same input always produces same output
5. **Fixed Output**: Always produces 32-byte output
6. **Structured Data**: Can efficiently hash structured data by serializing fields

## Blake3 vs Blake2s

| Feature             | Blake3                         | Blake2s          |
| ------------------- | ------------------------------ | ---------------- |
| Speed               | Faster (especially large data) | Fast             |
| Parallelization     | Yes (tree structure)           | Limited          |
| Incremental Updates | Yes                            | No               |
| Memory Usage        | Lower                          | Higher           |
| Maturity            | Newer                          | More established |

## Use Cases

- High-performance applications with large data
- Applications that can benefit from parallelization
- Systems requiring incremental hashing
- Modern applications where cutting-edge performance matters

## Documentation

- [Noir Blake3 Documentation](https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives/hashes#blake3)
