const http = require('http');
function post(path, data, token) {
  const body = JSON.stringify(data);
  const opts = {
    hostname: 'localhost',
    port: 4000,
    path,
    method: 'POST',
    headers: Object.assign({ 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }, token ? { Authorization: 'Bearer ' + token } : {})
  };
  return new Promise((resolve, reject) => {
    const req = http.request(opts, (res) => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(buf || '{}') }); } catch (e) { resolve({ status: res.statusCode, body: buf }); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}
(async () => {
  try {
    console.log('Logging in as admin...');
    const login = await post('/api/auth/login', { username: 'admin', password: 'pass123' });
    console.log('Login:', login.status, login.body && (login.body.token ? 'token ok' : JSON.stringify(login.body)));
    if (!login.body || !login.body.token) return process.exit(1);
    const token = login.body.token;

    console.log('Creating case...');
    const create = await post('/api/cases', { title: 'API Create Test', description: 'Testing create via script', priority: 'high', topic: 'network', tier: 'standard' }, token);
    console.log('Create response:', create.status, JSON.stringify(create.body, null, 2));
  } catch (e) {
    console.error('Error during API test:', e);
    process.exit(1);
  }
})();
