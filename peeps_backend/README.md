# Peeps Backend

This is the backend repo for Peeps and contains all of the source code for Peeps. It uses node to execute the backend application.
The application entrypoint is the `src/index.js` file. It is bundled with [esbuild](https://esbuild.github.io), but any bundler can be used.

## Prerequisites

Before starting the Peeps backend, do ensure the following:

- Ensure that the frontend is up and running, the instructions on running the frontend is in the `peeps_frontend` folder.

- Ensure that you have installed Cartesi CLI, if not, run the command `npm i -g @cartesi/cli`. If you face any difficulty, refer to the [Cartesi documentation](https://docs.cartesi.io/cartesi-rollups/1.3/).

## Running Peeps Backend

- In the main Peeps folder, run the command, `cd peeps_backend`.

- Once you are in the backend folder, run the command `cartesi build`.

- Once the build is complete, run the command `cartesi run --epoch-duration 120`.

Upon completing the setup of the frontend and backend, you are closer to testing out the full functionalities of Peeps, you will need tokens for your wallet and to run the commands in the `deploy-custom-contracts` folder.
