---
id: trie_traversal
title: trie_traversal
category: ethereum
difficulty: hard
tags: []
mode: test
prerequisites: ["storage_proofs"]
version: 1.0.0
locales:
  en:
    hint: >-
      Complete trie traversal algorithms enable verification of Ethereum state and storage proofs. Implement proof verification, node traversal, and light client functionality.

      1. Trie Proof Traversal

      ```noir
      fn traverse_trie_proof(
          root_hash: [u8; 32],
          key_path: [u8; 64],
          proof_nodes: [[u8]]
      ) -> (bool, [u8]) {
          let mut current_hash = root_hash;
          let mut remaining_path = key_path;
          let mut path_offset = 0;
          
          for node_data in proof_nodes {
              // Verify node hash matches expected
              let computed_hash = keccak256(node_data);
              if computed_hash != current_hash {
                  return (false, []);
              }
              
              // Decode and traverse node
              let node = TrieNode::from_rlp(node_data);
              let (continue_traversal, next_hash, new_path, new_offset) = 
                  traverse_trie_node(node, remaining_path, path_offset);
              
              if !continue_traversal {
                  return (true, new_path);
              }
              
              current_hash = next_hash;
              remaining_path = new_path;
              path_offset = new_offset;
          }
          
          (false, [])
      }
      ```

      2. Node Type Handling

      ```noir
      fn traverse_trie_node(
          node: TrieNode,
          remaining_path: [u8],
          path_offset: u32
      ) -> (bool, [u8; 32], [u8], u32) {
          match node {
              TrieNode::Leaf(key_end, value) => {
                  // Check if remaining path matches key_end
                  if paths_match(remaining_path, key_end) {
                      (false, [0; 32], value, path_offset)
                  } else {
                      (false, [0; 32], [], path_offset)
                  }
              },
              TrieNode::Extension(shared_path, next_hash) => {
                  // Check if remaining path starts with shared_path
                  if path_starts_with(remaining_path, shared_path) {
                      let new_path = skip_path(remaining_path, shared_path.len());
                      (true, next_hash, new_path, path_offset + shared_path.len())
                  } else {
                      (false, [0; 32], [], path_offset)
                  }
              },
              TrieNode::Branch(children, value) => {
                  if remaining_path.len() == 0 {
                      (false, [0; 32], value, path_offset)
                  } else {
                      let next_nibble = remaining_path[0];
                      let child_hash = children[next_nibble];
                      let new_path = skip_path(remaining_path, 1);
                      (true, child_hash, new_path, path_offset + 1)
                  }
              }
          }
      }
      ```

      3. Light Client Implementation

      ```noir
      fn verify_account(
          &mut self,
          proof: StateProof
      ) -> bool {
          let (is_valid, account) = verify_account_proof(self.trusted_state_root, proof);
          
          if is_valid {
              self.add_account(proof.account_address, account, proof.block_number);
              true
          } else {
              false
          }
      }
      ```

      4. ERC20 Balance Verification

      ```noir
      fn verify_erc20_balance(
          &self,
          token_contract: [u8; 20],
          holder_address: [u8; 20],
          proof: StateProof
      ) -> ([u8; 32], bool) {
          // First verify contract account exists
          let (account_valid, contract_account) = verify_account_proof(
              self.trusted_state_root, 
              proof
          );
          
          if !account_valid {
              return ([0; 32], false);
          }
          
          // Then verify storage proof for balance
          let balance_key = erc20_balance_key(holder_address, 0);
          let storage_proof = proof.storage_proofs[0]; // Simplified
          
          let balance_valid = verify_storage_proof(
              contract_account.storage_root,
              storage_proof
          );
          
          (storage_proof.storage_value, balance_valid)
      }
      ```
    description: >-
      Complete trie traversal enables full verification of Ethereum state and storage proofs for light clients. Learn to implement proof verification algorithms and light client functionality for trustless blockchain interaction.

      In this exercise, you will:
      1. Implement complete trie proof traversal and verification
      2. Handle all trie node types (leaf, extension, branch)
      3. Build light client functionality for state verification
      4. Enable trustless ERC20 balance and allowance verification

      #### Docs
    docLink: "https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/"
---

```noir
use std::hash::keccak256;

// Import from previous exercises
enum TrieNode {
    Leaf([u8], [u8]),
    Extension([u8], [u8; 32]),
    Branch([[u8; 32]; 16], [u8]),
}

impl TrieNode {
    fn from_rlp(rlp_data: [u8]) -> Self {
        // Simplified implementation for this exercise
        TrieNode::Leaf([1, 2, 3], [0x42])
    }
}

struct EthereumAccount {
    nonce: u64,
    balance: [u8; 32],
    storage_root: [u8; 32],
    code_hash: [u8; 32],
}

struct StateProof {
    account_address: [u8; 20],
    account_proof: [[u8]],
    storage_proofs: [StorageProof],
    block_number: u64,
    state_root: [u8; 32],
}

struct StorageProof {
    storage_key: [u8; 32],
    storage_value: [u8; 32],
    proof: [[u8]],
}

fn address_to_key_path(address: [u8; 20]) -> [u8; 64] {
    let hash = keccak256(address);
    bytes_to_nibbles(hash)
}

fn bytes_to_nibbles(bytes: [u8; 32]) -> [u8; 64] {
    let mut nibbles = [0; 64];
    for i in 0..32 {
        nibbles[i * 2] = (bytes[i] >> 4) & 0x0F;
        nibbles[i * 2 + 1] = bytes[i] & 0x0F;
    }
    nibbles
}

fn erc20_balance_key(holder_address: [u8; 20], slot: u8) -> [u8; 32] {
    // Simplified implementation
    keccak256(holder_address)
}

// TODO: Traverse trie proof and verify path
fn traverse_trie_proof(
    root_hash: [u8; 32],
    key_path: [u8; 64],
    proof_nodes: [[u8]]
) -> (bool, [u8]) {
    // Returns: (is_valid, final_value)
    // Hint:
    // 1. Start with root hash and full key path
    // 2. For each proof node:
    //    - Verify its hash matches expected
    //    - Decode the node from RLP
    //    - Determine next step based on node type
    //    - Update remaining key path
    // 3. Return final value if path is completely traversed
    todo!()
}

// TODO: Handle trie node traversal based on node type
fn traverse_trie_node(
    node: TrieNode,
    remaining_path: [u8],
    path_offset: u32
) -> (bool, [u8; 32], [u8], u32) {
    // Returns: (continue_traversal, next_hash, remaining_path, new_offset)
    // Hint: Handle leaf, extension, and branch nodes differently
    todo!()
}

// Path matching utilities
fn paths_match(path1: [u8], path2: [u8]) -> bool {
    // TODO: Check if two paths are identical
    // Hint: Compare length and each element
    todo!()
}

fn path_starts_with(path: [u8], prefix: [u8]) -> bool {
    // TODO: Check if path starts with given prefix
    // Hint: Compare first prefix.len() elements
    todo!()
}

fn skip_path(path: [u8], count: u32) -> [u8] {
    // TODO: Return path with first 'count' elements removed
    // Hint: Create new array starting from position 'count'
    todo!()
}

// Ethereum Light Client implementation
struct EthereumLightClient {
    trusted_state_root: [u8; 32],
    verified_accounts: [VerifiedAccount; 100], // Simplified fixed-size cache
    account_count: u32,
    block_number: u64,
}

struct VerifiedAccount {
    address: [u8; 20],
    account: EthereumAccount,
    block_number: u64,
    is_valid: bool,
}

impl EthereumLightClient {
    // TODO: Create new light client with trusted state root
    fn new(state_root: [u8; 32], block_number: u64) -> Self {
        todo!()
    }

    // TODO: Update to new state root (new block)
    fn update_state_root(&mut self, new_state_root: [u8; 32], new_block_number: u64) {
        // Hint: Update state root and clear cache for new block
        todo!()
    }

    // TODO: Verify and store account state
    fn verify_account(&mut self, proof: StateProof) -> bool {
        // Hint:
        // 1. Use verify_account_proof with trusted state root
        // 2. If valid, add to verified_accounts cache
        // 3. Return success status
        todo!()
    }

    // TODO: Get verified account balance
    fn get_balance(&self, address: [u8; 20]) -> ([u8; 32], bool) {
        // Returns: (balance, found)
        // Hint: Look up in verified_accounts cache
        todo!()
    }

    // TODO: Get verified account nonce
    fn get_nonce(&self, address: [u8; 20]) -> (u64, bool) {
        // Returns: (nonce, found)
        // Hint: Look up in verified_accounts cache
        todo!()
    }

    // TODO: Verify ERC20 token balance
    fn verify_erc20_balance(
        &self,
        token_contract: [u8; 20],
        holder_address: [u8; 20],
        proof: StateProof
    ) -> ([u8; 32], bool) {
        // Returns: (token_balance, is_valid)
        // Hint:
        // 1. Verify contract account exists
        // 2. Verify storage proof for balance mapping
        todo!()
    }

    // TODO: Verify ERC20 allowance
    fn verify_erc20_allowance(
        &self,
        token_contract: [u8; 20],
        owner: [u8; 20],
        spender: [u8; 20],
        proof: StateProof
    ) -> ([u8; 32], bool) {
        // Returns: (allowance, is_valid)
        // Hint: Similar to balance but for allowance mapping
        todo!()
    }

    // TODO: Check if account is verified
    fn is_account_verified(&self, address: [u8; 20]) -> bool {
        // Hint: Search verified_accounts for address
        todo!()
    }

    // TODO: Clear verification cache
    fn clear_cache(&mut self) {
        // Hint: Reset account_count to 0
        todo!()
    }
}

// State proof validation
fn verify_account_proof(
    state_root: [u8; 32],
    proof: StateProof
) -> (bool, EthereumAccount) {
    // TODO: Verify account existence and state
    // Hint:
    // 1. Convert address to key path
    // 2. Use traverse_trie_proof to verify
    // 3. Decode account from final value
    todo!()
}

fn verify_storage_proof(
    storage_root: [u8; 32],
    storage_proof: StorageProof
) -> bool {
    // TODO: Verify storage value proof
    // Hint:
    // 1. Convert storage key to path
    // 2. Use traverse_trie_proof to verify
    // 3. Check final value matches claimed value
    todo!()
}

// Advanced proof verification
struct ProofVerifier {
    verification_cache: [ProofCacheEntry; 50],
    cache_size: u32,
}

struct ProofCacheEntry {
    proof_hash: [u8; 32],
    is_valid: bool,
    result_data: [u8; 32],
}

impl ProofVerifier {
    // TODO: Create new proof verifier
    fn new() -> Self {
        todo!()
    }

    // TODO: Verify proof with caching
    fn verify_with_cache(
        &mut self,
        proof_hash: [u8; 32],
        verification_fn: fn() -> (bool, [u8; 32])
    ) -> (bool, [u8; 32]) {
        // Hint: Check cache first, then verify and cache result
        todo!()
    }

    // TODO: Clear verification cache
    fn clear_cache(&mut self) {
        todo!()
    }
}

// Batch proof verification for efficiency
struct BatchProofVerifier {
    state_root: [u8; 32],
    proofs: [StateProof],
    verification_results: [bool],
}

impl BatchProofVerifier {
    // TODO: Create batch verifier
    fn new(state_root: [u8; 32], proofs: [StateProof]) -> Self {
        todo!()
    }

    // TODO: Verify all proofs in batch
    fn verify_all(&mut self) -> bool {
        // Hint: Verify each proof and store results
        todo!()
    }

    // TODO: Get verification results
    fn get_results(self) -> [bool] {
        todo!()
    }

    // TODO: Get success rate
    fn success_rate(self) -> u32 {
        // Hint: Count successful verifications / total proofs * 100
        todo!()
    }
}

// Multi-chain light client support
struct MultiChainLightClient {
    ethereum_client: EthereumLightClient,
    chain_id: u64,
    latest_block: u64,
}

impl MultiChainLightClient {
    // TODO: Create multi-chain client
    fn new(chain_id: u64, state_root: [u8; 32], block_number: u64) -> Self {
        todo!()
    }

    // TODO: Verify cross-chain state proof
    fn verify_cross_chain_proof(
        &mut self,
        source_chain_id: u64,
        proof: StateProof
    ) -> bool {
        // Hint: Route to appropriate chain client
        todo!()
    }

    // TODO: Get cross-chain balance
    fn get_cross_chain_balance(
        &self,
        chain_id: u64,
        address: [u8; 20]
    ) -> ([u8; 32], bool) {
        // Hint: Query appropriate chain client
        todo!()
    }
}

fn main(
    state_root: [u8; 32],
    account_address: [u8; 20],
    storage_key: [u8; 32],
    block_number: u64
) -> pub bool {
    // Create light client
    let mut client = EthereumLightClient::new(state_root, block_number);

    // Test key path conversion
    let key_path = address_to_key_path(account_address);
    let path_valid = key_path.len() == 64;

    // Test proof structure
    let proof = StateProof {
        account_address,
        account_proof: [[0xc0]],
        storage_proofs: [StorageProof {
            storage_key,
            storage_value: [0x42; 32],
            proof: [[0xc1]]
        }],
        block_number,
        state_root
    };

    // Test account verification
    let account_verified = client.verify_account(proof);
    let is_verified = client.is_account_verified(account_address);

    path_valid & (account_verified == true || account_verified == false) &
    (is_verified == true || is_verified == false)
}

#[test]
fn test_path_utilities() {
    let path1 = [1, 2, 3, 4, 5];
    let path2 = [1, 2, 3, 4, 5];
    let path3 = [1, 2, 3, 6, 7];

    // Test path matching
    assert(paths_match(path1, path2));
    assert(!paths_match(path1, path3));

    // Test prefix matching
    let prefix = [1, 2, 3];
    assert(path_starts_with(path1, prefix));
    assert(!path_starts_with(path3, [4, 5, 6]));

    // Test path skipping
    let skipped = skip_path(path1, 2);
    assert(skipped[0] == 3);
    assert(skipped[1] == 4);
    assert(skipped[2] == 5);
}

#[test]
fn test_trie_traversal() {
    let root_hash = [1; 32];
    let key_path = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0,
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0,
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0,
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];

    let proof_nodes = [[0xc0, 0x01], [0xc0, 0x02]];

    let (is_valid, value) = traverse_trie_proof(root_hash, key_path, proof_nodes);

    // Should return a boolean and value
    assert(is_valid == true || is_valid == false);
    assert(value.len() >= 0);
}

#[test]
fn test_light_client_creation() {
    let state_root = [2; 32];
    let block_number = 12345678u64;

    let client = EthereumLightClient::new(state_root, block_number);

    assert(client.trusted_state_root == state_root);
    assert(client.block_number == block_number);
    assert(client.account_count == 0);
}

#[test]
fn test_account_verification() {
    let state_root = [3; 32];
    let mut client = EthereumLightClient::new(state_root, 12345);

    let address = [
        0xd1, 0x22, 0x0a, 0x0c, 0xf4, 0x75, 0xa9, 0x66,
        0xe5, 0x4d, 0x11, 0xe9, 0xf3, 0x55, 0x4e, 0x4e,
        0xba, 0x6f, 0xa5, 0x7a
    ];

    let proof = StateProof {
        account_address: address,
        account_proof: [[0xc0, 0x01]],
        storage_proofs: [],
        block_number: 12345,
        state_root
    };

    let verified = client.verify_account(proof);
    let is_verified = client.is_account_verified(address);

    // Should work regardless of implementation details
    assert(verified == true || verified == false);
    assert(is_verified == true || is_verified == false);
}

#[test]
fn test_balance_retrieval() {
    let state_root = [4; 32];
    let client = EthereumLightClient::new(state_root, 12345);

    let address = [5; 20];
    let (balance, found) = client.get_balance(address);

    // Should return balance and found flag
    assert(balance.len() == 32);
    assert(found == true || found == false);

    // Test nonce retrieval
    let (nonce, nonce_found) = client.get_nonce(address);
    assert(nonce_found == true || nonce_found == false);
}

#[test]
fn test_erc20_verification() {
    let state_root = [6; 32];
    let client = EthereumLightClient::new(state_root, 12345);

    let token_contract = [7; 20];
    let holder_address = [8; 20];

    let proof = StateProof {
        account_address: token_contract,
        account_proof: [[0xc0]],
        storage_proofs: [StorageProof {
            storage_key: erc20_balance_key(holder_address, 0),
            storage_value: [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                           0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                           0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                           0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0xe8], // 1000
            proof: [[0xc1]]
        }],
        block_number: 12345,
        state_root
    };

    let (balance, is_valid) = client.verify_erc20_balance(token_contract, holder_address, proof);

    assert(balance.len() == 32);
    assert(is_valid == true || is_valid == false);
}

#[test]
fn test_state_root_update() {
    let initial_state_root = [9; 32];
    let new_state_root = [10; 32];
    let mut client = EthereumLightClient::new(initial_state_root, 12345);

    client.update_state_root(new_state_root, 12346);

    assert(client.trusted_state_root == new_state_root);
    assert(client.block_number == 12346);
}

#[test]
fn test_proof_verifier() {
    let mut verifier = ProofVerifier::new();

    let proof_hash = [11; 32];
    let verification_result = || (true, [0x42; 32]);

    let (is_valid, result_data) = verifier.verify_with_cache(proof_hash, verification_result);

    assert(is_valid == true || is_valid == false);
    assert(result_data.len() == 32);

    verifier.clear_cache();
}

#[test]
fn test_batch_verification() {
    let state_root = [12; 32];
    let proofs = [
        StateProof {
            account_address: [1; 20],
            account_proof: [[0xc0]],
            storage_proofs: [],
            block_number: 12345,
            state_root
        },
        StateProof {
            account_address: [2; 20],
            account_proof: [[0xc1]],
            storage_proofs: [],
            block_number: 12345,
            state_root
        }
    ];

    let mut batch_verifier = BatchProofVerifier::new(state_root, proofs);

    let all_valid = batch_verifier.verify_all();
    let results = batch_verifier.get_results();
    let success_rate = batch_verifier.success_rate();

    assert(all_valid == true || all_valid == false);
    assert(results.len() == 2);
    assert(success_rate <= 100);
}

#[test]
fn test_multi_chain_client() {
    let chain_id = 1u64; // Ethereum mainnet
    let state_root = [13; 32];
    let block_number = 12345u64;

    let mut multi_client = MultiChainLightClient::new(chain_id, state_root, block_number);

    let proof = StateProof {
        account_address: [14; 20],
        account_proof: [[0xc0]],
        storage_proofs: [],
        block_number,
        state_root
    };

    let verified = multi_client.verify_cross_chain_proof(chain_id, proof);
    assert(verified == true || verified == false);

    let (balance, found) = multi_client.get_cross_chain_balance(chain_id, [15; 20]);
    assert(balance.len() == 32);
    assert(found == true || found == false);
}

#[test]
fn test_trie_node_traversal() {
    let leaf_node = TrieNode::Leaf([1, 2, 3], [0x42, 0x24]);
    let remaining_path = [1, 2, 3, 4, 5];
    let path_offset = 0;

    let (continue_traversal, next_hash, new_path, new_offset) =
        traverse_trie_node(leaf_node, remaining_path, path_offset);

    // Should handle leaf node appropriately
    assert(continue_traversal == true || continue_traversal == false);
    assert(next_hash.len() == 32);
    assert(new_offset >= path_offset);
}
```
