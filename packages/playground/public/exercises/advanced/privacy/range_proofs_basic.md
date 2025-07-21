---
id: range_proofs_basic
title: range_proofs_basic
category: privacy
difficulty: medium
tags: []
mode: test
prerequisites: ["amount_commitments"]
version: 1.0.0
locales:
  en:
    hint: >-
      Range proofs use binary decomposition to prove values lie within bounds without revealing them. Implement bit constraints and range verification using commitment schemes.

      1. Range Proof Generation

      ```noir
      fn generate(
          amount: u64,
          blinding: Field,
          range_min: u64,
          range_max: u64
      ) -> Self {
          // Decompose amount into bits
          let bits = decompose_to_bits(amount - range_min, 32);
          
          // Create commitments to each bit
          let mut bit_commitments = [0; 32];
          for i in 0..32 {
              bit_commitments[i] = pedersen_hash([bits[i] as Field, random_blinding()]);
          }
          
          RangeProof {
              commitment: pedersen_hash([amount as Field, blinding]),
              proof_bits: bits,
              bit_commitments,
              range_min,
              range_max
          }
      }
      ```

      2. Range Proof Verification

      ```noir
      fn verify(self) -> bool {
          // Verify each bit is 0 or 1
          for i in 0..self.proof_bits.len() {
              let bit = self.proof_bits[i];
              if bit != 0 && bit != 1 {
                  return false;
              }
          }
          
          // Verify bits reconstruct to valid amount
          let reconstructed = bits_to_value(self.proof_bits);
          let amount = reconstructed + self.range_min;
          
          amount <= self.range_max
      }
      ```

      3. Bit Validity Proof

      ```noir
      fn prove_bit_validity(bit: u8, blinding: Field) -> Field {
          // Prove bit ∈ {0, 1} using x(x-1) = 0
          let bit_field = bit as Field;
          let constraint = bit_field * (bit_field - 1);
          pedersen_hash([constraint, blinding])
      }
      ```

      4. Batch Verification

      ```noir
      fn batch_verify(proofs: [RangeProof]) -> bool {
          for proof in proofs {
              if !proof.verify() {
                  return false;
              }
          }
          true
      }
      ```
    description: >-
      Range proofs enable proving that secret values lie within specific bounds without revealing the actual values. Learn to implement zero-knowledge range proofs using binary decomposition and bit constraints.

      In this exercise, you will:
      1. Generate range proofs using binary decomposition
      2. Verify range proofs without learning secret values
      3. Implement bit validity constraints
      4. Enable efficient batch verification

      #### Docs
    docLink: "https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives"
---

```noir
use std::hash::pedersen_hash;

global MAX_AMOUNT: u64 = 1000000;
global RANGE_BITS: u32 = 32; // Number of bits for range proof

// Import from previous exercise
struct AmountCommitment {
    amount: u64,
    blinding: Field,
    commitment: Field,
}

impl AmountCommitment {
    fn new(amount: u64, blinding: Field) -> Self {
        let commitment = pedersen_hash([amount as Field, blinding]);
        AmountCommitment { amount, blinding, commitment }
    }

    fn verify(self) -> bool {
        let expected = pedersen_hash([self.amount as Field, self.blinding]);
        expected == self.commitment
    }
}

// Range proof that proves range_min ≤ amount ≤ range_max
struct RangeProof {
    commitment: Field,                    // Commitment to the amount
    proof_bits: [Field; RANGE_BITS],      // Bit decomposition proof
    bit_commitments: [Field; RANGE_BITS], // Commitments to each bit
    range_min: u64,                       // Minimum allowed value
    range_max: u64,                       // Maximum allowed value
}

impl RangeProof {
    // TODO: Generate range proof for an amount
    fn generate(
        amount: u64,
        blinding: Field,
        range_min: u64,
        range_max: u64
    ) -> Self {
        // Hint:
        // 1. Check amount is in valid range
        // 2. Decompose (amount - range_min) into bits
        // 3. Create commitments to each bit
        // 4. Generate bit validity proofs
        todo!()
    }

    // TODO: Verify the range proof
    fn verify(self) -> bool {
        // Hint:
        // 1. Verify each bit commitment is to 0 or 1
        // 2. Verify bit commitments sum to amount commitment
        // 3. Verify amount is in the specified range
        // 4. Check bit decomposition is valid
        todo!()
    }

    // TODO: Batch verify multiple range proofs efficiently
    fn batch_verify(proofs: [RangeProof]) -> bool {
        // Hint: Verify each proof individually (could be optimized with random linear combination)
        todo!()
    }

    // TODO: Get the size of this proof
    fn proof_size(self) -> u32 {
        // Hint: Count number of field elements in the proof
        todo!()
    }

    // TODO: Check if proof covers a specific range
    fn covers_range(self, min: u64, max: u64) -> bool {
        // Hint: Check if [min, max] ⊆ [range_min, range_max]
        todo!()
    }
}

// Proof that a committed bit is either 0 or 1
struct BitValidityProof {
    bit_commitment: Field,
    proof_data: Field,
}

impl BitValidityProof {
    // TODO: Generate proof that committed bit is 0 or 1
    fn generate(bit: u8, blinding: Field) -> Self {
        // Hint: Use the constraint that x(x-1) = 0 iff x ∈ {0,1}
        todo!()
    }

    // TODO: Verify bit validity proof
    fn verify(self) -> bool {
        // Hint: Check the algebraic constraint holds
        todo!()
    }
}

// Range constraint system
struct RangeConstraint {
    min_value: u64,
    max_value: u64,
    bit_length: u32,
}

impl RangeConstraint {
    // TODO: Create new range constraint
    fn new(min_value: u64, max_value: u64) -> Self {
        // Hint: Calculate required bit length for the range
        todo!()
    }

    // TODO: Check if value satisfies constraint
    fn satisfies(self, value: u64) -> bool {
        // Hint: Check if min_value <= value <= max_value
        todo!()
    }

    // TODO: Get required bit length for this range
    fn required_bits(self) -> u32 {
        // Hint: Calculate log2(max_value - min_value + 1)
        todo!()
    }

    // TODO: Generate proof for value in range
    fn prove_in_range(self, value: u64, blinding: Field) -> RangeProof {
        // Hint: Use RangeProof::generate with this constraint's parameters
        todo!()
    }
}

// Optimized range proof for specific common ranges
struct PowerOfTwoRangeProof {
    commitment: Field,
    bit_proofs: [BitValidityProof],
    num_bits: u32,
}

impl PowerOfTwoRangeProof {
    // TODO: Generate proof for range [0, 2^bits - 1]
    fn generate_power_of_two(amount: u64, blinding: Field, bits: u32) -> Self {
        // Hint: Optimize for power-of-two ranges (common case)
        todo!()
    }

    // TODO: Verify power-of-two range proof
    fn verify(self) -> bool {
        // Hint: Verify all bit proofs and reconstruction
        todo!()
    }

    // TODO: Get efficiency gain over general range proof
    fn efficiency_ratio(self) -> u32 {
        // Hint: Compare size with equivalent general range proof
        todo!()
    }
}

// Range proof utilities
fn verify_bit_decomposition(value: u64, bits: [Field; RANGE_BITS]) -> bool {
    // TODO: Verify that bits correctly decompose value
    // Hint: Reconstruct value from bits and compare
    todo!()
}

fn prove_bit_constraint(bit: Field, blinding: Field) -> Field {
    // TODO: Generate zero-knowledge proof that bit ∈ {0,1}
    // Hint: Use polynomial constraint x(x-1) = 0
    todo!()
}

fn verify_bit_constraint(bit_commitment: Field, proof: Field) -> bool {
    // TODO: Verify the bit constraint proof
    todo!()
}

// Bit decomposition from previous exercise (for reference)
fn decompose_to_bits(value: u64, num_bits: u32) -> [u8] {
    let mut bits = [0; num_bits];
    let mut remaining = value;

    for i in 0..num_bits {
        bits[i] = (remaining & 1) as u8;
        remaining = remaining >> 1;
    }

    bits
}

fn bits_to_value(bits: [Field; RANGE_BITS]) -> u64 {
    let mut value = 0u64;
    let mut power = 1u64;

    for i in 0..RANGE_BITS {
        value += bits[i] as u64 * power;
        power *= 2;
    }

    value
}

// Range proof aggregation for efficiency
struct AggregatedRangeProof {
    individual_commitments: [Field],
    aggregated_proof: Field,
    shared_range: RangeConstraint,
    num_proofs: u32,
}

impl AggregatedRangeProof {
    // TODO: Aggregate multiple range proofs for same range
    fn aggregate(proofs: [RangeProof]) -> Self {
        // Hint: Combine proofs using random linear combination
        todo!()
    }

    // TODO: Verify aggregated proof
    fn verify(self) -> bool {
        // Hint: Verify the aggregated proof validates all individual commitments
        todo!()
    }

    // TODO: Get compression ratio
    fn compression_ratio(self) -> u32 {
        // Hint: (size of individual proofs) / (size of aggregated proof)
        todo!()
    }
}

fn main(
    amount: u64,
    blinding: Field,
    range_min: u64,
    range_max: u64
) -> pub bool {
    // Create amount commitment
    let commitment = AmountCommitment::new(amount, blinding);

    // Generate range proof
    let range_proof = RangeProof::generate(amount, blinding, range_min, range_max);

    // Verify range proof
    let proof_valid = range_proof.verify();

    // Check commitment verification
    let commitment_valid = commitment.verify();

    // Check amount is in specified range
    let in_range = amount >= range_min && amount <= range_max;

    proof_valid & commitment_valid & in_range
}

#[test]
fn test_range_proof_valid_amount() {
    let amount = 5000u64;
    let blinding = 54321;
    let range_min = 0u64;
    let range_max = 10000u64;

    let proof = RangeProof::generate(amount, blinding, range_min, range_max);

    // Valid amount should verify successfully
    assert(proof.verify());
    assert(proof.covers_range(range_min, range_max));
}

#[test]
fn test_range_proof_invalid_amount() {
    let amount = 15000u64; // Exceeds max range
    let blinding = 98765;
    let range_min = 0u64;
    let range_max = 10000u64;

    let proof = RangeProof::generate(amount, blinding, range_min, range_max);

    // Invalid amount should fail verification
    assert(!proof.verify());
}

#[test]
fn test_bit_validity_proofs() {
    // Test bit = 0
    let bit_0 = 0u8;
    let blinding_0 = 12345;
    let proof_0 = BitValidityProof::generate(bit_0, blinding_0);
    assert(proof_0.verify());

    // Test bit = 1
    let bit_1 = 1u8;
    let blinding_1 = 67890;
    let proof_1 = BitValidityProof::generate(bit_1, blinding_1);
    assert(proof_1.verify());

    // Test invalid bit should fail (implementation should reject)
    // Note: In practice, generate() should only accept 0 or 1
}

#[test]
fn test_range_constraints() {
    let constraint = RangeConstraint::new(100, 1000);

    // Valid values
    assert(constraint.satisfies(500));
    assert(constraint.satisfies(100)); // Boundary
    assert(constraint.satisfies(1000)); // Boundary

    // Invalid values
    assert(!constraint.satisfies(50));   // Below range
    assert(!constraint.satisfies(1500)); // Above range

    // Required bits should be reasonable
    let bits_needed = constraint.required_bits();
    assert(bits_needed <= 32); // Should fit in reasonable bit count
}

#[test]
fn test_power_of_two_range_proof() {
    let amount = 255u64; // Fits in 8 bits
    let blinding = 11111;
    let bits = 8u32;

    let proof = PowerOfTwoRangeProof::generate_power_of_two(amount, blinding, bits);
    assert(proof.verify());

    // Should be more efficient than general range proof
    let efficiency = proof.efficiency_ratio();
    assert(efficiency > 1);
}

#[test]
fn test_batch_verification() {
    let amounts = [1000u64, 2000u64, 3000u64];
    let blindings = [111, 222, 333];
    let range_min = 0u64;
    let range_max = 5000u64;

    let mut proofs = [];
    for i in 0..amounts.len() {
        let proof = RangeProof::generate(amounts[i], blindings[i], range_min, range_max);
        proofs = proofs.push_back(proof);
    }

    // All valid proofs should verify in batch
    assert(RangeProof::batch_verify(proofs));
}

#[test]
fn test_batch_verification_with_invalid() {
    let amounts = [1000u64, 2000u64, 6000u64]; // Last one exceeds range
    let blindings = [111, 222, 333];
    let range_min = 0u64;
    let range_max = 5000u64;

    let mut proofs = [];
    for i in 0..amounts.len() {
        let proof = RangeProof::generate(amounts[i], blindings[i], range_min, range_max);
        proofs = proofs.push_back(proof);
    }

    // Should fail due to invalid proof
    assert(!RangeProof::batch_verify(proofs));
}

#[test]
fn test_bit_decomposition_verification() {
    let value = 42u64;
    let bits_u8 = decompose_to_bits(value, 8);

    // Convert to Field array for verification
    let mut bits_field = [0; RANGE_BITS];
    for i in 0..8 {
        bits_field[i] = bits_u8[i] as Field;
    }

    // Should verify correctly
    assert(verify_bit_decomposition(value, bits_field));

    // Wrong decomposition should fail
    bits_field[0] = 1 - bits_field[0]; // Flip a bit
    assert(!verify_bit_decomposition(value, bits_field));
}

#[test]
fn test_aggregated_range_proof() {
    let amounts = [500u64, 1500u64, 2500u64];
    let blindings = [111, 222, 333];
    let range_min = 0u64;
    let range_max = 3000u64;

    // Create individual proofs
    let mut individual_proofs = [];
    for i in 0..amounts.len() {
        let proof = RangeProof::generate(amounts[i], blindings[i], range_min, range_max);
        individual_proofs = individual_proofs.push_back(proof);
    }

    // Create aggregated proof
    let aggregated = AggregatedRangeProof::aggregate(individual_proofs);

    // Should verify successfully
    assert(aggregated.verify());

    // Should provide compression
    let compression = aggregated.compression_ratio();
    assert(compression > 1);
}

#[test]
fn test_zero_value_range_proof() {
    let amount = 0u64;
    let blinding = 99999;
    let range_min = 0u64;
    let range_max = 1000u64;

    let proof = RangeProof::generate(amount, blinding, range_min, range_max);
    assert(proof.verify());
}

#[test]
fn test_maximum_value_range_proof() {
    let range_min = 0u64;
    let range_max = 1000u64;
    let amount = range_max; // At boundary
    let blinding = 77777;

    let proof = RangeProof::generate(amount, blinding, range_min, range_max);
    assert(proof.verify());

    // Just over boundary should fail
    let over_proof = RangeProof::generate(amount + 1, blinding, range_min, range_max);
    assert(!over_proof.verify());
}

#[test]
fn test_proof_size_efficiency() {
    let amount = 1000u64;
    let blinding = 12345;
    let range_min = 0u64;
    let range_max = 2048u64; // Power of 2

    let general_proof = RangeProof::generate(amount, blinding, range_min, range_max);
    let pot_proof = PowerOfTwoRangeProof::generate_power_of_two(amount, blinding, 11); // 2^11 = 2048

    let general_size = general_proof.proof_size();
    let pot_size = pot_proof.num_bits;

    // Power-of-two proof should be more efficient for power-of-two ranges
    assert(pot_size <= general_size);
}
```
