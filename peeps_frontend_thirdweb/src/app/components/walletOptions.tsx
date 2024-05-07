"use client";

import {Dialog, Transition} from '@headlessui/react'
import * as React from 'react'
// import {Connector, useAccount, useConnect} from 'wagmi'
import {Fragment, useState} from "react";

// export function WalletOptions() {
//     const {connectors, connect} = useConnect()
//     const {isConnecting} = useAccount()
//     let [isOpen, setIsOpen] = useState<boolean>(true);
//
//     function closeModal() {
//         setIsOpen(false)
//     }
//
//     function openModal() {
//         setIsOpen(true)
//     }
//
//     return (
//         <div>
//             <details className="dropdown dropdown-end">
//                 <summary className="m-1 btn btn-primary rounded-box">Connect Wallet</summary>
//                 <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
//                     {
//                         connectors.map((connector) => (
//                             <li>
//                                 <WalletOption
//                                     key={connector.uid}
//                                     connector={connector}
//                                     isConnecting={isConnecting}
//                                     onClick={() => connect({connector})}
//                                 />
//                             </li>
//                         ))
//                     }
//                 </ul>
//             </details>
//         </div>
//     )
// }
//
// function WalletOption(
//     {
//         connector,
//         isConnecting,
//         onClick,
//     }: {
//         connector: Connector
//         isConnecting: Boolean
//         onClick: () => void
//     }) {
//     const [ready, setReady] = React.useState(false)
//
//     React.useEffect(() => {
//         ;(async () => {
//             const provider = await connector.getProvider()
//             setReady(!!provider)
//         })()
//     }, [connector])
//
//     return (
//         <button className="btn btn-primary rounded-box" disabled={!ready} onClick={onClick}>
//             {isConnecting ? "Connecting" : connector.name}
//         </button>
//     )
// }

export const WalletOptions = () => {
    return <></>;
}