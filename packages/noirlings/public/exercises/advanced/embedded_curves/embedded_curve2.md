---
id: embedded_curve2
title: embedded_curve2
category: embedded_curves
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Implement the required methods by understanding elliptic curve group properties:

      1. **Generator Point**: Every elliptic curve has a generator point G that generates the cyclic group. For Grumpkin curve, the generator has:
         - x-coordinate: 1 (simple base point)
         - y-coordinate: A specific large value (check Grumpkin curve specification)
         - is_infinite: false (it's a regular point, not the identity)

      2. **Point At Infinity**: The additive identity element of the elliptic curve group:
         - Represents the "zero" element in elliptic curve addition
         - By convention: x=0, y=0, is_infinite=true
         - For any point P: P + O = O + P = P (where O is point at infinity)

      3. **Point Negation**: In elliptic curve groups, negation flips the point across the x-axis:
         - Same x-coordinate (point stays on same vertical line)
         - Opposite y-coordinate (reflection across x-axis)
         - Same infinity status (finite points stay finite)
         - Mathematical property: P + (-P) = O (point at infinity)

    description: >-
      Curve operations form the basis of many ZK protocols - understanding
      points, generators, and group operations is essential


      #### Docs
    docLink: >-
      https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives/embedded_curve_ops#point-operations
---

```noir
struct EmbeddedCurvePoint {
    x: Field,
    y: Field,
    is_infinite: bool,
}

impl EmbeddedCurvePoint {
    // TODO: Implement a function called 'generator' that returns
    // the generator point for the Grumpkin curve (y^2 = x^3 - 17)
    // The x-coordinate is 1, and the y-coordinate is the square root of -16
    pub fn generator() -> EmbeddedCurvePoint {
        //TODO
    }

    // TODO: Implement a function called 'point_at_infinity' that returns
    // the point at infinity (the identity element of the curve)
    // HINT: Look at the test cases
    pub fn point_at_infinity() -> EmbeddedCurvePoint {
        //TODO
    }

    // TODO: Implement the negation of a point by implementing the function 'neg'
    // The negation of a point (x,y) is (x,-y)
    // If the point is at infinity, the result should also be at infinity
    pub fn neg(self) -> EmbeddedCurvePoint {
        // TODO
    }
}

fn main() {
    // Test the generator point
    let g = EmbeddedCurvePoint::generator();
    assert(g.x == 1);
    assert(g.y == 17631683881184975370165255887551781615748388533673675138860);
    assert(!g.is_infinite);

    // Test the point at infinity
    let infinity = EmbeddedCurvePoint::point_at_infinity();
    assert(infinity.x == 0);
    assert(infinity.y == 0);
    assert(infinity.is_infinite);

    // Test negation
    let p = EmbeddedCurvePoint { x: 5, y: 10, is_infinite: false };

    let neg_p = p.neg();
    assert(neg_p.x == 5);
    assert(neg_p.y == -10);
    assert(!neg_p.is_infinite);

    // Test negation of point at infinity
    let neg_infinity = infinity.neg();
    assert(neg_infinity.is_infinite);
}

#[test]
fn test_embedded_curve_methods() {
    main();
}

```
