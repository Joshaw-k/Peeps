// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useSetChain, useWallets } from "@web3-onboard/react";

import {
  CartesiDApp,
  CartesiDApp__factory,
  InputBox,
  InputBox__factory,
  EtherPortal,
  EtherPortal__factory,
  ERC20Portal,
  ERC20Portal__factory,
  ERC721Portal,
  ERC721Portal__factory,
  DAppAddressRelay,
  DAppAddressRelay__factory,
  ERC1155SinglePortal,
  ERC1155SinglePortal__factory,
  ERC1155BatchPortal,
  ERC1155BatchPortal__factory,
} from "./generated/rollups";
import { ConnectedChain } from "@web3-onboard/core";

import configFile from "./config.json";
import { JsonRpcSigner } from "@ethersproject/providers";
import {custom, useAccount, useConnectorClient} from "wagmi";

const config: any = configFile;
const rkConfig = rainbowKitConfig;

export interface RollupsContracts {
  dappContract: CartesiDApp;
  signer: JsonRpcSigner;
  relayContract: DAppAddressRelay;
  inputContract: InputBox;
  etherPortalContract: EtherPortal;
  erc20PortalContract: ERC20Portal;
  erc721PortalContract: ERC721Portal;
  erc1155SinglePortalContract: ERC1155SinglePortal;
  erc1155BatchPortalContract: ERC1155BatchPortal;
}

import { providers } from 'ethers'
import { useMemo } from 'react'
import {Account, Chain, Client, createWalletClient, Transport} from 'viem'
import { Config, useClient } from 'wagmi'
import {mainnet} from "wagmi/chains";
import { getClient } from "@wagmi/core";
import {rainbowKitConfig} from "../../wagmi";
import {usePeepsContext} from "./context";

export function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === 'fallback')
    return new providers.FallbackProvider(
        (transport.transports as ReturnType<Transport>[]).map(
            ({ value }) => new providers.JsonRpcProvider(value?.url, network),
        ),
    )
  return new providers.JsonRpcProvider(transport.url, network)
}

/** Hook to convert a viem Client to an ethers.js Provider. */
export function useEthersProvider(
    {
      chainId,
    }: { chainId?: number | undefined } = {}) {
  const client = useClient<Config>({chainId})
  return useMemo(() => clientToProvider(client), [client])
}

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new providers.Web3Provider(transport, network)
  const signer = provider.getSigner(account.address)
  return signer
}

/** Action to convert a Viem Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId })
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client])
}


export const useRollups = (dAddress: string): RollupsContracts | undefined => {
  const [contracts, setContracts] = useState<RollupsContracts | undefined>();
  const [{ connectedChain }] = useSetChain();
  const [connectedWallet] = useWallets();
  const [dappAddress] = useState<string>(dAddress);
  // const chainId = useChainId();
  const {address, connector, chain, chainId, isConnected} = useAccount();
  // console.log(chainId);
  // const { data: client } = useConnectorClient<Config>({ chainId });
  // const provider = useEthersProvider({chainId})
  // const signer = useEthersSigner({chainId})
  const { baseDappAddress, refreshPost, updateRollupContracts } = usePeepsContext();

  useEffect(() => {
    const connect = async (
      // chain: ConnectedChain
      chain: Chain
    ): Promise<RollupsContracts> => {
      // export function walletClientToProvider(walletClient: WalletClient) {
      //   const { chain, transport } = walletClient
      //   const network = {
      //     chainId: chain.id,
      //     name: chain.name,
      //     ensAddress: chain.contracts?.ensRegistry?.address,
      //   }
      //   const provider = new providers.Web3Provider(transport as any, network)
      //   return provider
      // }
      //
      // /** Hook to convert a viem Wallet Client to an ethers.js Web3Provider. */
      // export function useEthersWeb3Provider({ chainId }: { chainId?: number } = {}) {
      //   const { data: walletClient } = useWalletClient({ chainId })
      //   return React.useMemo(
      //       () => (walletClient ? walletClientToProvider(walletClient) : undefined),
      //       [walletClient],
      //   )
      // }

      // const provider = new ethers.providers.Web3Provider(
      //   connectedWallet.provider
      //   //   connector
      // );
      // const signer = provider.getSigner();
      // const provider = useEthersProvider()
      // const signer = useEthersSigner()

      // const account = '0x0000000000000000000000000000000000000000'

//       const client = createWalletClient({
//         account: address,
//         chain: mainnet,
//         transport: custom(window.ethereum)
//       })
//
// // ethers.js
//       const provider = new providers.Web3Provider(window.ethereum, client?.chain)
//       const provider = new providers.Web3Provider(window.ethereum)
      // const signer = provider.getSigner(address)
      const client = getClient(rkConfig, {
        chainId: 31337,
      })
      console.log("CLIENttt...", client);
      // const { transport } = client
      // console.log("Chain id...", chain.id);
      const network = {
        chainId: chain.id,
        name: chain.name,
        // ensAddress: chain.contracts?.ensRegistry?.address,
      }
      const provider = new providers.Web3Provider(client.transport)
      // console.log("ProvideR", provider);
      const signer = provider.getSigner(address)
      // console.log("SIGNerrrrr.", signer);
      // return signer
      // const signer = clientToSigner(client);

      let dappRelayAddress = "";
      if (config[`0x${chain.id}`]?.DAppRelayAddress) {
        dappRelayAddress = config[`0x${chain.id}`].DAppRelayAddress;
      } else {
        console.error(
          `No dapp relay address address defined for chain ${chain.id}`
        );
      }

      let inputBoxAddress = "";
      if (config[`0x${chain.id}`]?.InputBoxAddress) {
        inputBoxAddress = config[`0x${chain.id}`].InputBoxAddress;
      } else {
        console.error(
          `No input box address address defined for chain ${chain.id}`
        );
      }

      let etherPortalAddress = "";
      if (config[`0x${chain.id}`]?.EtherPortalAddress) {
        etherPortalAddress = config[`0x${chain.id}`].EtherPortalAddress;
      } else {
        console.error(
          `No ether portal address address defined for chain ${chain.id}`
        );
      }

      let erc20PortalAddress = "";
      if (config[`0x${chain.id}`]?.Erc20PortalAddress) {
        erc20PortalAddress = config[`0x${chain.id}`].Erc20PortalAddress;
      } else {
        console.error(
          `No erc20 portal address address defined for chain ${chain.id}`
        );
        // alert(`No erc20 portal address defined for chain ${chain.id}`);
      }

      let erc721PortalAddress = "";
      if (config[`0x${chain.id}`]?.Erc721PortalAddress) {
        erc721PortalAddress = config[`0x${chain.id}`].Erc721PortalAddress;
      } else {
        console.error(
          `No erc721 portal address address defined for chain ${chain.id}`
        );
        // alert(`No erc721 portal address defined for chain ${chain.id}`);
      }

      let erc1155SinglePortalAddress = "";
      if (config[`0x${chain.id}`]?.Erc1155SinglePortalAddress) {
        erc1155SinglePortalAddress =
          config[`0x${chain.id}`].Erc1155SinglePortalAddress;
      } else {
        console.error(
          `No erc1155 single portal address address defined for chain ${chain.id}`
        );
        // alert(`No erc1155 single portal address defined for chain ${chain.id}`);
      }

      let erc1155BatchPortalAddress = "";
      if (config[`0x${chain.id}`]?.Erc1155BatchPortalAddress) {
        erc1155BatchPortalAddress = config[`0x${chain.id}`].Erc1155BatchPortalAddress;
      } else {
        console.error(
          `No erc1155 batch portal address address defined for chain ${chain.id}`
        );
        // alert(`No erc1155 batch portal address defined for chain ${chain.id}`);
      }
      // dapp contract
      const dappContract = CartesiDApp__factory.connect(dappAddress, signer);

      // relay contract
      const relayContract = DAppAddressRelay__factory.connect(
        dappRelayAddress,
        signer
      );

      // input contract
      const inputContract = InputBox__factory.connect(inputBoxAddress, signer);

      // portals contracts
      const etherPortalContract = EtherPortal__factory.connect(
        etherPortalAddress,
        signer
      );

      const erc20PortalContract = ERC20Portal__factory.connect(
        erc20PortalAddress,
        signer
      );

      const erc721PortalContract = ERC721Portal__factory.connect(
        erc721PortalAddress,
        signer
      );

      const erc1155SinglePortalContract = ERC1155SinglePortal__factory.connect(
        erc1155SinglePortalAddress,
        signer
      );

      const erc1155BatchPortalContract = ERC1155BatchPortal__factory.connect(
        erc1155BatchPortalAddress,
        signer
      );

      const _contracts = {
        dappContract,
        signer,
        relayContract,
        inputContract,
        etherPortalContract,
        erc20PortalContract,
        erc721PortalContract,
        erc1155SinglePortalContract,
        erc1155BatchPortalContract,
      };
      updateRollupContracts(_contracts);
      return _contracts;
    };
    if (connector && chainId) {
    connect(chain).then((contracts) => {
        // console.log(contracts);
        setContracts(contracts);
        // console.log("Inside connect fn");
      });
    }
    // if (connectedWallet?.provider && connectedChain) {
    //   connect(connectedChain).then((contracts) => {
    //     setContracts(contracts);
    //   });
    // }
  // }, [connectedWallet, connectedChain, dappAddress]);
  }, [dappAddress, isConnected, chainId, address]);
  // console.log("Before return contracts", contracts);

  useEffect(() => {
    // console.log("Contract refresh")
    updateRollupContracts(contracts)
  }, [contracts]);
  return contracts;
};
