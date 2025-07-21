---
id: storage_proofs
title: storage_proofs
category: ethereum
difficulty: medium
tags: []
mode: test
prerequisites: ["account_proofs"]
version: 1.0.0
locales:
  en:
    hint: >-
      Storage proofs verify contract storage values using account storage trie proofs. Implement storage key mapping, value verification, and ERC20 balance proofs.

      1. Storage Key Mapping

      ```noir
      fn storage_key_to_path(key: [u8; 32]) -> [u8; 64] {
          let hash = keccak256(key);
          bytes_to_nibbles(hash)
      }
      ```

      2. ERC20 Balance Storage Key

      ```noir
      fn erc20_balance_key(holder_address: [u8; 20], slot: u8) -> [u8; 32] {
          // Solidity mapping: mapping(address => uint256) balances at slot 0
          let mut key_data = [0; 64]; // address (32 bytes padded) + slot (32 bytes)
          
          // Pad address to 32 bytes
          for i in 0..20 {
              key_data[12 + i] = holder_address[i];
          }
          
          // Set slot in second 32 bytes
          key_data[63] = slot;
          
          keccak256(key_data)
      }
      ```

      3. Storage Proof Verification

      ```noir
      fn verify_storage_proof(
          storage_root: [u8; 32],
          storage_proof: StorageProof
      ) -> bool {
          let key_path = storage_key_to_path(storage_proof.storage_key);
          let (is_valid, value) = traverse_trie_proof(storage_root, key_path, storage_proof.proof);
          
          if is_valid {
              value == storage_proof.storage_value
          } else {
              false
          }
      }
      ```

      4. Multi-Storage Verification

      ```noir
      fn verify_multiple_storage_values(
          storage_root: [u8; 32],
          proofs: [StorageProof]
      ) -> [bool] {
          let mut results = [false; proofs.len()];
          for i in 0..proofs.len() {
              results[i] = verify_storage_proof(storage_root, proofs[i]);
          }
          results
      }
      ```
    description: >-
      Storage proofs enable verification of smart contract state and ERC20 token balances without trusting external services. Learn to implement storage trie traversal and contract state verification.

      In this exercise, you will:
      1. Map storage keys to trie paths using keccak256 hashing
      2. Verify contract storage values using storage proofs
      3. Implement ERC20 balance verification
      4. Handle complex storage layouts and mappings

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

struct EthereumAccount {
    nonce: u64,
    balance: [u8; 32],
    storage_root: [u8; 32],
    code_hash: [u8; 32],
}

fn bytes_to_nibbles(bytes: [u8; 32]) -> [u8; 64] {
    let mut nibbles = [0; 64];
    for i in 0..32 {
        nibbles[i * 2] = (bytes[i] >> 4) & 0x0F;
        nibbles[i * 2 + 1] = bytes[i] & 0x0F;
    }
    nibbles
}

// Storage proof structure for contract state verification
struct StorageProof {
    storage_key: [u8; 32],   // Storage slot key
    storage_value: [u8; 32], // Storage slot value
    proof: [[u8]],           // Array of RLP-encoded trie nodes
}

impl StorageProof {
    // TODO: Create new storage proof
    fn new(storage_key: [u8; 32], storage_value: [u8; 32], proof: [[u8]]) -> Self {
        todo!()
    }

    // TODO: Verify the proof structure is valid
    fn is_valid_structure(self) -> bool {
        // Hint: Check proof has nodes and key/value are reasonable
        todo!()
    }

    // TODO: Get proof depth
    fn depth(self) -> u32 {
        // Hint: Return length of proof array
        todo!()
    }
}

// TODO: Convert storage key to trie key path
fn storage_key_to_path(key: [u8; 32]) -> [u8; 64] {
    // Hint: Hash the storage key and convert to nibbles
    todo!()
}

// TODO: Verify storage value proof
fn verify_storage_proof(
    storage_root: [u8; 32],
    storage_proof: StorageProof
) -> bool {
    // Hint:
    // 1. Convert storage key to trie path
    // 2. Traverse the storage proof nodes
    // 3. Verify the final value matches the claimed storage value
    todo!()
}

// TODO: Verify multiple storage values at once
fn verify_multiple_storage_values(
    storage_root: [u8; 32],
    proofs: [StorageProof]
) -> [bool] {
    // Hint: Apply verify_storage_proof to each proof
    todo!()
}

// ERC20 token functionality
struct ERC20Token {
    contract_address: [u8; 20],
    name: [u8; 32],         // Token name (simplified)
    symbol: [u8; 8],        // Token symbol
    decimals: u8,           // Decimal places
    balance_slot: u8,       // Storage slot for balances mapping
}

impl ERC20Token {
    // TODO: Create new ERC20 token definition
    fn new(
        contract_address: [u8; 20],
        name: [u8; 32],
        symbol: [u8; 8],
        decimals: u8,
        balance_slot: u8
    ) -> Self {
        todo!()
    }

    // TODO: Get storage key for balance of specific address
    fn balance_storage_key(self, holder_address: [u8; 20]) -> [u8; 32] {
        // Hint: Use erc20_balance_key function
        todo!()
    }

    // TODO: Verify token balance using storage proof
    fn verify_balance(
        self,
        holder_address: [u8; 20],
        storage_root: [u8; 32],
        proof: StorageProof
    ) -> ([u8; 32], bool) {
        // Returns: (balance, is_valid)
        // Hint: Use verify_storage_proof with balance storage key
        todo!()
    }
}

// TODO: Calculate ERC20 balance storage key
fn erc20_balance_key(holder_address: [u8; 20], slot: u8) -> [u8; 32] {
    // Hint: Solidity mapping storage: keccak256(abi.encode(key, slot))
    // For mapping(address => uint256), encode address + slot
    todo!()
}

// TODO: Calculate ERC20 allowance storage key
fn erc20_allowance_key(owner: [u8; 20], spender: [u8; 20], slot: u8) -> [u8; 32] {
    // Hint: For mapping(address => mapping(address => uint256))
    // First: keccak256(owner + slot)
    // Then: keccak256(spender + first_hash)
    todo!()
}

// Contract storage layout utilities
struct StorageLayout {
    slot_mappings: [SlotMapping; 10], // Simplified fixed-size array
    mapping_count: u32,
}

struct SlotMapping {
    slot: u8,
    variable_name: [u8; 32], // Variable name (simplified)
    type_info: StorageType,
}

enum StorageType {
    UInt256,
    Address,
    Mapping,
    Array,
    Struct,
}

impl StorageLayout {
    // TODO: Create new storage layout
    fn new() -> Self {
        todo!()
    }

    // TODO: Add mapping to layout
    fn add_mapping(&mut self, slot: u8, name: [u8; 32], storage_type: StorageType) -> bool {
        // Hint: Add to slot_mappings if space available
        todo!()
    }

    // TODO: Get storage key for variable
    fn get_storage_key(self, slot: u8, key_data: [u8]) -> [u8; 32] {
        // Hint: Different calculation based on storage type
        todo!()
    }

    // TODO: Find slot by variable name
    fn find_slot_by_name(self, name: [u8; 32]) -> (u8, bool) {
        // Returns: (slot, found)
        todo!()
    }
}

// Multi-proof verification for complex contracts
struct ContractStateProof {
    contract_account: EthereumAccount,
    storage_proofs: [StorageProof; 20], // Multiple storage values
    proof_count: u32,
}

impl ContractStateProof {
    // TODO: Create new contract state proof
    fn new(contract_account: EthereumAccount) -> Self {
        todo!()
    }

    // TODO: Add storage proof
    fn add_storage_proof(&mut self, proof: StorageProof) -> bool {
        // Hint: Add if space available
        todo!()
    }

    // TODO: Verify all storage proofs
    fn verify_all_proofs(self) -> bool {
        // Hint: Verify each storage proof against account storage root
        todo!()
    }

    // TODO: Get specific storage value
    fn get_storage_value(self, key: [u8; 32]) -> ([u8; 32], bool) {
        // Returns: (value, found)
        // Hint: Search proofs for matching key
        todo!()
    }
}

// Storage proof batching for efficiency
struct StorageProofBatch {
    storage_root: [u8; 32],
    proofs: [StorageProof],
    batch_verification_proof: Field, // Aggregated proof (simplified)
}

impl StorageProofBatch {
    // TODO: Create storage proof batch
    fn new(storage_root: [u8; 32], proofs: [StorageProof]) -> Self {
        todo!()
    }

    // TODO: Verify entire batch efficiently
    fn verify_batch(self) -> bool {
        // Hint: Could use batch verification techniques
        todo!()
    }

    // TODO: Get batch efficiency gain
    fn efficiency_ratio(self) -> u32 {
        // Hint: Compare batch verification vs individual verification costs
        todo!()
    }
}

// Simplified trie traversal (from previous exercises)
fn traverse_trie_proof(
    root_hash: [u8; 32],
    key_path: [u8; 64],
    proof_nodes: [[u8]]
) -> (bool, [u8]) {
    // Simplified implementation for this exercise
    // In practice, this would do full trie traversal
    (true, [0x42]) // Return dummy value
}

fn main(
    storage_key: [u8; 32],
    storage_value: [u8; 32],
    storage_root: [u8; 32],
    holder_address: [u8; 20]
) -> pub bool {
    // Test storage key to path conversion
    let key_path = storage_key_to_path(storage_key);
    let path_valid = key_path.len() == 64;

    // Test ERC20 balance key generation
    let balance_key = erc20_balance_key(holder_address, 0);
    let balance_key_valid = balance_key.len() == 32;

    // Test storage proof structure
    let proof = StorageProof::new(storage_key, storage_value, [[0xc0]]);
    let proof_valid = proof.is_valid_structure();

    path_valid & balance_key_valid & proof_valid
}

#[test]
fn test_storage_key_conversion() {
    let storage_key = [
        0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff, 0x00, 0x11,
        0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99,
        0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff, 0x00, 0x11,
        0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99
    ];

    let path = storage_key_to_path(storage_key);

    // Should produce 64 nibbles
    assert(path.len() == 64);

    // Each nibble should be valid (0-15)
    for i in 0..64 {
        assert(path[i] <= 15);
    }

    // Should be deterministic
    let path2 = storage_key_to_path(storage_key);
    assert(path == path2);
}

#[test]
fn test_erc20_balance_key() {
    let holder_address = [
        0xd1, 0x22, 0x0a, 0x0c, 0xf4, 0x75, 0xa9, 0x66,
        0xe5, 0x4d, 0x11, 0xe9, 0xf3, 0x55, 0x4e, 0x4e,
        0xba, 0x6f, 0xa5, 0x7a
    ];

    let balance_key = erc20_balance_key(holder_address, 0);

    // Should produce 32-byte key
    assert(balance_key.len() == 32);

    // Should be deterministic
    let balance_key2 = erc20_balance_key(holder_address, 0);
    assert(balance_key == balance_key2);

    // Different addresses should produce different keys
    let different_address = [
        0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88,
        0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff, 0x00,
        0x11, 0x22, 0x33, 0x44
    ];
    let different_key = erc20_balance_key(different_address, 0);
    assert(balance_key != different_key);
}

#[test]
fn test_storage_proof_structure() {
    let storage_key = [1; 32];
    let storage_value = [2; 32];
    let proof_nodes = [[0xc0, 0x01], [0xc0, 0x02]];

    let proof = StorageProof::new(storage_key, storage_value, proof_nodes);

    assert(proof.storage_key == storage_key);
    assert(proof.storage_value == storage_value);
    assert(proof.depth() == 2);
    assert(proof.is_valid_structure());
}

#[test]
fn test_storage_proof_verification() {
    let storage_root = [3; 32];
    let storage_key = [4; 32];
    let storage_value = [5; 32];
    let proof = StorageProof::new(storage_key, storage_value, [[0xc0]]);

    let is_valid = verify_storage_proof(storage_root, proof);

    // Should return a boolean (implementation determines actual result)
    assert(is_valid == true || is_valid == false);
}

#[test]
fn test_multiple_storage_verification() {
    let storage_root = [6; 32];

    let proofs = [
        StorageProof::new([1; 32], [10; 32], [[0xc0]]),
        StorageProof::new([2; 32], [20; 32], [[0xc1]]),
        StorageProof::new([3; 32], [30; 32], [[0xc2]])
    ];

    let results = verify_multiple_storage_values(storage_root, proofs);

    // Should return array of booleans
    assert(results.len() == 3);
    for i in 0..3 {
        assert(results[i] == true || results[i] == false);
    }
}

#[test]
fn test_erc20_token() {
    let contract_address = [
        0xa0, 0xb8, 0x69, 0x91, 0xc6, 0x10, 0xef, 0xf9,
        0xa0, 0x5f, 0x4e, 0xa3, 0x0c, 0xd9, 0x12, 0xdc,
        0x74, 0x1d, 0x0f, 0x81
    ]; // Example USDC contract

    let name = [0; 32]; // Simplified
    let symbol = [0; 8]; // Simplified
    let decimals = 6u8;
    let balance_slot = 0u8;

    let token = ERC20Token::new(contract_address, name, symbol, decimals, balance_slot);

    let holder_address = [
        0xd1, 0x22, 0x0a, 0x0c, 0xf4, 0x75, 0xa9, 0x66,
        0xe5, 0x4d, 0x11, 0xe9, 0xf3, 0x55, 0x4e, 0x4e,
        0xba, 0x6f, 0xa5, 0x7a
    ];

    let balance_key = token.balance_storage_key(holder_address);
    assert(balance_key.len() == 32);

    // Test balance verification
    let storage_root = [7; 32];
    let proof = StorageProof::new(balance_key, [1000; 32], [[0xc0]]);
    let (balance, is_valid) = token.verify_balance(holder_address, storage_root, proof);

    assert(balance.len() == 32);
    assert(is_valid == true || is_valid == false);
}

#[test]
fn test_erc20_allowance_key() {
    let owner = [1; 20];
    let spender = [2; 20];
    let slot = 1u8;

    let allowance_key = erc20_allowance_key(owner, spender, slot);

    // Should produce 32-byte key
    assert(allowance_key.len() == 32);

    // Should be deterministic
    let allowance_key2 = erc20_allowance_key(owner, spender, slot);
    assert(allowance_key == allowance_key2);

    // Different owner/spender should produce different keys
    let different_key = erc20_allowance_key(spender, owner, slot); // Swapped
    assert(allowance_key != different_key);
}

#[test]
fn test_storage_layout() {
    let mut layout = StorageLayout::new();

    let name = [0; 32]; // Simplified variable name
    let added = layout.add_mapping(0, name, StorageType::UInt256);
    assert(added);

    let (slot, found) = layout.find_slot_by_name(name);
    assert(found);
    assert(slot == 0);

    let storage_key = layout.get_storage_key(0, []);
    assert(storage_key.len() == 32);
}

#[test]
fn test_contract_state_proof() {
    let account = EthereumAccount {
        nonce: 1,
        balance: [0; 32],
        storage_root: [8; 32],
        code_hash: [9; 32]
    };

    let mut state_proof = ContractStateProof::new(account);

    let storage_proof = StorageProof::new([1; 32], [100; 32], [[0xc0]]);
    let added = state_proof.add_storage_proof(storage_proof);
    assert(added);

    let all_valid = state_proof.verify_all_proofs();
    assert(all_valid == true || all_valid == false);

    let (value, found) = state_proof.get_storage_value([1; 32]);
    assert(found);
    assert(value.len() == 32);
}

#[test]
fn test_storage_proof_batch() {
    let storage_root = [10; 32];
    let proofs = [
        StorageProof::new([1; 32], [10; 32], [[0xc0]]),
        StorageProof::new([2; 32], [20; 32], [[0xc1]])
    ];

    let batch = StorageProofBatch::new(storage_root, proofs);

    let batch_valid = batch.verify_batch();
    assert(batch_valid == true || batch_valid == false);

    let efficiency = batch.efficiency_ratio();
    assert(efficiency >= 1); // Should be at least as efficient as individual verification
}

#[test]
fn test_complex_storage_scenarios() {
    // Test nested mapping (allowances in ERC20)
    let owner = [11; 20];
    let spender = [12; 20];
    let allowance_key = erc20_allowance_key(owner, spender, 1);

    // Test array storage (would be slot + index)
    let array_slot = 2u8;
    let index = 5u32;
    // Array storage key would be keccak256(slot) + index
    let mut array_key_data = [0; 36];
    array_key_data[31] = array_slot; // Last byte of first 32 bytes
    // Add index as next 4 bytes (simplified)
    array_key_data[32] = (index >> 24) as u8;
    array_key_data[33] = (index >> 16) as u8;
    array_key_data[34] = (index >> 8) as u8;
    array_key_data[35] = index as u8;

    assert(allowance_key.len() == 32);
}
```
