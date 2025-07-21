---
id: rlp_decoding
title: rlp_decoding
category: ethereum
difficulty: medium
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      RLP decoding parses encoded data by examining the first byte to determine data type, then recursively processes nested structures with proper length handling.

      1. RLP Item Methods

      ```noir
      impl RLPItem {
          fn as_bytes(self) -> [u8] {
              match self {
                  RLPItem::Bytes(bytes) => bytes,
                  RLPItem::List(_) => [0; 0] // Error case
              }
          }
          
          fn as_list(self) -> [RLPItem] {
              match self {
                  RLPItem::List(items) => items,
                  RLPItem::Bytes(_) => [] // Error case
              }
          }
          
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
      }
      ```

      2. Main RLP Decoding

      ```noir
      fn decode_rlp(encoded: [u8]) -> RLPItem {
          if encoded.len() == 0 {
              return RLPItem::Bytes([]);
          }
          
          let first_byte = encoded[0];
          
          if first_byte <= RLP_SINGLE_BYTE_MAX {
              // Single byte
              RLPItem::Bytes([first_byte])
          } else if first_byte <= RLP_LONG_STRING_OFFSET {
              // Short string
              let length = (first_byte - RLP_SHORT_STRING_OFFSET) as u32;
              let mut bytes = [0; length];
              for i in 0..length {
                  bytes[i] = encoded[1 + i];
              }
              RLPItem::Bytes(bytes)
          } else if first_byte < RLP_SHORT_LIST_OFFSET {
              // Long string - parse length then extract data
              let (item, _) = decode_rlp_bytes(encoded, 0);
              item
          } else if first_byte <= RLP_LONG_LIST_OFFSET {
              // Short list
              let (item, _) = decode_rlp_list(encoded, 0);
              item
          } else {
              // Long list
              let (item, _) = decode_rlp_list(encoded, 0);
              item
          }
      }
      ```

      3. Bytes Decoding

      ```noir
      fn decode_rlp_bytes(encoded: [u8], offset: u32) -> (RLPItem, u32) {
          let first_byte = encoded[offset];
          
          if first_byte <= RLP_SINGLE_BYTE_MAX {
              (RLPItem::Bytes([first_byte]), offset + 1)
          } else if first_byte <= RLP_LONG_STRING_OFFSET {
              let length = (first_byte - RLP_SHORT_STRING_OFFSET) as u32;
              let mut bytes = [0; length];
              for i in 0..length {
                  bytes[i] = encoded[offset + 1 + i];
              }
              (RLPItem::Bytes(bytes), offset + 1 + length)
          } else {
              // Long string
              let length_of_length = (first_byte - RLP_LONG_STRING_OFFSET) as u32;
              let (length, next_offset) = parse_long_length(encoded, offset + 1, length_of_length);
              let mut bytes = [0; length];
              for i in 0..length {
                  bytes[i] = encoded[next_offset + i];
              }
              (RLPItem::Bytes(bytes), next_offset + length)
          }
      }
      ```

      4. List Decoding

      ```noir
      fn decode_rlp_list(encoded: [u8], offset: u32) -> (RLPItem, u32) {
          let first_byte = encoded[offset];
          let mut items = [];
          
          if first_byte <= RLP_LONG_LIST_OFFSET {
              // Short list
              let length = (first_byte - RLP_SHORT_LIST_OFFSET) as u32;
              let mut current_offset = offset + 1;
              let end_offset = offset + 1 + length;
              
              while current_offset < end_offset {
                  let (item, new_offset) = decode_rlp(encoded[current_offset..]);
                  items.push(item);
                  current_offset = new_offset;
              }
          } else {
              // Long list
              let length_of_length = (first_byte - RLP_LONG_LIST_OFFSET) as u32;
              let (length, data_start) = parse_long_length(encoded, offset + 1, length_of_length);
              let mut current_offset = data_start;
              let end_offset = data_start + length;
              
              while current_offset < end_offset {
                  let (item, new_offset) = decode_rlp(encoded[current_offset..]);
                  items.push(item);
                  current_offset = new_offset;
              }
          }
          
          (RLPItem::List(items), current_offset)
      }
      ```

      5. Helper Functions

      ```noir
      fn parse_long_length(encoded: [u8], offset: u32, length_of_length: u32) -> (u32, u32) {
          let mut length = 0;
          for i in 0..length_of_length {
              length = length * 256 + encoded[offset + i] as u32;
          }
          (length, offset + length_of_length)
      }

      fn bytes_to_u32(bytes: [u8]) -> u32 {
          if bytes.len() == 0 {
              return 0;
          }
          
          let mut result = 0;
          for i in 0..bytes.len() {
              result = result * 256 + bytes[i] as u32;
          }
          result
      }
      ```
    description: >-
      RLP decoding is the reverse process of RLP encoding, used to deserialize Ethereum data structures. Learn to implement robust RLP decoding to parse transactions, blocks, and state data for verification in zero-knowledge circuits.

      #### Docs
    docLink: "https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/"
---

```noir
// Complete RLP encoding and decoding implementation

global RLP_SINGLE_BYTE_MAX: u8 = 0x7f;
global RLP_SHORT_STRING_OFFSET: u8 = 0x80;
global RLP_LONG_STRING_OFFSET: u8 = 0xb7;
global RLP_SHORT_LIST_OFFSET: u8 = 0xc0;
global RLP_LONG_LIST_OFFSET: u8 = 0xf7;

// RLP Item represents decoded RLP data
enum RLPItem {
    Bytes([u8]),
    List([RLPItem]),
}

impl RLPItem {
    // TODO: Get bytes from RLP item (fails if it's a list)
    fn as_bytes(self) -> [u8] {
        todo!()
    }

    // TODO: Get list from RLP item (fails if it's bytes)
    fn as_list(self) -> [RLPItem] {
        todo!()
    }

    // TODO: Check if item is bytes
    fn is_bytes(self) -> bool {
        todo!()
    }

    // TODO: Check if item is list
    fn is_list(self) -> bool {
        todo!()
    }
}

// TODO: Decode RLP-encoded data
fn decode_rlp(encoded: [u8]) -> RLPItem {
    // Hint: Start with the first byte to determine the type
    // Then parse according to RLP rules
    todo!()
}

// TODO: Decode RLP bytes (strings)
fn decode_rlp_bytes(encoded: [u8], offset: u32) -> (RLPItem, u32) {
    // Returns: (decoded_item, next_offset)
    // Hint: Handle single bytes, short strings, and long strings
    todo!()
}

// TODO: Decode RLP list
fn decode_rlp_list(encoded: [u8], offset: u32) -> (RLPItem, u32) {
    // Returns: (decoded_item, next_offset)
    // Hint: Parse list length, then decode each item recursively
    todo!()
}

// TODO: Parse length from long encoding
fn parse_long_length(encoded: [u8], offset: u32, length_of_length: u32) -> (u32, u32) {
    // Returns: (length, next_offset)
    // Hint: Read length_of_length bytes and convert to integer
    todo!()
}

// TODO: Round-trip test: encode then decode
fn round_trip_test(original: RLPItem) -> bool {
    // Hint: Encode the item, then decode it, then compare
    todo!()
}

// Ethereum transaction structure for testing
struct EthereumTransactionDecoded {
    nonce: u32,
    gas_price: u32,
    gas_limit: u32,
    to: [u8; 20],
    value: u32,
    data: [u8],
}

impl EthereumTransactionDecoded {
    // TODO: Create transaction from decoded RLP list
    fn from_rlp(item: RLPItem) -> Self {
        // Hint: Extract list items and convert each field
        todo!()
    }

    // TODO: Convert transaction to RLP item
    fn to_rlp(self) -> RLPItem {
        // Hint: Create list of encoded fields
        todo!()
    }
}

// TODO: Helper to convert bytes to integer
fn bytes_to_u32(bytes: [u8]) -> u32 {
    // Hint: Convert big-endian bytes to u32
    // Handle empty bytes as 0
    todo!()
}

// TODO: Helper to convert integer to bytes
fn u32_to_bytes(value: u32) -> [u8] {
    // Hint: Convert to minimal big-endian representation
    // 0 should be empty bytes
    todo!()
}

#[test]
fn test_decode_single_bytes() {
    // Test single byte decoding
    let encoded = [0x42];
    let decoded = decode_rlp(encoded);

    assert(decoded.is_bytes());
    let bytes = decoded.as_bytes();
    assert(bytes.len() == 1);
    assert(bytes[0] == 0x42);
}

#[test]
fn test_decode_empty_string() {
    // Test empty string decoding
    let encoded = [0x80]; // Empty string
    let decoded = decode_rlp(encoded);

    assert(decoded.is_bytes());
    let bytes = decoded.as_bytes();
    assert(bytes.len() == 0);
}

#[test]
fn test_decode_short_string() {
    // Test short string: "hello"
    let encoded = [0x85, 0x68, 0x65, 0x6c, 0x6c, 0x6f];
    let decoded = decode_rlp(encoded);

    assert(decoded.is_bytes());
    let bytes = decoded.as_bytes();
    assert(bytes.len() == 5);
    assert(bytes[0] == 0x68); // 'h'
    assert(bytes[1] == 0x65); // 'e'
    assert(bytes[2] == 0x6c); // 'l'
    assert(bytes[3] == 0x6c); // 'l'
    assert(bytes[4] == 0x6f); // 'o'
}

#[test]
fn test_decode_long_string() {
    // Test long string (> 55 bytes)
    let mut long_data = [0u8; 60];
    for i in 0..60 {
        long_data[i] = (i % 256) as u8;
    }

    // Encode first to get the expected format
    let mut encoded = [0u8; 62]; // 0xb8 + length + data
    encoded[0] = 0xb8; // 0xb7 + 1
    encoded[1] = 60;   // Length
    for i in 0..60 {
        encoded[i + 2] = long_data[i];
    }

    let decoded = decode_rlp(encoded);

    assert(decoded.is_bytes());
    let bytes = decoded.as_bytes();
    assert(bytes.len() == 60);

    for i in 0..60 {
        assert(bytes[i] == long_data[i]);
    }
}

#[test]
fn test_decode_empty_list() {
    // Test empty list
    let encoded = [0xc0];
    let decoded = decode_rlp(encoded);

    assert(decoded.is_list());
    let list = decoded.as_list();
    assert(list.len() == 0);
}

#[test]
fn test_decode_simple_list() {
    // Test list: ["cat", "dog"]
    let encoded = [
        0xc8,       // List with 8 bytes
        0x83, 0x63, 0x61, 0x74,  // "cat"
        0x83, 0x64, 0x6f, 0x67   // "dog"
    ];

    let decoded = decode_rlp(encoded);

    assert(decoded.is_list());
    let list = decoded.as_list();
    assert(list.len() == 2);

    // Check first item: "cat"
    assert(list[0].is_bytes());
    let cat_bytes = list[0].as_bytes();
    assert(cat_bytes.len() == 3);
    assert(cat_bytes[0] == 0x63); // 'c'
    assert(cat_bytes[1] == 0x61); // 'a'
    assert(cat_bytes[2] == 0x74); // 't'

    // Check second item: "dog"
    assert(list[1].is_bytes());
    let dog_bytes = list[1].as_bytes();
    assert(dog_bytes.len() == 3);
    assert(dog_bytes[0] == 0x64); // 'd'
    assert(dog_bytes[1] == 0x6f); // 'o'
    assert(dog_bytes[2] == 0x67); // 'g'
}

#[test]
fn test_decode_nested_list() {
    // Test nested list: [[], [[]]]
    let encoded = [
        0xc4,       // List with 4 bytes
        0xc0,       // Empty list
        0xc1, 0xc0  // List containing empty list
    ];

    let decoded = decode_rlp(encoded);

    assert(decoded.is_list());
    let list = decoded.as_list();
    assert(list.len() == 2);

    // Check first item: empty list
    assert(list[0].is_list());
    let empty_list = list[0].as_list();
    assert(empty_list.len() == 0);

    // Check second item: list containing empty list
    assert(list[1].is_list());
    let nested_list = list[1].as_list();
    assert(nested_list.len() == 1);
    assert(nested_list[0].is_list());
    let inner_empty = nested_list[0].as_list();
    assert(inner_empty.len() == 0);
}

#[test]
fn test_round_trip_encoding() {
    // Test that encode -> decode produces original data

    // Test with bytes
    let original_bytes = RLPItem::Bytes([0x01, 0x02, 0x03]);
    assert(round_trip_test(original_bytes));

    // Test with simple list
    let cat = RLPItem::Bytes([0x63, 0x61, 0x74]);
    let dog = RLPItem::Bytes([0x64, 0x6f, 0x67]);
    let original_list = RLPItem::List([cat, dog]);
    assert(round_trip_test(original_list));

    // Test with nested list
    let empty = RLPItem::List([]);
    let nested = RLPItem::List([empty]);
    let complex_list = RLPItem::List([empty, nested]);
    assert(round_trip_test(complex_list));
}

#[test]
fn test_ethereum_transaction_decoding() {
    // Create a test transaction
    let tx = EthereumTransactionDecoded {
        nonce: 9,
        gas_price: 20000000000,
        gas_limit: 21000,
        to: [
            0xd1, 0x22, 0x0a, 0x0c, 0xf4, 0x75, 0xa9, 0x66,
            0xe5, 0x4d, 0x11, 0xe9, 0xf3, 0x55, 0x4e, 0x4e,
            0xba, 0x6f, 0xa5, 0x7a
        ],
        value: 1000000000000000000,
        data: [],
    };

    // Convert to RLP and back
    let rlp_item = tx.to_rlp();
    let decoded_tx = EthereumTransactionDecoded::from_rlp(rlp_item);

    // Verify all fields match
    assert(decoded_tx.nonce == tx.nonce);
    assert(decoded_tx.gas_price == tx.gas_price);
    assert(decoded_tx.gas_limit == tx.gas_limit);
    assert(decoded_tx.value == tx.value);
    assert(decoded_tx.data.len() == tx.data.len());

    for i in 0..20 {
        assert(decoded_tx.to[i] == tx.to[i]);
    }
}

#[test]
fn test_integer_conversion() {
    // Test integer to bytes conversion
    assert(u32_to_bytes(0) == []);
    assert(u32_to_bytes(1) == [0x01]);
    assert(u32_to_bytes(255) == [0xff]);
    assert(u32_to_bytes(256) == [0x01, 0x00]);
    assert(u32_to_bytes(65535) == [0xff, 0xff]);

    // Test bytes to integer conversion
    assert(bytes_to_u32([]) == 0);
    assert(bytes_to_u32([0x01]) == 1);
    assert(bytes_to_u32([0xff]) == 255);
    assert(bytes_to_u32([0x01, 0x00]) == 256);
    assert(bytes_to_u32([0xff, 0xff]) == 65535);
}

#[test]
fn test_malformed_rlp_handling() {
    // Test handling of malformed RLP data

    // Empty input should fail gracefully
    let empty_input: [u8; 0] = [];
    // Note: In practice, you'd want to return an error type
    // For this exercise, we'll assume invalid inputs cause assertion failures

    // Invalid long string length
    let invalid_long = [0xb8]; // Says it's a long string but no length follows
    // This should be handled gracefully in a production implementation

    // These tests demonstrate the need for proper error handling
    // which could be implemented with Result types in a real system
}
```
