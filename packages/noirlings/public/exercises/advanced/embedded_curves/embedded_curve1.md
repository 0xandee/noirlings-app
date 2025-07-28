---
id: embedded_curve1
title: embedded_curve1
category: embedded_curves
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Define a struct with three fields: `x: Field`, `y: Field`, and
      `is_infinite: bool`. This represents a point on an elliptic curve.
    description: >-
      Learn to define elliptic curve points with x, y coordinates and infinity flag. Embedded curves enable efficient cryptographic operations within zero-knowledge circuits.


      #### Docs
    docLink: >-
      https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives/embedded_curve_ops#curve-points
---

```noir
struct EmbeddedCurvePoint {
    x: Field,
    y: Field,
    is_infinite: bool,
}

fn main() {
    // Create a regular point
    let point = EmbeddedCurvePoint { x: 1, y: 2, is_infinite: false };

    // Create a point at infinity
    let infinity = EmbeddedCurvePoint { x: 0, y: 0, is_infinite: true };

    // Test regular point
    assert(point.x == 1);
    assert(point.y == 2);
    assert(!point.is_infinite);

    // Test point at infinity
    assert(infinity.is_infinite);
}

#[test]
fn test_embedded_curve_point() {
    main();
}

```
