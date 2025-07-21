---
id: election_system
title: election_system
category: privacy
difficulty: hard
tags: []
mode: test
prerequisites: ["vote_encryption"]
version: 1.0.0
locales:
  en:
    hint: >-
      Complete election systems integrate voter registration, nullifier tracking, vote encryption, and Merkle proofs for comprehensive privacy-preserving voting.

      1. Election Initialization

      ```noir
      fn new(election_id: Field, voters: [Voter]) -> Self {
          // Build Merkle tree from voter commitments
          let mut commitments = [];
          for voter in voters {
              commitments.push(voter.commitment());
          }
          
          let voter_tree_root = compute_merkle_root(commitments);
          
          Election {
              election_id,
              voter_tree_root,
              used_nullifiers: [],
              encrypted_votes: [],
              is_active: true
          }
      }
      ```

      2. Vote Casting with Full Verification

      ```noir
      fn cast_vote(
          &mut self,
          voter: Voter,
          vote: VoteChoice,
          merkle_proof: [Field; TREE_DEPTH]
      ) -> bool {
          // Verify voter eligibility using Merkle proof
          let voter_commitment = voter.commitment();
          let proof_valid = verify_merkle_proof(
              self.voter_tree_root,
              voter_commitment,
              merkle_proof
          );
          
          if !proof_valid {
              return false;
          }
          
          // Generate and check nullifier
          let nullifier = voter.generate_nullifier(self.election_id);
          for used_nullifier in self.used_nullifiers {
              if used_nullifier == nullifier {
                  return false; // Double voting attempt
              }
          }
          
          // Encrypt vote and record
          let randomness = pedersen_hash([voter.secret, self.election_id]);
          let encrypted_vote = encrypt_vote(vote, randomness, 0);
          
          true
      }
      ```

      3. Merkle Proof Verification

      ```noir
      fn verify_merkle_proof(
          root: Field,
          leaf: Field,
          proof: [Field; TREE_DEPTH]
      ) -> bool {
          let mut current_hash = leaf;
          
          for i in 0..TREE_DEPTH {
              let proof_element = proof[i];
              current_hash = pedersen_hash([current_hash, proof_element]);
          }
          
          current_hash == root
      }
      ```

      4. Election Tallying

      ```noir
      fn tally_votes(&self, decryption_key: Field) -> (u32, u32, u32) {
          let mut yes_count = 0;
          let mut no_count = 0;
          let mut abstain_count = 0;
          
          for ballot in self.encrypted_votes {
              let vote = decrypt_vote(ballot.encrypted_vote, decryption_key);
              match vote {
                  VoteChoice::Yes => yes_count += 1,
                  VoteChoice::No => no_count += 1,
                  VoteChoice::Abstain => abstain_count += 1
              }
          }
          
          (yes_count, no_count, abstain_count)
      }
      ```

      5. Election Auditing

      ```noir
      fn audit_election(&self) -> ElectionAudit {
          ElectionAudit {
              total_votes: self.encrypted_votes.len(),
              voter_tree_root: self.voter_tree_root,
              nullifier_count: self.used_nullifiers.len(),
              is_consistent: self.verify_consistency()
          }
      }
      ```
    description: >-
      Complete election systems integrate all privacy-preserving voting components for real-world deployment. Learn to implement end-to-end election systems with voter registration, nullifier tracking, vote encryption, and secure tallying.

      In this exercise, you will:
      1. Build a complete privacy-preserving election system
      2. Integrate Merkle proofs for voter eligibility verification
      3. Implement secure vote casting with nullifier tracking
      4. Enable transparent auditing without compromising privacy

      #### Docs
    docLink: "https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives"
---

```noir
use std::hash::pedersen_hash;
use std::merkle::compute_merkle_root;

global TREE_DEPTH: u32 = 20; // Support up to 2^20 voters

// Import structures from previous exercises
struct Voter {
    voter_id: Field,
    secret: Field,
    nullifier_secret: Field,
}

impl Voter {
    fn commitment(self) -> Field {
        pedersen_hash([self.voter_id, self.secret])
    }

    fn generate_nullifier(self, election_id: Field) -> Field {
        pedersen_hash([self.nullifier_secret, election_id])
    }
}

enum VoteChoice {
    Yes,
    No,
    Abstain,
}

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

// Encrypted ballot structure with full proof information
struct EncryptedBallot {
    encrypted_vote: Field,               // Encrypted vote choice
    vote_proof: Field,                   // Proof that vote is valid
    nullifier: Field,                    // Nullifier to prevent double voting
    merkle_proof: [Field; TREE_DEPTH],   // Proof of voter eligibility
    timestamp: u32,                      // When vote was cast
}

impl EncryptedBallot {
    // TODO: Create new encrypted ballot
    fn new(
        vote: VoteChoice,
        voter: Voter,
        election_id: Field,
        merkle_proof: [Field; TREE_DEPTH],
        public_key: Field,
        timestamp: u32
    ) -> Self {
        // Hint:
        // 1. Encrypt the vote
        // 2. Generate nullifier
        // 3. Create vote validity proof
        // 4. Package everything together
        todo!()
    }

    // TODO: Verify ballot integrity
    fn verify(&self, voter_tree_root: Field, public_key: Field) -> bool {
        // Hint:
        // 1. Verify Merkle proof
        // 2. Verify vote validity proof
        // 3. Check all components are consistent
        todo!()
    }
}

// Complete election state management
struct Election {
    election_id: Field,
    voter_tree_root: Field,              // Merkle root of registered voters
    used_nullifiers: [Field],            // Nullifiers of votes cast
    encrypted_votes: [EncryptedBallot],  // All cast ballots
    is_active: bool,                     // Whether voting is open
    start_time: u32,                     // Election start timestamp
    end_time: u32,                       // Election end timestamp
    public_key: Field,                   // Election public key
}

impl Election {
    // TODO: Create new election with registered voters
    fn new(
        election_id: Field,
        voters: [Voter],
        start_time: u32,
        end_time: u32,
        public_key: Field
    ) -> Self {
        // Hint: Build Merkle tree from voter commitments
        todo!()
    }

    // TODO: Cast a vote with full verification
    fn cast_vote(
        &mut self,
        voter: Voter,
        vote: VoteChoice,
        merkle_proof: [Field; TREE_DEPTH],
        current_time: u32
    ) -> bool {
        // Hint:
        // 1. Check election is active and within time bounds
        // 2. Verify voter is in the tree using Merkle proof
        // 3. Check nullifier hasn't been used
        // 4. Create and verify encrypted ballot
        // 5. Add to encrypted_votes and used_nullifiers
        todo!()
    }

    // TODO: Verify a ballot without revealing the voter
    fn verify_ballot(&self, ballot: EncryptedBallot) -> bool {
        // Hint: Use ballot's verify method with election parameters
        todo!()
    }

    // TODO: Close the election (stop accepting votes)
    fn close_election(&mut self, current_time: u32) -> bool {
        // Hint: Set is_active to false if past end_time
        todo!()
    }

    // TODO: Tally votes while preserving privacy
    fn tally_votes(&self, private_key: Field) -> ElectionResults {
        // Hint: Decrypt each vote and count by category
        todo!()
    }

    // TODO: Verify the tally is correct
    fn verify_tally(&self, results: ElectionResults, private_key: Field) -> bool {
        // Hint: Re-compute tally and compare with claimed results
        todo!()
    }

    // TODO: Generate audit information
    fn generate_audit(&self) -> ElectionAudit {
        // Hint: Create comprehensive audit data without revealing votes
        todo!()
    }

    // TODO: Check if a specific voter has voted
    fn has_voter_voted(&self, voter_commitment: Field) -> bool {
        // Hint: Check if any nullifier corresponds to this voter
        // This should not be easily computable to preserve privacy
        todo!()
    }
}

// Election results structure
struct ElectionResults {
    yes_count: u32,
    no_count: u32,
    abstain_count: u32,
    total_votes: u32,
    election_id: Field,
    tally_proof: Field,
}

impl ElectionResults {
    // TODO: Verify results integrity
    fn verify_integrity(&self) -> bool {
        // Hint: Check that counts add up and proof is valid
        todo!()
    }

    // TODO: Get winning choice
    fn get_winner(&self) -> VoteChoice {
        // Hint: Return choice with most votes
        todo!()
    }
}

// Election audit information
struct ElectionAudit {
    election_id: Field,
    voter_tree_root: Field,
    total_registered_voters: u32,
    total_votes_cast: u32,
    nullifier_count: u32,
    start_time: u32,
    end_time: u32,
    is_consistent: bool,
    audit_hash: Field,
}

impl ElectionAudit {
    // TODO: Verify audit consistency
    fn verify_consistency(&self) -> bool {
        // Hint: Check that all counts match and audit hash is correct
        todo!()
    }

    // TODO: Calculate turnout percentage
    fn calculate_turnout(&self) -> u32 {
        // Hint: (total_votes_cast * 100) / total_registered_voters
        todo!()
    }
}

// Multi-election management system
struct ElectionManager {
    elections: [Election],
    max_concurrent_elections: u32,
    global_voter_registry: Field, // Root of global voter tree
}

impl ElectionManager {
    // TODO: Create new election manager
    fn new(max_concurrent_elections: u32, global_voter_registry: Field) -> Self {
        todo!()
    }

    // TODO: Create new election
    fn create_election(
        &mut self,
        election_id: Field,
        voters: [Voter],
        start_time: u32,
        end_time: u32,
        public_key: Field
    ) -> bool {
        // Hint: Check limits and create new election
        todo!()
    }

    // TODO: Cast vote in specific election
    fn cast_vote_in_election(
        &mut self,
        election_id: Field,
        voter: Voter,
        vote: VoteChoice,
        merkle_proof: [Field; TREE_DEPTH],
        current_time: u32
    ) -> bool {
        // Hint: Find the election and cast vote
        todo!()
    }

    // TODO: Get results for specific election
    fn get_election_results(&self, election_id: Field, private_key: Field) -> ElectionResults {
        // Hint: Find election and return its results
        todo!()
    }

    // TODO: Audit all elections
    fn audit_all_elections(&self) -> [ElectionAudit] {
        // Hint: Generate audit for each election
        todo!()
    }
}

// Merkle proof utilities
fn verify_merkle_proof(
    root: Field,
    leaf: Field,
    proof: [Field; TREE_DEPTH]
) -> bool {
    // TODO: Verify Merkle proof showing leaf is in tree with given root
    // Hint: Hash leaf with proof elements to reconstruct root
    todo!()
}

fn generate_voter_proof(
    voters: [Voter],
    voter_index: u32
) -> [Field; TREE_DEPTH] {
    // TODO: Generate Merkle proof for voter at given index
    // Hint: Build proof path from leaf to root
    todo!()
}

// Vote encryption utilities (from previous exercise)
fn encrypt_vote(vote: VoteChoice, randomness: Field, public_key: Field) -> Field {
    let vote_value = vote.to_field();
    vote_value + randomness + public_key // Simplified encryption
}

fn decrypt_vote(encrypted_vote: Field, private_key: Field) -> VoteChoice {
    let decrypted_value = encrypted_vote - private_key; // Simplified decryption
    VoteChoice::from_field(decrypted_value)
}

fn main(
    election_id: Field,
    voter_id: Field,
    secret: Field,
    nullifier_secret: Field,
    vote_choice_value: Field,
    public_key: Field,
    private_key: Field
) -> pub bool {
    // Create voter
    let voter = Voter { voter_id, secret, nullifier_secret };
    let voters = [voter];

    // Create election
    let mut election = Election::new(election_id, voters, 0, 1000, public_key);

    // Generate Merkle proof for voter
    let merkle_proof = generate_voter_proof(voters, 0);

    // Cast vote
    let vote = VoteChoice::from_field(vote_choice_value);
    let vote_cast = election.cast_vote(voter, vote, merkle_proof, 500);

    // Tally votes
    let results = election.tally_votes(private_key);
    let tally_valid = election.verify_tally(results, private_key);

    vote_cast & tally_valid
}

#[test]
fn test_complete_election_flow() {
    // Create voters
    let voter1 = Voter {
        voter_id: 1,
        secret: 1111,
        nullifier_secret: 2222
    };

    let voter2 = Voter {
        voter_id: 2,
        secret: 3333,
        nullifier_secret: 4444
    };

    let voters = [voter1, voter2];
    let election_id = 1;
    let public_key = 12345;
    let private_key = 67890;

    // Create election
    let mut election = Election::new(election_id, voters, 0, 1000, public_key);

    // Generate proofs
    let proof1 = generate_voter_proof(voters, 0);
    let proof2 = generate_voter_proof(voters, 1);

    // Cast votes
    let vote1_cast = election.cast_vote(voter1, VoteChoice::Yes, proof1, 100);
    let vote2_cast = election.cast_vote(voter2, VoteChoice::No, proof2, 200);

    assert(vote1_cast);
    assert(vote2_cast);

    // Verify no double voting
    let double_vote = election.cast_vote(voter1, VoteChoice::Abstain, proof1, 300);
    assert(!double_vote);

    // Tally votes
    let results = election.tally_votes(private_key);
    assert(results.yes_count == 1);
    assert(results.no_count == 1);
    assert(results.abstain_count == 0);
    assert(results.total_votes == 2);
}

#[test]
fn test_election_timing() {
    let voter = Voter { voter_id: 1, secret: 1111, nullifier_secret: 2222 };
    let voters = [voter];
    let election_id = 1;
    let public_key = 12345;

    // Election from time 100 to 200
    let mut election = Election::new(election_id, voters, 100, 200, public_key);
    let proof = generate_voter_proof(voters, 0);

    // Vote before election starts (should fail)
    let early_vote = election.cast_vote(voter, VoteChoice::Yes, proof, 50);
    assert(!early_vote);

    // Vote during election (should succeed)
    let valid_vote = election.cast_vote(voter, VoteChoice::Yes, proof, 150);
    assert(valid_vote);

    // Close election
    let election_closed = election.close_election(250);
    assert(election_closed);

    // Vote after election ends (should fail)
    let late_vote = election.cast_vote(voter, VoteChoice::No, proof, 300);
    assert(!late_vote);
}

#[test]
fn test_election_audit() {
    let voters = [
        Voter { voter_id: 1, secret: 1111, nullifier_secret: 2222 },
        Voter { voter_id: 2, secret: 3333, nullifier_secret: 4444 },
        Voter { voter_id: 3, secret: 5555, nullifier_secret: 6666 }
    ];

    let election_id = 1;
    let public_key = 12345;
    let mut election = Election::new(election_id, voters, 0, 1000, public_key);

    // Cast some votes
    let proof1 = generate_voter_proof(voters, 0);
    let proof2 = generate_voter_proof(voters, 1);

    election.cast_vote(voters[0], VoteChoice::Yes, proof1, 100);
    election.cast_vote(voters[1], VoteChoice::No, proof2, 200);

    // Generate audit
    let audit = election.generate_audit();

    assert(audit.total_registered_voters == 3);
    assert(audit.total_votes_cast == 2);
    assert(audit.verify_consistency());

    // Calculate turnout
    let turnout = audit.calculate_turnout();
    assert(turnout == 66); // 2/3 * 100 = 66%
}

#[test]
fn test_election_manager() {
    let mut manager = ElectionManager::new(2, 12345); // Max 2 concurrent elections

    let voters1 = [Voter { voter_id: 1, secret: 1111, nullifier_secret: 2222 }];
    let voters2 = [Voter { voter_id: 2, secret: 3333, nullifier_secret: 4444 }];

    // Create elections
    assert(manager.create_election(1, voters1, 0, 100, 11111));
    assert(manager.create_election(2, voters2, 100, 200, 22222));

    // Should reject third election (at capacity)
    assert(!manager.create_election(3, voters1, 200, 300, 33333));

    // Cast votes in different elections
    let proof1 = generate_voter_proof(voters1, 0);
    let proof2 = generate_voter_proof(voters2, 0);

    assert(manager.cast_vote_in_election(1, voters1[0], VoteChoice::Yes, proof1, 50));
    assert(manager.cast_vote_in_election(2, voters2[0], VoteChoice::No, proof2, 150));
}

#[test]
fn test_merkle_proof_verification() {
    let voters = [
        Voter { voter_id: 1, secret: 1111, nullifier_secret: 2222 },
        Voter { voter_id: 2, secret: 3333, nullifier_secret: 4444 },
        Voter { voter_id: 3, secret: 5555, nullifier_secret: 6666 },
        Voter { voter_id: 4, secret: 7777, nullifier_secret: 8888 }
    ];

    // Build Merkle tree
    let mut commitments = [0; 4];
    for i in 0..4 {
        commitments[i] = voters[i].commitment();
    }
    let root = compute_merkle_root(commitments);

    // Generate and verify proof for voter 2 (index 1)
    let proof = generate_voter_proof(voters, 1);
    let is_valid = verify_merkle_proof(root, voters[1].commitment(), proof);
    assert(is_valid);

    // Invalid proof should fail
    let wrong_proof = generate_voter_proof(voters, 0);
    let is_invalid = verify_merkle_proof(root, voters[1].commitment(), wrong_proof);
    assert(!is_invalid);
}

#[test]
fn test_ballot_verification() {
    let voter = Voter { voter_id: 1, secret: 1111, nullifier_secret: 2222 };
    let voters = [voter];
    let election_id = 1;
    let public_key = 12345;

    let election = Election::new(election_id, voters, 0, 1000, public_key);
    let merkle_proof = generate_voter_proof(voters, 0);

    // Create ballot
    let ballot = EncryptedBallot::new(
        VoteChoice::Yes,
        voter,
        election_id,
        merkle_proof,
        public_key,
        100
    );

    // Ballot should verify
    assert(election.verify_ballot(ballot));
}
```
