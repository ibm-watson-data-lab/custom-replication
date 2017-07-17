const filtername = function(name) {
  return name.toLowerCase().replace(/[^a-z]/g, '');
};

const filterDoc = function(doc) {
  delete doc.stops;
  delete doc.driver;
  delete doc.vehicle;
  return doc;
};

const main = function(opts) {

  // incoming credentials
  if (!opts.host || !opts.username || !opts.password || !opts.dbname || !opts.id) {
    return new Error('Missing default parameter');
  }

  // cloudant connections
  const cloudant = require('cloudant');
  var conn = { 
    account: opts.host, 
    username: opts.username, 
    password: opts.password, 
    plugin: 'promises'
  };
  const mycloudant = cloudant(conn);
  const masterdb = mycloudant.db.use(opts.dbname);
  var startdb = null;
  var enddb = null;

  // doc
  var newdoc = null;
  const stub = 'busstation_';

  // load the doc that has changed
  return masterdb.get(opts.id).then(function(doc) {

    // connect to start & end databases
    startdb = mycloudant.db.use(stub + filtername(doc.start));
    enddb = mycloudant.db.use(stub + filtername(doc.end));
    
    // remove unwanted data from the doc
    newdoc = filterDoc(doc);

    // write to start and destination databases in parallel
    return Promise.all([
      startdb.bulk({ docs: [newdoc], new_edits: false}),
      enddb.bulk({ docs: [newdoc], new_edits: false})
    ]);
  }).then(function(response) {
    return {ok: true};
  });
};

exports.main = main;