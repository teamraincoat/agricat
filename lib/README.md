Method to Use Native NodeJS crypto Module
-----------------------------------------

`./crypto.js` is a generated file that bundles the native node crypto module into polyfills.

Do not use this file directly in components, it is meant to just be imported by `utils.crypto` module.

Steps:
1. Install browserify
2. Run in lib directory: browserify crypto-in.js -o crypto.js
3. Find and replace the word `require` with `replacedRequire` in crypto.js
4. Add `var crypto;` at top of crypto.js
5. Move `module.exports` to bottom of file, outside of closure
6. Change `var crypto = require("crypto");` to `crypto = replacedRequire("crypto");`

Ref: https://hackernoon.com/using-core-node-js-modules-in-react-native-apps-64acd4d07140