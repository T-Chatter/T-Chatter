# T-Chatter

T-Chatter is a twitch chat client build with Electron and React.

- Website <a href="https://t-chatter.github.io/" target="_blank">https://t-chatter.github.io/</a>
- <a href="https://chrome.google.com/webstore/detail/t-chatter-browser-sync/mlfkjkbfangnegjijlfmemkbmngmfkei" target="_blank">T-Chatter Browser Sync</a> chrome extension.

<div>
  <img src="https://t-chatter.github.io/assets/T-Chatter_1.jpg" alt="T-Chatter logo" height="400" style="display: inline;" />
  <img src="https://t-chatter.github.io/assets/T-Chatter_3.jpg" alt="T-Chatter logo" height="400" style="display: inline;" />
  <img src="https://t-chatter.github.io/assets/T-Chatter_2.jpg" alt="T-Chatter logo" height="400" style="display: inline;" />
</div>

I started this project as a project for me to learn electron / react so if the application is buggy and the code is a huge spaghetti mess thats why...

## Download

You can download the installer <a href="https://t-chatter.github.io/" target="_blank">here</a> or go to the <a href="https://github.com/T-Chatter/T-Chatter/releases/latest" target="_blank">releases</a> page.

## Changes

The changelog is available [here](https://github.com/T-Chatter/T-Chatter/blob/dev/CHANGELOG.md).

## Building the application yourself.

### Available Scripts (`root`)

In the projects root directory, you can run:

### `start-dev.sh`

Will run npm start concurrently in `main` & `renderer` directory.\
You need to install [concurrently](https://www.npmjs.com/package/concurrently) globaly before running this.

### `build.sh`

Builds the react and electron projects to the `main/packages` folder.
It will create an installer and also a \*-unpacked folder with the app unpacked.

### `publish.sh`

Will run build.sh and then create the release as a draft on github.\
PAT is required to run this.

### Available Scripts (`renderer`)

In the `renderer` directory, you can run:

### `yarn start` / `npm start`

Runs the app in the development mode with hot reloading.

### `yarn test` / `npm run test`

Launches the test runner in the interactive watch mode.

### `yarn build` / `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### Available Scripts (`main`)

In the `main` directory, you can run:

### `yarn start` / `npm run start`

Runs the app in the development mode. Will also restart when a file change is detected.  
Make sure to run the start script for react first.

### `yarn electron` / `npm run electron`

Runs the app in the development mode.\
Make sure to run the start script for react first.

### `yarn build` / `npm run build`

Builds the electron projects to the `packages` folder.\
It will create an installer and also a `*-unpacked` folder with the app unpacked.

## Contributing

Pull requests are always welcome.

## License

[MIT](https://choosealicense.com/licenses/mit/)
