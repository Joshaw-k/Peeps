import { http, createConfig } from 'wagmi'
import {arbitrum, base, mainnet, optimism, polygon, sepolia} from 'wagmi/chains'
// import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'
import {getDefaultConfig, getDefaultWallets} from "@rainbow-me/rainbowkit";
import {argentWallet, ledgerWallet, trustWallet} from "@rainbow-me/rainbowkit/wallets";
import {Chain} from "viem";

const { wallets } = getDefaultWallets();

const localhost = {
    id: 31_337,
    name: 'Localhost',
    // iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
    // iconBackground: '#fff',
    nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
    rpcUrls: {
        default: { http: ['http://localhost:8545'] },
    },
    blockExplorers: {
        default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 11_907_934,
        },
    },
} as const satisfies Chain;

export const rainbowKitConfig = getDefaultConfig({
    appName: 'Peeps: The decentralized platform',
    projectId: '7f49c7e89e54528522eef8334c58506e',
    transports: {
        [localhost.id]: http("http://localhost:8545"),
        [mainnet.id]: http(), // http('https://eth-mainnet.g.alchemy.com/v2/...')
        [sepolia.id]: http(), // http('https://eth-sepolia.g.alchemy.com/v2/...')
    },
    wallets: [
        ...wallets,
        {
            groupName: 'Other',
            wallets: [argentWallet, trustWallet, ledgerWallet],
        }
    ],
    chains: [
        localhost,
        mainnet,
        sepolia,
        polygon,
        optimism,
        arbitrum,
        base,
        ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
    ],
    ssr: true,
})

// export const wagmiConfig = createConfig({
//     autoConnect: true,
//     chains: [mainnet, sepolia],
//     connectors: [
//         injected(),
//         metaMask(),
//         safe(),
//     ],
//     transports: {
//         [mainnet.id]: http(),
//         [sepolia.id]: http(),
//     },
// })