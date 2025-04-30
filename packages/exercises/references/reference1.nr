fn swap_values(a: &mut Field, b: &mut Field) {
    // Your implementation here
    // Hint: You'll need a temporary variable and dereferencing
}

fn main() {
    let mut x = 5;
    let mut y = 10;

    println(f"Before swap: x = {x}, y = {y}");
    swap_values(&mut x, &mut y);
    println("After swap: x = {x}, y = {y}");
    assert(x == 10);
    assert(y == 5);
}

#[test]
fn test_swap() {
    main();
}
