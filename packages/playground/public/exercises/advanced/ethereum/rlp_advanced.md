---
id: rlp_advanced
title: rlp_advanced
category: ethereum
difficulty: hard
tags: []
mode: test
prerequisites: ["rlp_basics"]
version: 1.0.0
locales:
  en:
    hint: >-
      Advanced RLP decoding handles long strings, complex Ethereum data structures, and robust error handling. Master these concepts for real-world blockchain data processing.

      1. Long String Decoding

      ```noir
      fn decode_long_string(encoded: [u8], offset: u32) -> (RLPItem, u32) {
          let first_byte = encoded[offset];
          let length_of_length = (first_byte - 0xb7) as u32;
          
          // Parse the length
          let (length, data_start) = parse_long_length(encoded, offset + 1, length_of_length);
          
          // Extract the string data
          let mut bytes = [0; length];
          for i in 0..length {
              bytes[i] = encoded[data_start + i];
          }
          
          (RLPItem::Bytes(bytes), data_start + length)
      }
      ```

      2. Long Length Parsing

      ```noir
      fn parse_long_length(encoded: [u8], offset: u32, length_of_length: u32) -> (u32, u32) {
          let mut length = 0;
          for i in 0..length_of_length {
              length = length * 256 + encoded[offset + i] as u32;
          }
          (length, offset + length_of_length)
      }
      ```

      3. Ethereum Transaction Decoding

      ```noir
      impl EthereumTransaction {
          fn from_rlp(item: RLPItem) -> Self {
              let list = item.as_list();
              
              EthereumTransaction {
                  nonce: bytes_to_u64(list[0].as_bytes()),
                  gas_price: bytes_to_u64(list[1].as_bytes()),
                  gas_limit: bytes_to_u64(list[2].as_bytes()),
                  to: bytes_to_address(list[3].as_bytes()),
                  value: bytes_to_u256(list[4].as_bytes()),
                  data: list[5].as_bytes(),
                  v: bytes_to_u64(list[6].as_bytes()),
                  r: bytes_to_u256(list[7].as_bytes()),
                  s: bytes_to_u256(list[8].as_bytes())
              }
          }
      }
      ```

      4. Round-trip Verification

      ```noir
      fn round_trip_test(original: RLPItem) -> bool {
          let encoded = encode_rlp(original);
          let decoded = decode_rlp(encoded);
          rlp_items_equal(original, decoded)
      }
      ```
    description: >-
      Advanced RLP decoding handles complex Ethereum data structures including transactions, blocks, and large data payloads. Learn to implement robust decoding with proper error handling for production systems.

      In this exercise, you will:
      1. Decode long strings and large data structures
      2. Parse complete Ethereum transactions and blocks
      3. Implement round-trip encoding/decoding verification
      4. Handle edge cases and malformed data gracefully

      #### Docs
    docLink: "https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/"
---

```noir
// Import from basic RLP exercise
global RLP_SINGLE_BYTE_MAX: u8 = 0x7f;
global RLP_SHORT_STRING_OFFSET: u8 = 0x80;
global RLP_LONG_STRING_OFFSET: u8 = 0xb7;
global RLP_SHORT_LIST_OFFSET: u8 = 0xc0;
global RLP_LONG_LIST_OFFSET: u8 = 0xf7;

enum RLPItem {
    Bytes([u8]),
    List([RLPItem]),
}

impl RLPItem {
    fn is_bytes(self) -> bool {
        match self {
            RLPItem::Bytes(_) => true,
            RLPItem::List(_) => false
        }
    }

    fn is_list(self) -> bool {
        match self {
            RLPItem::List(_) => true,
            RLPItem::Bytes(_) => false
        }
    }

    fn as_bytes(self) -> [u8] {
        match self {
            RLPItem::Bytes(bytes) => bytes,
            RLPItem::List(_) => []
        }
    }

    fn as_list(self) -> [RLPItem] {
        match self {
            RLPItem::List(items) => items,
            RLPItem::Bytes(_) => []
        }
    }
}

// TODO: Decode long string (0xb8 to 0xbf)
fn decode_long_string(encoded: [u8], offset: u32) -> (RLPItem, u32) {
    // Hint:
    // 1. Extract length_of_length from first byte
    // 2. Parse the actual length from next bytes
    // 3. Extract string data
    todo!()
}

// TODO: Decode long list (0xf8 to 0xff)
fn decode_long_list(encoded: [u8], offset: u32) -> (RLPItem, u32) {
    // Hint: Similar to long string but decode list items
    todo!()
}

// TODO: Parse multi-byte length encoding
fn parse_long_length(encoded: [u8], offset: u32, length_of_length: u32) -> (u32, u32) {
    // Returns: (length, next_offset)
    // Hint: Read length_of_length bytes as big-endian integer
    todo!()
}

// TODO: Complete RLP decoder with all types
fn decode_rlp_complete(encoded: [u8]) -> RLPItem {
    // Hint: Handle all RLP types including long strings and long lists
    todo!()
}

// TODO: Decode with offset support for recursive parsing
fn decode_rlp_at_offset(encoded: [u8], offset: u32) -> (RLPItem, u32) {
    // Returns: (decoded_item, next_offset)
    // Hint: Decode one item starting at offset, return next position
    todo!()
}

// Ethereum transaction structure
struct EthereumTransaction {
    nonce: u64,
    gas_price: u64,
    gas_limit: u64,
    to: [u8; 20],       // Address (20 bytes)
    value: [u8; 32],    // Value (256-bit integer)
    data: [u8],         // Transaction data
    v: u64,             // Recovery ID
    r: [u8; 32],        // Signature r
    s: [u8; 32],        // Signature s
}

impl EthereumTransaction {
    // TODO: Create transaction from RLP-decoded list
    fn from_rlp(item: RLPItem) -> Self {
        // Hint: Extract list items and convert each field
        todo!()
    }

    // TODO: Convert transaction to RLP item
    fn to_rlp(self) -> RLPItem {
        // Hint: Create list with all transaction fields
        todo!()
    }

    // TODO: Get transaction hash (for verification)
    fn hash(self) -> [u8; 32] {
        // Hint: Hash the RLP-encoded transaction
        todo!()
    }

    // TODO: Verify transaction signature (simplified)
    fn verify_signature(self) -> bool {
        // Hint: Check that v, r, s form valid signature
        todo!()
    }
}

// Ethereum block header structure
struct EthereumBlockHeader {
    parent_hash: [u8; 32],
    uncles_hash: [u8; 32],
    coinbase: [u8; 20],
    state_root: [u8; 32],
    transactions_root: [u8; 32],
    receipts_root: [u8; 32],
    bloom: [u8; 256],       // Bloom filter
    difficulty: [u8; 32],
    number: u64,
    gas_limit: u64,
    gas_used: u64,
    timestamp: u64,
    extra_data: [u8],
    mix_hash: [u8; 32],
    nonce: u64,
}

impl EthereumBlockHeader {
    // TODO: Create block header from RLP
    fn from_rlp(item: RLPItem) -> Self {
        // Hint: Block header has 15 fields in specific order
        todo!()
    }

    // TODO: Convert to RLP
    fn to_rlp(self) -> RLPItem {
        // Hint: Create list with all header fields
        todo!()
    }

    // TODO: Calculate block hash
    fn hash(self) -> [u8; 32] {
        // Hint: Hash the RLP-encoded header
        todo!()
    }
}

// Data conversion utilities
fn bytes_to_u64(bytes: [u8]) -> u64 {
    // TODO: Convert bytes to u64 (big-endian)
    // Hint: Handle empty bytes as 0, convert big-endian
    todo!()
}

fn u64_to_bytes(value: u64) -> [u8] {
    // TODO: Convert u64 to minimal big-endian bytes
    // Hint: 0 should be empty bytes, otherwise minimal representation
    todo!()
}

fn bytes_to_address(bytes: [u8]) -> [u8; 20] {
    // TODO: Convert bytes to Ethereum address
    // Hint: Pad with zeros if needed, take last 20 bytes if longer
    todo!()
}

fn bytes_to_u256(bytes: [u8]) -> [u8; 32] {
    // TODO: Convert bytes to 256-bit integer representation
    // Hint: Pad with leading zeros to make 32 bytes
    todo!()
}

// Advanced RLP operations
struct RLPDecoder {
    data: [u8],
    position: u32,
    errors: u32,
}

impl RLPDecoder {
    // TODO: Create new decoder
    fn new(data: [u8]) -> Self {
        todo!()
    }

    // TODO: Decode next item
    fn decode_next(&mut self) -> RLPItem {
        // Hint: Decode item at current position, advance position
        todo!()
    }

    // TODO: Peek at next item type without consuming
    fn peek_type(&self) -> u8 {
        // Hint: Look at byte at current position
        todo!()
    }

    // TODO: Check if more data available
    fn has_more(&self) -> bool {
        // Hint: Check if position < data length
        todo!()
    }

    // TODO: Get current position
    fn position(&self) -> u32 {
        todo!()
    }

    // TODO: Skip malformed data
    fn skip_bytes(&mut self, count: u32) {
        // Hint: Advance position by count bytes
        todo!()
    }
}

// Round-trip verification
fn round_trip_test(original: RLPItem) -> bool {
    // TODO: Encode then decode, verify equality
    // Hint: Use encode_rlp and decode_rlp_complete
    todo!()
}

fn encode_rlp(item: RLPItem) -> [u8] {
    // TODO: Encode RLP item back to bytes
    // Hint: Reverse of decoding process
    todo!()
}

// Batch processing
fn decode_multiple_items(encoded: [u8]) -> [RLPItem] {
    // TODO: Decode multiple RLP items from single byte array
    // Hint: Keep decoding until all bytes consumed
    todo!()
}

fn validate_rlp_structure(encoded: [u8]) -> bool {
    // TODO: Validate RLP without full decoding
    // Hint: Check that structure is well-formed
    todo!()
}

// Ethereum-specific utilities
fn decode_transaction_list(encoded: [u8]) -> [EthereumTransaction] {
    // TODO: Decode list of transactions
    // Hint: Decode as RLP list, then convert each item
    todo!()
}

fn calculate_merkle_root(transactions: [EthereumTransaction]) -> [u8; 32] {
    // TODO: Calculate Merkle root of transaction hashes
    // Hint: Hash all transaction hashes together (simplified)
    todo!()
}

fn main(
    long_string_encoded: [u8; 100],
    transaction_encoded: [u8; 200],
    value: u64
) -> pub bool {
    // Test long string decoding
    let (long_item, _) = decode_long_string(long_string_encoded, 0);
    let long_valid = long_item.is_bytes();

    // Test transaction decoding
    let tx_item = decode_rlp_complete(transaction_encoded);
    let tx_valid = tx_item.is_list();

    // Test number conversion
    let bytes = u64_to_bytes(value);
    let converted_back = bytes_to_u64(bytes);
    let conversion_correct = converted_back == value;

    long_valid & tx_valid & conversion_correct
}

#[test]
fn test_long_string_decoding() {
    // Create long string (> 55 bytes)
    let mut long_data = [0u8; 60];
    for i in 0..60 {
        long_data[i] = (i % 256) as u8;
    }

    // Manually encode: 0xb8 (0xb7 + 1) + length + data
    let mut encoded = [0u8; 62];
    encoded[0] = 0xb8;  // Long string with 1-byte length
    encoded[1] = 60;    // Length
    for i in 0..60 {
        encoded[i + 2] = long_data[i];
    }

    let (decoded, next_offset) = decode_long_string(encoded, 0);

    assert(decoded.is_bytes());
    let bytes = decoded.as_bytes();
    assert(bytes.len() == 60);
    assert(next_offset == 62);

    // Verify data integrity
    for i in 0..60 {
        assert(bytes[i] == long_data[i]);
    }
}

#[test]
fn test_long_length_parsing() {
    // Test 2-byte length: 0x0100 (256)
    let encoded = [0x01, 0x00, 0xaa, 0xbb]; // Length 256, then some data
    let (length, next_offset) = parse_long_length(encoded, 0, 2);

    assert(length == 256);
    assert(next_offset == 2);

    // Test 3-byte length: 0x010000 (65536)
    let encoded_3byte = [0x01, 0x00, 0x00, 0xcc]; // Length 65536
    let (length2, next_offset2) = parse_long_length(encoded_3byte, 0, 3);

    assert(length2 == 65536);
    assert(next_offset2 == 3);
}

#[test]
fn test_long_list_decoding() {
    // Create a long list encoding
    // For simplicity, create list with known short content but long encoding format
    let encoded = [
        0xf8, 0x08,                 // Long list with 8-byte content
        0x83, 0x61, 0x61, 0x61,     // "aaa"
        0x83, 0x62, 0x62, 0x62      // "bbb"
    ];

    let (decoded, next_offset) = decode_long_list(encoded, 0);

    assert(decoded.is_list());
    let list = decoded.as_list();
    assert(list.len() == 2);
    assert(next_offset == 10);

    // Check items
    let first = list[0].as_bytes();
    assert(first.len() == 3);
    assert(first[0] == 0x61); // 'a'

    let second = list[1].as_bytes();
    assert(second.len() == 3);
    assert(second[0] == 0x62); // 'b'
}

#[test]
fn test_ethereum_transaction_decoding() {
    // Create test transaction data
    let tx = EthereumTransaction {
        nonce: 9,
        gas_price: 20000000000,
        gas_limit: 21000,
        to: [
            0xd1, 0x22, 0x0a, 0x0c, 0xf4, 0x75, 0xa9, 0x66,
            0xe5, 0x4d, 0x11, 0xe9, 0xf3, 0x55, 0x4e, 0x4e,
            0xba, 0x6f, 0xa5, 0x7a
        ],
        value: [0; 32], // 0 ETH
        data: [],
        v: 28,
        r: [1; 32],
        s: [2; 32]
    };

    // Convert to RLP and back
    let rlp_item = tx.to_rlp();
    let decoded_tx = EthereumTransaction::from_rlp(rlp_item);

    // Verify fields
    assert(decoded_tx.nonce == tx.nonce);
    assert(decoded_tx.gas_price == tx.gas_price);
    assert(decoded_tx.gas_limit == tx.gas_limit);
    assert(decoded_tx.v == tx.v);

    // Verify address
    for i in 0..20 {
        assert(decoded_tx.to[i] == tx.to[i]);
    }
}

#[test]
fn test_number_conversions() {
    // Test u64 conversion
    assert(bytes_to_u64([]) == 0);
    assert(bytes_to_u64([0x01]) == 1);
    assert(bytes_to_u64([0x01, 0x00]) == 256);
    assert(bytes_to_u64([0xff, 0xff]) == 65535);

    // Test reverse conversion
    assert(u64_to_bytes(0) == []);
    assert(u64_to_bytes(1) == [0x01]);
    assert(u64_to_bytes(256) == [0x01, 0x00]);
    assert(u64_to_bytes(65535) == [0xff, 0xff]);

    // Test round-trip
    let original = 12345u64;
    let bytes = u64_to_bytes(original);
    let recovered = bytes_to_u64(bytes);
    assert(recovered == original);
}

#[test]
fn test_address_conversion() {
    // Test standard 20-byte address
    let addr_bytes = [
        0xd1, 0x22, 0x0a, 0x0c, 0xf4, 0x75, 0xa9, 0x66,
        0xe5, 0x4d, 0x11, 0xe9, 0xf3, 0x55, 0x4e, 0x4e,
        0xba, 0x6f, 0xa5, 0x7a
    ];

    let address = bytes_to_address(addr_bytes);
    assert(address.len() == 20);
    for i in 0..20 {
        assert(address[i] == addr_bytes[i]);
    }

    // Test short input (should pad with zeros)
    let short_bytes = [0x12, 0x34];
    let padded_addr = bytes_to_address(short_bytes);
    assert(padded_addr[18] == 0x12);
    assert(padded_addr[19] == 0x34);
    for i in 0..18 {
        assert(padded_addr[i] == 0);
    }
}

#[test]
fn test_rlp_decoder() {
    let encoded = [
        0xc6,               // List with 6 bytes
        0x83, 0x61, 0x62, 0x63,  // "abc"
        0x42                // Single byte 0x42
    ];

    let mut decoder = RLPDecoder::new(encoded);

    assert(decoder.has_more());
    assert(decoder.position() == 0);

    let first_item = decoder.decode_next();
    assert(first_item.is_list());

    assert(!decoder.has_more()); // Should be at end after decoding list
}

#[test]
fn test_round_trip_verification() {
    // Test bytes
    let bytes_item = RLPItem::Bytes([1, 2, 3, 4, 5]);
    assert(round_trip_test(bytes_item));

    // Test list
    let item1 = RLPItem::Bytes([0x61, 0x62, 0x63]); // "abc"
    let item2 = RLPItem::Bytes([0x64, 0x65, 0x66]); // "def"
    let list_item = RLPItem::List([item1, item2]);
    assert(round_trip_test(list_item));

    // Test empty structures
    let empty_bytes = RLPItem::Bytes([]);
    assert(round_trip_test(empty_bytes));

    let empty_list = RLPItem::List([]);
    assert(round_trip_test(empty_list));
}

#[test]
fn test_multiple_items_decoding() {
    // Encode multiple items in sequence
    let encoded = [
        0x01,                    // Single byte
        0x82, 0x68, 0x69,        // "hi"
        0xc0,                    // Empty list
        0x83, 0x62, 0x79, 0x65   // "bye"
    ];

    let items = decode_multiple_items(encoded);
    assert(items.len() == 4);

    // Check each item
    assert(items[0].is_bytes());
    let bytes0 = items[0].as_bytes();
    assert(bytes0[0] == 0x01);

    assert(items[1].is_bytes());
    let bytes1 = items[1].as_bytes();
    assert(bytes1.len() == 2);

    assert(items[2].is_list());
    let list2 = items[2].as_list();
    assert(list2.len() == 0);

    assert(items[3].is_bytes());
    let bytes3 = items[3].as_bytes();
    assert(bytes3.len() == 3);
}

#[test]
fn test_rlp_validation() {
    // Valid RLP
    let valid = [0x83, 0x61, 0x62, 0x63]; // "abc"
    assert(validate_rlp_structure(valid));

    // Invalid RLP (claims longer than available)
    let invalid = [0x85, 0x61, 0x62]; // Claims 5 bytes but only has 2
    assert(!validate_rlp_structure(invalid));

    // Valid empty structures
    let empty_string = [0x80];
    assert(validate_rlp_structure(empty_string));

    let empty_list = [0xc0];
    assert(validate_rlp_structure(empty_list));
}

#[test]
fn test_transaction_list_processing() {
    // Create multiple transactions
    let tx1 = EthereumTransaction {
        nonce: 1, gas_price: 1000000000, gas_limit: 21000,
        to: [1; 20], value: [0; 32], data: [],
        v: 27, r: [1; 32], s: [1; 32]
    };

    let tx2 = EthereumTransaction {
        nonce: 2, gas_price: 2000000000, gas_limit: 21000,
        to: [2; 20], value: [0; 32], data: [],
        v: 28, r: [2; 32], s: [2; 32]
    };

    // Convert to RLP list and encode
    let tx_list = RLPItem::List([tx1.to_rlp(), tx2.to_rlp()]);
    let encoded = encode_rlp(tx_list);

    // Decode back
    let decoded_txs = decode_transaction_list(encoded);
    assert(decoded_txs.len() == 2);

    assert(decoded_txs[0].nonce == 1);
    assert(decoded_txs[1].nonce == 2);
}

#[test]
fn test_block_header_processing() {
    let header = EthereumBlockHeader {
        parent_hash: [1; 32],
        uncles_hash: [2; 32],
        coinbase: [3; 20],
        state_root: [4; 32],
        transactions_root: [5; 32],
        receipts_root: [6; 32],
        bloom: [7; 256],
        difficulty: [8; 32],
        number: 12345,
        gas_limit: 8000000,
        gas_used: 7500000,
        timestamp: 1609459200, // 2021-01-01
        extra_data: [0x48, 0x65, 0x6c, 0x6c, 0x6f], // "Hello"
        mix_hash: [9; 32],
        nonce: 987654321
    };

    // Convert to RLP and back
    let rlp_header = header.to_rlp();
    let decoded_header = EthereumBlockHeader::from_rlp(rlp_header);

    // Verify key fields
    assert(decoded_header.number == 12345);
    assert(decoded_header.gas_limit == 8000000);
    assert(decoded_header.timestamp == 1609459200);
    assert(decoded_header.nonce == 987654321);

    // Verify hash arrays
    for i in 0..32 {
        assert(decoded_header.parent_hash[i] == 1);
        assert(decoded_header.state_root[i] == 4);
    }
}
```
