---
id: age_verification
title: age_verification
category: privacy
difficulty: medium
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Privacy-preserving age verification uses zero-knowledge proofs to prove age requirements without revealing birth dates. Implement date arithmetic, commitments, and range proofs.

      1. Date Operations

      ```noir

      impl Date {
          fn to_field(self) -> Field {
              // Encode as YYYYMMDD format
              (self.year * 10000 + self.month * 100 + self.day) as Field
          }
          
          fn age_in_years(self) -> u32 {
              let mut age = CURRENT_YEAR - self.year;
              
              // Adjust for month and day precision
              if CURRENT_MONTH < self.month {
                  age -= 1;
              } else if CURRENT_MONTH == self.month && CURRENT_DAY < self.day {
                  age -= 1;
              }
              
              age
          }
          
          fn is_valid(self) -> bool {
              // Check basic date validity
              let year_valid = self.year >= 1900 && self.year <= CURRENT_YEAR;
              let month_valid = self.month >= 1 && self.month <= 12;
              let day_valid = self.day >= 1 && self.day <= 31;
              
              year_valid & month_valid & day_valid
          }
      }

      ```

      2. Identity Commitment

      ```noir

      impl IdentityCommitment {
          fn new(birth_date: Date, secret: Field) -> Self {
              let commitment = pedersen_hash([birth_date.to_field(), secret]);
              IdentityCommitment {
                  birth_date,
                  secret,
                  commitment
              }
          }
          
          fn verify_commitment(self) -> bool {
              let expected_commitment = pedersen_hash([self.birth_date.to_field(), self.secret]);
              expected_commitment == self.commitment
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

      ```

      3. Age Category System

      ```noir

      impl AgeCategory {
          fn get_range(self) -> (u32, u32) {
              match self {
                  AgeCategory::Minor => (0, 17),
                  AgeCategory::Adult => (18, 64),
                  AgeCategory::Senior => (65, 150)
              }
          }
          
          fn contains_age(self, age: u32) -> bool {
              let (min_age, max_age) = self.get_range();
              age >= min_age && age <= max_age
          }
      }

      ```

      4. Age Range Proofs

      ```noir

      fn prove_age_range(self, min_age: u32, max_age: u32) -> AgeRangeProof {
          let actual_age = self.birth_date.age_in_years();
          let is_valid = (actual_age >= min_age) & (actual_age <= max_age);
          let proof_data = pedersen_hash([
              self.commitment,
              min_age as Field,
              max_age as Field,
              actual_age as Field
          ]);
          
          AgeRangeProof {
              commitment: self.commitment,
              min_age,
              max_age,
              proof_data,
              is_valid
          }
      }

      fn prove_exact_age_category(self, age_category: AgeCategory) -> AgeCategoryProof {
          let actual_age = self.birth_date.age_in_years();
          let is_valid = age_category.contains_age(actual_age);
          let proof_data = pedersen_hash([
              self.commitment,
              age_category as Field,
              actual_age as Field
          ]);
          
          AgeCategoryProof {
              commitment: self.commitment,
              category: age_category,
              proof_data,
              is_valid
          }
      }

      ```

      5. Verification System

      ```noir

      impl AgeVerificationSystem {
          fn new() -> Self {
              AgeVerificationSystem {
                  trusted_commitments: [],
                  verified_proofs: []
              }
          }
          
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
          
          fn verify_age_proof(&self, proof: AgeProof) -> bool {
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
      }

      ```

      6. Zero-Knowledge Age Verification

      ```noir

      fn zero_knowledge_age_check(
          birth_date: Date,
          secret: Field,
          minimum_age: u32,
          public_commitment: Field
      ) -> bool {
          // Verify the commitment without revealing birth date
          let identity = IdentityCommitment::new(birth_date, secret);
          
          // Check commitment matches public value
          let commitment_valid = identity.commitment == public_commitment;
          
          // Generate and verify age proof
          let age_proof = identity.prove_minimum_age(minimum_age);
          
          commitment_valid & age_proof.is_valid
      }

      ```

    description: >-
      Privacy-preserving age verification allows proving that someone meets age requirements without revealing their actual birth date. Learn to implement zero-knowledge age verification using range proofs and secure date arithmetic for identity applications.
---

```noir
use std::hash::pedersen_hash;

global CURRENT_YEAR: u32 = 2024;
global CURRENT_MONTH: u32 = 1;
global CURRENT_DAY: u32 = 1;

// Date structure for birth dates
struct Date {
    year: u32,
    month: u32,
    day: u32,
}

impl Date {
    // TODO: Convert date to a single field element for computation
    fn to_field(self) -> Field {
        // Hint: Encode as YYYYMMDD format
        todo!()
    }

    // TODO: Calculate age in years from this birth date
    fn age_in_years(self) -> u32 {
        // Hint: Calculate difference from current date
        // Handle month/day precision for accurate age
        todo!()
    }

    // TODO: Validate that date is reasonable (not in future, not too old)
    fn is_valid(self) -> bool {
        todo!()
    }
}

// Identity commitment containing private personal information
struct IdentityCommitment {
    birth_date: Date,
    secret: Field,       // Random secret for commitment
    commitment: Field,   // Hash of birth_date and secret
}

impl IdentityCommitment {
    // TODO: Create new identity commitment
    fn new(birth_date: Date, secret: Field) -> Self {
        // Hint: Compute pedersen_hash of birth_date and secret
        todo!()
    }

    // TODO: Verify the commitment is correctly computed
    fn verify_commitment(self) -> bool {
        todo!()
    }

    // TODO: Generate proof that age is at least minimum_age
    fn prove_minimum_age(self, minimum_age: u32) -> AgeProof {
        // Hint: Create range proof showing age >= minimum_age
        todo!()
    }

    // TODO: Generate proof that age is between min_age and max_age
    fn prove_age_range(self, min_age: u32, max_age: u32) -> AgeRangeProof {
        // Hint: Prove min_age <= age <= max_age
        todo!()
    }

    // TODO: Generate proof for specific age without revealing it
    fn prove_exact_age_category(self, age_category: AgeCategory) -> AgeCategoryProof {
        // Hint: Prove membership in age category without revealing exact age
        todo!()
    }
}

// Age categories for different verification levels
enum AgeCategory {
    Minor,      // Under 18
    Adult,      // 18-64
    Senior,     // 65+
}

impl AgeCategory {
    // TODO: Get the age range for this category
    fn get_range(self) -> (u32, u32) {
        // Returns: (min_age, max_age)
        todo!()
    }

    // TODO: Check if an age belongs to this category
    fn contains_age(self, age: u32) -> bool {
        todo!()
    }
}

// Proof structures for different types of age verification
struct AgeProof {
    commitment: Field,           // Original identity commitment
    minimum_age: u32,           // Required minimum age
    proof_data: Field,          // Zero-knowledge proof data
    is_valid: bool,             // Whether proof is valid
}

struct AgeRangeProof {
    commitment: Field,          // Original identity commitment
    min_age: u32,              // Minimum age in range
    max_age: u32,              // Maximum age in range
    proof_data: Field,         // Zero-knowledge proof data
    is_valid: bool,            // Whether proof is valid
}

struct AgeCategoryProof {
    commitment: Field,          // Original identity commitment
    category: AgeCategory,      // Age category being proved
    proof_data: Field,         // Zero-knowledge proof data
    is_valid: bool,            // Whether proof is valid
}

// Age verification system
struct AgeVerificationSystem {
    trusted_commitments: [Field], // List of trusted identity commitments
    verified_proofs: [Field],     // Cache of verified proofs
}

impl AgeVerificationSystem {
    // TODO: Create new verification system
    fn new() -> Self {
        todo!()
    }

    // TODO: Register a new identity commitment (done by trusted authority)
    fn register_identity(&mut self, commitment: Field) -> bool {
        // Hint: Add to trusted_commitments if valid
        todo!()
    }

    // TODO: Verify minimum age proof
    fn verify_minimum_age(
        &self,
        proof: AgeProof
    ) -> bool {
        // Hint:
        // 1. Check commitment is registered
        // 2. Verify the range proof
        // 3. Ensure minimum age requirement is met
        todo!()
    }

    // TODO: Verify age range proof
    fn verify_age_range(
        &self,
        proof: AgeRangeProof
    ) -> bool {
        todo!()
    }

    // TODO: Verify age category proof
    fn verify_age_category(
        &self,
        proof: AgeCategoryProof
    ) -> bool {
        todo!()
    }

    // TODO: Batch verify multiple proofs for efficiency
    fn batch_verify_minimum_age(
        &self,
        proofs: [AgeProof]
    ) -> [bool] {
        todo!()
    }
}

// Range proof implementation for age verification
fn generate_range_proof(
    value: u32,           // Actual age (secret)
    min_value: u32,       // Minimum allowed age
    max_value: u32,       // Maximum allowed age
    commitment: Field,    // Commitment to the secret value
    secret: Field        // Secret used in commitment
) -> Field {
    // TODO: Generate zero-knowledge proof that min_value <= value <= max_value
    // Hint: Use bit decomposition and range checking
    todo!()
}

// Verify range proof without learning the actual value
fn verify_range_proof(
    proof: Field,
    min_value: u32,
    max_value: u32,
    commitment: Field
) -> bool {
    // TODO: Verify the range proof is valid
    todo!()
}

// Selective disclosure for age-related attributes
fn generate_selective_disclosure_proof(
    identity: IdentityCommitment,
    disclosed_attributes: [Field] // Which attributes to reveal
) -> Field {
    // TODO: Generate proof that reveals only selected attributes
    // while keeping others private
    todo!()
}

// Age-based access control
struct AccessControlPolicy {
    minimum_age: u32,
    maximum_age: u32,
    required_category: AgeCategory,
}

impl AccessControlPolicy {
    // TODO: Check if an age proof satisfies this policy
    fn check_policy(self, proof: AgeProof) -> bool {
        todo!()
    }

    // TODO: Create policy for alcohol purchase (21+)
    fn alcohol_purchase() -> Self {
        todo!()
    }

    // TODO: Create policy for voting (18+)
    fn voting_eligibility() -> Self {
        todo!()
    }

    // TODO: Create policy for senior discounts (65+)
    fn senior_discount() -> Self {
        todo!()
    }
}

#[test]
fn test_date_operations() {
    let birth_date = Date {
        year: 1990,
        month: 6,
        day: 15
    };

    // Test date validation
    assert(birth_date.is_valid());

    // Test age calculation
    let age = birth_date.age_in_years();
    assert(age >= 30); // Should be at least 30 in 2024

    // Test field conversion
    let date_field = birth_date.to_field();
    assert(date_field != 0);

    // Test invalid dates
    let future_date = Date {
        year: 2030,
        month: 1,
        day: 1
    };
    assert(!future_date.is_valid());
}

#[test]
fn test_identity_commitment() {
    let birth_date = Date {
        year: 1995,
        month: 3,
        day: 20
    };

    let secret = 12345;
    let identity = IdentityCommitment::new(birth_date, secret);

    // Commitment should be valid
    assert(identity.verify_commitment());

    // Different secrets should produce different commitments
    let identity2 = IdentityCommitment::new(birth_date, 67890);
    assert(identity.commitment != identity2.commitment);
}

#[test]
fn test_minimum_age_proof() {
    let birth_date = Date {
        year: 1990,
        month: 1,
        day: 1
    }; // 34 years old

    let identity = IdentityCommitment::new(birth_date, 12345);
    let mut system = AgeVerificationSystem::new();

    // Register identity
    system.register_identity(identity.commitment);

    // Generate proof for 18+ verification
    let proof = identity.prove_minimum_age(18);
    assert(system.verify_minimum_age(proof));

    // Generate proof for 21+ verification
    let proof21 = identity.prove_minimum_age(21);
    assert(system.verify_minimum_age(proof21));

    // Should fail for age they don't meet
    let proof50 = identity.prove_minimum_age(50);
    assert(!system.verify_minimum_age(proof50));
}

#[test]
fn test_age_range_proof() {
    let birth_date = Date {
        year: 1985,
        month: 12,
        day: 25
    }; // ~38 years old

    let identity = IdentityCommitment::new(birth_date, 54321);
    let mut system = AgeVerificationSystem::new();

    system.register_identity(identity.commitment);

    // Should pass for valid ranges
    let proof_adult = identity.prove_age_range(18, 65);
    assert(system.verify_age_range(proof_adult));

    // Should fail for invalid ranges
    let proof_teen = identity.prove_age_range(13, 17);
    assert(!system.verify_age_range(proof_teen));

    let proof_senior = identity.prove_age_range(65, 100);
    assert(!system.verify_age_range(proof_senior));
}

#[test]
fn test_age_categories() {
    // Test category ranges
    let minor_range = AgeCategory::Minor.get_range();
    assert(minor_range.0 == 0);
    assert(minor_range.1 == 17);

    let adult_range = AgeCategory::Adult.get_range();
    assert(adult_range.0 == 18);
    assert(adult_range.1 == 64);

    let senior_range = AgeCategory::Senior.get_range();
    assert(senior_range.0 == 65);

    // Test age membership
    assert(AgeCategory::Minor.contains_age(16));
    assert(!AgeCategory::Minor.contains_age(18));

    assert(AgeCategory::Adult.contains_age(25));
    assert(!AgeCategory::Adult.contains_age(17));

    assert(AgeCategory::Senior.contains_age(70));
    assert(!AgeCategory::Senior.contains_age(64));
}

#[test]
fn test_age_category_proof() {
    let birth_date = Date {
        year: 2000,
        month: 5,
        day: 10
    }; // ~24 years old (Adult)

    let identity = IdentityCommitment::new(birth_date, 98765);
    let mut system = AgeVerificationSystem::new();

    system.register_identity(identity.commitment);

    // Should prove Adult category correctly
    let adult_proof = identity.prove_exact_age_category(AgeCategory::Adult);
    assert(system.verify_age_category(adult_proof));

    // Should fail for wrong categories
    let minor_proof = identity.prove_exact_age_category(AgeCategory::Minor);
    assert(!system.verify_age_category(minor_proof));

    let senior_proof = identity.prove_exact_age_category(AgeCategory::Senior);
    assert(!system.verify_age_category(senior_proof));
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
    assert(!results[2]); // 2010 birth should fail
}

#[test]
fn test_privacy_preservation() {
    // Test that exact age cannot be determined from proofs
    let birth_date1 = Date { year: 1990, month: 1, day: 1 }; // 34
    let birth_date2 = Date { year: 1992, month: 1, day: 1 }; // 32

    let identity1 = IdentityCommitment::new(birth_date1, 12345);
    let identity2 = IdentityCommitment::new(birth_date2, 67890);

    // Both generate 21+ proofs
    let proof1 = identity1.prove_minimum_age(21);
    let proof2 = identity2.prove_minimum_age(21);

    // Proofs should be different even though both meet requirement
    assert(proof1.proof_data != proof2.proof_data);
    assert(proof1.commitment != proof2.commitment);

    // But both should verify successfully
    let mut system = AgeVerificationSystem::new();
    system.register_identity(identity1.commitment);
    system.register_identity(identity2.commitment);

    assert(system.verify_minimum_age(proof1));
    assert(system.verify_minimum_age(proof2));
}

#[test]
fn test_range_proof_boundaries() {
    let birth_date = Date {
        year: 1990,
        month: 6,
        day: 15
    }; // Exactly some age

    let identity = IdentityCommitment::new(birth_date, 99999);
    let actual_age = birth_date.age_in_years();

    // Should pass for ranges that include the actual age
    let proof_include = identity.prove_age_range(actual_age - 5, actual_age + 5);
    let mut system = AgeVerificationSystem::new();
    system.register_identity(identity.commitment);
    assert(system.verify_age_range(proof_include));

    // Should fail for ranges that exclude the actual age
    let proof_exclude = identity.prove_age_range(actual_age + 1, actual_age + 10);
    assert(!system.verify_age_range(proof_exclude));
}
```
