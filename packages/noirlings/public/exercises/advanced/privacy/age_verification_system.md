---
id: age_verification_system
title: age_verification_system
category: privacy
difficulty: hard
tags: []
mode: test
prerequisites: ["age_proofs_basic"]
version: 1.0.0
locales:
  en:
    hint: >-
      Complete age verification systems manage identity registration, proof verification, and access control policies. Implement a full-featured verification system.

      1. Verification System Initialization

      ```noir
      fn new() -> Self {
          AgeVerificationSystem {
              trusted_commitments: [],
              verified_proofs: []
          }
      }
      ```

      2. Identity Registration

      ```noir
      fn register_identity(&mut self, commitment: Field) -> bool {
          // Check if commitment already exists
          for existing in self.trusted_commitments {
              if existing == commitment {
                  return false;
              }
          }
          
          // Add to trusted commitments
          self.trusted_commitments.push(commitment);
          true
      }
      ```

      3. Proof Verification

      ```noir
      fn verify_minimum_age(&self, proof: AgeProof) -> bool {
          // Check if commitment is trusted
          let mut is_trusted = false;
          for trusted in self.trusted_commitments {
              if trusted == proof.commitment {
                  is_trusted = true;
                  break;
              }
          }
          
          is_trusted & proof.is_valid
      }
      ```

      4. Access Control Policies

      ```noir
      fn check_policy(self, proof: AgeProof) -> bool {
          proof.minimum_age >= self.minimum_age && proof.is_valid
      }
      ```

      5. Batch Verification

      ```noir
      fn batch_verify_minimum_age(&self, proofs: [AgeProof]) -> [bool] {
          let mut results = [false; proofs.len()];
          for i in 0..proofs.len() {
              results[i] = self.verify_minimum_age(proofs[i]);
          }
          results
      }
      ```
    description: >-
      Complete age verification systems integrate all components for real-world deployment. Learn to implement identity management, proof verification, access control policies, and batch processing for scalable privacy-preserving age verification.

      In this exercise, you will:
      1. Build a complete age verification system with identity management
      2. Implement access control policies for different scenarios
      3. Enable batch verification for efficient processing
      4. Create real-world application interfaces

      #### Docs
    docLink: "https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives"
---

```noir
use std::hash::pedersen_hash;

global CURRENT_YEAR: u32 = 2024;
global CURRENT_MONTH: u32 = 1;
global CURRENT_DAY: u32 = 1;

// Import structures from previous exercises
struct Date {
    year: u32,
    month: u32,
    day: u32,
}

impl Date {
    fn to_field(self) -> Field {
        (self.year * 10000 + self.month * 100 + self.day) as Field
    }

    fn age_in_years(self) -> u32 {
        let mut age = CURRENT_YEAR - self.year;

        if CURRENT_MONTH < self.month {
            age -= 1;
        } else if CURRENT_MONTH == self.month && CURRENT_DAY < self.day {
            age -= 1;
        }

        age
    }
}

struct IdentityCommitment {
    birth_date: Date,
    secret: Field,
    commitment: Field,
}

impl IdentityCommitment {
    fn new(birth_date: Date, secret: Field) -> Self {
        let commitment = pedersen_hash([birth_date.to_field(), secret]);
        IdentityCommitment {
            birth_date,
            secret,
            commitment
        }
    }

    fn prove_minimum_age(self, minimum_age: u32) -> AgeProof {
        let actual_age = self.birth_date.age_in_years();
        let is_valid = actual_age >= minimum_age;
        let proof_data = pedersen_hash([self.commitment, minimum_age as Field, actual_age as Field]);

        AgeProof {
            commitment: self.commitment,
            minimum_age,
            proof_data,
            is_valid
        }
    }
}

enum AgeCategory {
    Minor,
    Adult,
    Senior,
}

struct AgeProof {
    commitment: Field,
    minimum_age: u32,
    proof_data: Field,
    is_valid: bool,
}

struct AgeRangeProof {
    commitment: Field,
    min_age: u32,
    max_age: u32,
    proof_data: Field,
    is_valid: bool,
}

struct AgeCategoryProof {
    commitment: Field,
    category: AgeCategory,
    proof_data: Field,
    is_valid: bool,
}

// Complete age verification system
struct AgeVerificationSystem {
    trusted_commitments: [Field], // List of trusted identity commitments
    verified_proofs: [Field],     // Cache of verified proofs
}

impl AgeVerificationSystem {
    // TODO: Create new verification system
    fn new() -> Self {
        // Hint: Initialize with empty arrays
        todo!()
    }

    // TODO: Register a new identity commitment (done by trusted authority)
    fn register_identity(&mut self, commitment: Field) -> bool {
        // Hint: Add to trusted_commitments if not already present
        // Return false if commitment already exists
        todo!()
    }

    // TODO: Verify minimum age proof
    fn verify_minimum_age(&self, proof: AgeProof) -> bool {
        // Hint:
        // 1. Check commitment is registered in trusted_commitments
        // 2. Verify the proof is valid
        // 3. Return combined result
        todo!()
    }

    // TODO: Verify age range proof
    fn verify_age_range(&self, proof: AgeRangeProof) -> bool {
        // Hint: Similar to verify_minimum_age but for range proofs
        todo!()
    }

    // TODO: Verify age category proof
    fn verify_age_category(&self, proof: AgeCategoryProof) -> bool {
        // Hint: Similar to verify_minimum_age but for category proofs
        todo!()
    }

    // TODO: Batch verify multiple proofs for efficiency
    fn batch_verify_minimum_age(&self, proofs: [AgeProof]) -> [bool] {
        // Hint: Create array of results and verify each proof
        todo!()
    }

    // TODO: Get count of registered identities
    fn get_registered_count(&self) -> u32 {
        // Hint: Return length of trusted_commitments array
        todo!()
    }

    // TODO: Check if a specific commitment is registered
    fn is_identity_registered(&self, commitment: Field) -> bool {
        // Hint: Search through trusted_commitments
        todo!()
    }
}

// Age-based access control policies
struct AccessControlPolicy {
    minimum_age: u32,
    maximum_age: u32,
    required_category: AgeCategory,
}

impl AccessControlPolicy {
    // TODO: Check if an age proof satisfies this policy
    fn check_policy(self, proof: AgeProof) -> bool {
        // Hint: Verify proof meets minimum age requirement and is valid
        todo!()
    }

    // TODO: Create policy for alcohol purchase (21+)
    fn alcohol_purchase() -> Self {
        // Hint: Set minimum_age to 21, maximum_age to high value, category to Adult
        todo!()
    }

    // TODO: Create policy for voting (18+)
    fn voting_eligibility() -> Self {
        // Hint: Set minimum_age to 18
        todo!()
    }

    // TODO: Create policy for senior discounts (65+)
    fn senior_discount() -> Self {
        // Hint: Set minimum_age to 65, category to Senior
        todo!()
    }

    // TODO: Create policy for minor protection (under 18)
    fn minor_protection() -> Self {
        // Hint: Set maximum_age to 17, category to Minor
        todo!()
    }
}

// Selective disclosure for age-related attributes
fn generate_selective_disclosure_proof(
    identity: IdentityCommitment,
    disclosed_attributes: [Field] // Which attributes to reveal
) -> Field {
    // TODO: Generate proof that reveals only selected attributes
    // while keeping others private
    // Hint: Hash the identity commitment with disclosed attributes
    todo!()
}

// Zero-knowledge age verification helper
fn zero_knowledge_age_check(
    birth_date: Date,
    secret: Field,
    minimum_age: u32,
    public_commitment: Field
) -> bool {
    // TODO: Verify the commitment without revealing birth date
    // Hint:
    // 1. Create identity from birth_date and secret
    // 2. Check commitment matches public value
    // 3. Generate and verify age proof
    todo!()
}

fn main(
    birth_year: u32,
    birth_month: u32,
    birth_day: u32,
    secret: Field,
    minimum_age_policy: u32
) -> pub bool {
    let birth_date = Date {
        year: birth_year,
        month: birth_month,
        day: birth_day
    };

    let identity = IdentityCommitment::new(birth_date, secret);
    let mut system = AgeVerificationSystem::new();

    // Register identity
    let registration_success = system.register_identity(identity.commitment);

    // Generate and verify age proof
    let age_proof = identity.prove_minimum_age(minimum_age_policy);
    let verification_success = system.verify_minimum_age(age_proof);

    // Test access control policy
    let policy = AccessControlPolicy::voting_eligibility();
    let voting_proof = identity.prove_minimum_age(18);
    let policy_check = policy.check_policy(voting_proof);

    registration_success & verification_success & policy_check
}

#[test]
fn test_verification_system() {
    let mut system = AgeVerificationSystem::new();

    let birth_date = Date { year: 1990, month: 1, day: 1 };
    let identity = IdentityCommitment::new(birth_date, 12345);

    // Initially not registered
    assert(!system.is_identity_registered(identity.commitment));
    assert(system.get_registered_count() == 0);

    // Register identity
    let registered = system.register_identity(identity.commitment);
    assert(registered);
    assert(system.is_identity_registered(identity.commitment));
    assert(system.get_registered_count() == 1);

    // Cannot register same identity twice
    let registered_again = system.register_identity(identity.commitment);
    assert(!registered_again);
    assert(system.get_registered_count() == 1);
}

#[test]
fn test_proof_verification() {
    let mut system = AgeVerificationSystem::new();

    let birth_date = Date { year: 1990, month: 1, day: 1 };
    let identity = IdentityCommitment::new(birth_date, 12345);

    // Register identity
    system.register_identity(identity.commitment);

    // Generate and verify valid proof
    let proof = identity.prove_minimum_age(18);
    assert(system.verify_minimum_age(proof));

    // Proof for unregistered identity should fail
    let other_identity = IdentityCommitment::new(birth_date, 67890);
    let other_proof = other_identity.prove_minimum_age(18);
    assert(!system.verify_minimum_age(other_proof));
}

#[test]
fn test_access_control_policies() {
    let birth_date = Date {
        year: 1995,
        month: 8,
        day: 30
    }; // ~29 years old

    let identity = IdentityCommitment::new(birth_date, 11111);

    // Test voting eligibility (18+)
    let voting_policy = AccessControlPolicy::voting_eligibility();
    let voting_proof = identity.prove_minimum_age(voting_policy.minimum_age);
    assert(voting_policy.check_policy(voting_proof));

    // Test alcohol purchase (21+)
    let alcohol_policy = AccessControlPolicy::alcohol_purchase();
    let alcohol_proof = identity.prove_minimum_age(alcohol_policy.minimum_age);
    assert(alcohol_policy.check_policy(alcohol_proof));

    // Test senior discount (65+) - should fail
    let senior_policy = AccessControlPolicy::senior_discount();
    let senior_proof = identity.prove_minimum_age(senior_policy.minimum_age);
    assert(!senior_policy.check_policy(senior_proof));
}

#[test]
fn test_batch_verification() {
    let mut system = AgeVerificationSystem::new();

    // Create multiple identities
    let identity1 = IdentityCommitment::new(
        Date { year: 1990, month: 1, day: 1 },
        11111
    );
    let identity2 = IdentityCommitment::new(
        Date { year: 1985, month: 6, day: 15 },
        22222
    );
    let identity3 = IdentityCommitment::new(
        Date { year: 2010, month: 12, day: 31 }, // Minor
        33333
    );

    // Register identities
    system.register_identity(identity1.commitment);
    system.register_identity(identity2.commitment);
    system.register_identity(identity3.commitment);

    // Generate proofs for 18+ verification
    let proofs = [
        identity1.prove_minimum_age(18),
        identity2.prove_minimum_age(18),
        identity3.prove_minimum_age(18)
    ];

    // Batch verify
    let results = system.batch_verify_minimum_age(proofs);

    assert(results[0]); // 1990 birth should pass
    assert(results[1]); // 1985 birth should pass
    assert(!results[2]); // 2010 birth should fail (too young)
}

#[test]
fn test_zero_knowledge_verification() {
    let birth_date = Date { year: 1988, month: 3, day: 22 };
    let secret = 54321;
    let identity = IdentityCommitment::new(birth_date, secret);

    // Test zero-knowledge age check
    let zk_check = zero_knowledge_age_check(
        birth_date,
        secret,
        21,
        identity.commitment
    );

    assert(zk_check);

    // Should fail with wrong commitment
    let wrong_commitment = pedersen_hash([123, 456]);
    let zk_check_fail = zero_knowledge_age_check(
        birth_date,
        secret,
        21,
        wrong_commitment
    );

    assert(!zk_check_fail);
}

#[test]
fn test_selective_disclosure() {
    let birth_date = Date { year: 1992, month: 7, day: 18 };
    let identity = IdentityCommitment::new(birth_date, 98765);

    // Generate selective disclosure proof
    let disclosed_attrs = [1, 2]; // Example: reveal age category and year
    let disclosure_proof = generate_selective_disclosure_proof(identity, disclosed_attrs);

    // Proof should be deterministic
    let disclosure_proof2 = generate_selective_disclosure_proof(identity, disclosed_attrs);
    assert(disclosure_proof == disclosure_proof2);

    // Different attributes should give different proofs
    let other_attrs = [3, 4];
    let other_proof = generate_selective_disclosure_proof(identity, other_attrs);
    assert(disclosure_proof != other_proof);
}
```
