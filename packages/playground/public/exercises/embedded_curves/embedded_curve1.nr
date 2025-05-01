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
