trait Convert<T> {
    fn convert(self) -> T;
}

struct Celsius {
    temp: Field,
}

struct Fahrenheit {
    temp: Field,
}

// TODO: Implement Convert trait to convert Celsius to Fahrenheit
// Formula: F = (C X 9/5) + 32
impl Convert<Fahrenheit> for Celsius {
    // Add your implementation here
}

#[test]
fn test_temperature_conversion() {
    let celsius = Celsius { temp: 0 };
    let fahrenheit = celsius.convert();
    assert(fahrenheit.temp == 32);

    let celsius = Celsius { temp: 100 };
    let fahrenheit = celsius.convert();
    assert(fahrenheit.temp == 212);
}
