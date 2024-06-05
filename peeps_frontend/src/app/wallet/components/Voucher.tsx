"use client"
import { usePeepsContext } from '@/app/context';
import { useRollups } from '@/app/useRollups';
import React, { useEffect, useState } from 'react'
import { VoucherHistory } from './VoucherHistory';

const Voucher = () => {
    const { activeAddress, baseDappAddress } = usePeepsContext();

    // const [dappRelayedAddress, setDappRelayedAddress] = useState<boolean>(false)
    // const rollups = useRollups(baseDappAddress);
    // const sendAddress = async () => {
    //     if (rollups) {
    //         try {
    //             await rollups.relayContract.relayDAppAddress(baseDappAddress);
    //             setDappRelayedAddress(true);
    //         } catch (e) {
    //             console.log(`${e}`);
    //         }
    //     }
    // };
    // useEffect(() => {
    //     sendAddress()
    // }, [])

    return (
        <div><VoucherHistory dappAddress={baseDappAddress} /></div>
    )
}

export default Voucher