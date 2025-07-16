---
id: pedersen_hash
title: pedersen_hash
category: hashes
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: |-
      No hint this time

    description: |-
      Understanding Pedersen Hash

      Pedersen hash is a cryptographic hash function based on elliptic curve operations.
      It is widely used in zero-knowledge proofs and privacy-preserving blockchain applications.

      Key Properties of Pedersen hash:
      1. It's a one-way function(difficult to reverse)
      2. It has collision resistance(hard to find two inputs that hash to the same output)
      3. Its deterministic(same input always produces the same output)
      4. It has homomorphic properties(especially useful in zero-knowledge proofs)

      In this exercise, you will:
      1. Compute a basic Pedersen hash
      2. Verify its deterministic property
      3. Explore how changes to input affect the output (avalanche effect)

    docLink: "https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives/hashes"
---

Understanding Pedersen Hash

Pedersen hash is a cryptographic hash function based on elliptic curve operations.
It is widely used in zero-knowledge proofs and privacy-preserving blockchain applications.

Key Properties of Pedersen hash:

1. It's a one-way function(difficult to reverse)
2. It has collision resistance(hard to find two inputs that hash to the same output)
3. Its deterministic(same input always produces the same output)
4. It has homomorphic properties(especially useful in zero-knowledge proofs)

In this exercise, you will:

1. Compute a basic Pedersen hash
2. Verify its deterministic property
3. Explore how changes to input affect the output (avalanche effect)

```noir

```
