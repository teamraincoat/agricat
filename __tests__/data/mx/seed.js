const fs = require('fs/promises');
const path = require('path');
const nano = require('nano')('http://admin:couchdb@127.0.0.1:5984');

const enrollees = nano.db.use('enrollees');

fs.readFile(path.join(__dirname, './enrollees.json'))
  .then(function (seed) {
    const seedEnrollees = JSON.parse(seed);
    return Promise.all(
      seedEnrollees.map(
        (enrollee) => enrollees.insert({ ...enrollee })
      )
    )
  })
  .then(function (response) {
    console.log('Success!', response);
  })
  .catch(function(error) {
    console.error(error);
  });
