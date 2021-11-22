const nano = require('nano')('http://admin:couchdb@127.0.0.1:5984');

const enrollees = nano.db.use('enrollees');

enrollees.insert({
  name: 'Bob',
  contact: 'The contact',
  address: 'The address',
})
.then(function (response) {
  console.log('Success!', response);
})
.catch(function(error) {
  console.error(error);
});
