import {client} from "@/app/client";
import { ConnectButton } from "thirdweb/react";

const Landing = () => {
    return (
        <div>
            This is the Landing page
            <ConnectButton
                client={client}
                appMetadata={{
                    name: "Example App",
                    url: "https://example.com",
                }}
            />
        </div>
    )
}

export default Landing;