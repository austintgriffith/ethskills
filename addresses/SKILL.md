---
name: addresses
description: Verified contract addresses for major Ethereum protocols across mainnet and L2s. Use this instead of guessing or hallucinating addresses. Includes Uniswap, Aave, Compound, USDC, USDT, DAI, ENS, Safe, Chainlink, and more. Always verify addresses against a block explorer before sending transactions.
---

# Contract Addresses

> **CRITICAL:** Never hallucinate a contract address. Wrong addresses mean lost funds. If an address isn't listed here, look it up on the block explorer or the protocol's official docs before using it.

**Last Verified:** February 13, 2026 (all addresses verified onchain via `eth_getCode`)

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

#### Universal Router (Mainnet)
| Contract | Address | Status |
|----------|---------|--------|
| Universal Router | `0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD` | ✅ Verified |

#### UNI Token
| Network | Address | Status |
|---------|---------|--------|
| Mainnet | `0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984` | ✅ Verified |

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
- **CoinGecko:** https://www.coingecko.com (token addresses)
- **Token Lists:** https://tokenlists.org/

## Multi-Chain Notes

- **CREATE2 deployments** (same address cross-chain): Uniswap V3, Safe, Seaport, ERC-4337 EntryPoint, ERC-8004
- **Different addresses per chain:** USDC, USDT, DAI, WETH — always check per-chain
- **Native vs Bridged USDC:** Some chains have both! Use native.

---

✅ **All addresses verified onchain via `eth_getCode` — February 13, 2026. Bytecode confirmed present. Does NOT guarantee safety — always verify on block explorer before sending transactions.**
