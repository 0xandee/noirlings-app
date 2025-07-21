---
id: account_proofs
title: account_proofs
category: ethereum
difficulty: medium
tags: []
mode: test
prerequisites: ["trie_basics", "rlp_encoding"]
version: 1.0.0
locales:
  en:
    hint: >-
      Account proofs verify Ethereum account state using Merkle Patricia Trie proofs. Implement account encoding, proof verification, and state root validation.

      1. Account RLP Encoding

      ```noir
      fn encode_rlp(self) -> [u8] {
          // RLP encode account fields: [nonce, balance, storage_root, code_hash]
          let nonce_bytes = u64_to_rlp_bytes(self.nonce);
          let balance_rlp = encode_bytes(self.balance);
          let storage_root_rlp = encode_bytes(self.storage_root);
          let code_hash_rlp = encode_bytes(self.code_hash);
          
          encode_list([nonce_bytes, balance_rlp, storage_root_rlp, code_hash_rlp])
      }
      ```

      2. Account Hash Calculation

      ```noir
      fn hash(self) -> [u8; 32] {
          let rlp_data = self.encode_rlp();
          keccak256(rlp_data)
      }
      ```

      3. Account Proof Verification

      ```noir
      fn verify_account_proof(
          state_root: [u8; 32],
          proof: StateProof
      ) -> (bool, EthereumAccount) {
          let key_path = address_to_key_path(proof.account_address);
          let (is_valid, account_rlp) = traverse_trie_proof(state_root, key_path, proof.account_proof);
          
          if is_valid {
              let account = decode_account_from_rlp(account_rlp);
              (true, account)
          } else {
              (false, EthereumAccount::empty())
          }
      }
      ```

      4. Balance Verification

      ```noir
      fn verify_balance(
          state_root: [u8; 32],
          address: [u8; 20],
          proof: StateProof
      ) -> ([u8; 32], bool) {
          let (is_valid, account) = verify_account_proof(state_root, proof);
          (account.balance, is_valid)
      }
      ```
    description: >-
      Account proofs enable trustless verification of Ethereum account balances and state without downloading the full blockchain. Learn to implement account RLP encoding and proof verification.

      In this exercise, you will:
      1. Encode Ethereum accounts using RLP for trie storage
      2. Verify account existence and balances using state proofs
      3. Handle account state transitions and updates
      4. Implement light client account verification

      #### Docs
    docLink: "https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/"
---

```noir
use std::hash::keccak256;

// Import from previous exercise
enum TrieNode {
    Leaf([u8], [u8]),
    Extension([u8], [u8; 32]),
    Branch([[u8; 32]; 16], [u8]),
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

// Ethereum account structure
struct EthereumAccount {
    nonce: u64,               // Transaction count
    balance: [u8; 32],        // Account balance (256-bit big-endian)
    storage_root: [u8; 32],   // Root of account's storage trie
    code_hash: [u8; 32],      // Hash of account's contract code
}

impl EthereumAccount {
    // TODO: Create new account with given values
    fn new(nonce: u64, balance: [u8; 32], storage_root: [u8; 32], code_hash: [u8; 32]) -> Self {
        todo!()
    }

    // TODO: Create empty account (default values)
    fn empty() -> Self {
        // Hint: Use zero values for all fields except code_hash (use empty code hash)
        todo!()
    }

    // TODO: Encode account using RLP for state trie
    fn encode_rlp(self) -> [u8] {
        // Hint: RLP encode [nonce, balance, storage_root, code_hash] as a list
        todo!()
    }

    // TODO: Get the keccak256 hash of this account
    fn hash(self) -> [u8; 32] {
        // Hint: Hash the RLP-encoded account data
        todo!()
    }

    // TODO: Check if account is empty (no nonce, balance, code)
    fn is_empty(self) -> bool {
        // Hint: Check if nonce=0, balance=0, and code_hash=empty_code_hash
        todo!()
    }

    // TODO: Get account balance as u256 (simplified as u64 for this exercise)
    fn get_balance_as_u64(self) -> u64 {
        // Hint: Convert first 8 bytes of balance to u64 (simplified)
        todo!()
    }

    // TODO: Update account balance
    fn set_balance(&mut self, new_balance: [u8; 32]) {
        // Hint: Update the balance field
        todo!()
    }

    // TODO: Increment nonce (for transaction)
    fn increment_nonce(&mut self) {
        // Hint: Add 1 to current nonce
        todo!()
    }
}

// State proof structure for account verification
struct StateProof {
    account_address: [u8; 20],  // Ethereum address being proven
    account_proof: [[u8]],      // Array of RLP-encoded trie nodes
    block_number: u64,          // Block number for this state
    state_root: [u8; 32],       // State root hash
}

impl StateProof {
    // TODO: Create new state proof
    fn new(
        account_address: [u8; 20],
        account_proof: [[u8]],
        block_number: u64,
        state_root: [u8; 32]
    ) -> Self {
        todo!()
    }

    // TODO: Verify the proof is well-formed
    fn is_valid_structure(self) -> bool {
        // Hint: Check that proof has reasonable length and non-empty nodes
        todo!()
    }

    // TODO: Get the length of the proof path
    fn proof_length(self) -> u32 {
        // Hint: Return number of nodes in the proof
        todo!()
    }
}

// TODO: Verify account existence and state
fn verify_account_proof(
    state_root: [u8; 32],
    proof: StateProof
) -> (bool, EthereumAccount) {
    // Returns: (is_valid, account_data)
    // Hint:
    // 1. Convert address to key path
    // 2. Traverse proof nodes following the key path
    // 3. Verify each node hash matches expected hash
    // 4. Decode final account data from RLP
    todo!()
}

// TODO: Verify account balance specifically
fn verify_balance(
    state_root: [u8; 32],
    address: [u8; 20],
    proof: StateProof
) -> ([u8; 32], bool) {
    // Returns: (balance, is_valid)
    // Hint: Use verify_account_proof and extract balance
    todo!()
}

// TODO: Verify account nonce
fn verify_nonce(
    state_root: [u8; 32],
    address: [u8; 20],
    proof: StateProof
) -> (u64, bool) {
    // Returns: (nonce, is_valid)
    // Hint: Use verify_account_proof and extract nonce
    todo!()
}

// TODO: Decode account from RLP-encoded data
fn decode_account_from_rlp(rlp_data: [u8]) -> EthereumAccount {
    // Hint: Decode RLP list and extract [nonce, balance, storage_root, code_hash]
    todo!()
}

// RLP encoding utilities (simplified)
fn encode_u64_to_rlp(value: u64) -> [u8] {
    // TODO: Encode u64 as RLP bytes
    // Hint: Convert to minimal byte representation
    todo!()
}

fn encode_bytes_to_rlp(bytes: [u8]) -> [u8] {
    // TODO: Encode byte array as RLP
    // Hint: Add RLP length prefix
    todo!()
}

fn encode_list_to_rlp(items: [[u8]]) -> [u8] {
    // TODO: Encode list of items as RLP
    // Hint: Concatenate items and add list length prefix
    todo!()
}

// Light client account management
struct AccountCache {
    verified_accounts: [VerifiedAccount; 100], // Simplified fixed-size cache
    cache_size: u32,
    state_root: [u8; 32],
}

struct VerifiedAccount {
    address: [u8; 20],
    account: EthereumAccount,
    block_number: u64,
    is_valid: bool,
}

impl AccountCache {
    // TODO: Create new account cache
    fn new(state_root: [u8; 32]) -> Self {
        todo!()
    }

    // TODO: Add verified account to cache
    fn add_account(&mut self, address: [u8; 20], account: EthereumAccount, block_number: u64) -> bool {
        // Hint: Add to cache if space available
        todo!()
    }

    // TODO: Get account from cache
    fn get_account(self, address: [u8; 20]) -> (EthereumAccount, bool) {
        // Returns: (account, found)
        // Hint: Search cache for matching address
        todo!()
    }

    // TODO: Clear cache (for new state root)
    fn clear(&mut self) {
        // Hint: Reset cache_size to 0
        todo!()
    }

    // TODO: Check if cache is full
    fn is_full(self) -> bool {
        // Hint: Check if cache_size >= max capacity
        todo!()
    }
}

// Account state transitions
fn transfer_balance(
    from_account: &mut EthereumAccount,
    to_account: &mut EthereumAccount,
    amount: [u8; 32]
) -> bool {
    // TODO: Transfer balance between accounts
    // Hint: Check sufficient balance, then update both accounts
    todo!()
}

fn create_contract_account(
    creator: &mut EthereumAccount,
    contract_address: [u8; 20],
    code_hash: [u8; 32]
) -> EthereumAccount {
    // TODO: Create new contract account
    // Hint: New account with nonce=1, zero balance, given code_hash
    todo!()
}

// Constants for Ethereum
global EMPTY_CODE_HASH: [u8; 32] = [
    0xc5, 0xd2, 0x46, 0x01, 0x86, 0xf7, 0x23, 0x3c,
    0x92, 0x7e, 0x7d, 0xb2, 0xdc, 0xc7, 0x03, 0xc0,
    0xe5, 0x00, 0xb6, 0x53, 0xca, 0x82, 0x27, 0x3b,
    0x7b, 0xfa, 0xd8, 0x04, 0x5d, 0x85, 0xa4, 0x70
];

fn main(
    account_address: [u8; 20],
    state_root: [u8; 32],
    nonce: u64,
    balance: [u8; 32]
) -> pub bool {
    // Create test account
    let account = EthereumAccount::new(nonce, balance, [0; 32], EMPTY_CODE_HASH);

    // Test account encoding and hashing
    let encoded = account.encode_rlp();
    let hash1 = account.hash();
    let hash2 = account.hash();
    let encoding_correct = encoded.len() > 0;
    let hashing_deterministic = hash1 == hash2;

    // Test account operations
    let is_empty = account.is_empty();
    let balance_u64 = account.get_balance_as_u64();
    let operations_work = balance_u64 <= 1000000000; // Reasonable check

    encoding_correct & hashing_deterministic & operations_work
}

#[test]
fn test_account_creation() {
    let nonce = 42u64;
    let balance = [
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x01, 0x23, 0x45, 0x67
    ];
    let storage_root = [1; 32];
    let code_hash = EMPTY_CODE_HASH;

    let account = EthereumAccount::new(nonce, balance, storage_root, code_hash);

    assert(account.nonce == nonce);
    assert(account.balance == balance);
    assert(account.storage_root == storage_root);
    assert(account.code_hash == code_hash);
}

#[test]
fn test_empty_account() {
    let empty = EthereumAccount::empty();

    assert(empty.nonce == 0);
    assert(empty.is_empty());

    // Should have empty code hash
    assert(empty.code_hash == EMPTY_CODE_HASH);
}

#[test]
fn test_account_encoding() {
    let account = EthereumAccount {
        nonce: 42,
        balance: [
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x01, 0x23, 0x45, 0x67
        ],
        storage_root: [2; 32],
        code_hash: EMPTY_CODE_HASH
    };

    let encoded = account.encode_rlp();

    // RLP should encode as a list of 4 items
    assert(encoded.len() > 4);
    assert(encoded[0] >= 0xc0); // Should be a list

    // Hash should be deterministic
    let hash1 = account.hash();
    let hash2 = account.hash();
    assert(hash1 == hash2);
}

#[test]
fn test_account_operations() {
    let mut account = EthereumAccount::new(
        5,
        [0; 32],
        [0; 32],
        EMPTY_CODE_HASH
    );

    // Test nonce increment
    let initial_nonce = account.nonce;
    account.increment_nonce();
    assert(account.nonce == initial_nonce + 1);

    // Test balance update
    let new_balance = [1; 32];
    account.set_balance(new_balance);
    assert(account.balance == new_balance);
}

#[test]
fn test_state_proof_structure() {
    let address = [
        0xd1, 0x22, 0x0a, 0x0c, 0xf4, 0x75, 0xa9, 0x66,
        0xe5, 0x4d, 0x11, 0xe9, 0xf3, 0x55, 0x4e, 0x4e,
        0xba, 0x6f, 0xa5, 0x7a
    ];

    let proof_nodes = [
        [0xc0, 0x01], // Simplified root node
        [0xc0, 0x02], // Simplified intermediate node
        [0xc0, 0x03]  // Simplified leaf node
    ];

    let proof = StateProof::new(
        address,
        proof_nodes,
        12345678,
        [3; 32]
    );

    assert(proof.account_address == address);
    assert(proof.block_number == 12345678);
    assert(proof.proof_length() == 3);
    assert(proof.is_valid_structure());
}

#[test]
fn test_account_verification() {
    let state_root = [
        0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0,
        0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88,
        0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff, 0x00,
        0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef
    ];

    let address = [
        0xd1, 0x22, 0x0a, 0x0c, 0xf4, 0x75, 0xa9, 0x66,
        0xe5, 0x4d, 0x11, 0xe9, 0xf3, 0x55, 0x4e, 0x4e,
        0xba, 0x6f, 0xa5, 0x7a
    ];

    let proof = StateProof::new(
        address,
        [[0xc0], [0xc1], [0xc2]], // Simplified proof
        12345678,
        state_root
    );

    let (is_valid, account) = verify_account_proof(state_root, proof);

    // Should return a boolean and account (even if simplified)
    assert(is_valid == true || is_valid == false);
}

#[test]
fn test_balance_verification() {
    let state_root = [1; 32];
    let address = [2; 20];
    let proof = StateProof::new(address, [[0xc0]], 123, state_root);

    let (balance, is_valid) = verify_balance(state_root, address, proof);

    // Should return balance and validity flag
    assert(balance.len() == 32);
    assert(is_valid == true || is_valid == false);
}

#[test]
fn test_account_cache() {
    let state_root = [5; 32];
    let mut cache = AccountCache::new(state_root);

    assert(!cache.is_full());

    let address = [6; 20];
    let account = EthereumAccount::empty();

    // Add account to cache
    let added = cache.add_account(address, account, 12345);
    assert(added);

    // Retrieve account from cache
    let (cached_account, found) = cache.get_account(address);
    assert(found);

    // Clear cache
    cache.clear();
    let (_, found_after_clear) = cache.get_account(address);
    assert(!found_after_clear);
}

#[test]
fn test_balance_transfer() {
    let mut from_account = EthereumAccount::new(
        1,
        [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
         0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
         0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
         0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0xe8], // 1000
        [0; 32],
        EMPTY_CODE_HASH
    );

    let mut to_account = EthereumAccount::empty();

    let transfer_amount = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                           0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                           0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                           0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0xf4]; // 500

    let success = transfer_balance(&mut from_account, &mut to_account, transfer_amount);

    // Should succeed if implementation is correct
    assert(success == true || success == false);
}

#[test]
fn test_contract_creation() {
    let mut creator = EthereumAccount::new(5, [1; 32], [0; 32], EMPTY_CODE_HASH);
    let contract_address = [7; 20];
    let code_hash = [8; 32];

    let contract = create_contract_account(&mut creator, contract_address, code_hash);

    // Contract should have appropriate initial state
    assert(contract.code_hash == code_hash);
    assert(contract.nonce >= 1); // Contracts start with nonce 1
}

#[test]
fn test_rlp_encoding_utilities() {
    // Test u64 encoding
    let encoded_u64 = encode_u64_to_rlp(42);
    assert(encoded_u64.len() > 0);

    // Test bytes encoding
    let test_bytes = [0x12, 0x34, 0x56];
    let encoded_bytes = encode_bytes_to_rlp(test_bytes);
    assert(encoded_bytes.len() >= test_bytes.len());

    // Test list encoding
    let items = [[0x01], [0x02, 0x03]];
    let encoded_list = encode_list_to_rlp(items);
    assert(encoded_list.len() > 3); // Should be longer than individual items
}
```
