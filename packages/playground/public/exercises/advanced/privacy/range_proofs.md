---
id: range_proofs
title: range_proofs
category: privacy
difficulty: hard
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Range proofs use binary decomposition and commitments to prove values lie within bounds without revealing them. Implement commitment schemes and bit constraints for privacy.

      1. Amount Commitment Creation

      ```noir
      impl AmountCommitment {
          fn new(amount: u64, blinding: Field) -> Self {
              let commitment = pedersen_hash([amount as Field, blinding]);
              AmountCommitment {
                  amount,
                  blinding,
                  commitment
              }
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

      4. Range Proof Verification

      ```noir
      fn verify_range_proof(value: u64, bits: u32) -> bool {
          // Binary decomposition check
          let mut binary_sum = 0;
          let mut power = 1;
          
          for i in 0..bits {
              let bit = (value >> i) & 1;
              assert(bit == 0 | bit == 1); // Bit constraint
              binary_sum += bit * power;
              power *= 2;
          }
          
          binary_sum == value
      }
      ```

      5. Zero-Knowledge Balance Check

      ```noir
      fn prove_balance(
          input_commitment: AmountCommitment,
          output_commitment: AmountCommitment,
          fee: u64
      ) -> bool {
          // Prove: input = output + fee (without revealing amounts)
          let fee_commitment = AmountCommitment::new(fee, 0);
          let total_output = output_commitment.add(fee_commitment);
          
          input_commitment.commitment == total_output.commitment
      }
      ```
    description: >-
      Range proofs allow you to prove that a secret value lies within a specific range without revealing the actual value. Learn to implement zero-knowledge range proofs using binary decomposition and commitment schemes for privacy-preserving applications.

      #### Docs
    docLink: "https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives"
---

```noir
use std::hash::pedersen_hash;

global MAX_AMOUNT: u64 = 1000000; // Maximum transaction amount
global RANGE_BITS: u32 = 64;      // Number of bits for range proof

// Commitment to a transaction amount
struct AmountCommitment {
    amount: u64,        // Secret amount (hidden)
    blinding: Field,    // Random blinding factor
    commitment: Field,  // Pedersen commitment
}

impl AmountCommitment {
    // TODO: Create new amount commitment
    fn new(amount: u64, blinding: Field) -> Self {
        // Hint: Use Pedersen commitment: commitment = amount * G + blinding * H
        todo!()
    }

    // TODO: Verify the commitment is correctly computed
    fn verify(self) -> bool {
        todo!()
    }

    // TODO: Add two amount commitments homomorphically
    fn add(self, other: AmountCommitment) -> AmountCommitment {
        // Hint: Pedersen commitments are additively homomorphic
        // C1 + C2 = (a1 + a2) * G + (b1 + b2) * H
        todo!()
    }

    // TODO: Subtract two amount commitments
    fn subtract(self, other: AmountCommitment) -> AmountCommitment {
        todo!()
    }
}

// Range proof that proves 0 ≤ amount ≤ 2^bits - 1
struct RangeProof {
    commitment: Field,           // Commitment to the amount
    proof_bits: [Field; RANGE_BITS], // Bit decomposition proof
    bit_commitments: [Field; RANGE_BITS], // Commitments to each bit
    range_min: u64,             // Minimum allowed value
    range_max: u64,             // Maximum allowed value
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
        // 1. Decompose amount into bits
        // 2. Create commitments to each bit
        // 3. Prove each bit is 0 or 1
        // 4. Prove bits reconstruct to the amount
        todo!()
    }

    // TODO: Verify the range proof
    fn verify(self) -> bool {
        // Hint:
        // 1. Verify each bit commitment is to 0 or 1
        // 2. Verify bit commitments sum to amount commitment
        // 3. Verify amount is in the specified range
        todo!()
    }

    // TODO: Batch verify multiple range proofs efficiently
    fn batch_verify(proofs: [RangeProof]) -> bool {
        // Hint: Use random linear combination for efficiency
        todo!()
    }
}

// Transaction with range-proof protected amounts
struct PrivateTransaction {
    inputs: [AmountCommitment],      // Input amount commitments
    outputs: [AmountCommitment],     // Output amount commitments
    fee_commitment: AmountCommitment, // Transaction fee commitment
    input_proofs: [RangeProof],      // Range proofs for inputs
    output_proofs: [RangeProof],     // Range proofs for outputs
    balance_proof: Field,            // Proof that inputs = outputs + fee
}

impl PrivateTransaction {
    // TODO: Create new private transaction
    fn new(
        input_amounts: [u64],
        output_amounts: [u64],
        fee: u64,
        input_blindings: [Field],
        output_blindings: [Field],
        fee_blinding: Field
    ) -> Self {
        // Hint:
        // 1. Create amount commitments for inputs and outputs
        // 2. Generate range proofs for all amounts
        // 3. Create balance proof showing inputs = outputs + fee
        todo!()
    }

    // TODO: Verify the entire transaction
    fn verify(self) -> bool {
        // Hint:
        // 1. Verify all range proofs
        // 2. Verify balance equation: sum(inputs) = sum(outputs) + fee
        // 3. Check all amounts are in valid ranges
        todo!()
    }

    // TODO: Get total transaction size (for fee calculation)
    fn transaction_size(self) -> u32 {
        todo!()
    }
}

// Bulletproof-style range proof for efficiency
struct BulletproofRangeProof {
    commitment: Field,
    proof_data: Field,    // Compressed proof data
    range_bits: u32,      // Number of bits in range
}

impl BulletproofRangeProof {
    // TODO: Generate compact bulletproof-style range proof
    fn generate(amount: u64, blinding: Field, bits: u32) -> Self {
        // Hint: Use inner product arguments for logarithmic proof size
        todo!()
    }

    // TODO: Verify bulletproof range proof
    fn verify(self) -> bool {
        todo!()
    }

    // TODO: Get proof size (should be logarithmic in range size)
    fn proof_size(self) -> u32 {
        todo!()
    }
}

// Bit decomposition utilities
fn decompose_to_bits(value: u64, num_bits: u32) -> [u8] {
    // TODO: Decompose value into binary representation
    // Hint: Extract each bit from least significant to most significant
    todo!()
}

fn bits_to_value(bits: [u8]) -> u64 {
    // TODO: Reconstruct value from bit array
    todo!()
}

// Zero-knowledge proof that a committed bit is 0 or 1
fn prove_bit_validity(bit: u8, blinding: Field) -> Field {
    // TODO: Prove that committed value is either 0 or 1
    // Hint: Use the fact that x(x-1) = 0 if and only if x ∈ {0,1}
    todo!()
}

fn verify_bit_proof(commitment: Field, proof: Field) -> bool {
    // TODO: Verify the bit validity proof
    todo!()
}

// Balance proof for transaction integrity
fn generate_balance_proof(
    input_commitments: [AmountCommitment],
    output_commitments: [AmountCommitment],
    fee_commitment: AmountCommitment
) -> Field {
    // TODO: Prove that sum(inputs) = sum(outputs) + fee
    // Hint: Use homomorphic properties of commitments
    todo!()
}

fn verify_balance_proof(
    input_commitments: [AmountCommitment],
    output_commitments: [AmountCommitment],
    fee_commitment: AmountCommitment,
    proof: Field
) -> bool {
    // TODO: Verify the balance proof
    todo!()
}

// Aggregate range proof for multiple amounts
struct AggregateRangeProof {
    commitments: [Field],
    aggregate_proof: Field,
    num_proofs: u32,
}

impl AggregateRangeProof {
    // TODO: Create aggregate proof for multiple amounts
    fn aggregate(proofs: [RangeProof]) -> Self {
        // Hint: Combine multiple proofs into a single proof
        todo!()
    }

    // TODO: Verify aggregate proof
    fn verify(self) -> bool {
        todo!()
    }

    // TODO: Get efficiency gain compared to individual proofs
    fn efficiency_ratio(self) -> u32 {
        // Returns: size_of_individual_proofs / size_of_aggregate_proof
        todo!()
    }
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

    // Test subtraction
    let diff_comm = comm1.subtract(comm2);
    let expected_diff = AmountCommitment::new(amount1 - amount2, blinding1 - blinding2);

    assert(diff_comm.commitment == expected_diff.commitment);
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
fn test_private_transaction() {
    // Transaction: 2 inputs (3000, 2000) -> 2 outputs (1500, 3000) + fee (500)
    let input_amounts = [3000u64, 2000u64];
    let output_amounts = [1500u64, 3000u64];
    let fee = 500u64;

    let input_blindings = [111, 222];
    let output_blindings = [333, 444];
    let fee_blinding = 555;

    let tx = PrivateTransaction::new(
        input_amounts,
        output_amounts,
        fee,
        input_blindings,
        output_blindings,
        fee_blinding
    );

    // Valid transaction should verify
    assert(tx.verify());
}

#[test]
fn test_invalid_transaction_balance() {
    // Invalid transaction: inputs (3000, 2000) ≠ outputs (2000, 2000) + fee (500)
    let input_amounts = [3000u64, 2000u64]; // Total: 5000
    let output_amounts = [2000u64, 2000u64]; // Total: 4000
    let fee = 500u64; // 4000 + 500 = 4500 ≠ 5000

    let input_blindings = [111, 222];
    let output_blindings = [333, 444];
    let fee_blinding = 555;

    let tx = PrivateTransaction::new(
        input_amounts,
        output_amounts,
        fee,
        input_blindings,
        output_blindings,
        fee_blinding
    );

    // Invalid balance should fail verification
    assert(!tx.verify());
}

#[test]
fn test_bulletproof_efficiency() {
    let amount = 12345u64;
    let blinding = 98765;
    let bits = 16;

    // Generate bulletproof
    let bulletproof = BulletproofRangeProof::generate(amount, blinding, bits);
    assert(bulletproof.verify());

    // Generate traditional range proof
    let traditional_proof = RangeProof::generate(amount, blinding, 0, (1u64 << bits) - 1);
    assert(traditional_proof.verify());

    // Bulletproof should be smaller
    let bulletproof_size = bulletproof.proof_size();
    let traditional_size = traditional_proof.bit_commitments.len();

    assert(bulletproof_size < traditional_size);
}

#[test]
fn test_batch_verification() {
    // Create multiple range proofs
    let amounts = [1000u64, 2000u64, 3000u64];
    let blindings = [111, 222, 333];

    let mut proofs = [];
    for i in 0..amounts.len() {
        let proof = RangeProof::generate(amounts[i], blindings[i], 0, MAX_AMOUNT);
        proofs = proofs.push_back(proof);
    }

    // Batch verification should pass
    assert(RangeProof::batch_verify(proofs));

    // Test with one invalid proof
    let invalid_proof = RangeProof::generate(MAX_AMOUNT + 1, 999, 0, MAX_AMOUNT);
    let invalid_proofs = proofs.push_back(invalid_proof);

    // Should fail with invalid proof included
    assert(!RangeProof::batch_verify(invalid_proofs));
}

#[test]
fn test_aggregate_range_proof() {
    // Create individual proofs
    let amounts = [500u64, 1500u64, 2500u64, 3500u64];
    let blindings = [111, 222, 333, 444];

    let mut individual_proofs = [];
    for i in 0..amounts.len() {
        let proof = RangeProof::generate(amounts[i], blindings[i], 0, MAX_AMOUNT);
        individual_proofs = individual_proofs.push_back(proof);
    }

    // Create aggregate proof
    let aggregate = AggregateRangeProof::aggregate(individual_proofs);

    // Should verify successfully
    assert(aggregate.verify());

    // Should be more efficient than individual proofs
    let efficiency = aggregate.efficiency_ratio();
    assert(efficiency > 1); // Aggregate should be smaller
}

#[test]
fn test_bit_validity_proofs() {
    // Test proof for bit = 0
    let bit_0 = 0u8;
    let blinding_0 = 12345;
    let proof_0 = prove_bit_validity(bit_0, blinding_0);

    let commitment_0 = AmountCommitment::new(bit_0 as u64, blinding_0);
    assert(verify_bit_proof(commitment_0.commitment, proof_0));

    // Test proof for bit = 1
    let bit_1 = 1u8;
    let blinding_1 = 67890;
    let proof_1 = prove_bit_validity(bit_1, blinding_1);

    let commitment_1 = AmountCommitment::new(bit_1 as u64, blinding_1);
    assert(verify_bit_proof(commitment_1.commitment, proof_1));
}

#[test]
fn test_zero_amount_handling() {
    // Test that zero amounts are handled correctly
    let zero_amount = 0u64;
    let blinding = 11111;

    let proof = RangeProof::generate(zero_amount, blinding, 0, MAX_AMOUNT);
    assert(proof.verify());

    // Zero amount in transaction
    let tx = PrivateTransaction::new(
        [1000u64], // 1 input
        [1000u64], // 1 output (same as input)
        0,         // Zero fee
        [111],
        [222],
        333
    );

    assert(tx.verify());
}

#[test]
fn test_maximum_amount_boundary() {
    // Test amount at maximum boundary
    let max_amount = MAX_AMOUNT;
    let blinding = 99999;

    let proof = RangeProof::generate(max_amount, blinding, 0, MAX_AMOUNT);
    assert(proof.verify());

    // Test amount exceeding maximum (should fail)
    let over_max = MAX_AMOUNT + 1;
    let invalid_proof = RangeProof::generate(over_max, blinding, 0, MAX_AMOUNT);
    assert(!invalid_proof.verify());
}
```
