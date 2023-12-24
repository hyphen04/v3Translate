const app = require('../src/app');

module.exports = (req, res) => {
  const handler = app.getRequestHandler();
  handler(req, res);
};