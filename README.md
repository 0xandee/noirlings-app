<p align="center">
 <img width="240" height="95" alt="noirlingsapplogo-white" src="https://github.com/user-attachments/assets/91816735-6249-4761-92c5-137a42c15c6c" />
</p>

<p align="center">
  <strong>Learn Noir in your browser</strong>
</p>

<p align="center">
  <a href="https://noir-lang.org/">
    <img alt="Noir" src="https://img.shields.io/badge/noir-v1.0.0--beta.9-black?style=flat-square">
  </a>
</p>

<p align="center">
  <a href="https://www.noirlings.app">Live App</a>
</p>

<p align="center">
 <img width="1406" height="912" alt="image" src="https://github.com/user-attachments/assets/84ce4f10-cfdf-4766-9ddf-df9ba7837b23" />
</p>

Noirlings.app is a modern, interactive playground for the [Noir](https://noir-lang.org/) programming language. It's designed to help you learn Noir quickly and intuitively, with hands-on exercises, instant feedback, and a beautiful, responsive UI.

## 📚 Exercise Categories

### 🟢 Basic Exercises (36 total)

- **Intro & Variables** (7 exercises) - Master Noir fundamentals: main functions, let bindings, mutability, scope, and constants
- **Data Types** (5 exercises) - Learn fields, integers, arrays, strings, and tuples for ZK circuit development
- **Control Flow & Logic** (3 exercises) - Implement conditional logic, loops, and decision-making in zero-knowledge programs
- **Structs & Traits** (9 exercises) - Build custom types, implementation blocks, and generic programming patterns
- **Advanced Data** (7 exercises) - Work with slices, references, and functional programming methods
- **Knowledge Check** (1 exercise) - Quiz combining multiple Noir concepts

### 🔴 Advanced Exercises (39 total)

- **Cryptographic Hashes** (4 exercises) - Implement Pedersen, Blake2s, Blake3, and Keccak256 hash functions
- **Elliptic Curves** (4 exercises) - Master curve operations, point arithmetic, and scalar multiplication
- **Merkle Trees** (4 exercises) - Build basic trees, verify proofs, and work with sparse/indexed variants
- **Privacy & Zero-Knowledge** (13 exercises) - Create range proofs, commitments, private voting, and transaction systems
- **Ethereum Integration** (9 exercises) - Work with RLP encoding, Patricia tries, and blockchain state proofs
- **Advanced Cryptography** (4 exercises) - Implement ECDSA signatures, recursive proofs, and circuit optimizations

---

## 🏗️ Project Structure

This project uses [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) for a modular, scalable codebase:

```
packages/
  noirlings/           # Main Noir playground app (React + Vite)
    src/
      components/       # React components
      hooks/           # Custom React hooks
      pages/           # Application pages
      utils/           # Utility functions
    public/
      exercises/       # Exercise content and logic
        basic/         # Beginner exercises
        advanced/      # Advanced topics
scripts/              # Build and utility scripts
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Editor**: Monaco Editor with custom Noir syntax highlighting
- **Noir**: v1.0.0-beta.9 with @noir-lang/noir_js and noir_wasm
- **Authentication**: Supabase
- **Build Tool**: Vite with custom plugins (WASM, Node polyfills)
- **Deployment**: Vercel with edge functions
- **Analytics**: Vercel Analytics & Speed Insights
- **Package Manager**: Yarn 4 with workspaces

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Yarn](https://yarnpkg.com/) (v4+)

### Installation

```bash
git clone https://github.com/0xandee/noirlings-app.git
cd noirlings-app
yarn install
```

### Environment Variables

To configure Supabase for authentication, create a `.env` file at the project root:

```bash
cp .env.example .env
```

Then update the following variables:

- `VITE_SUPABASE_URL`: Your Supabase project URL (Settings > API in Supabase dashboard)
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous public key (Settings > API)

These variables are required to initialize the Supabase client in `packages/noirlings/src/hooks/useAuth.tsx`.

### Development

```bash
yarn dev
```

This runs the playground in development mode. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### Build

```bash
yarn build
```

Builds the playground for production to the `dist/` directory.

### Development Commands

```bash
# Run without regenerating exercises (faster for UI development)
yarn dev-no-exercises

# Generate exercise JSON files
yarn generate-exercises

# Preview production build locally
yarn serve
```

### Deployment (Railway)

This project is optimized for [Railway](https://railway.app/):

- Build command: `yarn build`
- Output directory: `dist`
- Framework: Vite

You can deploy by connecting your GitHub repository to Railway or by using the Railway CLI:

```bash
railway login
railway link
railway up
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

- 🐛 **Report bugs** - Found an issue? Open a GitHub issue
- ✨ **Suggest features** - Have ideas? We'd love to hear them
- 📝 **Add exercises** - Create new learning content
- 👨‍💻 **Improve code** - Submit pull requests with enhancements
- 📚 **Update docs** - Help improve documentation

---

## 🙏 Credits

- **Original Noirlings** — This project is inspired by and builds upon the original [Noirlings](https://github.com/raven-house/noirlings) by [@satyambnsal](https://x.com/satyambnsal)
- [Noir Programming Language](https://noir-lang.org/) - The amazing ZK programming language
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor that powers VS Code
- [Vercel](https://vercel.com/) - Deployment and hosting platform
- [React](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Supabase](https://supabase.com/) - Backend-as-a-Service for authentication
