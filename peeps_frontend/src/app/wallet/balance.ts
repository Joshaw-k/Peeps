// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.
"use client";
import React, { use, useEffect, useState } from "react";
import { ethers } from "ethers";
import configFile from "../config.json";
import { useActiveWalletChain, useActiveAccount } from "thirdweb/react";
import { usePeepsContext } from "../context";

const config: any = configFile;
interface Report {
  payload: string;
}

export const Balance = () => {
  const activeAccount = useActiveAccount();
  const chainId = useActiveWalletChain();
  const [balance, setBalance] = useState("0");
  const { updateWalletBalance } = usePeepsContext();

  const inspectCall = async (str: string) => {
    let payload = str;

    if (!chainId) {
      return;
    }

    let apiURL = "";

    if (config[chainId.id]?.inspectAPIURL) {
      apiURL = `${config[chainId.id].inspectAPIURL}`;
    } else {
      console.error(`No inspect interface defined for chain ${chainId.id}`);
      return;
    }

    let fetchData: Promise<Response>;
    if (apiURL && payload) {
      fetch(`${apiURL}/${payload}`)
        .then((response) => response.json())
        .then((data) => {
          // console.log("balance before decode", data);
          // Decode payload from each report
          const decode = data.reports.map((report: Report) => {
            return ethers.utils.toUtf8String(report.payload);
          });
          // console.log("Decoded Reports:", decode);
          const reportData = JSON.parse(decode);
          // console.log("Report data erc20: ", typeof reportData.erc20)
          // console.log("Report data: ", reportData)
          setBalance(
            reportData.erc20.length > 0
              ? ethers.utils.formatEther(reportData.erc20[0][1]).toString()
              : "0"
          );
          updateWalletBalance(
            reportData.erc20.length > 0
              ? ethers.utils.formatEther(reportData.erc20[0][1]).toString()
              : "0"
          );
          // console.log("Ether : ", reportData.ether)
          console.log("Erc20 : ", reportData.erc20);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  if (activeAccount) {
    const getBalance = async () => {
      await inspectCall(
        `balance/${activeAccount.address ? activeAccount.address : ""}`
      );
    };
    getBalance();
  }

  return balance;
};
