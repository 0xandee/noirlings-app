# Noir Playground - Complete Features Guide

The Noirlings application now includes a comprehensive Noir playground that allows users to write, compile, and prove Noir code directly in the browser, then export proofs and public inputs.

## 🚀 Key Features

### 1. **Interactive Code Editor**
- Monaco Editor with full Noir syntax highlighting
- Theme switching (light/dark mode)
- Line numbers, word wrap, and auto-resizing layout
- Keyboard shortcuts: `Ctrl+Enter` to compile, `Alt+Enter` to prove

### 2. **Real-time Compilation**
- Browser-based Noir compilation using WebAssembly
- Enhanced error handling with helpful tips
- Visual status indicators showing compilation state
- Detailed error messages with context

### 3. **Zero-Knowledge Proof Generation**
- Complete proof generation pipeline in the browser
- Dynamic input fields for circuit parameters
- Status indicators for workflow progress
- Support for multithreading with configurable thread count

### 4. **Proof Verification**
- Built-in proof verification functionality
- Visual verification status with success/failure indicators
- Detailed verification feedback

### 5. **Comprehensive Export System**
- **Copy to clipboard**: Individual proof and public inputs
- **Download files**: Save proofs and inputs as separate files
- **Complete bundle**: Download everything as structured JSON
- **Multiple formats**: Plain text and JSON export options

## 🛠 Usage Guide

### Basic Workflow

1. **Write Noir Code**: Use the Monaco editor to write your Noir circuit
2. **Compile**: Click "Compile" or press `Ctrl+Enter`
3. **Provide Inputs**: If your circuit requires inputs, fill them in the generated form
4. **Generate Proof**: Click "Prove" or press `Alt+Enter`
5. **Export/Verify**: Use the export options or verify the generated proof

### Advanced Features

#### Input Management
- Dynamic input fields are generated based on your circuit's ABI
- Supports various input types (strings, numbers, arrays)
- Real-time validation and status indicators

#### Proof Verification
- Verify proofs directly in the browser
- No external dependencies required
- Visual feedback for verification results

#### Export Options
- **Individual Copy**: Copy proof or public inputs separately
- **Individual Download**: Download as `.txt` files with timestamps
- **Complete Bundle**: Download structured JSON with metadata
- All exports include timestamp information for organization

## 🎯 Technical Implementation

### Core Technologies
- **@noir-lang/noir_wasm**: Browser-based Noir compilation
- **@noir-lang/backend_barretenberg**: Proof generation and verification
- **Monaco Editor**: Advanced code editing experience
- **React + TypeScript**: Modern UI framework
- **Vite**: Fast build system and development server

### Key Components

#### 1. Enhanced ActionsBox (`src/components/actionsBox/actions.tsx`)
- Compile and prove buttons with status indicators
- Dynamic input field generation
- Keyboard shortcut support
- Workflow status visualization

#### 2. Advanced ResultBox (`src/components/resultBox/result.tsx`)
- Comprehensive export functionality
- Proof verification interface
- Modern, responsive design
- Success/failure state management

#### 3. Improved Compilation (`src/utils/generateProof.tsx`)
- Enhanced error handling and reporting
- Helpful error tips and context
- Robust proof generation pipeline
- Verification functionality

### Error Handling
The playground includes sophisticated error handling:
- **Compilation errors**: Detailed messages with helpful tips
- **Proof generation errors**: Context-aware error reporting
- **Verification errors**: Clear feedback on verification failures
- **Input validation**: Real-time validation of circuit inputs

## 🔧 Configuration

### Environment Variables
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### Build Configuration
The playground is optimized for production with:
- Memory allocation: `NODE_OPTIONS=--max-old-space-size=8192`
- Bundle optimization for WebAssembly modules
- Tree shaking for optimal bundle size

## 📖 Example Usage

### Simple Circuit
```noir
fn main(x: u32, y: u32) -> pub u32 {
    x + y
}
```

1. Paste this code in the editor
2. Click "Compile" - should succeed
3. Enter values for `x` and `y` in the input fields
4. Click "Prove" to generate a zero-knowledge proof
5. Use export options to save or copy the proof

### Circuit with Public Inputs
```noir
fn main(private_input: u32, public_input: pub u32) -> pub u32 {
    assert(private_input > 10);
    private_input + public_input
}
```

This will generate input fields for both parameters, allowing you to test the complete proof workflow.

## 🚀 Development

### Running Locally
```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build
```

### Testing
```bash
# Type checking
npx tsc --noEmit

# Build verification
NODE_OPTIONS="--max-old-space-size=8192" yarn build
```

## 🎨 UI/UX Features

### Visual Workflow Indicators
- **Compilation Status**: Green/gray dots showing compilation state
- **Input Status**: Progress indicators for required inputs
- **Proof Status**: Visual feedback for proof generation
- **Verification Status**: Clear success/failure indicators

### Responsive Design
- **Desktop**: Full split-pane layout with resizable panels
- **Mobile**: Adaptive layout with collapsible sidebars
- **Accessibility**: Full keyboard navigation and screen reader support

### Theme Support
- **Dark Mode**: Optimized for extended coding sessions
- **Light Mode**: Clean, bright interface for different preferences
- **System Integration**: Respects system theme preferences

## 🔒 Security & Performance

### Security Features
- **Client-side Processing**: All compilation and proving happens in the browser
- **No Server Dependencies**: Zero-knowledge proofs generated locally
- **Secure Export**: No sensitive data transmitted to external services

### Performance Optimizations
- **WebAssembly**: Native-speed compilation and proving
- **Multithreading**: Configurable thread count for optimal performance
- **Memory Management**: Optimized for large circuits and proofs
- **Bundle Splitting**: Efficient loading of Monaco Editor and language support

## 🤝 Contributing

The Noir playground is built with extensibility in mind:
- **Modular Components**: Easy to extend and customize
- **Type Safety**: Full TypeScript support for reliable development
- **Modern Tooling**: Vite, ESLint, and Prettier for development experience

## 📄 License

This project follows the same license as the main Noirlings application.

---

For more information about Noir language and syntax, visit [noir-lang.org](https://noir-lang.org).