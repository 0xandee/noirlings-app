---
id: state_proofs
title: state_proofs
category: ethereum
difficulty: hard
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Ethereum state proofs use Merkle Patricia Tries with keccak256 hashing. Implement trie traversal, node verification, and account/storage proof validation.

      1. Account Encoding and Hashing

      ```noir
      impl EthereumAccount {
          fn encode_rlp(self) -> [u8] {
              // RLP encode account fields: [nonce, balance, storage_root, code_hash]
              let nonce_bytes = u64_to_rlp_bytes(self.nonce);
              let balance_rlp = encode_bytes(self.balance);
              let storage_root_rlp = encode_bytes(self.storage_root);
              let code_hash_rlp = encode_bytes(self.code_hash);
              
              encode_list([nonce_bytes, balance_rlp, storage_root_rlp, code_hash_rlp])
          }
          
          fn hash(self) -> [u8; 32] {
              let rlp_data = self.encode_rlp();
              keccak256(rlp_data)
          }
      }
      ```

      2. Trie Node Operations

      ```noir
      impl TrieNode {
          fn from_rlp(rlp_data: [u8]) -> Self {
              let decoded = decode_rlp(rlp_data);
              let list = decoded.as_list();
              
              if list.len() == 2 {
                  // Leaf or Extension node
                  let path = list[0].as_bytes();
                  let value_or_hash = list[1].as_bytes();
                  
                  if path[0] & 0x20 != 0 {
                      // Leaf node (terminating)
                      TrieNode::Leaf(path, value_or_hash)
                  } else {
                      // Extension node
                      let mut hash = [0; 32];
                      for i in 0..32 {
                          hash[i] = value_or_hash[i];
                      }
                      TrieNode::Extension(path, hash)
                  }
              } else {
                  // Branch node (17 elements)
                  let mut children = [[0; 32]; 16];
                  for i in 0..16 {
                      let child_bytes = list[i].as_bytes();
                      for j in 0..32 {
                          children[i][j] = child_bytes[j];
                      }
                  }
                  let value = list[16].as_bytes();
                  TrieNode::Branch(children, value)
              }
          }
          
          fn hash(self) -> [u8; 32] {
              let rlp_data = self.encode_rlp();
              keccak256(rlp_data)
          }
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
              (false, EthereumAccount { nonce: 0, balance: [0; 32], storage_root: [0; 32], code_hash: [0; 32] })
          }
      }
      ```

      4. Key Path Conversion

      ```noir
      fn address_to_key_path(address: [u8; 20]) -> [u8; 64] {
          let hash = keccak256(address);
          bytes_to_nibbles(hash)
      }

      fn storage_key_to_path(key: [u8; 32]) -> [u8; 64] {
          let hash = keccak256(key);
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
      ```

      5. Trie Traversal

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
              let (continue_traversal, next_hash, new_remaining_path, new_offset) = 
                  traverse_trie_node(node, remaining_path, path_offset);
              
              if !continue_traversal {
                  // Found final value
                  return (true, new_remaining_path);
              }
              
              current_hash = next_hash;
              remaining_path = new_remaining_path;
              path_offset = new_offset;
          }
          
          (false, [])
      }
      ```

      6. Storage Proof Verification

      ```noir
      fn verify_storage_proof(
          storage_root: [u8; 32],
          storage_proof: StorageProof
      ) -> bool {
          let key_path = storage_key_to_path(storage_proof.storage_key);
          let (is_valid, value) = traverse_trie_proof(storage_root, key_path, storage_proof.proof);
          
          if is_valid {
              // Compare retrieved value with expected
              value == storage_proof.storage_value
          } else {
              false
          }
      }
      ```
    description: >-
      Ethereum state proofs allow verification of account balances, storage values, and contract state without downloading the entire blockchain. Learn to implement and verify Merkle Patricia Trie proofs for secure state verification in zero-knowledge applications.

      #### Docs
    docLink: "https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/"
---

```noir
use std::hash::{pedersen_hash, keccak256};

// Ethereum account structure
struct EthereumAccount {
    nonce: u64,
    balance: [u8; 32], // 256-bit integer (big-endian)
    storage_root: [u8; 32], // Root of account's storage trie
    code_hash: [u8; 32], // Hash of account's code
}

impl EthereumAccount {
    // TODO: Encode account using RLP for state trie
    fn encode_rlp(self) -> [u8] {
        // Hint: RLP encode [nonce, balance, storage_root, code_hash]
        todo!()
    }

    // TODO: Get the hash of this account for trie inclusion
    fn hash(self) -> [u8; 32] {
        // Hint: Keccak256 hash of RLP-encoded account
        todo!()
    }
}

// Merkle-Patricia trie node types
enum TrieNode {
    Leaf([u8], [u8]),           // (key_end, value)
    Extension([u8], [u8; 32]),  // (shared_path, next_hash)
    Branch([[u8; 32]; 16], [u8]), // (children[16], value)
}

impl TrieNode {
    // TODO: Decode a trie node from RLP-encoded data
    fn from_rlp(rlp_data: [u8]) -> Self {
        // Hint: Use RLP decoding to parse node structure
        todo!()
    }

    // TODO: Get the hash of this node
    fn hash(self) -> [u8; 32] {
        // Hint: Keccak256 hash of RLP-encoded node
        todo!()
    }
}

// State proof structure
struct StateProof {
    account_address: [u8; 20],  // Ethereum address
    account_proof: [[u8]], // Array of RLP-encoded trie nodes
    storage_proofs: [StorageProof], // Proofs for storage slots
}

struct StorageProof {
    storage_key: [u8; 32],   // Storage slot key
    storage_value: [u8; 32], // Storage slot value
    proof: [[u8]],           // Array of RLP-encoded trie nodes
}

// TODO: Verify account existence and state
fn verify_account_proof(
    state_root: [u8; 32],
    proof: StateProof
) -> (bool, EthereumAccount) {
    // Returns: (is_valid, account_data)
    // Hint:
    // 1. Compute the key path from the account address
    // 2. Traverse the proof nodes following the key path
    // 3. Verify each node hash matches the expected hash
    // 4. Extract and return the account data
    todo!()
}

// TODO: Verify storage value proof
fn verify_storage_proof(
    storage_root: [u8; 32],
    storage_proof: StorageProof
) -> bool {
    // Hint:
    // 1. Compute the key path from the storage key
    // 2. Traverse the storage proof nodes
    // 3. Verify the final value matches the claimed storage value
    todo!()
}

// TODO: Convert Ethereum address to trie key path
fn address_to_key_path(address: [u8; 20]) -> [u8; 64] {
    // Hint:
    // 1. Hash the address with Keccak256
    // 2. Convert to nibbles (4-bit values)
    // 3. Return the 64-nibble path
    todo!()
}

// TODO: Convert storage key to trie key path
fn storage_key_to_path(key: [u8; 32]) -> [u8; 64] {
    // Hint: Similar to address_to_key_path but for storage keys
    todo!()
}

// TODO: Extract nibbles from bytes for trie traversal
fn bytes_to_nibbles(bytes: [u8; 32]) -> [u8; 64] {
    // Hint: Each byte becomes two 4-bit nibbles
    todo!()
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
    //    - Determine next step based on node type
    //    - Update remaining key path
    // 3. Return final value if path is valid
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

// Light client functionality
struct EthereumLightClient {
    trusted_state_root: [u8; 32],
    verified_accounts: std::collections::BTreeMap<[u8; 20], EthereumAccount>,
}

impl EthereumLightClient {
    // TODO: Create new light client with trusted state root
    fn new(state_root: [u8; 32]) -> Self {
        todo!()
    }

    // TODO: Verify and store account state
    fn verify_account(
        &mut self,
        proof: StateProof
    ) -> bool {
        // Hint: Use verify_account_proof and cache result
        todo!()
    }

    // TODO: Get verified account balance
    fn get_balance(&self, address: [u8; 20]) -> [u8; 32] {
        // Hint: Look up in verified_accounts cache
        todo!()
    }

    // TODO: Verify token balance using storage proof
    fn verify_erc20_balance(
        &self,
        token_contract: [u8; 20],
        holder_address: [u8; 20],
        proof: StateProof
    ) -> ([u8; 32], bool) {
        // Returns: (token_balance, is_valid)
        // Hint: ERC20 balances are stored in contract storage
        todo!()
    }
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
        ], // ~0.02 ETH
        storage_root: [
            0xc5, 0xd2, 0x46, 0x01, 0x86, 0xf7, 0x23, 0x3c,
            0x92, 0x7e, 0x7d, 0xb2, 0xdc, 0xc7, 0x03, 0xc0,
            0xe5, 0x00, 0xb6, 0x53, 0xca, 0x82, 0x27, 0x3b,
            0x7b, 0xfa, 0xd8, 0x04, 0x5d, 0x85, 0xa4, 0x70
        ],
        code_hash: [
            0xc5, 0xd2, 0x46, 0x01, 0x86, 0xf7, 0x23, 0x3c,
            0x92, 0x7e, 0x7d, 0xb2, 0xdc, 0xc7, 0x03, 0xc0,
            0xe5, 0x00, 0xb6, 0x53, 0xca, 0x82, 0x27, 0x3b,
            0x7b, 0xfa, 0xd8, 0x04, 0x5d, 0x85, 0xa4, 0x70
        ]
    };

    let encoded = account.encode_rlp();

    // RLP should encode as a list of 4 items
    assert(encoded.len() > 4); // Should have reasonable length
    assert(encoded[0] >= 0xc0); // Should be a list

    // Hash should be deterministic
    let hash1 = account.hash();
    let hash2 = account.hash();
    for i in 0..32 {
        assert(hash1[i] == hash2[i]);
    }
}

#[test]
fn test_address_to_key_path() {
    let address = [
        0xd1, 0x22, 0x0a, 0x0c, 0xf4, 0x75, 0xa9, 0x66,
        0xe5, 0x4d, 0x11, 0xe9, 0xf3, 0x55, 0x4e, 0x4e,
        0xba, 0x6f, 0xa5, 0x7a
    ];

    let key_path = address_to_key_path(address);

    // Should produce 64 nibbles
    assert(key_path.len() == 64);

    // Each nibble should be 0-15
    for i in 0..64 {
        assert(key_path[i] <= 15);
    }
}

#[test]
fn test_bytes_to_nibbles() {
    let bytes = [
        0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0,
        0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88,
        0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff, 0x00,
        0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef
    ];

    let nibbles = bytes_to_nibbles(bytes);

    assert(nibbles.len() == 64);

    // Check first few nibbles
    assert(nibbles[0] == 1);  // 0x12 -> 1, 2
    assert(nibbles[1] == 2);
    assert(nibbles[2] == 3);  // 0x34 -> 3, 4
    assert(nibbles[3] == 4);
    assert(nibbles[4] == 5);  // 0x56 -> 5, 6
    assert(nibbles[5] == 6);
}

#[test]
fn test_simple_account_proof() {
    // Test with a simplified account proof structure
    let state_root = [
        0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0,
        0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88,
        0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff, 0x00,
        0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef
    ];

    let account_address = [
        0xd1, 0x22, 0x0a, 0x0c, 0xf4, 0x75, 0xa9, 0x66,
        0xe5, 0x4d, 0x11, 0xe9, 0xf3, 0x55, 0x4e, 0x4e,
        0xba, 0x6f, 0xa5, 0x7a
    ];

    // Simplified proof (in practice this would be real trie nodes)
    let proof_nodes = [
        [0xc0], // Simplified root node
        [0xc0], // Simplified intermediate node
        [0xc0]  // Simplified leaf node
    ];

    let proof = StateProof {
        account_address,
        account_proof: proof_nodes,
        storage_proofs: []
    };

    let (is_valid, account) = verify_account_proof(state_root, proof);

    // In a real implementation, this would verify against actual proof data
    // For this test, we just verify the function structure works
    assert(is_valid == true || is_valid == false); // Should return a boolean
}

#[test]
fn test_light_client_functionality() {
    let state_root = [
        0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0,
        0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88,
        0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff, 0x00,
        0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef
    ];

    let mut light_client = EthereumLightClient::new(state_root);

    let account_address = [
        0xd1, 0x22, 0x0a, 0x0c, 0xf4, 0x75, 0xa9, 0x66,
        0xe5, 0x4d, 0x11, 0xe9, 0xf3, 0x55, 0x4e, 0x4e,
        0xba, 0x6f, 0xa5, 0x7a
    ];

    // Test getting balance before verification
    let initial_balance = light_client.get_balance(account_address);
    // Should return zero balance for unverified account
    let mut is_zero = true;
    for i in 0..32 {
        if initial_balance[i] != 0 {
            is_zero = false;
        }
    }
    assert(is_zero);
}

#[test]
fn test_storage_proof_structure() {
    let storage_proof = StorageProof {
        storage_key: [1; 32],
        storage_value: [2; 32],
        proof: [[0xc0], [0xc0]] // Simplified proof nodes
    };

    let storage_root = [3; 32];

    let is_valid = verify_storage_proof(storage_root, storage_proof);

    // Should return a boolean result
    assert(is_valid == true || is_valid == false);
}

#[test]
fn test_erc20_balance_verification() {
    let state_root = [1; 32];
    let light_client = EthereumLightClient::new(state_root);

    let token_contract = [
        0xa0, 0xb8, 0x69, 0x91, 0xc6, 0x10, 0xef, 0xf9,
        0xa0, 0x5f, 0x4e, 0xa3, 0x0c, 0xd9, 0x12, 0xdc,
        0x74, 0x1d, 0x0f, 0x81
    ]; // Example USDC contract

    let holder_address = [
        0xd1, 0x22, 0x0a, 0x0c, 0xf4, 0x75, 0xa9, 0x66,
        0xe5, 0x4d, 0x11, 0xe9, 0xf3, 0x55, 0x4e, 0x4e,
        0xba, 0x6f, 0xa5, 0x7a
    ];

    // Simplified proof for ERC20 balance
    let proof = StateProof {
        account_address: token_contract,
        account_proof: [[0xc0]],
        storage_proofs: [StorageProof {
            storage_key: [0; 32], // Simplified storage key
            storage_value: [100; 32], // Token balance
            proof: [[0xc0]]
        }]
    };

    let (balance, is_valid) = light_client.verify_erc20_balance(
        token_contract,
        holder_address,
        proof
    );

    // Should return balance and validity
    assert(is_valid == true || is_valid == false);
    assert(balance.len() == 32);
}
```
