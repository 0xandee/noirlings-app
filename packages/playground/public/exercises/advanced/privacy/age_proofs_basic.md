---
id: age_proofs_basic
title: age_proofs_basic
category: privacy
difficulty: medium
tags: []
mode: test
prerequisites: ["identity_commitments"]
version: 1.0.0
locales:
  en:
    hint: >-
      Age proofs allow proving age requirements without revealing exact birth dates. Implement different proof types for various verification scenarios.

      1. Minimum Age Proof

      ```noir
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
      ```

      2. Age Range Proof

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
      ```

      3. Age Category Proof

      ```noir
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
    description: >-
      Age proofs enable privacy-preserving verification of age requirements without revealing exact birth dates. Learn to implement different types of age proofs for various verification scenarios.

      In this exercise, you will:
      1. Generate minimum age proofs for threshold verification
      2. Create age range proofs for bracket verification
      3. Implement age category proofs for demographic verification
      4. Understand zero-knowledge proof construction principles

      #### Docs
    docLink: "https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives"
---

```noir
use std::hash::pedersen_hash;

global CURRENT_YEAR: u32 = 2024;
global CURRENT_MONTH: u32 = 1;
global CURRENT_DAY: u32 = 1;

// Date and IdentityCommitment structures (from previous exercises)
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

    // TODO: Generate proof that age is at least minimum_age
    fn prove_minimum_age(self, minimum_age: u32) -> AgeProof {
        // Hint: Create range proof showing age >= minimum_age
        // Use actual age, minimum age, and commitment to generate proof
        todo!()
    }

    // TODO: Generate proof that age is between min_age and max_age
    fn prove_age_range(self, min_age: u32, max_age: u32) -> AgeRangeProof {
        // Hint: Prove min_age <= age <= max_age
        // Check if actual age falls within the specified range
        todo!()
    }

    // TODO: Generate proof for specific age category without revealing exact age
    fn prove_exact_age_category(self, age_category: AgeCategory) -> AgeCategoryProof {
        // Hint: Prove membership in age category without revealing exact age
        // Use the category's age range to verify membership
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
        // Minor: (0, 17), Adult: (18, 64), Senior: (65, 150)
        todo!()
    }

    // TODO: Check if an age belongs to this category
    fn contains_age(self, age: u32) -> bool {
        // Hint: Use get_range() to check if age falls within bounds
        todo!()
    }

    // TODO: Convert category to field element for proof generation
    fn to_field(self) -> Field {
        // Hint: Convert enum variants to numbers (Minor=1, Adult=2, Senior=3)
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

impl AgeProof {
    // TODO: Verify this age proof without access to private data
    fn verify(self) -> bool {
        // Hint: The proof should be valid if is_valid is true
        // In a real implementation, this would verify the zero-knowledge proof
        todo!()
    }

    // TODO: Check if this proof meets a specific age requirement
    fn meets_requirement(self, required_age: u32) -> bool {
        // Hint: Check if minimum_age >= required_age and proof is valid
        todo!()
    }
}

struct AgeRangeProof {
    commitment: Field,          // Original identity commitment
    min_age: u32,              // Minimum age in range
    max_age: u32,              // Maximum age in range
    proof_data: Field,         // Zero-knowledge proof data
    is_valid: bool,            // Whether proof is valid
}

impl AgeRangeProof {
    // TODO: Verify this range proof
    fn verify(self) -> bool {
        todo!()
    }

    // TODO: Check if this range includes a specific age
    fn includes_age(self, age: u32) -> bool {
        // Hint: Check if min_age <= age <= max_age and proof is valid
        todo!()
    }
}

struct AgeCategoryProof {
    commitment: Field,          // Original identity commitment
    category: AgeCategory,      // Age category being proved
    proof_data: Field,         // Zero-knowledge proof data
    is_valid: bool,            // Whether proof is valid
}

impl AgeCategoryProof {
    // TODO: Verify this category proof
    fn verify(self) -> bool {
        todo!()
    }

    // TODO: Check if this proof is for a specific category
    fn is_category(self, expected_category: AgeCategory) -> bool {
        // Hint: Compare category fields and verify proof validity
        todo!()
    }
}

fn main(
    birth_year: u32,
    birth_month: u32,
    birth_day: u32,
    secret: Field,
    minimum_age_requirement: u32
) -> pub bool {
    let birth_date = Date {
        year: birth_year,
        month: birth_month,
        day: birth_day
    };

    let identity = IdentityCommitment::new(birth_date, secret);

    // Test minimum age proof
    let age_proof = identity.prove_minimum_age(minimum_age_requirement);
    let age_proof_valid = age_proof.verify();

    // Test age range proof (18-65)
    let range_proof = identity.prove_age_range(18, 65);
    let range_proof_valid = range_proof.verify();

    // Test age category proof
    let category_proof = identity.prove_exact_age_category(AgeCategory::Adult);
    let category_proof_valid = category_proof.verify();

    age_proof_valid & range_proof_valid & category_proof_valid
}

#[test]
fn test_minimum_age_proof() {
    let birth_date = Date {
        year: 1990,
        month: 1,
        day: 1
    }; // 34 years old

    let identity = IdentityCommitment::new(birth_date, 12345);

    // Generate proof for 18+ verification
    let proof = identity.prove_minimum_age(18);
    assert(proof.verify());
    assert(proof.meets_requirement(18));

    // Generate proof for 21+ verification
    let proof21 = identity.prove_minimum_age(21);
    assert(proof21.verify());
    assert(proof21.meets_requirement(21));

    // Should fail for age they don't meet
    let proof50 = identity.prove_minimum_age(50);
    assert(!proof50.verify());
    assert(!proof50.meets_requirement(50));
}

#[test]
fn test_age_range_proof() {
    let birth_date = Date {
        year: 1985,
        month: 12,
        day: 25
    }; // ~38 years old

    let identity = IdentityCommitment::new(birth_date, 54321);

    // Should pass for valid ranges
    let proof_adult = identity.prove_age_range(18, 65);
    assert(proof_adult.verify());
    assert(proof_adult.includes_age(25)); // Example age in range

    // Should fail for invalid ranges
    let proof_teen = identity.prove_age_range(13, 17);
    assert(!proof_teen.verify());

    let proof_senior = identity.prove_age_range(65, 100);
    assert(!proof_senior.verify());
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

    // Should prove Adult category correctly
    let adult_proof = identity.prove_exact_age_category(AgeCategory::Adult);
    assert(adult_proof.verify());
    assert(adult_proof.is_category(AgeCategory::Adult));

    // Should fail for wrong categories
    let minor_proof = identity.prove_exact_age_category(AgeCategory::Minor);
    assert(!minor_proof.verify());

    let senior_proof = identity.prove_exact_age_category(AgeCategory::Senior);
    assert(!senior_proof.verify());
}

#[test]
fn test_category_field_conversion() {
    assert(AgeCategory::Minor.to_field() == 1);
    assert(AgeCategory::Adult.to_field() == 2);
    assert(AgeCategory::Senior.to_field() == 3);
}

#[test]
fn test_proof_consistency() {
    let birth_date = Date {
        year: 1995,
        month: 8,
        day: 15
    }; // ~29 years old

    let identity = IdentityCommitment::new(birth_date, 11111);

    // All these proofs should be consistent
    let min_proof = identity.prove_minimum_age(18);
    let range_proof = identity.prove_age_range(18, 64);
    let category_proof = identity.prove_exact_age_category(AgeCategory::Adult);

    // All should be valid since person is 29 (adult)
    assert(min_proof.verify());
    assert(range_proof.verify());
    assert(category_proof.verify());

    // All should use the same commitment
    assert(min_proof.commitment == identity.commitment);
    assert(range_proof.commitment == identity.commitment);
    assert(category_proof.commitment == identity.commitment);
}
```
