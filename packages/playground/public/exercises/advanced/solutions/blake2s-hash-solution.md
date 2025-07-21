# Blake2s Hash - Solution

## Exercise ID: blake2s_hash

**Category:** hashes  
**Difficulty:** easy  
**Prerequisites:** []

## Description

Blake2s is a fast cryptographic hash function that outperforms SHA-2 while maintaining high security. Learn to implement Blake2s hashing and explore its deterministic and avalanche properties.

## Solution

```noir
use std::hash::blake2s;

// Basic Blake2s Hash Implementation
fn compute_blake2s_hash<let N: u32>(input: [u8; N]) -> [u8; 32] {
    std::hash::blake2s(input)
}

// Avalanche Effect Test
fn test_avalanche_effect() -> bool {
    let input1 = [1, 2, 3, 4];
    let input2 = [1, 2, 3, 5]; // Only last byte different

    let hash1 = compute_blake2s_hash(input1);
    let hash2 = compute_blake2s_hash(input2);

    hash1 != hash2
}

// Deterministic Hashing Test
fn test_deterministic_hashing() -> bool {
    let input = [42, 123, 255, 0, 100];
    let hash1 = compute_blake2s_hash(input);
    let hash2 = compute_blake2s_hash(input);

    hash1 == hash2
}

// Variable Input Size Handling
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

fn main(input: [u8; 4], expected_hash: [u8; 32]) -> pub bool {
    let computed_hash = compute_blake2s_hash(input);
    let correct_hash = computed_hash == expected_hash;

    // Test all properties
    let avalanche_ok = test_avalanche_effect();
    let deterministic_ok = test_deterministic_hashing();
    let variable_sizes_ok = test_variable_input_sizes();

    correct_hash & avalanche_ok & deterministic_ok & variable_sizes_ok
}

#[test]
fn test_blake2s_basic() {
    let input = [1, 2, 3, 4];
    let expected = std::hash::blake2s(input);
    assert(main(input, expected));
}

#[test]
fn test_blake2s_empty() {
    let input: [u8; 0] = [];
    let hash = compute_blake2s_hash(input);

    // Blake2s should handle empty input
    assert(hash.len() == 32);
}

#[test]
fn test_blake2s_large_input() {
    let large_input = [255; 128];
    let hash = compute_blake2s_hash(large_input);

    // Should produce 32-byte output regardless of input size
    assert(hash.len() == 32);
}

#[test]
fn test_blake2s_consistency() {
    let input = [100, 200, 50, 150];
    let hash1 = compute_blake2s_hash(input);
    let hash2 = compute_blake2s_hash(input);
    let hash3 = compute_blake2s_hash(input);

    // All should be identical
    assert(hash1 == hash2);
    assert(hash2 == hash3);
}
```

## Key Concepts

1. **Blake2s Performance**: Faster than SHA-2 while maintaining security
2. **32-byte Output**: Always produces 256-bit (32-byte) hash output
3. **Variable Input**: Can handle any size input efficiently
4. **Deterministic**: Same input always produces same output
5. **Avalanche Effect**: Small input changes create completely different outputs
6. **Security**: Cryptographically secure for most applications

## When to Use Blake2s

- High-performance applications requiring fast hashing
- When you need better performance than SHA-2
- Applications where speed matters more than maximum theoretical security
- Modern applications that can benefit from optimized implementations

## Documentation

- [Noir Blake2s Documentation](https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives/hashes#blake2s)
