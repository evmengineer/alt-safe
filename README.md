# ALT Wallet

ALT Wallet is an alternative UI for interacting with Safe Smart Contracts. ALT Wallet works without any backend.

## Features

- Create new Safe Smart Account
- Import existing Safe Smart Account
- UI Components to
    -   Transfer native tokens
    -   Transfer ERC20 tokens
    -   Build smart contract calls (only `call`)
    -   Import transactions for signing
- Batch transactions
- Aggregate signatures from multiple signers
- View Safe storage slots like Owners, Modules, Nonce, Singleton, etc.
- Option to set custom Safe Proxy Factory, Fallback Handler, etc addresses.

This is a [Vite](https://vitejs.dev) project bootstrapped with [`create-wagmi`](https://github.com/wevm/wagmi/tree/main/packages/create-wagmi).

## RPC

ALT Wallet relies on the user provided RPC URL or the default RPC URL provided by `wagmi`. It is very important to provide a stable and performant RPC node. Typically, public RPC URLs are not sufficient, and it is recommended to run against a private RPC URL or your own node directly.

## Differences from Safe{Wallet}

- Easily runs locally
- No analytics
- No backend services needed

## Setup 

### Install dependencies

```bash
npm i
```

### Set env parametes

1. Create `.env` file
2. Set property values

### Start local dev server

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Demo

![recording](https://github.com/user-attachments/assets/9fadb5c9-8927-4623-8855-ba4636e7cef7)

## Frameworks

This app is built using the following frameworks:

- Viem
- Wagmi
- React
- MUI

## Contributing

Contributions, be it a bug report or a pull request, are very welcome. Please check our [contribution guidelines](CONTRIBUTING.md) beforehand.
