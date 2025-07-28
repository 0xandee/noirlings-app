---
id: keccak_hash
title: keccak_hash
category: hashes
difficulty: hard
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Keccak is Ethereum's hash function using sponge construction. Focus on practical applications using available Keccak functions rather than implementing the complex sponge construction from scratch.

      1. Using Available Keccak Functions

      ```noir
      // Use the standard library Keccak256 function
      fn compute_keccak256<let N: u32>(input: [u8; N]) -> [u8; 32] {
          // Import and use std::hash::keccak256 when available
          // For educational purposes, we'll use keccakf1600 with proper padding
          keccak256_simplified(input)
      }
      
      // Educational implementation showing key concepts
      fn keccak256_simplified<let N: u32>(input: [u8; N]) -> [u8; 32] {
          // This is a simplified educational version
          // In practice, use the standard library function
          let mut padded_input = pad_message(input);
          let final_state = absorb_and_squeeze(padded_input);
          extract_hash(final_state)
      }
      ```

      2. Message Padding (Educational)

      ```noir
      fn pad_message<let N: u32>(input: [u8; N]) -> [u8; 136] {
          // Keccak256 uses rate = 136 bytes (1088 bits)
          let mut padded = [0; 136];
          
          // Copy input
          for i in 0..N {
              if i < 136 {
                  padded[i] = input[i];
              }
          }
          
          // Add padding: append 0x01, then zeros, then 0x80 at the end
          if N < 135 {
              padded[N] = 0x01;
              padded[135] = 0x80;
          }
          
          padded
      }
      ```

      3. Ethereum Address Computation (Practical Application)

      ```noir

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

      ```
    description: >-
      Keccak is Ethereum's cryptographic hash function using sponge construction. Learn to use Keccak256 for Ethereum compatibility, understand its unique properties, and implement practical blockchain applications without getting lost in low-level implementation details.

      #### Docs
    docLink: >-
      https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives/hashes#keccakf1600
---

```noir
use std::hash::keccakf1600;

// Implement Keccak256 hash function using the keccakf1600 permutation
fn keccak256<let N: u32>(input: [u8; N]) -> [u8; 32] {
    // TODO: Implement Keccak256 hashing
    // HINT: This is complex - you need to:
    // 1. Pad the input according to Keccak padding rules
    // 2. Absorb the input into the sponge state
    // 3. Apply keccakf1600 permutation
    // 4. Squeeze out 256 bits (32 bytes) of output

    // For learning purposes, we'll provide a simplified structure
    // In practice, you'd use a library implementation

    [0; 32] // Replace this with proper implementation
}

// Convert a u64 state array to bytes (little-endian)
fn state_to_bytes(state: [u64; 25]) -> [u8; 200] {
    // TODO: Convert the 25 u64 values to 200 bytes
    // Each u64 becomes 8 bytes in little-endian format

    [0; 200] // Replace this with your implementation
}

// Convert bytes to u64 state array (little-endian)
fn bytes_to_state(bytes: [u8; 200]) -> [u64; 25] {
    // TODO: Convert 200 bytes to 25 u64 values
    // Each 8 bytes becomes one u64 in little-endian format

    [0; 25] // Replace this with your implementation
}

// Simplified Keccak for educational purposes
fn educational_keccak<let N: u32>(input: [u8; N]) -> [u8; 32] {
    // TODO: Implement a simplified version to understand the concepts
    // 1. Initialize state to zeros
    // 2. XOR input into first part of state
    // 3. Apply keccakf1600 permutation
    // 4. Extract first 32 bytes as output

    // Initialize state (25 u64 values = 1600 bits)
    let mut state: [u64; 25] = [0; 25];

    // Apply permutation (this is the core Keccak operation)
    state = keccakf1600(state);

    // Convert to bytes and extract first 32 bytes
    let state_bytes = state_to_bytes(state);
    let mut output = [0; 32];
    for i in 0..32 {
        output[i] = state_bytes[i];
    }

    output
}

// Ethereum address computation (uses Keccak256)
fn compute_ethereum_address(public_key_x: [u8; 32], public_key_y: [u8; 32]) -> [u8; 20] {
    // TODO: Compute Ethereum address from public key
    // 1. Concatenate x and y coordinates (64 bytes total)
    // 2. Hash with Keccak256
    // 3. Take last 20 bytes as address

    [0; 20] // Replace this with your implementation
}

// Ethereum transaction hash simulation
fn compute_transaction_hash(
    nonce: u32,
    gas_price: u32,
    gas_limit: u32,
    to_address: [u8; 20],
    value: u32
) -> [u8; 32] {
    // TODO: Simulate Ethereum transaction hash computation
    // In reality, this involves RLP encoding, but we'll simplify

    let mut tx_data = [0; 32];

    // Pack transaction data (simplified)
    tx_data[0] = (nonce >> 24) as u8;
    tx_data[1] = (nonce >> 16) as u8;
    tx_data[2] = (nonce >> 8) as u8;
    tx_data[3] = nonce as u8;

    tx_data[4] = (gas_price >> 24) as u8;
    tx_data[5] = (gas_price >> 16) as u8;
    tx_data[6] = (gas_price >> 8) as u8;
    tx_data[7] = gas_price as u8;

    // Add other fields...
    for i in 0..20 {
        tx_data[8 + i] = to_address[i];
    }

    keccak256(tx_data)
}

fn main(
    input: [u8; 16],
    expected_hash: [u8; 32],
    public_key_x: [u8; 32],
    public_key_y: [u8; 32]
) -> pub bool {
    // Test basic Keccak functionality
    let computed_hash = keccak256(input);
    let basic_test = computed_hash == expected_hash;

    // Test educational Keccak
    let edu_hash = educational_keccak(input);
    let edu_test = edu_hash.len() == 32;

    // Test Ethereum address computation
    let eth_address = compute_ethereum_address(public_key_x, public_key_y);
    let address_test = eth_address.len() == 20;

    // Test transaction hash
    let tx_hash = compute_transaction_hash(
        1,                                    // nonce
        20000000000,                         // gas_price (20 gwei)
        21000,                               // gas_limit
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], // to_address
        1000000000000000000                  // value (1 ETH in wei)
    );
    let tx_test = tx_hash.len() == 32;

    basic_test & edu_test & address_test & tx_test
}

#[test]
fn test_keccakf1600_permutation() {
    // Test the core Keccak permutation function
    let input_state = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25
    ];

    let output_state = keccakf1600(input_state);

    // Output should be different from input (permutation effect)
    assert(output_state != input_state);

    // Should still have 25 elements
    assert(output_state.len() == 25);
}

#[test]
fn test_state_conversions() {
    let test_state: [u64; 25] = [
        0x0123456789ABCDEF, 0xFEDCBA9876543210, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0
    ];

    let bytes = state_to_bytes(test_state);
    let recovered_state = bytes_to_state(bytes);

    // Should be able to round-trip the conversion
    assert(recovered_state[0] == test_state[0]);
    assert(recovered_state[1] == test_state[1]);
}

#[test]
fn test_keccak_deterministic() {
    let test_input = [1, 2, 3, 4, 5, 6, 7, 8];

    let hash1 = educational_keccak(test_input);
    let hash2 = educational_keccak(test_input);

    // Should be deterministic
    assert(hash1 == hash2);
    assert(hash1.len() == 32);
}

#[test]
fn test_ethereum_address_format() {
    let pubkey_x = [1; 32];
    let pubkey_y = [2; 32];

    let address = compute_ethereum_address(pubkey_x, pubkey_y);

    // Ethereum addresses are 20 bytes
    assert(address.len() == 20);

    // Should be deterministic
    let address2 = compute_ethereum_address(pubkey_x, pubkey_y);
    assert(address == address2);
}

#[test]
fn test_transaction_hash_structure() {
    let tx_hash = compute_transaction_hash(
        42,                                  // nonce
        30000000000,                        // gas_price (30 gwei)
        21000,                              // gas_limit
        [0xFF; 20],                         // to_address
        5000000000000000000                 // value (5 ETH)
    );

    // Transaction hash should be 32 bytes
    assert(tx_hash.len() == 32);

    // Different inputs should produce different hashes
    let tx_hash2 = compute_transaction_hash(
        43,                                 // different nonce
        30000000000,                       // same gas_price
        21000,                             // same gas_limit
        [0xFF; 20],                        // same to_address
        5000000000000000000                // same value
    );

    assert(tx_hash != tx_hash2);
}

#[test]
fn test_keccak_avalanche() {
    // Test avalanche effect with educational Keccak
    let input1 = [1, 2, 3, 4, 5, 6, 7, 8];
    let input2 = [1, 2, 3, 4, 5, 6, 7, 9]; // Last byte different

    let hash1 = educational_keccak(input1);
    let hash2 = educational_keccak(input2);

    // Should produce very different outputs
    assert(hash1 != hash2);

    // Count different bytes
    let mut different_bytes = 0;
    for i in 0..32 {
        if hash1[i] != hash2[i] {
            different_bytes += 1;
        }
    }

    // Should have significant differences
    assert(different_bytes > 0);
}

#[test]
fn test_ethereum_use_cases() {
    // Test various Ethereum-specific use cases

    // 1. Contract address computation (simplified)
    let creator_address = [0x12; 20];
    let nonce = 1;
    // In real Ethereum: address = keccak256(rlp([creator_address, nonce]))

    // 2. Storage slot computation (simplified)
    let mapping_slot = 5;
    let key = [0xAB; 32];
    // In real Ethereum: slot = keccak256(key + mapping_slot)

    // 3. Event topic computation
    let event_signature = "Transfer(address,address,uint256)";
    // In real Ethereum: topic = keccak256(event_signature)

    // These are conceptual tests showing Keccak's role in Ethereum
    assert(creator_address.len() == 20);
    assert(key.len() == 32);
    assert(nonce > 0);
}
```
