---
id: if1
title: if1
category: control-flow
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      If expressions in Noir return values. Make sure your conditional logic
      returns the correct boolean value for voting eligibility.
    description: >-
      If expressions in Noir return values and must handle all code paths -
      they're expressions, not just statements


      #### Docs
    docLink: 'https://noir-lang.org/docs/noir/concepts/control_flow#if-expressions'
---
```noir
fn can_vote() -> bool {
    let age = 15; // Change this line
    let mut can_vote: bool = false;

    if age >= 18 {
        can_vote = true;
    } else {
        can_vote = false;
    }
    can_vote
}

#[test]
fn test_should_vote() {
    assert(can_vote());
}

```
