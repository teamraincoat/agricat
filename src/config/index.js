import PouchDB from 'pouchdb-react-native';
import PouchAuth from 'pouchdb-authentication';

const localDB = new PouchDB('enrollees');
const remoteDB = new PouchDB('http://127.0.0.1:5984/enrollees', {skip_setup: true});
PouchDB.plugin(PouchAuth);

const syncStates = [
  'change',
  'paused',
  'active',
  'denied',
  'complete',
  'error',
];

remoteDB.login('admin', 'couchdb').then(function () {
  const sync = localDB.sync(remoteDB, {
    live: true,
    retry: true,
  });
  syncStates.forEach((state) => {
    sync.on(state, setCurrentState.bind(this, state));
    function setCurrentState(state) {
      console.log('[Sync:' + state + ']');
    }
  });
});

export default localDB;
