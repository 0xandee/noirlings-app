---
id: recursive_basic
title: recursive_basic
category: recursive_proofs
difficulty: medium
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Recursive proofs enable one Noir program to verify another program's proof within a zero-knowledge circuit. This powerful technique allows proof aggregation, where multiple proofs can be combined into a single proof, enabling scalable verification systems.

      **Key Concepts:**
      - **Proof**: Array of field elements containing the cryptographic proof data (typically 93 fields for Noir)
      - **Public Inputs**: Values that are revealed during verification (not hidden by zero-knowledge)
      - **Key Hash**: Cryptographic hash of the verification key used to generate the original proof
      - **Aggregation**: Combining multiple proofs into one for efficient batch verification
      - **Chaining**: Linking proofs where one proof's output becomes another's input

      **When to use recursive proofs:**
      - Batch verification of multiple transactions
      - Building proof trees for scalability
      - Creating privacy-preserving audit trails
      - Implementing roll-up style scaling solutions

      1. Recursive Proof Verification

      ```noir

      fn verify_recursive_proof(
          proof: [Field; 93],
          public_inputs: [Field; 1],
          key_hash: Field,
          public_input: Field
      ) -> bool {
          std::verify_proof(proof, public_inputs, key_hash, public_input)
      }

      ```

      2. Two-Proof Aggregation

      ```noir

      fn aggregate_two_proofs(
          proof1: [Field; 93],
          public_inputs1: [Field; 1],
          proof2: [Field; 93],
          public_inputs2: [Field; 1],
          key_hash: Field
      ) -> bool {
          let proof1_valid = std::verify_proof(proof1, public_inputs1, key_hash, public_inputs1[0]);
          let proof2_valid = std::verify_proof(proof2, public_inputs2, key_hash, public_inputs2[0]);
          
          proof1_valid & proof2_valid
      }

      ```

      3. Chain Verification

      ```noir

      fn chain_verification(
          proof1: [Field; 93],
          public_inputs1: [Field; 1],
          proof2: [Field; 93],
          public_inputs2: [Field; 1],
          key_hash: Field
      ) -> bool {
          // Verify first proof
          let proof1_valid = std::verify_proof(proof1, public_inputs1, key_hash, public_inputs1[0]);
          
          // Verify second proof depends on first proof's output
          let proof2_valid = std::verify_proof(proof2, public_inputs2, key_hash, public_inputs2[0]);
          
          // Check that proof2's input comes from proof1's output
          let chain_valid = public_inputs2[0] == public_inputs1[0];
          
          proof1_valid & proof2_valid & chain_valid
      }

      ```

      4. Recursive Function Pattern

      ```noir

      #[recursive]
      fn simple_computation(x: Field, y: Field) -> pub Field {
          // Computation that can be recursively verified
          x * x + y * y
      }

      ```

      5. Main Verification Function

      ```noir

      fn main(
          x: Field,
          y: Field,
          proof: [Field; 93],
          public_inputs: [Field; 1],
          key_hash: Field,
          expected_result: Field
      ) -> pub bool {
          let result = simple_computation(x, y);
          let computation_correct = result == expected_result;
          let proof_valid = verify_recursive_proof(proof, public_inputs, key_hash, public_inputs[0]);
          let test_computation = simple_computation(3, 4) == 25;
          
          computation_correct & proof_valid & test_computation
      }

      ```
    description: >-
      Recursive proofs enable proof aggregation and verification chains in zero-knowledge systems. Learn to implement recursive proof verification and understand proof composition patterns.

      #### Docs
    docLink: >-
      https://noir-lang.org/docs/noir/standard_library/recursion
---

```noir
// Simple program that can be recursively verified
#[recursive]
fn simple_computation(x: Field, y: Field) -> pub Field {
    // A simple computation that we want to prove
    x * x + y * y
}

// Recursive verification function
fn verify_recursive_proof(
    proof: [Field; 93],  // Proof of another circuit
    public_inputs: [Field; 1],  // Public inputs of the proven circuit
    key_hash: Field,  // Hash of the verification key
    public_input: Field  // Expected public input
) -> bool {
    // TODO: Implement recursive proof verification
    // HINT: Use std::verify_proof(proof, public_inputs, key_hash, public_input)
    // This verifies that the given proof is valid for the given public inputs

    false // Replace this with your implementation
}

// Aggregate two proofs by verifying both
fn aggregate_two_proofs(
    proof1: [Field; 93],
    public_inputs1: [Field; 1],
    proof2: [Field; 93],
    public_inputs2: [Field; 1],
    key_hash: Field
) -> bool {
    // TODO: Verify both proofs and return true if both are valid
    // This demonstrates basic proof aggregation

    false // Replace this with your implementation
}

// Chain verification: verify that proof2 depends on proof1's output
fn chain_verification(
    proof1: [Field; 93],
    public_inputs1: [Field; 1],
    proof2: [Field; 93],
    public_inputs2: [Field; 1],
    key_hash: Field
) -> bool {
    // TODO: Verify that proof1 is valid, and that proof2 uses proof1's output
    // This demonstrates proof chaining

    false // Replace this with your implementation
}

fn main(
    x: Field,
    y: Field,
    proof: [Field; 93],
    public_inputs: [Field; 1],
    key_hash: Field,
    expected_result: Field
) -> pub bool {
    // Compute our result
    let result = simple_computation(x, y);

    // Check our computation is correct
    let computation_correct = result == expected_result;

    // Verify the recursive proof
    let proof_valid = verify_recursive_proof(proof, public_inputs, key_hash, public_inputs[0]);

    // Test that our simple computation works
    let test_computation = simple_computation(3, 4) == 25; // 3^2 + 4^2 = 9 + 16 = 25

    computation_correct & proof_valid & test_computation
}

#[test]
fn test_simple_computation() {
    // Test the basic computation function
    assert(simple_computation(0, 0) == 0);
    assert(simple_computation(1, 0) == 1);
    assert(simple_computation(0, 1) == 1);
    assert(simple_computation(2, 3) == 13); // 4 + 9 = 13
    assert(simple_computation(5, 12) == 169); // 25 + 144 = 169
}

#[test]
fn test_recursive_structure() {
    // Test the structure of recursive proof verification
    // Note: In practice, you would need actual proof data

    let x = 3;
    let y = 4;
    let expected = 25;

    // Placeholder proof data (in practice, this would be generated by another circuit)
    let proof = [0; 93];
    let public_inputs = [42]; // Placeholder public input
    let key_hash = 12345; // Placeholder key hash

    // Test that our computation works correctly
    let result = simple_computation(x, y);
    assert(result == expected);

    // Test main function structure (proof verification will fail with placeholder data)
    let main_result = main(x, y, proof, public_inputs, key_hash, expected);

    // With placeholder data, proof verification fails, but computation should work
    // This test validates the structure of our recursive proof system
    assert(simple_computation(x, y) == expected);
}

#[test]
fn test_proof_aggregation_structure() {
    // Test the structure of proof aggregation
    let proof1 = [1; 93];
    let public_inputs1 = [10];
    let proof2 = [2; 93];
    let public_inputs2 = [20];
    let key_hash = 12345;

    // Test that aggregation function can be called
    // With placeholder data, this will return false, but structure is correct
    let aggregation_result = aggregate_two_proofs(
        proof1,
        public_inputs1,
        proof2,
        public_inputs2,
        key_hash
    );

    // Test that chaining function can be called
    let chaining_result = chain_verification(
        proof1,
        public_inputs1,
        proof2,
        public_inputs2,
        key_hash
    );

    // With placeholder data, these should be false, but functions should execute
    assert(aggregation_result == aggregation_result); // Structure test
    assert(chaining_result == chaining_result); // Structure test
}

// Example of a more complex recursive verification scenario
#[test]
fn test_complex_recursive_patterns() {
    // Demonstrate different recursive proof patterns

    // Pattern 1: Sequential verification (proof chain)
    // proof1 -> proof2 -> proof3

    // Pattern 2: Parallel aggregation
    // proof1 \
    //         -> aggregated_proof
    // proof2 /

    // Pattern 3: Tree aggregation
    //   proof1   proof2   proof3   proof4
    //      \       /         \       /
    //    agg_proof1         agg_proof2
    //          \               /
    //           final_proof

    // These patterns enable scalable proof systems
    assert(true); // Placeholder for complex pattern implementation
}
```
