"use client"
import { usePeepsContext } from '@/app/context';
import { useRollups } from '@/app/useRollups';
import React, { useEffect, useState } from 'react'
import { VoucherHistory } from './VoucherHistory';

const Voucher = () => {
    const { activeAddress, baseDappAddress } = usePeepsContext();
    const [dappRelayedAddress, setDappRelayedAddress] = useState<boolean>(false)
    const rollups = useRollups(baseDappAddress);
    const sendAddress = async () => {
        if (rollups) {
            try {
                await rollups.relayContract.relayDAppAddress(baseDappAddress);
                setDappRelayedAddress(true);
            } catch (e) {
                console.log(`${e}`);
            }
        }
    };
    useEffect(() => {
        console.log("reachead1")
        sendAddress()
        console.log("reachead2")
    }, [])

    return (
        <div>{!dappRelayedAddress &&
            <div>
                Let the dApp know its address! <br />
                <button
                    onClick={sendAddress}
                    disabled={!rollups}
                    className='btn bg-white text-walletDark hover:text-white btn-lg rounded-box inline-flex w-auto items-center justify-center font-medium text-base leading-none outline-none outline-0'
                >
                    Relay Address
                </button>
                <br />
                <br />
            </div>
        }
            {dappRelayedAddress && <VoucherHistory dappAddress={baseDappAddress} />}</div>
    )
}

export default Voucher