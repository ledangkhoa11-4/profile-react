## Locale files:
In the `public` directory, we have 2 files source for the translate: 
- `locale_en.js` for English
- `locale_vn.js` for Vietnamese
Depend on which language that user selected, the server side will place the locale source in the `<head>` tag 

## Run and build:
First we need to install the dependencies: run on commandline `npm install` or `yarn`.

- To run project for development: `npm start` or `yarn start` ( config env webpack.config.dev.js )
- To build project for development: `npm run build:test` or `yarn build:test` ( config env webpack.config.test.js )
- To build project for production: `npm build` or `yarn build` ( config env webpack.config.prod.js )

## Deploy:
On local PC
- Config env in file weback
- First you need to build source code (see above step)
- Copy `profile`, `bundle.js` from the `build` directory.
And paste them into `/api/public` directory
- Copy the content of `locale_en.js`, `locale_vn.js` from the `public` directory. And paste the coresponding content into the `default.js`, `en.js`, `vi.js` in `/api/public/locale`.
- Then you need to push code into git server. And pull it on the remote server.