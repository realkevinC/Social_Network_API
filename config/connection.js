const { connect, connection } = require('mongoose');

connect('mongodb://localhost/Social Network API', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;