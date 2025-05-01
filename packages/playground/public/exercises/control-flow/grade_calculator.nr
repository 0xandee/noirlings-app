fn grade_calculator(score: u8) -> str<1> {
    assert(score >= 0, "Score should be greater than or equal to 0");
    assert(score <= 100, "Score should be less than or equal to 100");

    let mut grade = "F";
    if score >= 90 {
        grade = "A";
    }
    // Write code here
    grade
}

#[test]
fn test_grade_calculator() {
    assert(grade_calculator(95) == "A");
    assert(grade_calculator(85) == "B");
    assert(grade_calculator(75) == "C");
    assert(grade_calculator(65) == "D");
    assert(grade_calculator(55) == "F");
}

// Additional note: You can test edge cases like 90, 89, 80, etc.
#[test]
fn test_edge_cases() {
    assert(grade_calculator(90) == "A");
    assert(grade_calculator(89) == "B");
    assert(grade_calculator(80) == "B");
    assert(grade_calculator(70) == "C");
    assert(grade_calculator(60) == "D");
}
