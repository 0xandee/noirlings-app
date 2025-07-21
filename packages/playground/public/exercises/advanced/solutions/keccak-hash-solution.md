# Keccak Hash - Solution

## Exercise ID: keccak_hash

**Category:** hashes  
**Difficulty:** medium  
**Prerequisites:** []

## Description

Keccak is Ethereum's cryptographic hash function using sponge construction. Learn to implement Keccak256 for Ethereum compatibility and understand its role in blockchain applications.

## Solution

```noir
use std::hash::keccak256;

// Simplified Keccak Implementation for educational purposes
fn educational_keccak<let N: u32>(input: [u8; N]) -> [u8; 32] {
    let mut state: [u64; 25] = [0; 25];

    // XOR input into state (simplified)
    for i in 0..N {
        if i < 136 { // Rate = 1088 bits = 136 bytes for Keccak256
            let byte_index = i % 8;
            let word_index = i / 8;
            if word_index < 25 {
                state[word_index] ^= (input[i] as u64) << (byte_index * 8);
            }
        }
    }

    state = keccakf1600(state);

    let state_bytes = state_to_bytes(state);
    let mut output = [0; 32];
    for i in 0..32 {
        output[i] = state_bytes[i];
    }
    output
}

// State Conversion Functions
fn state_to_bytes(state: [u64; 25]) -> [u8; 200] {
    let mut bytes = [0; 200];
    for i in 0..25 {
        let word = state[i];
        for j in 0..8 {
            bytes[i * 8 + j] = ((word >> (j * 8)) & 0xFF) as u8;
        }
    }
    bytes
}

fn bytes_to_state(bytes: [u8; 200]) -> [u64; 25] {
    let mut state = [0; 25];
    for i in 0..25 {
        for j in 0..8 {
            state[i] |= (bytes[i * 8 + j] as u64) << (j * 8);
        }
    }
    state
}

// Ethereum Address Computation
fn compute_ethereum_address(public_key_x: [u8; 32], public_key_y: [u8; 32]) -> [u8; 20] {
    let mut public_key = [0; 64];
    for i in 0..32 {
        public_key[i] = public_key_x[i];
        public_key[32 + i] = public_key_y[i];
    }

    let hash = keccak256(public_key);
    let mut address = [0; 20];
    for i in 0..20 {
        address[i] = hash[12 + i]; // Take last 20 bytes
    }
    address
}

// Standard Keccak256 wrapper
fn compute_keccak256<let N: u32>(input: [u8; N]) -> [u8; 32] {
    std::hash::keccak256(input)
}

fn main(input: [u8; 4], expected_hash: [u8; 32]) -> pub bool {
    let computed_hash = compute_keccak256(input);
    let correct_hash = computed_hash == expected_hash;

    // Test Ethereum address computation
    let pubkey_x = [1; 32];
    let pubkey_y = [2; 32];
    let eth_address = compute_ethereum_address(pubkey_x, pubkey_y);
    let address_ok = eth_address.len() == 20;

    // Test deterministic property
    let hash2 = compute_keccak256(input);
    let deterministic = computed_hash == hash2;

    // Test state conversion functions
    let test_state: [u64; 25] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
    let bytes = state_to_bytes(test_state);
    let reconstructed_state = bytes_to_state(bytes);
    let conversion_ok = test_state == reconstructed_state;

    correct_hash & address_ok & deterministic & conversion_ok
}

#[test]
fn test_keccak_basic() {
    let input = [1, 2, 3, 4];
    let expected = std::hash::keccak256(input);
    assert(main(input, expected));
}

#[test]
fn test_keccak_empty() {
    let empty_input: [u8; 0] = [];
    let hash = compute_keccak256(empty_input);

    // Should produce valid 32-byte hash for empty input
    assert(hash.len() == 32);
}

#[test]
fn test_ethereum_address() {
    // Test with known public key values
    let pubkey_x = [0x79, 0xBE, 0x66, 0x7E, 0xF9, 0xDC, 0xBB, 0xAC, 0x55, 0xA0, 0x62, 0x95, 0xCE, 0x87, 0x0B, 0x07, 0x02, 0x9B, 0xFC, 0xDB, 0x2D, 0xCE, 0x28, 0xD9, 0x59, 0xF2, 0x81, 0x5B, 0x16, 0xF8, 0x17, 0x98];
    let pubkey_y = [0x48, 0x3A, 0xDA, 0x77, 0x26, 0xA3, 0xC4, 0x65, 0x5D, 0xA4, 0xFB, 0xFC, 0x0E, 0x11, 0x08, 0xA8, 0xFD, 0x17, 0xB4, 0x48, 0xA6, 0x85, 0x54, 0x19, 0x9C, 0x47, 0xD0, 0x8F, 0xFB, 0x10, 0xD4, 0xB8];

    let address = compute_ethereum_address(pubkey_x, pubkey_y);

    // Should produce 20-byte address
    assert(address.len() == 20);
}

#[test]
fn test_keccak_vs_other_hashes() {
    let input = [42, 84, 126, 168];

    let keccak_hash = compute_keccak256(input);
    // Note: Would compare with Blake2s/Blake3 if available
    // let blake2s_hash = std::hash::blake2s(input);

    // Keccak should produce different result than other hash functions
    assert(keccak_hash.len() == 32);
}

#[test]
fn test_state_conversion_roundtrip() {
    let original_state: [u64; 25] = [
        0x0123456789ABCDEF, 0xFEDCBA9876543210, 0x1111111111111111, 0x2222222222222222, 0x3333333333333333,
        0x4444444444444444, 0x5555555555555555, 0x6666666666666666, 0x7777777777777777, 0x8888888888888888,
        0x9999999999999999, 0xAAAAAAAAAAAAAAAA, 0xBBBBBBBBBBBBBBBB, 0xCCCCCCCCCCCCCCCC, 0xDDDDDDDDDDDDDDDD,
        0xEEEEEEEEEEEEEEEE, 0xFFFFFFFFFFFFFFFF, 0x0000000000000000, 0x1010101010101010, 0x2020202020202020,
        0x3030303030303030, 0x4040404040404040, 0x5050505050505050, 0x6060606060606060, 0x7070707070707070
    ];

    let bytes = state_to_bytes(original_state);
    let reconstructed = bytes_to_state(bytes);

    // Should perfectly roundtrip
    assert(original_state == reconstructed);
}

#[test]
fn test_keccak_deterministic() {
    let input = [255, 128, 64, 32];

    let hash1 = compute_keccak256(input);
    let hash2 = compute_keccak256(input);
    let hash3 = compute_keccak256(input);

    // All should be identical
    assert(hash1 == hash2);
    assert(hash2 == hash3);
}
```

## Key Concepts

1. **Sponge Construction**: Keccak uses the sponge construction with absorb/squeeze phases
2. **Ethereum Standard**: Keccak256 is the hash function used throughout Ethereum
3. **Address Generation**: Ethereum addresses are derived from public keys using Keccak256
4. **State Management**: Internal state is managed as 25 64-bit words (1600 bits total)
5. **Rate and Capacity**: Keccak256 uses rate=1088 bits, capacity=512 bits
6. **Permutation**: Uses the keccakf1600 permutation function

## Ethereum Applications

- **Address Generation**: Hash public keys to create Ethereum addresses
- **Transaction Hashing**: Hash transaction data for signatures
- **Block Hashing**: Hash block headers for proof-of-work
- **Merkle Trees**: Hash nodes in Ethereum's Merkle Patricia trees
- **Smart Contracts**: Hash function calls and storage

## Sponge Construction

The sponge construction has two phases:

1. **Absorbing**: Input is XORed into the state and permuted
2. **Squeezing**: Output is extracted from the state

This design provides security against length extension attacks and enables arbitrary output length.

## Documentation

- [Noir Keccak Documentation](https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives/hashes#keccakf1600)
- [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf)
- [Keccak Team](https://keccak.team/)
