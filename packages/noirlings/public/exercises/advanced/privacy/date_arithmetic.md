---
id: date_arithmetic
title: date_arithmetic
category: privacy
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      Date arithmetic in zero-knowledge proofs requires careful encoding and validation. Implement date operations for age calculations.

      1. Date Field Encoding

      ```noir
      fn to_field(self) -> Field {
          // Encode as YYYYMMDD format for efficient field operations
          (self.year * 10000 + self.month * 100 + self.day) as Field
      }
      ```

      2. Age Calculation

      ```noir
      fn age_in_years(self) -> u32 {
          let mut age = CURRENT_YEAR - self.year;
          
          // Adjust for month and day precision
          if CURRENT_MONTH < self.month {
              age -= 1;
          } else if CURRENT_MONTH == self.month && CURRENT_DAY < self.day {
              age -= 1;
          }
          
          age
      }
      ```

      3. Date Validation

      ```noir
      fn is_valid(self) -> bool {
          let year_valid = self.year >= 1900 && self.year <= CURRENT_YEAR;
          let month_valid = self.month >= 1 && self.month <= 12;
          let day_valid = self.day >= 1 && self.day <= 31;
          
          year_valid & month_valid & day_valid
      }
      ```
    description: >-
      Date arithmetic forms the foundation of age verification systems. Learn to implement secure date operations, field encoding, and age calculations for zero-knowledge applications.

      In this exercise, you will:
      1. Convert dates to field elements for efficient computation
      2. Calculate precise ages accounting for month and day
      3. Validate date ranges and constraints
      4. Handle edge cases in date arithmetic

      #### Docs
    docLink: "https://noir-lang.org/docs/noir/concepts/data_types"
---

```noir
use std::hash::pedersen_hash;

global CURRENT_YEAR: u32 = 2024;
global CURRENT_MONTH: u32 = 1;
global CURRENT_DAY: u32 = 1;

// Date structure for representing birth dates and other dates
struct Date {
    year: u32,
    month: u32,
    day: u32,
}

impl Date {
    // TODO: Convert date to a single field element for computation
    fn to_field(self) -> Field {
        // Hint: Encode as YYYYMMDD format
        // Example: 1990-06-15 becomes 19900615
        todo!()
    }

    // TODO: Calculate age in years from this birth date
    fn age_in_years(self) -> u32 {
        // Hint: Calculate difference from current date
        // Handle month/day precision for accurate age
        // If birthday hasn't occurred this year, subtract 1
        todo!()
    }

    // TODO: Validate that date is reasonable (not in future, not too old)
    fn is_valid(self) -> bool {
        // Hint: Check year range (1900-2024), month range (1-12), day range (1-31)
        todo!()
    }

    // TODO: Check if this date is a birthday that has occurred this year
    fn birthday_passed_this_year(self) -> bool {
        // Hint: Compare month and day with current date
        todo!()
    }

    // TODO: Calculate the number of days since this date
    fn days_since(self) -> u32 {
        // Hint: Simplified calculation - you can approximate
        // Real implementation would need leap year handling
        todo!()
    }
}

fn main(birth_year: u32, birth_month: u32, birth_day: u32, expected_age: u32) -> pub bool {
    let birth_date = Date {
        year: birth_year,
        month: birth_month,
        day: birth_day
    };

    // Test date validation
    let is_valid_date = birth_date.is_valid();

    // Test age calculation
    let calculated_age = birth_date.age_in_years();
    let age_correct = calculated_age == expected_age;

    // Test field conversion
    let date_field = birth_date.to_field();
    let field_non_zero = date_field != 0;

    // All tests must pass
    is_valid_date & age_correct & field_non_zero
}

#[test]
fn test_date_operations() {
    let birth_date = Date {
        year: 1990,
        month: 6,
        day: 15
    };

    // Test date validation
    assert(birth_date.is_valid());

    // Test age calculation
    let age = birth_date.age_in_years();
    assert(age >= 30); // Should be at least 30 in 2024

    // Test field conversion
    let date_field = birth_date.to_field();
    assert(date_field == 19900615); // YYYYMMDD format

    // Test birthday calculation
    let birthday_passed = birth_date.birthday_passed_this_year();
    // Should be true since we're past June 15 in current date (Jan 1, 2024 is before June)
}

#[test]
fn test_invalid_dates() {
    // Test future date
    let future_date = Date {
        year: 2030,
        month: 1,
        day: 1
    };
    assert(!future_date.is_valid());

    // Test invalid month
    let invalid_month = Date {
        year: 1990,
        month: 13,
        day: 1
    };
    assert(!invalid_month.is_valid());

    // Test invalid day
    let invalid_day = Date {
        year: 1990,
        month: 6,
        day: 32
    };
    assert(!invalid_day.is_valid());
}

#[test]
fn test_edge_cases() {
    // Test January 1st current year (age should be exact)
    let new_year_baby = Date {
        year: 2000,
        month: 1,
        day: 1
    };
    let age = new_year_baby.age_in_years();
    assert(age == 24); // 2024 - 2000

    // Test December 31st (birthday hasn't passed in current year)
    let december_baby = Date {
        year: 2000,
        month: 12,
        day: 31
    };
    let age_dec = december_baby.age_in_years();
    assert(age_dec == 23); // 2024 - 2000 - 1 (birthday hasn't passed)
}

#[test]
fn test_field_encoding() {
    let test_date = Date {
        year: 1995,
        month: 3,
        day: 7
    };

    let encoded = test_date.to_field();
    assert(encoded == 19950307);

    // Test another date
    let test_date2 = Date {
        year: 2010,
        month: 12,
        day: 25
    };

    let encoded2 = test_date2.to_field();
    assert(encoded2 == 20101225);
}
```
