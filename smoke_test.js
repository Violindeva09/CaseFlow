const http = require('http');

function httpRequest(path, method = 'GET', data = null, token = null) {
  const body = data ? JSON.stringify(data) : null;
  const opts = {
    hostname: 'localhost', port: 4000, path, method,
    headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {})
  };
  return new Promise((resolve, reject) => {
    const req = http.request(opts, (res) => {
      let buf = '';
      res.on('data', (c) => buf += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(buf || '{}') }); } catch (e) { resolve({ status: res.statusCode, body: buf }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

(async () => {
  try {
    console.log('Logging in...');
    const login = await httpRequest('/api/auth/login', 'POST', { username: 'admin', password: 'pass123' });
    if (!login.body || !login.body.token) throw new Error('Login failed: ' + JSON.stringify(login));
    console.log('Login OK');
    const token = login.body.token;

    console.log('Creating case...');
    const create = await httpRequest('/api/cases', 'POST', { title: 'Smoke Test Case', description: 'Created by smoke test', priority: 'low', topic: 'test', tier: 'standard' }, token);
    console.log('Create response:', create.body);

    console.log('Listing cases...');
    const list = await httpRequest('/api/cases', 'GET', null, token);
    const listBody = list.body;
    console.log('Cases count:', Array.isArray(listBody) ? listBody.length : 'unexpected response', 'sample:', (Array.isArray(listBody) && listBody[0]) || listBody);

    process.exit(0);
  } catch (err) {
    console.error('Smoke test error:', err);
    process.exit(1);
  }
})();
