"use client";

import { useConnectWallet } from "@web3-onboard/react";

const Wallet = () => {
  const [{ wallet }] = useConnectWallet();

  console.log(wallet?.accounts[0]);
  console.log(wallet?.accounts[0].balance?.keys);
  if (!wallet || wallet?.accounts.length < 1) {
    return <section>Connect wallet first - Bounce animation</section>;
  }

  return (
    <section>
      This is the wallet page
      <div>Address: {wallet?.accounts[0].address}</div>
      {wallet?.accounts.length > 0 && (
        <>
          <div>
            Balance:{" "}
            {wallet?.accounts.length > 0 &&
              Object.values(wallet?.accounts[0]?.balance)}
          </div>
          <div>
            Token NAME:{" "}
            {wallet?.accounts.length > 0 &&
              Object.keys(wallet?.accounts[0]?.balance)}
          </div>
        </>
      )}
    </section>
  );
};

export default Wallet;
