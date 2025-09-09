# Ultimate Universal App

The **Ultimate Universal App** is a community-powered project built with [Particle Network](https://particle.network).  
It starts as a simple Universal Accounts demo and grows with your contributions into the **ultimate chain-agnostic dApp**.

Join [Particle Network Slack](https://join.slack.com/t/particlenetworkhq/shared_invite/zt-3blxdzcd2-7skD8MNWUn_20eOrp9SICA) to discuss ideas, contribute to the project, and get help.

---

## 🚀 What’s Inside

- **Universal Accounts SDK** integration
  - One account, unified balance across chains
  - Chain-agnostic transactions
  - Gas abstraction (pay with any token)
- **Starter app** built with Next.js
  - Particle Connect login
  - Fetch UA addresses (EVM + Solana)
  - Display unified balances
  - Send a simple transaction (chain agnostic USDC transfer example)

---

## 🛠 Getting Started

### Prerequisites
- Node.js >= 18
- npm, yarn, or pnpm
- A [Particle Network project ID, client key, app ID](https://dashboard.particle.network)

### Setup

```bash
git clone https://github.com/soos3d/ultimate-universal-app.git
cd ultimate-universal-app
npm install
```

Add your Particle credentials in .env.local:

```bash
NEXT_PUBLIC_PROJECT_ID=your_project_id
NEXT_PUBLIC_CLIENT_KEY=your_client_key
NEXT_PUBLIC_APP_ID=your_app_id
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id # Optional
```

> The walletconnect project ID is optional in case you don't include walletconnect.

### Run locally

```bash
npm run dev
```

### Contributing

This project is community-driven. We welcome PRs for:
	•	New features (NFT mint, swaps, etc.)
	•	UI/UX improvements
	•	Docs, tutorials, tests

How to contribute
	1.	Fork the repo
	2.	Create a new branch: feature/your-idea
	3.	Submit a PR with clear description
	4.	Join our [slack](https://join.slack.com/t/particlenetworkhq/shared_invite/zt-3blxdzcd2-7skD8MNWUn_20eOrp9SICA) to discuss ideas

### Recognition

We’ll merge the best contributions and give shoutouts:
	•	GitHub README contributors section
	•	Twitter + Discord spotlights
	•	Community demo sessions

### Resources
	•	Universal [Accounts Overview](https://developers.particle.network/intro/universal-accounts)
	•	Supported [Chains and Assets](https://developers.particle.network/universal-accounts/cha/chains)
	•	Web [SDK reference](https://developers.particle.network/universal-accounts/ua-reference/desktop/web)

### License

MIT
