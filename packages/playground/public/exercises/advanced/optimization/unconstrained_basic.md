---
id: unconstrained_basic
title: unconstrained_basic
category: optimization
difficulty: medium
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Unconstrained functions optimize expensive computations by running outside the circuit. Implement both constrained and unconstrained versions, then verify results efficiently.

      1. Constrained Square Root (Many Constraints)

      ```noir

      fn expensive_sqrt_constrained(x: Field) -> Field {
          let mut guess = x / 2;
          
          // Newton's method - each iteration adds constraints
          for _ in 0..5 {
              guess = (guess + x / guess) / 2;
          }
          
          guess
      }

      ```

      2. Unconstrained Square Root (Zero Constraints)

      ```noir

      unconstrained fn expensive_sqrt_unconstrained(x: Field) -> Field {
          let mut guess = x / 2;
          
          // Can afford more iterations since no constraints
          for _ in 0..20 {
              guess = (guess + x / guess) / 2;
          }
          
          guess
      }

      ```

      3. Result Verification (Few Constraints)

      ```noir

      fn verify_sqrt_result(x: Field, claimed_sqrt: Field) -> bool {
          let square = claimed_sqrt * claimed_sqrt;
          let diff = if square > x { square - x } else { x - square };
          
          diff < 100  // Allow small error tolerance
      }

      ```

      4. Unconstrained Factorization

      ```noir

      unconstrained fn find_factors_unconstrained(n: Field) -> (Field, Field) {
          if n == 0 { return (0, 0); }
          if n == 1 { return (1, 1); }
          
          for i in 2..100 {
              if n % i == 0 {
                  return (i, n / i);
              }
          }
          
          (1, n)
      }

      ```

      5. Factorization Verification

      ```noir

      fn verify_factorization(n: Field, factor1: Field, factor2: Field) -> bool {
          factor1 * factor2 == n
      }

      ```

    description: >-
      Unconstrained functions optimize expensive computations by running outside the circuit with zero constraints. Learn to implement unconstrained functions and understand verification patterns for performance optimization.

      #### Docs
    docLink: >-
      https://noir-lang.org/docs/noir/concepts/unconstrained
---

```noir
// Example: Expensive computation that we want to optimize
fn expensive_sqrt_constrained(x: Field) -> Field {
    // TODO: Implement a constrained square root approximation
    // This will add many constraints to the circuit
    // Use Newton's method or binary search

    // For demonstration, we'll use a simple approximation
    let mut guess = x / 2;

    // Newton's method iterations (each adds constraints)
    for _ in 0..5 {
        guess = (guess + x / guess) / 2;
    }

    guess
}

// Unconstrained version of the same computation
unconstrained fn expensive_sqrt_unconstrained(x: Field) -> Field {
    // TODO: Implement the same square root computation
    // This runs outside the circuit, so no constraints are added
    // Can use more iterations or complex algorithms

    let mut guess = x / 2;

    // Can afford more iterations since no constraints
    for _ in 0..20 {
        guess = (guess + x / guess) / 2;
    }

    guess
}

// Verify the unconstrained result in constrained code
fn verify_sqrt_result(x: Field, claimed_sqrt: Field) -> bool {
    // TODO: Verify that claimed_sqrt is approximately sqrt(x)
    // This adds only a few constraints vs many for the full computation
    // Check: claimed_sqrt * claimed_sqrt ≈ x

    let square = claimed_sqrt * claimed_sqrt;
    let diff = if square > x { square - x } else { x - square };

    // Allow small error tolerance
    diff < 100  // Adjust tolerance as needed
}

// Unconstrained function for finding factors (expensive operation)
unconstrained fn find_factors_unconstrained(n: Field) -> (Field, Field) {
    // TODO: Find two factors of n (trial division)
    // This would be very expensive in constrained code

    if n == 0 { return (0, 0); }
    if n == 1 { return (1, 1); }

    // Try small factors first
    for i in 2..100 {
        if n % i == 0 {
            return (i, n / i);
        }
    }

    // Fallback
    (1, n)
}

// Verify factorization in constrained code
fn verify_factorization(n: Field, factor1: Field, factor2: Field) -> bool {
    // TODO: Verify that factor1 * factor2 == n
    // This is much cheaper than finding the factors

    factor1 * factor2 == n
}

// Unconstrained hash table lookup simulation
unconstrained fn hash_table_lookup_unconstrained(key: Field, table: [(Field, Field); 10]) -> Field {
    // TODO: Search for key in hash table
    // Linear search would be expensive in constrained code

    for i in 0..10 {
        if table[i].0 == key {
            return table[i].1;
        }
    }

    // Not found
    0
}

// Verify hash table result
fn verify_hash_table_result(key: Field, value: Field, table: [(Field, Field); 10]) -> bool {
    // TODO: Verify that (key, value) exists in table
    // Much more efficient than unconstrained search

    let mut found = false;
    for i in 0..10 {
        if (table[i].0 == key) & (table[i].1 == value) {
            found = true;
        }
    }
    found
}

// Demonstrate performance comparison
fn performance_comparison_example(x: Field) -> (Field, Field, bool) {
    // Compute sqrt using both methods
    let constrained_result = expensive_sqrt_constrained(x);
    let unconstrained_result = expensive_sqrt_unconstrained(x);

    // Verify the unconstrained result
    let verification_passed = verify_sqrt_result(x, unconstrained_result);

    (constrained_result, unconstrained_result, verification_passed)
}

fn main(
    x: Field,
    n: Field,
    lookup_key: Field,
    hash_table: [(Field, Field); 10]
) -> pub bool {
    // Test 1: Square root optimization
    let (constrained_sqrt, unconstrained_sqrt, sqrt_verified) = performance_comparison_example(x);

    // Test 2: Factorization
    let (factor1, factor2) = find_factors_unconstrained(n);
    let factorization_verified = verify_factorization(n, factor1, factor2);

    // Test 3: Hash table lookup
    let lookup_result = hash_table_lookup_unconstrained(lookup_key, hash_table);
    let lookup_verified = verify_hash_table_result(lookup_key, lookup_result, hash_table);

    // Test 4: Verify that unconstrained and constrained give similar results
    let sqrt_similarity = verify_sqrt_result(x, constrained_sqrt);

    sqrt_verified & factorization_verified & lookup_verified & sqrt_similarity
}

#[test]
fn test_sqrt_optimization() {
    let x = 16;

    // Both methods should give approximately the same result
    let constrained_result = expensive_sqrt_constrained(x);
    let unconstrained_result = expensive_sqrt_unconstrained(x);

    // Verify both results
    assert(verify_sqrt_result(x, constrained_result));
    assert(verify_sqrt_result(x, unconstrained_result));

    // Results should be close (allowing for different precision)
    let diff = if constrained_result > unconstrained_result {
        constrained_result - unconstrained_result
    } else {
        unconstrained_result - constrained_result
    };
    assert(diff < 2); // Allow small difference due to iteration count
}

#[test]
fn test_factorization() {
    // Test factorization of known composite numbers
    let n1 = 15; // 3 * 5
    let (f1, f2) = find_factors_unconstrained(n1);
    assert(verify_factorization(n1, f1, f2));

    let n2 = 21; // 3 * 7
    let (f3, f4) = find_factors_unconstrained(n2);
    assert(verify_factorization(n2, f3, f4));

    // Test edge cases
    let n3 = 1;
    let (f5, f6) = find_factors_unconstrained(n3);
    assert(verify_factorization(n3, f5, f6));
}

#[test]
fn test_hash_table_lookup() {
    let table = [
        (1, 100), (2, 200), (3, 300), (4, 400), (5, 500),
        (6, 600), (7, 700), (8, 800), (9, 900), (10, 1000)
    ];

    // Test successful lookups
    let result1 = hash_table_lookup_unconstrained(5, table);
    assert(verify_hash_table_result(5, result1, table));
    assert(result1 == 500);

    let result2 = hash_table_lookup_unconstrained(10, table);
    assert(verify_hash_table_result(10, result2, table));
    assert(result2 == 1000);

    // Test unsuccessful lookup
    let result3 = hash_table_lookup_unconstrained(15, table);
    assert(result3 == 0); // Should return 0 for not found
}

#[test]
fn test_verification_security() {
    // Test that verification catches incorrect results
    let x = 25;
    let correct_sqrt = 5;
    let incorrect_sqrt = 10;

    // Correct result should verify
    assert(verify_sqrt_result(x, correct_sqrt));

    // Incorrect result should not verify
    assert(!verify_sqrt_result(x, incorrect_sqrt));

    // Test factorization verification
    let n = 12;
    assert(verify_factorization(n, 3, 4)); // Correct
    assert(!verify_factorization(n, 2, 5)); // Incorrect
}

#[test]
fn test_unconstrained_function_properties() {
    // Test that unconstrained functions can perform complex operations
    let complex_input = 144;

    // Unconstrained can handle more iterations
    let unconstrained_result = expensive_sqrt_unconstrained(complex_input);

    // Should be close to 12 (sqrt of 144)
    assert(verify_sqrt_result(complex_input, unconstrained_result));

    // Test that unconstrained functions are deterministic
    let result1 = expensive_sqrt_unconstrained(complex_input);
    let result2 = expensive_sqrt_unconstrained(complex_input);
    assert(result1 == result2);
}

// Example of using unconstrained for oracle-like functionality
unconstrained fn oracle_external_data() -> Field {
    // In a real application, this might fetch data from external sources
    // For testing, we'll return a constant
    42
}

#[test]
fn test_oracle_pattern() {
    // Get data from "oracle"
    let oracle_data = oracle_external_data();

    // Always verify oracle data in constrained code
    let verified = oracle_data > 0; // Simple verification
    assert(verified);

    // Use the verified data in circuit logic
    assert(oracle_data == 42);
}
```
