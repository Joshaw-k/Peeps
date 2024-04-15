# JavaScript DApp Template

This is a template for JavaScript Cartesi DApps. It uses node to execute the backend application.
The application entrypoint is the `src/index.js` file. It is bundled with [esbuild](https://esbuild.github.io), but any bundler can be used.

To run the Peeps DApp, `sunodo` is a requirement, you can install `sunodo` using this guide: https://docs.sunodo.io/guide/introduction/installing

To Build:
```bash
sunodo build
```

To Run:
```bash
sunodo run
```

To interact with it refer to the `peep_frontend` directory of this same repository.