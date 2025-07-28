---
id: range_proofs_unified
title: range_proofs_unified
category: privacy
difficulty: hard
tags: []
mode: test
prerequisites: ["amount_commitments"]
version: 1.0.0
locales:
  en:
    hint: >-
      Range proofs use binary decomposition and commitment schemes to prove values lie within bounds without revealing them. Build from basic bit constraints to advanced applications like zero-knowledge balance verification.

      1. Basic Amount Commitment (Foundation Level)
      ```noir
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
      ```

      2. Binary Decomposition (Basic Level)
      ```noir
      fn decompose_to_bits(value: u64, num_bits: u32) -> [u8; 32] {
          let mut bits = [0; 32];
          for i in 0..num_bits {
              bits[i] = ((value >> i) & 1) as u8;
          }
          bits
      }
      
      fn bits_to_value(bits: [u8; 32]) -> u64 {
          let mut value = 0;
          let mut power = 1;
          for i in 0..32 {
              value += (bits[i] as u64) * power;
              power *= 2;
          }
          value
      }
      
      fn verify_bit_constraint(bit: u8) -> bool {
          // Bit must be 0 or 1: bit * (bit - 1) = 0
          let bit_field = bit as Field;
          bit_field * (bit_field - 1) == 0
      }
      ```

      3. Range Proof Generation (Intermediate Level)
      ```noir
      impl RangeProof {
          fn generate(amount: u64, blinding: Field, range_min: u64, range_max: u64) -> Self {
              // Decompose (amount - range_min) to ensure non-negativity
              let shifted_amount = amount - range_min;
              let bits = decompose_to_bits(shifted_amount, 32);
              
              // Create bit commitments for zero-knowledge
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
          
          fn verify(self) -> bool {
              // 1. Verify each bit is 0 or 1
              for i in 0..32 {
                  if !verify_bit_constraint(self.proof_bits[i]) {
                      return false;
                  }
              }
              
              // 2. Verify bits reconstruct to valid range
              let reconstructed = bits_to_value(self.proof_bits);
              let amount = reconstructed + self.range_min;
              
              // 3. Check upper bound
              amount <= self.range_max
          }
      }
      ```

      4. Advanced Applications (Expert Level)
      ```noir
      // Zero-knowledge balance verification for private transactions
      fn prove_balance(
          input_commitment: AmountCommitment,
          output_commitment: AmountCommitment,
          fee: u64
      ) -> bool {
          let fee_commitment = AmountCommitment::new(fee, 0);
          let total_output = output_commitment.add(fee_commitment);
          input_commitment.commitment == total_output.commitment
      }
      
      // Batch verification for efficiency
      fn batch_verify_range_proofs<let N: u32>(proofs: [RangeProof; N]) -> [bool; N] {
          let mut results = [false; N];
          for i in 0..N {
              results[i] = proofs[i].verify();
          }
          results
      }
      
      // Privacy-preserving auction bidding
      fn verify_bid_constraints(
          bid_commitment: AmountCommitment,
          min_bid: u64,
          max_bid: u64,
          deposit_proof: RangeProof
      ) -> bool {
          // Verify bid is within auction bounds and bidder has sufficient deposit
          let bid_range_valid = (bid_commitment.amount >= min_bid) & (bid_commitment.amount <= max_bid);
          let deposit_valid = deposit_proof.verify();
          let sufficient_deposit = deposit_proof.range_max >= bid_commitment.amount;
          
          bid_range_valid & deposit_valid & sufficient_deposit
      }
      ```
    description: >-
      Master zero-knowledge range proofs by building a complete system from basic binary decomposition to advanced privacy applications. Learn to prove values lie within bounds without revealing them, enabling private transactions, auctions, and more.

      In this exercise, you will:
      1. Implement amount commitments with homomorphic properties
      2. Master binary decomposition and bit constraint verification
      3. Generate and verify zero-knowledge range proofs
      4. Build advanced applications like balance verification and private auctions
      5. Optimize with batch verification for scalability

      #### Learning Progression
      - **Foundation**: Commitment schemes and basic cryptographic primitives
      - **Basic**: Binary decomposition and bit constraint verification
      - **Intermediate**: Complete range proof generation and verification
      - **Advanced**: Real-world applications with complex constraint systems

      #### Docs
    docLink: "https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives"
---

```noir
use std::hash::pedersen_hash;

// Core data structures
struct AmountCommitment {
    amount: u64,
    blinding: Field,
    commitment: Field,
}

struct RangeProof {
    commitment: Field,
    proof_bits: [u8; 32],
    bit_commitments: [Field; 32],
    range_min: u64,
    range_max: u64,
}

struct BidProof {
    bid_commitment: AmountCommitment,
    range_proof: RangeProof,
    deposit_proof: RangeProof,
    validity_proof: Field,
}

// TODO: Part 1 - Implement basic amount commitments (Foundation Level)
impl AmountCommitment {
    fn new(amount: u64, blinding: Field) -> Self {
        // Create Pedersen commitment to amount with blinding factor
        // Hint: Hash amount and blinding together
        AmountCommitment {
            amount,
            blinding,
            commitment: 0
        }
    }
    
    fn verify(self) -> bool {
        // Verify commitment matches computed hash
        // Hint: Recompute hash and compare with stored commitment
        false
    }
    
    fn add(self, other: AmountCommitment) -> AmountCommitment {
        // Homomorphic addition of commitments
        // Hint: Add amounts, blindings, and commitments separately
        AmountCommitment {
            amount: 0,
            blinding: 0,
            commitment: 0
        }
    }
}

// TODO: Part 2 - Implement binary decomposition utilities (Basic Level)
fn decompose_to_bits(value: u64, num_bits: u32) -> [u8; 32] {
    // Decompose value into binary representation
    // Hint: Use bit shifting and masking (value >> i) & 1
    let mut bits = [0; 32];
    // TODO: Fill bits array with binary decomposition
    bits
}

fn bits_to_value(bits: [u8; 32]) -> u64 {
    // Reconstruct value from binary representation
    // Hint: Sum bits[i] * 2^i for each bit position
    let mut value = 0;
    // TODO: Reconstruct value from bits
    value
}

fn verify_bit_constraint(bit: u8) -> bool {
    // Verify bit is 0 or 1 using constraint: bit * (bit - 1) = 0
    // Hint: Convert to Field and check multiplication constraint
    false
}

fn random_blinding() -> Field {
    // Generate random blinding factor (simplified for exercise)
    // In practice, use secure randomness
    12345
}

// TODO: Part 3 - Implement range proof system (Intermediate Level)
impl RangeProof {
    fn generate(amount: u64, blinding: Field, range_min: u64, range_max: u64) -> Self {
        // Generate range proof for amount in [range_min, range_max]
        // Hint: Decompose (amount - range_min) to ensure non-negativity
        
        // Step 1: Shift amount to ensure non-negativity
        let shifted_amount = amount - range_min;
        
        // Step 2: Decompose to bits
        let bits = decompose_to_bits(shifted_amount, 32);
        
        // Step 3: Create bit commitments
        let mut bit_commitments = [0; 32];
        for i in 0..32 {
            // TODO: Create commitment for each bit
            bit_commitments[i] = 0;
        }
        
        RangeProof {
            commitment: pedersen_hash([amount as Field, blinding]),
            proof_bits: bits,
            bit_commitments,
            range_min,
            range_max
        }
    }
    
    fn verify(self) -> bool {
        // Verify range proof validity
        // Hint: Check bit constraints, reconstruction, and bounds
        
        // Step 1: Verify each bit is 0 or 1
        for i in 0..32 {
            if !verify_bit_constraint(self.proof_bits[i]) {
                return false;
            }
        }
        
        // Step 2: Verify reconstruction
        let reconstructed = bits_to_value(self.proof_bits);
        let amount = reconstructed + self.range_min;
        
        // Step 3: Check bounds
        // TODO: Verify amount is within [range_min, range_max]
        false
    }
}

// TODO: Part 4 - Implement advanced applications (Expert Level)
fn prove_balance(
    input_commitment: AmountCommitment,
    output_commitment: AmountCommitment,
    fee: u64
) -> bool {
    // Prove input = output + fee without revealing amounts
    // Hint: Use homomorphic addition to verify balance equation
    
    // Create fee commitment (no blinding for transparency)
    let fee_commitment = AmountCommitment::new(fee, 0);
    
    // TODO: Verify input_commitment = output_commitment + fee_commitment
    false
}

fn batch_verify_range_proofs<let N: u32>(proofs: [RangeProof; N]) -> [bool; N] {
    // Efficiently verify multiple range proofs
    // Hint: Apply verify() to each proof in the array
    let mut results = [false; N];
    // TODO: Verify each proof and store results
    results
}

fn verify_bid_constraints(
    bid_commitment: AmountCommitment,
    min_bid: u64,
    max_bid: u64,
    deposit_proof: RangeProof
) -> bool {
    // Verify bidding constraints for privacy-preserving auctions
    // Hint: Check bid range, deposit validity, and sufficiency
    
    // Check bid is within auction bounds
    let bid_range_valid = (bid_commitment.amount >= min_bid) & (bid_commitment.amount <= max_bid);
    
    // Verify deposit proof
    let deposit_valid = deposit_proof.verify();
    
    // Check deposit covers bid amount
    // TODO: Verify deposit_proof.range_max >= bid_commitment.amount
    let sufficient_deposit = false;
    
    bid_range_valid & deposit_valid & sufficient_deposit
}

// TODO: Part 5 - Implement privacy-preserving applications
fn create_private_transfer_proof(
    sender_balance: u64,
    transfer_amount: u64,
    receiver_commitment: AmountCommitment
) -> (AmountCommitment, RangeProof) {
    // Create proof for private transfer without revealing amounts
    // Hint: Create commitment and range proof for transfer amount
    
    let blinding = random_blinding();
    let transfer_commitment = AmountCommitment::new(transfer_amount, blinding);
    
    // Prove transfer amount is valid (positive and <= sender balance)
    let range_proof = RangeProof::generate(transfer_amount, blinding, 1, sender_balance);
    
    (transfer_commitment, range_proof)
}

fn verify_auction_bid(
    bid_proof: BidProof,
    auction_min: u64,
    auction_max: u64
) -> bool {
    // Comprehensive auction bid verification
    // Hint: Verify all components of the bid proof
    
    let bid_valid = bid_proof.bid_commitment.verify();
    let range_valid = bid_proof.range_proof.verify();
    let deposit_valid = bid_proof.deposit_proof.verify();
    
    // TODO: Add additional auction-specific constraints
    bid_valid & range_valid & deposit_valid
}

#[test]
fn test_basic_amount_commitments() {
    let amount = 1000;
    let blinding = 12345;
    
    let commitment = AmountCommitment::new(amount, blinding);
    assert(commitment.verify());
    
    // Test homomorphic addition
    let commitment2 = AmountCommitment::new(500, 54321);
    let sum = commitment.add(commitment2);
    
    assert(sum.amount == 1500);
    assert(sum.verify());
}

#[test]
fn test_binary_decomposition() {
    let value = 42; // Binary: 101010
    let bits = decompose_to_bits(value, 8);
    
    // Verify specific bit pattern for 42
    assert(bits[1] == 1); // 2^1 bit
    assert(bits[3] == 1); // 2^3 bit  
    assert(bits[5] == 1); // 2^5 bit
    assert(bits[0] == 0); // 2^0 bit
    
    // Test reconstruction
    let reconstructed = bits_to_value(bits);
    assert(reconstructed == value);
    
    // Test bit constraints
    for i in 0..8 {
        assert(verify_bit_constraint(bits[i]));
    }
}

#[test]
fn test_range_proof_generation_and_verification() {
    let amount = 750;
    let blinding = 98765;
    let range_min = 100;
    let range_max = 1000;
    
    // Generate range proof
    let proof = RangeProof::generate(amount, blinding, range_min, range_max);
    
    // Verify proof
    assert(proof.verify());
    
    // Test edge cases
    let min_proof = RangeProof::generate(range_min, blinding, range_min, range_max);
    assert(min_proof.verify());
    
    let max_proof = RangeProof::generate(range_max, blinding, range_min, range_max);
    assert(max_proof.verify());
}

#[test]
fn test_balance_verification() {
    let input_amount = 1000;
    let output_amount = 800;
    let fee = 200;
    
    let input_commitment = AmountCommitment::new(input_amount, 111);
    let output_commitment = AmountCommitment::new(output_amount, 222);
    
    // Should verify: 1000 = 800 + 200
    let balance_valid = prove_balance(input_commitment, output_commitment, fee);
    assert(balance_valid);
    
    // Should fail with incorrect fee
    let invalid_balance = prove_balance(input_commitment, output_commitment, 100);
    assert(!invalid_balance);
}

#[test]
fn test_batch_verification() {
    let proofs = [
        RangeProof::generate(100, 111, 0, 200),
        RangeProof::generate(150, 222, 100, 200),
        RangeProof::generate(250, 333, 0, 200) // Should fail: 250 > 200
    ];
    
    let results = batch_verify_range_proofs(proofs);
    assert(results[0]); // Valid
    assert(results[1]); // Valid  
    assert(!results[2]); // Invalid - exceeds range
}

#[test]
fn test_auction_bidding() {
    let bid_amount = 500;
    let deposit_amount = 1000;
    let auction_min = 100;
    let auction_max = 800;
    
    let bid_commitment = AmountCommitment::new(bid_amount, 123);
    let deposit_proof = RangeProof::generate(deposit_amount, 456, 0, 2000);
    
    let bid_valid = verify_bid_constraints(bid_commitment, auction_min, auction_max, deposit_proof);
    assert(bid_valid);
    
    // Test insufficient deposit
    let small_deposit = RangeProof::generate(300, 789, 0, 400);
    let insufficient_bid = verify_bid_constraints(bid_commitment, auction_min, auction_max, small_deposit);
    assert(!insufficient_bid);
}

#[test]
fn test_private_transfers() {
    let sender_balance = 2000;
    let transfer_amount = 500;
    let receiver_commitment = AmountCommitment::new(1000, 999);
    
    let (transfer_commitment, range_proof) = create_private_transfer_proof(
        sender_balance,
        transfer_amount,
        receiver_commitment
    );
    
    // Verify transfer commitment
    assert(transfer_commitment.verify());
    
    // Verify transfer amount is within valid range
    assert(range_proof.verify());
    
    // Verify transfer amount consistency
    assert(transfer_commitment.amount == transfer_amount);
}
```

## Verification

Run `nargo test` to verify your implementation. The tests progress through:

1. **Foundation Tests**: Basic commitment schemes and homomorphic operations
2. **Basic Tests**: Binary decomposition and bit constraint verification  
3. **Intermediate Tests**: Complete range proof generation and verification
4. **Advanced Tests**: Real-world applications like auctions and private transfers

## Learning Progression

- **Part 1**: Master commitment schemes with homomorphic properties
- **Part 2**: Understand binary decomposition and cryptographic constraints
- **Part 3**: Build complete zero-knowledge range proof systems
- **Part 4**: Apply to advanced scenarios like balance verification
- **Part 5**: Create privacy-preserving applications

## Real-World Applications

1. **Private Transactions**: Prove sufficient balance without revealing amounts
2. **Privacy-Preserving Auctions**: Verify bid constraints without disclosure
3. **Confidential Assets**: Enable private token transfers with public verification
4. **Anonymous Voting**: Prove vote weight within bounds without identity linkage

## Extensions

1. Implement Bulletproofs for logarithmic proof sizes
2. Add support for multiple range constraints simultaneously  
3. Create aggregated proofs for improved efficiency
4. Build complete privacy-preserving payment systems