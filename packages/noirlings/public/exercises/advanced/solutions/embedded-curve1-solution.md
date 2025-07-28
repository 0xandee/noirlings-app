# Embedded Curve Points - Solution

## Exercise ID: embedded_curve1

**Category:** embedded_curves  
**Difficulty:** easy  
**Prerequisites:** []

## Description

Learn to define elliptic curve points with x, y coordinates and infinity flag. Embedded curves enable efficient cryptographic operations within zero-knowledge circuits.

## Solution

```noir
// Define the embedded curve point structure
struct EmbeddedCurvePoint {
    x: Field,
    y: Field,
    is_infinite: bool,
}

impl EmbeddedCurvePoint {
    // Create a new point
    fn new(x: Field, y: Field) -> Self {
        EmbeddedCurvePoint {
            x,
            y,
            is_infinite: false,
        }
    }

    // Create the point at infinity
    fn infinity() -> Self {
        EmbeddedCurvePoint {
            x: 0,
            y: 0,
            is_infinite: true,
        }
    }

    // Check if this point is the point at infinity
    fn is_infinity(self) -> bool {
        self.is_infinite
    }

    // Check if two points are equal
    fn eq(self, other: EmbeddedCurvePoint) -> bool {
        if self.is_infinite & other.is_infinite {
            true
        } else if self.is_infinite | other.is_infinite {
            false
        } else {
            (self.x == other.x) & (self.y == other.y)
        }
    }
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

    // Test constructor methods
    let constructed_point = EmbeddedCurvePoint::new(3, 4);
    assert(constructed_point.x == 3);
    assert(constructed_point.y == 4);
    assert(!constructed_point.is_infinite);

    let constructed_infinity = EmbeddedCurvePoint::infinity();
    assert(constructed_infinity.is_infinite);

    // Test equality
    let point1 = EmbeddedCurvePoint::new(5, 6);
    let point2 = EmbeddedCurvePoint::new(5, 6);
    let point3 = EmbeddedCurvePoint::new(7, 8);

    assert(point1.eq(point2));
    assert(!point1.eq(point3));

    let inf1 = EmbeddedCurvePoint::infinity();
    let inf2 = EmbeddedCurvePoint::infinity();
    assert(inf1.eq(inf2));
    assert(!inf1.eq(point1));
}

#[test]
fn test_embedded_curve_point() {
    main();
}

#[test]
fn test_point_creation() {
    // Test different point creations
    let origin = EmbeddedCurvePoint::new(0, 0);
    assert(origin.x == 0);
    assert(origin.y == 0);
    assert(!origin.is_infinite);

    let large_coords = EmbeddedCurvePoint::new(
        21888242871839275222246405745257275088548364400416034343698204186575808495617,
        21888242871839275222246405745257275088548364400416034343698204186575808495616
    );
    assert(!large_coords.is_infinite);
}

#[test]
fn test_infinity_properties() {
    let inf1 = EmbeddedCurvePoint::infinity();
    let inf2 = EmbeddedCurvePoint { x: 0, y: 0, is_infinite: true };

    // Both ways of creating infinity should be equivalent
    assert(inf1.eq(inf2));
    assert(inf1.is_infinity());
    assert(inf2.is_infinity());

    // Infinity should not equal regular points even with same coordinates
    let regular_origin = EmbeddedCurvePoint::new(0, 0);
    assert(!inf1.eq(regular_origin));
}

#[test]
fn test_point_inequality() {
    let p1 = EmbeddedCurvePoint::new(1, 2);
    let p2 = EmbeddedCurvePoint::new(1, 3); // Different y
    let p3 = EmbeddedCurvePoint::new(2, 2); // Different x
    let p4 = EmbeddedCurvePoint::new(2, 3); // Different x and y

    assert(!p1.eq(p2));
    assert(!p1.eq(p3));
    assert(!p1.eq(p4));
    assert(!p2.eq(p3));
    assert(!p2.eq(p4));
    assert(!p3.eq(p4));
}
```

## Key Concepts

1. **Elliptic Curve Point Structure**: Points are represented with (x, y) coordinates plus an infinity flag
2. **Point at Infinity**: Special point that serves as the identity element in elliptic curve addition
3. **Field Elements**: Coordinates are Field elements, allowing for large prime field arithmetic
4. **Infinity Flag**: Boolean flag distinguishing regular points from the point at infinity
5. **Equality Testing**: Points are equal if they have same coordinates and infinity status

## Mathematical Background

In elliptic curve cryptography:

- Points lie on curves of the form y² = x³ + ax + b
- The point at infinity (O) is the identity element for group operations
- All points plus the point at infinity form an abelian group
- Group operations (addition, scalar multiplication) are used for cryptographic operations

## Usage in Zero-Knowledge Proofs

Embedded curves are used in ZK circuits for:

- Signature verification (ECDSA, EdDSA)
- Commitment schemes (Pedersen commitments)
- Hash functions (Pedersen hash)
- Range proofs and other cryptographic protocols

## Documentation

- [Noir Embedded Curve Documentation](https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives/embedded_curve_ops#curve-points)
