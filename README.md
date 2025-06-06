<p align="center">
 <img width="240" alt="twitter-avatar" src="https://github.com/user-attachments/assets/5b7f5676-54a2-4399-a022-b637078dc7d7" />
</p>

<h1 align="center">Noirlings.app</h1>

<p align="center">
  <strong>Learn Noir, fast ⚡️</strong>
</p>

Noirlings.app is a modern, interactive playground for the [Noir](https://noir-lang.org/) programming language. It's designed to help you learn Noir quickly and intuitively, with hands-on exercises, instant feedback, and a beautiful, responsive UI.

---

## Monorepo Structure

This project uses [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) for a modular, scalable codebase:

```
packages/
  playground/   # Main Noir playground app (React + Vite)
  exercises/    # Exercise content and logic
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Yarn](https://yarnpkg.com/) (v4+)

### Installation

```bash
git clone https://github.com/0xandee/noirlings-app.git
cd noirlings-app
yarn install
```

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

### Deployment (Vercel)

This project is optimized for [Vercel](https://vercel.com/):

- Build command: `yarn vercel-build`
- Output directory: `dist`
- Framework: Vite

You can deploy instantly by clicking the Vercel button above or by running:

```bash
vercel --prod
```

---

## Share Your Progress

Noirlings.app makes it easy to share your learning journey:

- Use the **Share on X** button in the playground toolbar to tweet your progress and tag [@NoirLang](https://x.com/NoirLang).
- All shares are tracked with Vercel Analytics for insights.

---

## Follow the Author

Made with ❤️ by [@andeebtceth](https://x.com/andeebtceth). Follow for updates and Noir tips!

---

## Contributing

Contributions are welcome! Please open issues or pull requests to help improve Noirlings.app.

---

## Credits

- **Original Noirlings** — This project is inspired by and builds upon the original [Noirlings](https://github.com/raven-house/noirlings) by [@satyambnsal](https://x.com/satyambnsal)
- [Noir Programming Language](https://noir-lang.org/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Vercel](https://vercel.com/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

For more details, see the [CHANGELOG.md](CHANGELOG.md).
