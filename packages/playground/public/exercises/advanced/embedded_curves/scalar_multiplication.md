---
id: scalar_multiplication
title: scalar_multiplication
category: embedded_curves
difficulty: medium
tags: []
mode: test
prerequisites: [embedded_curve1, embedded_curve2]
version: 1.0.0
locales:
  en:
    hint: >-
      Scalar multiplication is repeated point addition using the double-and-add algorithm. Implement point operations and use them for cryptographic key generation.

      1. Basic Scalar Multiplication

      ```noir
      fn scalar_multiply(point: EmbeddedCurvePoint, scalar: EmbeddedCurveScalar) -> EmbeddedCurvePoint {
          fixed_base_scalar_mul(scalar, point)
      }
      ```

      2. Point Addition

      ```noir
      fn point_add(p1: EmbeddedCurvePoint, p2: EmbeddedCurvePoint) -> EmbeddedCurvePoint {
          std::embedded_curve_ops::add(p1, p2)
      }
      ```

      3. Point Doubling

      ```noir
      fn point_double(point: EmbeddedCurvePoint) -> EmbeddedCurvePoint {
          point_add(point, point)
      }
      ```

      4. Multi-Scalar Multiplication

      ```noir
      fn multi_scalar_multiplication(
          points: [EmbeddedCurvePoint; 3],
          scalars: [EmbeddedCurveScalar; 3]
      ) -> EmbeddedCurvePoint {
          multi_scalar_mul(points, scalars)
      }
      ```

      5. Public Key Generation

      ```noir
      fn generate_public_key(private_key: EmbeddedCurveScalar) -> EmbeddedCurvePoint {
          let generator = EmbeddedCurvePoint::generator();
          scalar_multiply(generator, private_key)
      }
      ```
    description: >-
      Scalar multiplication is fundamental to elliptic curve cryptography, enabling public key generation and digital signatures. Learn to implement the double-and-add algorithm for efficient point operations.


      In this exercise, you will:

      1. Implement scalar multiplication using double-and-add

      2. Understand point addition and doubling operations

      3. Learn about elliptic curve group operations

      4. Apply scalar multiplication to cryptographic scenarios

      #### Docs
    docLink: >-
      https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives/embedded_curve_ops#scalar-multiplication
---

```noir
use std::embedded_curve_ops::{EmbeddedCurvePoint, EmbeddedCurveScalar, fixed_base_scalar_mul, multi_scalar_mul};

// Basic scalar multiplication using the double-and-add algorithm
fn scalar_multiply(point: EmbeddedCurvePoint, scalar: EmbeddedCurveScalar) -> EmbeddedCurvePoint {
    // TODO: Implement scalar multiplication k * P = P + P + ... + P (k times)
    // HINT: Use the double-and-add algorithm:
    // 1. Start with point at infinity (zero)
    // 2. For each bit in scalar (from least significant):
    //    - If bit is 1, add the current point to result
    //    - Double the current point for next iteration

    // You can use the standard library function or implement manually
    fixed_base_scalar_mul(scalar, point)
}

// Point addition operation
fn point_add(p1: EmbeddedCurvePoint, p2: EmbeddedCurvePoint) -> EmbeddedCurvePoint {
    // TODO: Implement elliptic curve point addition
    // HINT: For points (x1,y1) and (x2,y2):
    // If x1 != x2: λ = (y2-y1)/(x2-x1), x3 = λ²-x1-x2, y3 = λ(x1-x3)-y1
    // If x1 == x2 and y1 == y2: use point doubling formula
    // If x1 == x2 and y1 != y2: result is point at infinity

    // Use standard library implementation
    std::embedded_curve_ops::add(p1, p2)
}

// Point doubling operation
fn point_double(point: EmbeddedCurvePoint) -> EmbeddedCurvePoint {
    // TODO: Implement elliptic curve point doubling (2 * P)
    // HINT: For point (x,y): λ = (3x²+a)/(2y), x' = λ²-2x, y' = λ(x-x')-y
    // where a is the curve parameter (usually 0 for curves in Weierstrass form)

    point_add(point, point)
}

// Verify scalar multiplication properties
fn verify_scalar_mul_properties(
    point: EmbeddedCurvePoint,
    scalar1: EmbeddedCurveScalar,
    scalar2: EmbeddedCurveScalar
) -> bool {
    // Test associativity: (a + b) * P = a * P + b * P
    let sum_scalar = scalar1 + scalar2;
    let left_side = scalar_multiply(point, sum_scalar);

    let right_side_part1 = scalar_multiply(point, scalar1);
    let right_side_part2 = scalar_multiply(point, scalar2);
    let right_side = point_add(right_side_part1, right_side_part2);

    // Check if points are equal
    (left_side.x == right_side.x) & (left_side.y == right_side.y) & (left_side.is_infinite == right_side.is_infinite)
}

// Multi-scalar multiplication (MSM) - efficient for multiple operations
fn multi_scalar_multiplication(
    points: [EmbeddedCurvePoint; 3],
    scalars: [EmbeddedCurveScalar; 3]
) -> EmbeddedCurvePoint {
    // TODO: Compute scalar1 * point1 + scalar2 * point2 + scalar3 * point3
    // HINT: Use multi_scalar_mul for efficiency, or compute individually and add

    multi_scalar_mul(points, scalars)
}

// Generate a public key from a private key (scalar multiplication with generator)
fn generate_public_key(private_key: EmbeddedCurveScalar) -> EmbeddedCurvePoint {
    // TODO: Compute public_key = private_key * G (where G is the generator point)
    // This is the fundamental operation in elliptic curve cryptography

    let generator = EmbeddedCurvePoint::generator();
    scalar_multiply(generator, private_key)
}

// Verify a simple Diffie-Hellman key exchange
fn verify_diffie_hellman(
    private_key_a: EmbeddedCurveScalar,
    private_key_b: EmbeddedCurveScalar
) -> bool {
    // TODO: Verify ECDH key exchange
    // 1. A computes public_key_a = private_key_a * G
    // 2. B computes public_key_b = private_key_b * G
    // 3. Shared secret: private_key_a * public_key_b = private_key_b * public_key_a

    let public_key_a = generate_public_key(private_key_a);
    let public_key_b = generate_public_key(private_key_b);

    let shared_secret_a = scalar_multiply(public_key_b, private_key_a);
    let shared_secret_b = scalar_multiply(public_key_a, private_key_b);

    // Shared secrets should be equal
    (shared_secret_a.x == shared_secret_b.x) &
    (shared_secret_a.y == shared_secret_b.y) &
    (shared_secret_a.is_infinite == shared_secret_b.is_infinite)
}

// Test scalar multiplication with small values
fn test_small_scalars(point: EmbeddedCurvePoint) -> bool {
    let zero_scalar = EmbeddedCurveScalar::from_field(0);
    let one_scalar = EmbeddedCurveScalar::from_field(1);
    let two_scalar = EmbeddedCurveScalar::from_field(2);

    // 0 * P should be point at infinity
    let zero_result = scalar_multiply(point, zero_scalar);
    let zero_test = zero_result.is_infinite;

    // 1 * P should be P itself
    let one_result = scalar_multiply(point, one_scalar);
    let one_test = (one_result.x == point.x) & (one_result.y == point.y) & (one_result.is_infinite == point.is_infinite);

    // 2 * P should be P + P
    let two_result = scalar_multiply(point, two_scalar);
    let double_result = point_double(point);
    let two_test = (two_result.x == double_result.x) & (two_result.y == double_result.y);

    zero_test & one_test & two_test
}

fn main(
    private_key_a: EmbeddedCurveScalar,
    private_key_b: EmbeddedCurveScalar,
    test_point: EmbeddedCurvePoint,
    scalar1: EmbeddedCurveScalar,
    scalar2: EmbeddedCurveScalar
) -> pub bool {
    // Test 1: Basic scalar multiplication properties
    let properties_test = verify_scalar_mul_properties(test_point, scalar1, scalar2);

    // Test 2: Diffie-Hellman key exchange
    let dh_test = verify_diffie_hellman(private_key_a, private_key_b);

    // Test 3: Small scalar behavior
    let small_scalars_test = test_small_scalars(test_point);

    // Test 4: Multi-scalar multiplication
    let points = [test_point, test_point, test_point];
    let scalars = [scalar1, scalar2, scalar1 + scalar2];
    let msm_result = multi_scalar_multiplication(points, scalars);
    let msm_test = !msm_result.is_infinite; // Should not be infinity for non-zero inputs

    // Test 5: Public key generation
    let public_key = generate_public_key(private_key_a);
    let pubkey_test = !public_key.is_infinite; // Valid private key should give valid public key

    properties_test & dh_test & small_scalars_test & msm_test & pubkey_test
}

#[test]
fn test_generator_operations() {
    let generator = EmbeddedCurvePoint::generator();
    let scalar = EmbeddedCurveScalar::from_field(5);

    // Test scalar multiplication with generator
    let result = scalar_multiply(generator, scalar);
    assert(!result.is_infinite);

    // Test that different scalars give different results
    let scalar2 = EmbeddedCurveScalar::from_field(7);
    let result2 = scalar_multiply(generator, scalar2);
    assert(!(result.x == result2.x && result.y == result2.y));
}

#[test]
fn test_point_operations() {
    let generator = EmbeddedCurvePoint::generator();

    // Test point doubling
    let doubled = point_double(generator);
    assert(!doubled.is_infinite);

    // Test that 2*G = G + G
    let added = point_add(generator, generator);
    assert(doubled.x == added.x);
    assert(doubled.y == added.y);

    // Test point addition with point at infinity
    let infinity = EmbeddedCurvePoint::point_at_infinity();
    let result = point_add(generator, infinity);
    assert(result.x == generator.x);
    assert(result.y == generator.y);
}

#[test]
fn test_scalar_properties() {
    let generator = EmbeddedCurvePoint::generator();

    // Test commutativity of scalar addition in point multiplication
    let a = EmbeddedCurveScalar::from_field(3);
    let b = EmbeddedCurveScalar::from_field(4);

    let result1 = scalar_multiply(generator, a + b);
    let result2_part1 = scalar_multiply(generator, a);
    let result2_part2 = scalar_multiply(generator, b);
    let result2 = point_add(result2_part1, result2_part2);

    assert(result1.x == result2.x);
    assert(result1.y == result2.y);
}

#[test]
fn test_cryptographic_scenario() {
    // Simulate a simple ECDH key exchange
    let alice_private = EmbeddedCurveScalar::from_field(12345);
    let bob_private = EmbeddedCurveScalar::from_field(67890);

    // Generate public keys
    let alice_public = generate_public_key(alice_private);
    let bob_public = generate_public_key(bob_private);

    // Compute shared secrets
    let alice_shared = scalar_multiply(bob_public, alice_private);
    let bob_shared = scalar_multiply(alice_public, bob_private);

    // Shared secrets should match
    assert(alice_shared.x == bob_shared.x);
    assert(alice_shared.y == bob_shared.y);
    assert(alice_shared.is_infinite == bob_shared.is_infinite);
}

#[test]
fn test_multi_scalar_mul() {
    let generator = EmbeddedCurvePoint::generator();
    let point2 = point_double(generator);
    let point3 = point_add(generator, point2);

    let points = [generator, point2, point3];
    let scalars = [
        EmbeddedCurveScalar::from_field(2),
        EmbeddedCurveScalar::from_field(3),
        EmbeddedCurveScalar::from_field(1)
    ];

    // Compute MSM
    let msm_result = multi_scalar_multiplication(points, scalars);

    // Compute manually: 2*G + 3*(2*G) + 1*(3*G) = 2*G + 6*G + 3*G = 11*G
    let manual_result = scalar_multiply(generator, EmbeddedCurveScalar::from_field(11));

    assert(msm_result.x == manual_result.x);
    assert(msm_result.y == manual_result.y);
}

#[test]
fn test_edge_cases() {
    let generator = EmbeddedCurvePoint::generator();
    let infinity = EmbeddedCurvePoint::point_at_infinity();

    // Test scalar multiplication with point at infinity
    let scalar = EmbeddedCurveScalar::from_field(5);
    let result = scalar_multiply(infinity, scalar);
    assert(result.is_infinite);

    // Test scalar multiplication with zero
    let zero_scalar = EmbeddedCurveScalar::from_field(0);
    let zero_result = scalar_multiply(generator, zero_scalar);
    assert(zero_result.is_infinite);

    // Test adding a point to its negation
    let point = scalar_multiply(generator, EmbeddedCurveScalar::from_field(7));
    let neg_point = EmbeddedCurvePoint { x: point.x, y: -point.y, is_infinite: point.is_infinite };
    let sum = point_add(point, neg_point);
    assert(sum.is_infinite);
}
```
