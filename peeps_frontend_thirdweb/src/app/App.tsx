import Navbar from "@/app/components/Navbar";
import {UserLeft} from "@/app/components/UserLeft";
import {RightComponent} from "@/app/components/RightComponent";
import {useActiveWalletConnectionStatus} from "thirdweb/react";
import {MobileNavigation} from "@/app/components/MobileNavigation";
import Landing from "@/app/landing/page";

const App = ({children}: { children: React.ReactNode }) => {
    const walletStatus = useActiveWalletConnectionStatus();

    return (
        <div className="">
            {
                walletStatus === "connected" ?
                    <>
                        <section className="h-dvh overflow-y-auto">
                            <Navbar/>
                            <section className={"flex flex-col lg:grid lg:grid-cols-12 py-2 lg:py-8"}>
                                <section className={"lg:col-span-3"}>
                                    <UserLeft/>
                                </section>
                                <section className={"col-span-6 px-2 pb-16 lg:px-4 py-0"}>{children}</section>
                                <section className={"lg:col-span-3"}>
                                    <RightComponent/>
                                </section>
                            </section>
                        </section>
                        <MobileNavigation/>
                    </>
                    : <Landing/>
            }
        </div>
    );
};

export default App;
