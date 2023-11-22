[![NPM](https://nodei.co/npm/@signorecello/noir_playground.png?downloads=true)](https://www.npmjs.com/package/@signorecello/noir_playground)

[![Netlify Status](https://api.netlify.com/api/v1/badges/a4e5229d-923b-437e-ad5c-8a8e131b5863/deploy-status)](https://app.netlify.com/sites/noir-playground/deploys)

# Noir Playground

This package packages several Noir tools with Monaco, and allows you to embed a simple Noir Playground in your website. [Try the live demo!](noir-playground.netlify.app)

## Getting started

### Installation

Install with npm or yarn:

```
yarn add @signorecello/noir_playground
```

### Usage

Quite simply import NoirEditor and add it as a React node:

```ts
import { NoirEditor } from '@signorecello/noir_playground';

ReactDOM.createRoot(document.getElementById('root')!).render(
<NoirEditor />
)
```

### Options

You can pass all the options in [Monaco editor](https://github.com/suren-atoyan/monaco-react#props).

There are some additional options related with Noir:

| Name    | Type   | Default                         | Description                                                                               |
| :------ | :----- | :------------------------------ | :---------------------------------------------------------------------------------------- |
| threads | number | `navigator.hardwareConcurrency` | the number of threads to use in NoirJS. Defaults to the maximum available in your machine |

## How to build

This repo uses yarn workspaces. The actual package is in `packages/playground`, and is built with `rollup`. To contribute, you should make whatever changes and simply run `yarn build` on that folder.

All contributions are welcome!
