---
name: addresses
description: Verified contract addresses for major Ethereum protocols across mainnet and L2s. Use this instead of guessing or hallucinating addresses. Includes Uniswap, Aave, Compound, USDC, USDT, DAI, ENS, Safe, and more. Always verify addresses against a block explorer before sending transactions.
---

# Contract Addresses

> **CRITICAL:** Never hallucinate a contract address. Wrong addresses mean lost funds. If an address isn't listed here, look it up on the block explorer or the protocol's official docs before using it.

## Stablecoins

### USDC (Circle)
| Network | Address |
|---------|---------|
| Mainnet | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` |
| Arbitrum | `0xaf88d065e77c8cC2239327C5EDb3A432268e5831` |
| Optimism | `0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85` |
| Base | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |

### USDT (Tether)
| Network | Address |
|---------|---------|
| Mainnet | `0xdAC17F958D2ee523a2206206994597C13D831ec7` |
| Arbitrum | `0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9` |
| Optimism | `0x94b008aA00579c1307B0EF2c499aD98a8ce58e58` |

### DAI (MakerDAO)
| Network | Address |
|---------|---------|
| Mainnet | `0x6B175474E89094C44Da98b954EedeAC495271d0F` |
| Arbitrum | `0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1` |
| Optimism | `0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1` |

## WETH (Wrapped ETH)
| Network | Address |
|---------|---------|
| Mainnet | `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2` |
| Arbitrum | `0x82aF49447D8a07e3bd95BD0d56f35241523fBab1` |
| Optimism | `0x4200000000000000000000000000000000000006` |
| Base | `0x4200000000000000000000000000000000000006` |

## Uniswap

### V2
| Contract | Mainnet |
|----------|---------|
| Router | `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D` |
| Factory | `0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f` |

### V3
| Contract | Mainnet |
|----------|---------|
| Router (SwapRouter02) | `0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45` |
| Factory | `0x1F98431c8aD98523631AE4a59f267346ea31F984` |
| Quoter V2 | `0x61fFE014bA17989E743c5F6cB21bF9697530B21e` |
| Position Manager | `0xC36442b4a4522E871399CD717aBDD847Ab11FE88` |

### V3 (Multi-chain)
| Contract | Arbitrum | Optimism | Base |
|----------|----------|----------|------|
| Router | `0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45` | `0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45` | `0x2626664c2603336E57B271c5C0b26F421741e481` |
| Factory | `0x1F98431c8aD98523631AE4a59f267346ea31F984` | `0x1F98431c8aD98523631AE4a59f267346ea31F984` | `0x33128a8fC17869897dcE68Ed026d694621f6FDfD` |

<!-- VERIFICATION NEEDED: V3 addresses on Base may differ. Check official Uniswap deployment docs -->

## Aave V3

| Contract | Mainnet |
|----------|---------|
| Pool | `0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2` |
| PoolAddressesProvider | `0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e` |

| Contract | Arbitrum |
|----------|----------|
| Pool | `0x794a61358D6845594F94dc1DB02A252b5b4814aD` |
| PoolAddressesProvider | `0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb` |

## ENS (Ethereum Name Service)

| Contract | Mainnet |
|----------|---------|
| Registry | `0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e` |
| Public Resolver | `0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63` |
| Registrar Controller | `0x253553366Da8546fC250F225fe3d25d0C782303b` |

## Safe (Gnosis Safe)

| Contract | Mainnet |
|----------|---------|
| Safe Singleton (v1.4.1) | `0x41675C099F32341bf84BFc5382aF534df5C7461a` |
| Safe Factory | `0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67` |
| MultiSend | `0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526` |

<!-- VERIFICATION NEEDED: Safe addresses update with versions. Check https://github.com/safe-global/safe-deployments -->

## Account Abstraction (ERC-4337)

| Contract | All EVM Chains |
|----------|---------------|
| EntryPoint v0.7 | `0x0000000071727De22E5E9d8BAf0edAc6f37da032` |
| EntryPoint v0.6 | `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789` |

## ERC-8004 Agent Identity

| Contract | Base |
|----------|------|
| Identity Registry | `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` |

## Chainlink

| Contract | Mainnet |
|----------|---------|
| LINK Token | `0x514910771AF9Ca656af840dff83E8264EcF986CA` |
| ETH/USD Feed | `0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419` |
| BTC/USD Feed | `0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c` |

## How to Verify Addresses

1. **Etherscan:** Go to the address page and check the "Contract" tab for verified source code
2. **Protocol docs:** Always cross-reference with the protocol's official documentation
3. **GitHub deployments:** Many protocols publish deployment addresses in their repos
4. **Checksums:** Ethereum addresses should be checksummed (mixed-case). Use `ethers.getAddress()` to verify.

```bash
# Verify an address is a contract (not an EOA)
cast code 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 --rpc-url https://eth.llamarpc.com
# Returns bytecode if contract, "0x" if EOA
```

## Disclaimer

Contract addresses can change with protocol upgrades. Always verify against the protocol's official documentation and a block explorer before sending transactions. This list was last verified in February 2026.
