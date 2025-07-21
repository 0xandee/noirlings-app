---
id: rlp_encoding
title: rlp_encoding
category: ethereum
difficulty: medium
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      RLP encoding uses different rules for single bytes, strings, and lists based on their length. Implement each encoding type with proper length prefixes.

      1. Single Byte Encoding

      ```noir

      fn encode_single_byte(byte: u8) -> [u8] {
          if byte <= RLP_SINGLE_BYTE_MAX {
              [byte]
          } else {
              [RLP_SHORT_STRING_OFFSET + 1, byte]
          }
      }

      ```

      2. Byte Array Encoding

      ```noir

      fn encode_bytes(data: [u8]) -> [u8] {
          let len = data.len();
          
          if len == 0 {
              return [RLP_SHORT_STRING_OFFSET];
          }
          
          if len == 1 && data[0] <= RLP_SINGLE_BYTE_MAX {
              return [data[0]];
          }
          
          if len <= 55 {
              let mut result = [0; len + 1];
              result[0] = RLP_SHORT_STRING_OFFSET + len as u8;
              for i in 0..len {
                  result[i + 1] = data[i];
              }
              return result;
          } else {
              let length_bytes = to_minimal_bytes(len as u32);
              let mut result = [0; 1 + length_bytes.len() + len];
              result[0] = RLP_LONG_STRING_OFFSET + length_bytes.len() as u8;
              for i in 0..length_bytes.len() {
                  result[i + 1] = length_bytes[i];
              }
              for i in 0..len {
                  result[1 + length_bytes.len() + i] = data[i];
              }
              return result;
          }
      }

      ```

      3. List Encoding

      ```noir

      fn encode_list(items: [[u8]]) -> [u8] {
          let mut total_length = 0;
          for item in items {
              total_length += item.len();
          }
          
          if total_length <= 55 {
              let mut result = [0; 1 + total_length];
              result[0] = RLP_SHORT_LIST_OFFSET + total_length as u8;
              let mut offset = 1;
              for item in items {
                  for i in 0..item.len() {
                      result[offset + i] = item[i];
                  }
                  offset += item.len();
              }
              return result;
          } else {
              let length_bytes = to_minimal_bytes(total_length as u32);
              let mut result = [0; 1 + length_bytes.len() + total_length];
              result[0] = RLP_LONG_LIST_OFFSET + length_bytes.len() as u8;
              for i in 0..length_bytes.len() {
                  result[i + 1] = length_bytes[i];
              }
              let mut offset = 1 + length_bytes.len();
              for item in items {
                  for i in 0..item.len() {
                      result[offset + i] = item[i];
                  }
                  offset += item.len();
              }
              return result;
          }
      }

      ```

      4. Length Encoding Helper

      ```noir

      fn to_minimal_bytes(value: u32) -> [u8] {
          if value == 0 {
              return [];
          }
          
          let mut bytes = [0; 4];
          bytes[0] = ((value >> 24) & 0xFF) as u8;
          bytes[1] = ((value >> 16) & 0xFF) as u8;
          bytes[2] = ((value >> 8) & 0xFF) as u8;
          bytes[3] = (value & 0xFF) as u8;
          
          // Find first non-zero byte
          let mut start = 0;
          while start < 4 && bytes[start] == 0 {
              start += 1;
          }
          
          let result_len = 4 - start;
          let mut result = [0; result_len];
          for i in 0..result_len {
              result[i] = bytes[start + i];
          }
          
          result
      }

      ```

      5. Transaction Encoding

      ```noir

      impl EthereumTransaction {
          fn encode(&self) -> [u8] {
              let nonce_bytes = encode_integer(self.nonce);
              let gas_price_bytes = encode_integer(self.gas_price);
              let gas_limit_bytes = encode_integer(self.gas_limit);
              let to_bytes = encode_bytes(self.to);
              let value_bytes = encode_integer(self.value);
              let data_bytes = encode_bytes(self.data);
              
              let fields = [
                  nonce_bytes,
                  gas_price_bytes,
                  gas_limit_bytes,
                  to_bytes,
                  value_bytes,
                  data_bytes
              ];
              
              encode_list(fields)
          }
      }

      ```
    description: >-
      RLP (Recursive Length Prefix) is Ethereum's encoding scheme for serializing arbitrary data structures. Learn to implement RLP encoding to serialize transactions, blocks, and state data for use in zero-knowledge proofs and blockchain verification.

      #### Docs
    docLink: "https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/"
---

````noir
// RLP encoding implementation for Noir

global RLP_SINGLE_BYTE_MAX: u8 = 0x7f;
global RLP_SHORT_STRING_OFFSET: u8 = 0x80;
global RLP_LONG_STRING_OFFSET: u8 = 0xb7;
global RLP_SHORT_LIST_OFFSET: u8 = 0xc0;
global RLP_LONG_LIST_OFFSET: u8 = 0xf7;

// TODO: Encode a single byte according to RLP rules
fn encode_single_byte(byte: u8) -> [u8] {
    // Hint: Single bytes [0x00, 0x7f] are encoded as themselves
    // Other bytes are treated as short strings
    todo!()
}

// TODO: Encode a byte array (string) according to RLP rules
fn encode_bytes(data: [u8]) -> [u8] {
    // Hint:
    // 1. If empty, return [0x80]
    // 2. If single byte ≤ 0x7f, return the byte itself
    // 3. If length ≤ 55, use short string encoding
    // 4. If length > 55, use long string encoding
    todo!()
}

// TODO: Encode a list of RLP-encoded items
fn encode_list(items: [[u8]]) -> [u8] {
    // Hint:
    // 1. Concatenate all pre-encoded items
    // 2. If total length ≤ 55, use short list encoding
    // 3. If total length > 55, use long list encoding
    todo!()
}

// TODO: Helper function to encode length for long strings/lists
fn encode_length(length: u32) -> [u8] {
    // Hint: Convert length to minimal big-endian byte representation
    todo!()
}

// TODO: Helper function to get the minimal byte representation of a number
fn to_minimal_bytes(value: u32) -> [u8] {
    // Hint: Remove leading zeros from big-endian representation
    todo!()
}

// TODO: Encode an Ethereum transaction structure
struct EthereumTransaction {
    nonce: u32,
    gas_price: u32,
    gas_limit: u32,
    to: [u8; 20], // Ethereum address
    value: u32,
    data: [u8],
}

impl EthereumTransaction {
    // TODO: Encode the transaction using RLP
    fn encode(&self) -> [u8] {
        // Hint:
        // 1. Encode each field as bytes
        // 2. Create a list of all encoded fields
        // 3. Return RLP-encoded list
        todo!()
    }
}

// TODO: Encode an integer as minimal big-endian bytes
fn encode_integer(value: u32) -> [u8] {
    // Hint: Convert to big-endian and remove leading zeros
    // Special case: 0 should encode as empty bytes
    todo!()
}

#[test]
fn test_rlp_single_bytes() {
    // Test single byte encoding
    let byte_0x00 = encode_single_byte(0x00);
    assert(byte_0x00 == [0x00]);

    let byte_0x7f = encode_single_byte(0x7f);
    assert(byte_0x7f == [0x7f]);

    let byte_0x80 = encode_single_byte(0x80);
    assert(byte_0x80 == [0x81, 0x80]); // Short string: 0x80 + 1, then 0x80
}

#[test]
fn test_rlp_short_strings() {
    // Test empty string
    let empty = encode_bytes([]);
    assert(empty == [0x80]);

    // Test single character
    let hello_h = encode_bytes([0x68]); // 'h'
    assert(hello_h == [0x68]); // Single byte ≤ 0x7f

    // Test short string
    let hello = encode_bytes([0x68, 0x65, 0x6c, 0x6c, 0x6f]); // "hello"
    assert(hello[0] == 0x85); // 0x80 + 5
    assert(hello[1] == 0x68);
    assert(hello[2] == 0x65);
    assert(hello[3] == 0x6c);
    assert(hello[4] == 0x6c);
    assert(hello[5] == 0x6f);
}

#[test]
fn test_rlp_long_strings() {
    // Test long string (> 55 bytes)
    let mut long_data = [0u8; 60];
    for i in 0..60 {
        long_data[i] = (i % 256) as u8;
    }

    let encoded = encode_bytes(long_data);
    assert(encoded[0] == 0xb8); // 0xb7 + 1 (length of length)
    assert(encoded[1] == 60); // Length in 1 byte
    // Rest should be the original data
    for i in 0..60 {
        assert(encoded[i + 2] == long_data[i]);
    }
}

#[test]
fn test_rlp_empty_list() {
    let empty_list = encode_list([]);
    assert(empty_list == [0xc0]);
}

#[test]
fn test_rlp_short_list() {
    // List of two short strings: ["cat", "dog"]
    let cat = encode_bytes([0x63, 0x61, 0x74]); // "cat"
    let dog = encode_bytes([0x64, 0x6f, 0x67]); // "dog"

    let list = encode_list([cat, dog]);

    // Should be: 0xc8 (0xc0 + 8) + cat_encoded + dog_encoded
    assert(list[0] == 0xc8); // 0xc0 + total_length

    // Verify the concatenated items follow
    let cat_start = 1;
    let dog_start = cat_start + cat.len();

    for i in 0..cat.len() {
        assert(list[cat_start + i] == cat[i]);
    }

    for i in 0..dog.len() {
        assert(list[dog_start + i] == dog[i]);
    }
}

#[test]
fn test_rlp_nested_list() {
    // Test nested structure: [[], [[]]]
    let empty_list = encode_list([]);
    let nested_empty = encode_list([empty_list]);
    let double_nested = encode_list([empty_list, nested_empty]);

    // Verify structure is correct
    assert(empty_list == [0xc0]);
    assert(nested_empty[0] == 0xc1); // 0xc0 + 1
    assert(nested_empty[1] == 0xc0);
}

#[test]
fn test_integer_encoding() {
    // Test integer encoding rules
    assert(encode_integer(0) == []); // 0 encodes as empty
    assert(encode_integer(1) == [0x01]);
    assert(encode_integer(127) == [0x7f]);
    assert(encode_integer(128) == [0x80]);
    assert(encode_integer(256) == [0x01, 0x00]);
    assert(encode_integer(1024) == [0x04, 0x00]);
}

#[test]
fn test_ethereum_transaction_encoding() {
    let tx = EthereumTransaction {
        nonce: 9,
        gas_price: 20000000000, // 20 Gwei
        gas_limit: 21000,
        to: [
            0xd1, 0x22, 0x0a, 0x0c, 0xf4, 0x75, 0xa9, 0x66,
            0xe5, 0x4d, 0x11, 0xe9, 0xf3, 0x55, 0x4e, 0x4e,
            0xba, 0x6f, 0xa5, 0x7a
        ],
        value: 1000000000000000000, // 1 ETH in wei
        data: [], // No data
    };

    let encoded = tx.encode();

    // Verify it's a valid RLP list
    assert(encoded[0] >= 0xc0); // Should be a list

    // Should contain all transaction fields
    // This is a basic structure test - exact bytes depend on implementation
    assert(encoded.len() > 10); // Should have reasonable length
}

#[test]
fn test_rlp_deterministic() {
    // Test that encoding is deterministic
    let data = [0x01, 0x02, 0x03];
    let encoded1 = encode_bytes(data);
    let encoded2 = encode_bytes(data);

    assert(encoded1.len() == encoded2.len());
    for i in 0..encoded1.len() {
        assert(encoded1[i] == encoded2[i]);
    }
}

## Verification

Run `nargo test` to verify your implementation. The tests check:

1. **Single byte encoding**: Correctly handle bytes ≤ 0x7f vs > 0x7f
2. **String encoding**: Handle empty, short, and long strings correctly
3. **List encoding**: Handle empty, short, and long lists correctly
4. **Nested structures**: Properly encode lists containing other lists
5. **Integer encoding**: Follow Ethereum's integer encoding rules
6. **Transaction encoding**: Encode real Ethereum transaction structures
7. **Deterministic**: Same input always produces same output

## RLP Decoding (Extension)

Once encoding is working, you can extend to implement RLP decoding:

```noir
// TODO: Decode RLP-encoded data back to original structure
fn decode_rlp(encoded: [u8]) -> RLPItem {
    // This would be the inverse of encoding operations
    todo!()
}

enum RLPItem {
    Bytes([u8]),
    List([RLPItem]),
}
````
