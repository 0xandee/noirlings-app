---
id: rlp_basics
title: rlp_basics
category: ethereum
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      RLP (Recursive Length Prefix) decoding parses Ethereum's serialization format. Start with basic types: single bytes, short strings, and simple lists.

      1. RLP Item Structure

      ```noir
      enum RLPItem {
          Bytes([u8]),
          List([RLPItem]),
      }
      ```

      2. Basic Decoding Logic

      ```noir
      fn decode_rlp(encoded: [u8]) -> RLPItem {
          if encoded.len() == 0 {
              return RLPItem::Bytes([]);
          }
          
          let first_byte = encoded[0];
          
          if first_byte <= 0x7f {
              // Single byte
              RLPItem::Bytes([first_byte])
          } else if first_byte <= 0xb7 {
              // Short string
              let length = (first_byte - 0x80) as u32;
              let mut bytes = [0; length];
              for i in 0..length {
                  bytes[i] = encoded[1 + i];
              }
              RLPItem::Bytes(bytes)
          } else if first_byte <= 0xf7 {
              // Short list
              decode_short_list(encoded)
          } else {
              // Long list (advanced)
              decode_long_list(encoded)
          }
      }
      ```

      3. Item Type Checking

      ```noir
      impl RLPItem {
          fn is_bytes(self) -> bool {
              match self {
                  RLPItem::Bytes(_) => true,
                  RLPItem::List(_) => false
              }
          }
          
          fn as_bytes(self) -> [u8] {
              match self {
                  RLPItem::Bytes(bytes) => bytes,
                  RLPItem::List(_) => [] // Error case
              }
          }
      }
      ```

      4. Short List Decoding

      ```noir
      fn decode_short_list(encoded: [u8]) -> RLPItem {
          let first_byte = encoded[0];
          let length = (first_byte - 0xc0) as u32;
          let mut items = [];
          let mut offset = 1;
          
          while offset < (1 + length) {
              let (item, new_offset) = decode_item_at_offset(encoded, offset);
              items.push(item);
              offset = new_offset;
          }
          
          RLPItem::List(items)
      }
      ```
    description: >-
      RLP (Recursive Length Prefix) is Ethereum's serialization format for encoding arbitrary data structures. Learn to decode basic RLP types including single bytes, strings, and simple lists.

      In this exercise, you will:
      1. Understand RLP encoding rules and data types
      2. Decode single bytes and short strings
      3. Parse simple lists and nested structures
      4. Implement basic RLP item operations

      #### Docs
    docLink: "https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/"
---

```noir
// RLP decoding constants
global RLP_SINGLE_BYTE_MAX: u8 = 0x7f;
global RLP_SHORT_STRING_OFFSET: u8 = 0x80;
global RLP_LONG_STRING_OFFSET: u8 = 0xb7;
global RLP_SHORT_LIST_OFFSET: u8 = 0xc0;
global RLP_LONG_LIST_OFFSET: u8 = 0xf7;

// RLP Item represents decoded RLP data
enum RLPItem {
    Bytes([u8]),      // String/bytes data
    List([RLPItem]),  // List of items
}

impl RLPItem {
    // TODO: Check if item contains bytes
    fn is_bytes(self) -> bool {
        // Hint: Match on enum variants
        todo!()
    }

    // TODO: Check if item is a list
    fn is_list(self) -> bool {
        // Hint: Match on enum variants
        todo!()
    }

    // TODO: Get bytes from item (fails if it's a list)
    fn as_bytes(self) -> [u8] {
        // Hint: Extract bytes, return empty array on error
        todo!()
    }

    // TODO: Get list from item (fails if it's bytes)
    fn as_list(self) -> [RLPItem] {
        // Hint: Extract list, return empty array on error
        todo!()
    }

    // TODO: Get the length of the item
    fn length(self) -> u32 {
        // Hint: Return bytes length or list length
        todo!()
    }
}

// TODO: Main RLP decoding function
fn decode_rlp(encoded: [u8]) -> RLPItem {
    // Hint:
    // 1. Check if empty input
    // 2. Examine first byte to determine type
    // 3. Route to appropriate decoding function
    todo!()
}

// TODO: Decode single byte (0x00 to 0x7f)
fn decode_single_byte(encoded: [u8]) -> RLPItem {
    // Hint: First byte is the actual data
    todo!()
}

// TODO: Decode short string (0x80 to 0xb7)
fn decode_short_string(encoded: [u8]) -> RLPItem {
    // Hint:
    // 1. Length = first_byte - 0x80
    // 2. Extract next 'length' bytes
    todo!()
}

// TODO: Decode empty string (0x80)
fn decode_empty_string() -> RLPItem {
    // Hint: Return empty bytes
    todo!()
}

// TODO: Decode short list (0xc0 to 0xf7)
fn decode_short_list(encoded: [u8]) -> RLPItem {
    // Hint:
    // 1. Length = first_byte - 0xc0
    // 2. Recursively decode items within list payload
    todo!()
}

// TODO: Decode list items recursively
fn decode_list_items(encoded: [u8], start_offset: u32, end_offset: u32) -> [RLPItem] {
    // Hint: Parse items from start_offset to end_offset
    todo!()
}

// TODO: Decode item at specific offset
fn decode_item_at_offset(encoded: [u8], offset: u32) -> (RLPItem, u32) {
    // Returns: (decoded_item, next_offset)
    // Hint: Decode one item and return new offset position
    todo!()
}

// Basic utility functions
fn is_single_byte(first_byte: u8) -> bool {
    // TODO: Check if byte represents single byte value
    // Hint: Compare with RLP_SINGLE_BYTE_MAX
    todo!()
}

fn is_short_string(first_byte: u8) -> bool {
    // TODO: Check if byte represents short string
    // Hint: Between RLP_SHORT_STRING_OFFSET and RLP_LONG_STRING_OFFSET
    todo!()
}

fn is_short_list(first_byte: u8) -> bool {
    // TODO: Check if byte represents short list
    // Hint: Between RLP_SHORT_LIST_OFFSET and RLP_LONG_LIST_OFFSET
    todo!()
}

// RLP Item comparison and utilities
fn rlp_items_equal(item1: RLPItem, item2: RLPItem) -> bool {
    // TODO: Compare two RLP items for equality
    // Hint: Handle both bytes and list cases recursively
    todo!()
}

fn get_rlp_item_at_index(list: RLPItem, index: u32) -> RLPItem {
    // TODO: Get item at specific index in RLP list
    // Hint: Extract list and return item at index
    todo!()
}

fn main(
    encoded_single: [u8; 1],
    encoded_string: [u8; 6],
    encoded_list: [u8; 4]
) -> pub bool {
    // Test single byte decoding
    let single_item = decode_rlp(encoded_single);
    let single_valid = single_item.is_bytes();

    // Test string decoding
    let string_item = decode_rlp(encoded_string);
    let string_valid = string_item.is_bytes();

    // Test list decoding
    let list_item = decode_rlp(encoded_list);
    let list_valid = list_item.is_list();

    single_valid & string_valid & list_valid
}

#[test]
fn test_single_byte_decoding() {
    // Test single byte: 0x42
    let encoded = [0x42];
    let decoded = decode_rlp(encoded);

    assert(decoded.is_bytes());
    assert(!decoded.is_list());

    let bytes = decoded.as_bytes();
    assert(bytes.len() == 1);
    assert(bytes[0] == 0x42);
}

#[test]
fn test_empty_string_decoding() {
    // Test empty string: 0x80
    let encoded = [0x80];
    let decoded = decode_rlp(encoded);

    assert(decoded.is_bytes());
    let bytes = decoded.as_bytes();
    assert(bytes.len() == 0);
}

#[test]
fn test_short_string_decoding() {
    // Test "hello": [0x85, 'h', 'e', 'l', 'l', 'o']
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
fn test_empty_list_decoding() {
    // Test empty list: 0xc0
    let encoded = [0xc0];
    let decoded = decode_rlp(encoded);

    assert(decoded.is_list());
    assert(!decoded.is_bytes());

    let list = decoded.as_list();
    assert(list.len() == 0);
}

#[test]
fn test_simple_list_decoding() {
    // Test list: ["cat", "dog"]
    // Encoded as: [0xc8, 0x83, 'c', 'a', 't', 0x83, 'd', 'o', 'g']
    let encoded = [
        0xc8,                     // List with 8 bytes payload
        0x83, 0x63, 0x61, 0x74,   // "cat"
        0x83, 0x64, 0x6f, 0x67    // "dog"
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
fn test_nested_list_decoding() {
    // Test nested list: [[], [""]]
    let encoded = [
        0xc4,       // List with 4 bytes
        0xc0,       // Empty list
        0xc1, 0x80  // List containing empty string
    ];

    let decoded = decode_rlp(encoded);

    assert(decoded.is_list());
    let list = decoded.as_list();
    assert(list.len() == 2);

    // First item: empty list
    assert(list[0].is_list());
    let empty_list = list[0].as_list();
    assert(empty_list.len() == 0);

    // Second item: list containing empty string
    assert(list[1].is_list());
    let nested_list = list[1].as_list();
    assert(nested_list.len() == 1);
    assert(nested_list[0].is_bytes());
    let empty_string = nested_list[0].as_bytes();
    assert(empty_string.len() == 0);
}

#[test]
fn test_rlp_item_operations() {
    let bytes_item = RLPItem::Bytes([1, 2, 3]);
    let list_item = RLPItem::List([bytes_item]);

    // Test type checking
    assert(bytes_item.is_bytes());
    assert(!bytes_item.is_list());
    assert(list_item.is_list());
    assert(!list_item.is_bytes());

    // Test length
    assert(bytes_item.length() == 3);
    assert(list_item.length() == 1);

    // Test extraction
    let extracted_bytes = bytes_item.as_bytes();
    assert(extracted_bytes.len() == 3);
    assert(extracted_bytes[0] == 1);

    let extracted_list = list_item.as_list();
    assert(extracted_list.len() == 1);
}

#[test]
fn test_utility_functions() {
    // Test type detection
    assert(is_single_byte(0x42));
    assert(!is_single_byte(0x80));

    assert(is_short_string(0x85));
    assert(!is_short_string(0x42));
    assert(!is_short_string(0xc0));

    assert(is_short_list(0xc5));
    assert(!is_short_list(0x85));

    // Test item comparison
    let item1 = RLPItem::Bytes([1, 2, 3]);
    let item2 = RLPItem::Bytes([1, 2, 3]);
    let item3 = RLPItem::Bytes([1, 2, 4]);

    assert(rlp_items_equal(item1, item2));
    assert(!rlp_items_equal(item1, item3));
}

#[test]
fn test_list_access() {
    let item1 = RLPItem::Bytes([1]);
    let item2 = RLPItem::Bytes([2]);
    let list = RLPItem::List([item1, item2]);

    let first_item = get_rlp_item_at_index(list, 0);
    assert(first_item.is_bytes());
    let first_bytes = first_item.as_bytes();
    assert(first_bytes[0] == 1);

    let second_item = get_rlp_item_at_index(list, 1);
    assert(second_item.is_bytes());
    let second_bytes = second_item.as_bytes();
    assert(second_bytes[0] == 2);
}

#[test]
fn test_complex_nested_structure() {
    // Test: [["a", "b"], ["c"]]
    let encoded = [
        0xca,                           // List with 10 bytes
        0xc4, 0x81, 0x61, 0x81, 0x62,   // ["a", "b"]
        0xc2, 0x81, 0x63                // ["c"]
    ];

    let decoded = decode_rlp(encoded);

    assert(decoded.is_list());
    let main_list = decoded.as_list();
    assert(main_list.len() == 2);

    // First sublist: ["a", "b"]
    assert(main_list[0].is_list());
    let first_sublist = main_list[0].as_list();
    assert(first_sublist.len() == 2);

    let a_item = first_sublist[0].as_bytes();
    assert(a_item.len() == 1);
    assert(a_item[0] == 0x61); // 'a'

    let b_item = first_sublist[1].as_bytes();
    assert(b_item.len() == 1);
    assert(b_item[0] == 0x62); // 'b'

    // Second sublist: ["c"]
    assert(main_list[1].is_list());
    let second_sublist = main_list[1].as_list();
    assert(second_sublist.len() == 1);

    let c_item = second_sublist[0].as_bytes();
    assert(c_item.len() == 1);
    assert(c_item[0] == 0x63); // 'c'
}

#[test]
fn test_mixed_data_types() {
    // Test list containing both single bytes and strings
    let encoded = [
        0xc6,               // List with 6 bytes
        0x42,               // Single byte: 0x42
        0x82, 0x68, 0x69,   // String: "hi"
        0x00                // Single byte: 0x00
    ];

    let decoded = decode_rlp(encoded);

    assert(decoded.is_list());
    let list = decoded.as_list();
    assert(list.len() == 3);

    // First item: single byte 0x42
    let first = list[0].as_bytes();
    assert(first.len() == 1);
    assert(first[0] == 0x42);

    // Second item: string "hi"
    let second = list[1].as_bytes();
    assert(second.len() == 2);
    assert(second[0] == 0x68); // 'h'
    assert(second[1] == 0x69); // 'i'

    // Third item: single byte 0x00
    let third = list[2].as_bytes();
    assert(third.len() == 1);
    assert(third[0] == 0x00);
}
```
