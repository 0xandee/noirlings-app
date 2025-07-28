---
id: multi_scalar_multiplication
title: multi_scalar_multiplication
category: embedded_curves
difficulty: medium
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Multi-scalar multiplication efficiently computes the sum of multiple scalar-point products. Compare naive vs optimized approaches and apply to batch signature verification.

      1. Efficient MSM Implementation

      ```noir

      fn efficient_msm(
          scalars: [EmbeddedCurveScalar; N],
          points: [EmbeddedCurvePoint; N]
      ) -> EmbeddedCurvePoint {
          multi_scalar_mul(points, scalars)
      }

      ```

      2. Naive MSM for Comparison

      ```noir

      fn naive_msm(
          scalars: [EmbeddedCurveScalar; N],
          points: [EmbeddedCurvePoint; N]
      ) -> EmbeddedCurvePoint {
          let mut result = EmbeddedCurvePoint::point_at_infinity();
          for i in 0..N {
              let product = points[i].scalar_mul(scalars[i]);
              result = result.add(product);
          }
          result
      }

      ```

      3. Batch Signature Verification

      ```noir

      fn batch_verify_signatures(
          messages: [Field; N],
          signatures_r: [EmbeddedCurveScalar; N],
          signatures_s: [EmbeddedCurveScalar; N],
          public_keys: [EmbeddedCurvePoint; N]
      ) -> bool {
          // Simplified batch verification using MSM
          let combined_point = multi_scalar_mul(public_keys, signatures_s);
          !combined_point.is_infinite
      }

      ```
    description: >-
      Multi-scalar multiplication (MSM) is an optimization technique for computing multiple scalar multiplications simultaneously. Learn to implement efficient batch verification of signatures and proof aggregation using MSM algorithms like Pippenger's method.

      #### Docs
    docLink: "https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives/embedded_curve_ops"
---

```noir
use std::embedded_curve_ops::{EmbeddedCurvePoint, EmbeddedCurveScalar, multi_scalar_mul, fixed_base_scalar_mul, add};

// Helper function for point at infinity
fn point_at_infinity() -> EmbeddedCurvePoint {
    EmbeddedCurvePoint { x: 0, y: 0, is_infinite: true }
}

// Helper function for generator point
fn generator() -> EmbeddedCurvePoint {
    EmbeddedCurvePoint {
        x: 1,
        y: 17631683881184975370165255887551781615748388533673675138860,
        is_infinite: false
    }
}

// TODO: Implement efficient multi-scalar multiplication
fn efficient_msm<let N: u32>(
    scalars: [EmbeddedCurveScalar; N],
    points: [EmbeddedCurvePoint; N]
) -> EmbeddedCurvePoint {
    // Hint: Use the built-in multi_scalar_mul function for optimal efficiency
    // This function is implemented using advanced algorithms like Pippenger's method
    multi_scalar_mul(points, scalars)
}

// TODO: Compare naive vs optimized MSM
fn naive_msm<let N: u32>(
    scalars: [EmbeddedCurveScalar; N],
    points: [EmbeddedCurvePoint; N]
) -> EmbeddedCurvePoint {
    // Hint: Implement using individual scalar multiplications and additions
    // This will be slower but helps understand the optimization benefits
    let mut result = point_at_infinity();
    for i in 0..N {
        let product = fixed_base_scalar_mul(scalars[i], points[i]);
        result = add(result, product);
    }
    result
}

// TODO: Implement batch signature verification scenario
fn batch_verify_signatures<let N: u32>(
    messages: [Field; N],
    signatures_r: [EmbeddedCurveScalar; N],
    signatures_s: [EmbeddedCurveScalar; N],
    public_keys: [EmbeddedCurvePoint; N]
) -> bool {
    // Hint: Use MSM to verify multiple ECDSA signatures efficiently
    // This demonstrates a real-world application of MSM
    // Simplified batch verification using MSM
    let combined_point = multi_scalar_mul(public_keys, signatures_s);
    !combined_point.is_infinite
}

#[test]
fn test_msm_efficiency() {
    let scalars = [
        EmbeddedCurveScalar::from_field(123),
        EmbeddedCurveScalar::from_field(456),
        EmbeddedCurveScalar::from_field(789)
    ];

    let gen = generator();
    let gen_double = add(gen, gen);
    let gen_quad = add(gen_double, gen_double);
    let points = [gen, gen_double, gen_quad];

    let result_efficient = efficient_msm(scalars, points);
    let result_naive = naive_msm(scalars, points);

    // Both methods should produce the same result
    assert(result_efficient.x == result_naive.x);
    assert(result_efficient.y == result_naive.y);
    assert(result_efficient.is_infinite == result_naive.is_infinite);
}

#[test]
fn test_msm_properties() {
    let scalars = [
        EmbeddedCurveScalar::from_field(5),
        EmbeddedCurveScalar::from_field(3)
    ];

    let gen = generator();
    let gen_double = add(gen, gen);
    let points = [gen, gen_double];

    let result = efficient_msm(scalars, points);

    // Should equal: 5*G + 3*(2*G) = 5*G + 6*G = 11*G
    let expected = fixed_base_scalar_mul(EmbeddedCurveScalar::from_field(11), generator());

    assert(result.x == expected.x);
    assert(result.y == expected.y);
    assert(result.is_infinite == expected.is_infinite);
}

#[test]
fn test_batch_signature_verification() {
    // Test data for batch signature verification
    let messages = [
        0x1234567890abcdef,
        0xfedcba0987654321,
        0x1111222233334444
    ];

    // Simplified signature components (in practice, these would be real signatures)
    let signatures_r = [
        EmbeddedCurveScalar::from_field(100),
        EmbeddedCurveScalar::from_field(200),
        EmbeddedCurveScalar::from_field(300)
    ];

    let signatures_s = [
        EmbeddedCurveScalar::from_field(50),
        EmbeddedCurveScalar::from_field(75),
        EmbeddedCurveScalar::from_field(125)
    ];

    let gen = generator();
    let gen_double = add(gen, gen);
    let gen_quad = add(gen_double, gen_double);
    let public_keys = [gen, gen_double, gen_quad];

    // The batch verification should handle multiple signatures efficiently
    let is_valid = batch_verify_signatures(messages, signatures_r, signatures_s, public_keys);

    // This is a simplified test - in practice, verification would involve
    // more complex cryptographic operations
    assert(is_valid);
}
```

## Verification

Run `nargo test` to verify your implementation. The tests check:

1. **Efficiency comparison**: Both naive and optimized MSM produce the same results
2. **Mathematical correctness**: MSM follows the expected algebraic properties
3. **Batch verification**: MSM can be applied to real cryptographic scenarios

## Performance Notes

- MSM becomes increasingly beneficial as the number of scalar-point pairs grows
- Pippenger's algorithm has O(n/log n) complexity compared to O(n) for naive approaches
- Precomputation can further optimize MSM for repeated operations with the same points

## Extensions

1. Implement windowing methods for MSM optimization
2. Add support for variable-length scalar-point pairs
3. Measure and compare performance metrics between different MSM strategies
4. Implement MSM-based proof aggregation scenarios

   #### Docs
