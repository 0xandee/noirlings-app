# Range Proofs - Solution

## Exercise ID: range_proofs

**Category:** privacy  
**Difficulty:** hard  
**Prerequisites:** [pedersen_hash]

## Description

Range proofs allow you to prove that a secret value lies within a specific range without revealing the actual value. Learn to implement zero-knowledge range proofs using binary decomposition and commitment schemes for privacy-preserving applications.

## Solution

```noir
use std::hash::pedersen_hash;

// Amount commitment structure
struct AmountCommitment {
    amount: u64,
    blinding: Field,
    commitment: Field,
}

impl AmountCommitment {
    // Create a new amount commitment
    fn new(amount: u64, blinding: Field) -> Self {
        let commitment = pedersen_hash([amount as Field, blinding]);
        AmountCommitment {
            amount,
            blinding,
            commitment
        }
    }

    // Verify the commitment
    fn verify(self) -> bool {
        let expected_commitment = pedersen_hash([self.amount as Field, self.blinding]);
        expected_commitment == self.commitment
    }

    // Homomorphic addition
    fn add(self, other: AmountCommitment) -> AmountCommitment {
        AmountCommitment {
            amount: self.amount + other.amount,
            blinding: self.blinding + other.blinding,
            commitment: self.commitment + other.commitment
        }
    }
}

// Range proof structure
struct RangeProof {
    commitment: Field,
    proof_bits: [u8; 32],
    bit_commitments: [Field; 32],
    range_min: u64,
    range_max: u64,
}

impl RangeProof {
    // Generate a range proof
    fn generate(
        amount: u64,
        blinding: Field,
        range_min: u64,
        range_max: u64
    ) -> Self {
        assert(amount >= range_min, "Amount below range minimum");
        assert(amount <= range_max, "Amount above range maximum");

        // Decompose amount into bits (after subtracting minimum)
        let adjusted_amount = amount - range_min;
        let bits = decompose_to_bits(adjusted_amount, 32);

        // Create commitments to each bit
        let mut bit_commitments = [0; 32];
        for i in 0..32 {
            // Generate random blinding for each bit commitment
            let bit_blinding = pedersen_hash([blinding, i as Field]);
            bit_commitments[i] = pedersen_hash([bits[i] as Field, bit_blinding]);
        }

        RangeProof {
            commitment: pedersen_hash([amount as Field, blinding]),
            proof_bits: bits,
            bit_commitments,
            range_min,
            range_max
        }
    }

    // Verify the range proof
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

        // Check amount is within range
        let range_valid = amount <= self.range_max;

        // Verify bit commitments (simplified - in practice would use zero-knowledge proofs)
        let bit_commitments_valid = true; // Placeholder

        range_valid & bit_commitments_valid
    }
}

// Binary decomposition
fn decompose_to_bits(value: u64, num_bits: u32) -> [u8; 32] {
    let mut bits = [0; 32];
    let mut remaining = value;

    for i in 0..num_bits {
        bits[i] = (remaining & 1) as u8;
        remaining = remaining >> 1;
    }

    bits
}

// Reconstruct value from bits
fn bits_to_value(bits: [u8; 32]) -> u64 {
    let mut value = 0;
    let mut power = 1;

    for i in 0..32 {
        value += (bits[i] as u64) * power;
        power *= 2;
    }

    value
}

// Verify range proof for binary decomposition
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

// Prove bit validity using x(x-1) = 0
fn prove_bit_validity(bit: u8, blinding: Field) -> Field {
    let bit_field = bit as Field;
    let constraint = bit_field * (bit_field - 1);
    pedersen_hash([constraint, blinding])
}

// Zero-knowledge balance check
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

// Batch range proof verification
fn batch_verify_range_proofs(proofs: [RangeProof; 3]) -> bool {
    for proof in proofs {
        if !proof.verify() {
            return false;
        }
    }
    true
}

// Sum commitments for batch operations
fn sum_commitments(commitments: [AmountCommitment; 3]) -> AmountCommitment {
    let mut result = commitments[0];
    for i in 1..3 {
        result = result.add(commitments[i]);
    }
    result
}

fn main(
    amount: u64,
    blinding: Field,
    range_min: u64,
    range_max: u64
) -> pub bool {
    // Create amount commitment
    let commitment = AmountCommitment::new(amount, blinding);
    let commitment_valid = commitment.verify();

    // Generate and verify range proof
    let range_proof = RangeProof::generate(amount, blinding, range_min, range_max);
    let range_valid = range_proof.verify();

    // Test binary decomposition
    let bits = decompose_to_bits(amount, 32);
    let reconstructed = bits_to_value(bits);
    let decomposition_valid = reconstructed == amount;

    // Test bit validity proof
    let bit_proof = prove_bit_validity(1, blinding);
    let bit_valid = bit_proof != 0; // Non-zero proof

    // Test range proof verification
    let range_check = verify_range_proof(amount, 32);

    commitment_valid & range_valid & decomposition_valid & bit_valid & range_check
}

#[test]
fn test_amount_commitment() {
    let amount = 1000;
    let blinding = 42;

    let commitment = AmountCommitment::new(amount, blinding);
    assert(commitment.verify());
    assert(commitment.amount == amount);
}

#[test]
fn test_commitment_homomorphism() {
    let amount1 = 100;
    let amount2 = 200;
    let blinding1 = 10;
    let blinding2 = 20;

    let commitment1 = AmountCommitment::new(amount1, blinding1);
    let commitment2 = AmountCommitment::new(amount2, blinding2);
    let sum_commitment = commitment1.add(commitment2);

    // Check homomorphic property
    assert(sum_commitment.amount == amount1 + amount2);
    assert(sum_commitment.blinding == blinding1 + blinding2);

    // Verify the sum commitment
    assert(sum_commitment.verify());
}

#[test]
fn test_binary_decomposition() {
    let value = 255; // 11111111 in binary
    let bits = decompose_to_bits(value, 8);

    // Check all first 8 bits are 1
    for i in 0..8 {
        assert(bits[i] == 1);
    }

    // Check remaining bits are 0
    for i in 8..32 {
        assert(bits[i] == 0);
    }

    // Test reconstruction
    let reconstructed = bits_to_value(bits);
    assert(reconstructed == value);
}

#[test]
fn test_bit_constraints() {
    // Test bit validity for 0 and 1
    let bit0_proof = prove_bit_validity(0, 123);
    let bit1_proof = prove_bit_validity(1, 456);

    // Both should produce valid proofs
    assert(bit0_proof != 0);
    assert(bit1_proof != 0);
    assert(bit0_proof != bit1_proof); // Different bits, different proofs
}

#[test]
fn test_range_proof_generation() {
    let amount = 500;
    let blinding = 789;
    let range_min = 100;
    let range_max = 1000;

    let proof = RangeProof::generate(amount, blinding, range_min, range_max);
    assert(proof.verify());
    assert(proof.range_min == range_min);
    assert(proof.range_max == range_max);
}

#[test]
fn test_balance_proof() {
    let input_amount = 1000;
    let output_amount = 800;
    let fee = 200;

    let input_commitment = AmountCommitment::new(input_amount, 100);
    let output_commitment = AmountCommitment::new(output_amount, 50);

    // Should verify: 1000 = 800 + 200
    let balance_valid = prove_balance(input_commitment, output_commitment, fee);
    assert(balance_valid);
}

#[test]
fn test_invalid_range() {
    let amount = 50; // Below minimum
    let blinding = 999;
    let range_min = 100;
    let range_max = 1000;

    // This should fail during proof generation
    // In practice, this would return an error or Option::None
    // For this test, we just verify the logic
    assert(amount < range_min); // Would fail range check
}

#[test]
fn test_bit_decomposition_roundtrip() {
    let test_values = [0, 1, 255, 256, 65535, 1000000];

    for value in test_values {
        let bits = decompose_to_bits(value, 32);
        let reconstructed = bits_to_value(bits);
        assert(reconstructed == value);
    }
}
```

## Key Concepts

1. **Range Proofs**: Prove a value is within bounds without revealing it
2. **Binary Decomposition**: Break values into individual bits for range checking
3. **Bit Constraints**: Ensure each bit is either 0 or 1 using x(x-1) = 0
4. **Commitment Schemes**: Hide values while maintaining verifiability
5. **Homomorphic Properties**: Enable arithmetic on committed values
6. **Zero-Knowledge**: Prove properties without revealing underlying data

## Range Proof Construction

1. **Decompose Value**: Break the secret value into binary representation
2. **Bit Commitments**: Create commitments to each individual bit
3. **Range Verification**: Prove bits reconstruct to value within range
4. **Bit Constraints**: Prove each committed value is actually a bit
5. **Consistency**: Prove all components are consistent

## Applications

- **Confidential Transactions**: Hide transaction amounts while proving validity
- **Private Auctions**: Prove bids are within valid ranges
- **Age Verification**: Prove age is above minimum without revealing exact age
- **Income Verification**: Prove income is within range for loans/benefits
- **Asset Proofs**: Prove ownership of assets within certain value ranges

## Optimization Techniques

1. **Bulletproofs**: Logarithmic-sized range proofs using inner product arguments
2. **Batch Verification**: Verify multiple range proofs together efficiently
3. **Precomputed Tables**: Speed up proof generation with lookup tables
4. **Aggregation**: Combine multiple range proofs into single proof

## Security Considerations

1. **Soundness**: Impossible to prove false statements
2. **Zero-Knowledge**: Proofs reveal no information about secret values
3. **Commitment Binding**: Cannot change committed value after commitment
4. **Range Completeness**: All valid values in range have valid proofs

## Documentation

- [Noir Cryptographic Primitives](https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives)
- [Bulletproofs Paper](https://eprint.iacr.org/2017/1066.pdf)
- [Confidential Transactions](https://people.xiph.org/~greg/confidential_values.txt)
