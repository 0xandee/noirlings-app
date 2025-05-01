fn equality(inputs: [u32; 3]) -> bool {
    //TODO
}

#[test]
fn test_equality_true() {
    let result = equality([7, 7, 7]);
    assert(result == true, "Should be true")
}

#[test]
fn test_equality_false() {
    let result = equality([1, 1, 2]);
    println("h3llo");
    assert(result == false, "Should be false")
}
