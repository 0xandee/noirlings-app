---
id: field1
title: field1
category: fields
difficulty: easy
tags: []
mode: compile
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: |-
      value of p-1 is multiplication inverse of it self. i.e. (p-1) * (p-1) = 1.
      
      To understand this, you have to first understand the modular arithmetic: c = a + b (mod p) where `a` and `b` are numbers in the finite field, `c` is the remainder that maps any number >=p and <0 back in the set {0,1,2,...p-1}
      
      The notation means all arithmetic is done modulo p, for example 
      
      for p = 7, 1 = 8 (mod 7)
      
       0 = 6+1(mod 7)
      
       0 = p (mod p)
      
      with this lets expand (p-1) * (p-1) = p^2 - 2p + 1 (mod p)
      since p mod p is zero we can discard p^2 - 2p
      hence (p-1) * (p-1) = 1
      
    description: |-
      For Noir default backend, Grumpkin curve, order of the field value P is: `21888242871839275222246405745257275088548364400416034343698204186575808495617`
      
---

For Noir default backend, Grumpkin curve, order of the field value P is: `21888242871839275222246405745257275088548364400416034343698204186575808495617`


```noir
fn main() {
  let p: Field = 21888242871839275222246405745257275088548364400416034343698204186575808495616;

  let p1: Field = p + 1;

  // TODO: replace ? with correct p1 value
  assert(p1 == 0, "incorrect p1 value");

  let p2: Field = p * p;
  // TODO: replace ? with correct p1 value
  assert(p2 == ?, "incorrect p2 value");
}



```
