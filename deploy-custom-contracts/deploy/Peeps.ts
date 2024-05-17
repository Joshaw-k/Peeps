import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction, DeployOptions } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre;
    const { deployer } = await getNamedAccounts();

    const opts: DeployOptions = {
        from: deployer,
        deterministicDeployment: true,
        log: true,
    };

    await deployments.deploy("PEEPS", {
        ...opts,
        args: []
    });
};

export default func;
export const tags = ["PEEPS"];