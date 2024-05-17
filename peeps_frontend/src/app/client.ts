import { createThirdwebClient } from "thirdweb";

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
export const baseClientId = process.env.NEXT_PUBLIC_TW_CLIENT_ID;

if (!baseClientId) {
  throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
  clientId: baseClientId,
});
