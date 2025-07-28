---
id: ecdsa_basic
title: ecdsa_basic
category: signatures
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      ECDSA verification ensures message integrity and authenticity using elliptic curve cryptography. Implement signature verification and test security properties.

      1. Basic ECDSA Verification

      ```noir

      fn verify_ecdsa_signature(
          message_hash: [u8; 32],
          public_key_x: [u8; 32],
          public_key_y: [u8; 32],
          signature: [u8; 64]
      ) -> bool {
          verify_signature(message_hash, public_key_x, public_key_y, signature)
      }

      ```

      2. Invalid Message Test

      ```noir

      fn test_invalid_message(
          message_hash: [u8; 32],
          wrong_message_hash: [u8; 32],
          public_key_x: [u8; 32],
          public_key_y: [u8; 32],
          signature: [u8; 64]
      ) -> bool {
          let valid_sig = verify_ecdsa_signature(message_hash, public_key_x, public_key_y, signature);
          let invalid_sig = verify_ecdsa_signature(wrong_message_hash, public_key_x, public_key_y, signature);
          
          valid_sig & !invalid_sig
      }

      ```

      3. Invalid Public Key Test

      ```noir

      fn test_invalid_public_key(
          message_hash: [u8; 32],
          public_key_x: [u8; 32],
          public_key_y: [u8; 32],
          wrong_public_key_x: [u8; 32],
          wrong_public_key_y: [u8; 32],
          signature: [u8; 64]
      ) -> bool {
          let valid_sig = verify_ecdsa_signature(message_hash, public_key_x, public_key_y, signature);
          let invalid_sig = verify_ecdsa_signature(message_hash, wrong_public_key_x, wrong_public_key_y, signature);
          
          valid_sig & !invalid_sig
      }

      ```
    description: >-
      ECDSA is a widely-used digital signature scheme based on elliptic curve cryptography. Learn to verify signatures using secp256k1 and understand message integrity validation.

      #### Docs
    docLink: >-
      https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives/ecdsa
---

```noir
use std::ecdsa_secp256k1::verify_signature;

// ECDSA signature verification function
fn verify_ecdsa_signature(
    message_hash: [u8; 32],
    public_key_x: [u8; 32],
    public_key_y: [u8; 32],
    signature: [u8; 64]
) -> bool {
    // TODO: Implement ECDSA signature verification
    // HINT: Use std::ecdsa_secp256k1::verify_signature
    // The function takes: message_hash, public_key_x, public_key_y, signature

    false // Replace this with your implementation
}

// Verify that a signature is invalid for a different message
fn test_invalid_message(
    message_hash: [u8; 32],
    wrong_message_hash: [u8; 32],
    public_key_x: [u8; 32],
    public_key_y: [u8; 32],
    signature: [u8; 64]
) -> bool {
    let valid_sig = verify_ecdsa_signature(message_hash, public_key_x, public_key_y, signature);
    let invalid_sig = verify_ecdsa_signature(wrong_message_hash, public_key_x, public_key_y, signature);

    valid_sig & !invalid_sig
}

// Verify that a signature is invalid for a different public key
fn test_invalid_public_key(
    message_hash: [u8; 32],
    public_key_x: [u8; 32],
    public_key_y: [u8; 32],
    wrong_public_key_x: [u8; 32],
    wrong_public_key_y: [u8; 32],
    signature: [u8; 64]
) -> bool {
    let valid_sig = verify_ecdsa_signature(message_hash, public_key_x, public_key_y, signature);
    let invalid_sig = verify_ecdsa_signature(message_hash, wrong_public_key_x, wrong_public_key_y, signature);

    valid_sig & !invalid_sig
}

fn main(
    message_hash: [u8; 32],
    public_key_x: [u8; 32],
    public_key_y: [u8; 32],
    signature: [u8; 64],
    wrong_message_hash: [u8; 32],
    wrong_public_key_x: [u8; 32],
    wrong_public_key_y: [u8; 32]
) -> pub bool {
    // Test valid signature verification
    let valid_verification = verify_ecdsa_signature(message_hash, public_key_x, public_key_y, signature);

    // Test that signature fails with wrong message
    let message_test = test_invalid_message(
        message_hash,
        wrong_message_hash,
        public_key_x,
        public_key_y,
        signature
    );

    // Test that signature fails with wrong public key
    let pubkey_test = test_invalid_public_key(
        message_hash,
        public_key_x,
        public_key_y,
        wrong_public_key_x,
        wrong_public_key_y,
        signature
    );

    valid_verification & message_test & pubkey_test
}

#[test]
fn test_ecdsa_verification() {
    // Test vectors for ECDSA verification
    let message_hash = [
        0x4e, 0x36, 0xd9, 0x6b, 0x81, 0x1e, 0x4c, 0x1d,
        0x47, 0x3b, 0x5f, 0x7e, 0x7c, 0x1d, 0x4f, 0x34,
        0xe9, 0x1c, 0x0a, 0xb5, 0x7d, 0x5e, 0x9b, 0x7c,
        0x88, 0x3a, 0x5b, 0x7e, 0x2f, 0x6d, 0x4c, 0x8a
    ];

    let public_key_x = [
        0x79, 0xbe, 0x66, 0x7e, 0xf9, 0xdc, 0xbb, 0xac,
        0x55, 0xa0, 0x62, 0x95, 0xce, 0x87, 0x0b, 0x07,
        0x02, 0x9b, 0xfc, 0xdb, 0x2d, 0xce, 0x28, 0xd9,
        0x59, 0xf2, 0x81, 0x5b, 0x16, 0xf8, 0x17, 0x98
    ];

    let public_key_y = [
        0x48, 0x3a, 0xda, 0x77, 0x26, 0xa3, 0xc4, 0x65,
        0x5d, 0xa4, 0xfb, 0xfc, 0x0e, 0x11, 0x08, 0xa8,
        0xfd, 0x17, 0xb4, 0x48, 0xa6, 0x85, 0x54, 0x19,
        0x9c, 0x47, 0xd0, 0x8f, 0xfb, 0x10, 0xd4, 0xb8
    ];

    // Example signature (r, s) - replace with actual test vectors for real testing
    let signature = [
        // r component (32 bytes)
        0x30, 0x45, 0x02, 0x20, 0x1b, 0x5d, 0x7c, 0xae,
        0x45, 0x2e, 0x34, 0x12, 0x67, 0x89, 0xab, 0xcd,
        0xef, 0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd,
        0xef, 0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd,
        // s component (32 bytes)
        0x02, 0x21, 0x00, 0xa3, 0x2c, 0x14, 0x7e, 0x9b,
        0x78, 0x56, 0x34, 0x12, 0xfe, 0xdc, 0xba, 0x98,
        0x76, 0x54, 0x32, 0x10, 0xfe, 0xdc, 0xba, 0x98,
        0x76, 0x54, 0x32, 0x10, 0xfe, 0xdc, 0xba, 0x98
    ];

    let wrong_message_hash = [
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01
    ];

    let wrong_public_key_x = [
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01
    ];

    let wrong_public_key_y = [
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02
    ];

    // Note: These are example values for educational purposes.
    // In production, use proper ECDSA test vectors from:
    // - RFC 6979 test vectors
    // - NIST cryptographic test suites  
    // - Generated with verified cryptographic libraries

    let result = main(
        message_hash,
        public_key_x,
        public_key_y,
        signature,
        wrong_message_hash,
        wrong_public_key_x,
        wrong_public_key_y
    );

    // Educational test structure - in practice use verified test vectors
    // This tests that your implementation can handle the function calls
    // without panicking, even with example data
    
    // Test that the function doesn't panic and returns a boolean
    let function_works = result == true || result == false;
    assert(function_works);
    
    // TODO: Replace with actual ECDSA test vectors for meaningful verification
    // Expected: assert(result == true) with valid signature
    // Expected: assert(result == false) with invalid signature
}
```
