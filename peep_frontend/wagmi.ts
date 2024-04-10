import { http, createConfig } from 'wagmi'
import {arbitrum, base, mainnet, optimism, polygon, sepolia} from 'wagmi/chains'
// import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'
import {getDefaultConfig, getDefaultWallets} from "@rainbow-me/rainbowkit";
import {argentWallet, ledgerWallet, trustWallet} from "@rainbow-me/rainbowkit/wallets";

const { wallets } = getDefaultWallets();

export const rainbowKitConfig = getDefaultConfig({
    appName: 'Peeps: The decentralized platform',
    projectId: '7f49c7e89e54528522eef8334c58506e',
    transports: {
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