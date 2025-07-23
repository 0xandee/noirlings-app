const { compile, createFileManager } = require("./node_modules/@noir-lang/noir_wasm");
const { Noir } = require("./node_modules/@noir-lang/noir_js");
const { BarretenbergBackend } = require("./node_modules/@noir-lang/backend_barretenberg");

const stringToStream = (data) => {
  return new Response(data).body;
};

async function testNoirUpgrade() {
  console.log("Testing Noir compilation with upgraded packages...");
  
  try {
    // Create FileManager
    const fm = createFileManager("/");
    
    // Write Nargo.toml
    const nargoToml = `[package]
name = "test"
type = "bin"
authors = [""]

[dependencies]`;
    
    await fm.writeFile("Nargo.toml", stringToStream(nargoToml));
    
    // Write a simple Noir program
    const noirCode = `fn main(x: u32, y: u32) -> pub u32 {
    x + y
}`;
    
    await fm.writeFile("src/main.nr", stringToStream(noirCode));
    
    console.log("Compiling Noir code...");
    const compiled = await compile(fm, "/");
    
    if (!compiled || !("program" in compiled)) {
      throw new Error("Compilation failed");
    }
    
    console.log("✅ Compilation successful!");
    
    // Test proof generation
    console.log("Testing proof generation...");
    const circuit = compiled.program;
    const backend = new BarretenbergBackend(circuit);
    const noir = new Noir(circuit);
    
    const input = { x: 5, y: 3 };
    const { witness } = await noir.execute(input);
    const proof = await backend.generateProof(witness);
    
    console.log("✅ Proof generation successful!");
    console.log("✅ All tests passed! Upgrade is working correctly.");
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  }
}

testNoirUpgrade();