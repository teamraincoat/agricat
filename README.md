# Enrollment-app


**Requirements**

1. node 14.17.3
2. react-native-cli
3. cocoapods (ios) 1.11.2
4. docker desktop

Note: If you've not environment setup for React Native Application, you can set up by following this url in your local machine.
https://reactnative.dev/docs/environment-setup
  
**Instructions**

1. run `npm install` or `yarn install`
2. run `cd ios && pod install`
3. back to project folder and run `npm start` to start the package
4. open another terminal and run `react-native run-ios` or `react-native run-android` from VSCode or you can open project from xcode and android studio to run      application.
5. start developing

**Local Development Database**

1. run `docker compose up -d`
2. open `http://127.0.0.1:5984/_utils/` in the browser
3. login with username: `admin` and password `couchdb`
4. create a database names `enrollees`
