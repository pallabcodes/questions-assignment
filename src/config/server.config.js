const http = require('http');
const https = require('https');
const fs = require('fs');

const USE_HTTPS = process.env.USE_HTTPS === 'true';
const SSL_CERT_PATH = process.env.SSL_CERT_PATH || '';
const SSL_KEY_PATH = process.env.SSL_KEY_PATH || '';

const createServer = (app) => {
  if (USE_HTTPS) {
    return https.createServer(
      {
        key: fs.readFileSync(SSL_KEY_PATH),
        cert: fs.readFileSync(SSL_CERT_PATH),
      },
      app
    );
  } else {
    return http.createServer(app);
  }
};

module.exports = createServer;
