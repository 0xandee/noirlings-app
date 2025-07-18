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
    hint: No hint this time
    description: Change `can_vote` method to make test cases pass.
    docLink: 'https://noir-lang.org/docs/dev/noir/concepts/control_flow'
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
