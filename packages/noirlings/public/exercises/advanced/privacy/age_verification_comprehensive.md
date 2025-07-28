---
id: age_verification_comprehensive
title: age_verification_comprehensive
category: privacy
difficulty: hard
tags: []
mode: test
prerequisites: ["identity_commitments"]
version: 1.0.0
locales:
  en:
    hint: >-
      Privacy-preserving age verification systems combine date arithmetic, commitments, proofs, and access control. Build a complete system from basic concepts to real-world deployment.

      1. Basic Date Operations
      ```noir
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
          
          fn is_valid(self) -> bool {
              let year_valid = self.year >= 1900 && self.year <= CURRENT_YEAR;
              let month_valid = self.month >= 1 && self.month <= 12;
              let day_valid = self.day >= 1 && self.day <= 31;
              year_valid & month_valid & day_valid
          }
      }
      ```

      2. Identity Commitment System
      ```noir
      impl IdentityCommitment {
          fn new(birth_date: Date, secret: Field) -> Self {
              let commitment = pedersen_hash([birth_date.to_field(), secret]);
              IdentityCommitment { birth_date, secret, commitment }
          }
          
          fn verify_commitment(self) -> bool {
              let expected = pedersen_hash([self.birth_date.to_field(), self.secret]);
              expected == self.commitment
          }
      }
      ```

      3. Proof Generation (Progressive Complexity)
      ```noir
      // Basic minimum age proof
      fn prove_minimum_age(self, minimum_age: u32) -> AgeProof {
          let actual_age = self.birth_date.age_in_years();
          let is_valid = actual_age >= minimum_age;
          let proof_data = pedersen_hash([self.commitment, minimum_age as Field, actual_age as Field]);
          AgeProof { commitment: self.commitment, minimum_age, proof_data, is_valid }
      }
      
      // Advanced range proof
      fn prove_age_range(self, min_age: u32, max_age: u32) -> AgeRangeProof {
          let actual_age = self.birth_date.age_in_years();
          let is_valid = (actual_age >= min_age) & (actual_age <= max_age);
          let proof_data = pedersen_hash([self.commitment, min_age as Field, max_age as Field, actual_age as Field]);
          AgeRangeProof { commitment: self.commitment, min_age, max_age, proof_data, is_valid }
      }
      ```

      4. Complete Verification System
      ```noir
      impl AgeVerificationSystem {
          fn new() -> Self {
              AgeVerificationSystem { trusted_commitments: [], verified_proofs: [] }
          }
          
          fn register_identity(&mut self, commitment: Field) -> bool {
              for existing in self.trusted_commitments {
                  if existing == commitment { return false; }
              }
              self.trusted_commitments.push(commitment);
              true
          }
          
          fn verify_minimum_age(&self, proof: AgeProof) -> bool {
              let mut is_trusted = false;
              for trusted in self.trusted_commitments {
                  if trusted == proof.commitment {
                      is_trusted = true;
                      break;
                  }
              }
              is_trusted & proof.is_valid
          }
          
          fn batch_verify_minimum_age(&self, proofs: [AgeProof]) -> [bool] {
              let mut results = [false; proofs.len()];
              for i in 0..proofs.len() {
                  results[i] = self.verify_minimum_age(proofs[i]);
              }
              results
          }
      }
      ```
    description: >-
      Master privacy-preserving age verification by building a complete system from basic date arithmetic to production-ready verification infrastructure. This comprehensive exercise combines identity commitments, zero-knowledge proofs, and access control systems.

      In this exercise, you will:
      1. Implement date operations and age calculations with privacy preservation
      2. Create identity commitment schemes for secure age binding
      3. Generate various types of age proofs (minimum, range, category)
      4. Build a complete verification system with identity management
      5. Implement batch processing and access control policies
      6. Understand real-world deployment considerations

      #### Learning Progression
      - **Basic**: Date arithmetic and simple commitments
      - **Intermediate**: Proof generation and verification
      - **Advanced**: Complete system with batch processing and policies

      #### Docs
    docLink: "https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives"
---

```noir
use std::hash::pedersen_hash;

global CURRENT_YEAR: u32 = 2024;
global CURRENT_MONTH: u32 = 1;
global CURRENT_DAY: u32 = 1;

// Core data structures
struct Date {
    year: u32,
    month: u32,
    day: u32,
}

struct IdentityCommitment {
    birth_date: Date,
    secret: Field,
    commitment: Field,
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

enum AgeCategory {
    Minor,
    Adult,
    Senior,
}

struct AgeCategoryProof {
    commitment: Field,
    category: AgeCategory,
    proof_data: Field,
    is_valid: bool,
}

struct AccessPolicy {
    minimum_age: u32,
    allowed_categories: [AgeCategory; 3],
    strict_verification: bool,
}

struct AgeVerificationSystem {
    trusted_commitments: [Field; 100],
    verified_proofs: [Field; 100],
    commitment_count: u32,
    proof_count: u32,
}

// TODO: Part 1 - Implement basic date operations
impl Date {
    fn to_field(self) -> Field {
        // Encode date as YYYYMMDD format in a single field
        // Hint: Use year * 10000 + month * 100 + day
        0
    }
    
    fn age_in_years(self) -> u32 {
        // Calculate age in years considering current date
        // Hint: Account for month/day precision when subtracting years
        0
    }
    
    fn is_valid(self) -> bool {
        // Validate date ranges: year (1900-current), month (1-12), day (1-31)
        // Hint: Check each component separately and combine with logical AND
        false
    }
}

// TODO: Part 2 - Implement identity commitment system
impl IdentityCommitment {
    fn new(birth_date: Date, secret: Field) -> Self {
        // Create commitment using Pedersen hash of birth date and secret
        // Hint: Hash both birth_date.to_field() and secret together
        IdentityCommitment {
            birth_date,
            secret,
            commitment: 0
        }
    }
    
    fn verify_commitment(self) -> bool {
        // Verify that commitment matches computed hash
        // Hint: Recompute hash and compare with stored commitment
        false
    }
    
    // TODO: Part 3 - Implement proof generation (Basic Level)
    fn prove_minimum_age(self, minimum_age: u32) -> AgeProof {
        // Generate proof that age >= minimum_age without revealing exact age
        // Hint: Include commitment, minimum_age, and actual_age in proof_data hash
        let actual_age = self.birth_date.age_in_years();
        let is_valid = actual_age >= minimum_age;
        
        AgeProof {
            commitment: self.commitment,
            minimum_age,
            proof_data: 0,
            is_valid
        }
    }
    
    // TODO: Part 4 - Advanced proof generation (Intermediate Level)
    fn prove_age_range(self, min_age: u32, max_age: u32) -> AgeRangeProof {
        // Generate proof that min_age <= age <= max_age
        // Hint: Verify both minimum and maximum bounds
        let actual_age = self.birth_date.age_in_years();
        let is_valid = (actual_age >= min_age) & (actual_age <= max_age);
        
        AgeRangeProof {
            commitment: self.commitment,
            min_age,
            max_age,
            proof_data: 0,
            is_valid
        }
    }
    
    fn prove_age_category(self, category: AgeCategory) -> AgeCategoryProof {
        // Generate proof for specific age category (Minor/Adult/Senior)
        // Hint: Use category.contains_age() to verify membership
        let actual_age = self.birth_date.age_in_years();
        let is_valid = category.contains_age(actual_age);
        
        AgeCategoryProof {
            commitment: self.commitment,
            category,
            proof_data: 0,
            is_valid
        }
    }
}

// TODO: Part 5 - Implement age category logic
impl AgeCategory {
    fn get_range(self) -> (u32, u32) {
        // Return (min_age, max_age) for each category
        // Hint: Minor (0-17), Adult (18-64), Senior (65-150)
        match self {
            AgeCategory::Minor => (0, 17),
            AgeCategory::Adult => (18, 64),
            AgeCategory::Senior => (65, 150)
        }
    }
    
    fn contains_age(self, age: u32) -> bool {
        // Check if age falls within category range
        // Hint: Get range and check if min <= age <= max
        let (min_age, max_age) = self.get_range();
        age >= min_age && age <= max_age
    }
}

// TODO: Part 6 - Complete verification system (Advanced Level)
impl AgeVerificationSystem {
    fn new() -> Self {
        // Initialize empty verification system
        // Hint: Set arrays to empty and counters to 0
        AgeVerificationSystem {
            trusted_commitments: [0; 100],
            verified_proofs: [0; 100],
            commitment_count: 0,
            proof_count: 0
        }
    }
    
    fn register_identity(&mut self, commitment: Field) -> bool {
        // Register a new identity commitment if not already exists
        // Hint: Check for duplicates before adding
        if self.commitment_count >= 100 {
            return false;
        }
        
        // Check for existing commitment
        for i in 0..self.commitment_count {
            if self.trusted_commitments[i] == commitment {
                return false;
            }
        }
        
        // Add new commitment
        self.trusted_commitments[self.commitment_count] = commitment;
        self.commitment_count += 1;
        true
    }
    
    fn verify_minimum_age(&self, proof: AgeProof) -> bool {
        // Verify proof against trusted commitments
        // Hint: Check if commitment is trusted AND proof is valid
        let mut is_trusted = false;
        for i in 0..self.commitment_count {
            if self.trusted_commitments[i] == proof.commitment {
                is_trusted = true;
                break;
            }
        }
        is_trusted & proof.is_valid
    }
    
    fn verify_age_range(&self, proof: AgeRangeProof) -> bool {
        // Verify age range proof against system
        // Hint: Similar to minimum age but check range proof validity
        let mut is_trusted = false;
        for i in 0..self.commitment_count {
            if self.trusted_commitments[i] == proof.commitment {
                is_trusted = true;
                break;
            }
        }
        is_trusted & proof.is_valid
    }
    
    fn check_access_policy(&self, proof: AgeProof, policy: AccessPolicy) -> bool {
        // Check if proof satisfies access policy requirements
        // Hint: Verify both system trust and policy compliance
        let system_valid = self.verify_minimum_age(proof);
        let policy_valid = proof.minimum_age >= policy.minimum_age;
        system_valid & policy_valid
    }
}

// TODO: Part 7 - Implement batch processing for scalability
fn batch_verify_minimum_age<let N: u32>(
    system: AgeVerificationSystem,
    proofs: [AgeProof; N]
) -> [bool; N] {
    // Efficiently verify multiple proofs
    // Hint: Apply verify_minimum_age to each proof in array
    let mut results = [false; N];
    for i in 0..N {
        results[i] = system.verify_minimum_age(proofs[i]);
    }
    results
}

fn batch_verify_age_range<let N: u32>(
    system: AgeVerificationSystem,
    proofs: [AgeRangeProof; N]
) -> [bool; N] {
    // Batch verify range proofs for efficiency
    // Hint: Similar to minimum age batch verification
    let mut results = [false; N];
    for i in 0..N {
        results[i] = system.verify_age_range(proofs[i]);
    }
    results
}

#[test]
fn test_basic_date_operations() {
    let birth_date = Date { year: 1990, month: 6, day: 15 };
    
    // Test date validation
    assert(birth_date.is_valid());
    
    // Test age calculation
    let age = birth_date.age_in_years();
    assert(age == 33); // Based on CURRENT_YEAR = 2024
    
    // Test field encoding
    let field_value = birth_date.to_field();
    assert(field_value == 19900615);
}

#[test]
fn test_identity_commitment_system() {
    let birth_date = Date { year: 1995, month: 3, day: 20 };
    let secret = 12345;
    
    let identity = IdentityCommitment::new(birth_date, secret);
    assert(identity.verify_commitment());
    
    // Test minimum age proof
    let proof = identity.prove_minimum_age(18);
    assert(proof.is_valid); // Should be valid since age is 29
    
    let proof_underage = identity.prove_minimum_age(30);
    assert(!proof_underage.is_valid); // Should be invalid since age is 29
}

#[test]
fn test_age_range_proofs() {
    let birth_date = Date { year: 1985, month: 12, day: 1 };
    let identity = IdentityCommitment::new(birth_date, 54321);
    
    // Test age range proof (should be valid for adult range)
    let range_proof = identity.prove_age_range(18, 64);
    assert(range_proof.is_valid);
    
    // Test age range proof (should be invalid for senior range)
    let senior_proof = identity.prove_age_range(65, 150);
    assert(!senior_proof.is_valid);
}

#[test]
fn test_age_categories() {
    let minor_age = 16;
    let adult_age = 30;
    let senior_age = 70;
    
    assert(AgeCategory::Minor.contains_age(minor_age));
    assert(!AgeCategory::Adult.contains_age(minor_age));
    
    assert(AgeCategory::Adult.contains_age(adult_age));
    assert(!AgeCategory::Minor.contains_age(adult_age));
    
    assert(AgeCategory::Senior.contains_age(senior_age));
    assert(!AgeCategory::Adult.contains_age(senior_age));
}

#[test]
fn test_complete_verification_system() {
    let mut system = AgeVerificationSystem::new();
    
    // Register identity
    let birth_date = Date { year: 1988, month: 8, day: 10 };
    let identity = IdentityCommitment::new(birth_date, 98765);
    
    let registered = system.register_identity(identity.commitment);
    assert(registered);
    
    // Attempt duplicate registration
    let duplicate = system.register_identity(identity.commitment);
    assert(!duplicate);
    
    // Generate and verify proof
    let proof = identity.prove_minimum_age(21);
    let verified = system.verify_minimum_age(proof);
    assert(verified);
    
    // Test access policy
    let policy = AccessPolicy {
        minimum_age: 18,
        allowed_categories: [AgeCategory::Adult, AgeCategory::Senior, AgeCategory::Minor],
        strict_verification: true
    };
    
    let policy_result = system.check_access_policy(proof, policy);
    assert(policy_result);
}

#[test]
fn test_batch_verification() {
    let mut system = AgeVerificationSystem::new();
    
    // Create multiple identities
    let identity1 = IdentityCommitment::new(Date { year: 1990, month: 1, day: 1 }, 111);
    let identity2 = IdentityCommitment::new(Date { year: 1995, month: 6, day: 15 }, 222);
    let identity3 = IdentityCommitment::new(Date { year: 2010, month: 12, day: 31 }, 333);
    
    // Register identities
    assert(system.register_identity(identity1.commitment));
    assert(system.register_identity(identity2.commitment));
    assert(system.register_identity(identity3.commitment));
    
    // Create batch proofs
    let proofs = [
        identity1.prove_minimum_age(18),
        identity2.prove_minimum_age(18),
        identity3.prove_minimum_age(18)
    ];
    
    // Batch verify
    let results = batch_verify_minimum_age(system, proofs);
    assert(results[0]); // 1990 birth - should be valid for 18+
    assert(results[1]); // 1995 birth - should be valid for 18+
    assert(!results[2]); // 2010 birth - should be invalid for 18+
}
```

## Verification

Run `nargo test` to verify your implementation. The tests progress through:

1. **Basic Tests**: Date operations and validation
2. **Intermediate Tests**: Identity commitments and proof generation
3. **Advanced Tests**: Complete system integration and batch processing

## Learning Progression

- **Part 1-2**: Foundational date arithmetic and commitment schemes
- **Part 3-4**: Proof generation with increasing complexity
- **Part 5-6**: Complete verification system with access control
- **Part 7**: Production-ready batch processing

## Real-World Applications

1. **Age-gated services**: Verify minimum age without revealing birth date
2. **Demographic analysis**: Prove age category membership for surveys
3. **Access control**: Implement age-based permissions in applications
4. **Identity verification**: Combine with other proofs for comprehensive verification

## Extensions

1. Implement time-based proof expiration
2. Add support for different date formats and calendars
3. Create composite proofs combining age with other attributes
4. Implement privacy-preserving audit trails