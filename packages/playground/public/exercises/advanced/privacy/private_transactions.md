---
id: private_transactions
title: private_transactions
category: privacy
difficulty: hard
tags: []
mode: test
prerequisites: ["range_proofs_basic"]
version: 1.0.0
locales:
  en:
    hint: >-
      Private transactions combine range proofs with balance verification to enable confidential transfers. Implement bulletproof-style optimizations for efficiency.

      1. Private Transaction Creation

      ```noir
      fn new(
          input_amounts: [u64],
          output_amounts: [u64],
          fee: u64,
          input_blindings: [Field],
          output_blindings: [Field],
          fee_blinding: Field
      ) -> Self {
          // Create amount commitments
          let mut inputs = [];
          for i in 0..input_amounts.len() {
              inputs.push(AmountCommitment::new(input_amounts[i], input_blindings[i]));
          }
          
          let mut outputs = [];
          for i in 0..output_amounts.len() {
              outputs.push(AmountCommitment::new(output_amounts[i], output_blindings[i]));
          }
          
          let fee_commitment = AmountCommitment::new(fee, fee_blinding);
          
          PrivateTransaction {
              inputs,
              outputs,
              fee_commitment,
              input_proofs: [],
              output_proofs: [],
              balance_proof: 0
          }
      }
      ```

      2. Balance Verification

      ```noir
      fn verify_balance(
          input_commitments: [AmountCommitment],
          output_commitments: [AmountCommitment],
          fee_commitment: AmountCommitment
      ) -> bool {
          let input_sum = sum_commitments(input_commitments);
          let output_sum = sum_commitments(output_commitments);
          let total_output = output_sum.add(fee_commitment);
          
          input_sum.commitment == total_output.commitment
      }
      ```

      3. Bulletproof-style Range Proof

      ```noir
      fn generate(amount: u64, blinding: Field, bits: u32) -> Self {
          // Use inner product arguments for logarithmic proof size
          let commitment = pedersen_hash([amount as Field, blinding]);
          let proof_data = inner_product_proof(amount, blinding, bits);
          
          BulletproofRangeProof {
              commitment,
              proof_data,
              range_bits: bits
          }
      }
      ```

      4. Transaction Size Optimization

      ```noir
      fn aggregate_range_proofs(proofs: [RangeProof]) -> AggregateRangeProof {
          // Combine multiple range proofs for efficiency
          let commitments = extract_commitments(proofs);
          let aggregate_proof = combine_proofs(proofs);
          
          AggregateRangeProof {
              commitments,
              aggregate_proof,
              num_proofs: proofs.len()
          }
      }
      ```
    description: >-
      Private transactions enable confidential value transfers using range proofs and balance verification. Learn to implement complete transaction systems with bulletproof-style optimizations for practical deployment.

      In this exercise, you will:
      1. Build complete private transaction systems
      2. Implement balance verification without revealing amounts
      3. Optimize range proofs using bulletproof-style techniques
      4. Enable transaction aggregation for scalability

      #### Docs
    docLink: "https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives"
---

```noir
use std::hash::pedersen_hash;

global MAX_AMOUNT: u64 = 1000000;
global RANGE_BITS: u32 = 32;

// Import from previous exercises
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

    fn add(self, other: AmountCommitment) -> AmountCommitment {
        AmountCommitment {
            amount: self.amount + other.amount,
            blinding: self.blinding + other.blinding,
            commitment: self.commitment + other.commitment
        }
    }
}

struct RangeProof {
    commitment: Field,
    proof_bits: [Field; RANGE_BITS],
    bit_commitments: [Field; RANGE_BITS],
    range_min: u64,
    range_max: u64,
}

impl RangeProof {
    fn generate(amount: u64, blinding: Field, range_min: u64, range_max: u64) -> Self {
        // Simplified implementation - use from previous exercise
        RangeProof {
            commitment: pedersen_hash([amount as Field, blinding]),
            proof_bits: [0; RANGE_BITS],
            bit_commitments: [0; RANGE_BITS],
            range_min,
            range_max
        }
    }

    fn verify(self) -> bool {
        // Simplified - assume valid for this exercise
        true
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
        // Hint: Sum up sizes of all proofs and commitments
        todo!()
    }

    // TODO: Check if transaction is balanced
    fn is_balanced(self) -> bool {
        // Hint: Verify inputs = outputs + fee using commitments
        todo!()
    }

    // TODO: Get total input amount (only for testing - breaks privacy)
    fn total_input_amount(self) -> u64 {
        // Hint: Sum all input amounts (for validation only)
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
        // This is a simplified version - real bulletproofs are more complex
        todo!()
    }

    // TODO: Verify bulletproof range proof
    fn verify(self) -> bool {
        // Hint: Verify the inner product proof
        todo!()
    }

    // TODO: Get proof size (should be logarithmic in range size)
    fn proof_size(self) -> u32 {
        // Hint: O(log(range_bits)) instead of O(range_bits)
        todo!()
    }

    // TODO: Compare efficiency with traditional range proof
    fn efficiency_gain_over_traditional(self, traditional_size: u32) -> u32 {
        // Hint: traditional_size / bulletproof_size
        todo!()
    }
}

// Optimized transaction using bulletproofs
struct OptimizedPrivateTransaction {
    inputs: [AmountCommitment],
    outputs: [AmountCommitment],
    fee_commitment: AmountCommitment,
    input_bulletproofs: [BulletproofRangeProof],
    output_bulletproofs: [BulletproofRangeProof],
    balance_proof: Field,
}

impl OptimizedPrivateTransaction {
    // TODO: Create optimized transaction with bulletproofs
    fn new(
        input_amounts: [u64],
        output_amounts: [u64],
        fee: u64,
        input_blindings: [Field],
        output_blindings: [Field],
        fee_blinding: Field
    ) -> Self {
        // Hint: Similar to PrivateTransaction but use bulletproofs
        todo!()
    }

    // TODO: Verify optimized transaction
    fn verify(self) -> bool {
        // Hint: Verify bulletproofs and balance
        todo!()
    }

    // TODO: Get size efficiency compared to traditional transaction
    fn size_efficiency(self) -> u32 {
        // Hint: Compare total size with equivalent traditional transaction
        todo!()
    }
}

// Balance proof utilities
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
    // Hint: Check that the homomorphic equation holds
    todo!()
}

// Transaction aggregation for efficiency
struct TransactionBatch {
    transactions: [PrivateTransaction],
    batch_proof: Field,
    total_fee: AmountCommitment,
}

impl TransactionBatch {
    // TODO: Create batch of transactions
    fn new(transactions: [PrivateTransaction]) -> Self {
        // Hint: Aggregate transactions and proofs
        todo!()
    }

    // TODO: Verify entire batch
    fn verify_batch(self) -> bool {
        // Hint: Verify all transactions and batch consistency
        todo!()
    }

    // TODO: Get batch efficiency
    fn batch_efficiency(self) -> u32 {
        // Hint: Compare batch size vs individual transaction sizes
        todo!()
    }
}

// Advanced range proof aggregation
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
        // Hint: Verify the aggregated proof validates all commitments
        todo!()
    }

    // TODO: Get efficiency gain compared to individual proofs
    fn efficiency_ratio(self) -> u32 {
        // Returns: size_of_individual_proofs / size_of_aggregate_proof
        todo!()
    }
}

// Transaction validation and utilities
fn validate_transaction_amounts(
    input_amounts: [u64],
    output_amounts: [u64],
    fee: u64
) -> bool {
    // TODO: Check basic transaction validity
    // Hint: Ensure inputs = outputs + fee, all amounts >= 0, amounts <= MAX_AMOUNT
    todo!()
}

fn calculate_recommended_fee(transaction_size: u32) -> u64 {
    // TODO: Calculate fee based on transaction size
    // Hint: fee = size * fee_rate
    todo!()
}

fn estimate_transaction_size(
    num_inputs: u32,
    num_outputs: u32,
    proof_type: u32 // 0 = traditional, 1 = bulletproof
) -> u32 {
    // TODO: Estimate transaction size before creation
    // Hint: Consider commitments, proofs, and metadata
    todo!()
}

fn main(
    input_amounts: [u64; 2],
    output_amounts: [u64; 2],
    fee: u64,
    input_blindings: [Field; 2],
    output_blindings: [Field; 2],
    fee_blinding: Field
) -> pub bool {
    // Validate transaction amounts
    let amounts_valid = validate_transaction_amounts(input_amounts, output_amounts, fee);

    // Create private transaction
    let tx = PrivateTransaction::new(
        input_amounts,
        output_amounts,
        fee,
        input_blindings,
        output_blindings,
        fee_blinding
    );

    // Verify transaction
    let tx_valid = tx.verify();

    // Check balance
    let balanced = tx.is_balanced();

    amounts_valid & tx_valid & balanced
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
    assert(tx.is_balanced());

    // Check total amounts (for testing purposes)
    let total_input = tx.total_input_amount();
    assert(total_input == 5000);
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
    assert(!tx.is_balanced());
}

#[test]
fn test_bulletproof_efficiency() {
    let amount = 12345u64;
    let blinding = 98765;
    let bits = 16;

    // Generate bulletproof
    let bulletproof = BulletproofRangeProof::generate(amount, blinding, bits);
    assert(bulletproof.verify());

    // Compare with traditional range proof size
    let traditional_size = bits; // Simplified estimate
    let bulletproof_size = bulletproof.proof_size();

    // Bulletproof should be smaller
    assert(bulletproof_size < traditional_size);

    let efficiency = bulletproof.efficiency_gain_over_traditional(traditional_size);
    assert(efficiency > 1);
}

#[test]
fn test_optimized_transaction() {
    let input_amounts = [2000u64, 3000u64];
    let output_amounts = [2500u64, 2000u64];
    let fee = 500u64;

    let input_blindings = [111, 222];
    let output_blindings = [333, 444];
    let fee_blinding = 555;

    let optimized_tx = OptimizedPrivateTransaction::new(
        input_amounts,
        output_amounts,
        fee,
        input_blindings,
        output_blindings,
        fee_blinding
    );

    assert(optimized_tx.verify());

    // Should be more efficient than traditional transaction
    let efficiency = optimized_tx.size_efficiency();
    assert(efficiency > 1);
}

#[test]
fn test_transaction_batch() {
    // Create multiple transactions
    let tx1 = PrivateTransaction::new(
        [1000u64, 2000u64],
        [1500u64, 1400u64],
        100,
        [111, 222],
        [333, 444],
        555
    );

    let tx2 = PrivateTransaction::new(
        [3000u64],
        [2800u64],
        200,
        [666],
        [777],
        888
    );

    let transactions = [tx1, tx2];
    let batch = TransactionBatch::new(transactions);

    assert(batch.verify_batch());

    // Batch should be more efficient
    let efficiency = batch.batch_efficiency();
    assert(efficiency > 1);
}

#[test]
fn test_aggregate_range_proof() {
    // Create individual range proofs
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
    assert(efficiency > 1);
}

#[test]
fn test_transaction_validation() {
    // Valid transaction
    let valid_inputs = [1000u64, 2000u64];
    let valid_outputs = [2500u64];
    let valid_fee = 500u64;

    assert(validate_transaction_amounts(valid_inputs, valid_outputs, valid_fee));

    // Invalid transaction (unbalanced)
    let invalid_outputs = [2000u64]; // Missing 500
    assert(!validate_transaction_amounts(valid_inputs, invalid_outputs, valid_fee));

    // Invalid transaction (excessive amount)
    let excessive_inputs = [MAX_AMOUNT + 1, 1000u64];
    assert(!validate_transaction_amounts(excessive_inputs, valid_outputs, valid_fee));
}

#[test]
fn test_fee_calculation() {
    // Test fee calculation based on size
    let small_tx_size = 1000u32;
    let large_tx_size = 5000u32;

    let small_fee = calculate_recommended_fee(small_tx_size);
    let large_fee = calculate_recommended_fee(large_tx_size);

    // Larger transactions should have higher fees
    assert(large_fee > small_fee);

    // Test size estimation
    let estimated_traditional = estimate_transaction_size(2, 2, 0);
    let estimated_bulletproof = estimate_transaction_size(2, 2, 1);

    // Bulletproof should be smaller
    assert(estimated_bulletproof < estimated_traditional);
}

#[test]
fn test_zero_value_transaction() {
    // Transaction with zero amounts should work
    let input_amounts = [1000u64];
    let output_amounts = [0u64, 900u64];
    let fee = 100u64;

    let tx = PrivateTransaction::new(
        input_amounts,
        output_amounts,
        fee,
        [111],
        [222, 333],
        444
    );

    assert(tx.verify());
    assert(tx.is_balanced());
}

#[test]
fn test_large_transaction() {
    // Test transaction with many inputs/outputs
    let input_amounts = [1000u64, 2000u64, 3000u64, 4000u64];
    let output_amounts = [2500u64, 7000u64];
    let fee = 500u64;

    let input_blindings = [111, 222, 333, 444];
    let output_blindings = [555, 666];
    let fee_blinding = 777;

    let tx = PrivateTransaction::new(
        input_amounts,
        output_amounts,
        fee,
        input_blindings,
        output_blindings,
        fee_blinding
    );

    assert(tx.verify());

    // Transaction size should scale with number of inputs/outputs
    let size = tx.transaction_size();
    assert(size > 0);
}
```
