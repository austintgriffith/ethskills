---
name: addresses
description: Verified contract addresses for major Ethereum protocols across mainnet and L2s. Use this instead of guessing or hallucinating addresses. Includes Uniswap, Aave, Compound, Aerodrome, GMX, Pendle, Velodrome, Camelot, SyncSwap, Lido, Rocket Pool, 1inch, Permit2, MakerDAO/sDAI, EigenLayer, Across, Chainlink CCIP, Yearn V3, USDC, USDT, DAI, ENS, Safe, Chainlink, and more. Always verify addresses against a block explorer before sending transactions.
---

# Contract Addresses

> **CRITICAL:** Never hallucinate a contract address. Wrong addresses mean lost funds. If an address isn't listed here, look it up on the block explorer or the protocol's official docs before using it.

**Last Verified:** February 16, 2026 (all addresses verified onchain via `eth_getCode` + `eth_call`)

---

## Stablecoins

### USDC (Circle) — Native
| Network | Address | Status |
|---------|---------|--------|
| Mainnet | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` | ✅ Verified |
| Arbitrum | `0xaf88d065e77c8cC2239327C5EDb3A432268e5831` | ✅ Verified |
| Optimism | `0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85` | ✅ Verified |
| Base | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` | ✅ Verified |
| Polygon | `0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359` | ✅ Verified |
| zkSync Era | `0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4` | ✅ Verified |

### USDT (Tether)
| Network | Address | Status |
|---------|---------|--------|
| Mainnet | `0xdAC17F958D2ee523a2206206994597C13D831ec7` | ✅ Verified |
| Arbitrum | `0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9` | ✅ Verified |
| Optimism | `0x94b008aA00579c1307B0EF2c499aD98a8ce58e58` | ✅ Verified |
| Base | `0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2` | ✅ Verified |

### DAI (MakerDAO)
| Network | Address | Status |
|---------|---------|--------|
| Mainnet | `0x6B175474E89094C44Da98b954EedeAC495271d0F` | ✅ Verified |
| Arbitrum | `0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1` | ✅ Verified |
| Optimism | `0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1` | ✅ Verified |
| Base | `0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb` | ✅ Verified |

---

## Wrapped ETH (WETH)

| Network | Address | Status |
|---------|---------|--------|
| Mainnet | `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2` | ✅ Verified |
| Arbitrum | `0x82aF49447D8a07e3bd95BD0d56f35241523fBab1` | ✅ Verified |
| Optimism | `0x4200000000000000000000000000000000000006` | ✅ Verified |
| Base | `0x4200000000000000000000000000000000000006` | ✅ Verified |

---

## Liquid Staking

### Lido — wstETH (Wrapped stETH)
| Network | Address | Status |
|---------|---------|--------|
| Mainnet | `0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0` | ✅ Verified |
| Arbitrum | `0x5979D7b546E38E414F7E9822514be443A4800529` | ✅ Verified |
| Optimism | `0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb` | ✅ Verified |
| Base | `0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452` | ✅ Verified |

### Lido — Staking & Withdrawal
| Contract | Address | Status |
|----------|---------|--------|
| stETH / Lido (deposit ETH here) | `0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84` | ✅ Verified |
| Withdrawal Queue (unstETH NFT) | `0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1` | ✅ Verified |

### Rocket Pool
| Contract | Address | Status |
|----------|---------|--------|
| rETH Token | `0xae78736Cd615f374D3085123A210448E74Fc6393` | ✅ Verified |
| Deposit Pool v1.1 | `0x2cac916b2A963Bf162f076C0a8a4a8200BCFBfb4` | ✅ Verified |

---

## DeFi Protocols

### Uniswap

#### V2 (Mainnet)
| Contract | Address | Status |
|----------|---------|--------|
| Router | `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D` | ✅ Verified |
| Factory | `0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f` | ✅ Verified |

#### V3 (Mainnet)
| Contract | Address | Status |
|----------|---------|--------|
| SwapRouter | `0xE592427A0AEce92De3Edee1F18E0157C05861564` | ✅ Verified |
| SwapRouter02 | `0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45` | ✅ Verified |
| Factory | `0x1F98431c8aD98523631AE4a59f267346ea31F984` | ✅ Verified |
| Quoter V2 | `0x61fFE014bA17989E743c5F6cB21bF9697530B21e` | ✅ Verified |
| Position Manager | `0xC36442b4a4522E871399CD717aBDD847Ab11FE88` | ✅ Verified |

#### V3 Multi-Chain
| Contract | Arbitrum | Optimism | Base |
|----------|----------|----------|------|
| SwapRouter02 | `0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45` ✅ | `0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45` ✅ | `0x2626664c2603336E57B271c5C0b26F421741e481` ✅ |
| Factory | `0x1F98431c8aD98523631AE4a59f267346ea31F984` ✅ | `0x1F98431c8aD98523631AE4a59f267346ea31F984` ✅ | `0x33128a8fC17869897dcE68Ed026d694621f6FDfD` ✅ |

#### V4 (Live Since January 31, 2025)

⚠️ **V4 addresses are DIFFERENT per chain** — unlike V3, they are NOT deterministic CREATE2 deploys. Do not assume the same address works cross-chain.

| Contract | Mainnet | Status |
|----------|---------|--------|
| PoolManager | `0x000000000004444c5dc75cB358380D2e3dE08A90` | ✅ Verified |
| PositionManager | `0xbd216513d74c8cf14cf4747e6aaa6420ff64ee9e` | ✅ Verified |
| Quoter | `0x52f0e24d1c21c8a0cb1e5a5dd6198556bd9e1203` | ✅ Verified |
| StateView | `0x7ffe42c4a5deea5b0fec41c94c136cf115597227` | ✅ Verified |

#### V4 Multi-Chain
| Contract | Arbitrum | Base | Optimism |
|----------|----------|------|----------|
| PoolManager | `0x360e68faccca8ca495c1b759fd9eee466db9fb32` ✅ | `0x498581ff718922c3f8e6a244956af099b2652b2b` ✅ | `0x9a13f98cb987694c9f086b1f5eb990eea8264ec3` ✅ |
| PositionManager | `0xd88f38f930b7952f2db2432cb002e7abbf3dd869` ✅ | `0x7c5f5a4bbd8fd63184577525326123b519429bdc` ✅ | `0x3c3ea4b57a46241e54610e5f022e5c45859a1017` ✅ |

#### Universal Router (V4 — Current)
| Network | Address | Status |
|---------|---------|--------|
| Mainnet | `0x66a9893cc07d91d95644aedd05d03f95e1dba8af` | ✅ Verified |
| Arbitrum | `0xa51afafe0263b40edaef0df8781ea9aa03e381a3` | ✅ Verified |
| Base | `0x6ff5693b99212da76ad316178a184ab56d299b43` | ✅ Verified |
| Optimism | `0x851116d9223fabed8e56c0e6b8ad0c31d98b3507` | ✅ Verified |

#### Universal Router (V3 — Legacy)
| Contract | Address | Status |
|----------|---------|--------|
| Universal Router | `0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD` | ✅ Verified |

#### Permit2 (Universal Token Approval)

Used by Uniswap Universal Router and many other protocols. Same address on all chains (CREATE2).

| Network | Address | Status |
|---------|---------|--------|
| All chains | `0x000000000022D473030F116dDEE9F6B43aC78BA3` | ✅ Verified |

Verified on: Mainnet, Arbitrum, Base, Optimism (identical bytecode on all).

#### UNI Token
| Network | Address | Status |
|---------|---------|--------|
| Mainnet | `0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984` | ✅ Verified |

### 1inch Aggregation Router

Use aggregators for best swap prices — they route across all DEXs.

#### V6 (Current — same address on all chains via CREATE2)
| Network | Address | Status |
|---------|---------|--------|
| Mainnet | `0x111111125421cA6dc452d289314280a0f8842A65` | ✅ Verified |
| Arbitrum | `0x111111125421cA6dc452d289314280a0f8842A65` | ✅ Verified |
| Base | `0x111111125421cA6dc452d289314280a0f8842A65` | ✅ Verified |

#### V5 (Legacy)
| Network | Address | Status |
|---------|---------|--------|
| Mainnet | `0x1111111254EEB25477B68fb85Ed929f73A960582` | ✅ Verified |

### MakerDAO / Sky

| Contract | Address | Status |
|----------|---------|--------|
| DAI Savings Rate (Pot) | `0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7` | ✅ Verified |
| sDAI (Savings Dai ERC-4626) | `0x83F20F44975D03b1b09e64809B757c47f942BEeA` | ✅ Verified |

sDAI is an ERC-4626 vault — deposit DAI, earn DSR automatically. Check current rate via `pot.dsr()`.

### Aave

#### V2 (Mainnet - Legacy)
| Contract | Address | Status |
|----------|---------|--------|
| LendingPool | `0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9` | ✅ Verified |

#### V3 (Mainnet)
| Contract | Address | Status |
|----------|---------|--------|
| Pool | `0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2` | ✅ Verified |
| PoolAddressesProvider | `0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e` | ✅ Verified |

#### V3 Multi-Chain
| Contract | Arbitrum | Optimism | Base |
|----------|----------|----------|------|
| Pool | `0x794a61358D6845594F94dc1DB02A252b5b4814aD` ✅ | `0x794a61358D6845594F94dc1DB02A252b5b4814aD` ✅ | `0xA238Dd80C259a72e81d7e4664a9801593F98d1c5` ✅ |
| PoolAddressesProvider | `0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb` ✅ | `0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb` ✅ | `0xe20fCBdBfFC4Dd138cE8b2E6FBb6CB49777ad64D` ✅ |

### Compound

#### V2 (Mainnet - Legacy)
| Contract | Address | Status |
|----------|---------|--------|
| Comptroller | `0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B` | ✅ Verified |
| cETH | `0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5` | ✅ Verified |
| cUSDC | `0x39AA39c021dfbaE8faC545936693aC917d5E7563` | ✅ Verified |
| cDAI | `0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643` | ✅ Verified |

#### V3 Comet (USDC Markets)
| Network | Address | Status |
|---------|---------|--------|
| Mainnet | `0xc3d688B66703497DAA19211EEdff47f25384cdc3` | ✅ Verified |
| Arbitrum | `0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf` | ✅ Verified |
| Base | `0xb125E6687d4313864e53df431d5425969c15Eb2F` | ✅ Verified |
| Optimism | `0x2e44e174f7D53F0212823acC11C01A11d58c5bCB` | ✅ Verified |

### Curve Finance (Mainnet)
| Contract | Address | Status |
|----------|---------|--------|
| Address Provider | `0x0000000022D53366457F9d5E68Ec105046FC4383` | ✅ Verified |
| CRV Token | `0xD533a949740bb3306d119CC777fa900bA034cd52` | ✅ Verified |

### Balancer V2 (Mainnet)
| Contract | Address | Status |
|----------|---------|--------|
| Vault | `0xBA12222222228d8Ba445958a75a0704d566BF2C8` | ✅ Verified |

---

## NFT & Marketplaces

### OpenSea Seaport
| Version | Address | Status |
|---------|---------|--------|
| Seaport 1.1 | `0x00000000006c3852cbEf3e08E8dF289169EdE581` | ✅ Verified |
| Seaport 1.5 | `0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC` | ✅ Verified |

Multi-chain via CREATE2 (Ethereum, Polygon, Arbitrum, Optimism, Base).

### ENS (Mainnet)
| Contract | Address | Status |
|----------|---------|--------|
| Registry | `0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e` | ✅ Verified |
| Public Resolver | `0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63` | ✅ Verified |
| Registrar Controller | `0x253553366Da8546fC250F225fe3d25d0C782303b` | ✅ Verified |

---

## Infrastructure

### Safe (Gnosis Safe)
| Contract | Address | Status |
|----------|---------|--------|
| Singleton 1.3.0 | `0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552` | ✅ Verified |
| ProxyFactory | `0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2` | ✅ Verified |
| Singleton 1.4.1 | `0x41675C099F32341bf84BFc5382aF534df5C7461a` | ✅ Verified |
| MultiSend | `0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526` | ✅ Verified |

### Account Abstraction (ERC-4337)
| Contract | Address | Status |
|----------|---------|--------|
| EntryPoint v0.7 | `0x0000000071727De22E5E9d8BAf0edAc6f37da032` | ✅ Verified |
| EntryPoint v0.6 | `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789` | ✅ Verified |

All EVM chains (CREATE2).

### Chainlink

#### Mainnet
| Feed | Address | Status |
|------|---------|--------|
| LINK Token | `0x514910771AF9Ca656af840dff83E8264EcF986CA` | ✅ Verified |
| ETH/USD | `0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419` | ✅ Verified |
| BTC/USD | `0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c` | ✅ Verified |
| USDC/USD | `0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6` | ✅ Verified |

#### Additional Mainnet Feeds
| Feed | Address | Status |
|------|---------|--------|
| LINK/USD | `0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c` | ✅ Verified |
| stETH/USD | `0xCfE54B5cD566aB89272946F602D76Ea879CAb4a8` | ✅ Verified |
| AAVE/USD | `0x547a514d5e3769680Ce22B2361c10Ea13619e8a9` | ✅ Verified |

All feeds confirmed returning live prices via `latestAnswer()` (Feb 16, 2026).

#### ETH/USD Price Feeds (Multi-Chain)
| Network | Address | Status |
|---------|---------|--------|
| Arbitrum | `0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612` | ✅ Verified |
| Base | `0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70` | ✅ Verified |
| Optimism | `0x13e3Ee699D1909E989722E753853AE30b17e08c5` | ✅ Verified |

#### LINK Token (Multi-Chain)
| Network | Address | Status |
|---------|---------|--------|
| Arbitrum | `0xf97f4df75117a78c1A5a0DBb814Af92458539FB4` | ✅ Verified |
| Base | `0x88Fb150BDc53A65fe94Dea0c9BA0a6dAf8C6e196` | ✅ Verified |

### EigenLayer (Mainnet)

Restaking protocol. Both are upgradeable proxies (EIP-1967).

| Contract | Address | Status |
|----------|---------|--------|
| StrategyManager | `0x858646372CC42E1A627fcE94aa7A7033e7CF075A` | ✅ Verified |
| DelegationManager | `0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A` | ✅ Verified |

Source: [eigenlayer.xyz](https://docs.eigenlayer.xyz/)

### Chainlink CCIP Router (v1.2.0)

Cross-chain messaging. Call `typeAndVersion()` to confirm — returns "Router 1.2.0".

| Network | Address | Status |
|---------|---------|--------|
| Mainnet | `0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D` | ✅ Verified |
| Arbitrum | `0x141fa059441E0ca23ce184B6A78bafD2A517DdE8` | ✅ Verified |
| Base | `0x881e3A65B4d4a04dD529061dd0071cf975F58Bcd` | ✅ Verified |

Source: [docs.chain.link/ccip](https://docs.chain.link/ccip/directory/mainnet)

### Across Protocol — SpokePool

Cross-chain bridge. All SpokePool contracts are upgradeable proxies.

| Network | Address | Status |
|---------|---------|--------|
| Mainnet | `0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5` | ✅ Verified |
| Arbitrum | `0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A` | ✅ Verified |
| Base | `0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64` | ✅ Verified |
| Optimism | `0x6f26Bf09B1C792e3228e5467807a900A503c0281` | ✅ Verified |

Source: [docs.across.to/reference/contract-addresses](https://docs.across.to/reference/contract-addresses)

### Yearn V3 (Mainnet)

Deployed via CREATE2. Addresses below verified on Mainnet — verify on other chains before use.

| Contract | Address | Status |
|----------|---------|--------|
| VaultFactory 3.0.4 | `0x770D0d1Fb036483Ed4AbB6d53c1C88fb277D812F` | ✅ Verified |
| TokenizedStrategy | `0xDFC8cD9F2f2d306b7C0d109F005DF661E14f4ff2` | ✅ Verified |
| 4626 Router | `0x1112dbCF805682e828606f74AB717abf4b4FD8DE` | ✅ Verified |

Source: [docs.yearn.fi/developers/addresses/v3-contracts](https://docs.yearn.fi/developers/addresses/v3-contracts)

### Deterministic Deployer (CREATE2)

| Contract | Address | Status |
|----------|---------|--------|
| Arachnid's Deployer | `0x4e59b44847b379578588920cA78FbF26c0B4956C` | ✅ Verified |

Same address on every EVM chain. Used by many protocols for deterministic deployments.

---

## L2-Native Protocols

> **The dominant DEX on each L2 is NOT Uniswap.** Aerodrome dominates Base, Velodrome dominates Optimism, Camelot is a major native DEX on Arbitrum. Don't default to Uniswap — check which DEX has the deepest liquidity on each chain.

### Aerodrome (Base) — Dominant DEX

The largest DEX on Base by TVL (~$500-600M). Uses the ve(3,3) model — **LPs earn AERO emissions, veAERO voters earn 100% of trading fees.** This is the opposite of Uniswap where LPs earn fees directly.

| Contract | Address | Status |
|----------|---------|--------|
| AERO Token | `0x940181a94A35A4569E4529A3CDfB74e38FD98631` | ✅ Verified |
| Router | `0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43` | ✅ Verified |
| Voter | `0x16613524e02ad97eDfeF371bC883F2F5d6C480A5` | ✅ Verified |
| VotingEscrow | `0xeBf418Fe2512e7E6bd9b87a8F0f294aCDC67e6B4` | ✅ Verified |
| PoolFactory | `0x420DD381b31aEf6683db6B902084cB0FFECe40Da` | ✅ Verified |
| GaugeFactory | `0x35f35cA5B132CaDf2916BaB57639128eAC5bbcb5` | ✅ Verified |
| Minter | `0xeB018363F0a9Af8f91F06FEe6613a751b2A33FE5` | ✅ Verified |
| RewardsDistributor | `0x227f65131A261548b057215bB1D5Ab2997964C7d` | ✅ Verified |
| FactoryRegistry | `0x5C3F18F06CC09CA1910767A34a20F771039E37C0` | ✅ Verified |

Source: [aerodrome-finance/contracts](https://github.com/aerodrome-finance/contracts)

### Velodrome V2 (Optimism) — Dominant DEX

Same ve(3,3) model as Aerodrome — same team (Dromos Labs). Velodrome was built first for Optimism, Aerodrome is the Base fork. Both merged into "Aero" in November 2025.

| Contract | Address | Status |
|----------|---------|--------|
| VELO Token (V2) | `0x9560e827aF36c94D2Ac33a39bCE1Fe78631088Db` | ✅ Verified |
| Router | `0xa062aE8A9c5e11aaA026fc2670B0D65cCc8B2858` | ✅ Verified |
| Voter | `0x41C914ee0c7E1A5edCD0295623e6dC557B5aBf3C` | ✅ Verified |
| VotingEscrow | `0xFAf8FD17D9840595845582fCB047DF13f006787d` | ✅ Verified |
| PoolFactory | `0xF1046053aa5682b4F9a81b5481394DA16BE5FF5a` | ✅ Verified |
| Minter | `0x6dc9E1C04eE59ed3531d73a72256C0da46D10982` | ✅ Verified |
| GaugeFactory | `0x8391fE399640E7228A059f8Fa104b8a7B4835071` | ✅ Verified |
| FactoryRegistry | `0xF4c67CdEAaB8360370F41514d06e32CcD8aA1d7B` | ✅ Verified |

⚠️ **V1 VELO token** (`0x3c8B650257cFb5f272f799F5e2b4e65093a11a05`) is deprecated. Use V2 above.

Source: [velodrome-finance/contracts](https://github.com/velodrome-finance/contracts)

### GMX V2 (Arbitrum) — Perpetual DEX

Leading onchain perpetual exchange. V2 uses isolated GM pools per market (Fully Backed and Synthetic). Competes with Hyperliquid.

| Contract | Address | Status |
|----------|---------|--------|
| GMX Token | `0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a` | ✅ Verified |
| Exchange Router (latest) | `0x1C3fa76e6E1088bCE750f23a5BFcffa1efEF6A41` | ✅ Verified |
| Exchange Router (previous) | `0x7C68C7866A64FA2160F78EeAe12217FFbf871fa8` | ✅ Verified |
| DataStore | `0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8` | ✅ Verified |
| Reader | `0x470fbC46bcC0f16532691Df360A07d8Bf5ee0789` | ✅ Verified |
| Reward Router V2 | `0xA906F338CB21815cBc4Bc87ace9e68c87eF8d8F1` | ✅ Verified |

**Note:** Both Exchange Router addresses are valid — both point to the same DataStore. The latest (`0x1C3f...`) is from the current gmx-synthetics repo deployment.

Source: [gmx-io/gmx-synthetics](https://github.com/gmx-io/gmx-synthetics)

### Pendle (Arbitrum) — Yield Trading

Tokenizes future yield into PT (Principal Token) and YT (Yield Token). Core invariant: `SY_value = PT_value + YT_value`. Multi-chain (also on Ethereum, Base, Optimism).

| Contract | Address | Status |
|----------|---------|--------|
| PENDLE Token | `0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8` | ✅ Verified |
| Router | `0x888888888889758F76e7103c6CbF23ABbF58F946` | ✅ Verified |
| RouterStatic | `0xAdB09F65bd90d19e3148D9ccb693F3161C6DB3E8` | ✅ Verified |
| Market Factory V3 | `0x2FCb47B58350cD377f94d3821e7373Df60bD9Ced` | ✅ Verified |
| Market Factory V4 | `0xd9f5e9589016da862D2aBcE980A5A5B99A94f3E8` | ✅ Verified |
| PT/YT Oracle | `0x5542be50420E88dd7D5B4a3D488FA6ED82F6DAc2` | ✅ Verified |
| Limit Router | `0x000000000000c9B3E2C3Ec88B1B4c0cD853f4321` | ✅ Verified |
| Yield Contract Factory V3 | `0xEb38531db128EcA928aea1B1CE9E5609B15ba146` | ✅ Verified |
| Yield Contract Factory V4 | `0xc7F8F9F1DdE1104664b6fC8F33E49b169C12F41E` | ✅ Verified |

Source: [pendle-finance/pendle-core-v2-public](https://github.com/pendle-finance/pendle-core-v2-public/blob/main/deployments/42161-core.json)

### Camelot (Arbitrum) — Native DEX

Arbitrum-native DEX with concentrated liquidity and launchpad. Two AMM versions: V2 (constant product) and V4 (Algebra concentrated liquidity).

| Contract | Address | Status |
|----------|---------|--------|
| GRAIL Token | `0x3d9907F9a368ad0a51Be60f7Da3b97cf940982D8` | ✅ Verified |
| xGRAIL | `0x3CAaE25Ee616f2C8E13C74dA0813402eae3F496b` | ✅ Verified |
| Router (AMM V2) | `0xc873fEcbd354f5A56E00E710B90EF4201db2448d` | ✅ Verified |
| Factory (AMM V2) | `0x6EcCab422D763aC031210895C81787E87B43A652` | ✅ Verified |
| SwapRouter (AMM V4 / Algebra) | `0x4ee15342d6Deb297c3A2aA7CFFd451f788675F53` | ✅ Verified |
| AlgebraFactory (AMM V4) | `0xBefC4b405041c5833f53412fF997ed2f697a2f37` | ✅ Verified |

Source: [docs.camelot.exchange](https://docs.camelot.exchange/contracts/arbitrum/one-mainnet)

### SyncSwap (zkSync Era) — Dominant DEX

The leading native DEX on zkSync Era. Multiple router and factory versions.

| Contract | Address | Status |
|----------|---------|--------|
| Router V1 | `0x2da10A1e27bF85cEdD8FFb1AbBe97e53391C0295` | ✅ Verified |
| Router V2 | `0x9B5def958d0f3b6955cBEa4D5B7809b2fb26b059` | ✅ Verified |
| Router V3 | `0x1B887a14216Bdeb7F8204Ee6a269Bd9Ff73A084C` | ✅ Verified |
| Classic Pool Factory V1 | `0xf2DAd89f2788a8CD54625C60b55cD3d2D0ACa7Cb` | ✅ Verified |
| Classic Pool Factory V2 | `0x0a34FBDf37C246C0B401da5f00ABd6529d906193` | ✅ Verified |
| Stable Pool Factory V1 | `0x5b9f21d407F35b10CbfDDca17D5D84b129356ea3` | ✅ Verified |
| Vault V1 | `0x621425a1Ef6abE91058E9712575dcc4258F8d091` | ✅ Verified |

**Note:** SYNC token is not yet deployed.

Source: [docs.syncswap.xyz](https://docs.syncswap.xyz/syncswap/smart-contracts/smart-contracts)

### Morpho Blue (Base)

Permissionless lending protocol. Deployed on Base and Ethereum, but **NOT on Arbitrum** as of February 2026 (despite the vanity CREATE2 address).

| Contract | Address | Chain | Status |
|----------|---------|-------|--------|
| Morpho | `0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb` | Base | ✅ Verified |
| Morpho | `0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb` | Arbitrum | ❌ Not deployed |

Source: [docs.morpho.org](https://docs.morpho.org/get-started/resources/addresses/)

---

## AI & Agent Standards

### ERC-8004 (Same addresses on 20+ chains)
| Contract | Address | Status |
|----------|---------|--------|
| IdentityRegistry | `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` | ✅ Verified |
| ReputationRegistry | `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63` | ✅ Verified |

Verified on: Mainnet, Arbitrum, Base, Optimism (CREATE2 — same address on all chains).

---

## Major Tokens (Mainnet)

| Token | Address | Status |
|-------|---------|--------|
| UNI | `0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984` | ✅ Verified |
| AAVE | `0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9` | ✅ Verified |
| COMP | `0xc00e94Cb662C3520282E6f5717214004A7f26888` | ✅ Verified |
| MKR | `0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2` | ✅ Verified |
| LDO | `0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32` | ✅ Verified |
| WBTC | `0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599` | ✅ Verified |
| stETH (Lido) | `0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84` | ✅ Verified |
| rETH (Rocket Pool) | `0xae78736Cd615f374D3085123A210448E74Fc6393` | ✅ Verified |

---

## How to Verify Addresses

```bash
# Check bytecode exists
cast code 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 --rpc-url https://eth.llamarpc.com
```

**Cross-reference:** Protocol docs → CoinGecko → block explorer → GitHub deployments.

**EIP-55 Checksum:** Mixed case = checksum. Most tools validate automatically.

## Address Discovery Resources

- **Uniswap:** https://docs.uniswap.org/contracts/v3/reference/deployments/
- **Aave:** https://docs.aave.com/developers/deployed-contracts/deployed-contracts
- **Compound V3:** https://docs.compound.finance/
- **Chainlink:** https://docs.chain.link/data-feeds/price-feeds/addresses
- **Aerodrome:** https://github.com/aerodrome-finance/contracts
- **Velodrome:** https://github.com/velodrome-finance/contracts
- **GMX:** https://github.com/gmx-io/gmx-synthetics
- **Pendle:** https://github.com/pendle-finance/pendle-core-v2-public
- **Camelot:** https://docs.camelot.exchange/contracts/arbitrum/one-mainnet
- **SyncSwap:** https://docs.syncswap.xyz/syncswap/smart-contracts/smart-contracts
- **Morpho:** https://docs.morpho.org/get-started/resources/addresses/
- **Lido:** https://docs.lido.fi/deployed-contracts/
- **Rocket Pool:** https://docs.rocketpool.net/overview/contracts-integrations
- **1inch:** https://docs.1inch.io/docs/aggregation-protocol/introduction
- **EigenLayer:** https://docs.eigenlayer.xyz/
- **Across:** https://docs.across.to/reference/contract-addresses
- **Chainlink CCIP:** https://docs.chain.link/ccip/directory/mainnet
- **Yearn V3:** https://docs.yearn.fi/developers/addresses/v3-contracts
- **CoinGecko:** https://www.coingecko.com (token addresses)
- **Token Lists:** https://tokenlists.org/
- **DeFi Llama:** https://defillama.com (TVL rankings by chain)

## Multi-Chain Notes

- **CREATE2 deployments** (same address cross-chain): Uniswap V3, Safe, Seaport, ERC-4337 EntryPoint, ERC-8004, Permit2, 1inch v6, Yearn V3, Arachnid Deployer
- **Different addresses per chain:** USDC, USDT, DAI, WETH, wstETH, **Uniswap V4**, Across SpokePool, Chainlink CCIP Router — always check per-chain
- **Native vs Bridged USDC:** Some chains have both! Use native.

---

✅ **All addresses verified onchain via `eth_getCode` + `eth_call` — February 16, 2026. Bytecode confirmed present, identity confirmed via symbol/name/cross-reference calls. Does NOT guarantee safety — always verify on block explorer before sending transactions.**
