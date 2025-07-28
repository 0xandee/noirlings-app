---
id: voter_commitments
title: voter_commitments
category: privacy
difficulty: easy
tags: []
mode: test
prerequisites: ["identity_commitments"]
version: 1.0.0
locales:
  en:
    hint: >-
      Voter commitments enable anonymous voter registration while maintaining eligibility verification. Implement commitment schemes for voter identity management.

      1. Voter Commitment Generation

      ```noir
      fn commitment(self) -> Field {
          pedersen_hash([self.voter_id, self.secret])
      }
      ```

      2. Vote Choice Encoding

      ```noir
      impl VoteChoice {
          fn to_field(self) -> Field {
              match self {
                  VoteChoice::Yes => 1,
                  VoteChoice::No => 2,
                  VoteChoice::Abstain => 3
              }
          }
          
          fn from_field(value: Field) -> Self {
              if value == 1 {
                  VoteChoice::Yes
              } else if value == 2 {
                  VoteChoice::No
              } else {
                  VoteChoice::Abstain
              }
          }
      }
      ```

      3. Voter Registry Management

      ```noir
      fn register_voter(&mut self, voter_commitment: Field) -> bool {
          // Check for duplicate registrations
          for existing in self.registered_voters {
              if existing == voter_commitment {
                  return false;
              }
          }
          
          self.registered_voters.push(voter_commitment);
          true
      }
      ```
    description: >-
      Voter commitments form the foundation of privacy-preserving voting systems. Learn to implement anonymous voter registration using cryptographic commitments while maintaining election integrity.

      In this exercise, you will:
      1. Create voter commitments for anonymous registration
      2. Implement vote choice encoding and validation
      3. Build a voter registry with duplicate prevention
      4. Understand the privacy-utility trade-offs in voting systems

      #### Docs
    docLink: "https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives/hashes#pedersen-hash"
---

```noir
use std::hash::pedersen_hash;

// Voter registration information
struct Voter {
    voter_id: Field,        // Unique voter identifier
    secret: Field,          // Voter's secret key
}

impl Voter {
    // TODO: Generate voter commitment for registration
    fn commitment(self) -> Field {
        // Hint: Hash voter_id and secret to create a commitment
        // This hides the voter's identity while proving eligibility
        todo!()
    }

    // TODO: Verify a voter commitment without revealing the voter
    fn verify_commitment(self, commitment: Field) -> bool {
        // Hint: Recompute commitment and compare
        todo!()
    }

    // TODO: Create a public identifier that can't be linked to the voter
    fn public_identifier(self) -> Field {
        // Hint: Hash the commitment to create a public reference
        todo!()
    }
}

// Vote choices (can be extended for multiple options)
enum VoteChoice {
    Yes,
    No,
    Abstain,
}

impl VoteChoice {
    // TODO: Convert vote choice to field element
    fn to_field(self) -> Field {
        // Hint: Map Yes=1, No=2, Abstain=3
        todo!()
    }

    // TODO: Convert field element back to vote choice
    fn from_field(value: Field) -> Self {
        // Hint: Reverse the mapping from to_field()
        todo!()
    }

    // TODO: Validate that a field value represents a valid vote
    fn is_valid_vote(value: Field) -> bool {
        // Hint: Check if value is 1, 2, or 3
        todo!()
    }

    // TODO: Get the name of the vote choice as a string identifier
    fn name(self) -> Field {
        // Hint: Return a unique identifier for each choice
        todo!()
    }
}

// Voter registry for managing registered voters
struct VoterRegistry {
    registered_voters: [Field],  // List of voter commitments
    registration_deadline: u32,  // Block number deadline
    max_voters: u32,            // Maximum allowed voters
}

impl VoterRegistry {
    // TODO: Create new voter registry
    fn new(registration_deadline: u32, max_voters: u32) -> Self {
        // Hint: Initialize with empty array and set limits
        todo!()
    }

    // TODO: Register a new voter
    fn register_voter(&mut self, voter_commitment: Field) -> bool {
        // Hint:
        // 1. Check if already registered (no duplicates)
        // 2. Check if under max_voters limit
        // 3. Add to registered_voters if valid
        todo!()
    }

    // TODO: Check if a voter is registered
    fn is_registered(&self, voter_commitment: Field) -> bool {
        // Hint: Search through registered_voters array
        todo!()
    }

    // TODO: Get total number of registered voters
    fn get_voter_count(&self) -> u32 {
        // Hint: Return length of registered_voters array
        todo!()
    }

    // TODO: Check if registration is still open
    fn is_registration_open(&self, current_block: u32) -> bool {
        // Hint: Compare current_block with registration_deadline
        todo!()
    }

    // TODO: Verify registry integrity
    fn verify_integrity(&self) -> bool {
        // Hint: Check for duplicates and validate constraints
        todo!()
    }
}

// Ballot structure for vote representation
struct Ballot {
    vote_choice: VoteChoice,
    voter_commitment: Field,
    timestamp: u32,
}

impl Ballot {
    // TODO: Create new ballot
    fn new(vote_choice: VoteChoice, voter_commitment: Field, timestamp: u32) -> Self {
        todo!()
    }

    // TODO: Verify ballot validity
    fn is_valid(&self) -> bool {
        // Hint: Check that vote_choice is valid and commitment is non-zero
        todo!()
    }

    // TODO: Get ballot hash for integrity checking
    fn hash(&self) -> Field {
        // Hint: Hash all ballot fields together
        todo!()
    }
}

fn main(
    voter_id: Field,
    secret: Field,
    vote_choice_value: Field,
    registration_deadline: u32
) -> pub bool {
    // Create voter and generate commitment
    let voter = Voter { voter_id, secret };
    let commitment = voter.commitment();

    // Test voter registry
    let mut registry = VoterRegistry::new(registration_deadline, 100);
    let registration_success = registry.register_voter(commitment);

    // Test vote choice conversion
    let vote_choice = VoteChoice::from_field(vote_choice_value);
    let vote_valid = VoteChoice::is_valid_vote(vote_choice_value);

    // Create and validate ballot
    let ballot = Ballot::new(vote_choice, commitment, 123);
    let ballot_valid = ballot.is_valid();

    registration_success & vote_valid & ballot_valid
}

#[test]
fn test_voter_commitment() {
    let voter = Voter {
        voter_id: 12345,
        secret: 67890
    };

    let commitment = voter.commitment();

    // Commitment should be deterministic
    let commitment2 = voter.commitment();
    assert(commitment == commitment2);

    // Different voters should have different commitments
    let other_voter = Voter {
        voter_id: 54321,
        secret: 67890
    };
    let other_commitment = other_voter.commitment();
    assert(commitment != other_commitment);

    // Voter should be able to verify their own commitment
    assert(voter.verify_commitment(commitment));
    assert(!voter.verify_commitment(other_commitment));
}

#[test]
fn test_vote_choice_conversion() {
    let yes_vote = VoteChoice::Yes;
    let no_vote = VoteChoice::No;
    let abstain_vote = VoteChoice::Abstain;

    // Test conversion to field and back
    let yes_field = yes_vote.to_field();
    let no_field = no_vote.to_field();
    let abstain_field = abstain_vote.to_field();

    // Should be different values
    assert(yes_field != no_field);
    assert(yes_field != abstain_field);
    assert(no_field != abstain_field);

    // Should convert back correctly
    let yes_back = VoteChoice::from_field(yes_field);
    let no_back = VoteChoice::from_field(no_field);
    let abstain_back = VoteChoice::from_field(abstain_field);

    assert(yes_back.to_field() == yes_field);
    assert(no_back.to_field() == no_field);
    assert(abstain_back.to_field() == abstain_field);

    // Test validation
    assert(VoteChoice::is_valid_vote(yes_field));
    assert(VoteChoice::is_valid_vote(no_field));
    assert(VoteChoice::is_valid_vote(abstain_field));
    assert(!VoteChoice::is_valid_vote(999)); // Invalid vote
}

#[test]
fn test_voter_registry() {
    let mut registry = VoterRegistry::new(1000, 5); // Deadline at block 1000, max 5 voters

    let voter1 = Voter { voter_id: 1, secret: 1111 };
    let voter2 = Voter { voter_id: 2, secret: 2222 };

    // Initially empty
    assert(registry.get_voter_count() == 0);
    assert(!registry.is_registered(voter1.commitment()));

    // Register voters
    assert(registry.register_voter(voter1.commitment()));
    assert(registry.get_voter_count() == 1);
    assert(registry.is_registered(voter1.commitment()));

    assert(registry.register_voter(voter2.commitment()));
    assert(registry.get_voter_count() == 2);

    // Cannot register same voter twice
    assert(!registry.register_voter(voter1.commitment()));
    assert(registry.get_voter_count() == 2);

    // Test registration deadline
    assert(registry.is_registration_open(999));  // Before deadline
    assert(!registry.is_registration_open(1001)); // After deadline
}

#[test]
fn test_registry_limits() {
    let mut registry = VoterRegistry::new(1000, 2); // Max 2 voters

    let voter1 = Voter { voter_id: 1, secret: 1111 };
    let voter2 = Voter { voter_id: 2, secret: 2222 };
    let voter3 = Voter { voter_id: 3, secret: 3333 };

    // Register up to limit
    assert(registry.register_voter(voter1.commitment()));
    assert(registry.register_voter(voter2.commitment()));

    // Should reject when at capacity
    assert(!registry.register_voter(voter3.commitment()));
    assert(registry.get_voter_count() == 2);
}

#[test]
fn test_ballot_creation() {
    let voter = Voter { voter_id: 123, secret: 456 };
    let vote_choice = VoteChoice::Yes;
    let ballot = Ballot::new(vote_choice, voter.commitment(), 789);

    // Ballot should be valid
    assert(ballot.is_valid());

    // Ballot hash should be deterministic
    let hash1 = ballot.hash();
    let hash2 = ballot.hash();
    assert(hash1 == hash2);

    // Different ballots should have different hashes
    let other_ballot = Ballot::new(VoteChoice::No, voter.commitment(), 789);
    assert(ballot.hash() != other_ballot.hash());
}

#[test]
fn test_voter_privacy() {
    let voter1 = Voter { voter_id: 1, secret: 1111 };
    let voter2 = Voter { voter_id: 2, secret: 2222 };

    let commitment1 = voter1.commitment();
    let commitment2 = voter2.commitment();

    // Commitments should hide voter identities
    assert(commitment1 != voter1.voter_id);
    assert(commitment2 != voter2.voter_id);
    assert(commitment1 != commitment2);

    // Public identifiers should be different from commitments
    let public_id1 = voter1.public_identifier();
    let public_id2 = voter2.public_identifier();

    assert(public_id1 != commitment1);
    assert(public_id2 != commitment2);
    assert(public_id1 != public_id2);
}

#[test]
fn test_registry_integrity() {
    let mut registry = VoterRegistry::new(1000, 10);

    // Empty registry should be valid
    assert(registry.verify_integrity());

    // Add some voters
    let voter1 = Voter { voter_id: 1, secret: 1111 };
    let voter2 = Voter { voter_id: 2, secret: 2222 };

    registry.register_voter(voter1.commitment());
    registry.register_voter(voter2.commitment());

    // Registry with valid voters should be valid
    assert(registry.verify_integrity());
}
```
