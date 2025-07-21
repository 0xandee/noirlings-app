---
id: identity_commitments
title: identity_commitments
category: privacy
difficulty: medium
tags: []
mode: test
prerequisites: ["date_arithmetic", "pedersen_hash"]
version: 1.0.0
locales:
  en:
    hint: >-
      Identity commitments use cryptographic hashing to create verifiable but private representations of personal data. Use Pedersen hash for commitment schemes.

      1. Creating Identity Commitments

      ```noir
      fn new(birth_date: Date, secret: Field) -> Self {
          let commitment = pedersen_hash([birth_date.to_field(), secret]);
          IdentityCommitment {
              birth_date,
              secret,
              commitment
          }
      }
      ```

      2. Commitment Verification

      ```noir
      fn verify_commitment(self) -> bool {
          let expected_commitment = pedersen_hash([self.birth_date.to_field(), self.secret]);
          expected_commitment == self.commitment
      }
      ```

      3. Commitment Binding Property

      ```noir
      fn test_commitment_binding(date1: Date, date2: Date, secret: Field) -> bool {
          let commit1 = IdentityCommitment::new(date1, secret);
          let commit2 = IdentityCommitment::new(date2, secret);
          
          // Different dates should produce different commitments
          commit1.commitment != commit2.commitment
      }
      ```
    description: >-
      Identity commitments enable privacy-preserving verification by binding personal data to cryptographic commitments. Learn to implement secure commitment schemes for zero-knowledge identity systems.

      In this exercise, you will:
      1. Create cryptographic commitments to personal data
      2. Verify commitment integrity and authenticity
      3. Understand commitment properties (hiding and binding)
      4. Implement secure random number generation for blinding

      #### Docs
    docLink: "https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives/hashes#pedersen-hash"
---

```noir
use std::hash::pedersen_hash;

global CURRENT_YEAR: u32 = 2024;
global CURRENT_MONTH: u32 = 1;
global CURRENT_DAY: u32 = 1;

// Date structure (simplified version from previous exercise)
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

    fn is_valid(self) -> bool {
        let year_valid = self.year >= 1900 && self.year <= CURRENT_YEAR;
        let month_valid = self.month >= 1 && self.month <= 12;
        let day_valid = self.day >= 1 && self.day <= 31;

        year_valid & month_valid & day_valid
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
        // The commitment should bind the birth_date with the secret
        todo!()
    }

    // TODO: Verify the commitment is correctly computed
    fn verify_commitment(self) -> bool {
        // Hint: Recompute the commitment and compare with stored value
        todo!()
    }

    // TODO: Check if two commitments are equal (without revealing data)
    fn equals(self, other: IdentityCommitment) -> bool {
        // Hint: Compare commitment values only
        todo!()
    }

    // TODO: Generate a deterministic public identifier from the commitment
    fn public_identifier(self) -> Field {
        // Hint: Hash the commitment to create a public ID
        // This allows referencing the identity without revealing the commitment
        todo!()
    }
}

// Commitment utilities for testing and validation
struct CommitmentValidator {
    known_commitments: [Field], // Registry of valid commitments
}

impl CommitmentValidator {
    // TODO: Create new validator
    fn new() -> Self {
        todo!()
    }

    // TODO: Register a new commitment as valid
    fn register_commitment(&mut self, commitment: Field) -> bool {
        // Hint: Add to known_commitments if not already present
        todo!()
    }

    // TODO: Check if a commitment is registered
    fn is_registered(&self, commitment: Field) -> bool {
        // Hint: Search through known_commitments
        todo!()
    }

    // TODO: Verify a commitment without storing it
    fn verify_commitment_format(&self, commitment: Field) -> bool {
        // Hint: Basic validation that commitment is non-zero and properly formatted
        todo!()
    }
}

fn main(
    birth_year: u32,
    birth_month: u32,
    birth_day: u32,
    secret: Field,
    expected_commitment: Field
) -> pub bool {
    let birth_date = Date {
        year: birth_year,
        month: birth_month,
        day: birth_day
    };

    // Create identity commitment
    let identity = IdentityCommitment::new(birth_date, secret);

    // Test commitment correctness
    let commitment_valid = identity.verify_commitment();

    // Test expected commitment value
    let commitment_matches = identity.commitment == expected_commitment;

    // Test that commitment is deterministic
    let identity2 = IdentityCommitment::new(birth_date, secret);
    let deterministic = identity.commitment == identity2.commitment;

    commitment_valid & commitment_matches & deterministic
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

    // Same inputs should produce same commitment
    let identity3 = IdentityCommitment::new(birth_date, secret);
    assert(identity.commitment == identity3.commitment);
}

#[test]
fn test_commitment_binding() {
    let date1 = Date { year: 1990, month: 1, day: 1 };
    let date2 = Date { year: 1990, month: 1, day: 2 };
    let secret = 99999;

    let commit1 = IdentityCommitment::new(date1, secret);
    let commit2 = IdentityCommitment::new(date2, secret);

    // Different dates should produce different commitments (binding property)
    assert(commit1.commitment != commit2.commitment);

    // Both should be valid
    assert(commit1.verify_commitment());
    assert(commit2.verify_commitment());
}

#[test]
fn test_commitment_hiding() {
    let birth_date = Date { year: 1985, month: 7, day: 10 };

    let secret1 = 11111;
    let secret2 = 22222;

    let commit1 = IdentityCommitment::new(birth_date, secret1);
    let commit2 = IdentityCommitment::new(birth_date, secret2);

    // Same date with different secrets should produce different commitments (hiding property)
    assert(commit1.commitment != commit2.commitment);
}

#[test]
fn test_commitment_validator() {
    let mut validator = CommitmentValidator::new();

    let birth_date = Date { year: 2000, month: 12, day: 15 };
    let identity = IdentityCommitment::new(birth_date, 54321);

    // Initially not registered
    assert(!validator.is_registered(identity.commitment));

    // Register the commitment
    let registered = validator.register_commitment(identity.commitment);
    assert(registered);

    // Now should be registered
    assert(validator.is_registered(identity.commitment));

    // Should not register the same commitment twice
    let registered_again = validator.register_commitment(identity.commitment);
    assert(!registered_again);
}

#[test]
fn test_public_identifier() {
    let birth_date = Date { year: 1992, month: 4, day: 8 };
    let identity = IdentityCommitment::new(birth_date, 77777);

    let public_id = identity.public_identifier();

    // Public ID should be deterministic
    let public_id2 = identity.public_identifier();
    assert(public_id == public_id2);

    // Public ID should be different from commitment
    assert(public_id != identity.commitment);

    // Different commitments should have different public IDs
    let identity2 = IdentityCommitment::new(birth_date, 88888);
    let public_id3 = identity2.public_identifier();
    assert(public_id != public_id3);
}

#[test]
fn test_commitment_equality() {
    let date = Date { year: 1988, month: 9, day: 22 };
    let secret = 13579;

    let commit1 = IdentityCommitment::new(date, secret);
    let commit2 = IdentityCommitment::new(date, secret);

    // Same inputs should create equal commitments
    assert(commit1.equals(commit2));

    // Different secrets should create unequal commitments
    let commit3 = IdentityCommitment::new(date, 24680);
    assert(!commit1.equals(commit3));
}
```
