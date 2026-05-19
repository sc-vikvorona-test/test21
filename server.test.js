const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('./server');

describe('GET /api/hello', () => {
  let server;
  let port;

  before(() => new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      port = server.address().port;
      resolve();
    });
  }));

  after(() => new Promise((resolve) => {
    server.close(resolve);
  }));

  it('returns 200 with correct JSON shape', () => new Promise((resolve, reject) => {
    http.get(`http://localhost:${port}/api/hello`, (res) => {
      assert.equal(res.statusCode, 200);
      assert.match(res.headers['content-type'], /application\/json/);

      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          assert.equal(data.message, 'Hello World');
          assert.equal(data.version, '1.0.0');
          assert.match(data.timestamp, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  }));
});
