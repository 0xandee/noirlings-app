---
id: integer1
title: integer1
category: integers
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Regular arithmetic can overflow. Look for 'wrapping' methods that handle
      overflow safely. Check the `use std::ops::` import section.
    description: >-
      ZK circuits need predictable behavior - wrapping methods provide safe
      arithmetic that won't cause constraint system failures


      #### Docs
    docLink: >-
      https://noir-lang.org/docs/noir/concepts/data_types/integers#wrapping-methods
---
```noir
use std::{wrapping_add, wrapping_mul};

fn calculate_game_score(kills: u8, deaths: u8, assists: u8) -> u8 {
    // TODO: Calculate player score using formula:
    // score = (kills * 2) + assists - deaths
    // Use wrapping_add and wrapping_sub to handle overflow
    // If deaths are more than kills*2 + assists, return 0
}

fn main() {
    // Normal case
    assert(calculate_game_score(10, 5, 3) == 18);

    assert(calculate_game_score(255, 1, 1) == 254); // Should wrap around

    // Deaths > kills*2 + assists
    assert(calculate_game_score(1, 10, 2) == 0);
}

#[test]
fn test_game_score() {
    main();
}

```
