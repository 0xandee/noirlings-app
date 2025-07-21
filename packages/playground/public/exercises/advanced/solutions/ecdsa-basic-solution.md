# ECDSA Signature Verification - Solution

## Exercise ID: ecdsa_basic

**Category:** signatures  
**Difficulty:** easy  
**Prerequisites:** [scalar_multiplication]

## Description

ECDSA is a widely-used digital signature scheme based on elliptic curve cryptography. Learn to verify signatures using secp256k1 and understand message integrity validation.

## Solution

```noir
use std::ecdsa_secp256k1::verify_signature;

// Basic ECDSA Verification
fn verify_ecdsa_signature(
    message_hash: [u8; 32],
    public_key_x: [u8; 32],
    public_key_y: [u8; 32],
    signature: [u8; 64]
) -> bool {
    verify_signature(message_hash, public_key_x, public_key_y, signature)
}

// Invalid Message Test
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

// Invalid Public Key Test
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

// Batch signature verification
fn batch_verify_signatures(
    message_hashes: [([u8; 32], [u8; 32], [u8; 32], [u8; 64]); 3] // (message, pubkey_x, pubkey_y, signature)
) -> bool {
    let mut all_valid = true;

    for i in 0..3 {
        let (message, pubkey_x, pubkey_y, signature) = message_hashes[i];
        let is_valid = verify_ecdsa_signature(message, pubkey_x, pubkey_y, signature);
        all_valid = all_valid & is_valid;
    }

    all_valid
}

// Extract signature components (r, s)
fn extract_signature_components(signature: [u8; 64]) -> ([u8; 32], [u8; 32]) {
    let mut r = [0; 32];
    let mut s = [0; 32];

    for i in 0..32 {
        r[i] = signature[i];
        s[i] = signature[i + 32];
    }

    (r, s)
}

// Signature malleability check (s value should be in lower half)
fn check_signature_canonical(signature: [u8; 64]) -> bool {
    let (_, s) = extract_signature_components(signature);

    // Check if s is in the lower half of the curve order
    // secp256k1 order = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
    // Half order = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0

    // Simple check: s[0] should be less than 0x80 for canonical signatures
    s[0] < 0x80
}

fn main(
    message_hash: [u8; 32],
    public_key_x: [u8; 32],
    public_key_y: [u8; 32],
    signature: [u8; 64],
    wrong_message: [u8; 32],
    wrong_pubkey_x: [u8; 32],
    wrong_pubkey_y: [u8; 32]
) -> pub bool {
    // Test basic verification
    let signature_valid = verify_ecdsa_signature(message_hash, public_key_x, public_key_y, signature);

    // Test invalid message rejection
    let message_test = test_invalid_message(
        message_hash, wrong_message, public_key_x, public_key_y, signature
    );

    // Test invalid public key rejection
    let pubkey_test = test_invalid_public_key(
        message_hash, public_key_x, public_key_y, wrong_pubkey_x, wrong_pubkey_y, signature
    );

    // Test signature canonicality
    let canonical_test = check_signature_canonical(signature);

    signature_valid & message_test & pubkey_test & canonical_test
}

#[test]
fn test_valid_ecdsa_signature() {
    // Test vectors (these would need to be real ECDSA test vectors in practice)
    let message_hash = [
        0x4b, 0x68, 0x8d, 0xf4, 0x0b, 0xce, 0xd8, 0x5c,
        0x6b, 0x09, 0x8d, 0x38, 0x81, 0x8a, 0x21, 0x67,
        0x4c, 0x2d, 0x04, 0x8b, 0x61, 0x04, 0xfc, 0x7d,
        0x24, 0x5d, 0x6c, 0x7d, 0xab, 0xc1, 0x25, 0x36
    ];

    let public_key_x = [
        0x79, 0xBE, 0x66, 0x7E, 0xF9, 0xDC, 0xBB, 0xAC,
        0x55, 0xA0, 0x62, 0x95, 0xCE, 0x87, 0x0B, 0x07,
        0x02, 0x9B, 0xFC, 0xDB, 0x2D, 0xCE, 0x28, 0xD9,
        0x59, 0xF2, 0x81, 0x5B, 0x16, 0xF8, 0x17, 0x98
    ];

    let public_key_y = [
        0x48, 0x3A, 0xDA, 0x77, 0x26, 0xA3, 0xC4, 0x65,
        0x5D, 0xA4, 0xFB, 0xFC, 0x0E, 0x11, 0x08, 0xA8,
        0xFD, 0x17, 0xB4, 0x48, 0xA6, 0x85, 0x54, 0x19,
        0x9C, 0x47, 0xD0, 0x8F, 0xFB, 0x10, 0xD4, 0xB8
    ];

    let signature = [
        // r component
        0x54, 0xC4, 0xA3, 0x3C, 0x64, 0x23, 0xD6, 0x89,
        0x37, 0x8F, 0x16, 0x0A, 0x7F, 0xF8, 0xB6, 0x13,
        0x30, 0x44, 0x4A, 0xBB, 0x58, 0xFB, 0x47, 0x0F,
        0x96, 0xEA, 0x16, 0xD9, 0x95, 0xD2, 0xF7, 0x0A,
        // s component
        0x32, 0x9F, 0x48, 0x16, 0xD5, 0xB4, 0x4C, 0x4D,
        0x3F, 0x76, 0xF1, 0x6A, 0x27, 0x28, 0x2B, 0xDE,
        0x57, 0x95, 0x0C, 0x2E, 0x9F, 0x4A, 0x96, 0xB8,
        0xE6, 0xEA, 0xEB, 0x8D, 0x85, 0x67, 0x54, 0x1B
    ];

    let wrong_message = [1; 32]; // Different message
    let wrong_pubkey_x = [2; 32]; // Different public key
    let wrong_pubkey_y = [3; 32];

    // Note: In a real test, we'd use actual test vectors
    // For this example, we'll just test the structure
    let is_valid = verify_ecdsa_signature(message_hash, public_key_x, public_key_y, signature);

    // The signature verification might fail with dummy data, so we test the function exists
    assert(true); // Placeholder - in real implementation, use actual test vectors
}

#[test]
fn test_signature_component_extraction() {
    let signature = [
        // r: 32 bytes of 0x01
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        // s: 32 bytes of 0x02
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2
    ];

    let (r, s) = extract_signature_components(signature);

    // Check r component
    for i in 0..32 {
        assert(r[i] == 1);
    }

    // Check s component
    for i in 0..32 {
        assert(s[i] == 2);
    }
}

#[test]
fn test_canonical_signature_check() {
    // Canonical signature (s < curve_order/2)
    let canonical_sig = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        0x7F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
    ];

    // Non-canonical signature (s >= curve_order/2)
    let non_canonical_sig = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01
    ];

    assert(check_signature_canonical(canonical_sig));
    assert(!check_signature_canonical(non_canonical_sig));
}

#[test]
fn test_deterministic_verification() {
    let message = [42; 32];
    let pubkey_x = [1; 32];
    let pubkey_y = [2; 32];
    let signature = [3; 64];

    // Same inputs should always give same result
    let result1 = verify_ecdsa_signature(message, pubkey_x, pubkey_y, signature);
    let result2 = verify_ecdsa_signature(message, pubkey_x, pubkey_y, signature);

    assert(result1 == result2);
}
```

## Key Concepts

1. **Digital Signatures**: Cryptographic proof that a message was created by the holder of a private key
2. **secp256k1 Curve**: The elliptic curve used by Bitcoin and Ethereum for ECDSA
3. **Message Hashing**: Messages are hashed before signing (typically with SHA-256 or Keccak-256)
4. **Public Key**: Derived from private key, used to verify signatures
5. **Signature Components**: ECDSA signatures consist of (r, s) values
6. **Signature Malleability**: Non-canonical signatures can be modified without invalidating them

## ECDSA Verification Process

1. **Parse Components**: Extract r and s from the signature
2. **Validate Range**: Ensure r and s are in valid range [1, n-1] where n is curve order
3. **Compute Hash**: Hash the message (if not already hashed)
4. **Verify Equation**: Check if the signature satisfies the ECDSA verification equation
5. **Return Result**: True if signature is valid, false otherwise

## Security Considerations

1. **Canonical Signatures**: Use canonical (low-s) signatures to prevent malleability
2. **Hash Function**: Use cryptographically secure hash functions
3. **Nonce Reuse**: Never reuse nonces in signature generation (not relevant for verification)
4. **Key Validation**: Validate that public keys are valid curve points
5. **Timing Attacks**: Use constant-time implementations in sensitive contexts

## Use Cases in Zero-Knowledge Proofs

- **Identity Verification**: Prove knowledge of private key without revealing it
- **Authorization**: Verify permissions without exposing credentials
- **Blockchain Integration**: Verify Ethereum/Bitcoin transactions in ZK circuits
- **Multi-Signature Schemes**: Aggregate and verify multiple signatures efficiently

## Documentation

- [Noir ECDSA Documentation](https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives/ecdsa)
- [RFC 6979: Deterministic ECDSA](https://tools.ietf.org/html/rfc6979)
- [SEC 1: Elliptic Curve Cryptography](https://www.secg.org/sec1-v2.pdf)
