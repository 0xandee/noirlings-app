---
id: amount_commitments
title: amount_commitments
category: privacy
difficulty: easy
tags: []
mode: test
prerequisites: ["identity_commitments"]
version: 1.0.0
locales:
  en:
    hint: >-
      Amount commitments hide transaction values while preserving mathematical relationships through homomorphic properties. Implement Pedersen commitments for private amounts.

      1. Amount Commitment Creation

      ```noir
      fn new(amount: u64, blinding: Field) -> Self {
          let commitment = pedersen_hash([amount as Field, blinding]);
          AmountCommitment {
              amount,
              blinding,
              commitment
          }
      }
      ```

      2. Commitment Verification

      ```noir
      fn verify(self) -> bool {
          let expected_commitment = pedersen_hash([self.amount as Field, self.blinding]);
          expected_commitment == self.commitment
      }
      ```

      3. Homomorphic Addition

      ```noir
      fn add(self, other: AmountCommitment) -> AmountCommitment {
          AmountCommitment {
              amount: self.amount + other.amount,
              blinding: self.blinding + other.blinding,
              commitment: self.commitment + other.commitment
          }
      }
      ```

      4. Bit Decomposition

      ```noir
      fn decompose_to_bits(value: u64, num_bits: u32) -> [u8] {
          let mut bits = [0; num_bits];
          let mut remaining = value;
          
          for i in 0..num_bits {
              bits[i] = (remaining & 1) as u8;
              remaining = remaining >> 1;
          }
          
          bits
      }
      ```
    description: >-
      Amount commitments enable privacy-preserving arithmetic on hidden values. Learn to implement Pedersen commitments with homomorphic properties for confidential transaction amounts.

      In this exercise, you will:
      1. Create cryptographic commitments to transaction amounts
      2. Implement homomorphic addition and subtraction
      3. Handle bit decomposition for range proof preparation
      4. Understand commitment binding and hiding properties

      #### Docs
    docLink: "https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives/hashes#pedersen-hash"
---

```noir
use std::hash::pedersen_hash;

global MAX_AMOUNT: u64 = 1000000; // Maximum transaction amount
global COMMITMENT_BITS: u32 = 64; // Number of bits for amounts

// Commitment to a transaction amount
struct AmountCommitment {
    amount: u64,        // Secret amount (hidden)
    blinding: Field,    // Random blinding factor
    commitment: Field,  // Pedersen commitment
}

impl AmountCommitment {
    // TODO: Create new amount commitment
    fn new(amount: u64, blinding: Field) -> Self {
        // Hint: Use Pedersen commitment: commitment = pedersen_hash([amount, blinding])
        // This hides the amount while allowing verification
        todo!()
    }

    // TODO: Verify the commitment is correctly computed
    fn verify(self) -> bool {
        // Hint: Recompute commitment and compare with stored value
        todo!()
    }

    // TODO: Add two amount commitments homomorphically
    fn add(self, other: AmountCommitment) -> AmountCommitment {
        // Hint: Pedersen commitments are additively homomorphic
        // C1 + C2 = commit(a1 + a2, b1 + b2)
        todo!()
    }

    // TODO: Subtract two amount commitments
    fn subtract(self, other: AmountCommitment) -> AmountCommitment {
        // Hint: Similar to addition but with subtraction
        todo!()
    }

    // TODO: Multiply commitment by a scalar
    fn multiply_scalar(self, scalar: u64) -> AmountCommitment {
        // Hint: commit(a * s, b * s) = s * commit(a, b)
        todo!()
    }

    // TODO: Check if commitment represents zero
    fn is_zero(self) -> bool {
        // Hint: A commitment to zero with zero blinding should be the identity
        todo!()
    }
}

// Commitment to a single bit (0 or 1)
struct BitCommitment {
    bit: u8,           // The bit value (0 or 1)
    blinding: Field,   // Random blinding factor
    commitment: Field, // Commitment to the bit
}

impl BitCommitment {
    // TODO: Create commitment to a bit
    fn new(bit: u8, blinding: Field) -> Self {
        // Hint: Bit must be 0 or 1, commit using pedersen_hash
        todo!()
    }

    // TODO: Verify bit commitment
    fn verify(self) -> bool {
        // Hint: Check commitment is correct and bit is valid (0 or 1)
        todo!()
    }

    // TODO: Add two bit commitments
    fn add(self, other: BitCommitment) -> AmountCommitment {
        // Hint: Result might not be a bit (could be 0, 1, or 2)
        todo!()
    }
}

// Bit decomposition utilities
fn decompose_to_bits(value: u64, num_bits: u32) -> [u8] {
    // TODO: Decompose value into binary representation
    // Hint: Extract each bit from least significant to most significant
    // Use bitwise operations: (value >> i) & 1
    todo!()
}

fn bits_to_value(bits: [u8]) -> u64 {
    // TODO: Reconstruct value from bit array
    // Hint: value = sum(bits[i] * 2^i)
    todo!()
}

fn validate_bit_array(bits: [u8]) -> bool {
    // TODO: Check that all elements in array are 0 or 1
    todo!()
}

// Commitment arithmetic operations
struct CommitmentCalculator {
    operations_count: u32,
}

impl CommitmentCalculator {
    // TODO: Create new calculator
    fn new() -> Self {
        todo!()
    }

    // TODO: Add multiple commitments
    fn sum_commitments(&mut self, commitments: [AmountCommitment]) -> AmountCommitment {
        // Hint: Use homomorphic addition to sum all commitments
        todo!()
    }

    // TODO: Compute weighted sum of commitments
    fn weighted_sum(&mut self, commitments: [AmountCommitment], weights: [u64]) -> AmountCommitment {
        // Hint: sum(weights[i] * commitments[i])
        todo!()
    }

    // TODO: Check if sum of inputs equals sum of outputs
    fn verify_balance(
        &mut self,
        inputs: [AmountCommitment],
        outputs: [AmountCommitment]
    ) -> bool {
        // Hint: sum(inputs) should equal sum(outputs) for balanced transaction
        todo!()
    }

    // TODO: Get number of operations performed
    fn get_operation_count(self) -> u32 {
        todo!()
    }
}

// Commitment batching for efficiency
struct CommitmentBatch {
    commitments: [AmountCommitment],
    batch_proof: Field,
}

impl CommitmentBatch {
    // TODO: Create batch of commitments
    fn new(amounts: [u64], blindings: [Field]) -> Self {
        // Hint: Create commitment for each amount-blinding pair
        todo!()
    }

    // TODO: Verify all commitments in batch
    fn verify_batch(&self) -> bool {
        // Hint: Verify each commitment individually
        todo!()
    }

    // TODO: Get total amount (sum of all amounts)
    fn total_amount(&self) -> u64 {
        // Hint: Sum all the amounts (this breaks privacy - only for testing)
        todo!()
    }

    // TODO: Get commitment to total amount
    fn total_commitment(&self) -> AmountCommitment {
        // Hint: Use homomorphic addition to get sum of commitments
        todo!()
    }
}

fn main(
    amount1: u64,
    amount2: u64,
    blinding1: Field,
    blinding2: Field
) -> pub bool {
    // Create amount commitments
    let comm1 = AmountCommitment::new(amount1, blinding1);
    let comm2 = AmountCommitment::new(amount2, blinding2);

    // Test commitment verification
    let verify1 = comm1.verify();
    let verify2 = comm2.verify();

    // Test homomorphic addition
    let sum_comm = comm1.add(comm2);
    let expected_sum = AmountCommitment::new(amount1 + amount2, blinding1 + blinding2);
    let addition_correct = sum_comm.commitment == expected_sum.commitment;

    verify1 & verify2 & addition_correct
}

#[test]
fn test_amount_commitment() {
    let amount = 1000u64;
    let blinding = 12345;

    let commitment = AmountCommitment::new(amount, blinding);

    // Commitment should verify correctly
    assert(commitment.verify());

    // Different amounts should produce different commitments
    let commitment2 = AmountCommitment::new(2000, blinding);
    assert(commitment.commitment != commitment2.commitment);

    // Different blindings should produce different commitments
    let commitment3 = AmountCommitment::new(amount, 67890);
    assert(commitment.commitment != commitment3.commitment);
}

#[test]
fn test_commitment_homomorphism() {
    let amount1 = 500u64;
    let amount2 = 300u64;
    let blinding1 = 111;
    let blinding2 = 222;

    let comm1 = AmountCommitment::new(amount1, blinding1);
    let comm2 = AmountCommitment::new(amount2, blinding2);

    // Test addition
    let sum_comm = comm1.add(comm2);
    let expected_sum = AmountCommitment::new(amount1 + amount2, blinding1 + blinding2);

    assert(sum_comm.commitment == expected_sum.commitment);

    // Test subtraction (assuming amount1 > amount2)
    let diff_comm = comm1.subtract(comm2);
    let expected_diff = AmountCommitment::new(amount1 - amount2, blinding1 - blinding2);

    assert(diff_comm.commitment == expected_diff.commitment);
}

#[test]
fn test_scalar_multiplication() {
    let amount = 100u64;
    let blinding = 555;
    let scalar = 3u64;

    let comm = AmountCommitment::new(amount, blinding);
    let scaled_comm = comm.multiply_scalar(scalar);

    let expected = AmountCommitment::new(amount * scalar, blinding * scalar as Field);
    assert(scaled_comm.commitment == expected.commitment);
}

#[test]
fn test_bit_decomposition() {
    let value = 42u64; // Binary: 101010
    let bits = decompose_to_bits(value, 8);

    // Check specific bits for 42 (101010 in binary)
    assert(bits[0] == 0); // LSB
    assert(bits[1] == 1);
    assert(bits[2] == 0);
    assert(bits[3] == 1);
    assert(bits[4] == 0);
    assert(bits[5] == 1);
    assert(bits[6] == 0); // MSB for 8-bit representation
    assert(bits[7] == 0);

    // Reconstruction should give original value
    let reconstructed = bits_to_value(bits);
    assert(reconstructed == value);

    // Validate bit array
    assert(validate_bit_array(bits));
}

#[test]
fn test_bit_commitments() {
    let bit_0 = 0u8;
    let bit_1 = 1u8;
    let blinding1 = 123;
    let blinding2 = 456;

    let comm_0 = BitCommitment::new(bit_0, blinding1);
    let comm_1 = BitCommitment::new(bit_1, blinding2);

    // Both should verify
    assert(comm_0.verify());
    assert(comm_1.verify());

    // Should produce different commitments
    assert(comm_0.commitment != comm_1.commitment);

    // Adding bit commitments
    let sum = comm_0.add(comm_1);
    assert(sum.amount == (bit_0 + bit_1) as u64);
}

#[test]
fn test_commitment_calculator() {
    let mut calc = CommitmentCalculator::new();

    let amounts = [100u64, 200u64, 300u64];
    let blindings = [111, 222, 333];

    let mut commitments = [];
    for i in 0..amounts.len() {
        let comm = AmountCommitment::new(amounts[i], blindings[i]);
        commitments = commitments.push_back(comm);
    }

    // Test sum
    let total = calc.sum_commitments(commitments);
    let expected_total = AmountCommitment::new(600, 666); // Sum of amounts and blindings
    assert(total.commitment == expected_total.commitment);

    // Test weighted sum
    let weights = [2u64, 3u64, 1u64];
    let weighted = calc.weighted_sum(commitments, weights);
    let expected_weighted = AmountCommitment::new(
        2*100 + 3*200 + 1*300, // 200 + 600 + 300 = 1100
        2*111 + 3*222 + 1*333  // 222 + 666 + 333 = 1221
    );
    assert(weighted.commitment == expected_weighted.commitment);
}

#[test]
fn test_balance_verification() {
    let mut calc = CommitmentCalculator::new();

    // Balanced transaction: 2 inputs (300, 200) -> 2 outputs (250, 250)
    let inputs = [
        AmountCommitment::new(300, 111),
        AmountCommitment::new(200, 222)
    ];

    let outputs = [
        AmountCommitment::new(250, 333),
        AmountCommitment::new(250, 0)   // Adjusted blinding to balance
    ];

    // This should balance if blindings are set correctly
    // For test purposes, we'll check the structure
    let input_sum = calc.sum_commitments(inputs);
    let output_sum = calc.sum_commitments(outputs);

    // Amounts should balance
    assert(input_sum.amount == output_sum.amount);
}

#[test]
fn test_commitment_batch() {
    let amounts = [100u64, 200u64, 300u64, 400u64];
    let blindings = [111, 222, 333, 444];

    let batch = CommitmentBatch::new(amounts, blindings);

    // Batch should verify
    assert(batch.verify_batch());

    // Total amount should be sum
    assert(batch.total_amount() == 1000);

    // Total commitment should equal sum of individual commitments
    let total_comm = batch.total_commitment();
    let expected_total = AmountCommitment::new(1000, 1110); // Sum of blindings
    assert(total_comm.commitment == expected_total.commitment);
}

#[test]
fn test_zero_commitment() {
    let zero_amount = 0u64;
    let blinding = 999;

    let zero_comm = AmountCommitment::new(zero_amount, blinding);
    assert(zero_comm.verify());

    // Test zero detection (only works with zero blinding)
    let true_zero = AmountCommitment::new(0, 0);
    assert(true_zero.is_zero());

    // Non-zero amount should not be zero
    let non_zero = AmountCommitment::new(1, 0);
    assert(!non_zero.is_zero());
}

#[test]
fn test_edge_cases() {
    // Test maximum amount
    let max_amount = MAX_AMOUNT;
    let max_comm = AmountCommitment::new(max_amount, 123);
    assert(max_comm.verify());

    // Test bit decomposition edge cases
    let zero_bits = decompose_to_bits(0, 8);
    assert(bits_to_value(zero_bits) == 0);

    let max_8bit = 255u64;
    let max_bits = decompose_to_bits(max_8bit, 8);
    assert(bits_to_value(max_bits) == max_8bit);

    // All bits should be 1 for 255
    for i in 0..8 {
        assert(max_bits[i] == 1);
    }
}
```
