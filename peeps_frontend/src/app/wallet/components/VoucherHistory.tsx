// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { BigNumber, ethers } from "ethers";
import React, { useEffect } from "react";
import { useVouchersQuery, useVoucherQuery, VouchersDocument, VoucherDocument } from "../../graphgQL";
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Button,
    Text
} from '@chakra-ui/react'
import { useRollups } from "@/app/useRollups";
import { useQuery } from "@apollo/client";
import { usePeepsContext } from "@/app/context";

type Voucher = {
    id: string;
    index: number;
    destination: string;
    input: any, //{index: number; epoch: {index: number; }
    payload: string;
    proof: any;
    executed: any;
};

interface IVoucherPropos {
    dappAddress: string
}

export const VoucherHistory: React.FC<IVoucherPropos> = ({ dappAddress }) => {
    const { baseDappAddress } = usePeepsContext();
    const { loading, error, data } = useQuery(VouchersDocument);
    const query = useQuery(VouchersDocument);
    console.log(query)
    // const [result, reexecuteQuery] = useVouchersQuery();
    const [voucherToFetch, setVoucherToFetch] = React.useState([0, 0]);
    const { loading: voucherLoading, error: voucherError, data: voucherData, client } = useQuery(VoucherDocument, {
        variables: { voucherIndex: voucherToFetch[0], inputIndex: voucherToFetch[1] }
    });
    // const [voucherResult, reexecuteVoucherQuery] = useVoucherQuery({
    //     variables: { voucherIndex: voucherToFetch[0], inputIndex: voucherToFetch[1] }//, pause: !!voucherIdToFetch
    // });
    const [voucherToExecute, setVoucherToExecute] = React.useState<any>();
    // const { data, fetching, error } = result;
    const rollups = useRollups(dappAddress);
    console.log("VouchersData", data);
    console.log("Single VoucherData", voucherData);


    const getProof = async (voucher: Voucher) => {
        console.log(`[${voucher.index},${voucher.input.index}]`)
        setVoucherToFetch([voucher.index, voucher.input.index]);
        // reexecuteVoucherQuery({ requestPolicy: 'network-only' });
        // client.refetchQueries({});
        client.query({
            fetchPolicy: 'network-only',
            query: VoucherDocument,
            variables: { voucherIndex: voucher.index, inputIndex: voucher.input.index }
        });
    };

    const executeVoucher = async (voucher: any) => {
        if (rollups && !!voucher.proof) {

            const newVoucherToExecute = { ...voucher };
            try {
                const tx = await rollups.dappContract.executeVoucher(voucher.destination, voucher.payload, voucher.proof);
                const receipt = await tx.wait();
                newVoucherToExecute.msg = `voucher executed! (tx="${tx.hash}")`;
                if (receipt.events) {
                    newVoucherToExecute.msg = `${newVoucherToExecute.msg} - resulting events: ${JSON.stringify(receipt.events)}`;
                    newVoucherToExecute.executed = await rollups.dappContract.wasVoucherExecuted(BigNumber.from(voucher.input.index), BigNumber.from(voucher.index));
                }
            } catch (e) {
                newVoucherToExecute.msg = `COULD NOT EXECUTE VOUCHER: ${JSON.stringify(e)}`;
                console.log(`COULD NOT EXECUTE VOUCHER: ${JSON.stringify(e)}`);
            }
            setVoucherToExecute(newVoucherToExecute);
        }
    }

    useEffect(() => {
        const setVoucher = async (voucher: any) => {
            let voucherD;
            if (rollups) {
                console.log("Was voucher executed", voucher);
                const isExecuted = await rollups.dappContract.wasVoucherExecuted(BigNumber.from(voucher.input.index), BigNumber.from(voucher.index));
                // voucher.executed
                voucherD = { ...voucher, executed: isExecuted }
                console.log("voucher executed", voucherD);
            }
            setVoucherToExecute(voucherD);
        }

        // if (!voucherResult.fetching && voucherResult.data) {
        //     setVoucher(voucherResult.data.voucher);
        // }
        if (voucherData) {
            console.log("Voucher data", voucherData);
            setVoucher(voucherData.voucher);
        }
        // }, [voucherResult, rollups]);
    }, [voucherData, rollups]);

    // if (fetching) return <p>Loading...</p>;
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Oh no... {error.message}</p>;

    if (!data || !data.vouchers) return <p>No vouchers</p>;

    const vouchers: Voucher[] = data.vouchers.edges.map((node: any, index: number) => {
        const n = node.node;
        let payload = n?.payload;
        let inputPayload = n?.input.payload;
        if (inputPayload) {
            try {
                inputPayload = ethers.utils.toUtf8String(inputPayload);
            } catch (e) {
                inputPayload = inputPayload + " (hex)";
            }
        } else {
            inputPayload = "(empty)";
        }
        if (payload) {
            const decoder = new ethers.utils.AbiCoder();
            const selector = decoder.decode(["bytes4"], payload)[0];
            payload = ethers.utils.hexDataSlice(payload, 4);
            try {
                switch (selector) {
                    case '0xa9059cbb': {
                        // erc20 transfer; 
                        const decode = decoder.decode(["address", "uint256"], payload);
                        payload = `Erc20 Transfer - Amount: ${ethers.utils.formatEther(decode[1])} - Address: ${decode[0]}`;
                        break;
                    }
                    case '0x42842e0e': {
                        //erc721 safe transfer;
                        const decode = decoder.decode(["address", "address", "uint256"], payload);
                        payload = `Erc721 Transfer - Id: ${decode[2]} - Address: ${decode[1]}`;
                        break;
                    }
                    case '0x522f6815': {
                        //ether transfer; 
                        const decode2 = decoder.decode(["address", "uint256"], payload)
                        payload = `Ether Transfer - Amount: ${ethers.utils.formatEther(decode2[1])} (Native eth) - Address: ${decode2[0]}`;
                        break;
                    }
                    case '0xf242432a': {
                        //erc155 single safe transfer;
                        const decode = decoder.decode(["address", "address", "uint256", "uint256"], payload);
                        payload = `Erc1155 Single Transfer - Id: ${decode[2]} Amount: ${decode[3]} - Address: ${decode[1]}`;
                        break;
                    }
                    case '0x2eb2c2d6': {
                        //erc155 Batch safe transfer;
                        const decode = decoder.decode(["address", "address", "uint256[]", "uint256[]"], payload);
                        payload = `Erc1155 Batch Transfer - Ids: ${decode[2]} Amounts: ${decode[3]} - Address: ${decode[1]}`;
                        break;
                    }
                    case '0xd0def521': {
                        //erc721 mint;
                        const decode = decoder.decode(["address", "string"], payload);
                        payload = `Mint Erc721 - String: ${decode[1]} - Address: ${decode[0]}`;
                        break;
                    }
                    case '0x755edd17': {
                        //erc721 mintTo;
                        const decode = decoder.decode(["address"], payload);
                        payload = `Mint Erc721 - Address: ${decode[0]}`;
                        break;
                    }
                    case '0x6a627842': {
                        //erc721 mint;
                        const decode = decoder.decode(["address"], payload);
                        payload = `Mint Erc721 - Address: ${decode[0]}`;
                        break;
                    }
                    default: {
                        break;
                    }
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            payload = "(empty)";
        }
        return {
            id: index,
            index: Number(n?.index),
            destination: `${n?.destination ?? ""}`,
            payload: `${payload}`,
            input: n ? { index: n.input.index, payload: inputPayload } : {},
            proof: null,
            executed: null,
        };
    }).sort((b: any, a: any) => {
        if (a.input.index === b.input.index) {
            return b.index - a.index;
        } else {
            return b.input.index - a.input.index;
        }
    });

    console.log(vouchers)
    console.log(data)
    console.log("voucherToExecute", voucherToExecute)

    // const forceUpdate = useForceUpdate();
    return (
        <div>
            <p></p>
            {/* <Button marginTop={'15px'} float={'right'} size='sm' onClick={() => reexecuteQuery({ requestPolicy: 'network-only' })}>
                Reload 🔃
            </Button> */}
            <div>
                {voucherToExecute ?
                    <div className="mb-10 mt-4"><Table>
                        <Thead>
                            <Tr>
                                <Th>V. Index</Th>
                                <Th>Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr key={`${voucherToExecute.input.index}-${voucherToExecute.index}`}>
                                <Td>{voucherToExecute.input.index}</Td>
                                {/*<Td>{voucherToExecute.destination}</Td> */}
                                <Td>
                                    <button className={`${(!voucherToExecute.proof || voucherToExecute.executed) ? "text-white bg-gray-900" : "text-black bg-white cursor-pointer"} px-3 py-1 rounded-lg`} disabled={!voucherToExecute.proof || voucherToExecute.executed} onClick={() => executeVoucher(voucherToExecute)}>{voucherToExecute.proof ? (voucherToExecute.executed ? "Voucher executed" : "Execute voucher") : "No proof yet"}</button>
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table></div> : <Text></Text>}
            </div>
            <TableContainer>
                <Table marginTop={'20px'} size="lg" width={"850px"}>
                    <Thead>
                        <Tr>
                            <Th>V. Index</Th>
                            <Th>Action</Th>
                            <Th>Payload</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {vouchers.length === 0 && (
                            <Tr>
                                <Td textAlign={'center'} colSpan={4}>-</Td>
                            </Tr>
                        )}
                        {vouchers.map((n: any, index: number) => (
                            <Tr key={`${n.input.index}-${n.index}`}>
                                {/*<Td>{n.input.index}</Td>
                            <Td>{n.index}</Td>
                            <Td>{n.destination}</Td> */}
                                <Td><p className="text-center">{n.input.index}</p></Td>
                                <Td>
                                    <button onClick={() => getProof(n)} className="text-black bg-white px-3 py-1 rounded-lg cursor-pointer">Info</button>
                                </Td>
                                {/* <td>{n.input.payload}</td> */}
                                <Td color={'grey'}>{n.payload}</Td>
                                {/* <td>
                                <button disabled={!!n.proof} onClick={() => executeVoucher(n)}>Execute voucher</button>
                            </td> */}
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

        </div>
    );
};
