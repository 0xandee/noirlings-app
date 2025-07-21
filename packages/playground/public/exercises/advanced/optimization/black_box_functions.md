---
id: black_box_functions
title: black_box_functions
category: optimization
difficulty: medium
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Black box functions provide optimized implementations of common operations. Use them instead of circuit implementations for better performance and fewer constraints.

      1. Blake2s Hash Function

      ```noir

      fn demo_blake2s_blackbox(data: [u8; 32]) -> [u8; 32] {
          std::hash::blake2s(data)
      }

      ```

      2. Circuit vs Black Box Comparison

      ```noir

      fn circuit_hash_simulation(data: [u8; 32]) -> Field {
          // Inefficient circuit implementation
          let mut result = 0;
          for i in 0..32 {
              result = result * 256 + data[i] as Field;
          }
          result
      }

      ```

      3. AES128 Encryption

      ```noir

      fn demo_aes_encryption(plaintext: [u8; 16], key: [u8; 16]) -> [u8; 16] {
          std::aes128::encrypt(plaintext, key)
      }

      ```

      4. ECDSA Signature Verification

      ```noir

      fn demo_ecdsa_verification(
          message_hash: [u8; 32],
          public_key: [u8; 64],
          signature: [u8; 64]
      ) -> bool {
          let pub_key_x = [
              public_key[0], public_key[1], public_key[2], public_key[3],
              public_key[4], public_key[5], public_key[6], public_key[7],
              public_key[8], public_key[9], public_key[10], public_key[11],
              public_key[12], public_key[13], public_key[14], public_key[15],
              public_key[16], public_key[17], public_key[18], public_key[19],
              public_key[20], public_key[21], public_key[22], public_key[23],
              public_key[24], public_key[25], public_key[26], public_key[27],
              public_key[28], public_key[29], public_key[30], public_key[31]
          ];
          
          let pub_key_y = [
              public_key[32], public_key[33], public_key[34], public_key[35],
              public_key[36], public_key[37], public_key[38], public_key[39],
              public_key[40], public_key[41], public_key[42], public_key[43],
              public_key[44], public_key[45], public_key[46], public_key[47],
              public_key[48], public_key[49], public_key[50], public_key[51],
              public_key[52], public_key[53], public_key[54], public_key[55],
              public_key[56], public_key[57], public_key[58], public_key[59],
              public_key[60], public_key[61], public_key[62], public_key[63]
          ];
          
          std::ecdsa_secp256k1::verify_signature(message_hash, pub_key_x, pub_key_y, signature)
      }

      ```

      5. Performance Comparison Pattern

      ```noir

      fn performance_test() -> bool {
          let data = [1; 32];
          let key = [42; 16];
          
          // Use black box functions for optimal performance
          let hash_result = demo_blake2s_blackbox(data);
          let circuit_result = circuit_hash_simulation(data);
          let encrypted = demo_aes_encryption([1; 16], key);
          
          // Black box functions are significantly faster
          hash_result.len() == 32 & encrypted.len() == 16
      }

      ```
    description: >-
      Black box functions provide optimized implementations of common cryptographic operations with better performance than circuit equivalents. Learn to use hash functions, encryption, and signature verification efficiently.

      #### Docs
    docLink: "https://noir-lang.org/docs/noir/concepts/black_box_functions"
---

```noir
use std::hash::{blake2s, blake3, sha256};
use std::aes128;
use std::ecdsa_secp256k1;

// TODO: Demonstrate blake2s black box function
fn demo_blake2s_blackbox(data: [u8; 32]) -> [u8; 32] {
    // Hint: Use std::hash::blake2s directly
    // This is much more efficient than implementing Blake2s in circuit
    todo!()
}

// TODO: Compare circuit vs black box hash performance
fn circuit_hash_simulation(data: [u8; 32]) -> Field {
    // Hint: Simulate what a circuit implementation might look like
    // This would be much slower and use many more constraints
    let mut result = 0;
    for i in 0..32 {
        result = result * 256 + data[i] as Field;
    }
    result
}

// TODO: Demonstrate AES128 encryption black box
fn demo_aes_encryption(plaintext: [u8; 16], key: [u8; 16]) -> [u8; 16] {
    // Hint: Use std::aes128::encrypt
    // Black box AES is much more efficient than circuit implementation
    todo!()
}

// TODO: Demonstrate ECDSA signature verification
fn demo_ecdsa_verification(
    message_hash: [u8; 32],
    public_key: [u8; 64], // Uncompressed public key (x,y coordinates)
    signature: [u8; 64]   // (r,s) signature components
) -> bool {
    // Hint: Use std::ecdsa_secp256k1::verify_signature
    // This is vastly more efficient than implementing ECDSA in circuit
    todo!()
}

// TODO: Demonstrate efficient Keccak hashing for Ethereum compatibility
fn demo_keccak256(data: [u8]) -> [u8; 32] {
    // Hint: Use the keccakf1600 black box function
    // This is essential for Ethereum-compatible hashing
    todo!()
}

// TODO: Implement a multi-hash function that uses multiple black boxes
fn multi_hash_verification(data: [u8; 32]) -> ([u8; 32], [u8; 32], [u8; 32]) {
    // Returns: (blake2s_hash, blake3_hash, sha256_hash)
    // Hint: Use all three black box hash functions
    todo!()
}

// TODO: Demonstrate when NOT to use black box functions
fn inappropriate_blackbox_usage(small_data: [u8; 4]) -> [u8; 32] {
    // Hint: For very small inputs, the overhead of black box functions
    // might not be worth it compared to simple circuit operations
    // This is more of a demonstration of when to consider alternatives
    todo!()
}

// TODO: Implement a signature batch verification using black boxes
fn batch_verify_signatures(
    message_hashes: [[u8; 32]; N],
    public_keys: [[u8; 64]; N],
    signatures: [[u8; 64]; N]
) -> [bool; N] {
    // Hint: Use black box ECDSA verification for each signature
    // This is much more efficient than circuit-based verification
    todo!()
}

// TODO: Demonstrate fixed-base scalar multiplication
fn demo_fixed_base_scalar_mul(scalar: Field) -> (Field, Field) {
    // Hint: Use the fixed base scalar multiplication black box
    // This is optimized for repeated multiplication with the same base point
    todo!()
}

// TODO: Create a hybrid function that combines circuit logic with black boxes
fn hybrid_computation(data: [u8; 32], threshold: u8) -> bool {
    // Hint:
    // 1. Use black box hash to compute a hash
    // 2. Use circuit logic to check if hash meets some condition
    // 3. This demonstrates combining both approaches efficiently
    todo!()
}

#[test]
fn test_blake2s_blackbox() {
    let data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];

    let hash = demo_blake2s_blackbox(data);

    // Blake2s should produce a 32-byte hash
    assert(hash.len() == 32);

    // Hash should be deterministic
    let hash2 = demo_blake2s_blackbox(data);
    for i in 0..32 {
        assert(hash[i] == hash2[i]);
    }
}

#[test]
fn test_aes_encryption() {
    let plaintext = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    let key = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

    let ciphertext = demo_aes_encryption(plaintext, key);

    // Ciphertext should be different from plaintext
    let mut different = false;
    for i in 0..16 {
        if ciphertext[i] != plaintext[i] {
            different = true;
        }
    }
    assert(different);

    // Encryption should be deterministic
    let ciphertext2 = demo_aes_encryption(plaintext, key);
    for i in 0..16 {
        assert(ciphertext[i] == ciphertext2[i]);
    }
}

#[test]
fn test_multi_hash() {
    let data = [42; 32];

    let (blake2s_hash, blake3_hash, sha256_hash) = multi_hash_verification(data);

    // All hashes should be 32 bytes
    assert(blake2s_hash.len() == 32);
    assert(blake3_hash.len() == 32);
    assert(sha256_hash.len() == 32);

    // Different hash functions should produce different results
    let mut blake2s_blake3_different = false;
    let mut blake2s_sha256_different = false;

    for i in 0..32 {
        if blake2s_hash[i] != blake3_hash[i] {
            blake2s_blake3_different = true;
        }
        if blake2s_hash[i] != sha256_hash[i] {
            blake2s_sha256_different = true;
        }
    }

    assert(blake2s_blake3_different);
    assert(blake2s_sha256_different);
}

#[test]
fn test_batch_signature_verification() {
    // Test data for batch verification (simplified)
    let message_hashes = [
        [1; 32],
        [2; 32],
        [3; 32]
    ];

    // Simplified public keys and signatures for testing
    let public_keys = [
        [0; 64], // In practice, these would be real public keys
        [1; 64],
        [2; 64]
    ];

    let signatures = [
        [0; 64], // In practice, these would be real signatures
        [1; 64],
        [2; 64]
    ];

    let results = batch_verify_signatures(message_hashes, public_keys, signatures);

    // Should return array of boolean results
    assert(results.len() == 3);

    // In a real scenario, these would verify actual signatures
    // For this test, we just check the function returns the right structure
}

#[test]
fn test_hybrid_computation() {
    let data = [100; 32];
    let threshold = 50;

    let result = hybrid_computation(data, threshold);

    // Should return a boolean result
    // The exact result depends on the implementation
    // This test verifies the function executes without error
    assert(result == true || result == false);
}

#[test]
fn test_performance_comparison() {
    let data = [42; 32];

    // Test black box hash
    let blackbox_hash = demo_blake2s_blackbox(data);

    // Test circuit simulation (much slower)
    let circuit_result = circuit_hash_simulation(data);

    // Both should execute, but black box should be much more efficient
    assert(blackbox_hash.len() == 32);
    assert(circuit_result != 0); // Circuit simulation should produce some result

    // In practice, black box would be orders of magnitude faster
}

#[test]
fn test_keccak256_ethereum_compatibility() {
    let data = [0x01, 0x02, 0x03, 0x04];

    let hash = demo_keccak256(data);

    // Keccak256 should produce 32-byte hash
    assert(hash.len() == 32);

    // Should be deterministic
    let hash2 = demo_keccak256(data);
    for i in 0..32 {
        assert(hash[i] == hash2[i]);
    }
}
```
